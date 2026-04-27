# Backend — FastAPI

The backend is a [FastAPI](https://fastapi.tiangolo.com/) application that exposes the ML model via a REST API. It imports directly from the `model` package using uv workspace linking.

---

## Folder Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/       # FastAPI route definitions (one file per domain)
│   ├── core/             # App config, settings, security utilities
│   ├── schemas/          # Pydantic models for request and response validation
│   ├── services/         # Business logic — orchestrates model inference and data handling
│   └── main.py           # FastAPI app entry point, middleware, router registration
├── .env.example          # Template for environment variables
├── pyproject.toml        # Backend package definition and dependencies
└── README.md
```

---

## Prerequisites

- Python >= 3.11
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- uv workspace synced from the project root (see root README)

---

## Installation

From the **project root**, sync the workspace (installs backend + model together):
```bash
uv sync
```

Or install backend dependencies only (without workspace linking):
```bash
cd backend
uv pip install -e .
```

---

## Environment Variables

Copy the example file and fill in values:
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `APP_ENV` | `development` or `production` |
| `APP_HOST` | Host to bind (default `0.0.0.0`) |
| `APP_PORT` | Port to bind (default `8000`) |
| `SECRET_KEY` | Secret key for signing tokens |
| `MODEL_PATH` | Path to the saved model artifacts directory |

---

## Running Individually

From the **backend/** directory:
```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or from the project root:
```bash
uv run --package backend uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- Base URL: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- OpenAPI schema: http://localhost:8000/openapi.json

---

## Adding Routes

Create a new file in `app/api/routes/`, define an `APIRouter`, then register it in `app/main.py`:
```python
from app.api.routes import your_router
app.include_router(your_router, prefix="/your-prefix")
```
