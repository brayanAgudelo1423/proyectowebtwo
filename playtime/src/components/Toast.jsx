import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'info' }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (message) {
      setIsVisible(true)
    }
  }, [message])
  
  if (!message) return null
  
  const bgColor = type === 'error' ? '#e14b3b' : type === 'success' ? '#0fa867' : type === 'warning' ? '#ff9800' : '#333'
  const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      background: bgColor,
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      zIndex: 9999,
      maxWidth: '400px',
      minWidth: '280px',
      wordWrap: 'break-word',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontWeight: '500',
      fontSize: '15px',
      animation: isVisible ? 'toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      backdropFilter: 'blur(10px)'
    }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{message}</span>
      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
