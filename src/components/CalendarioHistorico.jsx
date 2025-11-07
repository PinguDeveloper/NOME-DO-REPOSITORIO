import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { api } from '../utils/api'
import { LoadingSpinner } from './LoadingSpinner'
import { showToast } from '../utils/toast'
import './CalendarioHistorico.css'

function CalendarioHistorico() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [refeicoesPorData, setRefeicoesPorData] = useState({})
  const [aguaPorData, setAguaPorData] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    loadHistorico()
  }, [currentDate])

  const loadHistorico = async () => {
    try {
      setLoading(true)
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      const days = eachDayOfInterval({ start, end })
      
      const promises = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd')
        return Promise.all([
          api.buscarRefeicoesPorData(dateStr).catch(() => []),
          api.buscarAguaPorData(dateStr).catch(() => ({ total: 0, registros: [] }))
        ])
      })

      const results = await Promise.all(promises)
      
      const refeicoes = {}
      const agua = {}
      
      days.forEach((day, index) => {
        const dateStr = format(day, 'yyyy-MM-dd')
        refeicoes[dateStr] = results[index][0]
        agua[dateStr] = results[index][1]
      })
      
      setRefeicoesPorData(refeicoes)
      setAguaPorData(agua)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
      showToast.error('Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getDayData = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const refeicoes = refeicoesPorData[dateStr] || []
    const agua = aguaPorData[dateStr] || { total: 0 }
    
    const totalCalorias = refeicoes.reduce((sum, r) => {
      if (r.itens && r.itens.length > 0) {
        return sum + r.itens.reduce((s, item) => s + (item.calorias || 0), 0)
      }
      return sum + (r.calorias_total || r.calorias || 0)
    }, 0)

    return { refeicoes: refeicoes.length, calorias: totalCalorias, agua: agua.total }
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  if (loading) {
    return (
      <div className="calendario-container">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  return (
    <div className="calendario-container">
      <div className="calendario-header">
        <h1>📅 Histórico de Refeições</h1>
        <div className="calendario-nav">
          <button onClick={() => navigateMonth(-1)} className="nav-btn">←</button>
          <h2>{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</h2>
          <button onClick={() => navigateMonth(1)} className="nav-btn">→</button>
        </div>
      </div>

      <div className="calendario-grid">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="calendario-day-header">{day}</div>
        ))}
        
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="calendario-day empty"></div>
        ))}
        
        {days.map(day => {
          const dayData = getDayData(day)
          const isToday = isSameDay(day, new Date())
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          
          return (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className={`calendario-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayData.refeicoes > 0 ? 'has-data' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="day-number">{format(day, 'd')}</div>
              {dayData.refeicoes > 0 && (
                <div className="day-indicators">
                  <span className="indicator refeicoes">🍽️ {dayData.refeicoes}</span>
                  {dayData.calorias > 0 && (
                    <span className="indicator calorias">🔥 {dayData.calorias}</span>
                  )}
                  {dayData.agua > 0 && (
                    <span className="indicator agua">💧 {(dayData.agua / 1000).toFixed(1)}L</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <div className="calendario-details">
          <h3>Detalhes de {format(selectedDate, 'dd/MM/yyyy')}</h3>
          <div className="details-content">
            {(() => {
              const dateStr = format(selectedDate, 'yyyy-MM-dd')
              const refeicoes = refeicoesPorData[dateStr] || []
              const agua = aguaPorData[dateStr] || { total: 0, registros: [] }
              
              if (refeicoes.length === 0 && agua.total === 0) {
                return <p>Nenhum registro para este dia</p>
              }

              return (
                <>
                  {refeicoes.length > 0 && (
                    <div className="details-section">
                      <h4>Refeições ({refeicoes.length})</h4>
                      {refeicoes.map(r => {
                        const calorias = r.itens && r.itens.length > 0
                          ? r.itens.reduce((sum, item) => sum + item.calorias, 0)
                          : (r.calorias_total || r.calorias || 0)
                        return (
                          <div key={r.id} className="detail-item">
                            <strong>{r.tipo}</strong>: {calorias} kcal
                            {r.notas && <p className="notas">{r.notas}</p>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {agua.total > 0 && (
                    <div className="details-section">
                      <h4>Água: {(agua.total / 1000).toFixed(1)}L</h4>
                      <div className="agua-registros">
                        {agua.registros.map(r => (
                          <div key={r.id} className="detail-item">
                            {new Date(r.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {r.quantidade}ml
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarioHistorico

