"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSensorPolling } from "@/hooks/useSensorPolling";
import type { SensorPollingState } from "@/hooks/useSensorPolling";

const SensorDataContext = createContext<SensorPollingState | null>(null);

export function SensorDataProvider({ children }: { children: ReactNode }) {
  const state = useSensorPolling(60000);
  return (
    <SensorDataContext.Provider value={state}>
      {children}
    </SensorDataContext.Provider>
  );
}

export function useSensorData(): SensorPollingState {
  const context = useContext(SensorDataContext);
  if (!context) {
    throw new Error("useSensorData must be used within a SensorDataProvider");
  }
  return context;
}