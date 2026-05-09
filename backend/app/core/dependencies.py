import uuid
import shutil
from pathlib import Path
from typing import Annotated

from fastapi import Depends, HTTPException, UploadFile, status

from app.core.config import Settings, get_settings

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
}


def validate_images(
    images: list[UploadFile],
    settings: Annotated[Settings, Depends(get_settings)],
) -> list[UploadFile]:
    """
    Validates a list of uploaded image files.
    Checks count limits, MIME types, and individual file sizes.
    Intended to be used as a FastAPI dependency in conversion routes.
    """
    if not images:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least one image is required.",
        )

    if len(images) > settings.max_images_per_request:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Too many images. Maximum allowed per request is {settings.max_images_per_request}.",
        )

    for img in images:
        if img.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported file type '{img.content_type}' for '{img.filename}'. "
                       f"Accepted types: {', '.join(sorted(ALLOWED_IMAGE_TYPES))}.",
            )

        # UploadFile exposes size when the request body is fully read.
        # Guard against excessively large individual files.
        if img.size and img.size > settings.max_upload_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"'{img.filename}' exceeds the {settings.max_upload_size_mb} MB size limit.",
            )

    return images


class JobTempDir:
    """
    Context manager that creates an isolated temporary directory for a
    single conversion job and removes it when the job is finished.

    Usage inside a route:
        async with JobTempDir(settings) as job_dir:
            ...write files to job_dir...
    """

    def __init__(self, settings: Settings) -> None:
        self.base = Path(settings.temp_dir)
        self.path: Path | None = None

    def __enter__(self) -> Path:
        job_id = uuid.uuid4().hex
        self.path = self.base / job_id
        self.path.mkdir(parents=True, exist_ok=True)
        return self.path

    def __exit__(self, *_) -> None:
        if self.path and self.path.exists():
            shutil.rmtree(self.path, ignore_errors=True)

    # Async variants so the manager works in async routes too
    async def __aenter__(self) -> Path:
        return self.__enter__()

    async def __aexit__(self, *args) -> None:
        self.__exit__(*args)


def get_job_temp_dir(
    settings: Annotated[Settings, Depends(get_settings)],
) -> JobTempDir:
    """FastAPI dependency that provides a JobTempDir bound to current settings."""
    return JobTempDir(settings)
