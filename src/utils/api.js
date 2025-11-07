// URL da API - usa variável de ambiente em produção ou localhost em desenvolvimento
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://nome-do-repositorio-2.onrender.com/api' : 'http://localhost:3000/api')

// Obter deviceId
import { getDeviceId } from './deviceId'

// Headers padrão com deviceId
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-device-id': getDeviceId()
  }
}

export const api = {
  // Alimentos
  async buscarAlimentos(search = '') {
    const response = await fetch(`${API_URL}/alimentos${search ? `?search=${encodeURIComponent(search)}` : ''}`)
    return response.json()
  },

  async buscarAlimento(id) {
    const response = await fetch(`${API_URL}/alimentos/${id}`)
    return response.json()
  },

  async calcularCalorias(alimento_id, quantidade, unidade = 'g') {
    const response = await fetch(`${API_URL}/calcular-calorias`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ alimento_id, quantidade, unidade, deviceId: getDeviceId() })
    })
    if (!response.ok) throw new Error('Erro ao calcular calorias')
    return response.json()
  },

  async adicionarAlimento(alimento) {
    const response = await fetch(`${API_URL}/alimentos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ...alimento, deviceId: getDeviceId() })
    })
    if (!response.ok) throw new Error('Erro ao adicionar alimento')
    return response.json()
  },

  // Refeições
  async buscarRefeicoes(data = null) {
    const url = data 
      ? `${API_URL}/refeicoes?data=${data}&deviceId=${getDeviceId()}`
      : `${API_URL}/refeicoes?deviceId=${getDeviceId()}`
    const response = await fetch(url, { headers: getHeaders() })
    if (!response.ok) throw new Error('Erro ao buscar refeições')
    return response.json()
  },

  async adicionarRefeicao(refeicao) {
    const response = await fetch(`${API_URL}/refeicoes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ...refeicao, deviceId: getDeviceId() })
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || 'Erro ao adicionar refeição')
    }
    return response.json()
  },

  async deletarRefeicao(id) {
    const response = await fetch(`${API_URL}/refeicoes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Erro ao deletar refeição')
    return response.json()
  },

  // Água
  async buscarAgua(data = null) {
    const url = data 
      ? `${API_URL}/agua?data=${data}&deviceId=${getDeviceId()}`
      : `${API_URL}/agua?deviceId=${getDeviceId()}`
    const response = await fetch(url, { headers: getHeaders() })
    if (!response.ok) throw new Error('Erro ao buscar água')
    return response.json()
  },

  async adicionarAgua(quantidade, data = null) {
    const body = data ? { quantidade, data, deviceId: getDeviceId() } : { quantidade, deviceId: getDeviceId() }
    const response = await fetch(`${API_URL}/agua`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    })
    if (!response.ok) throw new Error('Erro ao adicionar água')
    return response.json()
  },

  async deletarAgua(id) {
    const response = await fetch(`${API_URL}/agua/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Erro ao deletar água')
    return response.json()
  },

  // Relatório
  async buscarRelatorioSemanal() {
    const response = await fetch(`${API_URL}/relatorio-semanal?deviceId=${getDeviceId()}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Erro ao buscar relatório')
    return response.json()
  },

  // Metas
  async buscarMetas() {
    const response = await fetch(`${API_URL}/metas?deviceId=${getDeviceId()}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Erro ao buscar metas')
    return response.json()
  },

  async atualizarMetas(metas) {
    const response = await fetch(`${API_URL}/metas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ...metas, deviceId: getDeviceId() })
    })
    if (!response.ok) throw new Error('Erro ao atualizar metas')
    return response.json()
  },

  // Histórico
  async buscarRefeicoesPorData(data) {
    return this.buscarRefeicoes(data)
  },

  async buscarAguaPorData(data) {
    return this.buscarAgua(data)
  },

}


