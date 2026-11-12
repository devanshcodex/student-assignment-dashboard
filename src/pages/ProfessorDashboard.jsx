import { useState } from 'react'
import { api } from '../api/mockApi'
import CourseCard from '../components/CourseCard'
import CourseForm from '../components/CourseForm'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { Skeleton } from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import useAsync from '../hooks/useAsync'

export default function ProfessorDashboard() {
  const { user } = useAuth()
  const { data: courses, error, reload } = useAsync(() => api.listCourses(), [])
  const [creating, setCreating] = useState(false)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your courses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Hello {user.name}. Pick a course to manage its assignments.</p>
        </div>
        <button className="btn-primary" onClick={() => setCreating(true)}>New course</button>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !courses ? (
        <Skeleton grid count={3} />
      ) : courses.length === 0 ? (
        <EmptyState title="No courses yet" hint="Create your first course to start posting assignments.">
          <button className="btn-primary" onClick={() => setCreating(true)}>New course</button>
        </EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} to={`/professor/courses/${c.id}`}>
              <p>{c.studentCount} students enrolled</p>
              <p>{c.assignmentCount} {c.assignmentCount === 1 ? 'assignment' : 'assignments'}</p>
            </CourseCard>
          ))}
        </div>
      )}

      {creating && <CourseForm onClose={() => setCreating(false)} onSaved={reload} />}
    </>
  )
}
