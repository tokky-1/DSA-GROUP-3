import joblib
from pathlib import Path


MODEL_PATH = Path(__file__).parents[3] / "saved_models" / "model.joblib"


def load_model():
    return joblib.load(MODEL_PATH)


def predict(inputs):
    model = load_model()
    return model.predict(inputs)
