"use client";

import React from "react";
import { useSensorPolling } from "@/hooks/useSensorPolling";
import { Power, Snowflake, Flame, CheckCircle } from "lucide-react";

interface SafePayload {
  data?: {
    sensor?: {
      ac_state?: boolean;
      avg_temperature?: number;
      desired_temperature?: number;
      target_temperature?: number;
      ts_end?: string;
    };
    connectivity: {
      status?: boolean;
      ts_end?: string;
    };
  };
  timestamp?: string;
}

export function AlertBadge() {
  const { data, loading, error } = useSensorPolling(60000);

  let bgColor = "bg-white/5";
  let borderColor = "border-white/10";
  let textColor = "text-white/70";
  let dotColor = "bg-white/70";

  let AlertIcon = Power;
  let title = "Sincronizando";
  let message = "Conectando con el equipo...";

  const safeData = data as unknown as SafePayload;
  const apiTimestamp = safeData?.data?.connectivity?.ts_end;

  if (error) {
    bgColor = "bg-red-500/10";
    borderColor = "border-red-400/20";
    textColor = "text-red-300";
    dotColor = "bg-red-400";

    title = "Alerta Crítica";
    message = "Se perdió la conexión con el ESP32";
  } else if (safeData) {
    const isPowerOn = safeData?.data?.sensor?.ac_state;
    const currentTemp = safeData?.data?.sensor?.avg_temperature;
    const targetTemp = safeData?.data?.sensor?.desired_temperature ?? 24;

    if (!isPowerOn) {
      AlertIcon = Power;
      bgColor = "bg-zinc-500/10";
      borderColor = "border-zinc-400/20";
      textColor = "text-zinc-300";
      dotColor = "bg-zinc-400";

      title = "Sistema Apagado";
      message = "El equipo se encuentra sin actividad.";
    } else if (currentTemp && currentTemp >= targetTemp + 1) {
      AlertIcon = Snowflake;
      bgColor = "bg-sky-500/10";
      borderColor = "border-sky-400/20";
      textColor = "text-sky-300";
      dotColor = "bg-sky-400";

      title = "Sistema Activo";
      message = `Enfriando la habitación hasta los ${targetTemp}°C.`;
    } else if (currentTemp && currentTemp <= targetTemp - 1) {
      AlertIcon = Flame;
      bgColor = "bg-red-500/10";
      borderColor = "border-red-400/20";
      textColor = "text-red-300";
      dotColor = "bg-red-400";

      title = "Sistema Activo";
      message = `Calentando la habitación hasta los ${targetTemp}°C.`;
    } else {
      AlertIcon = CheckCircle;
      bgColor = "bg-emerald-500/10";
      borderColor = "border-emerald-400/20";
      textColor = "text-emerald-300";
      dotColor = "bg-emerald-400";

      title = "En Reposo";
      message = `Temperatura ideal alcanzada (${currentTemp}°C).`;
    }
  }

  return (
    <div
      className={`
        ${borderColor}
        ${bgColor}
        border
        rounded-3xl
        p-5
        flex
        items-center
        gap-5
        w-full
        min-h-[160px]
        backdrop-blur-sm
        shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        transition-all
        duration-500
      `}
    >
      <div
        className={`
          w-16
          h-16
          shrink-0
          rounded-full
          flex
          items-center
          justify-center
          bg-black/30
          backdrop-blur-sm
          border
          border-white/10
          ${textColor}
        `}
      >
        <AlertIcon size={30} />
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />

          <h4
            className={`
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              ${textColor}
            `}
          >
            {title}
          </h4>
        </div>

        <p className="text-sm leading-relaxed text-white/90">{message}</p>

        {apiTimestamp && !error && (
          <p className="mt-3 text-xs text-zinc-400">
            Último ping:{" "}
            {new Date(apiTimestamp)
              .toISOString()
              .replace("T", " ")
              .slice(0, 19)}
          </p>
        )}
      </div>
    </div>
  );
}
