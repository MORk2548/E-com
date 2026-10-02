import Button from './Button.jsx'
import { CloseIcon } from './Icons.jsx'
import { CATEGORIES } from '../services/productService.js'

// filters: { category, min, max, rating, stock } as strings; open/onClose control the mobile drawer.
export default function FilterPanel({ filters, onChange, onReset, open, onClose }) {
  return (
    <>
      {open && <div className="scrim" onClick={onClose} />}
      <aside className={'filters' + (open ? ' is-open' : '')} aria-label="Filters">
        <div className="filters__head"><h2>Filters</h2><button className="icon-btn filters__close" onClick={onClose} aria-label="Close filters"><CloseIcon /></button></div>
        <fieldset><legend>Category</legend>
          {['', ...CATEGORIES].map((c) => (
            <label key={c || 'all'} className="check"><input type="radio" name="category" checked={filters.category === c} onChange={() => onChange({ category: c })} />{c || 'All'}</label>
          ))}
        </fieldset>
        <fieldset><legend>Price range</legend>
          <div className="row">
            <input type="number" min="0" placeholder="Min" aria-label="Minimum price" value={filters.min} onChange={(e) => onChange({ min: e.target.value })} />
            <input type="number" min="0" placeholder="Max" aria-label="Maximum price" value={filters.max} onChange={(e) => onChange({ max: e.target.value })} />
          </div>
        </fieldset>
        <fieldset><legend>Rating</legend>
          <select value={filters.rating} onChange={(e) => onChange({ rating: e.target.value })} aria-label="Minimum rating">
            <option value="">Any</option><option value="4.5">4.5 & up</option><option value="4">4 & up</option><option value="3">3 & up</option>
          </select>
        </fieldset>
        <fieldset><legend>Availability</legend>
          <label className="check"><input type="checkbox" checked={filters.stock === '1'} onChange={(e) => onChange({ stock: e.target.checked ? '1' : '' })} />In stock only</label>
        </fieldset>
        <Button variant="secondary" onClick={onReset}>Clear filters</Button>
      </aside>
    </>
  )
}
