"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Zap, Loader2, Gauge } from "lucide-react";
import { HistoryData, HistoryObserver } from "@/types/history.types";
import { historyStore } from "@/observer/history-store-instance";
import { EFFICIENCY_META } from "./efficiency-plugin";

const LEVELS = [2, 1, 0] as const;

export function EfficiencyChart() {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);

  useEffect(() => {
    const observer: HistoryObserver = {
      update(data) {
        setHistoryData(data);
      },
    };

    historyStore.subscribe(observer);

    return () => {
      historyStore.unsubscribe(observer);
    };
  }, []);

  const periods = historyData?.period_efficiency ?? null;

  const [showEffInfo, setShowEffInfo] = useState(false);

  const highCount = useMemo(
    () => periods?.filter((p) => p.efficiency === 2).length ?? 0,
    [periods],
  );

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const columnCount = periods?.length ?? 0;
  const gridColumns =
    columnCount > 0
      ? `repeat(${columnCount}, minmax(68px, 1fr))`
      : undefined;
  const gridMinWidth =
    columnCount > 0 ? `max(${columnCount * 68}px, 100%)` : undefined;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex justify-between items-center w-full">
        <h3 className="font-display text-base font-semibold flex items-center gap-2 text-white">
          <Zap className="h-5 w-5 text-emerald-400" />
          Eficiencia Energética
        </h3>
        <div className="relative inline-flex">
          <button
            onClick={() => {
              if (window.innerWidth >= 768) return;
              setShowEffInfo((prev) => !prev);
            }}
            onMouseEnter={() => {
              if (window.innerWidth >= 768) setShowEffInfo(true);
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 768) setShowEffInfo(false);
            }}
            onFocus={() => setShowEffInfo(true)}
            onBlur={() => setShowEffInfo(false)}
            className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] text-white/60 hover:text-white/90 transition-colors"
            aria-label="Más información sobre la eficiencia"
            aria-expanded={showEffInfo}
            aria-haspopup="dialog"
          >
            ?
          </button>
          <div
            className={`absolute bottom-full right-0 mb-2 w-56 p-2 rounded-lg bg-slate-800/95 border border-white/10 text-[10px] text-white/70 leading-relaxed z-10 transition-all duration-200 ${
              showEffInfo
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none"
            }`}
          >
            Eficiencia del AC: estando ENCENDIDO, cuánto tardó en alcanzar la
            temperatura deseada. Verde = &lt;10 min, Naranja = &lt;30 min,
            Rojo = &gt;30 min.
          </div>
        </div>
      </div>
    </div>

      <div
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-lg w-full h-[300px] flex flex-col"
        aria-label="Panel de eficiencia energética por período"
      >
        {!periods ? (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <Loader2 className="h-9 w-9 animate-spin text-white mb-2 mx-auto" />
            <p className="text-sm font-medium tracking-wide">
              Esperando datos...
            </p>
          </div>
        ) : columnCount > 0 ? (
          <div className="animate-in fade-in duration-500 flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-x-auto">
              <div
                className="grid h-full"
                style={{
                  gridTemplateColumns: gridColumns,
                  gridTemplateRows: "repeat(3, 1fr) auto",
                  gridAutoFlow: "column",
                  minWidth: gridMinWidth,
                }}
              >
                {periods.map((period, index) => {
                  const meta =
                    EFFICIENCY_META[period.efficiency] ?? EFFICIENCY_META[1];
                  const label = `${formatTime(period.from)} a ${formatTime(period.to)} · ${meta.label}`;
                  return (
                    <React.Fragment key={`${period.from}-${index}`}>
                      {LEVELS.map((level) => {
                        const lit = period.efficiency === level;
                        return (
                          <div
                            key={level}
                            title={label}
                            aria-label={label}
                            className="flex items-center justify-center"
                          >
                            <span
                              className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border transition-colors ${
                                lit
                                  ? `${meta.dotClass} ${meta.borderClass}`
                                  : "border-white/15 bg-transparent"
                              }`}
                            />
                          </div>
                        );
                      })}
                      <span className="flex flex-col items-center text-[10px] leading-tight text-white/40 whitespace-nowrap pt-1">
                        <span>{formatDate(period.from)}</span>
                        <span>
                          {formatTime(period.from)} a {formatTime(period.to)}
                        </span>
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs border-t border-white/10 pt-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/60">
                {LEVELS.map((level) => {
                  const meta = EFFICIENCY_META[level];
                  return (
                    <span key={level} className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                      {meta.label} · {meta.detail}
                    </span>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-white/50">Alta en</span>
                <span className="font-display text-base font-bold text-emerald-300">
                  {highCount}
                </span>
                <span className="text-white/50">
                  de {columnCount} períodos
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <Gauge className="h-9 w-9 text-white/30 mb-3 mx-auto" />
            <p className="text-sm font-medium tracking-widest uppercase">
              Sin datos de eficiencia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}