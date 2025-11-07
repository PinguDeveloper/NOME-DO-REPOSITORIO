import { query } from '../db.js'

// Criar refeição
export async function createRefeicao(deviceId, { data, tipo, itens, calorias_total, notas }) {
  const result = await query(
    `INSERT INTO refeicoes (device_id, data, tipo, calorias_total, notas) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [deviceId, data, tipo, calorias_total || 0, notas || '']
  )
  
  const refeicao = result.rows[0]
  
  // Adicionar itens da refeição
  if (itens && Array.isArray(itens) && itens.length > 0) {
    for (const item of itens) {
      await query(
        `INSERT INTO refeicao_itens 
         (refeicao_id, alimento_id, alimento_nome, quantidade, unidade, calorias) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          refeicao.id,
          item.alimento_id || null,
          item.alimento_nome || item.nome || '',
          item.quantidade || 0,
          item.unidade || 'g',
          item.calorias || 0
        ]
      )
    }
  }
  
  return refeicao
}

// Buscar refeições do dia
export async function getRefeicoesByDate(deviceId, data) {
  const result = await query(
    `SELECT r.*, 
            COALESCE(
              json_agg(
                json_build_object(
                  'id', ri.id,
                  'alimento_id', ri.alimento_id,
                  'alimento_nome', ri.alimento_nome,
                  'quantidade', ri.quantidade,
                  'unidade', ri.unidade,
                  'calorias', ri.calorias
                ) ORDER BY ri.id
              ) FILTER (WHERE ri.id IS NOT NULL),
              '[]'::json
            ) as itens
     FROM refeicoes r
     LEFT JOIN refeicao_itens ri ON r.id = ri.refeicao_id
     WHERE r.device_id = $1 AND r.data = $2
     GROUP BY r.id
     ORDER BY r.timestamp DESC`,
    [deviceId, data]
  )
  
  return result.rows.map(row => ({
    ...row,
    itens: row.itens || []
  }))
}

// Deletar refeição
export async function deleteRefeicao(deviceId, refeicaoId) {
  const result = await query(
    'DELETE FROM refeicoes WHERE id = $1 AND device_id = $2 RETURNING *',
    [refeicaoId, deviceId]
  )
  return result.rows.length > 0
}

// Buscar refeições por período (para relatórios)
export async function getRefeicoesByPeriod(deviceId, dataInicio, dataFim) {
  const result = await query(
    `SELECT r.*, 
            COALESCE(
              json_agg(
                json_build_object(
                  'id', ri.id,
                  'alimento_id', ri.alimento_id,
                  'alimento_nome', ri.alimento_nome,
                  'quantidade', ri.quantidade,
                  'unidade', ri.unidade,
                  'calorias', ri.calorias
                ) ORDER BY ri.id
              ) FILTER (WHERE ri.id IS NOT NULL),
              '[]'::json
            ) as itens
     FROM refeicoes r
     LEFT JOIN refeicao_itens ri ON r.id = ri.refeicao_id
     WHERE r.device_id = $1 AND r.data >= $2 AND r.data <= $3
     GROUP BY r.id
     ORDER BY r.data DESC, r.timestamp DESC`,
    [deviceId, dataInicio, dataFim]
  )
  
  return result.rows.map(row => ({
    ...row,
    itens: row.itens || []
  }))
}

