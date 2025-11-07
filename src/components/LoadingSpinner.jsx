import './LoadingSpinner.css'

export function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  const sizeClass = `spinner-${size}`
  
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className={`spinner ${sizeClass}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p>Carregando...</p>
      </div>
    )
  }
  
  return (
    <div className={`spinner ${sizeClass}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  )
}

