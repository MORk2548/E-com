import { TIMELINE } from '../lib/orderStatus.js'
export default function OrderTimeline({ status }) {
  if (status === 'cancelled') return <p className="alert" role="status">This order was cancelled.</p>
  const current = TIMELINE.findIndex(([key]) => key === status)
  return (
    <ol className="timeline" aria-label="Order progress">
      {TIMELINE.map(([key, label], i) => (
        <li key={key} className={i <= current ? 'is-done' : ''} aria-current={i === current ? 'step' : undefined}>
          <span className="timeline__dot" aria-hidden="true" />{label}
        </li>
      ))}
    </ol>
  )
}
