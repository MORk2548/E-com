import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { isUsernameAvailable } from '../services/authService.js'
import { validateRegister } from '../lib/validators.js'

export default function Register() {
  const { user, register } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/" replace />

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    const v = validateRegister(form); setErrors(v); setFormError('')
    if (Object.keys(v).length) return
    setBusy(true)
    try {
      if (!(await isUsernameAvailable(form.username.trim()))) { setErrors({ username: 'That username is already taken.' }); setBusy(false); return }
      const data = await register(form)
      if (data.session) toast('Account created')
      else setNotice('Account created. Check your email to confirm your address, then log in.')
    } catch (err) { setFormError(err.message) } finally { setBusy(false) }
  }
  if (notice) return <div className="container auth"><div className="auth__card"><h1>Almost there</h1><p>{notice}</p><Button to="/login">Go to login</Button></div></div>
  return (
    <div className="container auth">
      <form className="auth__card" onSubmit={submit} noValidate>
        <h1>Create account</h1>
        {formError && <p className="alert" role="alert">{formError}</p>}
        <FormField id="name" label="Name" autoComplete="name" value={form.name} onChange={set} error={errors.name} />
        <FormField id="username" label="Username" autoComplete="username" value={form.username} onChange={set} error={errors.username} />
        <FormField id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set} error={errors.email} />
        <FormField id="password" label="Password" type="password" autoComplete="new-password" value={form.password} onChange={set} error={errors.password} />
        <FormField id="confirm" label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} onChange={set} error={errors.confirm} />
        <Button type="submit" size="lg" className="btn--block" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</Button>
        <p className="muted">Already have an account? <Link to="/login"><u>Log in</u></Link></p>
      </form>
    </div>
  )
}
