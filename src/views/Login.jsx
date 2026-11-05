import { useApp } from '../context/AppContext'

export default function Login() {
  const { users, login } = useApp()
  const group = (role) => users.filter((u) => u.role === role)
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Sign in as</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Demo accounts. No password needed.</p>
      {[['admin', 'Professors'], ['student', 'Students']].map(([role, label]) => (
        <section key={role} className="mt-6" aria-labelledby={role}>
          <h2 id={role} className="mb-2 font-semibold">{label}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {group(role).map((u) => (
              <li key={u.id}>
                <button className="card w-full text-left transition hover:border-slate-400 dark:hover:border-slate-600" onClick={() => login(u.id)}>
                  {u.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
