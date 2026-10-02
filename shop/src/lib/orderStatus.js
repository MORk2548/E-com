export const STATUS_LABELS = { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }
export const PAYMENT_LABELS = { card: 'Credit Card', cod: 'Cash on Delivery', bank_transfer: 'Bank Transfer' }
// Customer-facing progress steps (a "pending" order is shown as confirmed).
export const TIMELINE = [['pending', 'Confirmed'], ['processing', 'Processing'], ['shipped', 'Shipped'], ['delivered', 'Delivered']]
