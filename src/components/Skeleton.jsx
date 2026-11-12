export function Skeleton({ count = 3, grid = false }) {
  return (
    <div className={grid ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'} aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`card animate-pulse bg-slate-100 dark:bg-slate-900 ${grid ? 'h-40' : 'h-36'}`} />
      ))}
    </div>
  )
}

export function PageLoader() {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-24 text-slate-500">
      <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
      Loading
    </div>
  )
}
