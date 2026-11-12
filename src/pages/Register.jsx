import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import { homePath, useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { validateRegister } from '../utils/validate'

const emptyForm = { name: '', email: '', password: '', confirm: '', role: '' }

export default function Register() {
  const { signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [busy, setBusy] = useState(false)

  function change(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  async function submit(e) {
    e.preventDefault()
    const found = validateRegister(values)
    setErrors(found)
    if (Object.keys(found).length) return

    setBusy(true)
    setServerError('')
    try {
      const user = await signUp(values)
      toast.success('Account created. Welcome aboard!')
      navigate(homePath(user.role), { replace: true })
    } catch (err) {
      setServerError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Pick your role to get started."
      footer={<>Already registered? <Link to="/login" className="font-medium underline">Log in</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {serverError && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {serverError}
          </p>
        )}
        <Field label="Full name" name="name" autoComplete="name" value={values.name} onChange={change} error={errors.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={change} error={errors.email} />
        <Field label="Password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={change} error={errors.password} />
        <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" value={values.confirm} onChange={change} error={errors.confirm} />

        <fieldset>
          <legend className="mb-1 text-sm font-medium">I am a</legend>
          <div className="grid grid-cols-2 gap-2">
            {[['student', 'Student'], ['professor', 'Professor']].map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  values.role === value
                    ? 'border-slate-900 bg-slate-100 dark:border-white dark:bg-slate-800'
                    : 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'
                }`}
              >
                <input type="radio" name="role" value={value} checked={values.role === value} onChange={change} />
                {label}
              </label>
            ))}
          </div>
          {errors.role && <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.role}</p>}
        </fieldset>

        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
      </form>
    </AuthLayout>
  )
}
