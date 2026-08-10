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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Droplets, Loader2, Waves } from "lucide-react";
import { HistoryData, HistoryObserver } from "@/types/history.types";
import { historyStore } from "@/observer/history-store-instance";
import { createGapPlugin, detectGaps } from "./gap-plugin";

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

export function HumidityChart() {
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

  const chartKey = historyData?.samples
    ? `${historyData.samples.length}-${historyData.samples[0]?.ts_end}-${historyData.samples.at(-1)?.ts_end}`
    : 'empty';

  const gapIndices = useMemo(
    () => (historyData?.samples ? detectGaps(historyData.samples) : []),
    [historyData],
  );
  const gapPlugin = useMemo(() => createGapPlugin(gapIndices), [gapIndices]);

  const labels = historyData?.samples.map((item) => {
    const timestamp = item.ts_end || item.created_at;
    const date = new Date(timestamp || new Date());
    return `${date.getDate()}/${date.getMonth() + 1} - ${date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Humedad Relativa (%)",
        data: historyData?.samples.map((s) => s.current_humidity),
        borderColor: "rgba(96, 165, 250, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(96, 165, 250, 1)",
        pointBorderColor: "transparent",
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(96, 165, 250, 0.4)");
          gradient.addColorStop(1, "rgba(96, 165, 250, 0.0)");
          return gradient;
        },
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
        bodyFont: { size: 14, weight: "bold" as const },
      },
    },
    scales: {
      y: {
        ticks: { color: "rgba(255,255,255,0.6)", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.05)" },
        border: { dash: [4, 4] },
        suggestedMin: 30,
        suggestedMax: 70,
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
    interaction: { intersect: false, mode: "index" as const },
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <h3 className="font-display text-base font-semibold flex items-center gap-2 text-white">
          <Droplets className="h-5 w-5 text-blue-400" /> Humedad Relativa
        </h3>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-4 shadow-lg w-full h-[250px] relative flex flex-col justify-center" aria-label="Gráfico de humedad relativa a lo largo del tiempo">
        {!historyData?.samples ? (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <Loader2 className="h-9 w-9 animate-spin text-white mb-2 mx-auto" />
            <p className="text-sm font-medium tracking-wide">
              Esperando datos...
            </p>
          </div>
        ) : historyData?.samples.length > 0 ? (
          <div className="relative w-full h-full animate-in fade-in duration-500">
            <Line key={chartKey} data={chartData} options={chartOptions} plugins={[gapPlugin]} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <Waves className="h-9 w-9 text-white/30 mb-3 mx-auto" />
            <p className="text-sm font-medium tracking-widest uppercase">
              Sin registros de humedad
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
