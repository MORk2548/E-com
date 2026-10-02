import LineChart from '../components/LineChart.jsx'
import BarChart from '../components/BarChart.jsx'
import Loading from '../components/Loading.jsx'
import Button from '../components/Button.jsx'
import useAsync from '../hooks/useAsync.js'
import { getAnalytics } from '../services/adminService.js'
import { formatPrice } from '../lib/format.js'

export default function Analytics() {
  const { data: d, loading, error, reload } = useAsync(getAnalytics, [])
  if (loading) return <Loading label="Loading analytics" />
  if (error) return <div className="state" role="alert"><h3>Something went wrong.</h3><p className="muted">{error.message}</p><Button variant="secondary" onClick={reload}>Try again</Button></div>
  const totalRevenue = d.categories.reduce((n, c) => n + Number(c.revenue), 0)
  return (
    <>
      <h1>Analytics</h1>
      <div className="admin-grid">
        <section className="panel"><h2>Revenue by month</h2><LineChart label="Revenue by month" data={d.monthly.map((m) => ({ label: m.label, value: Number(m.revenue) }))} format={formatPrice} /></section>
        <section className="panel"><h2>Orders by month</h2><BarChart label="Orders by month" data={d.monthly.map((m) => ({ label: m.label, value: m.orders }))} /></section>
      </div>
      <div className="admin-grid">
        <section className="panel"><h2>Product categories</h2>
          {totalRevenue === 0 ? <p className="muted">No sales yet.</p> : (
            <ul className="share">{d.categories.map((c) => {
              const pct = Math.round((Number(c.revenue) / totalRevenue) * 100)
              return <li key={c.name}><div className="share__head"><span>{c.name}</span><span className="muted">{pct}% · {formatPrice(c.revenue)} · {c.units} sold</span></div>
                <div className="share__track" role="img" aria-label={`${c.name}: ${pct}% of revenue`}><div className="share__fill" style={{ width: `${pct}%` }} /></div></li>
            })}</ul>)}
        </section>
        <section className="panel"><h2>Top products</h2>
          {d.top_products.length === 0 ? <p className="muted">No sales yet.</p> : (
            <div className="table-wrap"><table className="table"><thead><tr><th>Product</th><th>Units Sold</th><th>Revenue</th></tr></thead>
              <tbody>{d.top_products.map((p) => <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.units}</td><td>{formatPrice(p.revenue)}</td></tr>)}</tbody></table></div>)}
        </section>
      </div>
    </>
  )
}
