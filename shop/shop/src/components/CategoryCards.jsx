import { Link } from 'react-router-dom'
import { CATEGORIES } from '../services/productService.js'
const blurb = { Action: 'Fast, reflex-driven combat', RPG: 'Deep worlds and big choices', Strategy: 'Plan, build and outthink', Indie: 'Small teams, big ideas' }
export default function CategoryCards() {
  return (
    <div className="cat-grid">
      {CATEGORIES.map((c) => (
        <Link key={c} to={`/products?category=${c}`} className="cat-card"><h3>{c}</h3><p className="muted">{blurb[c]}</p></Link>
      ))}
    </div>
  )
}
