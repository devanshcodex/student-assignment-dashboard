import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { applyView, fmtDate, isOverdue, recipientsOf } from '../utils/helpers'
import ProgressBar from '../components/ProgressBar'
import StatusBadge from '../components/StatusBadge'
import Toolbar from '../components/Toolbar'
import ConfirmDialog from '../components/ConfirmDialog'
import AssignmentForm from '../components/AssignmentForm'
import EmptyState from '../components/EmptyState'

export default function AdminDashboard() {
  const { user, students, assignments, submissions, deleteAssignment } = useApp()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('due-asc')
  const [editing, setEditing] = useState(null) // null | 'new' | assignment
  const [deleting, setDeleting] = useState(null)

  // Admins only see assignments they created
  const mine = assignments.filter((a) => a.createdBy === user.id)
  const shown = applyView(mine, { q, sort })

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Your assignments</h1>
        <button className="btn-primary" onClick={() => setEditing('new')}>Create assignment</button>
      </div>

      {mine.length > 0 && <Toolbar {...{ q, setQ, sort, setSort }} />}

      {mine.length === 0 ? (
        <EmptyState title="You haven't created any assignments" hint="Create one and choose which students receive it.">
          <button className="btn-primary" onClick={() => setEditing('new')}>Create assignment</button>
        </EmptyState>
      ) : shown.length === 0 ? (
        <EmptyState title="No matches" hint="Try a different search." />
      ) : (
        <ul className="space-y-3">
          {shown.map((a) => {
            const rec = recipientsOf(a, students)
            const doneCount = rec.filter((s) => submissions[`${a.id}:${s.id}`]).length
            return (
              <li key={a.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-semibold">{a.title}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{a.description}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Due {fmtDate(a.dueDate)} for {a.assignedTo === 'all' ? 'all students' : `${rec.length} selected students`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a className="btn" href={a.driveLink} target="_blank" rel="noreferrer">Drive link</a>
                    <button className="btn" onClick={() => setEditing(a)}>Edit</button>
                    <button className="btn" onClick={() => setDeleting(a)}>Delete</button>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar value={doneCount} max={rec.length} label={`Class completion: ${doneCount} of ${rec.length}`} />
                </div>

                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium">Student status</summary>
                  <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800">
                    {rec.map((s) => {
                      const done = !!submissions[`${a.id}:${s.id}`]
                      return (
                        <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                          <span>{s.name}</span>
                          <StatusBadge done={done} overdue={isOverdue(a, done)} />
                        </li>
                      )
                    })}
                  </ul>
                </details>
              </li>
            )
          })}
        </ul>
      )}

      {editing && (
        <AssignmentForm assignment={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <ConfirmDialog
          danger
          title="Delete assignment"
          message={`Delete "${deleting.title}"? Students will no longer see it and all submission records are removed.`}
          confirmLabel="Delete assignment"
          onCancel={() => setDeleting(null)}
          onConfirm={() => { deleteAssignment(deleting.id); setDeleting(null) }}
        />
      )}
    </main>
  )
}
