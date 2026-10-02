import { supabase } from '../lib/supabase.js'
const need = () => { if (!supabase) throw new Error('Supabase is not configured. Add your keys to .env.') }

export async function signUp({ name, username, email, password }) {
  need()
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, username: username.trim() } } })
  if (error) throw error
  return data // data.session is null when email confirmation is required
}
export async function isUsernameAvailable(username) {
  need()
  const { data, error } = await supabase.rpc('username_available', { p_username: username })
  if (error) throw error
  return Boolean(data)
}
// `identifier` is an email or a username; usernames are resolved to an email first.
export async function signIn({ identifier, password }) {
  need()
  let email = identifier.trim()
  if (!email.includes('@')) {
    const { data, error } = await supabase.rpc('email_for_username', { p_username: email })
    if (error || !data) throw new Error('Invalid login credentials') // same message as a wrong password
    email = data
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}
export async function signOut() { need(); const { error } = await supabase.auth.signOut(); if (error) throw error }
export async function getProfile(userId) {
  need()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}
