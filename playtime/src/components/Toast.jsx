export default function Toast({ message, type = 'info' }) {
  if (!message) return null
  
  const bgColor = type === 'error' ? '#e14b3b' : type === 'success' ? '#0fa867' : '#333'
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: bgColor,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '4px',
      zIndex: 9999,
      maxWidth: '300px',
      wordWrap: 'break-word'
    }}>
      {message}
    </div>
  )
}
