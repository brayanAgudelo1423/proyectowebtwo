import React, { useState, useEffect } from 'react'
import './App.css'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'
import Reserve from './Reserve'
import Reservations from './Reservations'
import Profile from './Profile'
import Admin2 from './Admin2'
import AdminDashboard from './AdminDashboard'
import Users from './Users'
import Canchas from './Canchas'
import Reservaciones from './Reservaciones'
import Toast from './components/Toast'

function Landing({ onLogin, onRegister }) {
  return (
    <div className="hero" role="main">
      {}
  <img src="/333 1.png" alt="Fondo PlayTime" className="bg-img" />
      <div className="hero-overlay" />

      <div className="hero-inner">
        <div className="logo-wrap">
          <img src="/logo play 1.png" alt="PlayTime" className="logo-img" />
        </div>

        <h1 className="hero-title">PlayTime</h1>
        <p className="hero-sub">Reserva fácil y rápida.<br />¡Juega sin límites con PlayTime!</p>

        <div className="hero-actions">
          <button className="btn primary" onClick={onLogin}>Iniciar Sesión</button>
          <button className="btn primary" onClick={onRegister}>Registrarse</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('landing')
  const [busyIds, setBusyIds] = useState([])
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentClient, setCurrentClient] = useState('Pedro Ospina')
  const initialReservations = [
    { id: 1, client: 'Pedro Ospina', date: '2025-11-04', hours: '21:00', price: 80000, status: 'Pendiente' },
    { id: 2, client: 'Ana Martinez', date: '2025-11-05', hours: '18:00', price: 50000, status: 'Confirmada' },
    { id: 3, client: 'Carlos Ruiz', date: '2025-11-06', hours: '20:00', price: 60000, status: 'Pendiente' },
    { id: 4, client: 'Pedro Ospina', date: '2025-11-10', hours: '10:00', price: 40000, status: 'Rechazada' }
  ]
  const [reservations, setReservations] = useState(initialReservations)

  // Load reservations from backend if available
  async function fetchReservations() {
    try {
      const res = await fetch('/api/reservaciones', { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data)) {
        // ensure price is number
        const normalized = data.map(d => ({ ...d, price: d.price != null ? Number(d.price) : 0 }))
        setReservations(normalized.reverse())
      }
    } catch (err) {
      console.error('Could not load reservations', err)
    }
  }

  useEffect(() => { fetchReservations() }, [])

  function markBusy(id) { setBusyIds(prev => prev.includes(id) ? prev : [...prev, id]) }
  function unmarkBusy(id) { setBusyIds(prev => prev.filter(x => x !== id)) }
  function showToast(message, type = 'info', ms = 3000) { setToast({ message, type }); setTimeout(() => setToast({ message: '', type: 'info' }), ms) }

  function acceptReservation(id) {
    markBusy(id);
    (async () => {
      try {
        const res = await fetch(`/api/reservaciones/${id}/status`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Confirmada' }) })
        if (!res.ok) throw new Error('Error updating status')
        await res.json()
        await fetchReservations()
        showToast('Reserva confirmada', 'success')
      } catch (err) {
        console.error(err)
        showToast('No se pudo confirmar la reserva', 'error')
      } finally {
        unmarkBusy(id)
      }
    })()
  }

  function rejectReservation(id) {
    markBusy(id);
    (async () => {
      try {
        const res = await fetch(`/api/reservaciones/${id}/status`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Rechazada' }) })
        if (!res.ok) throw new Error('Error updating status')
        await res.json()
        await fetchReservations()
        showToast('Reserva rechazada', 'success')
      } catch (err) {
        console.error(err)
        showToast('No se pudo rechazar la reserva', 'error')
      } finally {
        unmarkBusy(id)
      }
    })()
  }

  function modifyHours(id, newHours) {
    setReservations(rs => rs.map(r => r.id === id ? { ...r, hours: newHours, status: 'Modificada' } : r))
  }

  function deleteReservation(id) {
    setReservations(rs => rs.filter(r => r.id !== id))
    setTimeout(() => fetchReservations(), 400)
  }

  function addReservation({ client, date, hours, price }) {
    // Try to persist to backend; fallback to local-only
    (async () => {
      try {
        const res = await fetch('/api/reservaciones', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client, date, hours, price }) })
        if (!res.ok) throw new Error('Error creating')
        await res.json()
        await fetchReservations()
        setCurrentClient(client)
      } catch (err) {
        console.error('Fallback create reservation:', err)
        const nextId = reservations.length ? Math.max(...reservations.map(r => r.id)) + 1 : 1
        const newRes = { id: nextId, client, date, hours, price: Number(price) || 0, status: 'Pendiente' }
        setReservations(rs => [newRes, ...rs])
        setCurrentClient(client)
      }
    })()
    return null
  }

  useEffect(() => {
    function onKey(e) {
      // Ctrl+Shift+A opens admin prompt
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        const pw = prompt('Acceso administrador — ingresa la contraseña')
        // simple password check (change as needed)
        if (pw === 'admin123') {
          setIsAdmin(true)
          setPage('admin2')
        } else {
          alert('Contraseña incorrecta')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (page === 'login') {
    return (
      <Login
        onBack={() => setPage('landing')}
        onRegister={() => setPage('register')}
        onSuccess={() => setPage('dashboard')}
      />
    )
  }

  if (page === 'register') {
    return (
      <Register
        onBack={() => setPage('landing')}
        onSuccess={() => setPage('dashboard')}
        onLogin={() => setPage('login')}
      />
    )
  }

  if (page === 'dashboard') {
    return <Dashboard onBack={() => setPage('landing')} onReserve={() => setPage('reserve')} onReservations={() => setPage('reservations')} onProfile={() => setPage('profile')} onAdmin={() => setPage('admin-dashboard')} onAdmin2={() => setPage('admin2')} />
  }

  if (page === 'admin-dashboard') {
    // allow admin if flagged or if stored user role is admin
    const stored = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
    if (!isAdmin && !(stored && stored.role === 'admin')) { setPage('landing'); return null }
    return <AdminDashboard onBack={() => setPage('dashboard')} onOpenUsers={() => setPage('admin-users')} onOpenCancha={() => setPage('admin-canchas')} onOpenReservaciones={() => setPage('admin-reservaciones')} />
  }

  if (page === 'admin-users') {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
    if (!isAdmin && !(stored && stored.role === 'admin')) { setPage('landing'); return null }
    return <Users onBack={() => setPage('admin-dashboard')} />
  }



  if (page === 'admin2') {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
    if (!isAdmin && !(stored && stored.role === 'admin')) { 
      setPage('landing')
      return null
    }
    return <Admin2 onBack={() => setPage('dashboard')} onOpenTabla={() => setPage('admin2-table')} reservations={reservations} />
  }

  if (page === 'admin-canchas') {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
    if (!isAdmin && !(stored && stored.role === 'admin')) { setPage('landing'); return null }
    return <Canchas onBack={() => setPage('admin-dashboard')} />
  }

  if (page === 'admin-reservaciones') {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
    if (!isAdmin && !(stored && stored.role === 'admin')) { setPage('landing'); return null }
    return <Reservaciones onBack={() => setPage('admin-dashboard')} />
  }



  if (page === 'admin2-table') {
    if (!isAdmin) { setPage('landing'); return null }
    return <div style={{position:'fixed', inset:0, background:'white'}}>
      <div style={{padding:18}}>
        <button className="btn" onClick={() => setPage('admin2')}>Volver al Admin</button>
      </div>
      <div style={{padding:18}}>
        <Tabla reservations={reservations} busyIds={busyIds} onAccept={acceptReservation} onModify={(id) => {
          const current = reservations.find(r => r.id === id)
          const newHours = prompt('Modificar horas (ej. 19:00 - 20:00)', current ? current.hours : '')
          if (newHours != null) modifyHours(id, newHours)
        }} onReject={rejectReservation} onDelete={deleteReservation} onBack={() => setPage('dashboard')} onBackToChart={() => setPage('admin2')} />
      </div>
      {toast && (
        <div style={{position:'fixed', right:18, top:18, background:'#0b8c55', color:'white', padding:'8px 12px', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.15)'}}>{toast}</div>
      )}
    </div>
  }

  if (page === 'reserve') {
    return <Reserve onBack={() => setPage('dashboard')} onHome={() => setPage('landing')} currentClient={currentClient} onCreateReservation={(data) => {
      addReservation(data)
      showToast('Reserva enviada exitosamente', 'success')
    }} />
  }

  if (page === 'reservations') {
    return <Reservations onBack={() => setPage('dashboard')} onHome={() => setPage('landing')} reservations={reservations} currentClient={currentClient} />
  }

  if (page === 'profile') {
    return <Profile onBack={() => setPage('dashboard')} onHome={() => setPage('landing')} />
  }

  // landing (default)
  return (
    <>
      <Landing onLogin={() => setPage('login')} onRegister={() => setPage('register')} />
      <Toast message={toast.message} type={toast.type} />
    </>
  )
}
