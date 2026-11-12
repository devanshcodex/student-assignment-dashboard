import { useState } from 'react'
import { api } from '../api/mockApi'
import { useToast } from '../context/ToastContext'
import Field from './Field'
import Modal from './Modal'

export default function GroupModal({ courseId, groups, onClose, onChanged }) {
  const toast = useToast()
  const [tab, setTab] = useState(groups.length ? 'join' : 'create')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(action, message) {
    setBusy(true)
    try {
      await action()
      toast.success(message)
      onChanged()
      onClose()
    } catch (err) {
      toast.error(err.message)
      setBusy(false)
    }
  }

  function create(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Give your group a name.')
    run(() => api.createGroup(courseId, name), 'Group created. You are the leader.')
  }

  return (
    <Modal title="Create or join a group" onClose={onClose}>
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 text-sm dark:bg-slate-800">
        {[['join', 'Join a group'], ['create', 'Create a group']].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={tab === value}
            onClick={() => setTab(value)}
            className={`rounded-md px-3 py-1.5 font-medium transition ${tab === value ? 'bg-white shadow-sm dark:bg-slate-950' : 'text-slate-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'join' ? (
        groups.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">No groups exist yet. Create the first one.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {groups.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{g.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Leader: {g.leaderName} · {g.members.length} {g.members.length === 1 ? 'member' : 'members'}
                  </p>
                </div>
                <button
                  className="btn"
                  disabled={busy}
                  onClick={() => run(() => api.joinGroup(g.id), `You joined ${g.name}`)}
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <form onSubmit={create} noValidate className="space-y-3">
          <Field
            label="Group name"
            name="groupName"
            value={name}
            error={error}
            onChange={(e) => { setName(e.target.value); setError('') }}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">You will become the group leader and can acknowledge group assignments.</p>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button className="btn-primary" disabled={busy}>{busy ? 'Creating...' : 'Create group'}</button>
          </div>
        </form>
      )}
    </Modal>
  )
}
