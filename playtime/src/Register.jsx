import React, { useState } from 'react'
import './Register.css'

export default function Register({ onSuccess, onLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const form = e.target
    const name = form.name ? form.name.value : ''
    const email = form.email.value
    const password = form.password.value
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.message || 'Error en registro')
      if (body.user) localStorage.setItem('user', JSON.stringify(body.user))
      if (typeof onSuccess === 'function') onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-top-left">
        <img src="/logo play 1.png" alt="PlayTime" />
        <div className="register-brand"></div>
      </div>

      <main className="register-main">
        <div className="register-container">
          <aside className="register-side">
            <div className="side-card">
              <h3>¿Ya tienes cuenta?</h3>
              <p>Inicia sesión para continuar con tus reservas.</p>
              <button className="side-btn" type="button" onClick={() => { if (typeof onLogin === 'function') onLogin() }}>Iniciar Sesión</button>
            </div>
          </aside>

          <section className="register-form-wrapper">
            <h2>Registrarse</h2>

            <form className="register-form" onSubmit={handleSubmit}>
              <label>
                <span className="label">Nombre</span>
                <input name="name" type="text" />
              </label>

              <label>
                <span className="label">Email</span>
                <input name="email" type="email" required />
              </label>

              <label>
                <span className="label">Contraseña</span>
                <input name="password" type="password" required />
              </label>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <div style={{height:18}} />

              <div style={{display:'flex', justifyContent:'center'}}>
                <button className="btn register-submit" type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <footer className="login-footer" />
    </div>
  )
}
