# Invoice OCR Document Scanner
### Project Specification & Team Handbook

*Version 2.0 — Based on Official Project Brief*

| | |
|---|---|
| **Platform** | Web (Browser) — REST API via FastAPI |
| **Document Domain** | Invoices (vendor name, date, amounts, line items, invoice number) |
| **Frameworks** | PyTorch + spaCy + Hugging Face Transformers |
| **Python Version** | 3.10+ (as specified in the official project brief) |
| **Team Size** | 5 members (1 Team Lead + 4 contributors) |
| **Dev Environment** | VSCode + GitHub + Google Colab (GPU runs) |

---

## 1. Purpose of This Document

This document is the single source of truth for the Invoice OCR Document Scanner project. It is built directly from the official project brief and captures all architectural decisions, team responsibilities, build sequencing, and submission requirements. All team members must read this before the first Monday session.

---

## 2. What We Are Building

A web-based document scanner that accepts a raw photograph or scanned image of an invoice, processes it through a 6-stage pipeline, extracts all text using two OCR engines, and applies an NLP layer to identify and structure key invoice fields. The final output is a JSON object exposed through a FastAPI REST endpoint.

### 2.1 Document Domain: Invoices

The NLP intelligence layer is tailored specifically for invoices. It will extract the following fields from every processed document:

- Vendor / supplier name
- Invoice number
- Invoice date and due date
- Line items: description, quantity, and unit price
- Subtotal, tax amount, and total

> **NOTE:** Domain focus is deliberate. The NLP layer is worth 20% of your grade. A generic system with no tailored extraction logic will score poorly on this criterion.

---

## 3. Pipeline Architecture — 6 Mandatory Stages

All 6 stages are mandatory and account for 25% of your grade for completeness alone. Each stage receives the output of the previous stage and must be tested independently before integration.

| # | Stage | Description | Key Libraries |
|---|---|---|---|
| 1 | Image Input | Accept file paths, URLs, base64 strings, PDF uploads. Validate and normalise all inputs to OpenCV-compatible format. | Pillow, pdf2image, PyMuPDF |
| 2 | Preprocessing | Convert to grayscale, apply denoising, run adaptive thresholding, correct skew. HIGHEST IMPACT on OCR accuracy. | OpenCV, scikit-image, numpy |
| 3 | Perspective Correction | Detect document edges using Canny, find contour, apply four-point perspective transform to flatten the document. | OpenCV, imutils |
| 4 | OCR Extraction | Run Tesseract first then EasyOCR. Extract text, bounding boxes, and confidence scores per word. | pytesseract, easyocr |
| 5 | NLP Intelligence | Classify document type, extract named entities and key-value pairs specific to invoices. | spaCy, transformers |
| 6 | Structured Output | Serialise results to JSON. Expose full pipeline via FastAPI `/scan` endpoint. | FastAPI, uvicorn, SQLAlchemy |

> **WARNING:** Do NOT attempt the NLP stage until OCR output is stable and tested. Building NLP on unstable input wastes time and produces unreliable results.

---

## 4. Team Structure & Stage Ownership

Stage ownership to be finalised at the first Monday session. Team Lead owns Stage 6 and fills the remaining gap after volunteers are assigned.

| Stage | Owner | Blocked By | Can Start Immediately With |
|---|---|---|---|
| 1 — Image Input | TBD | Nothing — start immediately | Build loader for file, URL, base64, and PDF inputs |
| 2 — Preprocessing | TBD | Stage 1 output | Research and prototype grayscale, thresholding, deskew |
| 3 — Perspective Correction | TBD | Stage 2 output | Study four-point transform with OpenCV imutils |
| 4 — OCR Extraction | TBD (also owns test dataset) | Stage 3 output | Install and test Tesseract + EasyOCR independently on sample images |
| 5 — NLP Intelligence | TBD | Stage 4 stable output | Map invoice fields, practise spaCy NER on sample invoice text |
| 6 — Structured Output + API | Team Lead | All other stages | Define JSON output schema with NLP person early |

> **NOTE:** The NLP person is blocked the longest. They must be assigned invoice field research and spaCy practice immediately. They can also collaborate with the Team Lead early to define the JSON output schema.

---

## 5. Recommended Build Sequence

Follow this order strictly. Do not skip ahead or attempt integration before individual stages are tested.

1. Set up virtual environment and install all dependencies
2. Build the image loader to handle file, URL, base64, and PDF inputs
3. Implement and tune preprocessing — test heavily, this stage determines OCR quality
4. Add perspective correction and verify it handles angled photos correctly
5. Integrate Tesseract first (simpler), then add EasyOCR as the stronger alternative
6. Build the NLP layer on confirmed, stable OCR output only
7. Wrap everything in FastAPI and test end-to-end with real invoice images

---

## 6. Environment Setup

### 6.1 Python Version

Python 3.10+ as specified in the project brief. Use 3.10 to maintain compatibility across local machines and Google Colab.

### 6.2 Virtual Environment

Every team member runs these exact commands before installing any libraries:

```bash
python -m venv ocr-env

ocr-env\Scripts\activate       # Windows
source ocr-env/bin/activate    # Mac / Linux

pip install -r requirements.txt
```

### 6.3 Full requirements.txt

| Library | Purpose | Pipeline Stage |
|---|---|---|
| opencv-python | Core image processing: grayscale, thresholding, edge detection, perspective transforms | 2, 3 |
| Pillow | Image I/O and format conversion | 1 |
| scikit-image | Advanced denoising and morphological operations | 2 |
| numpy | Array operations on image matrices | 2, 3 |
| imutils | Geometry helpers: contour sorting, four-point transforms, resizing | 3 |
| pdf2image | Converts PDF pages to PIL images at configurable DPI | 1 |
| pymupdf | Detects native vs scanned PDF, renders pages at 300 DPI | 1 |
| pytesseract | Python wrapper for Google Tesseract OCR engine | 4 |
| easyocr | Deep learning OCR, better on difficult documents and varied fonts | 4 |
| spacy | Named Entity Recognition, tokenization, dependency parsing | 5 |
| transformers | Hugging Face pre-trained models for advanced NER and classification | 5 |
| torch | PyTorch — required backend for EasyOCR and Hugging Face Transformers | 4, 5 |
| fastapi | REST API framework for the `/scan` endpoint | 6 |
| uvicorn | ASGI web server for running FastAPI | 6 |
| sqlalchemy | ORM for persisting extracted document records to SQLite or PostgreSQL | 6 |
| python-dotenv | Manages environment variables via a `.env` file | 6 |

> **IMPORTANT:** Tesseract is NOT installed via pip. It requires a separate system binary installation.
> - **Windows:** Download from [github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki) and add to your system PATH.
> - **Ubuntu:** `sudo apt install tesseract-ocr`
> - **macOS:** `brew install tesseract`

---

## 7. Project Folder Structure

All team members must use this structure. Do not create files outside of it without Team Lead approval.

```
project/
├── src/
│   ├── stage1_input/        ← image loader module
│   ├── stage2_preprocess/   ← grayscale, threshold, deskew
│   ├── stage3_perspective/  ← edge detection, four-point transform
│   ├── stage4_ocr/          ← Tesseract + EasyOCR integration
│   ├── stage5_nlp/          ← spaCy entity extraction
│   └── stage6_output/       ← JSON serialisation + FastAPI
├── datasets/
│   ├── raw/                 ← original invoice images
│   └── test/                ← 10+ test images with expected outputs
├── notebooks/               ← Jupyter/Colab experimentation
├── logs/                    ← pipeline run logs
├── config/                  ← settings and .env template
├── requirements.txt
└── README.md                ← setup instructions for Windows, Mac, Linux
```

---

## 8. OCR Engine Strategy

### 8.1 Two-Engine Approach

| Engine | Strength | Weakness | Role |
|---|---|---|---|
| Tesseract | Fast, reliable on clean printed text | Struggles with noise, varied fonts, stamps | Primary — run first |
| EasyOCR | Deep learning, handles difficult documents | Slower | Secondary — stronger alternative |

### 8.2 Confidence Score Handling

- Words below a defined confidence threshold (e.g. 60%) are flagged in the output
- Flagged fields are marked as unverified in the JSON for human review
- Numeric invoice fields are cross-checked for mathematical consistency (line items should sum to total)

---

## 9. NLP Intelligence Strategy

### 9.1 Invoice Fields to Extract

| Field | Entity Type | Example |
|---|---|---|
| Vendor name | ORG | Acme Supplies Ltd |
| Invoice number | Custom regex pattern | INV-2024-00123 |
| Invoice date | DATE | 15 March 2024 |
| Due date | DATE | 15 April 2024 |
| Line items | Custom extraction | Web Design x1 — £1,200.00 |
| Total amount | MONEY | £1,560.00 |

### 9.2 Tools

- **spaCy** (`en_core_web_sm`) — standard named entities: dates, organisations, monetary values
- **Regex patterns** — structured fields like invoice numbers and line item formats
- **Hugging Face Transformers** — optional for document classification

---

## 10. Submission Deliverables

> **All four deliverables are mandatory. Missing any one will cost marks regardless of code quality.**

| Deliverable | Requirement | Owner |
|---|---|---|
| Source Code | Public GitHub repo with README covering install and run steps for all OS | Team Lead |
| Demo | Live or recorded video — minimum 5 minutes — showing 3+ real invoices processed end-to-end | All team |
| Project Report | Min 1,500 words: architecture decisions, challenges, OCR accuracy results, NLP implementation | All team |
| Test Dataset | 10+ real invoice images with varying lighting, angles, layouts, and expected outputs for each | OCR person (Stage 4) |

> **NOTE:** The project report cannot be written the night before. Assign sections to team members from week one and build it incrementally.

---

## 11. Assessment Criteria

| Criterion | Weight | Key Risk |
|---|---|---|
| Pipeline completeness — all 6 stages functional | 25% | Any broken stage risks losing this entirely |
| OCR accuracy on test documents | 20% | Depends almost entirely on preprocessing quality |
| NLP intelligence — entity and field extraction quality | 20% | Generic systems with no domain tailoring score poorly |
| Code quality — modularity, naming, error handling, docs | 15% | Affects everyone — enforced by Team Lead in code review |
| API implementation — clean endpoints, status codes, validation | 10% | Team Lead responsibility — Stage 6 |
| Project report — clarity, depth, honest self-assessment | 10% | Cannot be rushed — must be built throughout the project |

---

## 12. Git & Collaboration

### 12.1 Weekly Schedule

| Day | Mode | Focus |
|---|---|---|
| Monday | Physical | Hands-on building, pair programming, debugging together |
| Tuesday | Physical | Integration day — merge branches, test stage connections |
| Wednesday | Physical | Review progress, resolve blockers, plan ahead |
| Thursday | Online | Short sync — progress check, no heavy coding |
| Saturday 10pm | Online | End of week review — demo what was built, plan next week |

### 12.2 Git Rules

- Never commit directly to the main branch
- Create a branch per stage: `feature/stage2-preprocessing`
- Write clear commit messages describing what changed and why
- Open a pull request and get at least one review before merging
- Pull from main before starting any new work to avoid conflicts
- Never commit large image files or model weights to GitHub — use Google Drive

### 12.3 First Monday Session Goal

Every team member must leave having opened their first pull request. Steps:

1. Team Lead creates GitHub repo and pushes folder structure + README before the session
2. Everyone clones the repo
3. Everyone creates a branch: `feature/[name]-setup`
4. Everyone adds their name to `CONTRIBUTORS.md`
5. Everyone opens a pull request

---

## 13. Open Questions — Resolve at First Meeting

- Who owns each pipeline stage? (assign from volunteers)
- Which invoice fields are highest priority for the NLP layer?
- What confidence score threshold will flag uncertain OCR words?
- What is the model checkpoint versioning convention?
- Who writes which section of the project report?
- Live demo in class or recorded video?

---

*Version 2.0 supersedes Version 1.0. Update version number as decisions are finalised.*