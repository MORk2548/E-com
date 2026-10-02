// Dependency-free SVG bar chart. data: [{ label, value }]
export default function BarChart({ data, format = (v) => v, label }) {
  const W = 400, H = 200, pad = 28
  const max = Math.max(...data.map((d) => d.value), 1)
  const bw = (W - pad * 2) / data.length
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={label}>
      <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} className="chart__axis" />
      {data.map((d, i) => {
        const h = (d.value / max) * (H - pad * 2 - 14)
        const x = pad + i * bw + bw * 0.15
        return (
          <g key={d.label}>
            <rect x={x} y={H - pad - h} width={bw * 0.7} height={h} rx="4" className="chart__bar"><title>{d.label}: {format(d.value)}</title></rect>
            <text x={x + bw * 0.35} y={H - 10} textAnchor="middle" className="chart__label">{d.label}</text>
            {d.value > 0 && <text x={x + bw * 0.35} y={H - pad - h - 5} textAnchor="middle" className="chart__value">{format(d.value)}</text>}
          </g>
        )
      })}
    </svg>
  )
}
