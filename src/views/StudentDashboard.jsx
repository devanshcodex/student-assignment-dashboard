import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { applyView, fmtDate, isOverdue } from '../utils/helpers'
import ProgressBar from '../components/ProgressBar'
import StatusBadge from '../components/StatusBadge'
import Toolbar from '../components/Toolbar'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

const FILTERS = [['all', 'All statuses'], ['pending', 'Not submitted'], ['submitted', 'Submitted'], ['overdue', 'Overdue']]

export default function StudentDashboard() {
  const { user, assignments, submissions, markSubmitted } = useApp()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('due-asc')
  const [confirming, setConfirming] = useState(null)

  // Students only see assignments assigned to them
  const mine = useMemo(
    () =>
      assignments
        .filter((a) => a.assignedTo === 'all' || a.assignedTo.includes(user.id))
        .map((a) => ({ ...a, done: !!submissions[`${a.id}:${user.id}`] })),
    [assignments, submissions, user.id]
  )
  const shown = applyView(mine, { q, filter, sort })
  const doneCount = mine.filter((a) => a.done).length

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <section className="card" aria-label="Overall progress">
        <p className="mb-3 text-2xl font-bold tracking-tight">{doneCount} of {mine.length} submitted</p>
        <ProgressBar value={doneCount} max={mine.length} label="Your progress" />
      </section>

      <Toolbar {...{ q, setQ, filter, setFilter, filters: FILTERS, sort, setSort }} />

      {mine.length === 0 ? (
        <EmptyState title="No assignments yet" hint="Your professors haven't assigned anything to you." />
      ) : shown.length === 0 ? (
        <EmptyState title="No matches" hint="Try a different search or clear the filters." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {shown.map((a) => {
            const overdue = isOverdue(a, a.done)
            return (
              <li key={a.id} className={`card ${overdue ? 'border-rose-400 dark:border-rose-700' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{a.title}</h3>
                  <StatusBadge done={a.done} overdue={overdue} />
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{a.description}</p>
                <p className={`mt-2 text-sm ${overdue ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  Due {fmtDate(a.dueDate)}{overdue && ' (overdue)'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a className="btn" href={a.driveLink} target="_blank" rel="noreferrer">Open Drive link</a>
                  {!a.done && (
                    <button className="btn-primary" onClick={() => setConfirming(a)}>Yes, I have submitted</button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {confirming && (
        <ConfirmDialog
          title="Confirm submission"
          message={`Mark "${confirming.title}" as submitted? You can't undo this.`}
          confirmLabel="Confirm submission"
          onCancel={() => setConfirming(null)}
          onConfirm={() => { markSubmitted(confirming.id); setConfirming(null) }}
        />
      )}
    </main>
  )
}
