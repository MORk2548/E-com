import { useState } from 'react'
import Button from '../components/Button.jsx'
import CategoryCards from '../components/CategoryCards.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import ProductImage from '../components/ProductImage.jsx'
import useAsync from '../hooks/useAsync.js'
import { getFeaturedProducts } from '../services/productService.js'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const submit = (e) => {
    e.preventDefault()
    setMsg(/^\S+@\S+\.\S+$/.test(email) ? 'Thanks! Check your inbox for your 10% code.' : 'Enter a valid email address.')
  }
  return (
    <section className="container section"><div className="newsletter">
      <h2>Get 10% off your first order.</h2>
      <form onSubmit={submit} noValidate>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" />
        <Button type="submit">Subscribe</Button>
      </form>
      {msg && <p role="status" className="muted">{msg}</p>}
    </div></section>
  )
}

export default function Home() {
  const { data, loading, error, reload } = useAsync(() => getFeaturedProducts(4))
  const lead = data?.[0]
  return (
    <>
      <section className="container hero">
        <div>
          <h1>Great games, ready to play tonight.</h1>
          <p className="muted">From sprawling RPGs to tight indie gems, pick up your next favorite at prices worth clicking for.</p>
          <Button to="/products" size="lg">Shop now</Button>
        </div>
        {lead && <div className="hero__art"><ProductImage product={lead} /><p><strong>{lead.name}</strong><span className="muted"> · top seller</span></p></div>}
      </section>
      <section className="container section" id="categories"><h2>Browse by category</h2><CategoryCards /></section>
      <section className="container section"><h2>Featured games</h2><ProductGrid products={data} loading={loading} error={error} onRetry={reload} skeletons={4} /></section>
      <section className="container section"><div className="promo">
        <div><h2>Summer Sale</h2><p>Up to 30% off selected games.</p></div>
        <Button to="/products?sort=price-asc" variant="secondary">Shop now</Button>
      </div></section>
      <Newsletter />
    </>
  )
}
