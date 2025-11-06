// URL da API - usa variável de ambiente em produção ou localhost em desenvolvimento
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://seu-backend.onrender.com/api' : 'http://localhost:3000/api')

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alimento_id, quantidade, unidade })
    })
    return response.json()
  },

  async adicionarAlimento(alimento) {
    const response = await fetch(`${API_URL}/alimentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alimento)
    })
    return response.json()
  },

  // Refeições
  async buscarRefeicoes(data = null) {
    const url = data ? `${API_URL}/refeicoes?data=${data}` : `${API_URL}/refeicoes`
    const response = await fetch(url)
    return response.json()
  },

  async adicionarRefeicao(refeicao) {
    const response = await fetch(`${API_URL}/refeicoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refeicao)
    })
    return response.json()
  },

  async deletarRefeicao(id) {
    const response = await fetch(`${API_URL}/refeicoes/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },

  // Água
  async buscarAgua(data = null) {
    const url = data ? `${API_URL}/agua?data=${data}` : `${API_URL}/agua`
    const response = await fetch(url)
    return response.json()
  },

  async adicionarAgua(quantidade, data = null) {
    const body = data ? { quantidade, data } : { quantidade }
    const response = await fetch(`${API_URL}/agua`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return response.json()
  },

  async deletarAgua(id) {
    const response = await fetch(`${API_URL}/agua/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },

  // Relatório
  async buscarRelatorioSemanal() {
    const response = await fetch(`${API_URL}/relatorio-semanal`)
    return response.json()
  },

  // Perfil do usuário e TMB
  async buscarPerfil() {
    const response = await fetch(`${API_URL}/perfil`)
    if (response.status === 404) return null
    return response.json()
  },

  async salvarPerfil(perfil) {
    const response = await fetch(`${API_URL}/perfil`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perfil)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro ao salvar perfil' }))
      throw new Error(error.error || `Erro ${response.status}: ${response.statusText}`)
    }
    
    return response.json()
  },

  async calcularMetaCalorica() {
    const response = await fetch(`${API_URL}/calcular-meta-calorica`)
    if (!response.ok) {
      // Se houver erro, retornar meta padrão
      return { meta: 1600, tmb: 0 }
    }
    return response.json()
  }
}


