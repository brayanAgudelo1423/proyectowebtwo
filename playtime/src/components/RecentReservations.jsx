import React from 'react'
import './RecentReservations.css'

export default function RecentReservations({ reservations = [], onAccept = () => {}, onModify = () => {}, onReject = () => {} }) {
  return (
    <div className="recent-reservations">
      <h2>Reservas Recientes</h2>
      <div className="recent-table-wrap">
        <table className="recent-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id} className={r.status === 'Rechazada' ? 'row-rejected' : ''}>
                <td>{r.client}</td>
                <td>{r.date}</td>
                <td>{r.hours}</td>
                <td>{r.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                <td className={r.status === 'Confirmada' ? 'status-confirmed' : r.status === 'Rechazada' ? 'status-rejected' : 'status-pending'}>{r.status}</td>
                <td className="actions-cell">
                  <button className="btn primary" onClick={() => onAccept(r.id)}>Aceptar</button>
                  <button className="btn ghost" onClick={() => onModify(r.id)}>Modificar</button>
                  <button className="btn danger" onClick={() => onReject(r.id)}>Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
