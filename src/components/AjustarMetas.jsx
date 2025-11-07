import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { LoadingSpinner } from './LoadingSpinner'
import { showToast } from '../utils/toast'
import './AjustarMetas.css'

function AjustarMetas() {
  const [metas, setMetas] = useState({ calorias: 1600, agua: 4000 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadMetas()
  }, [])

  const loadMetas = async () => {
    try {
      setLoading(true)
      const data = await api.buscarMetas()
      setMetas(data)
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
      showToast.error('Erro ao carregar metas')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.atualizarMetas(metas)
      showToast.success('Metas atualizadas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar metas:', error)
      showToast.error('Erro ao salvar metas')
    } finally {
      setSaving(false)
    }
  }

  const handleCaloriasChange = (e) => {
    const value = parseInt(e.target.value) || 0
    setMetas(prev => ({ ...prev, calorias: Math.max(0, value) }))
  }

  const handleAguaChange = (e) => {
    const value = parseInt(e.target.value) || 0
    setMetas(prev => ({ ...prev, agua: Math.max(0, value) }))
  }

  const aplicarPreset = (tipo) => {
    const presets = {
      emagrecimento: { calorias: 1200, agua: 3000 },
      manutencao: { calorias: 2000, agua: 4000 },
      ganho: { calorias: 2500, agua: 4000 },
      ativo: { calorias: 2200, agua: 4500 }
    }
    setMetas(prev => ({ ...prev, ...presets[tipo] }))
  }

  if (loading) {
    return (
      <div className="ajustar-metas-container">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  return (
    <div className="ajustar-metas-container">
      <div className="metas-header">
        <h1>🎯 Ajustar Metas</h1>
        <p>Personalize suas metas diárias de calorias e água</p>
      </div>

      <div className="metas-content">
        <div className="meta-card">
          <div className="meta-header">
            <h2>🔥 Meta de Calorias</h2>
            <span className="meta-value">{metas.calorias} kcal</span>
          </div>
          
          <div className="meta-controls">
            <input
              type="range"
              min="800"
              max="4000"
              step="50"
              value={metas.calorias}
              onChange={handleCaloriasChange}
              className="meta-slider"
            />
            <div className="slider-labels">
              <span>800 kcal</span>
              <span>4000 kcal</span>
            </div>
            
            <div className="input-group">
              <label>Valor exato:</label>
              <input
                type="number"
                min="800"
                max="4000"
                value={metas.calorias}
                onChange={handleCaloriasChange}
                className="meta-input"
              />
              <span className="input-unit">kcal</span>
            </div>
          </div>

          <div className="presets">
            <p>Presets rápidos:</p>
            <div className="preset-buttons">
              <button onClick={() => aplicarPreset('emagrecimento')} className="preset-btn">
                Emagrecimento (1200)
              </button>
              <button onClick={() => aplicarPreset('manutencao')} className="preset-btn">
                Manutenção (2000)
              </button>
              <button onClick={() => aplicarPreset('ganho')} className="preset-btn">
                Ganho (2500)
              </button>
              <button onClick={() => aplicarPreset('ativo')} className="preset-btn">
                Ativo (2200)
              </button>
            </div>
          </div>
        </div>

        <div className="meta-card">
          <div className="meta-header">
            <h2>💧 Meta de Água</h2>
            <span className="meta-value">{(metas.agua / 1000).toFixed(1)} L</span>
          </div>
          
          <div className="meta-controls">
            <input
              type="range"
              min="1000"
              max="8000"
              step="250"
              value={metas.agua}
              onChange={handleAguaChange}
              className="meta-slider"
            />
            <div className="slider-labels">
              <span>1.0 L</span>
              <span>8.0 L</span>
            </div>
            
            <div className="input-group">
              <label>Valor exato:</label>
              <input
                type="number"
                min="1000"
                max="8000"
                step="250"
                value={metas.agua}
                onChange={handleAguaChange}
                className="meta-input"
              />
              <span className="input-unit">ml</span>
            </div>
          </div>

          <div className="presets">
            <p>Presets rápidos:</p>
            <div className="preset-buttons">
              <button onClick={() => setMetas(prev => ({ ...prev, agua: 2000 }))} className="preset-btn">
                2.0 L
              </button>
              <button onClick={() => setMetas(prev => ({ ...prev, agua: 3000 }))} className="preset-btn">
                3.0 L
              </button>
              <button onClick={() => setMetas(prev => ({ ...prev, agua: 4000 }))} className="preset-btn">
                4.0 L
              </button>
              <button onClick={() => setMetas(prev => ({ ...prev, agua: 5000 }))} className="preset-btn">
                5.0 L
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="metas-actions">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="save-button"
        >
          {saving ? 'Salvando...' : '💾 Salvar Metas'}
        </button>
        <button 
          onClick={loadMetas}
          className="reset-button"
        >
          🔄 Restaurar Padrão
        </button>
      </div>
    </div>
  )
}

export default AjustarMetas

