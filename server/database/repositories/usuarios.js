import { query } from '../db.js'

// Criar ou obter usuário por deviceId
export async function getOrCreateUsuario(deviceId) {
  // Tentar buscar usuário existente
  let result = await query('SELECT * FROM usuarios WHERE device_id = $1', [deviceId])
  
  if (result.rows.length === 0) {
    // Criar novo usuário
    await query('INSERT INTO usuarios (device_id) VALUES ($1)', [deviceId])
    
    // Criar metas padrão
    await query(
      'INSERT INTO metas (device_id, calorias, agua) VALUES ($1, $2, $3)',
      [deviceId, 1600, 4000]
    )
    
    // Criar streaks padrão
    await query(
      'INSERT INTO streaks (device_id, calorias, agua, ambas) VALUES ($1, $2, $3, $4)',
      [deviceId, 0, 0, 0]
    )
    
    // Buscar usuário criado
    result = await query('SELECT * FROM usuarios WHERE device_id = $1', [deviceId])
  }
  
  return result.rows[0]
}

// Obter metas do usuário
export async function getMetas(deviceId) {
  const result = await query('SELECT * FROM metas WHERE device_id = $1', [deviceId])
  if (result.rows.length === 0) {
    // Criar metas padrão se não existirem
    await query(
      'INSERT INTO metas (device_id, calorias, agua) VALUES ($1, $2, $3)',
      [deviceId, 1600, 4000]
    )
    return { device_id: deviceId, calorias: 1600, agua: 4000 }
  }
  return result.rows[0]
}

// Atualizar metas do usuário
export async function updateMetas(deviceId, { calorias, agua }) {
  await query(
    `UPDATE metas 
     SET calorias = COALESCE($1, calorias), 
         agua = COALESCE($2, agua),
         updated_at = CURRENT_TIMESTAMP
     WHERE device_id = $3`,
    [calorias, agua, deviceId]
  )
  return await getMetas(deviceId)
}

// Obter streaks do usuário
export async function getStreaks(deviceId) {
  const result = await query('SELECT * FROM streaks WHERE device_id = $1', [deviceId])
  if (result.rows.length === 0) {
    await query(
      'INSERT INTO streaks (device_id, calorias, agua, ambas) VALUES ($1, $2, $3, $4)',
      [deviceId, 0, 0, 0]
    )
    return { device_id: deviceId, calorias: 0, agua: 0, ambas: 0 }
  }
  return result.rows[0]
}

// Atualizar streaks do usuário
export async function updateStreaks(deviceId, { calorias, agua, ambas }) {
  await query(
    `UPDATE streaks 
     SET calorias = COALESCE($1, calorias),
         agua = COALESCE($2, agua),
         ambas = COALESCE($3, ambas),
         updated_at = CURRENT_TIMESTAMP
     WHERE device_id = $4`,
    [calorias, agua, ambas, deviceId]
  )
  return await getStreaks(deviceId)
}

