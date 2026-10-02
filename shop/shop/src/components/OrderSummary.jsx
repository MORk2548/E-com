import { formatPrice } from '../lib/format.js'
import { FREE_SHIPPING_MIN } from '../lib/pricing.js'
// Reused by Cart now and Checkout in Phase 5. `children` holds coupon form / action buttons.
export default function OrderSummary({ totals, items, children }) {
  const { subtotal, discount, shipping, total } = totals
  return (
    <aside className="summary" aria-label="Order summary">
      <h2>Order Summary</h2>
      {items && <ul className="summary__items">{items.map((i) => <li key={i.product.id}><span>{i.product.name} × {i.quantity}</span><span>{formatPrice((i.product.discountPrice ?? i.product.price) * i.quantity)}</span></li>)}</ul>}
      <dl>
        <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        {discount > 0 && <div><dt>Discount</dt><dd className="ok">−{formatPrice(discount)}</dd></div>}
        <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
        <div className="summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
      </dl>
      {shipping > 0 && <p className="muted summary__hint">Free shipping on orders over {formatPrice(FREE_SHIPPING_MIN)}.</p>}
      {children}
    </aside>
  )
}
