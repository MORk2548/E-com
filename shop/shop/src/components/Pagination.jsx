export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">←</button>
      {pages.map((n) => <button key={n} className={n === page ? 'is-current' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)}>{n}</button>)}
      <button disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">→</button>
    </nav>
  )
}
