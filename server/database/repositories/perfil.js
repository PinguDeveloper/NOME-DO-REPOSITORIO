import { query } from '../db.js'

// Obter perfil do usuário
export async function getPerfil(deviceId) {
  const result = await query('SELECT * FROM perfil WHERE device_id = $1', [deviceId])
  return result.rows[0] || null
}

// Criar ou atualizar perfil
export async function upsertPerfil(deviceId, { idade, genero, altura, peso, atividade, objetivo }) {
  const result = await query(
    `INSERT INTO perfil (device_id, idade, genero, altura, peso, atividade, objetivo)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (device_id) 
     DO UPDATE SET 
       idade = EXCLUDED.idade,
       genero = EXCLUDED.genero,
       altura = EXCLUDED.altura,
       peso = EXCLUDED.peso,
       atividade = EXCLUDED.atividade,
       objetivo = EXCLUDED.objetivo,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [deviceId, idade, genero, altura, peso, atividade, objetivo]
  )
  return result.rows[0]
}

