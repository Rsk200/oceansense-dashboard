# OceanSense Dashboard (Frontend)

React 19 + TypeScript + Vite dashboard for the OceanSense flood early warning system.

## Stack

- Vite + React 19 + TypeScript
- TanStack Query for server state
- Tailwind CSS (v3) for styling, with a glassmorphism/ocean-tech visual theme
- Recharts for charts, react-leaflet/Leaflet for the flood risk map
- Framer Motion for animation
- zustand for the toast notification store

## Development

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` and `/health` requests to `http://localhost:8000` (configured in `vite.config.ts`), so make sure the FastAPI backend is running first.

## Build

```bash
npm run build
```

Type-checks with `tsc -b` and produces an optimized, code-split production build in `dist/`.

## Lint

```bash
npm run lint
```

## Project structure

```
src/
  components/
    common/      # Toast, ErrorBoundary, LoadingSpinner, LineChart, RiskMapLeaflet
    dashboard/   # DashboardLayout
    landing/     # Landing page sections (Hero, AIPipeline, Capabilities, etc.)
    layout/      # Navbar, Footer, Sidebar
    ui/          # Button, Card, Badge primitives
  hooks/         # TanStack Query hooks (queries.ts)
  pages/
    Dashboard/   # Overview, EnsoForecast, WaterLevel, ManualPrediction, RiskMap, Alerts, Advisory, ForecastHistory
    Landing.tsx
  services/      # api.ts — typed Axios client for the FastAPI backend
  stores/        # forecastHistory.ts — persists forecast runs to localStorage
  types/         # Shared TypeScript types mirroring backend Pydantic schemas
  utils/         # helpers.ts — formatting, CSV export, debounce/throttle
```

There is no authentication in this application by design.
