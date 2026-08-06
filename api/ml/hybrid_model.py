from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import torch
from torch import nn

from api.config import (
    DROPOUT,
    FEATURES_HYBRID,
    FORECAST_H,
    LSTM_HIDDEN,
    LSTM_LAYERS,
    MODELS_DIR,
    REQUIRE_ARTIFACTS,
    SEQ_LEN,
    STATION_DIRS,
    STATIONS,
    TARGET,
    WATER_MODEL_DIR,
    XGB_CLIMATE_FEATS,
    risk_for_value,
)
from api.ml.enso_model import MissingArtifactError


class AttentionLayer(nn.Module):
    def __init__(self, hidden_size: int) -> None:
        super().__init__()
        self.W = nn.Linear(hidden_size, hidden_size)
        self.v = nn.Linear(hidden_size, 1, bias=False)

    def forward(self, lstm_out: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        energy = torch.tanh(self.W(lstm_out))
        scores = torch.softmax(self.v(energy), dim=1)
        context = (scores * lstm_out).sum(dim=1)
        return context, scores.squeeze(-1)


class XGBoostLSTMHybrid(nn.Module):
    def __init__(self, n_features: int, xgb_dim: int = 1) -> None:
        super().__init__()
        self.lstm = nn.LSTM(
            n_features,
            LSTM_HIDDEN,
            num_layers=LSTM_LAYERS,
            batch_first=True,
            dropout=DROPOUT,
            bidirectional=True,
        )
        self.attn = AttentionLayer(LSTM_HIDDEN * 2)
        fused_dim = LSTM_HIDDEN * 2 + xgb_dim
        self.bn = nn.BatchNorm1d(fused_dim)
        self.fc1 = nn.Linear(fused_dim, 64)
        self.act = nn.GELU()
        self.drop = nn.Dropout(0.2)
        self.fc2 = nn.Linear(64, 1)

    def forward(self, x_seq: torch.Tensor, x_xgb: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        out, _ = self.lstm(x_seq)
        ctx, atw = self.attn(out)
        fused = torch.cat([ctx, x_xgb], dim=1)
        fused = self.bn(fused)
        out = self.fc2(self.drop(self.act(self.fc1(fused))))
        return out, atw


@dataclass
class StationArtifacts:
    model: XGBoostLSTMHybrid
    x_scaler: object
    y_scaler: object
    xgb_sub: object
    history: pd.DataFrame
    rmse: float


class HybridForecastService:
    def __init__(self, stations: dict[str, StationArtifacts]) -> None:
        self.stations = stations

    @classmethod
    def load(cls) -> "HybridForecastService | None":
        rmse_path = MODELS_DIR / "rmse.json"
        missing: list[str] = []
        for station_id, folder in STATION_DIRS.items():
            station_dir = WATER_MODEL_DIR / folder
            for name in ["hybrid_model.pt", "x_scaler.joblib", "y_scaler.joblib", "xgb_sub.joblib", "history.csv"]:
                path = station_dir / name
                if not path.exists():
                    missing.append(str(path))
        if not rmse_path.exists():
            missing.append(str(rmse_path))
        if missing:
            if REQUIRE_ARTIFACTS:
                raise MissingArtifactError("Missing water-level artifacts: " + ", ".join(missing))
            return None

        rmse_data = json.loads(rmse_path.read_text(encoding="utf-8"))
        stations: dict[str, StationArtifacts] = {}
        for station_id, folder in STATION_DIRS.items():
            station_dir = WATER_MODEL_DIR / folder
            model = XGBoostLSTMHybrid(n_features=len(FEATURES_HYBRID))
            state = torch.load(station_dir / "hybrid_model.pt", map_location="cpu", weights_only=True)
            model.load_state_dict(state)
            model.eval()
            stations[station_id] = StationArtifacts(
                model=model,
                x_scaler=joblib.load(station_dir / "x_scaler.joblib"),
                y_scaler=joblib.load(station_dir / "y_scaler.joblib"),
                xgb_sub=joblib.load(station_dir / "xgb_sub.joblib"),
                history=pd.read_csv(station_dir / "history.csv", parse_dates=["DATE"]),
                rmse=float(rmse_data[station_id]),
            )
        return cls(stations)

    def forecast_station(self, station_id: str, enso_values: list[float], forecast_year: int = 2026) -> list[dict[str, object]]:
        manual_values = [
            {
                "enso_index": float(enso),
                "PRECTOTCORR": None,
                "RAIN_ANOMALY": None,
                "GWETROOT": None,
            }
            for enso in enso_values
        ]
        return self.forecast_station_manual(station_id, manual_values, forecast_year)

    def forecast_station_manual(self, station_id: str, manual_values: list[dict[str, float | None]], forecast_year: int = 2026) -> list[dict[str, object]]:
        artifacts = self.stations[station_id]
        history = artifacts.history.sort_values("DATE").copy()
        if len(history) < SEQ_LEN:
            raise ValueError(f"{station_id} has fewer than {SEQ_LEN} history rows")

        rows: list[dict[str, object]] = []
        window_df = history.tail(SEQ_LEN).copy()
        last_date = pd.Timestamp(history["DATE"].max())
        mean_prec = float(history["PRECTOTCORR"].mean())
        mean_soil = float(history["GWETROOT"].mean())

        rows_all: list[dict[str, object]] = []
        for step, manual in enumerate(manual_values, start=1):
            target_date = last_date + pd.DateOffset(months=step)
            month = int(target_date.month)
            month_sin = float(np.sin(2 * np.pi * month / 12))
            month_cos = float(np.cos(2 * np.pi * month / 12))
            enso = float(manual["enso_index"])
            prec = float(manual["PRECTOTCORR"]) if manual.get("PRECTOTCORR") is not None else mean_prec
            rain_anomaly = float(manual["RAIN_ANOMALY"]) if manual.get("RAIN_ANOMALY") is not None else 0.0
            soil = float(manual["GWETROOT"]) if manual.get("GWETROOT") is not None else mean_soil
            climate_row = pd.DataFrame(
                [[prec, rain_anomaly, soil, enso, month_sin, month_cos]],
                columns=XGB_CLIMATE_FEATS,
            )
            xgb_pred = float(artifacts.xgb_sub.predict(climate_row)[0])

            x_scaled = artifacts.x_scaler.transform(window_df[FEATURES_HYBRID])
            with torch.no_grad():
                pred_sc, _ = artifacts.model(
                    torch.tensor(x_scaled, dtype=torch.float32).unsqueeze(0),
                    torch.tensor([[xgb_pred]], dtype=torch.float32),
                )
            predicted = float(artifacts.y_scaler.inverse_transform(pred_sc.numpy())[0, 0])
            threshold = float(STATIONS[station_id]["flood_threshold_m"])
            risk_label = risk_for_value(predicted, threshold)
            lower = predicted - 1.5 * artifacts.rmse
            upper = predicted + 1.5 * artifacts.rmse
            rows_all.append(
                {
                    "station_id": station_id,
                    "month": target_date.strftime("%Y-%m"),
                    "predicted_water_level_m": predicted,
                    "lower_m": lower,
                    "upper_m": upper,
                    "flood_threshold_m": threshold,
                    "risk_label": risk_label,
                }
            )

            updated = window_df.iloc[-1].copy()
            updated["DATE"] = target_date
            updated[TARGET] = predicted
            updated["PRECTOTCORR"] = prec
            updated["RAIN_ANOMALY"] = rain_anomaly
            updated["GWETROOT"] = soil
            updated["enso_index"] = enso
            updated["month_sin"] = month_sin
            updated["month_cos"] = month_cos
            levels = pd.concat([window_df[TARGET], pd.Series([predicted])], ignore_index=True)
            updated["WL_LAG1"] = float(levels.iloc[-2])
            updated["WL_LAG2"] = float(levels.iloc[-3])
            updated["WL_LAG3"] = float(levels.iloc[-4])
            updated["WL_ROLL3"] = float(levels.iloc[-4:-1].mean())
            updated["WL_ROLL6"] = float(levels.iloc[-7:-1].mean())
            window_df = pd.concat([window_df.iloc[1:], updated.to_frame().T], ignore_index=True)

        filtered = [row for row in rows_all if str(row["month"]).startswith(f"{forecast_year}-")]
        return filtered[:FORECAST_H]
