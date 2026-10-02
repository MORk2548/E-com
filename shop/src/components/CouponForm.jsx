import { useState } from 'react'
import Button from './Button.jsx'
export default function CouponForm({ coupon, onApply, onRemove }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (coupon) return <div className="coupon-applied"><span><strong>{coupon.code}</strong> applied · {coupon.label}</span><button className="link-btn" onClick={onRemove}>Remove</button></div>
  const submit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return setError('Enter a coupon code.')
    setBusy(true); setError('')
    try { await onApply(code); setCode('') } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} noValidate>
      <div className="row"><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" aria-invalid={!!error} style={{ flex: 1, minWidth: 0 }} />
        <Button type="submit" variant="secondary" disabled={busy}>{busy ? 'Applying…' : 'Apply'}</Button></div>
      {error && <p className="field-error" role="alert">{error}</p>}
    </form>
  )
}
