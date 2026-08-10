"use client";
import { HumidityChart } from "@/components/charts/HumidityChart";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { EfficiencyChart } from "@/components/charts/EfficiencyChart";
import PageWrapper from "@/components/layout/PageWrapper";
import { useHistoryData } from "@/hooks/useHistoryData";
import { historyStore } from "@/observer/history-store-instance";
import { ApiPeriods } from "@/types/history.types";
import { TrendingUp, Database, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [period, setPeriod] = useState<ApiPeriods>("1d");
  const { data, loading, error, noData, refresh } = useHistoryData(period);

  useEffect(() => {
    if (!data?.data) return;
    historyStore.setData(data?.data);
  }, [data]);

  return (
    <PageWrapper>
      <section className="animate-in fade-in duration-500">
        <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/dashboard" className="transition-colors hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-zinc-200">Histórico</span>
        </div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            <TrendingUp className="h-7 w-7" />
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
            {loading && <Loader2 className="h-5 w-5 animate-spin text-blue-400" />}
          </div>
        </div>
        {error ? (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/20 rounded-3xl p-8 shadow-lg text-center" role="alert">
            <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-red-400" />
            <h2 className="text-lg font-semibold">No se pudo cargar el histórico</h2>
            <p className="mt-1 text-sm text-red-300/80">
              Hubo un problema al contactar el equipo. Revisá la conexión e intentá de nuevo.
            </p>
            <button
              onClick={refresh}
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Reintentar
            </button>
          </div>
        ) : noData ? (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-lg text-center">
            <Database className="h-10 w-10 mx-auto mb-2 text-zinc-500" />
            <h2 className="text-xl font-semibold">No hay datos históricos</h2>
            <p className="mt-2 text-zinc-400">No se encontraron mediciones para el período seleccionado.</p>
          </div>
        ) : (
          <div className="my-6 flex flex-col gap-6">
            <TemperatureChart />
            <HumidityChart />
            <EfficiencyChart />
          </div>
        )}
      </section>
    </PageWrapper>
  );
}