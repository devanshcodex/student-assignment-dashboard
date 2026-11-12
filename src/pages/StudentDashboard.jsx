import { api } from '../api/mockApi'
import CourseCard from '../components/CourseCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import ProgressBar from '../components/ProgressBar'
import { Skeleton } from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import useAsync from '../hooks/useAsync'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data: courses, error, reload } = useAsync(() => api.listCourses(), [])

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My courses</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Hi {user.name.split(' ')[0]}, here is what you are enrolled in this semester.</p>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !courses ? (
        <Skeleton grid count={3} />
      ) : courses.length === 0 ? (
        <EmptyState title="No courses this semester" hint="You are not enrolled in any course right now." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} to={`/student/courses/${c.id}`}>
              <p>Prof. {c.professorName}</p>
              {c.assignmentCount === 0 ? (
                <p>No assignments yet</p>
              ) : (
                <ProgressBar value={c.doneCount} max={c.assignmentCount} label={`${c.doneCount} of ${c.assignmentCount} acknowledged`} />
              )}
            </CourseCard>
          ))}
        </div>
      )}
    </>
  )
}
