import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import * as auth from '../services/authService.js'
import { updateProfile } from '../services/userService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [profile, setProfile] = useState(undefined) // undefined = not loaded yet

  // Restores the saved session on refresh and follows login/logout events.
  useEffect(() => {
    if (!supabase) { setSessionReady(true); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setSessionReady(true) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // Profile is fetched separately (never inside the auth callback) to avoid auth-client deadlocks.
  const userId = session?.user?.id
  useEffect(() => {
    if (!userId) { setProfile(undefined); return }
    let active = true
    auth.getProfile(userId)
      .then((p) => { if (!active) return; p.status === 'disabled' ? auth.signOut() : setProfile(p) })
      .catch(() => active && setProfile(null))
    return () => { active = false }
  }, [userId])

  const value = {
    user: session?.user ?? null,
    profile: profile ?? null,
    isAdmin: profile?.role === 'admin',
    loading: !sessionReady || (Boolean(userId) && profile === undefined),
    saveProfile: async (patch) => setProfile(await updateProfile(userId, patch)),
    login: auth.signIn, register: auth.signUp, logout: auth.signOut,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
