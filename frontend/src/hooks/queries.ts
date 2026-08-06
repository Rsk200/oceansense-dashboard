import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ensoApi, waterLevelApi, alertsApi } from '../services/api';
import { saveEnsoForecast, saveWaterLevelForecast } from '../stores/forecastHistory';
import type {
  EnsoScenarioRequest,
  WaterLevelRequest,
  ManualWaterLevelRequest,
} from '../types';

export const useEnsoPredict = () => {
  return useQuery({
    queryKey: ['enso', 'predict'],
    queryFn: async () => {
      const data = await ensoApi.predict();
      saveEnsoForecast(data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useEnsoScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EnsoScenarioRequest) => {
      const data = await ensoApi.scenario(payload);
      // Auto-propagate to water-level so the whole dashboard updates live
      await waterLevelApi.forecast({
        station_id: 'all',
        mode: 'scenario',
        forecast_year: payload.forecast_year,
        enso_values: data.forecast.map(p => p.nino34),
      });
      return data;
    },
    onSuccess: (data) => {
      saveEnsoForecast(data);
      queryClient.invalidateQueries({ queryKey: ['enso'] });
      queryClient.invalidateQueries({ queryKey: ['water-level'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['advisory'] });
    },
  });
};

export const useWaterLevelForecast = (payload: WaterLevelRequest) => {
  return useQuery({
    queryKey: ['water-level', 'forecast', payload],
    queryFn: async () => {
      const data = await waterLevelApi.forecast(payload);
      saveWaterLevelForecast(data, payload.station_id);
      return data;
    },
    enabled: payload.mode === 'auto' && !!payload.station_id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useWaterLevelScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WaterLevelRequest) => waterLevelApi.forecast(payload),
    onSuccess: (data, variables) => {
      saveWaterLevelForecast(data, variables.station_id);
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['advisory'] });
      queryClient.invalidateQueries({ queryKey: ['water-level'] });
    },
  });
};

export const useManualWaterLevelForecast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ManualWaterLevelRequest) => waterLevelApi.manualForecast(payload),
    onSuccess: (data, variables) => {
      saveWaterLevelForecast(data, variables.station_id);
      queryClient.invalidateQueries({ queryKey: ['water-level'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['advisory'] });
    },
  });
};

export const useFloodRisk = () => {
  return useQuery({
    queryKey: ['alerts', 'flood-risk'],
    queryFn: alertsApi.floodRisk,
    refetchInterval: 60000,
  });
};

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: alertsApi.alerts,
    refetchInterval: 60000,
  });
};

export const useAdvisory = () => {
  return useQuery({
    queryKey: ['advisory'],
    queryFn: alertsApi.advisory,
    refetchInterval: 60000,
  });
};

/** Bootstrap initial forecast data when dashboard has no prior runs */
export const useBootstrapForecast = () => {
  const queryClient = useQueryClient();
  const hasBootstrapped = useRef(false);
  const { data: floodRisk, isLoading } = useFloodRisk();

  const bootstrapMutation = useMutation({
    mutationFn: () =>
      waterLevelApi.forecast({
        station_id: 'all',
        mode: 'auto',
        forecast_year: 2026,
      }),
    onSuccess: (data) => {
      saveWaterLevelForecast(data, 'all');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['advisory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', 'flood-risk'] });
    },
  });

  const needsBootstrap =
    !isLoading &&
    floodRisk &&
    floodRisk.every((station) => station.predicted_water_level_m === null);

  useEffect(() => {
    if (needsBootstrap && !hasBootstrapped.current && !bootstrapMutation.isPending) {
      hasBootstrapped.current = true;
      bootstrapMutation.mutate();
    }
  }, [needsBootstrap, bootstrapMutation]);

  return {
    isBootstrapping: bootstrapMutation.isPending,
    hasBootstrapped: !needsBootstrap || bootstrapMutation.isSuccess,
  };
};
