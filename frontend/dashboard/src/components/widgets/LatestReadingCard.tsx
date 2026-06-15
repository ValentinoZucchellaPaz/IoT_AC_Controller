"use client";

import styles from "./LatestReadingCard.module.css";
import { useSensorPolling } from "@/hooks/useSensorPolling";

interface SafePayload {
  data?: {
    sensor?: {
      device_id?: string;
      ac_state?: boolean;
      avg_temperature?: number;
      min_temperature?: number;
      max_temperature?: number;
      desired_temperature?: number;
      current_humidity?: number;
      ts_end?: string;
    };
    connectivity: {
      status?: boolean;
      ts_end?: string;
    };
  };
  timestamp?: string;
}
export default function LatestReadingCard() {
  const { data: responseData, loading, error } = useSensorPolling(60000);

  // Casteamos la respuesta
  const safeResponse = responseData as unknown as SafePayload;

  // Leemos las variables en vivo y en directo
  const deviceName = safeResponse?.data?.sensor?.device_id ?? "Mi ESP32 AC";
  const deviceStatus = safeResponse?.data?.connectivity.status ?? true;
  const targetTemp = safeResponse?.data?.sensor?.desired_temperature ?? 24;
  const acState = safeResponse?.data?.sensor?.ac_state ?? false;
  const currentTemp = safeResponse?.data?.sensor?.avg_temperature ?? 24;
  const maxTemp = safeResponse?.data?.sensor?.max_temperature ?? 24;
  const minTemp = safeResponse?.data?.sensor?.min_temperature ?? 24;
  const humidity = safeResponse?.data?.sensor?.current_humidity ?? 45;

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 bg-red-900/20 border border-red-500/50 rounded-3xl h-full min-h-[300px] w-full">
        <div className="text-red-400 text-center">
          <i className="ph ph-warning-circle text-4xl mb-2"></i>
          <p className="text-sm font-bold tracking-wide">Error de conexión</p>
        </div>
      </div>
    );
  }

  // Corregido: Verificamos con safeResponse en vez del viejo sensorData
  if (loading || !safeResponse?.data?.sensor) {
    return (
      <div className="flex justify-center items-center p-8 bg-white/5 border border-white/10 rounded-3xl animate-pulse h-full min-h-[300px] w-full">
        <span className="text-white/50 text-sm font-medium tracking-widest uppercase">
          Conectando con ESP32...
        </span>
      </div>
    );
  }

  let fondoClass = "";
  if (currentTemp <= 20) {
    fondoClass = styles.fondoFrio;
  } else if (currentTemp >= 21 && currentTemp <= 27) {
    fondoClass = styles.fondoCalido1;
  } else if (currentTemp >= 28) {
    fondoClass = styles.fondoCalido2;
  }

  const statusText = acState ? "Encendido" : "Apagado";
  let circleTheme = "";

  if (!acState) {
    circleTheme = "bg-black/30 border-white/10 text-zinc-400 shadow-none";
  } else {
    if (currentTemp < 21) {
      circleTheme =
        "bg-sky-500/15 border-sky-400/30 text-sky-50 shadow-[0_0_60px_rgba(56,189,248,0.25)]";
    } else if (currentTemp <= 27) {
      circleTheme =
        "bg-amber-500/15 border-amber-400/30 text-amber-50 shadow-[0_0_60px_rgba(251,191,36,0.25)]";
    } else {
      circleTheme =
        "bg-red-500/15 border-red-400/30 text-red-50 shadow-[0_0_60px_rgba(239,68,68,0.25)]";
    }
  }

  return (
    <>
      {/* Dinamic background*/}
      <div className={`${styles.pageContainer} ${fondoClass}`} />

      {/* original widget*/}
      <div className="space-y-6 flex-1 flex flex-col animate-fade-in w-full mt-3">
        <div className="flex justify-between items-center w-full pb-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
              {deviceName}
            </h2>
            <p className="text-sm text-white/70 flex items-center gap-2 mt-1 font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  deviceStatus ? "bg-green-400" : "bg-red-400"
                } animate-pulse`}
              />

              <i
                className={`ph ph-wifi-high ${
                  deviceStatus ? "text-green-400" : "text-red-400"
                }`}
              />

              <span className="text-white/80">
                {deviceStatus ? "Conectado" : "Desconectado"}
              </span>
            </p>
          </div>
        </div>

        {/* <div className="flex justify-center py-2 flex-1 items-center">
          <div
            className={`relative w-60 h-60 sm:w-72 sm:h-72 rounded-full backdrop-blur-sm border ring-1 ring-white/5 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${circleTheme}`}
          >
            <span className="text-xs uppercase tracking-[0.2em] mb-1 font-semibold opacity-70">
              Sensor
            </span>
            <div className="flex items-start">
              <span className="text-7xl sm:text-8xl font-light tracking-tighter">
                {currentTemp}
              </span>
              <span className="text-3xl font-light mt-2 sm:mt-3">°C</span>
            </div>

            <div className="absolute bottom-6 flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 text-white/90">
              <i className="ph ph-thermometer text-lg"></i>
              <span className="font-medium text-sm">{statusText}</span>
            </div>
          </div>
        </div> */}
        <div className="flex justify-center py-2 flex-1 items-center">
          <div
            className={`relative w-60 h-60 sm:w-72 sm:h-72 rounded-full
  backdrop-blur-xl border ring-1 ring-white/5
  flex flex-col items-center justify-center
  transition-all duration-700 ease-in-out
  ${circleTheme}`}
          >
            {/* TOP: título */}
            <span className="absolute top-16 text-xs uppercase tracking-[0.25em] font-semibold opacity-60">
              Temperatura
            </span>

            {/* CENTER: temperatura (perfectamente centrada) */}
            <div className="flex items-start leading-none">
              <span className="text-7xl sm:text-8xl font-light tracking-tighter">
                {currentTemp}
              </span>
              <span className="text-2xl font-light mt-2">°C</span>
            </div>

            {/* BOTTOM: min/max + estado */}
            <div className="absolute bottom-6 flex flex-col items-center gap-1 text-[11px] text-white/50">
              {/* min / max */}
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400/60" />
                  {minTemp ?? "--"}°
                </span>

                <span className="opacity-30">|</span>

                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                  {maxTemp ?? "--"}°
                </span>
              </div>

              {/* estado */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    acState ? "bg-emerald-400/70" : "bg-zinc-500/60"
                  }`}
                />
                {acState ? "Encendido" : "Apagado"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-2">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-4 flex flex-col justify-between">
            <div className="text-white/70">
              <span className="text-xs uppercase tracking-widest font-semibold">
                Humedad
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-auto text-white">
              <span className="text-4xl font-semibold">{humidity}</span>
              <span className="text-xl text-white/80">%</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/70 mb-3">
              <div className="text-white/70">
                <span className="text-xs uppercase tracking-widest font-semibold">
                  Objetivo
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-auto text-white">
              <span className="text-4xl font-semibold">{targetTemp}°</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
