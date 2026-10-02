import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Pagination from '../components/Pagination.jsx'
import Button from '../components/Button.jsx'
import useAsync from '../hooks/useAsync.js'
import { getProducts } from '../services/productService.js'

const KEYS = ['q', 'category', 'min', 'max', 'rating', 'stock', 'sort', 'page']
const num = (v) => (v === '' || v == null ? undefined : Number(v))

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const f = Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? '']))

  // All list state lives in the URL, so it is shareable and survives refresh.
  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries({ page: '', ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next)
  }
  const { data, loading, error, reload } = useAsync(() => getProducts({
    search: f.q, category: f.category, minPrice: num(f.min), maxPrice: num(f.max),
    minRating: num(f.rating) || 0, inStock: f.stock === '1', sort: f.sort || 'newest', page: num(f.page) || 1,
  }), [params.toString()])

  return (
    <div className="container section">
      <h1>Products</h1>
      <div className="toolbar">
        <SearchBar value={f.q} onChange={(q) => update({ q })} />
        <Button variant="secondary" className="toolbar__filters" onClick={() => setDrawer(true)}>Filters</Button>
        <select value={f.sort || 'newest'} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort products">
          <option value="newest">Newest</option><option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option><option value="rating">Rating</option><option value="popular">Most Popular</option>
        </select>
      </div>
      <div className="layout">
        <FilterPanel filters={f} onChange={update} onReset={() => setParams({})} open={drawer} onClose={() => setDrawer(false)} />
        <div>
          {data && <p className="muted">{data.total} {data.total === 1 ? 'game' : 'games'}</p>}
          <ProductGrid products={data?.items} loading={loading} error={error} onRetry={reload} />
          {data && <Pagination page={data.page} pageCount={data.pageCount} onChange={(page) => { update({ page: String(page) }); window.scrollTo(0, 0) }} />}
        </div>
      </div>
    </div>
  )
}
