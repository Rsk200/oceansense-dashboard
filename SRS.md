# Software Requirements Specification (SRS)

# OceanSense - ENSO and River Flood Forecasting System

Version: 1.0  
Date: 2026-06-25  
Project folder: `C:\Users\Yaad\Documents\fine tune\oceansense`

---

## 1. Introduction

### 1.1 Purpose

OceanSense is a local web application for forecasting river water levels and flood risk for selected stations in Bangladesh's Brahmaputra-Jamuna basin.

The system uses a two-stage machine learning pipeline:

1. A global ENSO model predicts the Niño 3.4 anomaly index for the next 12 months.
2. A local water-level model uses ENSO values and local hydroclimate features to predict water level and flood risk for 3 river stations.

This SRS explains what the system does, how it works, what files were created, what requirements it satisfies, and how it should be run and maintained.

### 1.2 Intended Audience

This document is for:

- The project owner
- Developers who will continue the project
- Research supervisors or reviewers
- ML engineers
- Backend/frontend developers
- Anyone who needs to run or understand the system

### 1.3 Product Name

OceanSense - Flood Forecasting System

### 1.4 Product Scope

OceanSense provides:

- ENSO prediction for 12 months
- Water-level forecasting for 3 stations
- Flood risk classification
- Flood alert generation
- Web dashboard for viewing results
- API endpoints for programmatic access
- Local SQLite storage
- Reproducible model artifact export

The system runs locally on the user's PC.

### 1.5 Definitions

ENSO: El Niño-Southern Oscillation.  
Niño 3.4 anomaly: Ocean temperature anomaly index used to describe ENSO conditions.  
PCA: Principal Component Analysis, used to reduce large global grid data into fewer features.  
XGBoost: A gradient boosting machine learning model.  
BiLSTM: Bidirectional Long Short-Term Memory neural network.  
Attention: Neural network mechanism that helps the model focus on important time steps.  
FastAPI: Python backend framework.  
Streamlit: Python dashboard framework.  
SQLite: Lightweight local database.  
Artifact: Saved trained model or scaler file used during prediction.

---

## 2. Overall Description

### 2.1 System Overview

OceanSense is built as a local full-stack ML application.

The application has 4 main parts:

1. Model export pipeline
2. FastAPI backend
3. Streamlit frontend
4. SQLite database

The user opens the dashboard in a browser. The dashboard calls the backend API. The backend loads trained model artifacts and returns ENSO forecasts, water-level forecasts, risk levels, and alerts.

### 2.2 System Workflow

The full workflow is:

1. Source CSV files are read.
2. ML models are trained/exported into artifact files.
3. FastAPI loads the artifact files once during startup.
4. Streamlit sends forecast requests to FastAPI.
5. FastAPI predicts ENSO values.
6. FastAPI predicts water levels for each station.
7. FastAPI classifies risk as GREEN, YELLOW, or RED.
8. Forecasts and alerts are saved in SQLite.
9. Streamlit displays charts, maps, and alert tables.

### 2.3 User Classes

Primary user:

- A researcher or student running the system locally.

Secondary users:

- Developers extending the application.
- Reviewers evaluating the project.
- Decision makers viewing flood risk results.

### 2.4 Operating Environment

The system was prepared and tested on:

- OS: Windows
- Project path: `C:\Users\Yaad\Documents\fine tune\oceansense`
- Python environment: local `.venv`
- Python version used: 3.12
- Browser: any modern browser
- Backend port: `8000`
- Frontend port: `8501`

Important note:

The system Python on the PC is Python 3.14, which is too new for some ML packages. Therefore, the project uses its own virtual environment:

```text
oceansense/.venv
```

### 2.5 Design Constraints

- The application must run locally.
- The model artifacts must be loaded once at API startup.
- The frontend must call API endpoints and must not load ML models directly.
- Station constants and thresholds must be stored centrally in `api/config.py`.
- The system must use real exported model files, not mock predictions.
- The app must use the provided CSV files.

---

## 3. Source Data

### 3.1 Global ENSO Dataset

File:

```text
C:\Users\Yaad\Documents\fine tune\final_global_with_nino34_2005_2025 (1).csv
```

Main columns:

```text
Time
Latitude
Longitude
sst
sometauy
sozotaux
votemper_surface
sohtc300
sohtc700
slp
olr
nino3.4 anomaly
```

Purpose:

This file is used to train the global ENSO model.

### 3.2 Local Water-Level Dataset

File:

```text
C:\Users\Yaad\Documents\fine tune\local_with_enso_2006_2025.csv
```

Main columns:

```text
LAT
LON
YEAR
DOY
WATER_LEVEL
PRECTOTCORR
RAIN_ANOMALY
GWETROOT
DATE
enso_index
```

Purpose:

This file is used to train local station-level water-level models.

### 3.3 ENSO Forecast CSV

File:

```text
C:\Users\Yaad\Documents\fine tune\enso_forecast_12m.csv
```

Main columns:

```text
date
ENSO_index
```

Purpose:

This file exists as an external ENSO forecast reference. The production app now uses the trained ENSO model for automatic forecasts and also supports user-provided scenario values.

---

## 4. Project Structure

The final project folder is:

```text
oceansense/
├── api/
│   ├── controllers/
│   │   ├── alert_controller.py
│   │   ├── enso_controller.py
│   │   └── water_level_controller.py
│   ├── services/
│   │   ├── advisory_service.py
│   │   ├── enso_service.py
│   │   └── water_level_service.py
│   ├── repositories/
│   │   └── forecast_repository.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes/
│   │   ├── alerts.py
│   │   ├── enso.py
│   │   └── water_level.py
│   └── ml/
│       ├── enso_model.py
│       └── hybrid_model.py
├── frontend/
│   └── app.py
├── models/
│   ├── enso/
│   ├── water_level/
│   └── rmse.json
├── data/
│   └── oceansense.db
├── scripts/
│   ├── export_models.py
│   └── README.md
├── tests/
│   ├── test_config.py
│   └── test_schemas.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── start_oceansense.ps1
├── stop_oceansense.ps1
├── README.md
└── SRS.md
```

---

## 5. Functional Requirements

### FR-1: Start Local Application

The system shall provide a Windows PowerShell script to start the full application.

Implemented by:

```text
start_oceansense.ps1
```

Expected behavior:

- Create/check virtual environment.
- Install dependencies.
- Check model artifacts.
- Export missing model artifacts.
- Start FastAPI backend.
- Start Streamlit frontend.
- Open the dashboard in the browser.

### FR-2: Stop Local Application

The system shall provide a PowerShell script to stop the running backend and frontend.

Implemented by:

```text
stop_oceansense.ps1
```

### FR-3: Export ENSO Model Artifacts

The system shall train/export the global ENSO model from the global CSV.

Implemented by:

```text
scripts/export_models.py
```

Output artifacts:

```text
models/enso/scaler.joblib
models/enso/pca.joblib
models/enso/xg_model.joblib
models/enso/last_input.npy
models/enso/last_time.txt
```

### FR-4: Export Water-Level Model Artifacts

The system shall train/export water-level model artifacts for all 3 stations.

Output folders:

```text
models/water_level/station_A/
models/water_level/station_B/
models/water_level/station_C/
```

Each folder contains:

```text
hybrid_model.pt
x_scaler.joblib
y_scaler.joblib
xgb_sub.joblib
history.csv
```

### FR-5: Predict ENSO Automatically

The backend shall provide an endpoint to predict the next 12 months of ENSO values.

Endpoint:

```text
POST /api/enso-predict
```

Output:

- Forecast month
- Niño 3.4 predicted value

### FR-6: Accept ENSO Scenario Input

The backend shall allow the user to provide exactly 12 ENSO values.

Endpoint:

```text
POST /api/enso-scenario
```

Input:

```json
{
  "values": [0.1, 0.2, 0.0, -0.1, -0.2, -0.3, 0.1, 0.2, 0.3, 0.0, -0.1, -0.2]
}
```

Validation:

- Must contain exactly 12 values.

### FR-7: Predict Water Level

The backend shall predict 12-month water levels for one station or all stations.

Endpoint:

```text
POST /api/water-level
```

Example input:

```json
{
  "station_id": "all",
  "mode": "auto"
}
```

Scenario input:

```json
{
  "station_id": "Station-A",
  "mode": "scenario",
  "enso_values": [0.1, 0.2, 0.0, -0.1, -0.2, -0.3, 0.1, 0.2, 0.3, 0.0, -0.1, -0.2]
}
```

Output includes:

- Station ID
- Target month
- Predicted water level
- Lower confidence bound
- Upper confidence bound
- Flood threshold
- Risk label
- Risk description

### FR-8: Classify Flood Risk

The system shall classify forecasted water level into:

```text
GREEN
YELLOW
RED
```

Rules:

```text
GREEN  = predicted < threshold - 2.0
YELLOW = threshold - 2.0 <= predicted < threshold
RED    = predicted >= threshold
```

### FR-9: Show Flood Risk Summary

The backend shall provide the latest flood risk for each station.

Endpoint:

```text
GET /api/flood-risk
```

### FR-10: Generate Alerts

The system shall create alerts when predicted risk is:

```text
YELLOW
RED
```

Endpoint:

```text
GET /api/alerts
```

### FR-11: Show Dashboard

The frontend shall show a dashboard at:

```text
http://localhost:8501
```

Dashboard features:

- Station selector
- Forecast mode selector
- Scenario sliders
- 2027 scenario mode where the user enters 12 ENSO values for 2027 and the backend automatically chains through 2026 first
- Forecast run button
- Hydrograph chart
- Flood threshold line
- Confidence interval band
- Risk map
- Alerts table
- Advisory tab with community-based early warning and practical adaptation advice

### FR-12: Forecast 2027 Using 2026 Chain

The system shall support 2027 flood forecasting.

For automatic 2027 forecasts:

- The ENSO model generates 24 months of ENSO values.
- The water-level model rolls through 2026 internally.
- The system returns only the 2027 water-level forecast months.

For manual 2027 scenarios:

- The user enters 12 ENSO values for 2027.
- The backend automatically generates the 2026 ENSO chain first.
- The system predicts 2027 flood risk using the manual 2027 scenario values.

### FR-13: Advisory

The system shall provide automated community-based advisory messages.

Endpoint:

```text
GET /api/advisory
```

The backend follows an MVC-style structure:

- Controllers handle HTTP request/response work.
- Services contain business rules and orchestration.
- Repositories contain database read/write logic.
- ORM models define database tables.
- Schemas define request and response contracts.
- ML modules load and run trained model artifacts.
- Streamlit is the view layer for users.

The advisory shall use the highest-risk upcoming month from the latest forecast run for each station.

Each advisory includes:

- station ID
- target month
- risk label
- headline
- community message
- practical adaptation actions
- predicted water level
- flood threshold

### FR-14: Manual ML Prediction

The system shall provide a separate Manual Prediction section.

The user can manually enter 12 monthly rows containing:

- ENSO index
- rainfall / PRECTOTCORR
- rain anomaly
- soil moisture / GWETROOT

Endpoint:

```text
POST /api/water-level/manual
```

For 2026:

- The user enters 12 monthly rows for 2026.
- The model predicts 2026 water levels and flood risk.

For 2027:

- The user enters 12 monthly rows for 2027.
- The backend automatically rolls through 2026 first using the trained ENSO model and default hydroclimate history.
- The model then predicts 2027 water levels and flood risk using the manual 2027 values.

Manual prediction must not replace the existing Auto Prediction, Scenario Input, Hydrograph, Risk Map, Flood Alerts, or Advisory sections.

---

## 6. Non-Functional Requirements

### NFR-1: Local Usability

The system must run on the user's PC using a local virtual environment.

### NFR-2: Reproducibility

The model artifacts must be reproducible using:

```text
scripts/export_models.py
```

### NFR-3: Maintainability

Constants must be centralized in:

```text
api/config.py
```

This includes:

- Station coordinates
- Flood thresholds
- Feature lists
- Forecast horizon
- Model paths

### NFR-4: API Documentation

FastAPI must provide automatic API documentation at:

```text
http://127.0.0.1:8000/docs
```

### NFR-5: Model Loading Efficiency

Models must load once during backend startup, not on every request.

### NFR-6: Data Persistence

Forecasts and alerts must be stored in SQLite.

### NFR-7: Error Handling

If model artifacts are missing, the backend must fail clearly instead of silently returning fake results.

### NFR-8: User Interface Simplicity

The dashboard should be easy to understand and should not require technical knowledge to use.

---

## 7. Station Details

The system supports 3 stations.

| Station | Latitude | Longitude | Flood Threshold |
|---|---:|---:|---:|
| Station-A | 25.13028 | 89.73464 | 19.05 m |
| Station-B | 25.18713 | 89.59932 | 19.35 m |
| Station-C | 25.56806 | 89.67889 | 23.25 m |

These are defined in:

```text
api/config.py
```

---

## 8. Machine Learning Design

### 8.1 ENSO Model

Model type:

```text
XGBoost + PCA
```

Input:

- Global ocean-atmosphere grid data
- 8 climate variables
- 12-month lookback window

Features:

```text
sst
sometauy
sozotaux
votemper_surface
sohtc300
sohtc700
slp
olr
```

Target:

```text
nino3.4 anomaly
```

Pipeline:

1. Read global CSV.
2. Group by month.
3. Create spatial grid.
4. Flatten grid.
5. Standardize features.
6. Apply PCA with 20 components.
7. Create 12-month sequences.
8. Train XGBoost.
9. Save model artifacts.

### 8.2 ENSO Forecast Output

The ENSO model predicts:

```text
12 monthly Niño 3.4 anomaly values
```

The forecast starts after the last global dataset month.

The exported global dataset ends at:

```text
2025-12
```

So forecast months start at:

```text
2026-01
```

### 8.3 Water-Level Model

Model type:

```text
XGBoost + BiLSTM + Attention hybrid
```

Each station has its own trained model artifacts.

Input features:

```text
PRECTOTCORR
RAIN_ANOMALY
GWETROOT
enso_index
month_sin
month_cos
WL_LAG1
WL_LAG2
WL_LAG3
WL_ROLL3
WL_ROLL6
```

Target:

```text
WATER_LEVEL
```

### 8.4 Confidence Bounds

The system stores RMSE per station in:

```text
models/rmse.json
```

Approximate interval:

```text
lower = prediction - 1.5 * RMSE
upper = prediction + 1.5 * RMSE
```

---

## 9. Database Design

Database file:

```text
data/oceansense.db
```

Tables:

### 9.1 stations

Stores station metadata.

Fields:

```text
id
name
lat
lon
flood_threshold_m
```

### 9.2 enso_forecasts

Stores ENSO forecasts.

Fields:

```text
id
run_date
target_month
nino34_predicted
mode
```

### 9.3 water_level_forecasts

Stores water-level forecast results.

Fields:

```text
id
run_date
station_id
target_month
predicted_water_level_m
lower_m
upper_m
risk_label
```

### 9.4 alerts

Stores generated flood alerts.

Fields:

```text
id
run_date
station_id
target_month
risk_label
message
```

---

## 10. API Specification

### 10.1 Health Check

Endpoint:

```text
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

### 10.2 ENSO Auto Forecast

Endpoint:

```text
POST /api/enso-predict
```

Response:

```json
{
  "mode": "auto",
  "forecast": [
    {
      "month": "2026-01",
      "nino34": -0.5463
    }
  ]
}
```

### 10.3 ENSO Scenario

Endpoint:

```text
POST /api/enso-scenario
```

Request:

```json
{
  "values": [0.1, 0.2, 0.0, -0.1, -0.2, -0.3, 0.1, 0.2, 0.3, 0.0, -0.1, -0.2]
}
```

Response:

```json
{
  "mode": "scenario",
  "forecast": [
    {
      "month": "2026-01",
      "nino34": 0.1
    }
  ]
}
```

### 10.4 Water-Level Forecast

Endpoint:

```text
POST /api/water-level
```

Request:

```json
{
  "station_id": "all",
  "mode": "auto"
}
```

Response:

```json
{
  "mode": "auto",
  "enso": [
    {
      "month": "2026-01",
      "nino34": -0.5463
    }
  ],
  "forecasts": [
    {
      "station_id": "Station-A",
      "month": "2026-01",
      "predicted_water_level_m": 12.53,
      "lower_m": 11.60,
      "upper_m": 13.45,
      "flood_threshold_m": 19.05,
      "risk_label": "GREEN",
      "risk_description": "Below danger level"
    }
  ]
}
```

### 10.5 Flood Risk

Endpoint:

```text
GET /api/flood-risk
```

Returns latest risk for each station.

### 10.6 Alerts

Endpoint:

```text
GET /api/alerts
```

Returns active YELLOW and RED alerts.

---

## 11. Frontend Specification

### 11.1 Dashboard URL

```text
http://localhost:8501
```

### 11.2 Sidebar

The sidebar contains:

- Station selector:
  - all
  - Station-A
  - Station-B
  - Station-C
- Forecast year selector
- Mode selector:
  - Auto Prediction
  - Scenario Input
- Scenario sliders if scenario mode is selected
- Run Forecast button

### 11.3 Hydrograph Tab

Shows:

- Forecasted water-level line
- Confidence interval band
- Flood threshold line
- Station-level risk metric

### 11.4 Risk Map Tab

Shows:

- Map centered on station area
- Station markers
- Marker color based on risk:
  - GREEN
  - YELLOW
  - RED

### 11.5 Flood Alerts Tab

Shows:

- Table of active alerts
- Alert station
- Alert month
- Risk label
- Message

---

## 12. Deployment and Running

### 12.1 Start the System

Open PowerShell:

```powershell
cd "C:\Users\Yaad\Documents\fine tune\oceansense"
.\start_oceansense.ps1
```

This starts both backend and frontend.

### 12.2 Open Dashboard

```text
http://localhost:8501
```

### 12.3 Open API Docs

```text
http://127.0.0.1:8000/docs
```

### 12.4 Stop the System

```powershell
cd "C:\Users\Yaad\Documents\fine tune\oceansense"
.\stop_oceansense.ps1
```

---

## 13. Testing

### 13.1 Automated Tests

Test files:

```text
tests/test_config.py
tests/test_schemas.py
```

Run tests:

```powershell
cd "C:\Users\Yaad\Documents\fine tune\oceansense"
.\.venv\Scripts\python.exe -m pytest -q
```

Current result:

```text
3 passed
```

### 13.2 Manual Smoke Tests Completed

The following were verified:

```text
GET  /health
POST /api/enso-predict
POST /api/water-level
GET  /api/flood-risk
GET  /api/alerts
Streamlit dashboard HTTP 200
```

### 13.3 Model Export Verification

The model export completed successfully and produced:

- ENSO artifacts
- Station-A artifacts
- Station-B artifacts
- Station-C artifacts
- RMSE file

---

## 14. Current Verified Outputs

The ENSO auto forecast starts from:

```text
2026-01
```

The system successfully produced 12-month water-level forecasts for:

```text
Station-A
Station-B
Station-C
```

Flood-risk endpoint returned all 3 stations.

Streamlit dashboard returned:

```text
HTTP 200
```

---

## 15. Security and Safety

### 15.1 Security Scope

This is currently a local prototype. It is not hardened for public internet deployment.

### 15.2 Current Security Features

- Runs locally.
- Uses local SQLite.
- No public credentials are stored.
- No external cloud API is required.

### 15.3 Future Security Requirements

Before public deployment, add:

- Authentication
- Authorization
- HTTPS
- Input rate limiting
- Error logging
- Environment-based secrets
- Production database

---

## 16. Known Limitations

1. The app is local-first, not cloud-production hardened.
2. Models are trained from local CSV files.
3. The Streamlit UI is operational but can be visually improved.
4. Confidence intervals are approximate and RMSE-based.
5. Alerts are generated from forecast outputs and stored locally.
6. The Docker setup exists, but local `.venv` execution was the verified path.
7. The system depends on the provided CSV files remaining available in the parent folder.

---

## 17. Future Improvements

Recommended future work:

- Add more stations.
- Add authentication.
- Add model versioning.
- Add forecast run history UI.
- Add downloadable CSV/PDF reports.
- Add better uncertainty modeling.
- Add scheduled automatic forecast runs.
- Add Docker production verification.
- Add database migration system.
- Add frontend styling improvements.
- Add more automated endpoint tests.
- Add model evaluation dashboard.

---

## 18. Acceptance Criteria

The system is accepted when:

1. The user can run `start_oceansense.ps1`.
2. The backend starts successfully.
3. The frontend starts successfully.
4. The dashboard opens at `http://localhost:8501`.
5. The user can run a forecast.
6. The forecast returns ENSO values.
7. The forecast returns water-level values.
8. The forecast returns flood risk labels.
9. Alerts appear for YELLOW or RED results.
10. The API docs are available at `http://127.0.0.1:8000/docs`.

These criteria have been met in the local verification.

---

## 19. Summary of Work Completed

We completed the following:

- Created the full OceanSense project folder.
- Built FastAPI backend.
- Built Streamlit frontend.
- Added SQLite database support.
- Added ML model wrappers.
- Added model artifact export script.
- Exported real model artifacts.
- Added flood risk logic.
- Added alert generation.
- Added startup and stop scripts.
- Added Docker files.
- Added tests.
- Installed dependencies.
- Verified the backend.
- Verified the frontend.
- Opened the dashboard locally.

---

## 20. Quick Command Reference

Start:

```powershell
cd "C:\Users\Yaad\Documents\fine tune\oceansense"
.\start_oceansense.ps1
```

Stop:

```powershell
cd "C:\Users\Yaad\Documents\fine tune\oceansense"
.\stop_oceansense.ps1
```

Run tests:

```powershell
cd "C:\Users\Yaad\Documents\fine tune\oceansense"
.\.venv\Scripts\python.exe -m pytest -q
```

Export models again:

```powershell
cd "C:\Users\Yaad\Documents\fine tune\oceansense"
.\.venv\Scripts\python.exe scripts\export_models.py
```

Open dashboard:

```text
http://localhost:8501
```

Open API docs:

```text
http://127.0.0.1:8000/docs
```
