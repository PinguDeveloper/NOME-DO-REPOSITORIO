import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import './Agua.css'

const AGUA_META = 4000 // 4 litros em ml
const OPCOES_AGUA = [
  { label: 'Copo 200ml', quantidade: 200 },
  { label: 'Garrafa 500ml', quantidade: 500 },
  { label: 'Garrafa 1,5L', quantidade: 1500 }
]

function Agua() {
  const [agua, setAgua] = useState({ total: 0, registros: [] })
  const [customAmount, setCustomAmount] = useState('')

  useEffect(() => {
    loadAgua()
    
    const handleFocus = () => loadAgua()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadAgua = async () => {
    try {
      const data = await api.buscarAgua()
      setAgua(data)
    } catch (error) {
      console.error('Erro ao carregar água:', error)
    }
  }

  const handleAddWater = async (quantidade) => {
    try {
      await api.adicionarAgua(quantidade)
      await loadAgua()
    } catch (error) {
      console.error('Erro ao adicionar água:', error)
      alert('Erro ao adicionar água. Verifique se o servidor está rodando.')
    }
  }

  const handleCustomAdd = async (e) => {
    e.preventDefault()
    const amount = parseInt(customAmount)
    if (amount && amount > 0) {
      await handleAddWater(amount)
      setCustomAmount('')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await api.deletarAgua(id)
        await loadAgua()
      } catch (error) {
        console.error('Erro ao deletar registro:', error)
      }
    }
  }

  const aguaConsumida = agua.total || 0
  const aguaFalta = Math.max(0, AGUA_META - aguaConsumida)
  const porcentagemAgua = (aguaConsumida / AGUA_META) * 100
  const litrosConsumidos = (aguaConsumida / 1000).toFixed(1)
  const litrosFaltam = (aguaFalta / 1000).toFixed(1)

  return (
    <div className="agua-container">
      <div className="agua-header">
        <h1>💧 Controle de Água</h1>
        <p className="agua-subtitle">Meta diária: 4 litros</p>
      </div>

      <div className="agua-summary-card">
        <div className="agua-main-display">
          <div className="agua-amount">
            <span className="agua-number">{litrosConsumidos}</span>
            <span className="agua-unit">L</span>
          </div>
          <div className="agua-progress-container">
            <div className="agua-progress-bar">
              <div 
                className="agua-progress-fill"
                style={{ width: `${Math.min(100, porcentagemAgua)}%` }}
              />
            </div>
            <div className="agua-progress-info">
              {aguaFalta > 0 ? (
                <span className="agua-falta">Faltam {litrosFaltam} L para completar a meta</span>
              ) : (
                <span className="agua-completo">✅ Meta atingida! Parabéns!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="agua-options">
        <h2>Adicionar Água</h2>
        <div className="agua-buttons">
          {OPCOES_AGUA.map(opcao => (
            <button
              key={opcao.label}
              onClick={() => handleAddWater(opcao.quantidade)}
              className="agua-button"
            >
              <span className="agua-button-label">{opcao.label}</span>
              <span className="agua-button-amount">+{opcao.quantidade}ml</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomAdd} className="custom-amount-form">
          <div className="custom-input-group">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Quantidade personalizada (ml)"
              min="1"
              className="custom-input"
            />
            <button type="submit" className="custom-button">
              Adicionar
            </button>
          </div>
        </form>
        <div style={{ marginTop: '25px' }}>
          <h3 style={{ marginBottom: '15px' }}>Registros de Hoje</h3>
          <div>
            {agua.registros && agua.registros.length > 0 ? (
              agua.registros
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(registro => {
                  const hora = new Date(registro.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  return (
                    <div key={registro.id} className="registro-item">
                      <div className="registro-info">
                        <span className="registro-hora">{hora}</span>
                        <span className="registro-quantidade">+{registro.quantidade} ml</span>
                      </div>
                      <button
                        onClick={() => handleDelete(registro.id)}
                        className="delete-registro-button"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  )
                })
            ) : (
              <div className="empty-registros">
                <p>Nenhum registro de água hoje</p>
                <p>Comece a adicionar água!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agua
