import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { api } from '../utils/api'
import { LoadingSpinner } from './LoadingSpinner'
import { showToast } from '../utils/toast'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import './Estatisticas.css'

const COLORS = ['#667eea', '#764ba2', '#4ECDC4', '#FF6B6B', '#FFA726', '#66BB6A', '#AB47BC']

function Estatisticas() {
  const [loading, setLoading] = useState(true)
  const [refeicoes, setRefeicoes] = useState([]) // Todas as refeições para análise
  const [refeicoesEvolucao, setRefeicoesEvolucao] = useState([]) // Dados formatados para gráficos
  const [agua, setAgua] = useState([])
  const [periodo, setPeriodo] = useState('semana') // semana, mes, mes3

  useEffect(() => {
    loadDados()
  }, [periodo])

  const loadDados = async () => {
    try {
      setLoading(true)
      
      // Calcular range de datas
      const hoje = new Date()
      let inicio, fim
      
      if (periodo === 'semana') {
        inicio = startOfWeek(hoje, { weekStartsOn: 1 })
        fim = endOfWeek(hoje, { weekStartsOn: 1 })
      } else if (periodo === 'mes') {
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
        fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
      } else {
        inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1)
        fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
      }

      const dias = eachDayOfInterval({ start: inicio, end: fim })
      
      // Buscar dados de todos os dias
      const promises = dias.map(dia => {
        const dateStr = format(dia, 'yyyy-MM-dd')
        return Promise.all([
          api.buscarRefeicoesPorData(dateStr).catch(() => []),
          api.buscarAguaPorData(dateStr).catch(() => ({ total: 0, registros: [] }))
        ])
      })

      const results = await Promise.all(promises)
      
      const refeicoesData = []
      const aguaData = []
      const todasRefeicoes = [] // Para análise de alimentos
      
      dias.forEach((dia, index) => {
        const dateStr = format(dia, 'yyyy-MM-dd')
        const [refs, aguaReg] = results[index]
        
        todasRefeicoes.push(...refs) // Adicionar para análise
        
        const totalCalorias = refs.reduce((sum, r) => {
          if (r.itens && r.itens.length > 0) {
            return sum + r.itens.reduce((s, item) => s + (item.calorias || 0), 0)
          }
          return sum + (r.calorias_total || r.calorias || 0)
        }, 0)
        
        refeicoesData.push({
          data: format(dia, 'dd/MM'),
          calorias: totalCalorias,
          refeicoes: refs.length,
          dataOriginal: dateStr
        })
        
        aguaData.push({
          data: format(dia, 'dd/MM'),
          agua: (aguaReg.total || 0) / 1000,
          dataOriginal: dateStr
        })
      })
      
      setRefeicoes(todasRefeicoes) // Todas as refeições para análise
      setRefeicoesEvolucao(refeicoesData) // Dados formatados para gráficos
      setAgua(aguaData)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      showToast.error('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  // Alimentos mais consumidos
  const alimentosMaisConsumidos = () => {
    const alimentos = {}
    
    refeicoes.forEach(r => {
      if (r.itens && r.itens.length > 0) {
        r.itens.forEach(item => {
          const nome = item.alimento_nome
          if (!alimentos[nome]) {
            alimentos[nome] = { nome, vezes: 0, totalCalorias: 0 }
          }
          alimentos[nome].vezes += 1
          alimentos[nome].totalCalorias += item.calorias || 0
        })
      }
    })
    
    return Object.values(alimentos)
      .sort((a, b) => b.vezes - a.vezes)
      .slice(0, 10)
  }

  // Horários preferidos
  const horariosPreferidos = () => {
    const horarios = {
      'Café da Manhã': 0,
      'Almoço': 0,
      'Café da Tarde': 0,
      'Jantar': 0,
      'Jejum': 0
    }
    
    refeicoes.forEach(r => {
      const tipo = r.tipo || 'Outro'
      if (horarios[tipo] !== undefined) {
        horarios[tipo] += 1
      }
    })
    
    return Object.entries(horarios).map(([nome, valor]) => ({ nome, valor }))
  }

  // Médias
  const calcularMedias = () => {
    const totalCalorias = refeicoes.reduce((sum, r) => {
      if (r.itens && r.itens.length > 0) {
        return sum + r.itens.reduce((s, item) => s + (item.calorias || 0), 0)
      }
      return sum + (r.calorias_total || r.calorias || 0)
    }, 0)
    const totalAgua = agua.reduce((sum, a) => sum + (a.agua || 0), 0)
    const totalRefeicoes = refeicoes.length
    const dias = agua.length || 1
    
    return {
      calorias: Math.round(totalCalorias / dias),
      agua: (totalAgua / dias).toFixed(1),
      refeicoes: (totalRefeicoes / dias).toFixed(1)
    }
  }

  // Comparação entre semanas (simplificado - usa dados já carregados)
  const comparacaoSemanas = () => {
    // Para simplificar, vamos usar os dados já carregados
    // Em produção, você poderia buscar dados históricos específicos
    const semanas = []
    
    if (periodo === 'mes3' && agua.length > 0) {
      // Dividir em semanas aproximadas
      const semanasPorMes = Math.ceil(agua.length / 7)
      for (let i = 0; i < Math.min(4, semanasPorMes); i++) {
        const inicio = i * 7
        const fim = Math.min((i + 1) * 7, agua.length)
        
        let totalCal = 0
        let totalAgua = 0
        
        for (let j = inicio; j < fim; j++) {
          if (agua[j]) {
            totalAgua += agua[j].agua || 0
          }
        }
        
        semanas.push({
          semana: `Semana ${i + 1}`,
          calorias: Math.round(totalCal / (fim - inicio)),
          agua: (totalAgua / (fim - inicio)).toFixed(1)
        })
      }
    }
    
    return semanas
  }

  if (loading) {
    return (
      <div className="estatisticas-container">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  const medias = calcularMedias()
  const alimentosTop = alimentosMaisConsumidos()
  const horarios = horariosPreferidos()
  const semanas = comparacaoSemanas()
  
  // Dados para gráficos de evolução (usar dados já formatados)
  const dadosEvolucao = refeicoesEvolucao.map((r, index) => ({
    data: r.data,
    calorias: r.calorias,
    agua: agua[index]?.agua || 0
  }))

  return (
    <div className="estatisticas-container">
      <div className="estatisticas-header">
        <h1>📊 Estatísticas Detalhadas</h1>
        <div className="periodo-selector">
          <button 
            className={periodo === 'semana' ? 'active' : ''}
            onClick={() => setPeriodo('semana')}
          >
            Semana
          </button>
          <button 
            className={periodo === 'mes' ? 'active' : ''}
            onClick={() => setPeriodo('mes')}
          >
            Mês
          </button>
          <button 
            className={periodo === 'mes3' ? 'active' : ''}
            onClick={() => setPeriodo('mes3')}
          >
            3 Meses
          </button>
        </div>
      </div>

      {/* Médias */}
      <div className="medias-cards">
        <div className="media-card">
          <h3>🔥 Média de Calorias</h3>
          <p className="media-value">{medias.calorias}</p>
          <span className="media-unit">kcal/dia</span>
        </div>
        <div className="media-card">
          <h3>💧 Média de Água</h3>
          <p className="media-value">{medias.agua}</p>
          <span className="media-unit">L/dia</span>
        </div>
        <div className="media-card">
          <h3>🍽️ Média de Refeições</h3>
          <p className="media-value">{medias.refeicoes}</p>
          <span className="media-unit">refeições/dia</span>
        </div>
      </div>

      {/* Gráficos de Evolução */}
      <div className="graficos-section">
        <div className="grafico-card">
          <h3>📈 Evolução de Calorias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosEvolucao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calorias" stroke="#FF6B6B" strokeWidth={2} name="Calorias (kcal)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-card">
          <h3>💧 Evolução de Água</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={agua}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="agua" stroke="#4ECDC4" strokeWidth={2} name="Água (L)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alimentos Mais Consumidos */}
      {alimentosTop.length > 0 && (
        <div className="graficos-section">
          <div className="grafico-card">
            <h3>🍽️ Alimentos Mais Consumidos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alimentosTop}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vezes" fill="#667eea" name="Vezes consumido" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grafico-card">
            <h3>⏰ Horários Preferidos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={horarios}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {horarios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Comparação entre Semanas */}
      {periodo === 'mes3' && semanas.length > 0 && (
        <div className="grafico-card">
          <h3>📊 Comparação entre Semanas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={semanas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="calorias" fill="#FF6B6B" name="Calorias (kcal)" />
              <Bar yAxisId="right" dataKey="agua" fill="#4ECDC4" name="Água (L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Lista de Alimentos */}
      {alimentosTop.length > 0 && (
        <div className="alimentos-list">
          <h3>🏆 Top 10 Alimentos Mais Consumidos</h3>
          <div className="alimentos-grid">
            {alimentosTop.map((alimento, index) => (
              <div key={alimento.nome} className="alimento-stat-card">
                <div className="alimento-rank">#{index + 1}</div>
                <div className="alimento-info">
                  <h4>{alimento.nome}</h4>
                  <p>{alimento.vezes} vezes</p>
                  <p className="calorias-total">{Math.round(alimento.totalCalorias)} kcal total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Estatisticas

