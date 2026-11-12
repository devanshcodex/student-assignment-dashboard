import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { GuestRoute, ProtectedRoute } from './components/RouteGuards'
import { PageLoader } from './components/Skeleton'
import { homePath, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import ProfessorCourse from './pages/ProfessorCourse'
import ProfessorDashboard from './pages/ProfessorDashboard'
import Register from './pages/Register'
import StudentCourse from './pages/StudentCourse'
import StudentDashboard from './pages/StudentDashboard'

function Home() {
  const { user, ready } = useAuth()
  if (!ready) return <PageLoader />
  return <Navigate to={user ? homePath(user.role) : '/login'} replace />
}

function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="text-2xl font-bold">Page not found</p>
      <Link to="/" className="btn mt-4">Back to home</Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<Layout />}>
        <Route element={<ProtectedRoute role="professor" />}>
          <Route path="/professor" element={<ProfessorDashboard />} />
          <Route path="/professor/courses/:courseId" element={<ProfessorCourse />} />
        </Route>
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/courses/:courseId" element={<StudentCourse />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
