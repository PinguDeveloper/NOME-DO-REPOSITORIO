import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { api } from '../utils/api'
import { LoadingSpinner } from './LoadingSpinner'
import { showToast } from '../utils/toast'
import './RelatorioSemanal.css'

function RelatorioSemanal() {
  const [dadosSemana, setDadosSemana] = useState([])
  const [loading, setLoading] = useState(true)
  const [metas, setMetas] = useState({ calorias: 1600, agua: 4000 })

  useEffect(() => {
    loadDadosSemana()
  }, [])

  const loadDadosSemana = async () => {
    try {
      setLoading(true)
      const [dados, metasData] = await Promise.all([
        api.buscarRelatorioSemanal().catch(err => {
          showToast.error('Erro ao carregar relatório')
          return []
        }),
        api.buscarMetas().catch(() => ({ calorias: 1600, agua: 4000 }))
      ])
      setDadosSemana(dados)
      setMetas(metasData)
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
      showToast.error('Erro ao carregar relatório')
    } finally {
      setLoading(false)
    }
  }

  const CALORIA_META = metas.calorias
  const AGUA_META = metas.agua

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

  // Preparar dados para gráficos
  const chartData = dadosSemana.map(d => ({
    dia: formatDate(d.data),
    calorias: d.totalCalorias,
    metaCalorias: CALORIA_META,
    agua: (d.totalAgua / 1000).toFixed(1),
    metaAgua: (AGUA_META / 1000).toFixed(1)
  }))

  if (loading) {
    return (
      <div className="relatorio-container">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <h1>📈 Relatório Semanal</h1>
        <p className="relatorio-subtitle">Resumo da semana atual</p>
      </div>

      {/* Gráficos */}
      <div className="graficos-container">
        <div className="grafico-card">
          <h3>🔥 Evolução de Calorias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calorias" stroke="#FF6B6B" strokeWidth={2} name="Calorias Consumidas" />
              <Line type="monotone" dataKey="metaCalorias" stroke="#4ECDC4" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-card">
          <h3>💧 Evolução de Água</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="agua" fill="#4A90E2" name="Água Consumida (L)" />
              <Bar dataKey="metaAgua" fill="#50C878" name="Meta (L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="relatorio-resumo">
        <div className="resumo-card">
          <h3>🔥 Média de Calorias</h3>
          <div className="resumo-value">
            {Math.round(mediaCalorias)}
            <span className="resumo-unit">kcal/dia</span>
          </div>
          <div className="resumo-meta">
            Meta: {CALORIA_META} kcal
          </div>
        </div>

        <div className="resumo-card">
          <h3>💧 Média de Água</h3>
          <div className="resumo-value">
            {(mediaAgua / 1000).toFixed(1)}
            <span className="resumo-unit">L/dia</span>
          </div>
          <div className="resumo-meta">
            Meta: {(AGUA_META / 1000).toFixed(1)} L/dia
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
