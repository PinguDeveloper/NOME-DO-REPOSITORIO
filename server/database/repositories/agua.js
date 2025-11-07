import { query } from '../db.js'

// Criar registro de água
export async function createAgua(deviceId, { data, quantidade }) {
  const result = await query(
    `INSERT INTO agua (device_id, data, quantidade) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [deviceId, data, quantidade]
  )
  return result.rows[0]
}

// Buscar registros de água do dia
export async function getAguaByDate(deviceId, data) {
  const result = await query(
    `SELECT * FROM agua 
     WHERE device_id = $1 AND data = $2 
     ORDER BY timestamp DESC`,
    [deviceId, data]
  )
  
  const registros = result.rows
  const total = registros.reduce((sum, r) => sum + parseInt(r.quantidade), 0)
  
  return { total, registros }
}

// Deletar registro de água
export async function deleteAgua(deviceId, aguaId) {
  const result = await query(
    'DELETE FROM agua WHERE id = $1 AND device_id = $2 RETURNING *',
    [aguaId, deviceId]
  )
  return result.rows.length > 0
}

// Buscar registros de água por período
export async function getAguaByPeriod(deviceId, dataInicio, dataFim) {
  const result = await query(
    `SELECT * FROM agua 
     WHERE device_id = $1 AND data >= $2 AND data <= $3 
     ORDER BY data DESC, timestamp DESC`,
    [deviceId, dataInicio, dataFim]
  )
  return result.rows
}

