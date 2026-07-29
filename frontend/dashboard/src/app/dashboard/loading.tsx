import PageWrapper from "@/components/layout/PageWrapper";

export default function DashboardLoading() {
  return (
    <PageWrapper>
      <section className="animate-pulse">
        <div className="mb-8 h-4 w-48 rounded bg-white/10" />
        <div className="space-y-6">
          <div className="h-[500px] rounded-3xl bg-white/5" />
          <div className="h-[160px] rounded-3xl bg-white/5" />
        </div>
      </section>
    </PageWrapper>
  );
}
