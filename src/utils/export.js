// Funções para exportar dados

export function exportToCSV(data, filename = 'dados-dieta') {
  if (!data || data.length === 0) {
    throw new Error('Nenhum dado para exportar')
  }

  // Criar cabeçalhos
  const headers = Object.keys(data[0]).join(',')
  
  // Criar linhas
  const rows = data.map(item => {
    return Object.values(item).map(val => {
      // Escapar vírgulas e aspas
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    }).join(',')
  })

  // Combinar tudo
  const csv = [headers, ...rows].join('\n')
  
  // Criar blob e download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function exportRefeicoesToCSV(refeicoes) {
  const data = refeicoes.map(r => {
    const calorias = r.itens && r.itens.length > 0
      ? r.itens.reduce((sum, item) => sum + item.calorias, 0)
      : (r.calorias_total || r.calorias || 0)
    
    return {
      Data: r.data,
      Tipo: r.tipo,
      Calorias: calorias,
      Itens: r.itens ? r.itens.map(i => `${i.alimento_nome} (${i.quantidade}${i.unidade})`).join('; ') : '',
      Notas: r.notas || ''
    }
  })
  
  exportToCSV(data, 'refeicoes')
}

export async function exportAguaToCSV(agua) {
  const data = agua.registros.map(r => ({
    Data: r.data,
    Hora: new Date(r.timestamp).toLocaleTimeString('pt-BR'),
    Quantidade_ml: r.quantidade
  }))
  
  exportToCSV(data, 'agua')
}

