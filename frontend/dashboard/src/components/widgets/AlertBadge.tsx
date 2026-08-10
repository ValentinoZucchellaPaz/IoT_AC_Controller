"use client";

import { Power, Snowflake, CheckCircle, type LucideIcon } from "lucide-react";
import { useSensorData } from "@/contexts/sensor-data";
import { LastUpdated } from "@/components/widgets/LastUpdated";
import { PollingIntervalControl } from "@/components/widgets/PollingIntervalControl";
import type { SensorResponseDTO } from "@/types/sensor.types";

interface AlertState {
  Icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  textColor: string;
  dotColor: string;
  title: string;
  message: string;
}

const CONNECTING_STATE: AlertState = {
  Icon: Power,
  bgColor: "bg-white/5",
  borderColor: "border-white/10",
  textColor: "text-white/70",
  dotColor: "bg-white/70",
  title: "Sincronizando",
  message: "Conectando con el equipo...",
};

function buildState({
  error,
  sensor,
  isPowerOn,
}: {
  error: Error | null;
  sensor: SensorResponseDTO["data"]["sensor"] | undefined;
  isPowerOn: boolean;
}): AlertState {
  if (error) {
    return {
      Icon: Power,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-400/20",
      textColor: "text-red-300",
      dotColor: "bg-red-400",
      title: "Alerta Crítica",
      message: "Se perdió la conexión con el ESP32",
    };
  }

  if (!sensor) {
    return CONNECTING_STATE;
  }

  const currentTemp = sensor.avg_temperature;
  const targetTemp = sensor.desired_temperature ?? 24;

  if (!isPowerOn) {
    return {
      Icon: Power,
      bgColor: "bg-zinc-500/10",
      borderColor: "border-zinc-400/20",
      textColor: "text-zinc-300",
      dotColor: "bg-zinc-400",
      title: "Apagado",
      message: "El equipo se encuentra sin actividad.",
    };
  }

  if (currentTemp && currentTemp >= targetTemp + 1) {
    return {
      Icon: Snowflake,
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-400/20",
      textColor: "text-sky-300",
      dotColor: "bg-sky-400",
      title: "Enfriando",
      message: `Enfriando la habitación hasta los ${targetTemp}°C.`,
    };
  }

  return {
    Icon: CheckCircle,
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-400/20",
    textColor: "text-emerald-300",
    dotColor: "bg-emerald-400",
    title: "En Reposo",
    message: `Temperatura ideal alcanzada (${currentTemp}°C).`,
  };
}

export function AlertBadge() {
  const { data, error } = useSensorData();

  const sensor = data?.data?.sensor;
  const isPowerOn = sensor?.ac_state ?? false;
  const { Icon, bgColor, borderColor, textColor, title, message } = buildState({
    error,
    sensor,
    isPowerOn,
  });
  const heading = sensor && isPowerOn ? `Encendido - ${title}` : title;

  return (
    <div
      className={`
        ${bgColor}
        ${borderColor}
        border
        rounded-3xl
        p-5
        sm:p-6
        flex
        items-center
        gap-4
        sm:gap-6
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
          relative
          shrink-0
          w-14
          h-14
          sm:w-16
          sm:h-16
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
        <Icon size={30} />
      </div>

      <div className="min-w-0 flex-1">
        <h4
          className={`text-xs font-semibold uppercase tracking-[0.25em] ${textColor}`}
        >
          {heading}
        </h4>

        <p className="mt-1 text-sm leading-relaxed text-white/90">{message}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/10 pt-4">
          <LastUpdated />
          <PollingIntervalControl />
        </div>
      </div>
    </div>
  );
}
