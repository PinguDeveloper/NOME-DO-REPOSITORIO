import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import { api } from '../utils/api'
import { LoadingSpinner } from './LoadingSpinner'
import { showToast } from '../utils/toast'
import { format } from 'date-fns'
import TextoPreview from './TextoPreview'
import './CompartilharProgresso.css'

function CompartilharProgresso() {
  const [loading, setLoading] = useState(true)
  const [refeicoes, setRefeicoes] = useState([])
  const [agua, setAgua] = useState({ total: 0, registros: [] })
  const [metas, setMetas] = useState({ calorias: 1600, agua: 4000 })
  const [tipo, setTipo] = useState('dia') // dia, semana
  const shareRef = useRef(null)

  useEffect(() => {
    loadDados()
  }, [])

  const loadDados = async () => {
    try {
      setLoading(true)
      const [refeicoesData, aguaData, metasData] = await Promise.all([
        api.buscarRefeicoes().catch(() => []),
        api.buscarAgua().catch(() => ({ total: 0, registros: [] })),
        api.buscarMetas().catch(() => ({ calorias: 1600, agua: 4000 }))
      ])
      setRefeicoes(refeicoesData)
      setAgua(aguaData)
      setMetas(metasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      showToast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

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

  const gerarTextoCompartilhamento = async () => {
    const totais = calcularTotais()
    const hoje = format(new Date(), 'dd/MM/yyyy')
    
    if (tipo === 'dia') {
      return `📊 Meu Progresso de Hoje (${hoje}):

🔥 Calorias: ${totais.calorias}/${metas.calorias} kcal (${totais.porcentagemCalorias.toFixed(0)}%)
💧 Água: ${(totais.agua / 1000).toFixed(1)}/${(metas.agua / 1000).toFixed(1)}L (${totais.porcentagemAgua.toFixed(0)}%)
🍽️ Refeições: ${totais.refeicoes}

${totais.porcentagemCalorias >= 90 && totais.porcentagemAgua >= 90 ? '🎯 Metas atingidas! 💪' : '💪 Continuando firme!'}

#ControleDeDieta #Saude #Fitness`
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
        
        return `📊 Meu Progresso Semanal:

🔥 Média de Calorias: ${mediaCalorias} kcal/dia
💧 Média de Água: ${mediaAgua}L/dia
🍽️ Total de Refeições: ${totalRefeicoes}

💪 Semana de sucesso! #ControleDeDieta #Saude`
      } catch {
        return `📊 Meu Progresso Semanal:

🔥 Média de Calorias: ${totais.calorias} kcal/dia
💧 Média de Água: ${(totais.agua / 1000).toFixed(1)}L/dia
🍽️ Total de Refeições: ${totais.refeicoes}

💪 Semana de sucesso! #ControleDeDieta #Saude`
      }
    }
  }

  const compartilharTexto = async () => {
    const texto = await gerarTextoCompartilhamento()
    
    if (navigator.share) {
      navigator.share({
        title: 'Meu Progresso de Dieta',
        text: texto
      }).catch(() => {
        copiarParaAreaTransferencia(texto)
      })
    } else {
      copiarParaAreaTransferencia(texto)
    }
  }

  const copiarParaAreaTransferencia = (texto) => {
    navigator.clipboard.writeText(texto).then(() => {
      showToast.success('Texto copiado! Cole onde quiser compartilhar.')
    }).catch(() => {
      showToast.error('Erro ao copiar texto')
    })
  }

  const compartilharImagem = async () => {
    try {
      if (!shareRef.current) return
      
      showToast.info('Gerando imagem...')
      
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#667eea',
        scale: 2,
        logging: false
      })
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'progresso-dieta.png', { type: 'image/png' })
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            navigator.share({
              title: 'Meu Progresso de Dieta',
              text: 'Confira meu progresso!',
              files: [file]
            }).catch(() => {
              downloadImagem(canvas)
            })
          } else {
            downloadImagem(canvas)
          }
        }
      })
    } catch (error) {
      console.error('Erro ao gerar imagem:', error)
      showToast.error('Erro ao gerar imagem')
    }
  }

  const downloadImagem = (canvas) => {
    const link = document.createElement('a')
    link.download = `progresso-dieta-${format(new Date(), 'yyyy-MM-dd')}.png`
    link.href = canvas.toDataURL()
    link.click()
    showToast.success('Imagem baixada! Agora você pode compartilhar.')
  }

  const compartilharWhatsApp = async () => {
    const texto = await gerarTextoCompartilhamento()
    const textoEncoded = encodeURIComponent(texto)
    window.open(`https://wa.me/?text=${textoEncoded}`, '_blank')
  }

  const compartilharInstagram = () => {
    showToast.info('Baixe a imagem primeiro e depois compartilhe no Instagram!')
    compartilharImagem()
  }

  if (loading) {
    return (
      <div className="compartilhar-container">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  const totais = calcularTotais()

  return (
    <div className="compartilhar-container">
      <div className="compartilhar-header">
        <h1>📤 Compartilhar Progresso</h1>
        <p>Compartilhe suas conquistas e inspire outras pessoas!</p>
      </div>

      <div className="tipo-selector">
        <button 
          className={tipo === 'dia' ? 'active' : ''}
          onClick={() => setTipo('dia')}
        >
          📅 Progresso do Dia
        </button>
        <button 
          className={tipo === 'semana' ? 'active' : ''}
          onClick={() => setTipo('semana')}
        >
          📊 Progresso Semanal
        </button>
      </div>

      {/* Preview para imagem (oculto mas renderizado para captura) */}
      <div ref={shareRef} className="share-preview">
        <div className="preview-content">
          <h2>📊 Meu Progresso de {tipo === 'dia' ? 'Hoje' : 'Semana'}</h2>
          <div className="preview-stats">
            <div className="preview-stat">
              <span className="preview-icon">🔥</span>
              <div>
                <p className="preview-label">Calorias</p>
                <p className="preview-value">{totais.calorias}/{metas.calorias} kcal</p>
                <div className="preview-bar">
                  <div 
                    className="preview-fill"
                    style={{ width: `${Math.min(100, totais.porcentagemCalorias)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="preview-stat">
              <span className="preview-icon">💧</span>
              <div>
                <p className="preview-label">Água</p>
                <p className="preview-value">{(totais.agua / 1000).toFixed(1)}/{(metas.agua / 1000).toFixed(1)}L</p>
                <div className="preview-bar">
                  <div 
                    className="preview-fill"
                    style={{ width: `${Math.min(100, totais.porcentagemAgua)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="preview-stat">
              <span className="preview-icon">🍽️</span>
              <div>
                <p className="preview-label">Refeições</p>
                <p className="preview-value">{totais.refeicoes}</p>
              </div>
            </div>
          </div>
          {totais.porcentagemCalorias >= 90 && totais.porcentagemAgua >= 90 && (
            <div className="preview-badge">🎯 Metas Atingidas!</div>
          )}
        </div>
      </div>

      {/* Cards de compartilhamento */}
      <div className="share-cards">
        <div className="share-card">
          <h3>📝 Compartilhar como Texto</h3>
          <p>Copie o texto formatado e cole onde quiser</p>
          <button onClick={compartilharTexto} className="share-btn primary">
            📋 Copiar Texto
          </button>
        </div>

        <div className="share-card">
          <h3>🖼️ Compartilhar como Imagem</h3>
          <p>Gere uma imagem bonita do seu progresso</p>
          <button onClick={compartilharImagem} className="share-btn primary">
            📸 Gerar Imagem
          </button>
        </div>

        <div className="share-card">
          <h3>💬 WhatsApp</h3>
          <p>Compartilhe diretamente no WhatsApp</p>
          <button onClick={compartilharWhatsApp} className="share-btn whatsapp">
            📱 WhatsApp
          </button>
        </div>

        <div className="share-card">
          <h3>📷 Instagram</h3>
          <p>Baixe a imagem e poste no Instagram</p>
          <button onClick={compartilharInstagram} className="share-btn instagram">
            📸 Instagram
          </button>
        </div>
      </div>

      {/* Preview do texto */}
      <TextoPreview tipo={tipo} refeicoes={refeicoes} agua={agua} metas={metas} />
    </div>
  )
}

export default CompartilharProgresso

