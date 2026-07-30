"use client";
import { HumidityChart } from "@/components/charts/HumidityChart";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import PageWrapper from "@/components/layout/PageWrapper";
import { useHistoryData } from "@/hooks/useHistoryData";
import { historyStore } from "@/observer/history-store-instance";
import { ApiPeriods } from "@/types/history.types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [period, setPeriod] = useState<ApiPeriods>("1d");
  const { data, loading, error, noData } = useHistoryData(period);

  useEffect(() => {
    if (!data?.data) return;
    historyStore.setData(data?.data);
  }, [data]);

  return (
    <PageWrapper>
      <section className="animate-fade-in">
        <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/dashboard" className="transition-colors hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-zinc-200">Histórico</span>
        </div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <i className="ph ph-chart-line-up text-3xl" />
            Histórico
          </h1>
          <div className="mb-6 flex items-center gap-4">
            <label htmlFor="period" className="text-sm font-medium text-zinc-300">Período</label>
            <select
              id="period" value={period}
              onChange={(e) => setPeriod(e.target.value as ApiPeriods)}
              disabled={loading}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white outline-none transition hover:border-zinc-500 focus:border-blue-500"
            >
              <option value="1h">Última hora</option>
              <option value="6h">Últimas 6 horas</option>
              <option value="12h">Últimas 12 horas</option>
              <option value="1d">Último día</option>
              <option value="3d">Últimos 3 días</option>
              <option value="7d">Últimos 7 días</option>
            </select>
            {loading && <i className="ph ph-spinner-gap animate-spin text-xl text-blue-400" />}
          </div>
        </div>
        {noData ? (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-lg text-center">
            <i className="ph ph-database text-5xl text-zinc-500" />
            <h2 className="text-xl font-semibold">No hay datos históricos</h2>
            <p className="mt-2 text-zinc-400">No se encontraron mediciones para el período seleccionado.</p>
          </div>
        ) : (
          <div className="my-6 flex flex-col gap-6">
            <TemperatureChart />
            <HumidityChart />
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
