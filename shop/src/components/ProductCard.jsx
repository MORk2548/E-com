import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import Rating from './Rating.jsx'
import Button from './Button.jsx'
import { HeartIcon } from './Icons.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import useAddToCart from '../hooks/useAddToCart.js'
import { formatPrice } from '../lib/format.js'

// onAddToCart / onToggleWishlist are wired to contexts in Phases 3 and 7.
export default function ProductCard({ product, onAddToCart }) {
  const { has, toggle } = useWishlist()
  const wished = has(product.id)
  const addDefault = useAddToCart()
  const out = product.stock <= 0
  return (
    <article className="pcard">
      <div className="pcard__media">
        <Link to={`/products/${product.id}`} aria-label={product.name}><ProductImage product={product} /></Link>
        <button className={'pcard__wish icon-btn' + (wished ? ' is-wished' : '')} aria-pressed={wished} aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist`} onClick={() => toggle(product)}><HeartIcon /></button>
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name"><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
        <p className="muted pcard__cat">{product.category}</p>
        <Rating value={product.rating} />
        <p className="price">
          <strong>{formatPrice(product.discountPrice ?? product.price)}</strong>
          {product.discountPrice != null && <s className="muted">{formatPrice(product.price)}</s>}
        </p>
        {out && <p className="stock stock--out">Out of Stock</p>}
        <Button size="sm" disabled={out} onClick={() => (onAddToCart ?? addDefault)(product, 1)}>Add to Cart</Button>
      </div>
    </article>
  )
}
