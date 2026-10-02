export default function FormField({ id, label, error, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...props} />
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  )
}
