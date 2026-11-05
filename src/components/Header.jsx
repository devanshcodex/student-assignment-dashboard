import { useApp } from '../context/AppContext'

export default function Header() {
  const { user, logout, dark, toggleDark } = useApp()
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="font-bold tracking-tight">Assignment Desk</p>
          {user && (
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user.name} ({user.role === 'admin' ? 'Professor' : 'Student'})
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={toggleDark} aria-pressed={dark}>{dark ? 'Light mode' : 'Dark mode'}</button>
          {user && <button className="btn" onClick={logout}>Switch user</button>}
        </div>
      </div>
    </header>
  )
}
