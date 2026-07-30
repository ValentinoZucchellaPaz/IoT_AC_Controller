"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { HistoryData, HistoryObserver } from "@/types/history.types";
import { historyStore } from "@/observer/history-store-instance";
import { createGapPlugin, detectGaps } from "./gap-plugin";
import {
  createEfficiencyPlugin,
  computeEfficiencyRanges,
} from "./efficiency-plugin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export function TemperatureChart() {
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

  const [showEffInfo, setShowEffInfo] = useState(false);

  const gapIndices = useMemo(
    () => (historyData?.samples ? detectGaps(historyData.samples) : []),
    [historyData],
  );
  const gapPlugin = useMemo(() => createGapPlugin(gapIndices), [gapIndices]);

  const chartKey = historyData?.samples
    ? `${historyData.samples.length}-${historyData.samples[0]?.ts_end}-${historyData.samples.at(-1)?.ts_end}`
    : "empty";

  const effRanges = useMemo(
    () =>
      historyData?.samples && historyData?.period_efficiency
        ? computeEfficiencyRanges(
            historyData.samples,
            historyData.period_efficiency,
          )
        : [],
    [historyData],
  );
  const effPlugin = useMemo(
    () => createEfficiencyPlugin(effRanges),
    [effRanges],
  );

  const labels = historyData?.samples.map((item) => {
    const timestamp = item.ts_end || item.created_at;
    const date = new Date(timestamp || new Date());
    return `${date.getDate()}/${date.getMonth() + 1} - ${date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Promedio (°C)",
        data: historyData?.samples.map((item) => item.avg_temperature ?? 24),
        borderColor: "#ffffff",
        borderWidth: 3,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "transparent",
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(239, 68, 68, 0.4)");
          gradient.addColorStop(1, "rgba(239, 68, 68, 0.0)");
          return gradient;
        },
      },
      {
        label: "Máxima (°C)",
        data: historyData?.samples.map((item) => item.max_temperature ?? 24),
        borderColor: "rgba(255, 100, 100, 0.5)",
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      },
      {
        label: "Mínima (°C)",
        data: historyData?.samples.map((item) => item.min_temperature ?? 24),
        borderColor: "rgba(100, 200, 255, 0.5)",
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        displayColors: true,
        callbacks: {
          labelColor(context: TooltipItem<"line">) {
            const colors: Record<string, string> = {
              "Promedio (°C)": "#ffffff",
              "Máxima (°C)": "rgba(255,100,100,0.85)",
              "Mínima (°C)": "rgba(100,200,255,0.85)",
            };
            const c = colors[context.dataset.label ?? ""] || "#ffffff";
            return { borderColor: c, backgroundColor: c };
          },
          afterBody(tooltipItems: TooltipItem<"line">[]) {
            const index = tooltipItems[0].dataIndex;
            const sample = historyData?.samples[index];
            if (!sample) return [];
            return [`Temp deseada: ${sample.desired_temperature}°C`];
          },
        },
      },
    },
    scales: {
      y: {
        ticks: { color: "rgba(255,255,255,0.6)", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.05)" },
        border: { dash: [4, 4] },
        suggestedMin: 15,
        suggestedMax: 35,
      },
      x: {
        ticks: {
          color: "rgba(255,255,255,0.6)",
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          autoSkipPadding: 30,
          maxTicksLimit: 15,
        },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  // render
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <h3 className="text-base font-semibold flex items-center gap-2 text-white">
          <i className="ph ph-drop text-xl text-blue-400"></i> Temperatura
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-white/60">
          <span className="text-white/40">Eficiencia:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500/30" />
            Alta
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500/30" />
            Media
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500/30" />
            Baja
          </span>
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
              className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] text-white/60 hover:text-white/90 transition-colors"
              aria-label="Info eficiencia"
            >
              ?
            </button>
            <div
              className={`absolute bottom-full right-0 mb-2 w-56 p-2 rounded-lg bg-slate-800/95 border border-white/10 text-[10px] text-white/70 leading-relaxed z-10 transition-all duration-200
              ${showEffInfo ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
            >
              Eficiencia del AC: estando ENCENDIDO, cuánto tardó en alcanzar la
              temperatura deseada. Verde = &lt;10 min, Naranja = &lt;30 min,
              Rojo = &gt;30 min.
            </div>
          </div>
        </div>
      </div>
      {/* Graph */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.25)] w-full h-[300px] relative flex flex-col justify-center">
        {!historyData?.samples ? (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <i className="ph ph-spinner-gap animate-spin text-4xl mb-2 text-white"></i>
            <p className="text-sm font-medium tracking-wide">
              Esperando datos...
            </p>
          </div>
        ) : historyData?.samples?.length > 0 ? (
          <div className="relative w-full h-full">
            <Line
              key={chartKey}
              data={chartData}
              options={chartOptions}
              plugins={[effPlugin, gapPlugin]}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <i className="ph ph-chart-line text-4xl text-white/30 mb-3"></i>
            <p className="text-sm font-medium tracking-widest uppercase">
              Esperando historial...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
