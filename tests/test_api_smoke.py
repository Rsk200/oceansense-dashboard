from fastapi.testclient import TestClient

from api.main import app


def test_water_level_2026_auto_all_stations() -> None:
    with TestClient(app) as client:
        response = client.post("/api/water-level", json={"station_id": "all", "mode": "auto", "forecast_year": 2026})
    assert response.status_code == 200
    body = response.json()
    assert body["forecast_year"] == 2026
    assert len(body["enso"]) == 12
    assert len(body["forecasts"]) == 36
    assert {row["station_id"] for row in body["forecasts"]} == {"Station-A", "Station-B", "Station-C"}
    assert body["forecasts"][0]["month"].startswith("2026-")


def test_water_level_2027_manual_scenario_uses_2026_chain() -> None:
    values_2027 = [0.2, 0.1, 0.0, -0.1, -0.2, -0.1, 0.1, 0.3, 0.4, 0.2, 0.0, -0.1]
    with TestClient(app) as client:
        response = client.post(
            "/api/water-level",
            json={"station_id": "Station-A", "mode": "scenario", "forecast_year": 2027, "enso_values": values_2027},
        )
    assert response.status_code == 200
    body = response.json()
    assert body["forecast_year"] == 2027
    assert len(body["enso"]) == 12
    assert len(body["forecasts"]) == 12
    assert body["enso"][0]["month"] == "2027-01"
    assert body["enso"][0]["nino34"] == values_2027[0]
    assert body["forecasts"][0]["month"] == "2027-01"
    assert body["forecasts"][-1]["month"] == "2027-12"


def test_advisory_endpoint_returns_actionable_guidance() -> None:
    with TestClient(app) as client:
        client.post("/api/water-level", json={"station_id": "all", "mode": "auto", "forecast_year": 2026})
        response = client.get("/api/advisory")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 3
    assert all(item["headline"] for item in body)
    assert all(item["community_message"] for item in body)
    assert all(len(item["actions"]) >= 3 for item in body)


def test_manual_water_level_2026_all_stations() -> None:
    manual_values = [
        {
            "month": f"2026-{idx + 1:02d}",
            "enso_index": 0.1,
            "PRECTOTCORR": 4.0,
            "RAIN_ANOMALY": 0.2,
            "GWETROOT": 0.65,
        }
        for idx in range(12)
    ]
    with TestClient(app) as client:
        response = client.post(
            "/api/water-level/manual",
            json={"station_id": "all", "forecast_year": 2026, "manual_values": manual_values},
        )
    assert response.status_code == 200
    body = response.json()
    assert body["mode"] == "manual"
    assert body["forecast_year"] == 2026
    assert len(body["forecasts"]) == 36
    assert body["forecasts"][0]["month"] == "2026-01"


def test_manual_water_level_2027_uses_auto_2026_chain() -> None:
    manual_values = [
        {
            "month": f"2027-{idx + 1:02d}",
            "enso_index": 0.2,
            "PRECTOTCORR": 5.0,
            "RAIN_ANOMALY": 0.5,
            "GWETROOT": 0.72,
        }
        for idx in range(12)
    ]
    with TestClient(app) as client:
        response = client.post(
            "/api/water-level/manual",
            json={"station_id": "Station-A", "forecast_year": 2027, "manual_values": manual_values},
        )
    assert response.status_code == 200
    body = response.json()
    assert body["mode"] == "manual"
    assert body["forecast_year"] == 2027
    assert len(body["enso"]) == 12
    assert len(body["forecasts"]) == 12
    assert body["enso"][0]["month"] == "2027-01"
    assert body["enso"][0]["nino34"] == 0.2
    assert body["forecasts"][0]["month"] == "2027-01"
    assert body["forecasts"][-1]["month"] == "2027-12"
