import { Link, useNavigate } from 'react-router-dom'
import { homePath, useAuth } from '../context/AuthContext'
import useTheme from '../hooks/useTheme'
import Badge from './Badge'

export default function Header() {
  const { user, signOut } = useAuth()
  const [dark, toggleDark] = useTheme()
  const navigate = useNavigate()

  // the header briefly renders without a user while logging out
  if (!user) return null

  function logout() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link to={homePath(user.role)} className="font-bold tracking-tight">Assignment &amp; Review</Link>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm sm:block">{user.name}</span>
          <Badge tone="blue">{user.role === 'professor' ? 'Professor' : 'Student'}</Badge>
          <button className="btn" onClick={toggleDark} aria-pressed={dark}>{dark ? 'Light' : 'Dark'}</button>
          <button className="btn" onClick={logout}>Log out</button>
        </div>
      </div>
    </header>
  )
}
