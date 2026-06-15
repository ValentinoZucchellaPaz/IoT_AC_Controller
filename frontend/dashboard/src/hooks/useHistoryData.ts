"use client";

import { useEffect, useState } from "react";
import { SensorsService } from "@/services/sensors.service";
import type { HistoryResponseDTO } from "@/types/sensor.types";
import { ApiPeriods } from "@/types/history.types";

interface HistoryDataState {
  data: HistoryResponseDTO | null;
  loading: boolean;
  error: Error | null;
  noData: boolean;
}

export function useHistoryData(period: ApiPeriods): HistoryDataState {
  const [data, setData] = useState<HistoryResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      setNoData(false);

      try {
        const response = await SensorsService.getHistory(period);

        if (cancelled) return;

        if (!response.success) {
          setData(null);
          setNoData(true);
          return;
        }

        setData(response);
      } catch (err) {
        if (cancelled) return;

        setData(null);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [period]);

  return {
    data,
    loading,
    error,
    noData,
  };
}
