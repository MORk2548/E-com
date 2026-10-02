// Dependency-free SVG line chart. data: [{ label, value }]
export default function LineChart({ data, format = (v) => v, label }) {
  const W = 400, H = 200, pad = 28
  const max = Math.max(...data.map((d) => d.value), 1)
  const step = (W - pad * 2) / Math.max(data.length - 1, 1)
  const pts = data.map((d, i) => [pad + i * step, H - pad - (d.value / max) * (H - pad * 2 - 14)])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={label}>
      <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} className="chart__axis" />
      <path d={line} className="chart__line" />
      {pts.map(([x, y], i) => (
        <g key={data[i].label + i}>
          <circle cx={x} cy={y} r="3.5" className="chart__dot"><title>{data[i].label}: {format(data[i].value)}</title></circle>
          <text x={x} y={H - 10} textAnchor="middle" className="chart__label">{data[i].label}</text>
        </g>
      ))}
    </svg>
  )
}
