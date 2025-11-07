import pg from 'pg'
const { Pool } = pg

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Testar conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL')
})

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool do PostgreSQL:', err)
  process.exit(-1)
})

// Função helper para executar queries
export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executada', { text, duration, rows: res.rowCount })
    }
    return res
  } catch (error) {
    console.error('Erro na query:', { text, error: error.message })
    throw error
  }
}

// Função para inicializar o banco (criar tabelas se não existirem)
export async function initDatabase() {
  try {
    // Verificar se as tabelas existem
    const result = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'alimentos'
      );
    `)
    
    if (!result.rows[0].exists) {
      console.log('📦 Criando tabelas do banco de dados...')
      // Ler e executar o schema SQL
      const fs = await import('fs')
      const path = await import('path')
      const { fileURLToPath } = await import('url')
      
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const schemaPath = path.join(__dirname, 'schema.sql')
      
      const schema = fs.readFileSync(schemaPath, 'utf8')
      
      // Executar o schema SQL completo
      // O PostgreSQL suporta múltiplas queries em uma única execução
      try {
        await query(schema)
      } catch (error) {
        // Se houver erro, pode ser porque algumas tabelas já existem
        // Tentar executar novamente (CREATE IF NOT EXISTS deve lidar com isso)
        if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
          throw error
        }
      }
      
      console.log('✅ Tabelas criadas com sucesso!')
    } else {
      console.log('✅ Banco de dados já inicializado')
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error)
    throw error
  }
}

// Função para fechar o pool (útil para testes)
export async function closePool() {
  await pool.end()
}

export default pool

