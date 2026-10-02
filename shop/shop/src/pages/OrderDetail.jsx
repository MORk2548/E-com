import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OrderTimeline from '../components/OrderTimeline.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { ConfirmModal } from '../components/Modal.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Button from '../components/Button.jsx'
import Loading from '../components/Loading.jsx'
import useAsync from '../hooks/useAsync.js'
import { getOrderById, cancelOrder } from '../services/orderService.js'
import { formatDate, formatPrice } from '../lib/format.js'
import { PAYMENT_LABELS } from '../lib/orderStatus.js'

export default function OrderDetail() {
  const { id } = useParams()
  const { data: o, loading, error, reload } = useAsync(() => getOrderById(id), [id])
  const toast = useToast()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const doCancel = async () => {
    setBusy(true)
    try { await cancelOrder(id); toast('Order cancelled'); reload() } catch (err) { toast(err.message, 'error') } finally { setBusy(false); setConfirming(false) }
  }
  if (loading) return <div className="container section"><Loading label="Loading order" /></div>
  if (error) return (
    <div className="container section state" role="alert"><h2>{error.message === 'Order not found' ? 'Order not found.' : 'Something went wrong.'}</h2>
      <p className="muted">{error.message}</p><Button variant="secondary" onClick={reload}>Try again</Button> <Button to="/orders">Back to orders</Button></div>
  )
  const a = o.shippingAddress
  return (
    <div className="container section">
      <p className="muted"><Link to="/orders">My orders</Link> / #{o.orderNumber}</p>
      <div className="row cart-head"><h1>Order #{o.orderNumber}</h1><StatusBadge status={o.status} /></div>
      <p className="muted">Placed on {formatDate(o.createdAt)}</p>
      <div className="cart-layout">
        <div className="checkout-main">
          <section className="panel"><h2>Order status</h2><OrderTimeline status={o.status} />
            {o.status === 'pending' && <Button variant="secondary" className="cancel-btn" onClick={() => setConfirming(true)}>Cancel order</Button>}
          </section>
          <section className="panel"><h2>Items</h2>
            <div className="table-wrap"><table className="table">
              <thead><tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr></thead>
              <tbody>{o.items.map((i) => (
                <tr key={i.id}><td><Link to={`/products/${i.productId}`}>{i.name}</Link></td><td>{i.quantity}</td><td>{formatPrice(i.price)}</td><td>{formatPrice(i.subtotal)}</td></tr>
              ))}</tbody>
            </table></div>
          </section>
        </div>
        <OrderSummary totals={o}>
          <div className="order-meta">
            <h3>Shipping address</h3>
            <address>{a.firstName} {a.lastName}<br />{a.address}<br />{a.city}, {a.province} {a.postalCode}<br />{a.phone}</address>
            <h3>Payment method</h3>
            <p>{PAYMENT_LABELS[o.paymentMethod] || o.paymentMethod}</p>
          </div>
        </OrderSummary>
      </div>
      {confirming && <ConfirmModal title="Cancel this order?" message={`Order #${o.orderNumber} will be cancelled and the items returned to stock. This cannot be undone.`} confirmLabel="Yes, cancel order" cancelLabel="Keep order" busy={busy} onConfirm={doCancel} onClose={() => setConfirming(false)} />}
    </div>
  )
}
