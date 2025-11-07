import { useState } from 'react'
import { api } from '../utils/api'
import { exportRefeicoesToCSV, exportAguaToCSV } from '../utils/export'
import { showToast } from '../utils/toast'
import './ExportarDados.css'

function ExportarDados() {
  const [loading, setLoading] = useState(false)

  const handleExportRefeicoes = async () => {
    try {
      setLoading(true)
      const refeicoes = await api.buscarRefeicoes()
      if (refeicoes.length === 0) {
        showToast.warning('Nenhuma refeição para exportar')
        return
      }
      await exportRefeicoesToCSV(refeicoes)
      showToast.success('Refeições exportadas com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar:', error)
      showToast.error('Erro ao exportar refeições')
    } finally {
      setLoading(false)
    }
  }

  const handleExportAgua = async () => {
    try {
      setLoading(true)
      const agua = await api.buscarAgua()
      if (!agua.registros || agua.registros.length === 0) {
        showToast.warning('Nenhum registro de água para exportar')
        return
      }
      await exportAguaToCSV(agua)
      showToast.success('Registros de água exportados com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar:', error)
      showToast.error('Erro ao exportar água')
    } finally {
      setLoading(false)
    }
  }

  const handleExportAll = async () => {
    try {
      setLoading(true)
      const [refeicoes, agua] = await Promise.all([
        api.buscarRefeicoes(),
        api.buscarAgua()
      ])
      
      if (refeicoes.length > 0) {
        await exportRefeicoesToCSV(refeicoes)
      }
      
      if (agua.registros && agua.registros.length > 0) {
        await exportAguaToCSV(agua)
      }
      
      if (refeicoes.length === 0 && (!agua.registros || agua.registros.length === 0)) {
        showToast.warning('Nenhum dado para exportar')
        return
      }
      
      showToast.success('Todos os dados exportados com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar:', error)
      showToast.error('Erro ao exportar dados')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="exportar-container">
      <div className="exportar-header">
        <h1>📥 Exportar Dados</h1>
        <p>Exporte seus dados de dieta em formato CSV</p>
      </div>

      <div className="exportar-options">
        <div className="export-card">
          <h3>🍽️ Refeições</h3>
          <p>Exporte todas as suas refeições registradas</p>
          <button 
            onClick={handleExportRefeicoes}
            disabled={loading}
            className="export-btn"
          >
            {loading ? 'Exportando...' : '📥 Exportar Refeições'}
          </button>
        </div>

        <div className="export-card">
          <h3>💧 Água</h3>
          <p>Exporte todos os registros de água</p>
          <button 
            onClick={handleExportAgua}
            disabled={loading}
            className="export-btn"
          >
            {loading ? 'Exportando...' : '📥 Exportar Água'}
          </button>
        </div>

        <div className="export-card">
          <h3>📦 Todos os Dados</h3>
          <p>Exporte refeições e água em arquivos separados</p>
          <button 
            onClick={handleExportAll}
            disabled={loading}
            className="export-btn primary"
          >
            {loading ? 'Exportando...' : '📥 Exportar Tudo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportarDados

