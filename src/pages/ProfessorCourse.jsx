import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/mockApi'
import AssignmentForm from '../components/AssignmentForm'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import ProfessorAssignmentCard from '../components/ProfessorAssignmentCard'
import { Skeleton } from '../components/Skeleton'
import useAsync from '../hooks/useAsync'
import { isPast } from '../utils/dates'

export default function ProfessorCourse() {
  const { courseId } = useParams()
  const { data, error, reload } = useAsync(() => api.courseView(courseId), [courseId])
  const [editing, setEditing] = useState(null) // null | 'new' | assignment
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!data) return <Skeleton count={3} />

  const { course, assignments } = data
  const term = query.trim().toLowerCase()
  const shown = assignments.filter((a) => {
    if (term && !a.title.toLowerCase().includes(term)) return false
    if (status === 'open') return !isPast(a.deadline)
    if (status === 'closed') return isPast(a.deadline)
    return true
  })

  return (
    <>
      <Link to="/professor" className="text-sm text-slate-500 hover:underline dark:text-slate-400">← All courses</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold">{course.code}</p>
          <h1 className="text-2xl font-bold tracking-tight">{course.name}</h1>
        </div>
        <button className="btn-primary" onClick={() => setEditing('new')}>New assignment</button>
      </div>

      {assignments.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            aria-label="Search assignments"
            placeholder="Search by title"
            className="input sm:flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select aria-label="Filter by deadline" className="input sm:w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All assignments</option>
            <option value="open">Deadline ahead</option>
            <option value="closed">Deadline passed</option>
          </select>
        </div>
      )}

      {assignments.length === 0 ? (
        <EmptyState title="No assignments yet" hint="Create the first assignment for this course.">
          <button className="btn-primary" onClick={() => setEditing('new')}>New assignment</button>
        </EmptyState>
      ) : shown.length === 0 ? (
        <EmptyState title="No matching assignments" hint="Try a different search or filter." />
      ) : (
        <div className="space-y-3">
          {shown.map((a) => <ProfessorAssignmentCard key={a.id} assignment={a} onEdit={setEditing} />)}
        </div>
      )}

      {editing && (
        <AssignmentForm
          courseId={courseId}
          assignment={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={reload}
        />
      )}
    </>
  )
}
