import { supabase } from '../lib/supabase.js'
// RLS + column grants: users can only change their own name, phone and address.
export async function updateProfile(userId, { name, phone, address }) {
  if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.')
  const { data, error } = await supabase.from('profiles').update({ name, phone, address, updated_at: new Date().toISOString() }).eq('id', userId).select().single()
  if (error) throw error
  return data
}
