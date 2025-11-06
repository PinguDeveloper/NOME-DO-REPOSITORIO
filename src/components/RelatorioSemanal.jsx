import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import './RelatorioSemanal.css'

const CALORIA_META_MAX = 1600
const AGUA_META = 4000 // 4 litros em ml

function RelatorioSemanal() {
  const [dadosSemana, setDadosSemana] = useState([])

  useEffect(() => {
    loadDadosSemana()
  }, [])

  const loadDadosSemana = async () => {
    try {
      const dados = await api.buscarRelatorioSemanal()
      setDadosSemana(dados)
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
    }
  }

  const mediaCalorias = dadosSemana.length > 0
    ? dadosSemana.reduce((sum, d) => sum + d.totalCalorias, 0) / dadosSemana.length
    : 0

  const mediaAgua = dadosSemana.length > 0
    ? dadosSemana.reduce((sum, d) => sum + d.totalAgua, 0) / dadosSemana.length
    : 0

  const diasBateuMetaCalorias = dadosSemana.filter(d => d.bateuCalorias).length
  const diasBateuMetaAgua = dadosSemana.filter(d => d.bateuAgua).length
  const diasBateuAmbasMetas = dadosSemana.filter(d => d.bateuAmbas).length

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
  }

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <h1>📈 Relatório Semanal</h1>
        <p className="relatorio-subtitle">Resumo da semana atual</p>
      </div>

      <div className="relatorio-resumo">
        <div className="resumo-card">
          <h3>🔥 Média de Calorias</h3>
          <div className="resumo-value">
            {Math.round(mediaCalorias)}
            <span className="resumo-unit">kcal/dia</span>
          </div>
          <div className="resumo-meta">
            Meta: {CALORIA_META_MAX} kcal
          </div>
        </div>

        <div className="resumo-card">
          <h3>💧 Média de Água</h3>
          <div className="resumo-value">
            {(mediaAgua / 1000).toFixed(1)}
            <span className="resumo-unit">L/dia</span>
          </div>
          <div className="resumo-meta">
            Meta: 4.0 L/dia
          </div>
        </div>

        <div className="resumo-card">
          <h3>✅ Metas Atingidas</h3>
          <div className="resumo-value">
            {diasBateuAmbasMetas}
            <span className="resumo-unit">dias</span>
          </div>
          <div className="resumo-meta">
            Calorias: {diasBateuMetaCalorias}/7 | Água: {diasBateuMetaAgua}/7
          </div>
        </div>
      </div>

      <div className="relatorio-detalhes">
        <h2>Detalhamento por Dia</h2>
        <div className="detalhes-grid">
          {dadosSemana.map(dado => (
            <div key={dado.data} className="detalhe-card">
              <div className="detalhe-header">
                <h3>{formatDate(dado.data)}</h3>
                <div className="detalhe-status">
                  {dado.bateuAmbas && <span className="status-badge completo">✅</span>}
                  {!dado.bateuAmbas && (
                    <>
                      {dado.bateuCalorias && <span className="status-badge parcial">🔥</span>}
                      {dado.bateuAgua && <span className="status-badge parcial">💧</span>}
                      {!dado.bateuCalorias && !dado.bateuAgua && (
                        <span className="status-badge incompleto">⚠️</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="detalhe-content">
                <div className="detalhe-item">
                  <span className="detalhe-label">Calorias:</span>
                  <span className={`detalhe-value ${dado.bateuCalorias ? 'sucesso' : 'aviso'}`}>
                    {dado.totalCalorias} kcal
                  </span>
                </div>
                
                <div className="detalhe-item">
                  <span className="detalhe-label">Refeições:</span>
                  <span className="detalhe-value">{dado.totalRefeicoes}</span>
                </div>
                
                <div className="detalhe-item">
                  <span className="detalhe-label">Água:</span>
                  <span className={`detalhe-value ${dado.bateuAgua ? 'sucesso' : 'aviso'}`}>
                    {(dado.totalAgua / 1000).toFixed(1)} L
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RelatorioSemanal
