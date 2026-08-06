from __future__ import annotations

from sqlalchemy.orm import Session

from api.config import RISK_LABELS, RISK_ORDER, STATIONS, advisory_for_risk
from api.models import WaterLevelForecast
from api.repositories.forecast_repository import ForecastRepository
from api.schemas import AdvisoryOut, AlertOut, RiskStation


class AdvisoryService:
    """Read-side business logic for flood risk, active alerts, and community advisories."""

    def __init__(self, db: Session) -> None:
        self.repo = ForecastRepository(db)

    def flood_risk(self) -> list[RiskStation]:
        rows: list[RiskStation] = []
        for station_id, meta in STATIONS.items():
            latest = self._highest_risk_row(self.repo.latest_station_rows(station_id))
            risk = latest.risk_label if latest else "GREEN"
            rows.append(
                RiskStation(
                    station_id=station_id,
                    lat=float(meta["lat"]),
                    lon=float(meta["lon"]),
                    flood_threshold_m=float(meta["flood_threshold_m"]),
                    latest_month=latest.target_month if latest else None,
                    predicted_water_level_m=latest.predicted_water_level_m if latest else None,
                    risk_label=risk,
                    risk_description=RISK_LABELS[risk],
                )
            )
        return sorted(rows, key=lambda row: RISK_ORDER[row.risk_label])

    def active_alerts(self) -> list[AlertOut]:
        active: list[AlertOut] = []
        for station_id in STATIONS:
            for row in self.repo.latest_station_rows(station_id):
                if row.risk_label in {"YELLOW", "RED"}:
                    active.append(
                        AlertOut(
                            station_id=station_id,
                            target_month=row.target_month,
                            risk_label=row.risk_label,
                            message=f"{station_id} {RISK_LABELS[row.risk_label]} for {row.target_month}",
                        )
                    )
        return sorted(active, key=lambda row: (RISK_ORDER[row.risk_label], row.station_id, row.target_month))

    def advisories(self) -> list[AdvisoryOut]:
        rows: list[AdvisoryOut] = []
        for station_id, meta in STATIONS.items():
            latest = self._highest_risk_row(self.repo.latest_station_rows(station_id))
            risk = latest.risk_label if latest else "GREEN"
            advice = advisory_for_risk(risk)
            rows.append(
                AdvisoryOut(
                    station_id=station_id,
                    target_month=latest.target_month if latest else None,
                    risk_label=risk,
                    headline=str(advice["headline"]),
                    community_message=str(advice["community_message"]),
                    actions=list(advice["actions"]),
                    predicted_water_level_m=latest.predicted_water_level_m if latest else None,
                    flood_threshold_m=float(meta["flood_threshold_m"]),
                )
            )
        return sorted(rows, key=lambda row: RISK_ORDER[row.risk_label])

    @staticmethod
    def _highest_risk_row(rows: list[WaterLevelForecast]) -> WaterLevelForecast | None:
        if not rows:
            return None
        return sorted(rows, key=lambda row: (RISK_ORDER[row.risk_label], row.target_month))[0]
