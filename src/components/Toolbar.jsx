export default function Toolbar({ q, setQ, filter, setFilter, filters, sort, setSort }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="search"
        aria-label="Search assignments"
        placeholder="Search assignments"
        className="input sm:flex-1"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {filters && (
        <select aria-label="Filter by status" className="input sm:w-44" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {filters.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      )}
      <select aria-label="Sort assignments" className="input sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="due-asc">Due date: soonest</option>
        <option value="due-desc">Due date: latest</option>
        <option value="title">Title: A to Z</option>
      </select>
    </div>
  )
}
