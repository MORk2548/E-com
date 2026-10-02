import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
export default function MainLayout() {
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main" className="app-main" tabIndex={-1}><Outlet /></main>
      <Footer />
    </div>
  )
}
