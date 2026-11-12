import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/mockApi'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import GroupModal from '../components/GroupModal'
import GroupPanel from '../components/GroupPanel'
import ProgressBar from '../components/ProgressBar'
import { Skeleton } from '../components/Skeleton'
import StudentAssignmentCard from '../components/StudentAssignmentCard'
import { useAuth } from '../context/AuthContext'
import useAsync from '../hooks/useAsync'

export default function StudentCourse() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const { data, error, reload } = useAsync(() => api.courseView(courseId), [courseId])
  const [groupsOpen, setGroupsOpen] = useState(false)

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!data) return <Skeleton count={3} />

  const { course, assignments, groups, myGroup } = data
  const doneCount = assignments.filter((a) => a.status.done).length

  return (
    <>
      <Link to="/student" className="text-sm text-slate-500 hover:underline dark:text-slate-400">← My courses</Link>
      <div>
        <p className="font-mono text-sm font-semibold">{course.code}</p>
        <h1 className="text-2xl font-bold tracking-tight">{course.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Prof. {course.professorName}</p>
      </div>

      {assignments.length > 0 && (
        <ProgressBar value={doneCount} max={assignments.length} label={`${doneCount} of ${assignments.length} acknowledged`} />
      )}

      <GroupPanel group={myGroup} userId={user.id} onManage={() => setGroupsOpen(true)} />

      {assignments.length === 0 ? (
        <EmptyState title="No assignments yet" hint="Your professor has not posted anything for this course." />
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <StudentAssignmentCard key={a.id} assignment={a} onChanged={reload} onOpenGroups={() => setGroupsOpen(true)} />
          ))}
        </div>
      )}

      {groupsOpen && (
        <GroupModal courseId={courseId} groups={groups} onClose={() => setGroupsOpen(false)} onChanged={reload} />
      )}
    </>
  )
}
