import { useState } from 'react'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Profile() {
  const { user, profile, saveProfile } = useAuth()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  const start = () => { setForm({ name: profile?.name || '', phone: profile?.phone || '', address: profile?.address || '' }); setErrors({}); setFormError(''); setEditing(true) }
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    const v = {}
    if (!form.name.trim()) v.name = 'Enter your name.'
    if (form.phone.trim() && !/^\+?[0-9 -]{9,15}$/.test(form.phone.trim())) v.phone = 'Enter a valid phone number.'
    setErrors(v); setFormError('')
    if (Object.keys(v).length) return
    setBusy(true)
    try { await saveProfile({ name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() }); toast('Profile updated'); setEditing(false) }
    catch (err) { setFormError(err.message) } finally { setBusy(false) }
  }
  const rows = [['Name', profile?.name], ['Username', profile?.username], ['Email', user.email], ['Phone', profile?.phone], ['Address', profile?.address]]
  return (
    <div className="container section">
      <h1>Profile</h1>
      <section className="panel profile">
        {!editing ? (
          <>
            <dl className="profile__list">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || <span className="muted">Not set</span>}</dd></div>)}</dl>
            <Button onClick={start}>Edit profile</Button>
          </>
        ) : (
          <form onSubmit={submit} noValidate className="profile__form">
            {formError && <p className="alert" role="alert">{formError}</p>}
            <FormField id="name" label="Name" value={form.name} onChange={set} error={errors.name} autoComplete="name" />
            <FormField id="email" label="Email" value={user.email} disabled readOnly />
            <FormField id="phone" label="Phone" type="tel" value={form.phone} onChange={set} error={errors.phone} autoComplete="tel" />
            <FormField id="address" label="Address" value={form.address} onChange={set} autoComplete="street-address" />
            <div className="row"><Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button><Button variant="secondary" onClick={() => setEditing(false)} disabled={busy}>Cancel</Button></div>
          </form>
        )}
      </section>
    </div>
  )
}
