import { useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import Pagination from '../components/Pagination.jsx'
import Modal from '../components/Modal.jsx'
import Loading from '../components/Loading.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import useAsync from '../hooks/useAsync.js'
import { getAdminUsers, getUserSummary, setUserAccess } from '../services/adminService.js'
import { formatDate, formatPrice } from '../lib/format.js'

function UserModal({ user, onClose, onSaved }) {
  const { user: me } = useAuth()
  const toast = useToast()
  const summary = useAsync(() => getUserSummary(user.id), [user.id])
  const [role, setRole] = useState(user.role)
  const [status, setStatus] = useState(user.status)
  const [busy, setBusy] = useState(false)
  const isSelf = me.id === user.id
  const save = async () => {
    setBusy(true)
    try { await setUserAccess(user.id, { role, status }); toast('User updated'); onSaved() } catch (err) { toast(err.message, 'error'); setBusy(false) }
  }
  const rows = [['Username', user.username], ['Email', user.email], ['Phone', user.phone], ['Address', user.address], ['Joined', formatDate(user.created_at)],
    ['Orders', summary.data ? summary.data.orders : '…'], ['Total spent', summary.data ? formatPrice(summary.data.spent) : '…']]
  return (
    <Modal title={user.name || user.email} onClose={busy ? () => {} : onClose} wide>
      <dl className="profile__list">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || <span className="muted">Not set</span>}</dd></div>)}</dl>
      <div className="form-grid">
        <div className="field"><label htmlFor="role">Role</label><select id="role" value={role} disabled={isSelf} onChange={(e) => setRole(e.target.value)}><option value="customer">Customer</option><option value="admin">Admin</option></select></div>
        <div className="field"><label htmlFor="ustatus">Status</label><select id="ustatus" value={status} disabled={isSelf} onChange={(e) => setStatus(e.target.value)}><option value="active">Active</option><option value="disabled">Disabled</option></select></div>
      </div>
      {isSelf && <p className="muted">You can't change your own role or status.</p>}
      {status === 'disabled' && !isSelf && <p className="muted">Disabled users are signed out and can't place orders.</p>}
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
        <Button variant="secondary" onClick={onClose} disabled={busy}>Close</Button>
        {!isSelf && <Button onClick={save} disabled={busy || (role === user.role && status === user.status)}>{busy ? 'Saving…' : 'Save changes'}</Button>}
      </div>
    </Modal>
  )
}

export default function AdminUsers() {
  const [f, setF] = useState({ search: '', role: '', status: '', page: 1 })
  const [viewing, setViewing] = useState(null)
  const { data, loading, error, reload } = useAsync(() => getAdminUsers(f), [JSON.stringify(f)])
  const patch = (p) => setF((x) => ({ ...x, page: 1, ...p }))
  return (
    <>
      <h1>Users</h1>
      <div className="toolbar">
        <SearchBar value={f.search} onChange={(search) => patch({ search })} />
        <select value={f.role} onChange={(e) => patch({ role: e.target.value })} aria-label="Filter by role"><option value="">All roles</option><option value="customer">Customer</option><option value="admin">Admin</option></select>
        <select value={f.status} onChange={(e) => patch({ status: e.target.value })} aria-label="Filter by status"><option value="">All statuses</option><option value="active">Active</option><option value="disabled">Disabled</option></select>
      </div>
      {loading && <Loading label="Loading users" />}
      {error && <div className="state" role="alert"><h3>Something went wrong.</h3><p className="muted">{error.message}</p><Button variant="secondary" onClick={reload}>Try again</Button></div>}
      {data && data.items.length === 0 && <div className="state"><h3>No users found.</h3></div>}
      {data && data.items.length > 0 && (
        <>
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created At</th><th><span className="sr-only">View</span></th></tr></thead>
            <tbody>{data.items.map((u) => (
              <tr key={u.id}><td><strong>{u.name}</strong><br /><span className="muted">@{u.username}</span></td><td>{u.email}</td>
                <td><span className={`status ${u.role === 'admin' ? 'status--processing' : ''}`}>{u.role === 'admin' ? 'Admin' : 'Customer'}</span></td>
                <td><span className={`status status--${u.status === 'active' ? 'delivered' : 'cancelled'}`}>{u.status === 'active' ? 'Active' : 'Disabled'}</span></td>
                <td>{formatDate(u.created_at)}</td><td><button className="link-btn" onClick={() => setViewing(u)}>View</button></td></tr>))}</tbody>
          </table></div>
          <Pagination page={data.page} pageCount={data.pageCount} onChange={(page) => setF((x) => ({ ...x, page }))} />
        </>
      )}
      {viewing && <UserModal user={viewing} onClose={() => setViewing(null)} onSaved={() => { setViewing(null); reload() }} />}
    </>
  )
}
