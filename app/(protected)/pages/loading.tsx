export default function PagesLoading() {
  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--surface-hover)]" />
          <div className="h-10 w-64 max-w-full animate-pulse rounded-lg bg-[var(--surface-hover)]" />
          <div className="h-5 w-80 max-w-full animate-pulse rounded bg-[var(--surface)]" />
        </div>
        <div className="h-12 w-48 animate-pulse rounded-xl bg-[var(--surface-hover)]" />
      </div>

      <div className="h-24 animate-pulse rounded-2xl bg-[var(--layer-elevated)]" />

      <div className="flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-52 animate-pulse rounded-2xl bg-[var(--layer-elevated)]" />
        ))}
      </div>
    </div>
  )
}
