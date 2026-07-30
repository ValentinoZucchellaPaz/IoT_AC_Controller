import PageWrapper from "@/components/layout/PageWrapper";

export default function HistoryLoading() {
  return (
    <PageWrapper>
      <section className="animate-pulse">
        <div className="mb-8 h-4 w-48 rounded bg-white/10" />
        <div className="mb-8 h-6 w-32 rounded bg-white/10" />
        <div className="flex flex-col gap-6">
          <div className="h-[350px] rounded-3xl bg-white/5" />
          <div className="h-[300px] rounded-3xl bg-white/5" />
        </div>
      </section>
    </PageWrapper>
  );
}
