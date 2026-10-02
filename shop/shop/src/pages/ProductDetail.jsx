import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductImage from '../components/ProductImage.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Rating from '../components/Rating.jsx'
import Button from '../components/Button.jsx'
import Loading from '../components/Loading.jsx'
import { HeartIcon } from '../components/Icons.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import useAddToCart from '../hooks/useAddToCart.js'
import useAsync from '../hooks/useAsync.js'
import { getProductById, getRelatedProducts } from '../services/productService.js'
import { formatPrice } from '../lib/format.js'

export default function ProductDetail() {
  const { id } = useParams()
  const [qty, setQty] = useState(1)
  const { data: p, loading, error, reload } = useAsync(() => getProductById(id), [id])
  const addToCart = useAddToCart()
  const { has, toggle } = useWishlist()
  const related = useAsync(() => getRelatedProducts(id), [id])

  useEffect(() => { if (p) document.title = `${p.name} · SHOPNAME` }, [p])
  if (loading) return <div className="container section"><Loading /></div>
  if (error) return (
    <div className="container section state" role="alert"><h2>Product not found.</h2><p className="muted">{error.message}</p>
      <Button variant="secondary" onClick={reload}>Try again</Button> <Button to="/products">Back to products</Button></div>
  )
  const out = p.stock <= 0
  const max = Math.min(p.stock, 10)
  return (
    <div className="container section">
      <p className="muted"><Link to="/products">Products</Link> / {p.name}</p>
      <div className="detail">
        <div>
          <ProductImage product={p} className="pimg--lg" />
          <div className="thumbs">{[0, 1, 2].map((i) => <button key={i} className={'thumb' + (i === 0 ? ' is-active' : '')} aria-label={`Image ${i + 1}`}><ProductImage product={p} /></button>)}</div>
        </div>
        <div>
          <p className="muted">{p.category}</p>
          <h1>{p.name}</h1>
          <Rating value={p.rating} count={p.reviewCount} />
          <p className="price price--lg"><strong>{formatPrice(p.discountPrice ?? p.price)}</strong>{p.discountPrice != null && <s className="muted">{formatPrice(p.price)}</s>}</p>
          <p>{p.description}</p>
          <p className={'stock ' + (out ? 'stock--out' : 'stock--in')}>{out ? 'Out of Stock' : `In stock (${p.stock} left)`}</p>
          <div className="qty" role="group" aria-label="Quantity">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={out || qty <= 1} aria-label="Decrease quantity">−</button>
            <span>{out ? 0 : qty}</span>
            <button onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={out || qty >= max} aria-label="Increase quantity">+</button>
          </div>
          <div className="row">
            <Button size="lg" disabled={out} onClick={() => addToCart(p, qty)}>Add to Cart</Button>
            <Button size="lg" variant="secondary" className={has(p.id) ? 'is-wished' : ''} aria-pressed={has(p.id)} aria-label={has(p.id) ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggle(p)}><HeartIcon /></Button>
          </div>
        </div>
      </div>
      <section className="section"><h2>Reviews</h2><p className="muted">{p.reviewCount} ratings, average {p.rating.toFixed(1)} out of 5. Written reviews arrive with the database in Phase 4.</p></section>
      <section className="section"><h2>Related games</h2><ProductGrid products={related.data} loading={related.loading} error={related.error} onRetry={related.reload} skeletons={4} /></section>
    </div>
  )
}
