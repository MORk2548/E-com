import ProductCard from './ProductCard.jsx'
import Button from './Button.jsx'

export default function ProductGrid({ products, loading, error, onRetry, skeletons = 8, ...cardProps }) {
  if (error) return (
    <div className="state" role="alert"><h3>Something went wrong.</h3><p className="muted">{error.message}</p><Button variant="secondary" onClick={onRetry}>Try again</Button></div>
  )
  if (loading) return <div className="pgrid" aria-busy="true">{Array.from({ length: skeletons }, (_, i) => <div key={i} className="skeleton" />)}</div>
  if (!products?.length) return <div className="state"><h3>No products found.</h3><p className="muted">Try a different search or clear your filters.</p></div>
  return <div className="pgrid">{products.map((p) => <ProductCard key={p.id} product={p} {...cardProps} />)}</div>
}
