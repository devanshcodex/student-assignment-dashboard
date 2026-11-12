import Badge from './Badge'

export default function GroupPanel({ group, userId, onManage }) {
  if (!group) {
    return (
      <section className="card flex flex-wrap items-center justify-between gap-3" aria-label="Your group">
        <div>
          <h2 className="font-semibold">Your group</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">You are not in a group for this course yet.</p>
        </div>
        <button className="btn" onClick={onManage}>Create or join a group</button>
      </section>
    )
  }

  return (
    <section className="card" aria-label="Your group">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold">{group.name}</h2>
        <Badge>{group.members.length} {group.members.length === 1 ? 'member' : 'members'}</Badge>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {group.members.map((m) => (
          <li key={m.id} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
            {m.name}{m.id === userId && ' (you)'}
            {m.id === group.leaderId && <Badge tone="amber">Leader</Badge>}
          </li>
        ))}
      </ul>
    </section>
  )
}
