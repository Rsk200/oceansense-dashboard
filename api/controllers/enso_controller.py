from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from api.database import get_db
from api.schemas import EnsoForecastResponse, EnsoScenarioRequest
from api.services.enso_service import EnsoService

router = APIRouter(prefix="/api", tags=["enso"])


@router.post("/enso-predict", response_model=EnsoForecastResponse)
def enso_predict(request: Request, db: Session = Depends(get_db)) -> EnsoForecastResponse:
    return EnsoService(request.app.state.enso_model).auto_forecast(db)


@router.post("/enso-scenario", response_model=EnsoForecastResponse)
def enso_scenario(payload: EnsoScenarioRequest, request: Request, db: Session = Depends(get_db)) -> EnsoForecastResponse:
    return EnsoService(request.app.state.enso_model).scenario_forecast(payload, db)
