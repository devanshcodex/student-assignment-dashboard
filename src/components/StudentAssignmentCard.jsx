import { useState } from 'react'
import { api } from '../api/mockApi'
import { useToast } from '../context/ToastContext'
import { dueLabel, fmtDateTime, isPast } from '../utils/dates'
import Badge from './Badge'
import ConfirmDialog from './ConfirmDialog'

function StatusBlock({ assignment: a, onAcknowledge, onOpenGroups }) {
  const s = a.status

  if (s.done) {
    const text = a.type === 'group'
      ? `Acknowledged by ${s.ack.by} on ${fmtDateTime(s.ack.at)}`
      : `Acknowledged on ${fmtDateTime(s.ack.at)}`
    return (
      <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
        ✓ {text}
      </p>
    )
  }

  if (a.type === 'group' && !s.group) {
    return (
      <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <p>You are not part of any group. Create or join one to submit this assignment.</p>
        <button className="btn mt-2" onClick={onOpenGroups}>Create or join a group</button>
      </div>
    )
  }

  if (s.canAck) {
    return <button className="btn-primary" onClick={onAcknowledge}>Yes, I have submitted</button>
  }

  return (
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Waiting for {s.group.leaderName} (group leader) to acknowledge this submission.
    </p>
  )
}

export default function StudentAssignmentCard({ assignment: a, onChanged, onOpenGroups }) {
  const toast = useToast()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const overdue = !a.status.done && isPast(a.deadline)

  async function acknowledge() {
    setBusy(true)
    try {
      await api.acknowledge(a.id)
      toast.success(a.type === 'group' ? 'Acknowledged for your whole group' : 'Submission acknowledged')
      onChanged()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
      setConfirming(false)
    }
  }

  return (
    <article className={`card transition ${overdue ? 'border-rose-400 dark:border-rose-800' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold">{a.title}</h2>
          <Badge tone={a.type === 'group' ? 'blue' : 'slate'}>{a.type === 'group' ? 'Group' : 'Individual'}</Badge>
        </div>
        {a.status.done ? <Badge tone="green">Submitted</Badge> : overdue ? <Badge tone="red">Overdue</Badge> : <Badge tone="amber">Pending</Badge>}
      </div>

      {a.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{a.description}</p>}

      <p className={`mt-2 text-sm ${overdue ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
        Deadline: {fmtDateTime(a.deadline)}{!a.status.done && ` · ${dueLabel(a.deadline)}`}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a className="btn" href={a.driveLink} target="_blank" rel="noreferrer">Open OneDrive link</a>
        <StatusBlock assignment={a} onAcknowledge={() => setConfirming(true)} onOpenGroups={onOpenGroups} />
      </div>

      {confirming && (
        <ConfirmDialog
          title="Confirm submission"
          message={
            a.type === 'group'
              ? `Confirm that "${a.title}" has been submitted on OneDrive. This will mark it as submitted for everyone in ${a.status.group.name}.`
              : `Confirm that you have submitted "${a.title}" on OneDrive. The time will be recorded.`
          }
          confirmLabel="Confirm submission"
          busy={busy}
          onConfirm={acknowledge}
          onCancel={() => setConfirming(false)}
        />
      )}
    </article>
  )
}
