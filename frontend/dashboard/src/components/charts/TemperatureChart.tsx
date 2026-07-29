"use client";

import React, { useEffect, useState } from "react";
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
import { HistoryData, HistoryObserver } from "@/types/history.types";
import { historyStore } from "@/observer/history-store-instance";

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

  const labels = historyData?.samples.map((item) => {
    const timestamp = item.ts_end || item.created_at;
    const date = new Date(timestamp || new Date());

    return `${date.getDate()}/${date.getMonth() + 1} - ${date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`;
  });

  const avgData = historyData?.samples.map((item) => item.avg_temperature ?? 24);

  const maxData = historyData?.samples.map((item) => item.max_temperature ?? 24);

  const minData = historyData?.samples.map((item) => item.min_temperature ?? 24);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Promedio (°C)",
        data: avgData,
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
        data: maxData,
        borderColor: "rgba(255, 100, 100, 0.5)",
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      },
      {
        label: "Mínima (°C)",
        data: minData,
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
        bodyFont: { size: 14, weight: "bold" as const },
        displayColors: true,
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
        },
        grid: { display: false },
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
      </div>
      {/* Graph */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.25)] w-full h-[250px] relative flex flex-col justify-center">
        {!historyData?.samples ? (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <i className="ph ph-spinner-gap animate-spin text-4xl mb-2 text-white"></i>
            <p className="text-sm font-medium tracking-wide">
              Esperando datos...
            </p>
          </div>
        ) : historyData?.samples?.length > 0 ? (
          <div className="relative w-full h-full">
            <Line data={chartData} options={chartOptions} />
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
