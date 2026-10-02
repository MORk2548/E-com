import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { SearchIcon, HeartIcon, CartIcon, UserIcon, MenuIcon, CloseIcon, LogoutIcon } from './Icons.jsx'

const links = [{ to: '/', label: 'Home', end: true }, { to: '/products', label: 'Products' }, { to: '/categories', label: 'Categories' }]

export default function Navbar() {
  const { count: cartCount } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, logout, isAdmin } = useAuth()
  const items = isAdmin ? [...links, { to: '/admin', label: 'Admin' }] : links
  const toast = useToast()
  const onLogout = () => logout().then(() => toast('Logged out')).catch((e) => toast(e.message, 'error'))
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const navClass = ({ isActive }) => 'nav-link' + (isActive ? ' is-active' : '')
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="brand">SHOPNAME</Link>
        <nav className="navbar__links" aria-label="Main">
          {items.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>{l.label}</NavLink>)}
        </nav>
        <div className="navbar__actions">
          <Link to="/products" className="icon-btn" aria-label="Search"><SearchIcon /></Link>
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist"><HeartIcon />{wishCount > 0 && <span className="badge">{wishCount}</span>}</Link>
          <Link to="/cart" className="icon-btn" aria-label={`Cart, ${cartCount} items`}>
            <CartIcon />{cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          <Link to={user ? '/profile' : '/login'} className="icon-btn" aria-label="Account"><UserIcon /></Link>
          {user && <button className="icon-btn navbar__logout" aria-label="Log out" onClick={onLogout}><LogoutIcon /></button>}
          <button className="icon-btn navbar__toggle" aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className={'mobile-menu' + (open ? ' is-open' : '')} aria-label="Mobile">
        <div className="container">
          {items.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>{l.label}</NavLink>)}
          <NavLink to="/wishlist" className={navClass}>Wishlist</NavLink>
          <NavLink to={user ? '/profile' : '/login'} className={navClass}>Account</NavLink>
          {user && <button className="nav-link nav-link--btn" onClick={onLogout}>Log out</button>}
        </div>
      </nav>
    </header>
  )
}
