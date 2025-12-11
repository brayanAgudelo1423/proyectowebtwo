import React, { useMemo } from 'react'
import './App.css'
import './Dashboard.css'
import './Admin2.css'
import HomeButton from './components/HomeButton.jsx'
// Admin2 will receive reservations and handlers via props

export default function Admin2({ onBack, onOpenTabla, reservations = [] }) {
  const totalsByClient = useMemo(() => {
    const map = {}
    reservations.forEach(r => {
      map[r.client] = (map[r.client] || 0) + (r.status === 'Rechazada' ? 0 : r.price)
    })
    return Object.entries(map).map(([client, total]) => ({ client, total }))
  }, [reservations])

  // basic SVG bar chart dimensions
  const chartWidth = 560
  const chartHeight = 200
  const maxTotal = Math.max(1, ...totalsByClient.map(t => t.total))

  return (
    <div className="admin2-page">
      <div className="admin2-top-left">
        <button className="logo-btn" type="button" aria-label="Ir al inicio" onClick={() => { if (typeof onBack === 'function') onBack() }}>
          <img src="/logo play 1.png" alt="PlayTime" />
        </button>
      </div>

      <main className="admin2-main">
        <h1>Panel Administrador — Vista 2</h1>

        <div className="admin2-chart-wrap">
          <section className="admin2-chart">
            <h2>Ingresos por Cliente</h2>
            <div className="chart-wrap">
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Gráfica de ingresos">
                <rect x="0" y="0" width={chartWidth} height={chartHeight} fill="#fff" />
                {totalsByClient.map((t, i) => {
                  const barWidth = Math.floor(chartWidth / totalsByClient.length) - 20
                  const x = i * (barWidth + 20) + 30
                  const h = Math.round((t.total / maxTotal) * (chartHeight - 40))
                  const y = chartHeight - h - 20
                  return (
                    <g key={t.client}>
                      <rect x={x} y={y} width={barWidth} height={h} fill="#0fa867" rx="6" />
                      <text x={x + barWidth / 2} y={chartHeight - 4} fontSize="12" textAnchor="middle" fill="#111">{t.client}</text>
                      <text x={x + barWidth / 2} y={y - 6} fontSize="12" textAnchor="middle" fill="#0b8c55">{t.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </section>

          <div className="table-button-wrap">
            <button className="btn primary" onClick={() => onOpenTabla && onOpenTabla()}>Ver tabla completa</button>
            <p className="table-hint">Abrir la tabla de reservas en vista completa.</p>
          </div>
        </div>
      </main>

      <footer className="admin2-footer">
        <HomeButton onClick={() => { if (typeof onBack === 'function') onBack() }} />
      </footer>
    </div>
  )
}
