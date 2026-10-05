export default function TrainingLoading() {
  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-[var(--surface-hover)]" />
        <div className="h-10 w-48 max-w-full animate-pulse rounded-lg bg-[var(--surface-hover)]" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded bg-[var(--surface)]" />
      </div>

      <div className="h-72 animate-pulse rounded-2xl bg-[var(--layer-elevated)]" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-[var(--layer-elevated)]" />
        ))}
      </div>
    </div>
  )
}
