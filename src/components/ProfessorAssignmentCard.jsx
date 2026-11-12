import { useState } from 'react'
import { dueLabel, fmtDateTime, isPast } from '../utils/dates'
import Badge from './Badge'
import ProgressBar from './ProgressBar'

function Row({ row }) {
  return (
    <li className="flex items-start justify-between gap-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="font-medium">{row.name}</p>
        {row.detail && <p className="text-xs text-slate-500 dark:text-slate-400">{row.detail}</p>}
      </div>
      {row.done ? (
        <span className="shrink-0 text-right text-xs text-emerald-700 dark:text-emerald-400">
          ✓ {fmtDateTime(row.at)}
        </span>
      ) : (
        <Badge tone="slate">Not submitted</Badge>
      )}
    </li>
  )
}

export default function ProfessorAssignmentCard({ assignment: a, onEdit }) {
  const [open, setOpen] = useState(false)
  const { progress } = a
  const closed = isPast(a.deadline)
  const unit = a.type === 'group' ? 'groups' : 'students'
  const submitted = progress.rows.filter((r) => r.done)
  const missing = progress.rows.filter((r) => !r.done)

  return (
    <article className="card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{a.title}</h2>
            <Badge tone={a.type === 'group' ? 'blue' : 'slate'}>{a.type === 'group' ? 'Group' : 'Individual'}</Badge>
            {closed && <Badge tone="red">Deadline passed</Badge>}
          </div>
          {a.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{a.description}</p>}
          <p className={`mt-2 text-sm ${closed ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {fmtDateTime(a.deadline)} · {dueLabel(a.deadline)}
          </p>
        </div>
        <div className="flex gap-2">
          <a className="btn" href={a.driveLink} target="_blank" rel="noreferrer">OneDrive</a>
          <button className="btn" onClick={() => onEdit(a)}>Edit</button>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar value={progress.done} max={progress.total} label={`${progress.done} of ${progress.total} ${unit} submitted`} />
      </div>

      <button
        className="mt-3 text-sm font-medium underline-offset-2 hover:underline"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? 'Hide details' : 'View who has submitted'}
      </button>

      {open && (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <section aria-label="Submitted">
            <h3 className="text-sm font-semibold">Submitted ({submitted.length})</h3>
            {submitted.length === 0 ? (
              <p className="py-2 text-sm text-slate-500">Nobody yet.</p>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {submitted.map((r) => <Row key={r.id} row={r} />)}
              </ul>
            )}
          </section>
          <section aria-label="Not submitted">
            <h3 className="text-sm font-semibold">Not submitted ({missing.length})</h3>
            {missing.length === 0 ? (
              <p className="py-2 text-sm text-slate-500">Everyone has submitted.</p>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {missing.map((r) => <Row key={r.id} row={r} />)}
              </ul>
            )}
          </section>
          {progress.ungrouped > 0 && (
            <p className="text-xs text-amber-700 sm:col-span-2 dark:text-amber-400">
              {progress.ungrouped} {progress.ungrouped === 1 ? 'student is' : 'students are'} not in a group yet.
            </p>
          )}
        </div>
      )}
    </article>
  )
}
