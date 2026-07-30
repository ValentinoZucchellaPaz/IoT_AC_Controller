export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh overflow-x-hidden pt-10 pb-24">
      <main className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
