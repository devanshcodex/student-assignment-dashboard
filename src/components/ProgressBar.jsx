export default function ProgressBar({ value, max, label }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-slate-500 dark:text-slate-400">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
