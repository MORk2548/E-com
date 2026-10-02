import { Link } from 'react-router-dom'
import BarChart from '../components/BarChart.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Loading from '../components/Loading.jsx'
import Button from '../components/Button.jsx'
import useAsync from '../hooks/useAsync.js'
import { getDashboard } from '../services/adminService.js'
import { formatDate, formatPrice } from '../lib/format.js'

export default function Dashboard() {
  const { data: d, loading, error, reload } = useAsync(getDashboard, [])
  if (loading) return <Loading label="Loading dashboard" />
  if (error) return <div className="state" role="alert"><h3>Something went wrong.</h3><p className="muted">{error.message}</p><Button variant="secondary" onClick={reload}>Try again</Button></div>
  const stats = [['Total Revenue', formatPrice(d.revenue)], ['Total Orders', d.orders], ['Total Users', d.users], ['Total Products', d.products]]
  return (
    <>
      <h1>Overview</h1>
      <div className="stats">{stats.map(([k, v]) => <div key={k} className="stat"><span className="muted">{k}</span><strong>{v}</strong></div>)}</div>
      <div className="admin-grid">
        <section className="panel"><h2>Revenue by month</h2><BarChart label="Revenue by month" data={d.monthly.map((m) => ({ label: m.label, value: Number(m.revenue) }))} format={formatPrice} /></section>
        <section className="panel"><h2>Orders by month</h2><BarChart label="Orders by month" data={d.monthly.map((m) => ({ label: m.label, value: m.orders }))} /></section>
      </div>
      <div className="admin-grid">
        <section className="panel"><h2>Recent orders</h2>
          {d.recent_orders.length === 0 ? <p className="muted">No orders yet.</p> : (
            <div className="table-wrap"><table className="table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>{d.recent_orders.map((o) => <tr key={o.id}><td><Link to={`/orders/${o.id}`}>#{o.order_number}</Link></td><td>{o.customer}</td><td>{formatPrice(o.total)}</td><td><StatusBadge status={o.status} /></td></tr>)}</tbody></table></div>)}
        </section>
        <section className="panel"><h2>Recent users</h2>
          <ul className="user-list">{d.recent_users.map((u) => <li key={u.id}><strong>{u.name}</strong><span className="muted">{u.email} · {formatDate(u.created_at)}</span></li>)}</ul>
        </section>
      </div>
    </>
  )
}
