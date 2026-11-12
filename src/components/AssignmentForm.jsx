import { useState } from 'react'
import { api } from '../api/mockApi'
import { useToast } from '../context/ToastContext'
import { fromInputValue, toInputValue } from '../utils/dates'
import { validateAssignment } from '../utils/validate'
import Field from './Field'
import Modal from './Modal'

const types = [
  ['individual', 'Individual', 'Every student acknowledges for themselves'],
  ['group', 'Group', 'Only the group leader acknowledges'],
]

function initialValues(assignment) {
  if (!assignment) return { title: '', description: '', deadline: '', driveLink: '', type: 'individual' }
  return {
    title: assignment.title,
    description: assignment.description,
    deadline: toInputValue(assignment.deadline),
    driveLink: assignment.driveLink,
    type: assignment.type,
  }
}

export default function AssignmentForm({ courseId, assignment, onClose, onSaved }) {
  const toast = useToast()
  const [values, setValues] = useState(() => initialValues(assignment))
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function change(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  async function submit(e) {
    e.preventDefault()
    const found = validateAssignment(values)
    setErrors(found)
    if (Object.keys(found).length) return

    setBusy(true)
    const payload = { ...values, deadline: fromInputValue(values.deadline) }
    try {
      if (assignment) await api.updateAssignment(assignment.id, payload)
      else await api.createAssignment(courseId, payload)
      toast.success(assignment ? 'Assignment updated' : 'Assignment created')
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.message)
      setBusy(false)
    }
  }

  return (
    <Modal title={assignment ? 'Edit assignment' : 'New assignment'} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-3">
        <Field label="Title" name="title" value={values.title} onChange={change} error={errors.title} />
        <Field label="Description" name="description" as="textarea" rows={3} value={values.description} onChange={change} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Deadline" name="deadline" type="datetime-local" value={values.deadline} onChange={change} error={errors.deadline} />
          <Field label="OneDrive link" name="driveLink" type="url" placeholder="https://1drv.ms/..." value={values.driveLink} onChange={change} error={errors.driveLink} />
        </div>

        <fieldset>
          <legend className="mb-1 text-sm font-medium">Submission type</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {types.map(([value, label, hint]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-lg border p-3 text-sm transition ${
                  values.type === value
                    ? 'border-slate-900 bg-slate-100 dark:border-white dark:bg-slate-800'
                    : 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <input type="radio" name="type" value={value} checked={values.type === value} onChange={change} />
                  {label}
                </span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>
            {busy ? 'Saving...' : assignment ? 'Save changes' : 'Create assignment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
