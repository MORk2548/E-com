import { Link } from 'react-router-dom'
export default function Button({ variant = 'primary', size = 'md', to, className = '', children, ...rest }) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim()
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}
