import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          💧 Controle de Dieta
        </Link>
        
        <div className="navbar-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            📊 Dashboard
          </Link>
          <Link to="/refeicoes" className={`nav-link ${isActive('/refeicoes')}`}>
            🍽️ Refeições
          </Link>
          <Link to="/agua" className={`nav-link ${isActive('/agua')}`}>
            💧 Água
          </Link>
          <Link to="/relatorio" className={`nav-link ${isActive('/relatorio')}`}>
            📈 Relatório
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

