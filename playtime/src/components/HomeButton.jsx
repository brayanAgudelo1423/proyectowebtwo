import React from 'react'
import './HomeButton.css'

export default function HomeButton({ onClick, size = 64, fontSize = 28, ariaLabel = 'Inicio', children }) {
  const style = { width: `${size}px`, height: `${size}px`, fontSize: `${fontSize}px`, lineHeight: 1 }

  return (
    <button className="home-btn" aria-label={ariaLabel} onClick={onClick} style={style} type="button">
      {children || <span className="home-emoji" aria-hidden="true">🏠</span>}
    </button>
  )
}
