import { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import Pagination from '../components/Pagination.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { ConfirmModal } from '../components/Modal.jsx'
import Loading from '../components/Loading.jsx'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import useAsync from '../hooks/useAsync.js'
import { getAdminOrders, setOrderStatus } from '../services/adminService.js'
import { formatDate, formatPrice } from '../lib/format.js'
import { STATUS_LABELS, PAYMENT_LABELS } from '../lib/orderStatus.js'

export default function AdminOrders() {
  const toast = useToast()
  const [f, setF] = useState({ status: '', search: '', page: 1 })
  const [pending, setPending] = useState(null) // { order, status } awaiting cancel confirmation
  const [busy, setBusy] = useState(false)
  const { data, loading, error, reload } = useAsync(() => getAdminOrders(f), [JSON.stringify(f)])
  const patch = (p) => setF((x) => ({ ...x, page: 1, ...p }))

  const apply = async (order, status) => {
    setBusy(true)
    try { await setOrderStatus(order.id, status); toast(`Order #${order.orderNumber} is now ${STATUS_LABELS[status]}`); reload() }
    catch (err) { toast(err.message, 'error') } finally { setBusy(false); setPending(null) }
  }
  const change = (order, status) => (status === 'cancelled' ? setPending({ order, status }) : apply(order, status))

  return (
    <>
      <h1>Orders</h1>
      <div className="toolbar">
        <SearchBar value={f.search} onChange={(search) => patch({ search })} />
        <select value={f.status} onChange={(e) => patch({ status: e.target.value })} aria-label="Filter by status">
          <option value="">All statuses</option>{Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {loading && <Loading label="Loading orders" />}
      {error && <div className="state" role="alert"><h3>Something went wrong.</h3><p className="muted">{error.message}</p><Button variant="secondary" onClick={reload}>Try again</Button></div>}
      {data && data.items.length === 0 && <div className="state"><h3>No orders found.</h3></div>}
      {data && data.items.length > 0 && (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th><span className="sr-only">View</span></th></tr></thead>
            <tbody>{data.items.map((o) => (
              <tr key={o.id}>
                <td><strong>#{o.orderNumber}</strong></td>
                <td>{o.customer}<br /><span className="muted">{o.email}</span></td>
                <td>{formatDate(o.createdAt)}</td><td>{formatPrice(o.total)}</td><td>{PAYMENT_LABELS[o.paymentMethod]}</td>
                <td>{o.status === 'cancelled' ? <StatusBadge status="cancelled" /> : (
                  <select value={o.status} disabled={busy} onChange={(e) => change(o, e.target.value)} aria-label={`Status for order ${o.orderNumber}`}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>)}</td>
                <td><Link to={`/orders/${o.id}`} className="link-btn">View</Link></td>
              </tr>))}</tbody>
          </table></div>
          <Pagination page={data.page} pageCount={data.pageCount} onChange={(page) => setF((x) => ({ ...x, page }))} />
        </>
      )}
      {pending && <ConfirmModal title="Cancel this order?" message={`Order #${pending.order.orderNumber} will be cancelled and its items returned to stock. A cancelled order can't be reopened.`}
        confirmLabel="Yes, cancel order" cancelLabel="Keep order" busy={busy} onConfirm={() => apply(pending.order, 'cancelled')} onClose={() => setPending(null)} />}
    </>
  )
}
