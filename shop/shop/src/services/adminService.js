import { supabase } from '../lib/supabase.js'
import { mapProduct } from './productService.js'
const need = () => { if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.') }

export async function getDashboard() {
  need()
  const { data, error } = await supabase.rpc('admin_dashboard') // server rejects non-admins
  if (error) throw new Error(error.message)
  return data
}
export async function getCategories() {
  need()
  const { data, error } = await supabase.from('categories').select('id, name').order('id')
  if (error) throw error
  return data
}

const SORTS = { newest: ['created_at', false], name: ['name', true], 'price-asc': ['price', true], 'price-desc': ['price', false], 'stock-asc': ['stock', true] }
const mapAdmin = (r) => ({ ...mapProduct(r), status: r.status, categoryId: r.category_id })

export async function getAdminProducts({ search = '', category = '', status = '', sort = 'newest', page = 1, pageSize = 10 } = {}) {
  need()
  let q = supabase.from('products').select('*, categories!inner(name)', { count: 'exact' })
  const term = search.trim().replace(/[,()%*]/g, ' ').trim()
  if (term) q = q.ilike('name', `%${term}%`)
  if (category) q = q.eq('categories.name', category)
  if (status) q = q.eq('status', status)
  const [col, asc] = SORTS[sort] || SORTS.newest
  const from = (page - 1) * pageSize
  const { data, error, count } = await q.order(col, { ascending: asc }).order('id').range(from, from + pageSize - 1)
  if (error) throw error
  return { items: data.map(mapAdmin), total: count || 0, page, pageCount: Math.max(1, Math.ceil((count || 0) / pageSize)) }
}
// Writes are allowed by RLS only for admins.
export async function createProduct(payload) {
  need()
  const { error } = await supabase.from('products').insert(payload)
  if (error) throw error
}
export async function updateProduct(id, payload) {
  need()
  const { error } = await supabase.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteProduct(id) {
  need()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error?.code === '23503') throw new Error("This game has existing orders, so it can't be deleted. Set its status to Draft to hide it from the store.")
  if (error) throw error
}

const sanitize = (s) => s.trim().replace(/[,()%*]/g, ' ').trim()

export async function getAdminOrders({ status = '', search = '', page = 1, pageSize = 10 } = {}) {
  need()
  let q = supabase.from('orders').select('*, profiles(name, email)', { count: 'exact' })
  if (status) q = q.eq('status', status)
  const term = sanitize(search)
  if (term) q = q.ilike('order_number', `%${term}%`)
  const from = (page - 1) * pageSize
  const { data, error, count } = await q.order('created_at', { ascending: false }).range(from, from + pageSize - 1)
  if (error) throw error
  return {
    items: data.map((o) => ({ id: o.id, orderNumber: o.order_number, customer: o.profiles?.name, email: o.profiles?.email, total: Number(o.total), status: o.status, paymentMethod: o.payment_method, createdAt: o.created_at })),
    total: count || 0, page, pageCount: Math.max(1, Math.ceil((count || 0) / pageSize)),
  }
}
// Status changes go through an RPC so cancelling also returns stock.
export async function setOrderStatus(id, status) {
  need()
  const { error } = await supabase.rpc('admin_set_order_status', { p_order_id: id, p_status: status })
  if (error) throw new Error(error.message)
}

export async function getAdminUsers({ search = '', role = '', status = '', page = 1, pageSize = 10 } = {}) {
  need()
  let q = supabase.from('profiles').select('*', { count: 'exact' })
  const term = sanitize(search)
  if (term) q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%,username.ilike.%${term}%`)
  if (role) q = q.eq('role', role)
  if (status) q = q.eq('status', status)
  const from = (page - 1) * pageSize
  const { data, error, count } = await q.order('created_at', { ascending: false }).range(from, from + pageSize - 1)
  if (error) throw error
  return { items: data, total: count || 0, page, pageCount: Math.max(1, Math.ceil((count || 0) / pageSize)) }
}
export async function getUserSummary(userId) {
  need()
  const { data, error } = await supabase.from('orders').select('total, status').eq('user_id', userId)
  if (error) throw error
  const paid = data.filter((o) => o.status !== 'cancelled')
  return { orders: data.length, spent: paid.reduce((n, o) => n + Number(o.total), 0) }
}
export async function setUserAccess(userId, { role, status }) {
  need()
  const { error } = await supabase.rpc('admin_update_user', { p_user_id: userId, p_role: role, p_status: status })
  if (error) throw new Error(error.message)
}
export async function getAnalytics() {
  need()
  const { data, error } = await supabase.rpc('admin_analytics')
  if (error) throw new Error(error.message)
  return data
}
