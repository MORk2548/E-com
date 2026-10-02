import { supabase } from '../lib/supabase.js'
// Coupons live in the database; this RPC validates a code without exposing the whole table.
export async function validateCoupon(code, subtotal) {
  if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.')
  const { data, error } = await supabase.rpc('validate_coupon', { p_code: code, p_subtotal: subtotal })
  if (error) throw new Error(error.message)
  const c = data[0]
  return { code: c.code, type: c.type, value: Number(c.value), minSpend: Number(c.min_spend), label: c.label }
}
