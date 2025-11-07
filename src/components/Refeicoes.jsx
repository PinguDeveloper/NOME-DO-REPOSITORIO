import { useState, useEffect, useCallback, useMemo } from 'react'
import { api } from '../utils/api'
import { LoadingSpinner } from './LoadingSpinner'
import { showToast } from '../utils/toast'
import { debounce } from '../utils/debounce'
import { SwipeableItem } from './SwipeableItem'
import './Refeicoes.css'

const TIPOS_REFEICAO = ['jejum', 'café da manhã', 'almoço', 'café da tarde', 'jantar']

function Refeicoes() {
  const [refeicoes, setRefeicoes] = useState([])
  const [alimentos, setAlimentos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [metas, setMetas] = useState({ calorias: 1600 })
  
  // Estado para a refeição sendo criada
  const [refeicaoAtual, setRefeicaoAtual] = useState({
    tipo: 'café da manhã',
    itens: [], // Array de alimentos
    notas: '' // Notas/observações
  })
  
  // Estado para adicionar novo item à refeição
  const [novoItem, setNovoItem] = useState({
    alimento_id: null,
    alimento_nome: '',
    quantidade: '',
    unidade: 'g',
    calorias: 0
  })
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadAll = async () => {
      setLoadingData(true)
      try {
        await Promise.all([
          loadRefeicoes(),
          loadAlimentos(),
          api.buscarMetas().then(m => setMetas(m)).catch(() => {})
        ])
      } finally {
        setLoadingData(false)
      }
    }
    loadAll()
    
    const handleFocus = () => {
      loadRefeicoes()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadRefeicoes = async () => {
    try {
      const data = await api.buscarRefeicoes()
      setRefeicoes(data)
    } catch (error) {
      console.error('Erro ao carregar refeições:', error)
      showToast.error('Erro ao carregar refeições')
    }
  }

  const loadAlimentos = async (search = '') => {
    try {
      const data = await api.buscarAlimentos(search)
      setAlimentos(data)
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error)
    }
  }

  const debouncedSearch = useMemo(
    () => debounce(async (term) => {
      if (term.length >= 2) {
        await loadAlimentos(term)
      } else if (term.length === 0) {
        await loadAlimentos()
      }
    }, 300),
    []
  )

  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
    debouncedSearch(term)
  }, [debouncedSearch])

  const handleAlimentoSelect = async (alimento) => {
    setNovoItem({
      ...novoItem,
      alimento_id: alimento.id,
      alimento_nome: alimento.nome,
      unidade: alimento.unidade
    })
    setSearchTerm('')
    setAlimentos([])
    
    // Se já tem quantidade, calcular calorias automaticamente
    if (novoItem.quantidade) {
      await calcularCaloriasAuto(alimento.id, novoItem.quantidade, alimento.unidade)
    }
  }

  const calcularCaloriasAuto = async (alimento_id, quantidade, unidade) => {
    if (!alimento_id || !quantidade) return
    
    try {
      setLoading(true)
      const result = await api.calcularCalorias(alimento_id, parseFloat(quantidade), unidade)
      setNovoItem(prev => ({
        ...prev,
        calorias: result.calorias
      }))
    } catch (error) {
      console.error('Erro ao calcular calorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantidadeChange = async (e) => {
    const quantidade = e.target.value
    const itemAtualizado = {
      ...novoItem,
      quantidade
    }
    setNovoItem(itemAtualizado)
    
    // Calcular calorias automaticamente quando quantidade mudar
    if (novoItem.alimento_id && quantidade) {
      await calcularCaloriasAuto(novoItem.alimento_id, quantidade, novoItem.unidade)
    } else {
      setNovoItem(prev => ({ ...prev, calorias: 0 }))
    }
  }

  // Adicionar item à refeição atual
  const adicionarItemARefeicao = async () => {
    if (!novoItem.alimento_id || !novoItem.quantidade) {
      showToast.warning('Por favor, selecione um alimento e informe a quantidade')
      return
    }

    setLoading(true)
    // Garantir que as calorias estão calculadas
    let calorias = novoItem.calorias
    if (!calorias || calorias === 0) {
      try {
        const result = await api.calcularCalorias(novoItem.alimento_id, parseFloat(novoItem.quantidade), novoItem.unidade)
        calorias = result.calorias
      } catch (error) {
        console.error('Erro ao calcular calorias:', error)
        showToast.error('Erro ao calcular calorias. Tente novamente.')
        setLoading(false)
        return
      }
    }

    const item = {
      id: Date.now(),
      alimento_id: novoItem.alimento_id,
      alimento_nome: novoItem.alimento_nome,
      quantidade: parseFloat(novoItem.quantidade),
      unidade: novoItem.unidade,
      calorias: parseFloat(calorias) || 0
    }

    setRefeicaoAtual(prev => ({
      ...prev,
      itens: [...prev.itens, item]
    }))

    // Limpar formulário de novo item
    setNovoItem({
      alimento_id: null,
      alimento_nome: '',
      quantidade: '',
      unidade: 'g',
      calorias: 0
    })
    setSearchTerm('')
    setLoading(false)
    showToast.success('Item adicionado à refeição!')
  }

  // Remover item da refeição atual
  const removerItemDaRefeicao = (itemId) => {
    setRefeicaoAtual(prev => ({
      ...prev,
      itens: prev.itens.filter(item => item.id !== itemId)
    }))
  }

  // Salvar refeição completa
  const salvarRefeicao = async () => {
    setLoading(true)
    // Se for jejum, não precisa de itens
    if (refeicaoAtual.tipo === 'jejum') {
      try {
        const hoje = new Date().toISOString().split('T')[0]
      await api.adicionarRefeicao({
        data: hoje,
        tipo: refeicaoAtual.tipo,
        itens: [],
        calorias_total: 0,
        notas: refeicaoAtual.notas
      })
        
        await loadRefeicoes()
        resetarFormulario()
        setShowForm(false)
        showToast.success('Jejum registrado com sucesso!')
        setLoading(false)
        return
      } catch (error) {
        console.error('Erro ao salvar jejum:', error)
        showToast.error('Erro ao salvar jejum. Verifique se o servidor está rodando.')
        setLoading(false)
        return
      }
    }

    // Para outras refeições, precisa ter pelo menos 1 item
    if (refeicaoAtual.itens.length === 0) {
      showToast.warning('Por favor, adicione pelo menos um alimento à refeição')
      setLoading(false)
      return
    }

    try {
      const hoje = new Date().toISOString().split('T')[0]
      const caloriasTotal = refeicaoAtual.itens.reduce((sum, item) => sum + item.calorias, 0)
      
      await api.adicionarRefeicao({
        data: hoje,
        tipo: refeicaoAtual.tipo,
        itens: refeicaoAtual.itens,
        calorias_total: caloriasTotal,
        notas: refeicaoAtual.notas
      })
      
      await loadRefeicoes()
      resetarFormulario()
      setShowForm(false)
      showToast.success('Refeição salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar refeição:', error)
      showToast.error('Erro ao salvar refeição. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const resetarFormulario = () => {
    setRefeicaoAtual({
      tipo: 'café da manhã',
      itens: [],
      notas: ''
    })
    setNovoItem({
      alimento_id: null,
      alimento_nome: '',
      quantidade: '',
      unidade: 'g',
      calorias: 0
    })
    setSearchTerm('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta refeição?')) {
      try {
        setLoading(true)
        await api.deletarRefeicao(id)
        await loadRefeicoes()
        showToast.success('Refeição excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar refeição:', error)
        showToast.error('Erro ao deletar refeição')
      } finally {
        setLoading(false)
      }
    }
  }

  const CALORIA_META = metas.calorias

  const totalCalorias = refeicoes.reduce((sum, r) => {
    // Se a refeição tem itens, somar os itens, senão usar calorias_total
    if (r.itens && r.itens.length > 0) {
      return sum + r.itens.reduce((s, item) => s + (item.calorias || 0), 0)
    }
    return sum + (r.calorias_total || r.calorias || 0)
  }, 0)
  
  const caloriasRestantes = totalCalorias > CALORIA_META
    ? 0
    : CALORIA_META - totalCalorias

  const statusCalorias = totalCalorias > CALORIA_META
    ? 'acima'
    : totalCalorias < CALORIA_META * 0.8  // Abaixo de 80% da meta
    ? 'abaixo'
    : 'ok'

  const refeicoesPorTipo = (tipo) => {
    return refeicoes.filter(r => r.tipo === tipo)
  }

  const alimentosFiltrados = alimentos.filter(a => 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10)

  const caloriasTotalRefeicaoAtual = refeicaoAtual.itens.reduce((sum, item) => sum + item.calorias, 0)

  if (loadingData) {
    return (
      <div className="refeicoes-container">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  return (
    <div className="refeicoes-container">
      {loading && <LoadingSpinner fullScreen />}
      <div className="refeicoes-header">
        <h1>🍽️ Cadastro de Refeições</h1>
        <div className="calorias-summary">
          <div className={`calorias-badge ${statusCalorias}`}>
            <span className="calorias-total">{totalCalorias} kcal</span>
            <span className="calorias-info">
              {statusCalorias === 'abaixo' && `Faltam ${caloriasRestantes} kcal para a meta`}
              {statusCalorias === 'ok' && `Meta atingida! (${CALORIA_META} kcal)`}
              {statusCalorias === 'acima' && `Meta ultrapassada em ${totalCalorias - CALORIA_META} kcal`}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => {
          setShowForm(!showForm)
          if (showForm) {
            resetarFormulario()
          }
        }} 
        className="add-button"
      >
        {showForm ? '❌ Cancelar' : '➕ Adicionar Refeição'}
      </button>

      {showForm && (
        <div className="refeicao-form-container">
          <div className="refeicao-form">
            <h2>Nova Refeição</h2>
            
            <div className="form-group">
              <label>Tipo de Refeição</label>
              <select
                value={refeicaoAtual.tipo}
                onChange={(e) => setRefeicaoAtual({ ...refeicaoAtual, tipo: e.target.value })}
                required
              >
                {TIPOS_REFEICAO.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {refeicaoAtual.tipo !== 'jejum' && (
              <>
                <div className="adicionar-item-section">
                  <h3>Adicionar Alimento à Refeição</h3>
                  
                  <div className="form-row">
                    <div className="form-group" style={{ position: 'relative' }}>
                      <label>Alimento</label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          handleSearch(e.target.value)
                        }}
                        placeholder="Digite para buscar alimento..."
                        onFocus={() => {
                          if (alimentos.length === 0) loadAlimentos()
                        }}
                      />
                      {alimentosFiltrados.length > 0 && searchTerm && (
                        <div className="alimentos-dropdown">
                          {alimentosFiltrados.map(alimento => (
                            <div
                              key={alimento.id}
                              className="alimento-item"
                              onClick={() => handleAlimentoSelect(alimento)}
                            >
                              <span className="alimento-nome">{alimento.nome}</span>
                              <span className="alimento-calorias">
                                {alimento.calorias_por_100g} kcal/100{alimento.unidade}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {novoItem.alimento_nome && (
                        <div className="alimento-selecionado">
                          ✅ {novoItem.alimento_nome}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Quantidade</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="number"
                          value={novoItem.quantidade}
                          onChange={handleQuantidadeChange}
                          placeholder="Ex: 100"
                          min="0"
                          step="0.1"
                          style={{ flex: 1 }}
                        />
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                          {novoItem.unidade || 'g'}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Calorias</label>
                      <input
                        type="number"
                        value={novoItem.calorias}
                        readOnly
                        className="calorias-calculadas"
                        style={{ 
                          backgroundColor: novoItem.calorias > 0 ? '#e8f5e9' : '#f5f5f5',
                          fontWeight: '600'
                        }}
                      />
                      {loading && <span style={{ fontSize: '0.8rem', color: '#666' }}>Calculando...</span>}
                    </div>

                    <div className="form-group">
                      <label>&nbsp;</label>
                      <button 
                        type="button"
                        onClick={adicionarItemARefeicao}
                        className="btn-adicionar-item"
                        disabled={!novoItem.alimento_id || !novoItem.quantidade}
                      >
                        ➕ Adicionar à Refeição
                      </button>
                    </div>
                  </div>
                </div>

                {refeicaoAtual.itens.length > 0 && (
                  <div className="itens-refeicao">
                    <h3>Itens da Refeição</h3>
                    <div className="itens-list">
                      {refeicaoAtual.itens.map(item => (
                        <div key={item.id} className="item-card">
                          <div className="item-info">
                            <span className="item-nome">{item.alimento_nome}</span>
                            <span className="item-detalhes">
                              {item.quantidade} {item.unidade} • {item.calorias} kcal
                            </span>
                          </div>
                          <button
                            onClick={() => removerItemDaRefeicao(item.id)}
                            className="btn-remover-item"
                            title="Remover"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="total-refeicao">
                      <strong>Total da Refeição: {caloriasTotalRefeicaoAtual} kcal</strong>
                    </div>
                  </div>
                )}
              </>
            )}

            {refeicaoAtual.tipo === 'jejum' && (
              <div className="jejum-info">
                <p>✅ Jejum registrado - 0 calorias</p>
              </div>
            )}

            <div className="form-group">
              <label>Notas/Observações (opcional)</label>
              <textarea
                value={refeicaoAtual.notas}
                onChange={(e) => setRefeicaoAtual({ ...refeicaoAtual, notas: e.target.value })}
                placeholder="Adicione observações sobre esta refeição..."
                rows="3"
                className="notas-textarea"
              />
            </div>

            <button 
              type="button"
              onClick={salvarRefeicao}
              className="submit-button"
              disabled={refeicaoAtual.tipo !== 'jejum' && refeicaoAtual.itens.length === 0}
            >
              Salvar Refeição
            </button>
          </div>
        </div>
      )}

      <div className="refeicoes-list">
        {TIPOS_REFEICAO.map(tipo => {
          const refeicoesTipo = refeicoesPorTipo(tipo)
          if (refeicoesTipo.length === 0) return null

          return (
            <div key={tipo} className="refeicoes-section">
              <h2 className="section-title">
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </h2>
              <div className="refeicoes-grid">
                {refeicoesTipo.map(refeicao => {
                  // Calcular calorias da refeição
                  const caloriasRefeicao = refeicao.itens && refeicao.itens.length > 0
                    ? refeicao.itens.reduce((sum, item) => sum + (item.calorias || 0), 0)
                    : (refeicao.calorias_total || refeicao.calorias || 0)

                  return (
                    <SwipeableItem
                      key={refeicao.id}
                      onDelete={() => handleDelete(refeicao.id)}
                    >
                      <div className="refeicao-card animated-fade-in">
                        <div className="refeicao-content">
                        {refeicao.tipo === 'jejum' ? (
                          <>
                            <h3>⏰ Jejum</h3>
                            <p className="refeicao-calorias">0 kcal</p>
                          </>
                        ) : refeicao.itens && refeicao.itens.length > 0 ? (
                          <>
                            <h3>Refeição Completa</h3>
                            <div className="itens-resumo">
                              {refeicao.itens.map((item, idx) => (
                                <p key={idx} className="item-resumo">
                                  • {item.alimento_nome}: {item.quantidade} {item.unidade} ({item.calorias} kcal)
                                </p>
                              ))}
                            </div>
                            <p className="refeicao-calorias">
                              🔥 Total: {caloriasRefeicao} kcal
                            </p>
                          </>
                        ) : (
                          <>
                            <h3>{refeicao.alimento_nome || 'Refeição'}</h3>
                            <p className="refeicao-details">
                              📏 {refeicao.quantidade} {refeicao.quantidade?.toString().includes('g') ? '' : 'g'}
                            </p>
                            <p className="refeicao-calorias">
                              🔥 {caloriasRefeicao} kcal
                            </p>
                          </>
                        )}
                      </div>
                        {refeicao.notas && (
                          <p className="refeicao-notas">📝 {refeicao.notas}</p>
                        )}
                      </div>
                    </SwipeableItem>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {refeicoes.length === 0 && (
        <div className="empty-state">
          <p>Nenhuma refeição registrada hoje</p>
          <p>Adicione sua primeira refeição!</p>
        </div>
      )}
    </div>
  )
}

export default Refeicoes
