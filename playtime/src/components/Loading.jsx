export default function Loading({ size = 'medium', fullscreen = false }) {
  const sizes = {
    small: '24px',
    medium: '40px',
    large: '60px'
  }
  
  const spinnerSize = sizes[size] || sizes.medium
  
  if (fullscreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        zIndex: 9998
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div className="spinner" style={{
            width: spinnerSize,
            height: spinnerSize,
            border: '4px solid rgba(15, 168, 103, 0.2)',
            borderTopColor: '#0fa867',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ 
            margin: 0, 
            color: '#1a1a1a',
            fontWeight: '500'
          }}>Cargando...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="spinner" style={{
        width: spinnerSize,
        height: spinnerSize,
        border: '3px solid rgba(15, 168, 103, 0.2)',
        borderTopColor: '#0fa867',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}></div>
    </div>
  )
}
