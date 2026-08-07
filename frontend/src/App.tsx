import { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Toast } from './components/common/Toast';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/common/ScrollProgress';
import SmoothScroll from './components/layout/SmoothScroll';
import LoadingSpinner from './components/common/LoadingSpinner';
import Landing from './pages/Landing';
import About from './pages/About';
import DashboardLayout from './components/dashboard/DashboardLayout';

const Overview = lazy(() => import('./pages/Dashboard/Overview'));
const EnsoForecast = lazy(() => import('./pages/Dashboard/EnsoForecast'));
const WaterLevel = lazy(() => import('./pages/Dashboard/WaterLevel'));
const ManualPrediction = lazy(() => import('./pages/Dashboard/ManualPrediction'));
const RiskMap = lazy(() => import('./pages/Dashboard/RiskMap'));
const Alerts = lazy(() => import('./pages/Dashboard/Alerts'));
const Advisory = lazy(() => import('./pages/Dashboard/Advisory'));
const ForecastHistory = lazy(() => import('./pages/Dashboard/ForecastHistory'));

const PageFallback = () => (
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner size="lg" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route
            path="overview"
            element={
              <Suspense fallback={<PageFallback />}>
                <Overview />
              </Suspense>
            }
          />
          <Route
            path="forecast"
            element={
              <Suspense fallback={<PageFallback />}>
                <EnsoForecast />
              </Suspense>
            }
          />
          <Route
            path="water-level"
            element={
              <Suspense fallback={<PageFallback />}>
                <WaterLevel />
              </Suspense>
            }
          />
          <Route
            path="manual"
            element={
              <Suspense fallback={<PageFallback />}>
                <ManualPrediction />
              </Suspense>
            }
          />
          <Route
            path="risk-map"
            element={
              <Suspense fallback={<PageFallback />}>
                <RiskMap />
              </Suspense>
            }
          />
          <Route
            path="alerts"
            element={
              <Suspense fallback={<PageFallback />}>
                <Alerts />
              </Suspense>
            }
          />
          <Route
            path="advisory"
            element={
              <Suspense fallback={<PageFallback />}>
                <Advisory />
              </Suspense>
            }
          />
          <Route
            path="history"
            element={
              <Suspense fallback={<PageFallback />}>
                <ForecastHistory />
              </Suspense>
            }
          />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SmoothScroll>
          <BrowserRouter>
            <div className="min-h-screen">
              <Navbar />
              <ScrollProgress />
              <Toast />
              <AnimatedRoutes />
            </div>
          </BrowserRouter>
        </SmoothScroll>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
