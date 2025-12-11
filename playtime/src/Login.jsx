import React, { useState } from 'react'
import './App.css'

export default function Login({ onRegister, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const form = e.target
    const email = form.email.value
    const password = form.password.value
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.message || 'Error en login')
      if (body.user) localStorage.setItem('user', JSON.stringify(body.user))
      if (typeof onSuccess === 'function') onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <img src="/logo play 1.png" alt="PlayTime" className="login-top-logo" />
      </header>

      <main className="login-main">
        <h2>Iniciar Sesión</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span className="label">Email</span>
            <input name="email" type="email" required />
          </label>

          <label>
            <span className="label">Contraseña</span>
            <input name="password" type="password" required />
          </label>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button className="btn login-submit" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </form>

        <p className="login-register">¿No Tienes Cuenta? <button className="link-button" onClick={(e) => { e.preventDefault(); if (typeof onRegister === 'function') onRegister(); else alert('Ir a registro') }}>Registrarse</button></p>
      </main>

      <footer className="login-footer" />
    </div>
  )
}
