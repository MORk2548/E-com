import { supabase } from '../lib/supabase.js'

export const CATEGORIES = ['Action', 'RPG', 'Strategy', 'Indie']
export const PAGE_SIZE = 8
const need = () => { if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.') }
const SELECT = '*, categories!inner(name)'

const map = (r) => ({
  id: r.id, name: r.name, description: r.description, category: r.categories?.name,
  price: Number(r.price), discountPrice: r.discount_price == null ? null : Number(r.discount_price),
  stock: r.stock, imageUrl: r.image_url, rating: Number(r.rating), reviewCount: r.review_count,
  sold: r.sold_count, createdAt: r.created_at,
})
export const mapProduct = map
const sorts = {
  newest: ['created_at', false], 'price-asc': ['effective_price', true], 'price-desc': ['effective_price', false],
  rating: ['rating', false], popular: ['sold_count', false],
}

export async function getProducts({ search = '', category = '', minPrice, maxPrice, minRating = 0, inStock = false, sort = 'newest', page = 1, pageSize = PAGE_SIZE } = {}) {
  need()
  let q = supabase.from('products').select(SELECT, { count: 'exact' })
  const term = search.trim().replace(/[,()%*]/g, ' ').trim()
  if (term) {
    // Match product name, or any category whose name matches the term.
    const { data: cats } = await supabase.from('categories').select('id').ilike('name', `%${term}%`)
    const ids = (cats || []).map((c) => c.id)
    q = q.or([`name.ilike.%${term}%`, ids.length ? `category_id.in.(${ids.join(',')})` : null].filter(Boolean).join(','))
  }
  if (category) q = q.eq('categories.name', category)
  if (minPrice != null) q = q.gte('effective_price', minPrice)
  if (maxPrice != null) q = q.lte('effective_price', maxPrice)
  if (minRating) q = q.gte('rating', minRating)
  if (inStock) q = q.gt('stock', 0)
  const [col, asc] = sorts[sort] || sorts.newest
  const from = (Math.max(1, page) - 1) * pageSize
  const { data, error, count } = await q.order(col, { ascending: asc }).order('id').range(from, from + pageSize - 1)
  if (error) throw error
  const pageCount = Math.max(1, Math.ceil((count || 0) / pageSize))
  return { items: data.map(map), total: count || 0, page: Math.min(Math.max(1, page), pageCount), pageCount }
}
export async function getFeaturedProducts(limit = 4) {
  need()
  const { data, error } = await supabase.from('products').select(SELECT).order('sold_count', { ascending: false }).limit(limit)
  if (error) throw error
  return data.map(map)
}
export async function getProductById(id) {
  need()
  const { data, error } = await supabase.from('products').select(SELECT).eq('id', Number(id)).maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Product not found')
  return map(data)
}
export async function getRelatedProducts(id, limit = 4) {
  need()
  const base = await getProductById(id)
  const { data, error } = await supabase.from('products').select(SELECT).eq('categories.name', base.category).neq('id', base.id).limit(limit)
  if (error) throw error
  return data.map(map)
}
