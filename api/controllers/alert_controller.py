from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.database import get_db
from api.schemas import AdvisoryOut, AlertOut, RiskStation
from api.services.advisory_service import AdvisoryService

router = APIRouter(prefix="/api", tags=["alerts"])


@router.get("/flood-risk", response_model=list[RiskStation])
def flood_risk(db: Session = Depends(get_db)) -> list[RiskStation]:
    return AdvisoryService(db).flood_risk()


@router.get("/alerts", response_model=list[AlertOut])
def alerts(db: Session = Depends(get_db)) -> list[AlertOut]:
    return AdvisoryService(db).active_alerts()


@router.get("/advisory", response_model=list[AdvisoryOut])
def advisory(db: Session = Depends(get_db)) -> list[AdvisoryOut]:
    return AdvisoryService(db).advisories()
