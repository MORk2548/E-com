import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import { formatDate, formatPrice } from '../lib/format.js'
// One row of the My Orders table.
export default function OrderCard({ order }) {
  return (
    <tr>
      <td><strong>#{order.orderNumber}</strong></td>
      <td>{formatDate(order.createdAt)}</td>
      <td>{order.itemCount}</td>
      <td>{formatPrice(order.total)}</td>
      <td><StatusBadge status={order.status} /></td>
      <td><Link to={`/orders/${order.id}`} className="link-btn">View Order</Link></td>
    </tr>
  )
}
