import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { homePath, useAuth } from '../context/AuthContext'
import { PageLoader } from './Skeleton'

export function ProtectedRoute({ role }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) return <PageLoader />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user.role !== role) return <Navigate to={homePath(user.role)} replace />
  return <Outlet />
}

export function GuestRoute() {
  const { user, ready } = useAuth()

  if (!ready) return <PageLoader />
  if (user) return <Navigate to={homePath(user.role)} replace />
  return <Outlet />
}
