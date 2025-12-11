import React, { useEffect, useState } from 'react'
import './Admin2.css'
import HomeButton from './components/HomeButton'

export default function Users({ onBack }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState({})

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/usuarios', { credentials: 'include' })
        if (!res.ok) throw new Error('Error fetching users: ' + res.status)
        const body = await res.json()
        if (mounted) setUsers(body)
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="admin2-page">
      <div className="admin2-top-left">
        <button className="logo-btn" type="button" aria-label="Ir al inicio" onClick={() => { if (typeof onBack === 'function') onBack() }}>
          <img src="/logo play 1.png" alt="PlayTime" />
        </button>
      </div>

      <main className="admin2-main">
        <h1>Administrar Usuarios</h1>

        {loading && <p>Cargando usuarios...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <div className="admin2-reservations">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      {u.role !== 'admin' && (
                        <button
                          className="btn primary"
                          disabled={!!processing[u.id]}
                          onClick={async () => {
                            if (!confirm(`Promover ${u.name} (ID ${u.id}) a administrador?`)) return
                            setProcessing(p => ({ ...p, [u.id]: true }))
                            try {
                              const res = await fetch(`/api/usuarios/${u.id}`, {
                                method: 'PUT',
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ role: 'admin' })
                              })
                              const body = await res.json().catch(() => ({}))
                              if (!res.ok) throw new Error(body.message || `Error ${res.status}`)
                              setUsers(list => list.map(x => x.id === u.id ? { ...x, role: 'admin' } : x))
                            } catch (err) {
                              alert('Error promoviendo usuario: ' + (err.message || err))
                            } finally {
                              setProcessing(p => { const np = { ...p }; delete np[u.id]; return np })
                            }
                          }}
                        >Promover</button>
                      )}

                      <button
                        className="btn danger"
                        disabled={!!processing[u.id]}
                        onClick={async () => {
                          if (!confirm(`Eliminar usuario ${u.name} (ID ${u.id})? Esta acción es irreversible.`)) return
                          setProcessing(p => ({ ...p, [u.id]: true }))
                          try {
                            const res = await fetch(`/api/usuarios/${u.id}`, {
                              method: 'DELETE',
                              credentials: 'include'
                            })
                            const body = await res.json().catch(() => ({}))
                            if (!res.ok) throw new Error(body.message || `Error ${res.status}`)
                            setUsers(list => list.filter(x => x.id !== u.id))
                          } catch (err) {
                            alert('Error eliminando usuario: ' + (err.message || err))
                          } finally {
                            setProcessing(p => { const np = { ...p }; delete np[u.id]; return np })
                          }
                        }}
                      >Eliminar</button>
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
    </div>
  )
}
