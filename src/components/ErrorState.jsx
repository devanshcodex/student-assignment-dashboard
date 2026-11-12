export default function ErrorState({ error, onRetry }) {
  return (
    <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-6 text-center dark:border-rose-900 dark:bg-rose-950/40">
      <p className="font-semibold text-rose-800 dark:text-rose-300">Something went wrong</p>
      <p className="mt-1 text-sm text-rose-700 dark:text-rose-400">{error?.message ?? 'Please try again.'}</p>
      {onRetry && <button className="btn mt-4" onClick={onRetry}>Try again</button>}
    </div>
  )
}
