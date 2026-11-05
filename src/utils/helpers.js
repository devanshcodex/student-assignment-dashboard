export const today = () => new Date().toISOString().slice(0, 10)

export const isOverdue = (a, done) => !done && a.dueDate < today()

export const fmtDate = (iso) =>
  new Date(iso + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

export const recipientsOf = (a, students) =>
  a.assignedTo === 'all' ? students : students.filter((s) => a.assignedTo.includes(s.id))

// items: [{...assignment, done?}]. Applies search, status filter and sort.
export function applyView(items, { q, filter = 'all', sort }) {
  const term = q.trim().toLowerCase()
  return items
    .filter((a) => !term || `${a.title} ${a.description}`.toLowerCase().includes(term))
    .filter((a) => {
      if (filter === 'pending') return !a.done
      if (filter === 'submitted') return a.done
      if (filter === 'overdue') return isOverdue(a, a.done)
      return true
    })
    .sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      return sort === 'due-desc' ? b.dueDate.localeCompare(a.dueDate) : a.dueDate.localeCompare(b.dueDate)
    })
}
