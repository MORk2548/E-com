import { Link } from 'react-router-dom'
const cols = [
  { title: 'Shop', items: [['Products', '/products'], ['Categories', '/categories'], ['Wishlist', '/wishlist']] },
  { title: 'Account', items: [['Login', '/login'], ['Register', '/register'], ['My orders', '/orders']] },
]
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__about">
          <Link to="/" className="brand">SHOPNAME</Link>
          <p>Everyday products, simply priced. A portfolio project built with React and Supabase.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="footer__title">{c.title}</h3>
            <ul>{c.items.map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="container footer__bottom">© {new Date().getFullYear()} SHOPNAME. Demo store, no real payments.</div>
    </footer>
  )
}
