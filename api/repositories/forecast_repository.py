from __future__ import annotations

from sqlalchemy import func
from sqlalchemy.orm import Session

from api.models import Alert, EnsoForecast, WaterLevelForecast


class ForecastRepository:
    """Database persistence and read queries for forecast-related records."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def save_enso_forecast(self, run_date: str, mode: str, months: list[str], values: list[float]) -> None:
        for month, value in zip(months, values, strict=True):
            self.db.add(
                EnsoForecast(
                    run_date=run_date,
                    target_month=month,
                    nino34_predicted=float(value),
                    mode=mode,
                )
            )

    def save_water_level_forecast(self, run_date: str, station_id: str, row: dict[str, object], risk_description: str) -> None:
        risk_label = str(row["risk_label"])
        target_month = str(row["month"])
        self.db.add(
            WaterLevelForecast(
                run_date=run_date,
                station_id=station_id,
                target_month=target_month,
                predicted_water_level_m=float(row["predicted_water_level_m"]),
                lower_m=float(row["lower_m"]),
                upper_m=float(row["upper_m"]),
                risk_label=risk_label,
            )
        )
        if risk_label in {"YELLOW", "RED"}:
            self.db.add(
                Alert(
                    run_date=run_date,
                    station_id=station_id,
                    target_month=target_month,
                    risk_label=risk_label,
                    message=f"{station_id} {risk_description} for {target_month}",
                )
            )

    def latest_station_rows(self, station_id: str) -> list[WaterLevelForecast]:
        latest_run = (
            self.db.query(func.max(WaterLevelForecast.run_date))
            .filter(WaterLevelForecast.station_id == station_id)
            .scalar()
        )
        if latest_run is None:
            return []
        return (
            self.db.query(WaterLevelForecast)
            .filter(WaterLevelForecast.station_id == station_id, WaterLevelForecast.run_date == latest_run)
            .order_by(WaterLevelForecast.target_month)
            .all()
        )

    def commit(self) -> None:
        self.db.commit()

    def rollback(self) -> None:
        self.db.rollback()
