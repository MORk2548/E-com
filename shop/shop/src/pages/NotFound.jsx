import Button from '../components/Button.jsx'
export default function NotFound() {
  return (
    <section className="container page-center">
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist or has moved.</p>
      <Button to="/">Go to home</Button>
    </section>
  )
}
