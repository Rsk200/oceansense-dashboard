from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = BASE_DIR.parent

DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
ENSO_MODEL_DIR = MODELS_DIR / "enso"
WATER_MODEL_DIR = MODELS_DIR / "water_level"
DB_PATH = DATA_DIR / "oceansense.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH.as_posix()}")

SOURCE_DATA_DIR = Path(os.getenv("OCEANSENSE_SOURCE_DATA_DIR", r"C:\Users\Yaad\Documents\fine tune"))
GLOBAL_CSV = SOURCE_DATA_DIR / "final_global_with_nino34_2005_2025 (1).csv"
LOCAL_CSV = SOURCE_DATA_DIR / "local_with_enso_2006_2025.csv"
ENSO_FORECAST_CSV = SOURCE_DATA_DIR / "enso_forecast_12m.csv"
REFERENCE_WATER_LEVEL_2026_CSV = DATA_DIR / "reference_water_level_2026_hybrid.csv"

REQUIRE_ARTIFACTS = os.getenv("OCEANSENSE_REQUIRE_ARTIFACTS", "1") == "1"

STATIONS = {
    "Station-A": {"name": "Jamalpur", "lat": 25.13028, "lon": 89.73464, "flood_threshold_m": 19.05},
    "Station-B": {"name": "Gaibandha", "lat": 25.18713, "lon": 89.59932, "flood_threshold_m": 19.35},
    "Station-C": {"name": "Kurigram", "lat": 25.56806, "lon": 89.67889, "flood_threshold_m": 23.25},
}

STATION_DIRS = {
    "Station-A": "station_A",
    "Station-B": "station_B",
    "Station-C": "station_C",
}

SEQ_LEN = 24
ENSO_SEQ_LEN = 12
PCA_COMPONENTS = 20
FORECAST_H = 12
SUPPORTED_FORECAST_YEARS = [2026, 2027]
LSTM_HIDDEN = 128
LSTM_LAYERS = 3
DROPOUT = 0.3
TARGET = "WATER_LEVEL"

FEATURES_HYBRID = [
    "PRECTOTCORR",
    "RAIN_ANOMALY",
    "GWETROOT",
    "enso_index",
    "month_sin",
    "month_cos",
    "WL_LAG1",
    "WL_LAG2",
    "WL_LAG3",
    "WL_ROLL3",
    "WL_ROLL6",
]

XGB_CLIMATE_FEATS = [
    "PRECTOTCORR",
    "RAIN_ANOMALY",
    "GWETROOT",
    "enso_index",
    "month_sin",
    "month_cos",
]

RISK_LABELS = {
    "GREEN": "Below danger level",
    "YELLOW": "Approaching danger level (< 2 m below threshold)",
    "RED": "Danger - flood likely",
}

RISK_ORDER = {"RED": 0, "YELLOW": 1, "GREEN": 2}

ADVISORY_LIBRARY = {
    "GREEN": {
        "headline": "Normal monitoring",
        "community_message": "River level is below the danger zone. Continue normal monitoring and keep household plans updated.",
        "actions": [
            "Check official river bulletins once daily.",
            "Keep phone numbers for local volunteers, boat operators, and health workers available.",
            "Store key documents in a dry and reachable place.",
        ],
    },
    "YELLOW": {
        "headline": "Prepare for possible flooding",
        "community_message": "Water level is approaching the danger zone. Riverine households should prepare early and watch updates closely.",
        "actions": [
            "Move livestock, seeds, dry food, medicine, and documents to higher ground.",
            "Charge mobile phones and share warnings through community groups.",
            "Prepare evacuation routes for children, elderly people, pregnant women, and people with disabilities.",
            "Avoid unnecessary river crossings during strong current or night travel.",
        ],
    },
    "RED": {
        "headline": "Flood likely - take protective action",
        "community_message": "Forecast water level is at or above the danger threshold. Immediate local preparedness and evacuation support may be needed.",
        "actions": [
            "Follow local authority instructions and move vulnerable people to safer shelters or raised locations.",
            "Turn off unsafe electrical connections and protect drinking water sources.",
            "Use boats or known safe routes only; avoid walking through moving flood water.",
            "Coordinate community volunteers for rescue, first aid, safe water, and emergency communication.",
            "Keep emergency food, oral saline, medicines, torchlight, and clean water ready.",
        ],
    },
}


def risk_for_value(value: float, threshold: float) -> str:
    if value >= threshold:
        return "RED"
    if value >= threshold - 2.0:
        return "YELLOW"
    return "GREEN"


def advisory_for_risk(risk_label: str) -> dict[str, object]:
    return ADVISORY_LIBRARY[risk_label]
