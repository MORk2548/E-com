import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Button from '../components/Button.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { placeOrder } from '../services/orderService.js'
import { validateCheckout } from '../lib/validators.js'

const METHODS = [['card', 'Credit Card'], ['cod', 'Cash on Delivery'], ['bank_transfer', 'Bank Transfer']]

export default function Checkout() {
  const { items, coupon, totals, clear } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const placed = useRef(false)
  const [first = '', ...rest] = (profile?.name || '').split(' ')
  const [s, setS] = useState({ firstName: first, lastName: rest.join(' '), email: user?.email || '', phone: profile?.phone || '', address: profile?.address || '', city: '', province: '', postalCode: '' })
  const [payment, setPayment] = useState('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' }) // demo only: never sent or stored
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  if (items.length === 0 && !placed.current) return <Navigate to="/cart" replace />
  const set = (e) => setS((v) => ({ ...v, [e.target.name]: e.target.value }))
  const setC = (e) => setCard((v) => ({ ...v, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const v = validateCheckout(s, payment, card); setErrors(v); setFormError('')
    if (Object.keys(v).length) return
    setBusy(true)
    try {
      const order = await placeOrder({ items, shipping: s, paymentMethod: payment, couponCode: coupon?.code })
      placed.current = true
      clear()
      navigate('/order-success', { replace: true, state: order })
    } catch (err) { setFormError(err.message); setBusy(false) }
  }
  const f = (id, label, extra = {}) => <FormField id={id} label={label} value={s[id]} onChange={set} error={errors[id]} {...extra} />

  return (
    <div className="container section">
      <h1>Checkout</h1>
      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="checkout-main">
          {formError && <p className="alert" role="alert">{formError} <Link to="/cart"><u>Review cart</u></Link></p>}
          <section className="panel"><h2>Shipping information</h2>
            <div className="form-grid">
              {f('firstName', 'First name', { autoComplete: 'given-name' })}{f('lastName', 'Last name', { autoComplete: 'family-name' })}
              {f('email', 'Email', { type: 'email', autoComplete: 'email' })}{f('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
              <div className="span-2">{f('address', 'Address', { autoComplete: 'street-address' })}</div>
              {f('city', 'City')}{f('province', 'Province')}{f('postalCode', 'Postal code', { inputMode: 'numeric', maxLength: 5 })}
            </div>
          </section>
          <section className="panel"><h2>Payment</h2>
            <p className="muted">Demo store: no real payment is taken and card details are never stored.</p>
            <div className="pay-options" role="radiogroup" aria-label="Payment method">
              {METHODS.map(([v, label]) => <label key={v} className={'pay' + (payment === v ? ' is-active' : '')}><input type="radio" name="payment" checked={payment === v} onChange={() => setPayment(v)} />{label}</label>)}
            </div>
            {payment === 'card' && (
              <div className="form-grid">
                <div className="span-2"><FormField id="number" label="Card number" inputMode="numeric" placeholder="4242 4242 4242 4242" value={card.number} onChange={setC} error={errors.cardNumber} autoComplete="off" /></div>
                <FormField id="expiry" label="Expiry (MM/YY)" placeholder="08/28" value={card.expiry} onChange={setC} error={errors.cardExpiry} autoComplete="off" />
                <FormField id="cvc" label="CVC" inputMode="numeric" maxLength={4} value={card.cvc} onChange={setC} error={errors.cardCvc} autoComplete="off" />
              </div>
            )}
            {payment === 'bank_transfer' && <p className="muted">Transfer details will be shown on your order after you place it.</p>}
          </section>
        </div>
        <OrderSummary totals={totals} items={items}>
          <Button type="submit" size="lg" className="btn--block" disabled={busy}>{busy ? 'Placing order…' : 'Place Order'}</Button>
        </OrderSummary>
      </form>
    </div>
  )
}
