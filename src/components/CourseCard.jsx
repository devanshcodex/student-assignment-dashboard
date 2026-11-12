import { Link } from 'react-router-dom'
import Badge from './Badge'

export default function CourseCard({ course, to, children }) {
  return (
    <Link
      to={to}
      className="card block transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md dark:hover:border-slate-600"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold tracking-wide">{course.code}</span>
        <Badge>{course.semester}</Badge>
      </div>
      <h2 className="mt-3 text-lg font-semibold leading-snug">{course.name}</h2>
      <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">{children}</div>
    </Link>
  )
}
