import { Navigate, useLocation } from 'react-router-dom'
import Button from '../components/Button.jsx'
export default function OrderSuccess() {
  const order = useLocation().state
  if (!order?.orderNumber) return <Navigate to="/" replace />
  return (
    <div className="container section state">
      <div className="success-mark" aria-hidden="true">✓</div>
      <h1>Order placed successfully!</h1>
      <p><strong>Order #{order.orderNumber}</strong></p>
      <p className="muted">Thank you for your purchase.</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Button to={`/orders/${order.orderId}`}>View Order</Button>
        <Button to="/products" variant="secondary">Continue Shopping</Button>
      </div>
    </div>
  )
}
