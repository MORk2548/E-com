import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { calculateTotals } from '../lib/pricing.js'
import { validateCoupon } from '../services/couponService.js'

const CartContext = createContext(null)
const KEY = 'shopname:cart:v1'
const EMPTY = { items: [], coupon: null }
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || EMPTY } catch { return EMPTY } }
const snapshot = ({ id, name, category, price, discountPrice, stock, imageUrl }) => ({ id, name, category, price, discountPrice, stock, imageUrl })

export function CartProvider({ children }) {
  const [state, setState] = useState(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage unavailable */ } }, [state])

  const totals = useMemo(() => calculateTotals(state.items, state.coupon), [state])
  const count = useMemo(() => state.items.reduce((n, i) => n + i.quantity, 0), [state.items])

  // Returns { ok } so callers can show feedback; quantity never exceeds stock.
  const add = (product, qty = 1) => {
    const current = state.items.find((i) => i.product.id === product.id)?.quantity || 0
    if (Math.min(current + qty, product.stock) <= current) return { ok: false }
    setState((s) => {
      const found = s.items.find((i) => i.product.id === product.id)
      const next = Math.min((found?.quantity || 0) + qty, product.stock)
      const items = found ? s.items.map((i) => (i === found ? { ...i, quantity: next } : i)) : [...s.items, { product: snapshot(product), quantity: next }]
      return { ...s, items }
    })
    return { ok: true }
  }
  const setQuantity = (id, qty) => setState((s) => ({ ...s, items: s.items.map((i) => i.product.id === id ? { ...i, quantity: Math.max(1, Math.min(qty, i.product.stock)) } : i) }))
  const remove = (id) => setState((s) => ({ ...s, items: s.items.filter((i) => i.product.id !== id) }))
  const clear = () => setState(EMPTY)
  const applyCoupon = async (code) => { const coupon = await validateCoupon(code, totals.subtotal); setState((s) => ({ ...s, coupon })); return coupon }
  const removeCoupon = () => setState((s) => ({ ...s, coupon: null }))

  const value = { items: state.items, coupon: state.coupon, totals, count, add, setQuantity, remove, clear, applyCoupon, removeCoupon }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export const useCart = () => useContext(CartContext)
