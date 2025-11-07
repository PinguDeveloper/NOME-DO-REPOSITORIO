import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { api } from '../utils/api'

function TextoPreview({ tipo, refeicoes, agua, metas }) {
  const [texto, setTexto] = useState('')

  useEffect(() => {
    gerarTexto()
  }, [tipo, refeicoes, agua, metas])

  const gerarTexto = async () => {
    const calcularTotais = () => {
      const totalCalorias = refeicoes.reduce((sum, r) => {
        if (r.itens && r.itens.length > 0) {
          return sum + r.itens.reduce((s, item) => s + (item.calorias || 0), 0)
        }
        return sum + (r.calorias_total || r.calorias || 0)
      }, 0)
      
      const aguaConsumida = agua.total || 0
      const porcentagemCalorias = (totalCalorias / metas.calorias) * 100
      const porcentagemAgua = (aguaConsumida / metas.agua) * 100
      
      return {
        calorias: totalCalorias,
        agua: aguaConsumida,
        porcentagemCalorias,
        porcentagemAgua,
        refeicoes: refeicoes.length
      }
    }

    const totais = calcularTotais()
    const hoje = format(new Date(), 'dd/MM/yyyy')
    
    if (tipo === 'dia') {
      setTexto(`📊 Meu Progresso de Hoje (${hoje}):

🔥 Calorias: ${totais.calorias}/${metas.calorias} kcal (${totais.porcentagemCalorias.toFixed(0)}%)
💧 Água: ${(totais.agua / 1000).toFixed(1)}/${(metas.agua / 1000).toFixed(1)}L (${totais.porcentagemAgua.toFixed(0)}%)
🍽️ Refeições: ${totais.refeicoes}

${totais.porcentagemCalorias >= 90 && totais.porcentagemAgua >= 90 ? '🎯 Metas atingidas! 💪' : '💪 Continuando firme!'}

#ControleDeDieta #Saude #Fitness`)
    } else {
      // Buscar dados semanais
      try {
        const relatorio = await api.buscarRelatorioSemanal()
        const mediaCalorias = relatorio.length > 0
          ? Math.round(relatorio.reduce((sum, d) => sum + d.totalCalorias, 0) / relatorio.length)
          : 0
        const mediaAgua = relatorio.length > 0
          ? (relatorio.reduce((sum, d) => sum + d.totalAgua, 0) / relatorio.length / 1000).toFixed(1)
          : 0
        const totalRefeicoes = relatorio.reduce((sum, d) => sum + d.totalRefeicoes, 0)
        
        setTexto(`📊 Meu Progresso Semanal:

🔥 Média de Calorias: ${mediaCalorias} kcal/dia
💧 Média de Água: ${mediaAgua}L/dia
🍽️ Total de Refeições: ${totalRefeicoes}

💪 Semana de sucesso! #ControleDeDieta #Saude`)
      } catch {
        setTexto(`📊 Meu Progresso Semanal:

🔥 Média de Calorias: ${totais.calorias} kcal/dia
💧 Média de Água: ${(totais.agua / 1000).toFixed(1)}L/dia
🍽️ Total de Refeições: ${totais.refeicoes}

💪 Semana de sucesso! #ControleDeDieta #Saude`)
      }
    }
  }

  return (
    <div className="text-preview">
      <h3>Preview do Texto:</h3>
      <div className="preview-text-box">
        <pre>{texto || 'Carregando...'}</pre>
      </div>
    </div>
  )
}

export default TextoPreview

