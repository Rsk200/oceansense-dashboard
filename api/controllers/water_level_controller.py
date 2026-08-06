from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from api.database import get_db
from api.schemas import ManualWaterLevelRequest, WaterLevelRequest, WaterLevelResponse
from api.services.enso_service import EnsoService
from api.services.water_level_service import WaterLevelService

router = APIRouter(prefix="/api", tags=["water-level"])


@router.post("/water-level", response_model=WaterLevelResponse)
def water_level(payload: WaterLevelRequest, request: Request, db: Session = Depends(get_db)) -> WaterLevelResponse:
    enso_service = EnsoService(request.app.state.enso_model)
    service = WaterLevelService(enso_service, request.app.state.hybrid_service)
    return service.forecast(payload, db)


@router.post("/water-level/manual", response_model=WaterLevelResponse)
def manual_water_level(payload: ManualWaterLevelRequest, request: Request, db: Session = Depends(get_db)) -> WaterLevelResponse:
    enso_service = EnsoService(request.app.state.enso_model)
    service = WaterLevelService(enso_service, request.app.state.hybrid_service)
    return service.manual_forecast(payload, db)
