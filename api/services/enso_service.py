from __future__ import annotations

from datetime import UTC, datetime
from typing import Protocol

import pandas as pd
from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.repositories.forecast_repository import ForecastRepository
from api.schemas import EnsoForecastResponse, EnsoPoint, EnsoScenarioRequest, WaterLevelRequest
from api.services.reference_forecasts import enso_2026_months, enso_2026_values


class EnsoModelProtocol(Protocol):
    def predict_recursive(self, horizon: int = 12) -> list[float]:
        ...

    def forecast_months(self, horizon: int = 12, forecast_year: int | None = None) -> list[str]:
        ...


class EnsoService:
    """Business logic for ENSO forecasts and scenario chaining."""

    def __init__(self, enso_model: EnsoModelProtocol) -> None:
        self.enso_model = enso_model

    def forecast_months(self, forecast_year: int = 2026, horizon: int = 12) -> list[str]:
        if forecast_year == 2026:
            return enso_2026_months()[:horizon]
        if self.enso_model is not None:
            return self.enso_model.forecast_months(horizon=horizon, forecast_year=forecast_year)
        start = pd.Timestamp.utcnow().normalize().replace(day=1)
        return [
            month
            for month in [(start + pd.DateOffset(months=i + 1)).strftime("%Y-%m") for i in range(horizon)]
            if month.startswith(f"{forecast_year}-")
        ][:12]

    def auto_forecast(self, db: Session) -> EnsoForecastResponse:
        values = enso_2026_values()
        months = self.forecast_months(2026, 12)
        repo = ForecastRepository(db)
        try:
            repo.save_enso_forecast(datetime.now(UTC).isoformat(), "auto", months, values)
            repo.commit()
        except Exception:
            repo.rollback()
            raise
        return EnsoForecastResponse(
            mode="auto",
            forecast=[EnsoPoint(month=month, nino34=value) for month, value in zip(months, values, strict=True)],
        )

    def scenario_forecast(self, payload: EnsoScenarioRequest, db: Session) -> EnsoForecastResponse:
        values_all = self.resolve_scenario_chain(payload.forecast_year, [float(v) for v in payload.values])
        values = values_all[12:24] if payload.forecast_year == 2027 else values_all[:12]
        months = self.forecast_months(payload.forecast_year, len(values_all))
        repo = ForecastRepository(db)
        try:
            repo.save_enso_forecast(datetime.now(UTC).isoformat(), "scenario", months, values)
            repo.commit()
        except Exception:
            repo.rollback()
            raise
        return EnsoForecastResponse(
            mode="scenario",
            forecast=[EnsoPoint(month=month, nino34=value) for month, value in zip(months, values, strict=True)],
        )

    def resolve_water_level_enso_values(self, payload: WaterLevelRequest) -> list[float]:
        if payload.mode == "scenario":
            if payload.enso_values is None:
                raise HTTPException(status_code=422, detail="enso_values are required when mode='scenario'")
            return self.resolve_scenario_chain(payload.forecast_year, [float(v) for v in payload.enso_values])
        if payload.forecast_year == 2026:
            return enso_2026_values()
        horizon = 24 if payload.forecast_year == 2027 else 12
        if payload.forecast_year == 2027:
            return enso_2026_values() + self.enso_model.predict_recursive(horizon)[12:24]
        return self.enso_model.predict_recursive(horizon)

    def resolve_scenario_chain(self, forecast_year: int, values: list[float]) -> list[float]:
        if forecast_year == 2027:
            if len(values) == 12:
                return enso_2026_values() + values
            if len(values) == 24:
                return values
            raise HTTPException(
                status_code=422,
                detail="2027 scenario requires either 12 manual ENSO values for 2027 or 24 chained values for 2026-2027",
            )
        if len(values) != 12:
            raise HTTPException(status_code=422, detail="2026 scenario requires exactly 12 ENSO values")
        return values
