from __future__ import annotations

from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from api.database import Base


class Station(Base):
    __tablename__ = "stations"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    flood_threshold_m: Mapped[float] = mapped_column(Float, nullable=False)


class EnsoForecast(Base):
    __tablename__ = "enso_forecasts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    run_date: Mapped[str] = mapped_column(String, nullable=False)
    target_month: Mapped[str] = mapped_column(String, nullable=False)
    nino34_predicted: Mapped[float] = mapped_column(Float, nullable=False)
    mode: Mapped[str] = mapped_column(String, nullable=False)


class WaterLevelForecast(Base):
    __tablename__ = "water_level_forecasts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    run_date: Mapped[str] = mapped_column(String, nullable=False)
    station_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    target_month: Mapped[str] = mapped_column(String, nullable=False)
    predicted_water_level_m: Mapped[float] = mapped_column(Float, nullable=False)
    lower_m: Mapped[float] = mapped_column(Float, nullable=False)
    upper_m: Mapped[float] = mapped_column(Float, nullable=False)
    risk_label: Mapped[str] = mapped_column(String, nullable=False)


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    run_date: Mapped[str] = mapped_column(String, nullable=False)
    station_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    target_month: Mapped[str] = mapped_column(String, nullable=False)
    risk_label: Mapped[str] = mapped_column(String, nullable=False)
    message: Mapped[str] = mapped_column(String, nullable=False)
