import express from 'express'
import cors from 'cors'
import { initDatabase } from './database/db.js'
import * as alimentosRepo from './database/repositories/alimentos.js'
import * as usuariosRepo from './database/repositories/usuarios.js'
import * as refeicoesRepo from './database/repositories/refeicoes.js'
import * as aguaRepo from './database/repositories/agua.js'
import * as perfilRepo from './database/repositories/perfil.js'

const app = express()
const PORT = process.env.PORT || 3000

// Configurar CORS - permite Netlify e localhost
// Em produção, permite todas as origens para facilitar
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? true // Permite todas as origens em produção
  : [
      'https://dietaapp.netlify.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ]

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())

// Middleware para extrair deviceId
function getDeviceId(req) {
  return req.headers['x-device-id'] || req.body.deviceId || 'default'
}

// Inicializar banco de dados ao iniciar
let dbInitialized = false
async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      await initDatabase()
      await initializeAlimentos()
      dbInitialized = true
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error)
      throw error
    }
  }
}

// Inicializar alimentos padrão
async function initializeAlimentos() {
  const alimentosComuns = [
    // ========== ARROZ E GRÃOS ==========
    { nome: 'Arroz branco cozido', calorias_por_100g: 130, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Arroz integral cozido', calorias_por_100g: 111, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Arroz parboilizado cozido', calorias_por_100g: 123, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Arroz 7 grãos cozido', calorias_por_100g: 108, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Arroz de jasmim cozido', calorias_por_100g: 130, categoria: 'Carboidratos', unidade: 'g' },
    
    // ========== FEIJÕES ==========
    { nome: 'Feijão carioca cozido', calorias_por_100g: 76, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Feijão preto cozido', calorias_por_100g: 77, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Feijão vermelho cozido', calorias_por_100g: 78, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Feijão branco cozido', calorias_por_100g: 62, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Feijão fradinho cozido', calorias_por_100g: 84, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Feijão de corda cozido', calorias_por_100g: 76, categoria: 'Carboidratos', unidade: 'g' },
    
    // ========== MACARRÃO E MASSAS ==========
    { nome: 'Macarrão cozido', calorias_por_100g: 131, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Macarrão integral cozido', calorias_por_100g: 124, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Espaguete cozido', calorias_por_100g: 131, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Lasanha', calorias_por_100g: 132, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Nhoque cozido', calorias_por_100g: 131, categoria: 'Carboidratos', unidade: 'g' },
    
    // ========== BATATAS ==========
    { nome: 'Batata inglesa cozida', calorias_por_100g: 87, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Batata doce cozida', calorias_por_100g: 86, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Batata frita', calorias_por_100g: 267, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Batata assada', calorias_por_100g: 93, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Purê de batata', calorias_por_100g: 83, categoria: 'Carboidratos', unidade: 'g' },
    
    // ========== PÃES ==========
    { nome: 'Pão de forma branco', calorias_por_100g: 265, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Pão integral', calorias_por_100g: 247, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Pão francês', calorias_por_100g: 300, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Pão de centeio', calorias_por_100g: 258, categoria: 'Carboidratos', unidade: 'g' },
    { nome: 'Pão de aveia', calorias_por_100g: 265, categoria: 'Carboidratos', unidade: 'g' },
    
    // ========== CARNES BOVINAS - CORTES ==========
    { nome: 'Alcatra grelhada', calorias_por_100g: 260, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Picanha grelhada', calorias_por_100g: 300, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Maminha grelhada', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Contrafilé grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Filé mignon grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Coxão mole grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Coxão duro grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Patinho grelhado', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Fraldinha grelhada', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Acém grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Paleta grelhada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Peito grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Lagarto grelhado', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
    
    // ========== CARNES BOVINAS - PREPARAÇÕES ==========
    { nome: 'Carne moída', calorias_por_100g: 156, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne moída refogada', calorias_por_100g: 212, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne moída grelhada', calorias_por_100g: 156, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne moída patinho', calorias_por_100g: 150, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne moída acém', calorias_por_100g: 212, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne moída 95% magra', calorias_por_100g: 137, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne moída 90% magra', calorias_por_100g: 176, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne moída 80% magra', calorias_por_100g: 254, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne moída bolonhesa', calorias_por_100g: 223, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne de panela', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne assada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne cozida', calorias_por_100g: 270, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne grelhada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne frita', calorias_por_100g: 320, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne ensopada', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Carne guisada', calorias_por_100g: 290, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Almôndegas', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
    { nome: 'Hambúrguer caseiro', calorias_por_100g: 295, categoria: 'Carnes', unidade: 'g' },
    
    // ========== FRANGO ==========
    { nome: 'Peito de frango grelhado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
    { nome: 'Peito de frango cozido', calorias_por_100g: 170, categoria: 'Aves', unidade: 'g' },
    { nome: 'Peito de frango assado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
    { nome: 'Coxa de frango grelhada', calorias_por_100g: 215, categoria: 'Aves', unidade: 'g' },
    { nome: 'Sobrecoxa de frango grelhada', calorias_por_100g: 200, categoria: 'Aves', unidade: 'g' },
    { nome: 'Asa de frango grelhada', calorias_por_100g: 220, categoria: 'Aves', unidade: 'g' },
    { nome: 'Frango inteiro grelhado', calorias_por_100g: 190, categoria: 'Aves', unidade: 'g' },
    { nome: 'Frango assado', calorias_por_100g: 190, categoria: 'Aves', unidade: 'g' },
    { nome: 'Frango cozido', calorias_por_100g: 170, categoria: 'Aves', unidade: 'g' },
    { nome: 'Frango desfiado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
    { nome: 'Frango à milanesa', calorias_por_100g: 280, categoria: 'Aves', unidade: 'g' },
    
    // ========== PEIXES ==========
    { nome: 'Salmão grelhado', calorias_por_100g: 206, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Salmão assado', calorias_por_100g: 206, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Atum grelhado', calorias_por_100g: 184, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Atum enlatado em água', calorias_por_100g: 116, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Atum enlatado em óleo', calorias_por_100g: 184, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Tilápia grelhada', calorias_por_100g: 128, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Tilápia frita', calorias_por_100g: 200, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Sardinha grelhada', calorias_por_100g: 208, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Sardinha enlatada', calorias_por_100g: 208, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Bacalhau cozido', calorias_por_100g: 105, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Bacalhau grelhado', calorias_por_100g: 105, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Cavala grelhada', calorias_por_100g: 205, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Pescada grelhada', calorias_por_100g: 120, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Dourado grelhado', calorias_por_100g: 140, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Robalo grelhado', calorias_por_100g: 120, categoria: 'Peixes', unidade: 'g' },
    { nome: 'Cação grelhado', calorias_por_100g: 130, categoria: 'Peixes', unidade: 'g' },
    
    // ========== OVOS ==========
    { nome: 'Ovo cozido', calorias_por_100g: 155, categoria: 'Ovos', unidade: 'unidade' },
    { nome: 'Ovo frito', calorias_por_100g: 196, categoria: 'Ovos', unidade: 'unidade' },
    { nome: 'Ovo mexido', calorias_por_100g: 194, categoria: 'Ovos', unidade: 'unidade' },
    { nome: 'Ovo pochê', calorias_por_100g: 143, categoria: 'Ovos', unidade: 'unidade' },
    { nome: 'Omelete simples', calorias_por_100g: 154, categoria: 'Ovos', unidade: 'unidade' },
    { nome: 'Omelete com queijo', calorias_por_100g: 220, categoria: 'Ovos', unidade: 'unidade' },
    
    // ========== QUEIJOS ==========
    { nome: 'Queijo muçarela', calorias_por_100g: 300, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Queijo minas frescal', calorias_por_100g: 320, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Queijo minas padrão', calorias_por_100g: 320, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Queijo prato', calorias_por_100g: 360, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Queijo cheddar', calorias_por_100g: 400, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Queijo parmesão', calorias_por_100g: 431, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Ricota', calorias_por_100g: 140, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Cottage', calorias_por_100g: 98, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Requeijão cremoso', calorias_por_100g: 257, categoria: 'Laticínios', unidade: 'g' },
    
    // ========== LEGUMES E VERDURAS ==========
    { nome: 'Alface', calorias_por_100g: 15, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Tomate', calorias_por_100g: 18, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Tomate cereja', calorias_por_100g: 18, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Cenoura crua', calorias_por_100g: 41, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Cenoura cozida', calorias_por_100g: 35, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Brócolis cozido', calorias_por_100g: 35, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Brócolis refogado', calorias_por_100g: 45, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Couve refogada', calorias_por_100g: 90, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Couve-flor cozida', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Abobrinha cozida', calorias_por_100g: 17, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Berinjela cozida', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Chuchu cozido', calorias_por_100g: 19, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Vagem cozida', calorias_por_100g: 31, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Espinafre refogado', calorias_por_100g: 23, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Repolho cozido', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Rúcula', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Agrião', calorias_por_100g: 16, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Pepino', calorias_por_100g: 16, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Pimentão verde', calorias_por_100g: 20, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Pimentão vermelho', calorias_por_100g: 31, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Cebola refogada', calorias_por_100g: 92, categoria: 'Legumes', unidade: 'g' },
    { nome: 'Alho refogado', calorias_por_100g: 149, categoria: 'Legumes', unidade: 'g' },
    
    // ========== FRUTAS ==========
    { nome: 'Banana prata', calorias_por_100g: 89, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Banana nanica', calorias_por_100g: 92, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Maçã', calorias_por_100g: 52, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Laranja', calorias_por_100g: 47, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Morango', calorias_por_100g: 32, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Abacate', calorias_por_100g: 160, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Mamão', calorias_por_100g: 45, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Manga', calorias_por_100g: 60, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Pera', calorias_por_100g: 57, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Uva', calorias_por_100g: 69, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Melancia', calorias_por_100g: 30, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Melão', calorias_por_100g: 29, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Abacaxi', calorias_por_100g: 48, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Kiwi', calorias_por_100g: 51, categoria: 'Frutas', unidade: 'g' },
    { nome: 'Goiaba', calorias_por_100g: 54, categoria: 'Frutas', unidade: 'g' },
    
    // ========== LÍQUIDOS E BEBIDAS ==========
    { nome: 'Leite integral', calorias_por_100g: 61, categoria: 'Líquidos', unidade: 'ml' },
    { nome: 'Leite desnatado', calorias_por_100g: 34, categoria: 'Líquidos', unidade: 'ml' },
    { nome: 'Leite semidesnatado', calorias_por_100g: 46, categoria: 'Líquidos', unidade: 'ml' },
    { nome: 'Leite de soja', calorias_por_100g: 33, categoria: 'Líquidos', unidade: 'ml' },
    { nome: 'Leite de amêndoas', calorias_por_100g: 17, categoria: 'Líquidos', unidade: 'ml' },
    
    // ========== GORDURAS E ÓLEOS ==========
    { nome: 'Azeite de oliva', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
    { nome: 'Óleo de soja', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
    { nome: 'Óleo de canola', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
    { nome: 'Manteiga', calorias_por_100g: 717, categoria: 'Gorduras', unidade: 'g' },
    { nome: 'Margarina', calorias_por_100g: 720, categoria: 'Gorduras', unidade: 'g' },
    
    // ========== AÇÚCARES E DOCES ==========
    { nome: 'Açúcar refinado', calorias_por_100g: 387, categoria: 'Açúcares', unidade: 'g' },
    { nome: 'Açúcar cristal', calorias_por_100g: 387, categoria: 'Açúcares', unidade: 'g' },
    { nome: 'Mel', calorias_por_100g: 304, categoria: 'Açúcares', unidade: 'g' },
    { nome: 'Açúcar mascavo', calorias_por_100g: 376, categoria: 'Açúcares', unidade: 'g' },
    
    // ========== LATICÍNIOS ADICIONAIS ==========
    { nome: 'Iogurte natural', calorias_por_100g: 59, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Iogurte grego', calorias_por_100g: 100, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Iogurte desnatado', calorias_por_100g: 45, categoria: 'Laticínios', unidade: 'g' },
    { nome: 'Iogurte com frutas', calorias_por_100g: 105, categoria: 'Laticínios', unidade: 'g' },
    
    // ========== CEREAIS E GRÃOS ==========
    { nome: 'Aveia em flocos', calorias_por_100g: 389, categoria: 'Cereais', unidade: 'g' },
    { nome: 'Quinoa cozida', calorias_por_100g: 120, categoria: 'Cereais', unidade: 'g' },
    { nome: 'Couscous cozido', calorias_por_100g: 112, categoria: 'Cereais', unidade: 'g' },
    { nome: 'Milho cozido', calorias_por_100g: 98, categoria: 'Cereais', unidade: 'g' },
    { nome: 'Milho verde enlatado', calorias_por_100g: 97, categoria: 'Cereais', unidade: 'g' },
  ]
  
  await alimentosRepo.initializeAlimentos(alimentosComuns)
}

// Função para calcular TMB (Taxa Metabólica Basal) usando fórmula de Mifflin-St Jeor
function calcularTMB(idade, genero, altura, peso) {
  const base = (10 * peso) + (6.25 * altura) - (5 * idade)
  const tmb = genero === 'masculino' ? base + 5 : base - 161
  return Math.round(tmb)
}

// Função para calcular fator de atividade
function getFatorAtividade(atividade) {
  const fatores = {
    'sedentario': 1.2,
    'leve': 1.375,
    'moderado': 1.55,
    'ativo': 1.725,
    'muito_ativo': 1.9
  }
  return fatores[atividade] || 1.2
}

// Função para calcular meta calórica baseada no objetivo
function calcularMetaCalorica(tmb, fatorAtividade, objetivo) {
  const manutencao = Math.round(tmb * fatorAtividade)
  
  switch (objetivo) {
    case 'emagrecimento':
      return Math.max(1200, manutencao - 500)
    case 'ganho_massa':
      return manutencao + 400
    case 'manutencao':
    default:
      return manutencao
  }
}

// Middleware para garantir que o banco está inicializado
app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized()
    next()
  } catch (error) {
    console.error('Erro ao garantir inicialização do banco:', error)
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados' })
  }
})

// Rotas

// Buscar alimentos
app.get('/api/alimentos', async (req, res) => {
  try {
    const { search } = req.query
    const alimentos = await alimentosRepo.getAllAlimentos(search)
    res.json(alimentos)
  } catch (error) {
    console.error('Erro ao buscar alimentos:', error)
    res.status(500).json({ error: 'Erro ao buscar alimentos' })
  }
})

// Buscar alimento específico
app.get('/api/alimentos/:id', async (req, res) => {
  try {
    const alimento = await alimentosRepo.getAlimentoById(parseInt(req.params.id))
    if (alimento) {
      res.json(alimento)
    } else {
      res.status(404).json({ error: 'Alimento não encontrado' })
    }
  } catch (error) {
    console.error('Erro ao buscar alimento:', error)
    res.status(500).json({ error: 'Erro ao buscar alimento' })
  }
})

// Calcular calorias
app.post('/api/calcular-calorias', async (req, res) => {
  try {
    const { alimento_id, quantidade, unidade } = req.body
    const alimento = await alimentosRepo.getAlimentoById(alimento_id)
    
    if (!alimento) {
      return res.status(404).json({ error: 'Alimento não encontrado' })
    }
    
    let calorias = 0
    
    // Se a unidade for diferente, converter
    if (unidade === 'unidade' && alimento.unidade === 'g') {
      const quantidadeEmGramas = quantidade * 50
      calorias = (alimento.calorias_por_100g / 100) * quantidadeEmGramas
    } else if (unidade === 'ml' && alimento.unidade === 'g') {
      calorias = (alimento.calorias_por_100g / 100) * quantidade
    } else {
      calorias = (alimento.calorias_por_100g / 100) * quantidade
    }
    
    res.json({ calorias: Math.round(calorias) })
  } catch (error) {
    console.error('Erro ao calcular calorias:', error)
    res.status(500).json({ error: 'Erro ao calcular calorias' })
  }
})

// Adicionar refeição
app.post('/api/refeicoes', async (req, res) => {
  try {
    const { data: dataRefeicao, tipo, itens, alimento_id, alimento_nome, quantidade, calorias, calorias_total, notas } = req.body
    const deviceId = getDeviceId(req)
    
    // Garantir que o usuário existe
    await usuariosRepo.getOrCreateUsuario(deviceId)
    
    const data = dataRefeicao || new Date().toISOString().split('T')[0]
    
    // Se tem itens (nova estrutura), usar itens
    if (itens && Array.isArray(itens)) {
      const totalCalorias = calorias_total || itens.reduce((sum, item) => sum + (item.calorias || 0), 0)
      const novaRefeicao = await refeicoesRepo.createRefeicao(deviceId, {
        data,
        tipo,
        itens,
        calorias_total: totalCalorias,
        notas: notas || ''
      })
      return res.json({ id: novaRefeicao.id })
    }
    
    // Compatibilidade com estrutura antiga (um alimento por refeição)
    const itensCompatibilidade = [{
      alimento_id: alimento_id || null,
      alimento_nome: alimento_nome || '',
      quantidade: parseFloat(quantidade) || 0,
      unidade: 'g',
      calorias: parseFloat(calorias) || 0
    }]
    
    const novaRefeicao = await refeicoesRepo.createRefeicao(deviceId, {
      data,
      tipo,
      itens: itensCompatibilidade,
      calorias_total: parseFloat(calorias) || 0,
      notas: notas || ''
    })
    
    res.json({ id: novaRefeicao.id })
  } catch (error) {
    console.error('Erro ao adicionar refeição:', error)
    res.status(500).json({ error: 'Erro ao adicionar refeição' })
  }
})

// Buscar refeições do dia
app.get('/api/refeicoes', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] || req.query.deviceId || 'default'
    const { data: dataQuery } = req.query
    const hoje = dataQuery || new Date().toISOString().split('T')[0]
    
    const refeicoes = await refeicoesRepo.getRefeicoesByDate(deviceId, hoje)
    
    // Converter para formato compatível com o frontend
    const refeicoesFormatadas = refeicoes.map(r => ({
      id: r.id,
      data: r.data,
      tipo: r.tipo,
      itens: r.itens || [],
      calorias_total: parseFloat(r.calorias_total) || 0,
      calorias: parseFloat(r.calorias_total) || 0, // Compatibilidade
      timestamp: r.timestamp,
      notas: r.notas || ''
    }))
    
    res.json(refeicoesFormatadas)
  } catch (error) {
    console.error('Erro ao buscar refeições:', error)
    res.status(500).json({ error: 'Erro ao buscar refeições' })
  }
})

// Deletar refeição
app.delete('/api/refeicoes/:id', async (req, res) => {
  try {
    const deviceId = getDeviceId(req)
    const id = parseInt(req.params.id)
    
    const deletado = await refeicoesRepo.deleteRefeicao(deviceId, id)
    if (deletado) {
      res.json({ success: true })
    } else {
      res.status(404).json({ error: 'Refeição não encontrada' })
    }
  } catch (error) {
    console.error('Erro ao deletar refeição:', error)
    res.status(500).json({ error: 'Erro ao deletar refeição' })
  }
})

// Adicionar água
app.post('/api/agua', async (req, res) => {
  try {
    const { data: dataAgua, quantidade } = req.body
    const deviceId = getDeviceId(req)
    
    // Garantir que o usuário existe
    await usuariosRepo.getOrCreateUsuario(deviceId)
    
    const data = dataAgua || new Date().toISOString().split('T')[0]
    
    const novoRegistro = await aguaRepo.createAgua(deviceId, {
      data,
      quantidade: parseInt(quantidade)
    })
    
    res.json({ id: novoRegistro.id })
  } catch (error) {
    console.error('Erro ao adicionar água:', error)
    res.status(500).json({ error: 'Erro ao adicionar água' })
  }
})

// Buscar água do dia
app.get('/api/agua', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] || req.query.deviceId || 'default'
    const { data: dataQuery } = req.query
    const hoje = dataQuery || new Date().toISOString().split('T')[0]
    
    const { total, registros } = await aguaRepo.getAguaByDate(deviceId, hoje)
    
    res.json({ total, registros })
  } catch (error) {
    console.error('Erro ao buscar água:', error)
    res.status(500).json({ error: 'Erro ao buscar água' })
  }
})

// Deletar registro de água
app.delete('/api/agua/:id', async (req, res) => {
  try {
    const deviceId = getDeviceId(req)
    const id = parseInt(req.params.id)
    
    const deletado = await aguaRepo.deleteAgua(deviceId, id)
    if (deletado) {
      res.json({ success: true })
    } else {
      res.status(404).json({ error: 'Registro não encontrado' })
    }
  } catch (error) {
    console.error('Erro ao deletar água:', error)
    res.status(500).json({ error: 'Erro ao deletar água' })
  }
})

// Relatório semanal
app.get('/api/relatorio-semanal', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] || req.query.deviceId || 'default'
    const metas = await usuariosRepo.getMetas(deviceId)
    const metaCalorias = metas.calorias || 1600
    const metaAgua = metas.agua || 4000
    
    const hoje = new Date()
    const diaSemana = hoje.getDay()
    const diff = hoje.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1)
    const segunda = new Date(hoje.setDate(diff))
    
    const dias = []
    for (let i = 0; i < 7; i++) {
      const data = new Date(segunda)
      data.setDate(data.getDate() + i)
      dias.push(data.toISOString().split('T')[0])
    }
    
    const dados = await Promise.all(dias.map(async (dataDia) => {
      const refeicoes = await refeicoesRepo.getRefeicoesByDate(deviceId, dataDia)
      const { total: totalAgua } = await aguaRepo.getAguaByDate(deviceId, dataDia)
      
      const totalCalorias = refeicoes.reduce((sum, r) => {
        if (r.itens && r.itens.length > 0) {
          return sum + r.itens.reduce((s, item) => s + (parseFloat(item.calorias) || 0), 0)
        }
        return sum + (parseFloat(r.calorias_total) || 0)
      }, 0)
      
      const bateuCalorias = totalCalorias <= metaCalorias && totalCalorias >= metaCalorias * 0.8
      const bateuAgua = totalAgua >= metaAgua
      const bateuAmbas = bateuCalorias && bateuAgua
      
      return {
        data: dataDia,
        totalCalorias,
        totalAgua,
        totalRefeicoes: refeicoes.length,
        bateuCalorias,
        bateuAgua,
        bateuAmbas
      }
    }))
    
    res.json(dados)
  } catch (error) {
    console.error('Erro ao buscar relatório semanal:', error)
    res.status(500).json({ error: 'Erro ao buscar relatório semanal' })
  }
})

// Perfil do usuário
app.get('/api/perfil', async (req, res) => {
  try {
    const deviceId = getDeviceId(req)
    const perfil = await perfilRepo.getPerfil(deviceId)
    
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }
    
    res.json(perfil)
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    res.status(500).json({ error: 'Erro ao buscar perfil' })
  }
})

app.post('/api/perfil', async (req, res) => {
  try {
    const { idade, genero, altura, peso, atividade, objetivo } = req.body
    const deviceId = getDeviceId(req)
    
    // Validação
    if (idade === undefined || idade === null || idade === '') {
      return res.status(400).json({ error: 'Idade é obrigatória' })
    }
    if (!genero || genero === '') {
      return res.status(400).json({ error: 'Gênero é obrigatório' })
    }
    if (altura === undefined || altura === null || altura === '') {
      return res.status(400).json({ error: 'Altura é obrigatória' })
    }
    if (peso === undefined || peso === null || peso === '') {
      return res.status(400).json({ error: 'Peso é obrigatório' })
    }
    if (!atividade || atividade === '') {
      return res.status(400).json({ error: 'Nível de atividade é obrigatório' })
    }
    if (!objetivo || objetivo === '') {
      return res.status(400).json({ error: 'Objetivo é obrigatório' })
    }
    
    // Garantir que o usuário existe
    await usuariosRepo.getOrCreateUsuario(deviceId)
    
    const perfil = await perfilRepo.upsertPerfil(deviceId, {
      idade: parseInt(idade),
      genero,
      altura: parseFloat(altura),
      peso: parseFloat(peso),
      atividade,
      objetivo
    })
    
    res.json({ success: true, perfil })
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)
    res.status(500).json({ error: 'Erro interno do servidor ao salvar perfil' })
  }
})

// Calcular meta calórica
app.get('/api/calcular-meta-calorica', async (req, res) => {
  try {
    const deviceId = getDeviceId(req)
    const perfil = await perfilRepo.getPerfil(deviceId)
    
    if (!perfil || !perfil.idade || !perfil.genero || !perfil.altura || !perfil.peso || !perfil.atividade || !perfil.objetivo) {
      return res.json({ meta: 1600, tmb: 0 })
    }
    
    const { idade, genero, altura, peso, atividade, objetivo } = perfil
    
    const tmb = calcularTMB(idade, genero, altura, peso)
    const fatorAtividade = getFatorAtividade(atividade)
    const meta = calcularMetaCalorica(tmb, fatorAtividade, objetivo)
    
    res.json({ meta, tmb, objetivo, atividade })
  } catch (error) {
    console.error('Erro ao calcular meta:', error)
    res.json({ meta: 1600, tmb: 0 })
  }
})

// Adicionar novo alimento
app.post('/api/alimentos', async (req, res) => {
  try {
    const { nome, calorias_por_100g, categoria, unidade } = req.body
    
    // Verificar se já existe
    const existe = await alimentosRepo.getAlimentoByNome(nome)
    if (existe) {
      return res.status(400).json({ error: 'Alimento já existe' })
    }
    
    const novoAlimento = await alimentosRepo.createAlimento({
      nome,
      calorias_por_100g: parseFloat(calorias_por_100g),
      categoria: categoria || 'Outros',
      unidade: unidade || 'g'
    })
    
    res.json({ id: novoAlimento.id })
  } catch (error) {
    console.error('Erro ao adicionar alimento:', error)
    res.status(500).json({ error: 'Erro ao adicionar alimento' })
  }
})
app.get('/', (req, res) => {
  res.send('✅ API de dieta rodando com sucesso!');
});

// Buscar metas do usuário
app.get('/api/metas', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] || req.query.deviceId || 'default'
    const metas = await usuariosRepo.getMetas(deviceId)
    res.json({ calorias: metas.calorias || 1600, agua: metas.agua || 4000 })
  } catch (error) {
    console.error('Erro ao buscar metas:', error)
    res.status(500).json({ error: 'Erro ao buscar metas' })
  }
})

// Atualizar metas do usuário
app.post('/api/metas', async (req, res) => {
  try {
    const deviceId = getDeviceId(req)
    const { calorias, agua } = req.body
    
    // Garantir que o usuário existe
    await usuariosRepo.getOrCreateUsuario(deviceId)
    
    const metas = await usuariosRepo.updateMetas(deviceId, {
      calorias: calorias !== undefined ? parseInt(calorias) : undefined,
      agua: agua !== undefined ? parseInt(agua) : undefined
    })
    
    res.json({ success: true, metas: { calorias: metas.calorias, agua: metas.agua } })
  } catch (error) {
    console.error('Erro ao atualizar metas:', error)
    res.status(500).json({ error: 'Erro ao atualizar metas' })
  }
})

app.get('/', (req, res) => {
  res.send('✅ API de dieta rodando com sucesso!')
})

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  try {
    await ensureDbInitialized()
    console.log(`📊 Banco de dados PostgreSQL conectado e inicializado`)
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error)
  }
})
