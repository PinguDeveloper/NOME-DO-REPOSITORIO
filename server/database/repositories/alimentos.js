import { query } from '../db.js'

// Buscar todos os alimentos
export async function getAllAlimentos(search = null) {
  if (search) {
    const result = await query(
      `SELECT * FROM alimentos 
       WHERE LOWER(nome) LIKE LOWER($1) 
       ORDER BY nome 
       LIMIT 50`,
      [`%${search}%`]
    )
    return result.rows
  }
  
  const result = await query('SELECT * FROM alimentos ORDER BY nome LIMIT 50')
  return result.rows
}

// Buscar alimento por ID
export async function getAlimentoById(id) {
  const result = await query('SELECT * FROM alimentos WHERE id = $1', [id])
  return result.rows[0] || null
}

// Buscar alimento por nome
export async function getAlimentoByNome(nome) {
  const result = await query(
    'SELECT * FROM alimentos WHERE LOWER(nome) = LOWER($1)',
    [nome]
  )
  return result.rows[0] || null
}

// Criar novo alimento
export async function createAlimento({ nome, calorias_por_100g, categoria, unidade = 'g' }) {
  const result = await query(
    `INSERT INTO alimentos (nome, calorias_por_100g, categoria, unidade) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [nome, calorias_por_100g, categoria, unidade]
  )
  return result.rows[0]
}

// Inicializar alimentos padrão
export async function initializeAlimentos(alimentos) {
  for (const alimento of alimentos) {
    const existe = await getAlimentoByNome(alimento.nome)
    if (!existe) {
      await createAlimento(alimento)
    }
  }
}

