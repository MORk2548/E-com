import { useEffect, useRef } from 'react'
import Button from './Button.jsx'
export default function Modal({ title, onClose, wide, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !ref.current) return
      const f = [...ref.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea, a[href]')]
      if (!f.length) return
      const [first, last] = [f[0], f[f.length - 1]]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={'modal' + (wide ? ' modal--wide' : '')} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} ref={ref}>
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  )
}
export function ConfirmModal({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Keep', busy, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={busy ? () => {} : onClose}>
      <p className="muted">{message}</p>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose} disabled={busy}>{cancelLabel}</Button>
        <Button variant="danger" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</Button>
      </div>
    </Modal>
  )
}
