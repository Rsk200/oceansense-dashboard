from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.config import STATIONS
from api.database import Base, SessionLocal, engine
from api.ml.enso_model import EnsoModel
from api.ml.hybrid_model import HybridForecastService
from api.models import Station
from api.controllers import alert_controller, enso_controller, water_level_controller


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for station_id, meta in STATIONS.items():
            existing = db.get(Station, station_id)
            if existing is None:
                db.add(
                    Station(
                        id=station_id,
                        name=str(meta["name"]),
                        lat=float(meta["lat"]),
                        lon=float(meta["lon"]),
                        flood_threshold_m=float(meta["flood_threshold_m"]),
                    )
                )
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    app.state.enso_model = EnsoModel.load()
    app.state.hybrid_service = HybridForecastService.load()
    yield


app = FastAPI(title="OceanSense API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(enso_controller.router)
app.include_router(water_level_controller.router)
app.include_router(alert_controller.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
