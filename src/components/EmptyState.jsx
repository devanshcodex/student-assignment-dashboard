export default function EmptyState({ title, hint, children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
