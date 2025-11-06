import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import './Dashboard.css'

const AGUA_META = 4000 // 4 litros em ml

const CALORIA_META = 1600 // Meta fixa de 1600 calorias

function Dashboard() {
  const [refeicoes, setRefeicoes] = useState([])
  const [agua, setAgua] = useState({ total: 0, registros: [] })
  const [showWarning, setShowWarning] = useState(false)
  
  // Data atual sempre atualizada
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const loadData = useCallback(async () => {
    try {
      const [refeicoesData, aguaData] = await Promise.all([
        api.buscarRefeicoes(),
        api.buscarAgua()
      ])
      setRefeicoes(refeicoesData)
      setAgua(aguaData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }, [])

  useEffect(() => {
    loadData()
    
    const handleFocus = () => loadData()
    window.addEventListener('focus', handleFocus)
    
    const interval = setInterval(() => {
      loadData()
    }, 30000) // Atualizar a cada 30 segundos
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [loadData])

  const totalCalorias = refeicoes.reduce((sum, r) => {
    // Se a refeição tem itens, somar os itens, senão usar calorias_total ou calorias
    if (r.itens && r.itens.length > 0) {
      return sum + r.itens.reduce((s, item) => s + (item.calorias || 0), 0)
    }
    return sum + (r.calorias_total || r.calorias || 0)
  }, 0)
  const totalRefeicoes = refeicoes.length
  const aguaConsumida = agua.total || 0
  const aguaFalta = Math.max(0, AGUA_META - aguaConsumida)
  const porcentagemAgua = (aguaConsumida / AGUA_META) * 100

  const caloriasRestantes = totalCalorias > CALORIA_META
    ? 0
    : CALORIA_META - totalCalorias

  const statusCalorias = totalCalorias > CALORIA_META
    ? 'acima'
    : totalCalorias < CALORIA_META * 0.8
    ? 'abaixo'
    : 'ok'

  // Aviso proeminente quando ultrapassar
  const ultrapassou = totalCalorias > CALORIA_META
  const excesso = ultrapassou ? totalCalorias - CALORIA_META : 0

  // Verificar se o aviso já foi mostrado hoje
  const getTodayKey = () => {
    return `calorie-warning-${new Date().toISOString().split('T')[0]}`
  }

  const handleCloseWarning = () => {
    setShowWarning(false)
    // Marcar como já visto para hoje
    localStorage.setItem(getTodayKey(), 'true')
  }

  // Mostrar aviso apenas uma vez por dia quando ultrapassar
  useEffect(() => {
    if (ultrapassou) {
      const warningKey = getTodayKey()
      const alreadyShown = localStorage.getItem(warningKey)
      
      if (!alreadyShown && !showWarning) {
        setShowWarning(true)
        localStorage.setItem(warningKey, 'true')
      }
    }
  }, [ultrapassou, showWarning])

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Visão Geral do Dia</h1>
        <p className="dashboard-date">{formattedDate}</p>
      </div>

      {/* Aviso proeminente quando ultrapassar calorias */}
      {showWarning && ultrapassou && (
        <div className="calorie-warning-overlay">
          <div className="calorie-warning-modal">
            <div className="warning-icon">⚠️</div>
            <h2>Meta de Calorias Ultrapassada!</h2>
            <p className="warning-message">
              Você ultrapassou sua meta de <strong>{CALORIA_META} kcal</strong> em <strong>{excesso} kcal</strong>
            </p>
            <p className="warning-subtitle">
              Consumo atual: <strong>{totalCalorias} kcal</strong>
            </p>
            <button 
              className="warning-close-btn"
              onClick={handleCloseWarning}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card calorias-card">
          <div className="card-header">
            <h2>🔥 Calorias</h2>
          </div>
          <div className="card-content">
            <div className="calorias-main">
              <span className="calorias-total">{totalCalorias}</span>
              <span className="calorias-unit">kcal</span>
            </div>
            <div className={`calorias-status ${statusCalorias}`}>
              {statusCalorias === 'abaixo' && (
                <span>Você pode consumir mais {caloriasRestantes} kcal (meta: {CALORIA_META} kcal)</span>
              )}
              {statusCalorias === 'ok' && (
                <span>Meta atingida! ({CALORIA_META} kcal)</span>
              )}
              {statusCalorias === 'acima' && (
                <span className="acima-text">⚠️ Você ultrapassou a meta de {CALORIA_META} kcal em {excesso} kcal</span>
              )}
            </div>
            <div className="calorias-range">
              <div className="range-bar">
                <div 
                  className="range-fill"
                  style={{ 
                    width: `${Math.min(100, (totalCalorias / CALORIA_META) * 100)}%`,
                    backgroundColor: statusCalorias === 'ok' ? '#4CAF50' : statusCalorias === 'abaixo' ? '#FF9800' : '#F44336'
                  }}
                />
              </div>
              <div className="range-labels">
                <span>0 kcal</span>
                <span>{CALORIA_META} kcal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card refeicoes-card">
          <div className="card-header">
            <h2>🍽️ Refeições</h2>
          </div>
          <div className="card-content">
            <div className="refeicoes-count">
              <span className="count-number">{totalRefeicoes}</span>
              <span className="count-label">refeições registradas</span>
            </div>
            <div className="refeicoes-breakdown">
              {['café da manhã', 'almoço', 'café da tarde', 'jantar'].map(tipo => {
                const count = refeicoes.filter(r => r.tipo === tipo).length
                return (
                  <div key={tipo} className="refeicao-item">
                    <span className="refeicao-tipo">{tipo}</span>
                    <span className="refeicao-count">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-card agua-card">
          <div className="card-header">
            <h2>💧 Água</h2>
          </div>
          <div className="card-content">
            <div className="agua-main">
              <span className="agua-consumida">{(aguaConsumida / 1000).toFixed(1)}</span>
              <span className="agua-unit">L</span>
            </div>
            <div className="agua-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min(100, porcentagemAgua)}%` }}
                />
              </div>
              <div className="progress-info">
                <span>Meta: 4.0 L</span>
                {aguaFalta > 0 && (
                  <span className="agua-falta">Falta: {(aguaFalta / 1000).toFixed(1)} L</span>
                )}
                {aguaFalta === 0 && (
                  <span className="agua-completo">✅ Meta atingida!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/refeicoes" className="action-button">
          ➕ Adicionar Refeição
        </Link>
        <Link to="/agua" className="action-button">
          💧 Registrar Água
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
