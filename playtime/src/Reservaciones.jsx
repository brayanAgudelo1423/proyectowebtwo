import React, { useEffect, useState } from 'react'
import './Admin2.css'
import HomeButton from './components/HomeButton'
import Toast from './components/Toast'

export default function Reservaciones({ onBack }) {
  const [reservaciones, setReservaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState({})
  const [sessionUser, setSessionUser] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [usuarios, setUsuarios] = useState({})

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // fetch current session user
        try {
          const meRes = await fetch('/api/auth/me', { credentials: 'include' })
          if (meRes.ok) {
            const meBody = await meRes.json().catch(() => ({}))
            if (mounted && meBody && meBody.user) setSessionUser(meBody.user)
          }
        } catch {
          // ignore
        }
        const res = await fetch('/api/reservaciones', { credentials: 'include' })
        if (!res.ok) throw new Error('Error fetching reservaciones: ' + res.status)
        const body = await res.json()
        if (mounted) setReservaciones(Array.isArray(body) ? body.sort((a, b) => b.id - a.id) : body)
        
        // Load usuarios for mapping usuarioId to names
        try {
          const usuariosRes = await fetch('/api/usuarios', { credentials: 'include' })
          if (usuariosRes.ok) {
            const usuariosData = await usuariosRes.json()
            if (Array.isArray(usuariosData)) {
              const usuariosMap = {}
              usuariosData.forEach(u => {
                usuariosMap[u.id] = u.name || u.email
              })
              if (mounted) setUsuarios(usuariosMap)
            }
          }
        } catch {
          // ignore usuarios loading error
        }
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    
    // Recarga automática cada 5 segundos
    const interval = setInterval(load, 5000)
    
    return () => { 
      mounted = false
      clearInterval(interval)
    }
  }, [])

  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'info' }), 3000)
  }

  async function fetchReservaciones() {
    try {
      const res = await fetch('/api/reservaciones', { credentials: 'include' })
      if (!res.ok) throw new Error('Error fetching reservaciones')
      const body = await res.json()
      setReservaciones(Array.isArray(body) ? body.sort((a, b) => b.id - a.id) : body)
    } catch {
      showToast('Error al recargar reservaciones', 'error')
    }
  }

  async function acceptReservation(id) {
    setProcessing(p => ({ ...p, [id]: true }))
    try {
      const res = await fetch(`/api/reservaciones/${id}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmada' })
      })
      if (res.status === 401) { showToast('No autenticado. Inicia sesión.', 'error'); return }
      if (res.status === 403) { showToast('Acceso denegado: necesitas rol admin.', 'error'); return }
      if (!res.ok) throw new Error('Error updating status')
      await res.json()
      await fetchReservaciones()
      showToast('Reserva confirmada', 'success')
    } catch (_err) {
      showToast('Error confirmando reserva: ' + (_err.message || _err), 'error')
    } finally {
      setProcessing(p => { const np = { ...p }; delete np[id]; return np })
    }
  }

  async function rejectReservation(id) {
    setProcessing(p => ({ ...p, [id]: true }))
    try {
      const res = await fetch(`/api/reservaciones/${id}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rechazada' })
      })
      if (res.status === 401) { showToast('No autenticado. Inicia sesión.', 'error'); return }
      if (res.status === 403) { showToast('Acceso denegado: necesitas rol admin.', 'error'); return }
      if (!res.ok) throw new Error('Error updating status')
      await res.json()
      await fetchReservaciones()
      showToast('Reserva rechazada', 'success')
    } catch (err) {
      showToast('Error rechazando reserva: ' + (err.message || err), 'error')
    } finally {
      setProcessing(p => { const np = { ...p }; delete np[id]; return np })
    }
  }

  return (
    <div className="admin2-page">
      <div className="admin2-top-left">
        <button className="logo-btn" type="button" aria-label="Ir al inicio" onClick={() => { if (typeof onBack === 'function') onBack() }}>
          <img src="/logo play 1.png" alt="PlayTime" />
        </button>
      </div>

      <main className="admin2-main">
        <h1>Administrar Reservaciones</h1>
        {sessionUser && (
          <p style={{ marginTop: 6, marginBottom: 8, color: '#333' }}>Sesión: {sessionUser.name} ({sessionUser.role})</p>
        )}

        {loading && <p>Cargando reservaciones...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <div className="admin2-reservations">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservaciones.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{usuarios[r.usuarioId] || r.client}</td>
                    <td>{r.date}</td>
                    <td>{r.hours}</td>
                    <td>{Number(r.price || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                    <td>
                      <span style={{
                        color: r.status === 'Confirmada' ? '#0fa867' : r.status === 'Rechazada' ? '#e14b3b' : '#888',
                        fontWeight: 700
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      {r.status === 'Pendiente' && (
                        <>
                          <button
                            className="btn"
                            disabled={!!processing[r.id]}
                            onClick={() => acceptReservation(r.id)}
                            style={{ backgroundColor: '#0fa867', color: 'white' }}
                          >
                            Aceptar
                          </button>
                          <button
                            className="btn"
                            disabled={!!processing[r.id]}
                            onClick={() => rejectReservation(r.id)}
                            style={{ backgroundColor: '#e14b3b', color: 'white' }}
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {r.status !== 'Pendiente' && (
                        <span style={{ color: '#888', fontSize: 14 }}>
                          {r.status === 'Confirmada' ? '✓ Confirmada' : '✗ Rechazada'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="admin2-footer">
        <HomeButton onClick={() => { if (typeof onBack === 'function') onBack() }} />
      </footer>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
