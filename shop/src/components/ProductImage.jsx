import { useState } from 'react'
// Shows product.imageUrl; falls back to a placeholder tile if missing or broken.
const tint = { Action: '#FEE2E2', RPG: '#E0E7FF', Strategy: '#DCFCE7', Indie: '#FEF3C7' }
export default function ProductImage({ product, className = '' }) {
  const [failed, setFailed] = useState(false)
  const initials = product.name.split(' ').slice(0, 2).map((w) => w[0]).join('')
  if (product.imageUrl && !failed) {
    return <div className={`pimg ${className}`}><img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" onError={() => setFailed(true)} /></div>
  }
  return (
    <div className={`pimg ${className}`} style={{ background: tint[product.category] || '#E2E8F0' }} role="img" aria-label={`${product.name} cover`}>
      <span>{initials}</span>
    </div>
  )
}
