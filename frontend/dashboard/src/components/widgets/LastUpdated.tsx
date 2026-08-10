"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useSensorData } from "@/contexts/sensor-data";

function formatRelative(date: Date, now: Date): string {
  const diffSeconds = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
  if (diffSeconds < 60) return `hace ${diffSeconds}s`;
  const minutes = Math.floor(diffSeconds / 60);
  return `hace ${minutes}m`;
}

export function LastUpdated() {
  const { data, loading, error } = useSensorData();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const timestamp = data?.timestamp;
  const date = timestamp ? new Date(timestamp) : null;

  if (error) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-red-400" aria-live="polite">
        <RefreshCw className="h-3.5 w-3.5" />
        Sin conexión con el equipo
      </p>
    );
  }

  return (
    <p
      className="flex items-center gap-1.5 text-xs text-zinc-400"
      aria-live="polite"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${loading ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`} />
      {date ? `Actualizado ${formatRelative(date, now)}` : "Conectando con el equipo..."}
    </p>
  );
}