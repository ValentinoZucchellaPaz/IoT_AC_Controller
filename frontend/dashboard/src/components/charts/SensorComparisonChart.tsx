"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Zap, Loader2, BarChart3 } from "lucide-react";
import { HistoryData, HistoryObserver } from "@/types/history.types";
import { historyStore } from "@/observer/history-store-instance";
import { createGapPlugin, detectGaps } from "./gap-plugin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function SensorComparisonChart() {
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

  const gapIndices = useMemo(
    () => (historyData?.period_efficiency ? detectGaps(
      historyData.period_efficiency.map((p) => ({
        ts_end: p.to,
        created_at: p.from,
      })),
    ) : []),
    [historyData],
  );
  const gapPlugin = useMemo(() => createGapPlugin(gapIndices), [gapIndices]);

  const labels = historyData?.period_efficiency.map((item) => {
    const fromDate = new Date(item.from);
    const toDate = new Date(item.to);
    const formatTime = (d: Date) =>
      d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    return `${formatTime(fromDate)} a ${formatTime(toDate)}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Nivel de Eficiencia",
        data: historyData?.period_efficiency.map((item) => item.efficiency),
        backgroundColor: "rgba(52, 211, 153, 0.7)",
        borderColor: "rgba(52, 211, 153, 1)",
        borderWidth: 1,
        borderRadius: 6,
        barThickness: "flex" as const,
        maxBarThickness: 40,
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
        ticks: {
          color: "rgba(255,255,255,0.6)",
          stepSize: 1,
          font: { size: 10 },
        },
        grid: { color: "rgba(255,255,255,0.05)" },
        beginAtZero: true,
      },
      x: {
        ticks: {
          color: "rgba(255,255,255,0.6)",
          font: { size: 10 },
          autoSkip: true,
          autoSkipPadding: 30,
          maxTicksLimit: 15,
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <h3 className="font-display text-base font-semibold flex items-center gap-2 text-white">
          <Zap className="h-5 w-5 text-emerald-400" />
          Eficiencia Energética
        </h3>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-4 shadow-lg w-full h-[250px] relative flex flex-col justify-center" aria-label="Gráfico de eficiencia energética por período">
        {!historyData?.period_efficiency ? (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <Loader2 className="h-9 w-9 animate-spin text-white mb-2 mx-auto" />
            <p className="text-sm font-medium tracking-wide">
              Esperando datos...
            </p>
          </div>
        ) : historyData?.period_efficiency.length > 0 ? (
          <div className="relative w-full h-full animate-in fade-in duration-500">
            <Bar data={chartData} options={chartOptions} plugins={[gapPlugin]} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <BarChart3 className="h-9 w-9 text-white/30 mb-3 mx-auto" />
            <p className="text-sm font-medium tracking-widest uppercase">
              Sin datos de eficiencia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
