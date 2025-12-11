import React, { useEffect, useState } from 'react'
import './Admin2.css'
import HomeButton from './components/HomeButton'
import Toast from './components/Toast'

export default function Canchas({ onBack }) {
  const [canchas, setCanchas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState({})
  const [sessionUser, setSessionUser] = useState(null)
  const [form, setForm] = useState({ name: '', type: '', pricePerHour: '', location: '', status: 'disponible' })
  const [toast, setToast] = useState({ message: '', type: 'info' })

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // fetch current session user for debug and authorization display
        try {
          const meRes = await fetch('/api/auth/me', { credentials: 'include' })
          if (meRes.ok) {
            const meBody = await meRes.json().catch(() => ({}))
            if (mounted && meBody && meBody.user) setSessionUser(meBody.user)
          }
        } catch {
          // ignore
        }
        const res = await fetch('/api/canchas', { credentials: 'include' })
        if (!res.ok) throw new Error('Error fetching canchas: ' + res.status)
        const body = await res.json()
        if (mounted) setCanchas(Array.isArray(body) ? body.sort((a, b) => a.id - b.id) : body)
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'info' }), 3000)
  }

  async function createCancha(e) {
    e.preventDefault()
    setError(null)
    setProcessing(p => ({ ...p, create: true }))
    try {
      const payload = { name: form.name, type: form.type, pricePerHour: Number(form.pricePerHour) || 0, location: form.location, status: form.status }
      console.log('Creando cancha:', payload)
      const res = await fetch('/api/canchas', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const body = await res.json().catch(() => ({}))
      console.log('Respuesta del servidor:', res.status, body)
      if (res.status === 401) {
        showToast('No autenticado. Inicia sesión como administrador.', 'error')
        return
      }
      if (res.status === 403) {
        showToast('Acceso denegado: necesitas rol de administrador.', 'error')
        return
      }
      if (!res.ok) throw new Error(body.message || `Error ${res.status}`)
      setCanchas(list => [...list, body].sort((a, b) => a.id - b.id))
      setForm({ name: '', type: '', pricePerHour: '', location: '', status: 'disponible' })
    } catch (err) {
      console.error('Error creando cancha:', err)
      setError(err.message)
      showToast('Error: ' + err.message, 'error')
    } finally {
      setProcessing(p => { const np = { ...p }; delete np.create; return np })
    }
  }

  async function saveCancha(id, changes) {
    setProcessing(p => ({ ...p, [id]: true }))
    try {
      const res = await fetch(`/api/canchas/${id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) })
      const body = await res.json().catch(() => ({}))
      if (res.status === 401) { showToast('No autenticado. Inicia sesión.', 'error'); return }
      if (res.status === 403) { showToast('Acceso denegado: necesitas rol admin.', 'error'); return }
      if (!res.ok) throw new Error(body.message || `Error ${res.status}`)
      setCanchas(list => list.map(c => c.id === id ? body : c))
      showToast('Cancha actualizada', 'success')
    } catch (err) {
      showToast('Error actualizando cancha: ' + (err.message || err), 'error')
    } finally {
      setProcessing(p => { const np = { ...p }; delete np[id]; return np })
    }
  }

  async function deleteCancha(id) {
    if (!confirm('Eliminar cancha #' + id + '?')) return
    setProcessing(p => ({ ...p, [id]: true }))
    try {
      const res = await fetch(`/api/canchas/${id}`, { method: 'DELETE', credentials: 'include' })
      const b = await res.json().catch(() => ({}))
      if (res.status === 401) { showToast('No autenticado. Inicia sesión.', 'error'); return }
      if (res.status === 403) { showToast('Acceso denegado: necesitas rol admin.', 'error'); return }
      if (!res.ok) throw new Error(b.message || `Error ${res.status}`)
      setCanchas(list => list.filter(c => c.id !== id))
      showToast('Cancha eliminada', 'success')
    } catch (err) {
      showToast('Error eliminando cancha: ' + (err.message || err), 'error')
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
        <h1>Administrar Canchas</h1>
        {sessionUser && (
          <p style={{ marginTop: 6, marginBottom: 8, color: '#333' }}>Sesión: {sessionUser.name} ({sessionUser.role})</p>
        )}

        {loading && <p>Cargando canchas...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <section style={{ marginTop: 12, marginBottom: 18 }}>
          <h3>Crear nueva cancha</h3>
          <form onSubmit={createCancha} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input placeholder="Nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <input placeholder="Tipo" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
            <input placeholder="Precio / hora" type="number" value={form.pricePerHour} onChange={e => setForm(f => ({ ...f, pricePerHour: e.target.value }))} />
            <input placeholder="Ubicación" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="disponible">Disponible</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="ocupada">Ocupada</option>
            </select>
            <button className="btn primary" type="submit" disabled={!!processing.create}>{processing.create ? 'Creando...' : 'Crear'}</button>
          </form>
        </section>

        {!loading && !error && (
          <div className="admin2-reservations">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Precio/h</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {canchas.map(c => (
                  <CanchaRow key={c.id} cancha={c} onSave={saveCancha} onDelete={deleteCancha} processing={!!processing[c.id]} />
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

function CanchaRow({ cancha, onSave, onDelete, processing }) {
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState({ name: cancha.name, type: cancha.type || '', pricePerHour: cancha.pricePerHour, location: cancha.location || '', status: cancha.status })

  return (
    <tr>
      <td>{cancha.id}</td>
      <td>{editing ? <input value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} /> : cancha.name}</td>
      <td>{editing ? <input value={data.type} onChange={e => setData(d => ({ ...d, type: e.target.value }))} /> : cancha.type}</td>
      <td>{editing ? <input type="number" value={data.pricePerHour} onChange={e => setData(d => ({ ...d, pricePerHour: e.target.value }))} /> : Number(cancha.pricePerHour).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
      <td>{editing ? <input value={data.location} onChange={e => setData(d => ({ ...d, location: e.target.value }))} /> : cancha.location}</td>
      <td>{editing ? (
        <select value={data.status} onChange={e => setData(d => ({ ...d, status: e.target.value }))}>
          <option value="disponible">Disponible</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="ocupada">Ocupada</option>
        </select>
      ) : cancha.status}</td>
      <td style={{ display: 'flex', gap: 8 }}>
        {editing ? (
          <>
            <button className="btn primary" disabled={processing} onClick={() => onSave(cancha.id, data)}>Guardar</button>
            <button className="btn" disabled={processing} onClick={() => setEditing(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => setEditing(true)}>Editar</button>
            <button className="btn" disabled={processing} onClick={() => onDelete(cancha.id)} style={{ backgroundColor: '#e14b3b', color: 'white' }}>Eliminar</button>
          </>
        )}
      </td>
    </tr>
  )
}
