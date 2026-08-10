'use client';

import { useState, useEffect } from 'react';
import { SensorsService } from '@/services/sensors.service';
import type { SensorResponseDTO } from '@/types/sensor.types';

export interface SensorPollingState {
  data: SensorResponseDTO | null;
  loading: boolean;
  error: Error | null;
  intervalMs: number;
}

const DEFAULT_INTERVAL_MS = 60000;

export function useSensorPolling(
  intervalMs: number = DEFAULT_INTERVAL_MS
): SensorPollingState {
  const [data, setData] = useState<SensorResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await SensorsService.getLatestReading();

        if (cancelled) return;

        setData(response);
        setError(null);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err
            : new Error(String(err))
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  return {
    data,
    loading,
    error,
    intervalMs,
  };
}