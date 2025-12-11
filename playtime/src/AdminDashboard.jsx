import React from 'react'
import './Admin2.css'
import HomeButton from './components/HomeButton'

export default function AdminDashboard({ onBack, onOpenUsers, onOpenCancha, onOpenReservaciones }) {
  return (
    <div className="admin2-page">
      <div className="admin2-top-left">
        <button className="logo-btn" type="button" aria-label="Ir al inicio" onClick={() => { if (typeof onBack === 'function') onBack() }}>
          <img src="/logo play 1.png" alt="PlayTime" />
        </button>
      </div>

      <main className="admin2-main">
        <h1>Panel de Administración</h1>

        <div className="admin2-cards">
          <button className="admin-card" onClick={() => { if (typeof onOpenCancha === 'function') onOpenCancha() }}>
            <div>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🏟️</div>
              <div style={{ color: '#000' }}>Administrar Canchas</div>
            </div>
          </button>

          <button className="admin-card" onClick={() => { if (typeof onOpenUsers === 'function') onOpenUsers() }}>
            <div>
              <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
              <div style={{ color: '#000' }}>Administrar Usuarios</div>
            </div>
          </button>

          <button className="admin-card" onClick={() => { if (typeof onOpenReservaciones === 'function') onOpenReservaciones() }}>
            <div>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
              <div style={{ color: '#000' }}>Administrar Reservaciones</div>
            </div>
          </button>
        </div>
      </main>

      <footer className="admin2-footer">
        <HomeButton onClick={() => { if (typeof onBack === 'function') onBack() }} />
      </footer>
    </div>
  )
}
