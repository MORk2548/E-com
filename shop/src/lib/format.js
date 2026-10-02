export const formatPrice = (n) => `$${Number(n).toFixed(n % 1 ? 2 : 0)}`
export const salePrice = (p) => p.discountPrice ?? p.price
export const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
