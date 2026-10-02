import { STATUS_LABELS } from '../lib/orderStatus.js'
export default function StatusBadge({ status }) {
  return <span className={`status status--${status}`}>{STATUS_LABELS[status] || status}</span>
}
