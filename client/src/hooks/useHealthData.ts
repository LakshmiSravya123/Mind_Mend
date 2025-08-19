import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { HealthMetric, MoodEntry, Insight, MoodCorrelation } from "@/types/health";

export function useHealthMetrics(limit = 50) {
  return useQuery<HealthMetric[]>({
    queryKey: ['/api/health/metrics', limit],
  });
}

export function useLatestHealthMetric() {
  return useQuery<HealthMetric>({
    queryKey: ['/api/health/metrics/latest'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useSimulateHealthData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/health/simulate');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health/metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/health/metrics/latest'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mood/current'] });
    },
  });
}

export function useMoodEntries(days = 30) {
  return useQuery<MoodEntry[]>({
    queryKey: ['/api/mood/entries', days],
  });
}

export function useCurrentMood() {
  return useQuery<MoodEntry>({
    queryKey: ['/api/mood/current'],
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useAnalyzeMood() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/mood/analyze');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mood/entries'] });
    },
  });
}

export function useMoodCorrelations() {
  return useQuery<MoodCorrelation[]>({
    queryKey: ['/api/mood/correlations'],
  });
}

export function useInsights() {
  return useQuery<Insight[]>({
    queryKey: ['/api/insights'],
  });
}

export function useGenerateInsights() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/insights/generate');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/insights'] });
    },
  });
}
