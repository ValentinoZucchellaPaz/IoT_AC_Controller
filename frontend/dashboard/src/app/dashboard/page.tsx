import { AlertBadge } from "@/components/widgets/AlertBadge";
import LatestReadingCard from "@/components/widgets/LatestReadingCard";
import PageWrapper from "@/components/layout/PageWrapper";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <PageWrapper>
      <section className="animate-fade-in space-y-6">
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
    </PageWrapper>
  );
}
