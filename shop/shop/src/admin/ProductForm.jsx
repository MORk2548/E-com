import { useState } from 'react'
import Modal from '../components/Modal.jsx'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'
import { createProduct, updateProduct } from '../services/adminService.js'

const num = (v) => (v === '' || v == null ? null : Number(v))

export default function ProductForm({ product, categories, onClose, onSaved }) {
  const [f, setF] = useState({
    name: product?.name || '', description: product?.description || '', categoryId: product?.categoryId || categories[0]?.id || '',
    price: product?.price ?? '', discountPrice: product?.discountPrice ?? '', stock: product?.stock ?? 0,
    imageUrl: product?.imageUrl || '', status: product?.status || 'active',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (e) => setF((v) => ({ ...v, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const v = {}
    if (!f.name.trim()) v.name = 'Enter a name.'
    if (!f.categoryId) v.categoryId = 'Choose a category.'
    if (f.price === '' || Number(f.price) < 0) v.price = 'Enter a price of 0 or more.'
    if (f.discountPrice !== '' && (Number(f.discountPrice) < 0 || Number(f.discountPrice) >= Number(f.price))) v.discountPrice = 'Must be lower than the price.'
    if (!Number.isInteger(Number(f.stock)) || Number(f.stock) < 0) v.stock = 'Enter a whole number of 0 or more.'
    setErrors(v); setFormError('')
    if (Object.keys(v).length) return
    const payload = {
      name: f.name.trim(), description: f.description.trim() || null, category_id: Number(f.categoryId), price: Number(f.price),
      discount_price: num(f.discountPrice), stock: Number(f.stock), image_url: f.imageUrl.trim() || null, status: f.status,
    }
    setBusy(true)
    try { await (product ? updateProduct(product.id, payload) : createProduct(payload)); onSaved(product ? 'Product updated' : 'Product created') }
    catch (err) { setFormError(err.message); setBusy(false) }
  }
  return (
    <Modal title={product ? 'Edit product' : 'New product'} onClose={busy ? () => {} : onClose} wide>
      <form onSubmit={submit} noValidate className="profile__form">
        {formError && <p className="alert" role="alert">{formError}</p>}
        <FormField id="name" label="Name" value={f.name} onChange={set} error={errors.name} />
        <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" rows="3" value={f.description} onChange={set} /></div>
        <div className="form-grid">
          <div className="field"><label htmlFor="categoryId">Category</label>
            <select id="categoryId" name="categoryId" value={f.categoryId} onChange={set}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="field"><label htmlFor="status">Status</label>
            <select id="status" name="status" value={f.status} onChange={set}><option value="active">Active</option><option value="draft">Draft (hidden)</option></select></div>
          <FormField id="price" label="Price ($)" type="number" min="0" step="0.01" value={f.price} onChange={set} error={errors.price} />
          <FormField id="discountPrice" label="Discount price ($)" type="number" min="0" step="0.01" value={f.discountPrice} onChange={set} error={errors.discountPrice} />
          <FormField id="stock" label="Stock" type="number" min="0" step="1" value={f.stock} onChange={set} error={errors.stock} />
          <FormField id="imageUrl" label="Image URL or path" placeholder="/images/products/17.jpg" value={f.imageUrl} onChange={set} />
        </div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  )
}
