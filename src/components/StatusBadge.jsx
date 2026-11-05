export default function StatusBadge({ done, overdue }) {
  const [text, cls] = done
    ? ['Submitted', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300']
    : overdue
      ? ['Overdue', 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300']
      : ['Not submitted', 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300']
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{text}</span>
}
