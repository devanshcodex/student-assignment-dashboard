import { useState } from 'react'
import Modal from './Modal'
import { useApp } from '../context/AppContext'

export default function AssignmentForm({ assignment, onClose }) {
  const { user, students, saveAssignment } = useApp()
  const [f, setF] = useState(
    assignment || { title: '', description: '', dueDate: '', driveLink: '', assignedTo: 'all' }
  )
  const [errors, setErrors] = useState({})
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))

  const toggleStudent = (id) => {
    const cur = f.assignedTo === 'all' ? [] : f.assignedTo
    set('assignedTo', cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!f.title.trim()) err.title = 'Enter a title.'
    if (!f.dueDate) err.dueDate = 'Pick a due date.'
    if (!/^https?:\/\/\S+$/.test(f.driveLink)) err.driveLink = 'Enter a full link starting with http:// or https://.'
    if (f.assignedTo !== 'all' && f.assignedTo.length === 0) err.assignedTo = 'Select at least one student.'
    setErrors(err)
    if (Object.keys(err).length) return
    saveAssignment({ ...f, title: f.title.trim(), id: f.id || `t${Date.now()}`, createdBy: user.id })
    onClose()
  }

  const Err = ({ k }) => errors[k] && <p role="alert" className="mt-1 text-xs text-rose-600">{errors[k]}</p>

  return (
    <Modal title={assignment ? 'Edit assignment' : 'Create assignment'} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-3">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">Title</label>
          <input id="title" className="input" value={f.title} onChange={(e) => set('title', e.target.value)} />
          <Err k="title" />
        </div>
        <div>
          <label htmlFor="desc" className="mb-1 block text-sm font-medium">Description</label>
          <textarea id="desc" rows={3} className="input" value={f.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="due" className="mb-1 block text-sm font-medium">Due date</label>
            <input id="due" type="date" className="input" value={f.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
            <Err k="dueDate" />
          </div>
          <div>
            <label htmlFor="drive" className="mb-1 block text-sm font-medium">Drive link</label>
            <input id="drive" type="url" placeholder="https://drive.google.com/..." className="input" value={f.driveLink} onChange={(e) => set('driveLink', e.target.value)} />
            <Err k="driveLink" />
          </div>
        </div>
        <fieldset>
          <legend className="mb-1 text-sm font-medium">Assign to</legend>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-1.5">
              <input type="radio" name="scope" checked={f.assignedTo === 'all'} onChange={() => set('assignedTo', 'all')} /> All students
            </label>
            <label className="flex items-center gap-1.5">
              <input type="radio" name="scope" checked={f.assignedTo !== 'all'} onChange={() => set('assignedTo', [])} /> Selected students
            </label>
          </div>
          {f.assignedTo !== 'all' && (
            <div className="mt-2 grid gap-1 sm:grid-cols-2">
              {students.map((s) => (
                <label key={s.id} className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={f.assignedTo.includes(s.id)} onChange={() => toggleStudent(s.id)} /> {s.name}
                </label>
              ))}
            </div>
          )}
          <Err k="assignedTo" />
        </fieldset>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{assignment ? 'Save changes' : 'Create assignment'}</button>
        </div>
      </form>
    </Modal>
  )
}
