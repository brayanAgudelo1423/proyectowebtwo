import React, { useState, useEffect } from 'react'
import './Reservations.css'
import HomeButton from './components/HomeButton'
import Toast from './components/Toast'

export default function Reservations({ onBack, onHome, reservations = [], currentClient = 'Pedro Ospina' }) {
  const [myReservations, setMyReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [currentUser, setCurrentUser] = useState(null)
  const [canchas, setCanchas] = useState({})

  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'info' }), 3000)
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      
      try {
        // Get current user session - prefer server session
        let user = null
        try {
          const meRes = await fetch('/api/auth/me', { credentials: 'include' })
          if (meRes.ok) {
            const meBody = await meRes.json().catch(() => ({}))
            if (meBody && meBody.user) {
              user = meBody.user
              console.log('User from server:', user)
            }
          }
        } catch (err) {
          console.log('Server session error:', err)
        }
        
        // Fallback to localStorage
        if (!user) {
          try { 
            const stored = JSON.parse(localStorage.getItem('user'))
            if (stored) {
              user = stored
              console.log('User from localStorage:', user)
            }
          } catch (err) {
            console.log('localStorage error:', err)
          }
        }
        
        if (mounted) setCurrentUser(user)
        
        // Fetch all reservations and filter by current user
        const res = await fetch('/api/reservaciones', { credentials: 'include' })
        if (!res.ok) throw new Error('Error fetching reservations')
        
        const data = await res.json()
        if (Array.isArray(data)) {
          // Filter by usuarioId if user is logged in
          const filtered = user && user.id 
            ? data.filter(r => r.usuarioId === user.id)
            : data.filter(r => r.client === currentClient)
          // Sort by ID descending (most recent first)
          const sorted = filtered.sort((a, b) => b.id - a.id)
          if (mounted) setMyReservations(sorted)
        }
        
        // Fetch canchas to get names
        try {
          const canchasRes = await fetch('/api/canchas', { credentials: 'include' })
          if (canchasRes.ok) {
            const canchasData = await canchasRes.json()
            if (Array.isArray(canchasData)) {
              const canchasMap = {}
              canchasData.forEach(c => {
                canchasMap[c.id] = c.name
              })
              if (mounted) setCanchas(canchasMap)
            }
          }
        } catch {
          // ignore cancha loading error
        }
      } catch (err) {
        if (mounted) {
          setError(err.message)
          showToast('Error al cargar reservaciones', 'error')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    
    load()
    return () => { mounted = false }
  }, [currentClient])

  async function deleteReservation(id) {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reservación?')) return
    
    try {
      const res = await fetch(`/api/reservaciones/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (res.status === 401) { showToast('No autenticado. Inicia sesión.', 'error'); return }
      if (res.status === 403) { showToast('No tienes permiso para eliminar esta reservación.', 'error'); return }
      if (!res.ok) throw new Error('Error deleting reservation')
      
      // Eliminar de la lista local
      setMyReservations(prev => prev.filter(r => r.id !== id))
      showToast('Reservación eliminada exitosamente', 'success')
    } catch (err) {
      showToast('Error al eliminar reservación: ' + (err.message || err), 'error')
    }
  }

  return (
    <div className="reservations-page">
      <div className="reservations-top-left">
        <img src="/logo play 1.png" alt="PlayTime" />
      </div>

      <main className="reservations-main">
        <h1>Mis Reservas</h1>

        {loading && <p>Cargando reservaciones...</p>}
        {error && <p style={{color:'red'}}>{error}</p>}

        {!loading && !error && (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cancha</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {myReservations.length ? myReservations.map((r) => (
              <tr key={r.id}>
                <td style={{textAlign:'left'}}>{currentUser ? (currentUser.name || currentUser.email || 'Usuario') : r.client}</td>
                <td>{canchas[r.canchaId] || 'Cancha ' + r.canchaId}</td>
                <td>{r.date}</td>
                <td>{r.hours}</td>
                <td>{Number(r.price || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                <td className={r.status === 'Confirmada' ? 'status-confirmed' : r.status === 'Rechazada' ? 'status-rejected' : 'status-pending'}>{r.status}</td>
                <td style={{textAlign:'center'}}>
                  <button 
                    onClick={() => deleteReservation(r.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#e14b3b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} style={{textAlign:'center', color:'#555'}}>No tienes reservas</td></tr>
            )}
          </tbody>
        </table>
        )}

        <p className="reservations-note">"Consultar Otras <span className="link" style={{color:'#0fa867', cursor:'pointer'}} onClick={() => { if (typeof onBack === 'function') onBack() }}>Fechas</span> para Reservar la cancha que quieres"</p>
      </main>

      <footer className="reservations-footer">
        <HomeButton onClick={() => { if (typeof onBack === 'function') onBack(); else if (typeof onHome === 'function') onHome(); }} />
      </footer>
      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
