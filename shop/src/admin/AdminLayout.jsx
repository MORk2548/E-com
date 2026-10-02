import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
const items = [['/admin', 'Overview', true], ['/admin/products', 'Products'], ['/admin/orders', 'Orders'], ['/admin/users', 'Users'], ['/admin/analytics', 'Analytics']]
export default function AdminLayout() {
  const { profile } = useAuth()
  return (
    <div className="admin">
      <aside className="admin__side">
        <div><Link to="/" className="brand">SHOPNAME</Link><p className="muted admin__who">Admin · {profile?.name}</p></div>
        <nav aria-label="Admin">
          {items.map(([to, label, end]) => <NavLink key={to} to={to} end={end} className={({ isActive }) => 'nav-link' + (isActive ? ' is-active' : '')}>{label}</NavLink>)}
        </nav>
        <Link to="/" className="nav-link">← Back to store</Link>
      </aside>
      <main className="admin__main"><Outlet /></main>
    </div>
  )
}
