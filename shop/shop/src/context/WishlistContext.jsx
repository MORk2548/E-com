import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import { useToast } from './ToastContext.jsx'
import * as api from '../services/wishlistService.js'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const userId = user?.id

  useEffect(() => {
    if (!userId) { setProducts([]); return }
    let active = true
    setLoading(true)
    api.getWishlist().then((p) => active && setProducts(p)).catch(() => active && toast('Could not load your wishlist', 'error')).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const ids = useMemo(() => new Set(products.map((p) => p.id)), [products])
  // Optimistic update; rolls back if the request fails.
  const toggle = async (product) => {
    if (!userId) { toast('Log in to use your wishlist', 'error'); navigate('/login', { state: { from: location } }); return }
    const had = ids.has(product.id)
    setProducts((l) => (had ? l.filter((p) => p.id !== product.id) : [product, ...l]))
    try {
      await (had ? api.removeFromWishlist(product.id) : api.addToWishlist(product.id))
      toast(had ? 'Removed from wishlist' : 'Added to wishlist')
    } catch {
      setProducts((l) => (had ? [product, ...l] : l.filter((p) => p.id !== product.id)))
      toast('Something went wrong. Please try again.', 'error')
    }
  }
  const value = { products, loading, count: products.length, has: (id) => ids.has(id), toggle }
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
export const useWishlist = () => useContext(WishlistContext)
