import Button from '../components/Button.jsx'
export default function PlaceholderPage({ title, phase }) {
  return (
    <section className="container page-center">
      <h1>{title}</h1>
      <p className="muted">This page is built in {phase}.</p>
      <Button to="/" variant="secondary">Back to home</Button>
    </section>
  )
}
