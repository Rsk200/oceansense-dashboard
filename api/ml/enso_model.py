from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np

from api.config import ENSO_MODEL_DIR, FORECAST_H, REQUIRE_ARTIFACTS


class MissingArtifactError(RuntimeError):
    pass


@dataclass
class EnsoModel:
    xg_model: object
    last_input: np.ndarray
    last_time: str | None = None

    @classmethod
    def load(cls, model_dir: Path = ENSO_MODEL_DIR) -> "EnsoModel | None":
        required = {
            "xg_model": model_dir / "xg_model.joblib",
            "last_input": model_dir / "last_input.npy",
        }
        missing = [str(path) for path in required.values() if not path.exists()]
        if missing:
            if REQUIRE_ARTIFACTS:
                raise MissingArtifactError("Missing ENSO artifacts: " + ", ".join(missing))
            return None

        xg_model = joblib.load(required["xg_model"])
        last_input = np.load(required["last_input"])
        last_time_path = model_dir / "last_time.txt"
        last_time = last_time_path.read_text(encoding="utf-8").strip() if last_time_path.exists() else None
        if last_input.shape != (1, 240):
            raise ValueError(f"Expected last_input.npy shape (1, 240), got {last_input.shape}")
        return cls(xg_model=xg_model, last_input=last_input.astype(np.float32), last_time=last_time)

    def predict_recursive(self, horizon: int = FORECAST_H) -> list[float]:
        window = self.last_input.copy()
        predictions: list[float] = []
        for _ in range(horizon):
            pred = float(self.xg_model.predict(window)[0])
            predictions.append(pred)
            window = np.roll(window, -1)
            window[0, -1] = pred
        return predictions

    def forecast_months(self, horizon: int = FORECAST_H, forecast_year: int | None = None) -> list[str]:
        import pandas as pd

        if self.last_time:
            start = pd.Timestamp(self.last_time).replace(day=1)
        else:
            start = pd.Timestamp.utcnow().normalize().replace(day=1)
        months = [(start + pd.DateOffset(months=i + 1)).strftime("%Y-%m") for i in range(horizon)]
        if forecast_year is not None:
            months = [month for month in months if month.startswith(f"{forecast_year}-")]
        return months[:FORECAST_H]


def scenario_values(values: list[float]) -> list[float]:
    if len(values) != FORECAST_H:
        raise ValueError(f"Expected {FORECAST_H} ENSO values")
    return [float(v) for v in values]
