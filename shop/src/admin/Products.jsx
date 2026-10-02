import { useState } from 'react'
import ProductForm from './ProductForm.jsx'
import ProductImage from '../components/ProductImage.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Pagination from '../components/Pagination.jsx'
import { ConfirmModal } from '../components/Modal.jsx'
import Loading from '../components/Loading.jsx'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import useAsync from '../hooks/useAsync.js'
import { getAdminProducts, getCategories, deleteProduct } from '../services/adminService.js'
import { formatPrice } from '../lib/format.js'

export default function AdminProducts() {
  const toast = useToast()
  const [f, setF] = useState({ search: '', category: '', status: '', sort: 'newest', page: 1 })
  const [editing, setEditing] = useState(null) // null | 'new' | product
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const cats = useAsync(getCategories, [])
  const { data, loading, error, reload } = useAsync(() => getAdminProducts(f), [JSON.stringify(f)])
  const patch = (p) => setF((x) => ({ ...x, page: 1, ...p }))

  const doDelete = async () => {
    setBusy(true)
    try { await deleteProduct(deleting.id); toast('Product deleted'); reload() } catch (err) { toast(err.message, 'error') } finally { setBusy(false); setDeleting(null) }
  }
  const saved = (msg) => { setEditing(null); toast(msg); reload() }

  return (
    <>
      <div className="row cart-head"><h1>Products</h1><Button onClick={() => setEditing('new')} disabled={!cats.data}>New product</Button></div>
      <div className="toolbar">
        <SearchBar value={f.search} onChange={(search) => patch({ search })} />
        <select value={f.category} onChange={(e) => patch({ category: e.target.value })} aria-label="Filter by category"><option value="">All categories</option>{cats.data?.map((c) => <option key={c.id}>{c.name}</option>)}</select>
        <select value={f.status} onChange={(e) => patch({ status: e.target.value })} aria-label="Filter by status"><option value="">All statuses</option><option value="active">Active</option><option value="draft">Draft</option></select>
        <select value={f.sort} onChange={(e) => patch({ sort: e.target.value })} aria-label="Sort products">
          <option value="newest">Newest</option><option value="name">Name</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="stock-asc">Stock: Low to High</option>
        </select>
      </div>
      {loading && <Loading label="Loading products" />}
      {error && <div className="state" role="alert"><h3>Something went wrong.</h3><p className="muted">{error.message}</p><Button variant="secondary" onClick={reload}>Try again</Button></div>}
      {data && data.items.length === 0 && <div className="state"><h3>No products found.</h3></div>}
      {data && data.items.length > 0 && (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{data.items.map((p) => (
              <tr key={p.id}>
                <td><ProductImage product={p} className="pimg--sm" /></td>
                <td><strong>{p.name}</strong></td><td>{p.category}</td>
                <td>{formatPrice(p.discountPrice ?? p.price)}{p.discountPrice != null && <s className="muted"> {formatPrice(p.price)}</s>}</td>
                <td className={p.stock === 0 ? 'text-danger' : ''}>{p.stock}</td>
                <td><span className={`status status--${p.status === 'active' ? 'delivered' : 'pending'}`}>{p.status === 'active' ? 'Active' : 'Draft'}</span></td>
                <td className="actions"><button className="link-btn" onClick={() => setEditing(p)}>Edit</button> <button className="link-btn" onClick={() => setDeleting(p)}>Delete</button></td>
              </tr>))}</tbody>
          </table></div>
          <Pagination page={data.page} pageCount={data.pageCount} onChange={(page) => setF((x) => ({ ...x, page }))} />
        </>
      )}
      {editing && <ProductForm product={editing === 'new' ? null : editing} categories={cats.data} onClose={() => setEditing(null)} onSaved={saved} />}
      {deleting && <ConfirmModal title="Delete this product?" message={`"${deleting.name}" will be permanently removed. Products that already have orders can't be deleted; set them to Draft instead.`} confirmLabel="Delete" cancelLabel="Cancel" busy={busy} onConfirm={doDelete} onClose={() => setDeleting(null)} />}
    </>
  )
}
