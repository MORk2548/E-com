import { supabase } from '../lib/supabase.js'
import { mapProduct } from './productService.js'
const need = () => { if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.') }

export async function getWishlist() {
  need()
  const { data, error } = await supabase.from('wishlists').select('created_at, products(*, categories(name))').order('created_at', { ascending: false })
  if (error) throw error
  return data.filter((r) => r.products).map((r) => mapProduct(r.products))
}
export async function addToWishlist(productId) {
  need()
  const { error } = await supabase.from('wishlists').insert({ product_id: productId }) // user_id defaults to auth.uid()
  if (error && error.code !== '23505') throw error // 23505 = already in wishlist
}
export async function removeFromWishlist(productId) {
  need()
  const { error } = await supabase.from('wishlists').delete().eq('product_id', productId)
  if (error) throw error
}
