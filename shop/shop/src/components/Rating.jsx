export default function Rating({ value, count }) {
  return <span className="rating" aria-label={`Rated ${value} out of 5`}>★ {value.toFixed(1)}{count != null && <span className="muted"> ({count})</span>}</span>
}
