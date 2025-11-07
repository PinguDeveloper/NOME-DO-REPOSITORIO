import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { LoadingSpinner } from './LoadingSpinner'
import { showToast } from '../utils/toast'
import './Conquistas.css'

const CONQUISTAS = [
  { id: 'primeira-refeicao', nome: 'Primeira Refeição', descricao: 'Registre sua primeira refeição', icone: '🍽️', cor: '#FF6B6B' },
  { id: 'primeira-agua', nome: 'Hidratação', descricao: 'Registre seu primeiro copo de água', icone: '💧', cor: '#4ECDC4' },
  { id: 'meta-calorias', nome: 'Meta de Calorias', descricao: 'Atinga sua meta de calorias', icone: '🔥', cor: '#FFA726' },
  { id: 'meta-agua', nome: 'Meta de Água', descricao: 'Atinga sua meta de água', icone: '💧', cor: '#42A5F5' },
  { id: 'semana-completa', nome: 'Semana Completa', descricao: 'Registre refeições por 7 dias', icone: '📅', cor: '#66BB6A' },
  { id: 'streak-3', nome: 'Sequência de 3', descricao: '3 dias consecutivos atingindo metas', icone: '🔥', cor: '#AB47BC' },
  { id: 'streak-7', nome: 'Sequência de 7', descricao: '7 dias consecutivos atingindo metas', icone: '⭐', cor: '#FFD700' },
  { id: 'streak-30', nome: 'Mestre da Dieta', descricao: '30 dias consecutivos atingindo metas', icone: '👑', cor: '#FF6B6B' }
]

function Conquistas() {
  const [conquistas, setConquistas] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ refeicoes: 0, agua: 0, dias: 0 })

  useEffect(() => {
    loadConquistas()
  }, [])

  const loadConquistas = async () => {
    try {
      setLoading(true)
      const [refeicoes, agua, relatorio] = await Promise.all([
        api.buscarRefeicoes().catch(() => []),
        api.buscarAgua().catch(() => ({ total: 0, registros: [] })),
        api.buscarRelatorioSemanal().catch(() => [])
      ])

      const totalRefeicoes = refeicoes.length
      const totalAgua = agua.registros?.length || 0
      const diasComDados = relatorio.filter(d => d.totalCalorias > 0 || d.totalAgua > 0).length

      setStats({ refeicoes: totalRefeicoes, agua: totalAgua, dias: diasComDados })

      // Calcular conquistas desbloqueadas
      const desbloqueadas = []
      
      if (totalRefeicoes > 0) desbloqueadas.push('primeira-refeicao')
      if (totalAgua > 0) desbloqueadas.push('primeira-agua')
      
      const diasBateuCalorias = relatorio.filter(d => d.bateuCalorias).length
      const diasBateuAgua = relatorio.filter(d => d.bateuAgua).length
      
      if (diasBateuCalorias > 0) desbloqueadas.push('meta-calorias')
      if (diasBateuAgua > 0) desbloqueadas.push('meta-agua')
      if (diasComDados >= 7) desbloqueadas.push('semana-completa')
      
      // Calcular streaks (simplificado)
      let streak = 0
      for (let i = relatorio.length - 1; i >= 0; i--) {
        if (relatorio[i].bateuAmbas) {
          streak++
        } else {
          break
        }
      }
      
      if (streak >= 3) desbloqueadas.push('streak-3')
      if (streak >= 7) desbloqueadas.push('streak-7')
      if (streak >= 30) desbloqueadas.push('streak-30')

      setConquistas(desbloqueadas)
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error)
      showToast.error('Erro ao carregar conquistas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="conquistas-container">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  const progresso = (conquistas.length / CONQUISTAS.length) * 100

  return (
    <div className="conquistas-container">
      <div className="conquistas-header">
        <h1>🏆 Conquistas</h1>
        <div className="progresso-geral">
          <div className="progresso-bar">
            <div 
              className="progresso-fill"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p>{conquistas.length} de {CONQUISTAS.length} conquistas desbloqueadas</p>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>🍽️ Refeições</h3>
          <p className="stat-value">{stats.refeicoes}</p>
        </div>
        <div className="stat-card">
          <h3>💧 Água</h3>
          <p className="stat-value">{stats.agua}</p>
        </div>
        <div className="stat-card">
          <h3>📅 Dias</h3>
          <p className="stat-value">{stats.dias}</p>
        </div>
      </div>

      <div className="conquistas-grid">
        {CONQUISTAS.map(conquista => {
          const desbloqueada = conquistas.includes(conquista.id)
          return (
            <div
              key={conquista.id}
              className={`conquista-card ${desbloqueada ? 'desbloqueada' : 'bloqueada'}`}
              style={{ '--cor': conquista.cor }}
            >
              <div className="conquista-icone">{conquista.icone}</div>
              <h3>{conquista.nome}</h3>
              <p>{conquista.descricao}</p>
              {desbloqueada && (
                <div className="conquista-badge">✓ Desbloqueada</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Conquistas

