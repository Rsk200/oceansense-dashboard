# OceanSense

OceanSense is an AI-powered ENSO-based flood early warning system for the Brahmaputra-Jamuna basin. It runs a two-stage forecast cascade — ENSO (Nino3.4) prediction first, then station-level water-level and flood-risk forecasting — behind a FastAPI backend and a React dashboard.

- **Backend**: FastAPI + SQLAlchemy + XGBoost/PyTorch ML pipelines (`oceansense/api/`)
- **Frontend**: React 19 + TypeScript + Vite + TanStack Query + Tailwind (`oceansense/frontend/`) — this is the official dashboard. An earlier Streamlit prototype has been retired.

## Setup

```powershell
cd oceansense
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Export model artifacts

Run this once before starting the API:

```powershell
python scripts/export_models.py
```

The exporter reads the CSV files from the parent workspace and writes the required artifacts under `models/`.

## Backend architecture

The FastAPI backend follows an MVC-style structure:

- `api/controllers/`: thin HTTP controllers. They receive requests and return responses.
- `api/services/`: business logic for ENSO forecasts, water-level forecasts, flood risk, alerts, and advisories.
- `api/repositories/`: database persistence and query logic.
- `api/models.py`: SQLAlchemy ORM database models.
- `api/schemas.py`: Pydantic request/response DTOs.
- `api/ml/`: trained model loading and ML inference wrappers.

The old `api/routes/` modules are kept as compatibility wrappers, but `api/main.py` wires the controller modules directly.

## Frontend architecture

The React dashboard lives in `frontend/`:

- `src/pages/Landing.tsx` — marketing/landing page (hero, platform stats, AI pipeline, capabilities, tech stack, research).
- `src/pages/Dashboard/` — Overview, ENSO Forecast, Water Level, Manual Prediction, Risk Map, Alerts, Advisory, Forecast History.
- `src/services/api.ts` — typed Axios client for every backend endpoint.
- `src/hooks/queries.ts` — TanStack Query hooks (including auto-bootstrap of the first forecast run).
- `src/stores/forecastHistory.ts` — persists every forecast run to `localStorage` so the Forecast History page has real data to show.
- `src/components/` — shared UI (`ui/`), layout (`layout/`), dashboard chrome (`dashboard/`), landing sections (`landing/`), and common widgets like toasts, error boundaries, and charts (`common/`).

No authentication layer exists by design — this is an internal/public forecasting tool, not a multi-tenant SaaS product.

## Forecast modes

- `2026 Auto Prediction`: the ENSO model predicts 2026 ENSO values, then the water-level model predicts 2026 flood risk.
- `2027 Auto Prediction`: the backend recursively predicts 24 ENSO months, rolls through 2026 internally, and returns 2027 water-level forecasts.
- `2027 Scenario Input`: the user manually enters 12 ENSO values for 2027. The backend automatically uses model-generated 2026 values first, then predicts 2027 flood risk from the manual 2027 scenario.
- `Manual Prediction`: the user enters monthly ENSO, rainfall, rain anomaly, and soil moisture values. The trained ML model returns water level, flood risk, confidence bounds, alerts, and advisory output.

Manual prediction endpoint:

```text
POST /api/water-level/manual
```

For 2027 manual prediction, the user enters only the 12 monthly 2027 values. The backend automatically rolls through 2026 first and then predicts the 2027 outcome.

The dashboard includes quick presets for manual input:

- `Neutral Baseline`
- `Wet Monsoon`
- `Dry Season`
- `El Niño (Warm)`
- `La Niña (Cool)`

Forecast and manual prediction results can be downloaded as CSV from the dashboard, and every run is saved to the Forecast History page (stored locally in the browser).

## Advisory

The Advisory tab provides community-based early warning guidance. It uses the highest-risk upcoming month from the latest forecast run for each station and returns:

- risk level,
- advisory headline,
- community message,
- practical adaptation actions for vulnerable riverine populations.

## Run locally

### Fast path on Windows

```powershell
.\start_oceansense.ps1
```

The script installs backend and frontend dependencies if needed, exports missing model artifacts, starts the FastAPI server, starts the Vite dev server, and opens the dashboard.

Stop both services:

```powershell
.\stop_oceansense.ps1
```

### Manual run

Terminal 1 — API:

```powershell
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2 — Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the dashboard at `http://localhost:5173`. The Vite dev server proxies `/api` and `/health` to `http://localhost:8000` (see `frontend/vite.config.ts`).

### Production build

```powershell
cd frontend
npm run build
```

This produces static files in `frontend/dist/`, which can be served by any static file server (the Docker image uses nginx — see below).

## Docker

```powershell
docker compose up --build
```

This builds two images from the same multi-stage `Dockerfile`:

- `api` — FastAPI backend, published on `http://localhost:8000`.
- `frontend` — the built React app served by nginx on `http://localhost:8080`, which reverse-proxies `/api` and `/health` to the `api` service.

## Tests

```powershell
pytest
```
