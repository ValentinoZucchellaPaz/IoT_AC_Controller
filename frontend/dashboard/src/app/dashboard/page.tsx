import { AlertBadge } from "@/components/widgets/AlertBadge";
import { AmbientBackground } from "@/components/widgets/AmbientBackground";
import LatestReadingCard from "@/components/widgets/LatestReadingCard";
import PageWrapper from "@/components/layout/PageWrapper";
import { SensorDataProvider } from "@/contexts/sensor-data";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <PageWrapper>
      <h1 className="sr-only">Panel de control</h1>
      <SensorDataProvider>
        <AmbientBackground />
        <section className="space-y-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
            <span className="text-zinc-200">Dashboard</span>
            <span>/</span>
            <Link href="/history" className="transition-colors hover:text-white">
              Histórico
            </Link>
          </div>
          <LatestReadingCard />
          <AlertBadge />
        </section>
      </SensorDataProvider>
    </PageWrapper>
  );
}