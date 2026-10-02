import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
export default function useAddToCart() {
  const { add } = useCart()
  const toast = useToast()
  return (product, qty = 1) => {
    const { ok } = add(product, qty)
    toast(ok ? `${product.name} added to cart` : `You already have all available copies of ${product.name}`, ok ? 'success' : 'error')
  }
}
