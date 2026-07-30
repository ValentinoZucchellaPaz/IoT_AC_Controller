"use client";

import { useState, useCallback, useRef } from "react";
import { Minus, Plus, Check, Loader2 } from "lucide-react";
import styles from "./LatestReadingCard.module.css";
import { useSensorPolling } from "@/hooks/useSensorPolling";
import { SensorsService } from "@/services/sensors.service";
import type { SensorResponseDTO } from "@/types/sensor.types";

const MIN_TEMP = 15;
const MAX_TEMP = 32;

export default function LatestReadingCard() {
  const { data: responseData, loading, error } = useSensorPolling(60000);

  const sensor = responseData?.data?.sensor;
  const connectivity = responseData?.data?.connectivity;

  const deviceName = sensor?.device_id ?? "Mi ESP32 AC";
  const deviceStatus = connectivity?.status ?? true;
  const polledTargetTemp = sensor?.desired_temperature ?? 24;

  const polledRef = useRef(polledTargetTemp);
  polledRef.current = polledTargetTemp;

  const [pendingTemp, setPendingTemp] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [sentTemp, setSentTemp] = useState<number | null>(null);
  const [sendError, setSendError] = useState(false);

  const hasPending = pendingTemp !== null && pendingTemp !== polledTargetTemp;
  const wasSent = sentTemp !== null && sentTemp === pendingTemp && pendingTemp !== polledTargetTemp;
  const displayTemp = pendingTemp ?? polledTargetTemp;

  const adjustTemp = useCallback((delta: number) => {
    setSendError(false);
    setSentTemp(null);
    setPendingTemp((prev) => {
      const base = prev ?? polledRef.current;
      return Math.min(MAX_TEMP, Math.max(MIN_TEMP, base + delta));
    });
  }, []);

  const sendPending = useCallback(async () => {
    const temp = pendingTemp;
    if (temp === null || temp === polledTargetTemp) return;
    setSending(true);
    setSendError(false);
    try {
      await SensorsService.setDesiredTemperature(deviceName, temp);
      setSentTemp(temp);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  }, [pendingTemp, polledTargetTemp, deviceName]);
  const acState = sensor?.ac_state ?? false;
  const currentTemp = sensor?.avg_temperature ?? 24;
  const maxTemp = sensor?.max_temperature ?? 24;
  const minTemp = sensor?.min_temperature ?? 24;
  const humidity = sensor?.current_humidity ?? 45;

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

  if (loading || !sensor) {
    return (
      <div className="flex justify-center items-center p-8 bg-white/5 border border-white/10 rounded-3xl animate-pulse h-full min-h-[300px] w-full">
        <span className="text-white/50 text-sm font-medium tracking-widest uppercase">
          Conectando con ESP32...
        </span>
      </div>
    );
  }

  let fondoClass = styles.fondoDefault;
  if (acState) {
    if (currentTemp <= 20) {
      fondoClass = styles.fondoFrio;
    } else if (currentTemp <= 27) {
      fondoClass = styles.fondoCalido1;
    } else {
      fondoClass = styles.fondoCalido2;
    }
  }

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
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-4 flex flex-col">
            <div className="text-white/70 mb-1">
              <span className="text-xs uppercase tracking-widest font-semibold">
                Humedad
              </span>
            </div>
            <div className="flex items-baseline gap-1 text-white mt-1">
              <span className="text-4xl font-semibold">{humidity}</span>
              <span className="text-xl text-white/80">%</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/70 mb-2">
              <span className="text-xs uppercase tracking-widest font-semibold">
                Objetivo
              </span>
              {sendError && (
                <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">
                  Error
                </span>
              )}
              {wasSent && !sendError && (
                <span className="text-[10px] text-green-400 font-medium uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Enviado
                </span>
              )}
              {hasPending && !sending && !wasSent && !sendError && (
                <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
                  Pendiente
                </span>
              )}
              {sending && (
                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wider flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Enviando
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <div className="flex-1">
                <span
                  className={`text-4xl font-semibold transition-colors ${
                    sendError
                      ? "text-red-400"
                      : wasSent
                        ? "text-green-300"
                        : hasPending
                          ? "text-amber-300"
                          : "text-white"
                  }`}
                >
                  {displayTemp}°
                </span>
              </div>
              <button
                onClick={() => adjustTemp(-1)}
                disabled={sending || wasSent || displayTemp <= MIN_TEMP}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={() => adjustTemp(1)}
                disabled={sending || wasSent || displayTemp >= MAX_TEMP}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {wasSent && (
              <button
                disabled
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-green-700 py-2 text-sm font-semibold text-green-200 cursor-default"
              >
                <Check className="w-4 h-4" />
                Enviado
              </button>
            )}
            {sendError && (
              <button
                onClick={sendPending}
                disabled={sending}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-red-700 hover:bg-red-600 py-2 text-sm font-semibold text-white transition"
              >
                Reintentar
              </button>
            )}
            {hasPending && !wasSent && !sendError && (
              <button
                onClick={sendPending}
                disabled={sending}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Enviar cambio
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
