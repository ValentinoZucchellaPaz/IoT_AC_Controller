"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useSensorPolling, type SensorPollingState } from "@/hooks/useSensorPolling";

export const POLLING_OPTIONS_MS = [5000, 10000, 30000, 60000, 300000] as const;

const DEFAULT_INTERVAL_MS = 60000;
const STORAGE_KEY = "sensor-polling-interval";

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): number {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const value = Number(raw);
    if ((POLLING_OPTIONS_MS as readonly number[]).includes(value)) {
      return value;
    }
  }
  return DEFAULT_INTERVAL_MS;
}

function getServerSnapshot(): number {
  return DEFAULT_INTERVAL_MS;
}

interface SensorDataContextValue extends SensorPollingState {
  setIntervalMs: (ms: number) => void;
}

const SensorDataContext = createContext<SensorDataContextValue | null>(null);

export function SensorDataProvider({ children }: { children: ReactNode }) {
  const intervalMs = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setIntervalMs = (ms: number) => {
    window.localStorage.setItem(STORAGE_KEY, String(ms));
    notifyListeners();
  };

  const state = useSensorPolling(intervalMs);

  return (
    <SensorDataContext.Provider value={{ ...state, setIntervalMs }}>
      {children}
    </SensorDataContext.Provider>
  );
}

export function useSensorData(): SensorDataContextValue {
  const context = useContext(SensorDataContext);
  if (!context) {
    throw new Error("useSensorData must be used within a SensorDataProvider");
  }
  return context;
}