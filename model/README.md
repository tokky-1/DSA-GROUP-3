# Model

The `model` folder is a self-contained Python package that handles all machine learning concerns: data preprocessing, training, evaluation, and inference. It is installed as a uv workspace member so the backend can import from it directly.

---

## Folder Structure

```
model/
├── data/
│   ├── raw/              # Original, unmodified datasets
│   └── processed/        # Cleaned and transformed data ready for training
├── notebooks/            # Exploratory data analysis and experimentation
├── src/
│   └── model/            # Importable Python package
│       ├── __init__.py
│       ├── preprocess.py # Data loading and transformation logic
│       ├── train.py      # Model training entry point
│       ├── evaluate.py   # Evaluation metrics and reporting
│       └── predict.py    # Loads saved model and runs inference
├── saved_models/         # Serialized model artifacts (e.g. .joblib, .pkl, .onnx)
├── configs/
│   └── config.yml        # Hyperparameters and training configuration
├── environment.yml       # Conda environment (Python, GPU/CUDA, system deps)
├── pyproject.toml        # uv package definition
└── README.md
```

---

## Prerequisites

- [conda / miniconda](https://docs.conda.io/en/latest/miniconda.html)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)

---

## Installation

### Step 1 — Create and activate the conda environment

The conda environment installs Python and any system-level dependencies (e.g. GPU/CUDA libraries).

```bash
conda env create -f model/environment.yml
conda activate ml-env
```

### Step 2 — Install Python packages with uv

From the **project root**, sync the full workspace (installs model + backend together):
```bash
uv sync
```

To install the model package in isolation:
```bash
cd model
uv pip install -e .
```

---

## Training the Model

Run training from the project root:
```bash
make train
```

Or directly:
```bash
uv run python -m model.train
```

The trained artifact will be saved to `model/saved_models/model.joblib`.

---

## Running Inference Standalone

```python
from model.predict import predict

result = predict(your_input_data)
```

---

## Configuration

Edit `configs/config.yml` to change hyperparameters, paths, or training settings. The training script reads from this file automatically.

---

## How the Backend Uses This Package

The backend declares `model` as a workspace dependency in its `pyproject.toml`. After `uv sync`, it can import directly:

```python
from model.predict import predict
```

No manual path manipulation needed — uv handles the linking.
