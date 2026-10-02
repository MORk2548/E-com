import ProductGrid from '../components/ProductGrid.jsx'
import Button from '../components/Button.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
export default function Wishlist() {
  const { products, loading } = useWishlist()
  return (
    <div className="container section">
      <h1>Wishlist</h1>
      {!loading && products.length === 0
        ? <div className="state"><h3>Your wishlist is empty.</h3><p className="muted">Tap the heart on any game to save it for later.</p><Button to="/products">Browse games</Button></div>
        : <ProductGrid products={products} loading={loading} skeletons={4} />}
    </div>
  )
}
