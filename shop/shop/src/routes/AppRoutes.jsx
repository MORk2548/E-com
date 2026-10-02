import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Home from '../pages/Home.jsx'
import Products from '../pages/Products.jsx'
import ProductDetail from '../pages/ProductDetail.jsx'
import Categories from '../pages/Categories.jsx'
const Cart = lazy(() => import('../pages/Cart.jsx'))
const Login = lazy(() => import('../pages/Login.jsx'))
const Register = lazy(() => import('../pages/Register.jsx'))
const Checkout = lazy(() => import('../pages/Checkout.jsx'))
const OrderSuccess = lazy(() => import('../pages/OrderSuccess.jsx'))
const Orders = lazy(() => import('../pages/Orders.jsx'))
const OrderDetail = lazy(() => import('../pages/OrderDetail.jsx'))
const AdminLayout = lazy(() => import('../admin/AdminLayout.jsx'))
const Dashboard = lazy(() => import('../admin/Dashboard.jsx'))
const AdminProducts = lazy(() => import('../admin/Products.jsx'))
const AdminOrders = lazy(() => import('../admin/Orders.jsx'))
const AdminUsers = lazy(() => import('../admin/Users.jsx'))
const Analytics = lazy(() => import('../admin/Analytics.jsx'))
const Profile = lazy(() => import('../pages/Profile.jsx'))
const Wishlist = lazy(() => import('../pages/Wishlist.jsx'))
import NotFound from '../pages/NotFound.jsx'

const TITLES = { '': 'Home', products: 'Products', categories: 'Categories', cart: 'Shopping cart', login: 'Log in', register: 'Create account',
  checkout: 'Checkout', 'order-success': 'Order placed', orders: 'My orders', profile: 'Profile', wishlist: 'Wishlist', admin: 'Admin' }

// On navigation: scroll to top, update the tab title and move focus to <main> for keyboard/screen-reader users.
function RouteEffects() {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${TITLES[pathname.split('/')[1] ?? ''] ?? 'Page not found'} · SHOPNAME`
    if (first.current) { first.current = false; return }
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

export default function AppRoutes() {
  return (
    <>
      <RouteEffects />
      <Suspense fallback={<div className="container section"><Loading /></div>}>
      <Routes>
        <Route path="admin" element={<ProtectedRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </>
  )
}
