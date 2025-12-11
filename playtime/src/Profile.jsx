import React, { useEffect, useState } from 'react'
import './Profile.css'
import HomeButton from './components/HomeButton'

export default function Profile({ onBack, onHome }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (!res.ok) {
          if (res.status === 401) {
            // not authenticated, go back
            if (typeof onBack === 'function') onBack()
            return
          }
          const b = await res.json().catch(() => ({}))
          throw new Error(b.message || `Error ${res.status}`)
        }
        const body = await res.json()
        if (mounted) setUser(body.user)
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [onBack])

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('user')
      if (typeof onHome === 'function') onHome()
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)
    const form = e.target
    const name = form.name.value
    const email = form.email.value
    const password = form.password.value
    try {
      const res = await fetch(`/api/usuarios/${user.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.message || 'Error updating profile')
      setUser(body)
      localStorage.setItem('user', JSON.stringify(body))
      // go back to dashboard after update
      if (typeof onBack === 'function') onBack()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="profile-page"><main className="profile-main"><p>Cargando perfil...</p></main></div>

  if (error) return (
    <div className="profile-page">
      <main className="profile-main">
        <p style={{ color: 'red' }}>Error: {error}</p>
      </main>
    </div>
  )

  return (
    <div className="profile-page">
      <div className="profile-top-left">
        <img src="/logo play 1.png" alt="PlayTime" />
      </div>

      <main className="profile-main">
        <h1>Mi Perfil</h1>

        <form className="profile-form" onSubmit={handleUpdate}>
          <label>
            <span className="label">Nombre</span>
            <input name="name" type="text" defaultValue={user.name || ''} />
          </label>

          <label>
            <span className="label">Email</span>
            <input name="email" type="email" defaultValue={user.email || ''} required />
          </label>

          <label>
            <span className="label">Nueva Contraseña (opcional)</span>
            <input name="password" type="password" />
          </label>

          <label>
            <span className="label">Rol</span>
          </label>
            <div className="role-text">{user.role}</div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ height: 20 }} />

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <button className="btn profile-submit" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Actualizar'}</button>
            <button className="btn" type="button" onClick={handleLogout} style={{ background: '#d32f2f' }}>Cerrar Sesión</button>
          </div>
        </form>
      </main>

      <footer className="profile-footer">
        <HomeButton onClick={() => { if (typeof onBack === 'function') onBack(); else if (typeof onHome === 'function') onHome(); }} />
      </footer>
    </div>
  )
}
