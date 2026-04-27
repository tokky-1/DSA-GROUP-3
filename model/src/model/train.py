import joblib
from pathlib import Path

from model.preprocess import load_data, preprocess


SAVE_PATH = Path(__file__).parents[3] / "saved_models" / "model.joblib"


def train():
    # load and preprocess data
    # df = load_data("model/data/raw/data.csv")
    # df = preprocess(df)

    # define and fit your model here
    # model = ...
    # model.fit(X_train, y_train)

    # save model artifact
    # SAVE_PATH.parent.mkdir(parents=True, exist_ok=True)
    # joblib.dump(model, SAVE_PATH)
    # print(f"Model saved to {SAVE_PATH}")
    pass


if __name__ == "__main__":
    train()
