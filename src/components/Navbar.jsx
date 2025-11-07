import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

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
          <Link to="/historico" className={`nav-link ${isActive('/historico')}`}>
            📅 Histórico
          </Link>
          <Link to="/exportar" className={`nav-link ${isActive('/exportar')}`}>
            📥 Exportar
          </Link>
          <Link to="/conquistas" className={`nav-link ${isActive('/conquistas')}`}>
            🏆 Conquistas
          </Link>
          <Link to="/estatisticas" className={`nav-link ${isActive('/estatisticas')}`}>
            📊 Estatísticas
          </Link>
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

