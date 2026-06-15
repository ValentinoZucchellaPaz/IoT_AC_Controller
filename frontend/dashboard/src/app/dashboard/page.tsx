import { AlertBadge } from "@/components/widgets/AlertBadge";
import LatestReadingCard from "@/components/widgets/LatestReadingCard";
import Link from "next/link";

export default function DashboardPage() {
  return (
    // <div className="min-h-[100dvh] overflow-x-hidden pb-24 text-white antialiased">
    <div className="min-h-[100dvh] overflow-x-hidden text-white antialiased pt-10 pb-24">
      {/* main content area */}
      <main className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <section className="animate-fade-in">
          {/* small nav as breadcrumb */}
          <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
            <span className="text-zinc-200">Dashboard</span>

            <span>/</span>

            <Link
              href="/history"
              className="transition-colors hover:text-white"
            >
              Historico
            </Link>
          </div>

          <LatestReadingCard />
          <AlertBadge />
        </section>
      </main>
    </div>
  );
}
