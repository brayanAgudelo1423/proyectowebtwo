import React, { useState, useEffect } from 'react'
import './Reserve.css'
import HomeButton from './components/HomeButton'
import Toast from './components/Toast'

export default function Reserve({ onBack, onCreateReservation = () => {}, currentClient = null }) {
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [courts, setCourts] = useState([])
  const [reservationData, setReservationData] = useState({})
  const [toast, setToast] = useState({ message: '', type: 'info' })
  
  useEffect(() => {
    fetch('/api/canchas', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourts(data)
          // Inicializar datos de reservación para cada cancha
          const initial = {}
          data.forEach(c => {
            initial[c.id] = {
              date: new Date().toISOString().slice(0,10),
              startAt: '19:00',
              endAt: '20:00'
            }
          })
          setReservationData(initial)
        } else {
          setCourts([])
        }
      })
      .catch(() => setCourts([]))
  }, [])

  // Obtener usuario autenticado de localStorage
  let user = null
  try { user = JSON.parse(localStorage.getItem('user')) } catch {/*ignorar error*/}

  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'info' }), 3000)
  }

  function updateReservationField(canchaId, field, value) {
    setReservationData(prev => ({
      ...prev,
      [canchaId]: {
        ...prev[canchaId],
        [field]: value
      }
    }))
  }

  function handleReserve() {
    if (selectedCourt === null) {
      showToast('Por favor selecciona una cancha', 'error')
      return
    }
    
    const court = courts.find(c => c.id === selectedCourt)
    if (!court) {
      showToast('Cancha no encontrada', 'error')
      return
    }

    const data = reservationData[selectedCourt] || {}
    if (!data.date || !data.startAt || !data.endAt) {
      showToast('Por favor completa todos los campos de la cancha seleccionada', 'error')
      return
    }
    
    // Usar usuario autenticado si existe
    const client = (user && user.nombre) || currentClient || 'Nombre Apellido'
    const usuarioId = (user && user.id) || null
    const price = court.pricePerHour || court.price || 0
    const canchaId = court.id
    const hours = `${data.startAt} - ${data.endAt}`
    
    const reservationPayload = { 
      client, 
      date: data.date, 
      hours, 
      price, 
      canchaId, 
      usuarioId, 
      startAt: data.startAt, 
      endAt: data.endAt 
    }
    
    // Enviar al backend
    fetch('/api/reservaciones', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationPayload)
    })
      .then(res => {
        if (res.status === 401) { showToast('No autenticado. Inicia sesión.', 'error'); return }
        if (res.status === 403) { showToast('Acceso denegado.', 'error'); return }
        if (!res.ok) throw new Error('Error creating reservation')
        return res.json()
      })
      .then(body => {
        if (body) {
          showToast('Reserva creada exitosamente', 'success')
          // Llamar al callback después de un pequeño delay para que se vea el toast
          setTimeout(() => {
            onCreateReservation(reservationPayload)
          }, 500)
        }
      })
      .catch(err => {
        showToast('Error al crear la reserva: ' + (err.message || err), 'error')
      })
  }

  function handleWhatsApp() {
    const court = courts[selectedCourt] || { name: 'Cancha' }
    const client = currentClient || ''
    const text = `Hola! Me gustaría reservar ${court.name}${client ? ' — Cliente: ' + client : ''}. ¿Podrían indicarme disponibilidad y precio? Gracias.`
    const url = 'https://wa.me/?text=' + encodeURIComponent(text)
    window.open(url, '_blank')
  }

  return (
    <>
    <div className="reserve-page">
      <div className="reserve-top-left">
        <img src="/logo play 1.png" alt="PlayTime" />
      </div>

      <main className="reserve-main">
        <h1>Reservar Cancha</h1>

        <h2 className="reserve-sub">Tablero de Canchas</h2>

        <table className="courts-table" role="table">
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Nombre Cancha</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Precio / Hora</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((c) => {
              const data = reservationData[c.id] || {}
              const isSelected = selectedCourt === c.id
              return (
                <tr key={c.id} className={isSelected ? 'selected-row' : ''}>
                  <td style={{textAlign:'center'}}>
                    <input 
                      type="radio" 
                      name="court" 
                      checked={isSelected} 
                      onChange={() => setSelectedCourt(c.id)} 
                    />
                  </td>
                  <td>{c.name}</td>
                  <td>{c.type || c.tipoCancha || 'N/A'}</td>
                  <td>
                    <input 
                      type="date" 
                      value={data.date || ''} 
                      onChange={(e) => updateReservationField(c.id, 'date', e.target.value)}
                      style={{padding:6, fontSize:14, borderRadius:4, border:'1px solid #ccc', width:'140px'}}
                    />
                  </td>
                  <td>
                    <input 
                      type="time" 
                      value={data.startAt || ''} 
                      onChange={(e) => updateReservationField(c.id, 'startAt', e.target.value)}
                      style={{padding:6, fontSize:14, borderRadius:4, border:'1px solid #ccc', width:'100px'}}
                    />
                  </td>
                  <td>
                    <input 
                      type="time" 
                      value={data.endAt || ''} 
                      onChange={(e) => updateReservationField(c.id, 'endAt', e.target.value)}
                      style={{padding:6, fontSize:14, borderRadius:4, border:'1px solid #ccc', width:'100px'}}
                    />
                  </td>
                  <td>{(c.pricePerHour || c.price || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div style={{marginTop:28, display:'flex', gap:12, justifyContent:'center'}}>
          <button className="btn reserve-action" onClick={handleReserve}>Realizar Reserva</button>
          <button className="btn whatsapp-btn" onClick={handleWhatsApp}>WhatsApp</button>
        </div>
      </main>

      <footer className="reserve-footer">
        <HomeButton onClick={() => { if (typeof onBack === 'function') onBack() }} />
      </footer>
    </div>
    <Toast message={toast.message} type={toast.type} />
    </>
  )
}
