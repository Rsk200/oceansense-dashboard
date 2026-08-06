from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator

StationId = Literal["Station-A", "Station-B", "Station-C"]
Mode = Literal["auto", "scenario", "manual"]
RiskLabel = Literal["GREEN", "YELLOW", "RED"]


class EnsoPoint(BaseModel):
    month: str
    nino34: float


class EnsoScenarioRequest(BaseModel):
    values: list[float] = Field(min_length=12, max_length=24)
    forecast_year: Literal[2026, 2027] = 2026


class EnsoForecastResponse(BaseModel):
    mode: Mode
    forecast: list[EnsoPoint]


class WaterLevelRequest(BaseModel):
    station_id: StationId | Literal["all"] = "all"
    mode: Mode = "auto"
    forecast_year: Literal[2026, 2027] = 2026
    enso_values: list[float] | None = None

    @field_validator("enso_values")
    @classmethod
    def validate_enso_values(cls, value: list[float] | None) -> list[float] | None:
        if value is not None and len(value) not in {12, 24}:
            raise ValueError("enso_values must contain 12 values, or 24 values for an explicit 2026-2027 chain")
        return value


class ManualClimateInput(BaseModel):
    month: str | None = None
    enso_index: float
    PRECTOTCORR: float = Field(ge=0)
    RAIN_ANOMALY: float
    GWETROOT: float = Field(ge=0, le=1.5)


class ManualWaterLevelRequest(BaseModel):
    station_id: StationId | Literal["all"] = "all"
    forecast_year: Literal[2026, 2027] = 2026
    manual_values: list[ManualClimateInput] = Field(min_length=12, max_length=24)

    @field_validator("manual_values")
    @classmethod
    def validate_manual_values(cls, value: list[ManualClimateInput]) -> list[ManualClimateInput]:
        if len(value) not in {12, 24}:
            raise ValueError("manual_values must contain 12 monthly rows, or 24 rows for an explicit 2026-2027 chain")
        return value


class WaterLevelPoint(BaseModel):
    station_id: StationId
    month: str
    predicted_water_level_m: float
    lower_m: float
    upper_m: float
    flood_threshold_m: float
    risk_label: RiskLabel
    risk_description: str


class WaterLevelResponse(BaseModel):
    mode: Mode
    forecast_year: Literal[2026, 2027]
    enso: list[EnsoPoint]
    forecasts: list[WaterLevelPoint]


class RiskStation(BaseModel):
    station_id: StationId
    lat: float
    lon: float
    flood_threshold_m: float
    latest_month: str | None = None
    predicted_water_level_m: float | None = None
    risk_label: RiskLabel = "GREEN"
    risk_description: str


class AlertOut(BaseModel):
    station_id: StationId
    target_month: str
    risk_label: Literal["YELLOW", "RED"]
    message: str


class AdvisoryOut(BaseModel):
    station_id: StationId
    target_month: str | None = None
    risk_label: RiskLabel
    headline: str
    community_message: str
    actions: list[str]
    predicted_water_level_m: float | None = None
    flood_threshold_m: float
