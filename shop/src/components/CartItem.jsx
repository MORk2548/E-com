import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import { formatPrice, salePrice } from '../lib/format.js'
export default function CartItem({ item, onQuantity, onRemove }) {
  const { product: p, quantity } = item
  return (
    <li className="citem">
      <Link to={`/products/${p.id}`} className="citem__img"><ProductImage product={p} /></Link>
      <div className="citem__info">
        <Link to={`/products/${p.id}`} className="citem__name">{p.name}</Link>
        <p className="muted">{p.category} · {formatPrice(salePrice(p))} each</p>
        <button className="link-btn" onClick={() => onRemove(p.id)}>Remove</button>
      </div>
      <div className="qty" role="group" aria-label={`Quantity for ${p.name}`}>
        <button onClick={() => onQuantity(p.id, quantity - 1)} disabled={quantity <= 1} aria-label="Decrease quantity">−</button>
        <span>{quantity}</span>
        <button onClick={() => onQuantity(p.id, quantity + 1)} disabled={quantity >= p.stock} aria-label="Increase quantity">+</button>
      </div>
      <strong className="citem__sub">{formatPrice(salePrice(p) * quantity)}</strong>
    </li>
  )
}
