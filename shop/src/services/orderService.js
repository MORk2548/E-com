import { supabase } from '../lib/supabase.js'
// The server recomputes prices, discounts and stock; the client only sends ids, quantities and the coupon code.
export async function placeOrder({ items, shipping, paymentMethod, couponCode }) {
  if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.')
  const { data, error } = await supabase.rpc('place_order', {
    p_items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
    p_shipping: shipping, p_payment: paymentMethod, p_coupon: couponCode || null,
  })
  if (error) throw new Error(error.message)
  return { orderId: data[0].out_order_id, orderNumber: data[0].out_order_number }
}

const mapOrder = (o) => ({
  id: o.id, orderNumber: o.order_number, status: o.status, createdAt: o.created_at,
  subtotal: Number(o.subtotal), discount: Number(o.discount), shipping: Number(o.shipping_fee), total: Number(o.total),
  couponCode: o.coupon_code, shippingAddress: o.shipping_address, paymentMethod: o.payment_method,
})
// RLS guarantees customers only ever receive their own orders.
export async function getMyOrders({ page = 1, pageSize = 10 } = {}) {
  if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.')
  const from = (page - 1) * pageSize
  const { data, error, count } = await supabase.from('orders').select('*, order_items(quantity)', { count: 'exact' })
    .order('created_at', { ascending: false }).range(from, from + pageSize - 1)
  if (error) throw error
  return {
    items: data.map((o) => ({ ...mapOrder(o), itemCount: o.order_items.reduce((n, i) => n + i.quantity, 0) })),
    total: count || 0, page, pageCount: Math.max(1, Math.ceil((count || 0) / pageSize)),
  }
}
export async function getOrderById(id) {
  if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.')
  const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).maybeSingle()
  if (error) throw new Error(/uuid/i.test(error.message) ? 'Order not found' : error.message)
  if (!data) throw new Error('Order not found')
  return { ...mapOrder(data), items: data.order_items.map((i) => ({ id: i.id, productId: i.product_id, name: i.product_name, quantity: i.quantity, price: Number(i.price), subtotal: Number(i.subtotal) })) }
}

export async function cancelOrder(orderId) {
  if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.')
  const { error } = await supabase.rpc('cancel_order', { p_order_id: orderId })
  if (error) throw new Error(error.message)
}
