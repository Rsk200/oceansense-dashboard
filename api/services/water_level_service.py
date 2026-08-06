from __future__ import annotations

from datetime import UTC, datetime
from typing import Protocol

from sqlalchemy.orm import Session

from api.config import RISK_LABELS, STATIONS
from api.repositories.forecast_repository import ForecastRepository
from api.schemas import EnsoPoint, ManualClimateInput, ManualWaterLevelRequest, WaterLevelPoint, WaterLevelRequest, WaterLevelResponse
from api.services.enso_service import EnsoService
from api.services.reference_forecasts import water_level_2026_reference


class HybridForecastProtocol(Protocol):
    def forecast_station(self, station_id: str, enso_values: list[float], forecast_year: int = 2026) -> list[dict[str, object]]:
        ...

    def forecast_station_manual(self, station_id: str, manual_values: list[dict[str, float | None]], forecast_year: int = 2026) -> list[dict[str, object]]:
        ...


class WaterLevelService:
    """Business logic for station water-level forecasts and persistence."""

    def __init__(self, enso_service: EnsoService, hybrid_service: HybridForecastProtocol) -> None:
        self.enso_service = enso_service
        self.hybrid_service = hybrid_service

    def forecast(self, payload: WaterLevelRequest, db: Session) -> WaterLevelResponse:
        enso_values = self.enso_service.resolve_water_level_enso_values(payload)
        station_ids = list(STATIONS) if payload.station_id == "all" else [payload.station_id]
        run_date = datetime.now(UTC).isoformat()
        repo = ForecastRepository(db)
        response_rows: list[WaterLevelPoint] = []
        reference_rows = water_level_2026_reference() if payload.mode == "auto" and payload.forecast_year == 2026 else None

        try:
            for station_id in station_ids:
                if reference_rows is not None:
                    station_rows = reference_rows[station_id]
                else:
                    station_rows = self.hybrid_service.forecast_station(station_id, enso_values, payload.forecast_year)
                for row in station_rows:
                    risk_label = str(row["risk_label"])
                    risk_description = RISK_LABELS[risk_label]
                    repo.save_water_level_forecast(run_date, station_id, row, risk_description)
                    response_rows.append(WaterLevelPoint(risk_description=risk_description, **row))
            repo.commit()
        except Exception:
            repo.rollback()
            raise

        enso_response_values = enso_values[12:24] if payload.forecast_year == 2027 else enso_values[:12]
        enso_months = self.enso_service.forecast_months(payload.forecast_year, len(enso_values))
        return WaterLevelResponse(
            mode=payload.mode,
            forecast_year=payload.forecast_year,
            enso=[
                EnsoPoint(month=month, nino34=value)
                for month, value in zip(enso_months, enso_response_values, strict=True)
            ],
            forecasts=response_rows,
        )

    def manual_forecast(self, payload: ManualWaterLevelRequest, db: Session) -> WaterLevelResponse:
        manual_chain = self._resolve_manual_chain(payload)
        station_ids = list(STATIONS) if payload.station_id == "all" else [payload.station_id]
        run_date = datetime.now(UTC).isoformat()
        repo = ForecastRepository(db)
        response_rows: list[WaterLevelPoint] = []

        try:
            for station_id in station_ids:
                station_rows = self.hybrid_service.forecast_station_manual(station_id, manual_chain, payload.forecast_year)
                for row in station_rows:
                    risk_label = str(row["risk_label"])
                    risk_description = RISK_LABELS[risk_label]
                    repo.save_water_level_forecast(run_date, station_id, row, risk_description)
                    response_rows.append(WaterLevelPoint(risk_description=risk_description, **row))
            repo.commit()
        except Exception:
            repo.rollback()
            raise

        manual_response_values = manual_chain[12:24] if payload.forecast_year == 2027 else manual_chain[:12]
        enso_months = self.enso_service.forecast_months(payload.forecast_year, len(manual_chain))
        return WaterLevelResponse(
            mode="manual",
            forecast_year=payload.forecast_year,
            enso=[
                EnsoPoint(month=month, nino34=float(row["enso_index"]))
                for month, row in zip(enso_months, manual_response_values, strict=True)
            ],
            forecasts=response_rows,
        )

    def _resolve_manual_chain(self, payload: ManualWaterLevelRequest) -> list[dict[str, float | None]]:
        manual_values = [self._manual_input_to_dict(row) for row in payload.manual_values]
        if payload.forecast_year == 2027 and len(manual_values) == 12:
            auto_enso_2026 = self.enso_service.resolve_water_level_enso_values(
                WaterLevelRequest(station_id=payload.station_id, mode="auto", forecast_year=2026)
            )
            auto_chain = [
                {
                    "enso_index": float(enso),
                    "PRECTOTCORR": None,
                    "RAIN_ANOMALY": None,
                    "GWETROOT": None,
                }
                for enso in auto_enso_2026
            ]
            return auto_chain + manual_values
        if payload.forecast_year == 2027 and len(manual_values) == 24:
            return manual_values
        if payload.forecast_year == 2026 and len(manual_values) == 12:
            return manual_values
        raise ValueError("Manual forecast requires 12 rows for the selected year, or 24 rows for an explicit 2026-2027 chain")

    @staticmethod
    def _manual_input_to_dict(row: ManualClimateInput) -> dict[str, float | None]:
        return {
            "enso_index": float(row.enso_index),
            "PRECTOTCORR": float(row.PRECTOTCORR),
            "RAIN_ANOMALY": float(row.RAIN_ANOMALY),
            "GWETROOT": float(row.GWETROOT),
        }
