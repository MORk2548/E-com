import { salePrice } from './format.js'
export const SHIPPING_FEE = 10
export const FREE_SHIPPING_MIN = 100
const round2 = (n) => Math.round(n * 100) / 100

export function couponDiscount(coupon, subtotal) {
  if (!coupon || subtotal < (coupon.minSpend || 0)) return 0
  const raw = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value
  return Math.min(round2(raw), subtotal)
}
// Single source of truth for cart/checkout totals (Phase 5 reuses this).
export function calculateTotals(items, coupon) {
  const subtotal = round2(items.reduce((sum, i) => sum + salePrice(i.product) * i.quantity, 0))
  const discount = couponDiscount(coupon, subtotal)
  const shipping = items.length === 0 || subtotal - discount >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE
  return { subtotal, discount, shipping, total: round2(subtotal - discount + shipping) }
}
