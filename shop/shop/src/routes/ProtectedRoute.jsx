import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="container section"><Loading /></div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}
