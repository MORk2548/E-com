import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { validateLogin } from '../lib/validators.js'

export default function Login() {
  const { user, login } = useAuth()
  const toast = useToast()
  const from = useLocation().state?.from?.pathname || '/'
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to={from} replace />

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    const v = validateLogin(form); setErrors(v); setFormError('')
    if (Object.keys(v).length) return
    setBusy(true)
    try { await login(form); toast('Logged in') } catch (err) { setFormError(err.message) } finally { setBusy(false) }
  }
  return (
    <div className="container auth">
      <form className="auth__card" onSubmit={submit} noValidate>
        <h1>Log in</h1>
        {formError && <p className="alert" role="alert">{formError}</p>}
        <FormField id="identifier" label="Email or username" autoComplete="username" value={form.identifier} onChange={set} error={errors.identifier} />
        <FormField id="password" label="Password" type="password" autoComplete="current-password" value={form.password} onChange={set} error={errors.password} />
        <Button type="submit" size="lg" className="btn--block" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</Button>
        <p className="muted">Don't have an account? <Link to="/register" state={useLocation().state}><u>Register</u></Link></p>
      </form>
    </div>
  )
}
