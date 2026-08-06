import pytest
from pydantic import ValidationError

from api.schemas import EnsoScenarioRequest, ManualClimateInput, ManualWaterLevelRequest, WaterLevelRequest


def test_scenario_requires_12_values() -> None:
    with pytest.raises(ValidationError):
        EnsoScenarioRequest(values=[0.1, 0.2])


def test_water_level_accepts_all_station() -> None:
    request = WaterLevelRequest(station_id="all", mode="auto")
    assert request.station_id == "all"
    assert request.mode == "auto"


def test_water_level_accepts_2027_chained_values() -> None:
    request = WaterLevelRequest(station_id="Station-A", mode="scenario", forecast_year=2027, enso_values=[0.0] * 24)
    assert request.forecast_year == 2027
    assert len(request.enso_values or []) == 24


def test_water_level_accepts_2027_manual_values() -> None:
    request = WaterLevelRequest(station_id="Station-A", mode="scenario", forecast_year=2027, enso_values=[0.0] * 12)
    assert request.forecast_year == 2027
    assert len(request.enso_values or []) == 12


def test_manual_water_level_accepts_12_rows() -> None:
    rows = [
        ManualClimateInput(enso_index=0.1, PRECTOTCORR=4.0, RAIN_ANOMALY=0.2, GWETROOT=0.65)
        for _ in range(12)
    ]
    request = ManualWaterLevelRequest(station_id="all", forecast_year=2026, manual_values=rows)
    assert len(request.manual_values) == 12
