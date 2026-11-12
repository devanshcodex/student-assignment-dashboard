import { useState } from 'react'
import { api } from '../api/mockApi'
import { useToast } from '../context/ToastContext'
import { validateCourse } from '../utils/validate'
import Field from './Field'
import Modal from './Modal'

export default function CourseForm({ onClose, onSaved }) {
  const toast = useToast()
  const [values, setValues] = useState({ code: '', name: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function change(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  async function submit(e) {
    e.preventDefault()
    const found = validateCourse(values)
    setErrors(found)
    if (Object.keys(found).length) return

    setBusy(true)
    try {
      await api.createCourse(values)
      toast.success('Course created')
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.message)
      setBusy(false)
    }
  }

  return (
    <Modal title="New course" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-3">
        <Field label="Course code" name="code" placeholder="CS450" value={values.code} onChange={change} error={errors.code} />
        <Field label="Course name" name="name" placeholder="Machine Learning" value={values.name} onChange={change} error={errors.name} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Creating...' : 'Create course'}</button>
        </div>
      </form>
    </Modal>
  )
}
