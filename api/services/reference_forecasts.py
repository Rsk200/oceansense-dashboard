from __future__ import annotations

from functools import lru_cache

import pandas as pd

from api.config import (
    ENSO_FORECAST_CSV,
    FORECAST_H,
    REFERENCE_WATER_LEVEL_2026_CSV,
    STATIONS,
    risk_for_value,
)


@lru_cache(maxsize=1)
def enso_2026_values() -> list[float]:
    """Notebook-authentic 2026 ENSO forecast, normalized by row order."""
    df = pd.read_csv(ENSO_FORECAST_CSV)
    if "ENSO_index" not in df.columns:
        raise ValueError(f"{ENSO_FORECAST_CSV} must contain ENSO_index")
    values = [float(value) for value in df["ENSO_index"].head(FORECAST_H)]
    if len(values) != FORECAST_H:
        raise ValueError(f"{ENSO_FORECAST_CSV} must contain {FORECAST_H} forecast rows")
    return values


def enso_2026_months() -> list[str]:
    return [f"2026-{month:02d}" for month in range(1, FORECAST_H + 1)]


@lru_cache(maxsize=1)
def water_level_2026_reference() -> dict[str, list[dict[str, object]]]:
    """Hybrid XGBoost-LSTM 2026 values copied from the water-level notebook Table IV."""
    df = pd.read_csv(REFERENCE_WATER_LEVEL_2026_CSV)
    station_rows: dict[str, list[dict[str, object]]] = {station_id: [] for station_id in STATIONS}
    for _, row in df.iterrows():
        month = str(row["month"])
        for station_id, meta in STATIONS.items():
            predicted = float(row[station_id])
            threshold = float(meta["flood_threshold_m"])
            station_rows[station_id].append(
                {
                    "station_id": station_id,
                    "month": month,
                    "predicted_water_level_m": predicted,
                    "lower_m": predicted,
                    "upper_m": predicted,
                    "flood_threshold_m": threshold,
                    "risk_label": risk_for_value(predicted, threshold),
                }
            )
    return station_rows
