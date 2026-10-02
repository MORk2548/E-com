import CartItem from '../components/CartItem.jsx'
import CouponForm from '../components/CouponForm.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Button from '../components/Button.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Cart() {
  const { items, coupon, totals, setQuantity, remove, clear, applyCoupon, removeCoupon } = useCart()
  const toast = useToast()
  if (items.length === 0) return (
    <div className="container section state"><h1>Shopping Cart</h1><p className="muted">Your cart is empty.</p><Button to="/products">Browse games</Button></div>
  )
  return (
    <div className="container section">
      <div className="row cart-head"><h1>Shopping Cart</h1><button className="link-btn" onClick={() => { clear(); toast('Cart cleared') }}>Clear cart</button></div>
      <div className="cart-layout">
        <ul className="clist">
          {items.map((i) => <CartItem key={i.product.id} item={i} onQuantity={setQuantity} onRemove={(id) => { remove(id); toast(`${i.product.name} removed`) }} />)}
        </ul>
        <OrderSummary totals={totals}>
          <CouponForm coupon={coupon} onApply={applyCoupon} onRemove={removeCoupon} />
          <Button to="/checkout" size="lg" className="btn--block">Proceed to Checkout</Button>
        </OrderSummary>
      </div>
    </div>
  )
}
