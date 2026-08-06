# ============================================================
# OceanSense API image (FastAPI + ML inference)
# ============================================================
FROM python:3.11-slim AS api

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY api ./api
COPY models ./models
COPY data ./data
COPY scripts ./scripts

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]

# ============================================================
# Frontend build stage (React + Vite)
# ============================================================
FROM node:20-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --no-audit --no-fund

COPY frontend/ .
RUN npm run build

# ============================================================
# Frontend runtime image (static files served by nginx)
# ============================================================
FROM nginx:1.27-alpine AS frontend

COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
