import { useApp } from './context/AppContext'
import Header from './components/Header'
import Login from './views/Login'
import StudentDashboard from './views/StudentDashboard'
import AdminDashboard from './views/AdminDashboard'

export default function App() {
  const { status, user, reset } = useApp()

  let body
  if (status === 'loading') {
    body = (
      <div role="status" className="flex items-center justify-center gap-3 py-24 text-slate-500">
        <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
        Loading your assignments
      </div>
    )
  } else if (status === 'error') {
    body = (
      <div role="alert" className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="font-semibold">Saved data couldn't be read</p>
        <p className="mt-1 text-sm text-slate-500">The stored data is damaged. Reset to restore the demo data.</p>
        <button className="btn-primary mt-4" onClick={reset}>Reset demo data</button>
      </div>
    )
  } else if (!user) {
    body = <Login />
  } else {
    body = user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />
  }

  return (
    <>
      <Header />
      {body}
    </>
  )
}
