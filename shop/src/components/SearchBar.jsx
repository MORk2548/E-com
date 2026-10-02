import { useEffect, useState } from 'react'
import { SearchIcon } from './Icons.jsx'
export default function SearchBar({ value, onChange, delay = 350 }) {
  const [text, setText] = useState(value)
  useEffect(() => setText(value), [value])
  useEffect(() => {
    if (text === value) return
    const t = setTimeout(() => onChange(text), delay)
    return () => clearTimeout(t)
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="search">
      <SearchIcon />
      <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search by name or category" aria-label="Search products" />
    </div>
  )
}
