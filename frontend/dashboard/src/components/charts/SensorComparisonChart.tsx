"use client";

import React, { useEffect, useState } from "react";
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
import { HistoryData, HistoryObserver } from "@/types/history.types";
import { historyStore } from "@/observer/history-store-instance";

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

  const labels = historyData?.period_efficiency.map((item) => {
    const fromDate = new Date(item.from);
    const toDate = new Date(item.to);
    const formatTime = (d: Date) =>
      d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    return `${formatTime(fromDate)} a ${formatTime(toDate)}`;
  });

  const dataValues = historyData?.period_efficiency.map(
    (item) => item.efficiency,
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Nivel de Eficiencia",
        data: dataValues,
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
        ticks: { color: "rgba(255,255,255,0.6)", font: { size: 10 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <h3 className="text-base font-semibold flex items-center gap-2 text-white">
          <i className="ph ph-lightning text-xl text-emerald-400"></i>{" "}
          Eficiencia Energética
        </h3>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-4 shadow-lg w-full h-[250px] relative flex flex-col justify-center">
        {!historyData?.period_efficiency ? (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <i className="ph ph-spinner-gap animate-spin text-4xl mb-2 text-white"></i>
            <p className="text-sm font-medium tracking-wide">
              Esperando datos...
            </p>
          </div>
        ) : historyData?.period_efficiency.length > 0 ? (
          <div className="relative w-full h-full animate-fade-in">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/70 h-full">
            <i className="ph ph-chart-bar text-4xl text-white/30 mb-3"></i>
            <p className="text-sm font-medium tracking-widest uppercase">
              Sin datos de eficiencia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
