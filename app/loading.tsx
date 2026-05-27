export default function Loading() {
  return (
    <main className="page-shell min-h-screen px-5 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="h-10 w-28 rounded-full bg-tovlo-glass/10" />
        <div className="mt-16 max-w-2xl space-y-5">
          <div className="h-12 rounded-3xl bg-tovlo-glass/10" />
          <div className="h-12 w-2/3 rounded-3xl bg-tovlo-glass/10" />
          <div className="h-5 w-3/4 rounded-full bg-tovlo-glass/10" />
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="h-72 rounded-card border border-tovlo-line/20 bg-tovlo-surface/70 shadow-glass"
              key={index}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
