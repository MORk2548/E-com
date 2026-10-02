export default function Loading({ label = 'Loading' }) {
  return <div className="loading" role="status" aria-live="polite"><span className="spinner" /><span className="sr-only">{label}</span></div>
}
