import { useState } from 'react'
import OrderCard from '../components/OrderCard.jsx'
import Pagination from '../components/Pagination.jsx'
import Button from '../components/Button.jsx'
import Loading from '../components/Loading.jsx'
import useAsync from '../hooks/useAsync.js'
import { getMyOrders } from '../services/orderService.js'

export default function Orders() {
  const [page, setPage] = useState(1)
  const { data, loading, error, reload } = useAsync(() => getMyOrders({ page }), [page])
  return (
    <div className="container section">
      <h1>My Orders</h1>
      {loading && <Loading label="Loading orders" />}
      {error && <div className="state" role="alert"><h3>Something went wrong.</h3><p className="muted">{error.message}</p><Button variant="secondary" onClick={reload}>Try again</Button></div>}
      {data && data.items.length === 0 && <div className="state"><h3>No orders yet.</h3><p className="muted">When you place an order, it will show up here.</p><Button to="/products">Browse games</Button></div>}
      {data && data.items.length > 0 && (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th><span className="sr-only">Action</span></th></tr></thead>
              <tbody>{data.items.map((o) => <OrderCard key={o.id} order={o} />)}</tbody>
            </table>
          </div>
          <Pagination page={data.page} pageCount={data.pageCount} onChange={setPage} />
        </>
      )}
    </div>
  )
}
