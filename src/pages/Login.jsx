import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import { homePath, useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { validateLogin } from '../utils/validate'

export default function Login() {
  const { signIn } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
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
    const found = validateLogin(values)
    setErrors(found)
    if (Object.keys(found).length) return

    setBusy(true)
    setServerError('')
    try {
      const user = await signIn(values)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`)
      navigate(location.state?.from ?? homePath(user.role), { replace: true })
    } catch (err) {
      setServerError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Log in"
      subtitle="Sign in to see your courses and assignments."
      footer={<>New here? <Link to="/register" className="font-medium underline">Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {serverError && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {serverError}
          </p>
        )}
        <Field label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={change} error={errors.email} />
        <Field label="Password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={change} error={errors.password} />
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in...' : 'Log in'}</button>
      </form>

      <div className="mt-6 rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <p className="mb-1 font-semibold">Demo accounts (password: password123)</p>
        <p>Professor: meera@college.edu or arjun@college.edu</p>
        <p>Student: aarav@college.edu, diya@college.edu, kabir@college.edu</p>
      </div>
    </AuthLayout>
  )
}
