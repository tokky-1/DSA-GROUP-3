from __future__ import annotations

import asyncio
from pathlib import Path

import numpy as np

from app.core.config import SETTINGS
from app.services.file_creation import create_file
from app.services.handwriting_detection import run_ocr
from app.services.image_processing import process_document
from app.services.line_detection import get_crops_for_image


async def _emit(
    queue: asyncio.Queue,
    step: str,
    label: str,
    percentage: int,
    status: str = "running",
) -> None:
    await queue.put(
        {"step": step, "label": label, "percentage": percentage, "status": status}
    )


class BaseConversion:
    """
    Shared pipeline steps for both conversion modes.

    images_data: list of (original_filename, raw_bytes) tuples
    output_format: "txt" | "pdf" | "doc"
    job_dir: isolated temp directory for this job
    """

    def __init__(
        self,
        images_data: list[tuple[str, bytes]],
        output_format: str,
        job_dir: Path,
    ) -> None:
        self.images_data = images_data
        self.output_format = output_format
        self.job_dir = job_dir
        self._saved_paths: list[Path] = []

    # ── sync helpers — all run in a thread pool via asyncio.to_thread ─────────

    def _save_uploads(self) -> None:
        uploads = self.job_dir / "uploads"
        uploads.mkdir(exist_ok=True)
        for i, (filename, data) in enumerate(self.images_data):
            ext = Path(filename).suffix or ".jpg"
            path = uploads / f"{i:03d}{ext}"
            path.write_bytes(data)
            self._saved_paths.append(path)

    def _process_images(self) -> list[np.ndarray]:
        """De-skew, normalize lighting, and binarize every uploaded image."""
        return [process_document(str(p)) for p in self._saved_paths]

    def _detect_lines(
        self, clean_images: list[np.ndarray]
    ) -> list[list]:
        """Run YOLO on each cleaned image and return per-image crop lists."""
        return [get_crops_for_image(img) for img in clean_images]

    def _run_ocr(self, all_crops: list[list]) -> list[str]:
        """
        For each image's crop list run TrOCR on every line crop,
        then join the lines with newlines to form one page of text.
        Returns one string per image.
        """
        pages: list[str] = []
        for crops in all_crops:
            lines = [run_ocr(np.array(crop)) for crop in crops]
            pages.append("\n".join(lines))
        return pages

    def _apply_nlp(self, pages: list[str]) -> list[str]:
        """Post-process with Ollama if an API key is configured."""
        if not SETTINGS.ollama_api_key:
            return pages
        from app.services.nlp_layer import ollama_nlp_layer
        return [ollama_nlp_layer(p) for p in pages]

    def _output_path(self, stem: str) -> Path:
        ext = "docx" if self.output_format == "doc" else self.output_format
        return self.job_dir / f"{stem}.{ext}"

    # ── async orchestration ───────────────────────────────────────────────────

    async def run(self, queue: asyncio.Queue) -> list[Path]:
        raise NotImplementedError


class SingleDocConversion(BaseConversion):
    """
    Each uploaded image becomes its own independent document.
    Returns one output file per image.
    """

    async def run(self, queue: asyncio.Queue) -> list[Path]:
        await _emit(queue, "uploading", "Saving uploaded images", 5)
        await asyncio.to_thread(self._save_uploads)

        await _emit(queue, "processing", "Pre-processing images", 20)
        clean_images = await asyncio.to_thread(self._process_images)

        await _emit(queue, "lines", "Detecting text lines", 45)
        all_crops = await asyncio.to_thread(self._detect_lines, clean_images)

        await _emit(queue, "ocr", "Reading handwriting", 70)
        pages = await asyncio.to_thread(self._run_ocr, all_crops)

        await _emit(queue, "nlp", "Polishing text", 85)
        polished = await asyncio.to_thread(self._apply_nlp, pages)

        await _emit(queue, "creating", "Creating output files", 95)
        output_files = await asyncio.to_thread(self._write_files, polished)

        return output_files

    def _write_files(self, pages: list[str]) -> list[Path]:
        results = []
        for i, text in enumerate(pages):
            path = self._output_path(f"document_{i + 1:03d}")
            create_file([text], self.output_format, path)
            results.append(path)
        return results


class MultiPageConversion(BaseConversion):
    """
    All uploaded images are treated as consecutive pages of one document.
    Returns a single multi-page output file.
    """

    async def run(self, queue: asyncio.Queue) -> list[Path]:
        await _emit(queue, "uploading", "Saving uploaded images", 5)
        await asyncio.to_thread(self._save_uploads)

        await _emit(queue, "processing", "Pre-processing images", 20)
        clean_images = await asyncio.to_thread(self._process_images)

        await _emit(queue, "lines", "Detecting text lines", 45)
        all_crops = await asyncio.to_thread(self._detect_lines, clean_images)

        await _emit(queue, "ocr", "Reading handwriting", 70)
        pages = await asyncio.to_thread(self._run_ocr, all_crops)

        await _emit(queue, "nlp", "Polishing text", 85)
        polished = await asyncio.to_thread(self._apply_nlp, pages)

        await _emit(queue, "creating", "Creating output file", 95)
        output_path = await asyncio.to_thread(self._write_file, polished)

        return [output_path]

    def _write_file(self, pages: list[str]) -> Path:
        path = self._output_path("output")
        create_file(pages, self.output_format, path)
        return path
