import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Caminho para o arquivo de dados JSON
const DATA_FILE = join(__dirname, 'data.json')

// Funções para ler e escrever dados
function readData() {
  if (!existsSync(DATA_FILE)) {
    return {
      alimentos: [],
      refeicoes: [],
      agua: [],
      perfil: null
    }
  }
  try {
    const data = readFileSync(DATA_FILE, 'utf8')
    const parsed = JSON.parse(data)
    // Garantir que perfil existe
    if (!parsed.perfil) parsed.perfil = null
    return parsed
  } catch (error) {
    return {
      alimentos: [],
      refeicoes: [],
      agua: [],
      perfil: null
    }
  }
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

// Banco de dados completo com valores calóricos confiáveis
// Baseado em TACO, USDA e tabelas nutricionais brasileiras
function initializeAlimentos() {
  const data = readData()
  
  if (data.alimentos.length === 0) {
    const alimentosComuns = [
      // ========== ARROZ E GRÃOS ==========
      // Baseado em FatSecret.com.br
      { id: 1, nome: 'Arroz branco cozido', calorias_por_100g: 130, categoria: 'Carboidratos', unidade: 'g' },
      { id: 2, nome: 'Arroz integral cozido', calorias_por_100g: 111, categoria: 'Carboidratos', unidade: 'g' },
      { id: 3, nome: 'Arroz parboilizado cozido', calorias_por_100g: 123, categoria: 'Carboidratos', unidade: 'g' },
      { id: 4, nome: 'Arroz 7 grãos cozido', calorias_por_100g: 108, categoria: 'Carboidratos', unidade: 'g' },
      { id: 5, nome: 'Arroz de jasmim cozido', calorias_por_100g: 130, categoria: 'Carboidratos', unidade: 'g' },
      
      // ========== FEIJÕES ==========
      // Baseado em FatSecret.com.br
      { id: 46, nome: 'Feijão carioca cozido', calorias_por_100g: 76, categoria: 'Carboidratos', unidade: 'g' },
      { id: 47, nome: 'Feijão preto cozido', calorias_por_100g: 77, categoria: 'Carboidratos', unidade: 'g' },
      { id: 48, nome: 'Feijão vermelho cozido', calorias_por_100g: 78, categoria: 'Carboidratos', unidade: 'g' },
      { id: 49, nome: 'Feijão branco cozido', calorias_por_100g: 62, categoria: 'Carboidratos', unidade: 'g' },
      { id: 50, nome: 'Feijão fradinho cozido', calorias_por_100g: 84, categoria: 'Carboidratos', unidade: 'g' },
      { id: 51, nome: 'Feijão de corda cozido', calorias_por_100g: 76, categoria: 'Carboidratos', unidade: 'g' },
      
      // ========== MACARRÃO E MASSAS ==========
      // Baseado em FatSecret.com.br
      { id: 6, nome: 'Macarrão cozido', calorias_por_100g: 131, categoria: 'Carboidratos', unidade: 'g' },
      { id: 7, nome: 'Macarrão integral cozido', calorias_por_100g: 124, categoria: 'Carboidratos', unidade: 'g' },
      { id: 8, nome: 'Espaguete cozido', calorias_por_100g: 131, categoria: 'Carboidratos', unidade: 'g' },
      { id: 9, nome: 'Lasanha', calorias_por_100g: 132, categoria: 'Carboidratos', unidade: 'g' },
      { id: 10, nome: 'Nhoque cozido', calorias_por_100g: 131, categoria: 'Carboidratos', unidade: 'g' },
      
      // ========== BATATAS ==========
      // Baseado em FatSecret.com.br
      { id: 11, nome: 'Batata inglesa cozida', calorias_por_100g: 87, categoria: 'Carboidratos', unidade: 'g' },
      { id: 12, nome: 'Batata doce cozida', calorias_por_100g: 86, categoria: 'Carboidratos', unidade: 'g' },
      { id: 13, nome: 'Batata frita', calorias_por_100g: 267, categoria: 'Carboidratos', unidade: 'g' },
      { id: 14, nome: 'Batata assada', calorias_por_100g: 93, categoria: 'Carboidratos', unidade: 'g' },
      { id: 15, nome: 'Purê de batata', calorias_por_100g: 83, categoria: 'Carboidratos', unidade: 'g' },
      
      // ========== PÃES ==========
      // Baseado em FatSecret.com.br
      { id: 16, nome: 'Pão de forma branco', calorias_por_100g: 265, categoria: 'Carboidratos', unidade: 'g' },
      { id: 17, nome: 'Pão integral', calorias_por_100g: 247, categoria: 'Carboidratos', unidade: 'g' },
      { id: 18, nome: 'Pão francês', calorias_por_100g: 300, categoria: 'Carboidratos', unidade: 'g' },
      { id: 19, nome: 'Pão de centeio', calorias_por_100g: 258, categoria: 'Carboidratos', unidade: 'g' },
      { id: 20, nome: 'Pão de aveia', calorias_por_100g: 265, categoria: 'Carboidratos', unidade: 'g' },
      
      // ========== CARNES BOVINAS - CORTES ==========
      // Baseado em FatSecret.com.br
      { id: 100, nome: 'Alcatra grelhada', calorias_por_100g: 260, categoria: 'Carnes', unidade: 'g' },
      { id: 101, nome: 'Picanha grelhada', calorias_por_100g: 300, categoria: 'Carnes', unidade: 'g' },
      { id: 102, nome: 'Maminha grelhada', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
      { id: 103, nome: 'Contrafilé grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 104, nome: 'Filé mignon grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 105, nome: 'Coxão mole grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 106, nome: 'Coxão duro grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 107, nome: 'Patinho grelhado', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
      { id: 108, nome: 'Fraldinha grelhada', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
      { id: 109, nome: 'Acém grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 110, nome: 'Paleta grelhada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 111, nome: 'Peito grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 112, nome: 'Lagarto grelhado', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
      
      // ========== CARNES BOVINAS - PREPARAÇÕES ==========
      // Baseado em FatSecret.com.br - https://www.fatsecret.com.br
      { id: 113, nome: 'Carne moída', calorias_por_100g: 156, categoria: 'Carnes', unidade: 'g' },
      { id: 114, nome: 'Carne moída refogada', calorias_por_100g: 212, categoria: 'Carnes', unidade: 'g' },
      { id: 125, nome: 'Carne moída grelhada', calorias_por_100g: 156, categoria: 'Carnes', unidade: 'g' },
      { id: 126, nome: 'Carne moída patinho', calorias_por_100g: 150, categoria: 'Carnes', unidade: 'g' },
      { id: 127, nome: 'Carne moída acém', calorias_por_100g: 212, categoria: 'Carnes', unidade: 'g' },
      { id: 128, nome: 'Carne moída 95% magra', calorias_por_100g: 137, categoria: 'Carnes', unidade: 'g' },
      { id: 129, nome: 'Carne moída 90% magra', calorias_por_100g: 176, categoria: 'Carnes', unidade: 'g' },
      { id: 130, nome: 'Carne moída 80% magra', calorias_por_100g: 254, categoria: 'Carnes', unidade: 'g' },
      { id: 131, nome: 'Carne moída bolonhesa', calorias_por_100g: 223, categoria: 'Carnes', unidade: 'g' },
      { id: 115, nome: 'Carne de panela', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
      { id: 116, nome: 'Carne assada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 117, nome: 'Carne cozida', calorias_por_100g: 270, categoria: 'Carnes', unidade: 'g' },
      { id: 118, nome: 'Carne grelhada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
      { id: 119, nome: 'Carne frita', calorias_por_100g: 320, categoria: 'Carnes', unidade: 'g' },
      { id: 120, nome: 'Carne ensopada', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
      { id: 121, nome: 'Carne guisada', calorias_por_100g: 290, categoria: 'Carnes', unidade: 'g' },
      { id: 122, nome: 'Almôndegas', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
      { id: 123, nome: 'Hambúrguer caseiro', calorias_por_100g: 295, categoria: 'Carnes', unidade: 'g' },
      
      // ========== FRANGO ==========
      // Baseado em FatSecret.com.br
      { id: 200, nome: 'Peito de frango grelhado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
      { id: 201, nome: 'Peito de frango cozido', calorias_por_100g: 170, categoria: 'Aves', unidade: 'g' },
      { id: 202, nome: 'Peito de frango assado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
      { id: 203, nome: 'Coxa de frango grelhada', calorias_por_100g: 215, categoria: 'Aves', unidade: 'g' },
      { id: 204, nome: 'Sobrecoxa de frango grelhada', calorias_por_100g: 200, categoria: 'Aves', unidade: 'g' },
      { id: 205, nome: 'Asa de frango grelhada', calorias_por_100g: 220, categoria: 'Aves', unidade: 'g' },
      { id: 206, nome: 'Frango inteiro grelhado', calorias_por_100g: 190, categoria: 'Aves', unidade: 'g' },
      { id: 207, nome: 'Frango assado', calorias_por_100g: 190, categoria: 'Aves', unidade: 'g' },
      { id: 208, nome: 'Frango cozido', calorias_por_100g: 170, categoria: 'Aves', unidade: 'g' },
      { id: 209, nome: 'Frango desfiado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
      { id: 210, nome: 'Frango à milanesa', calorias_por_100g: 280, categoria: 'Aves', unidade: 'g' },
      
      // ========== PEIXES ==========
      // Baseado em FatSecret.com.br
      { id: 300, nome: 'Salmão grelhado', calorias_por_100g: 206, categoria: 'Peixes', unidade: 'g' },
      { id: 301, nome: 'Salmão assado', calorias_por_100g: 206, categoria: 'Peixes', unidade: 'g' },
      { id: 302, nome: 'Atum grelhado', calorias_por_100g: 184, categoria: 'Peixes', unidade: 'g' },
      { id: 303, nome: 'Atum enlatado em água', calorias_por_100g: 116, categoria: 'Peixes', unidade: 'g' },
      { id: 304, nome: 'Atum enlatado em óleo', calorias_por_100g: 184, categoria: 'Peixes', unidade: 'g' },
      { id: 305, nome: 'Tilápia grelhada', calorias_por_100g: 128, categoria: 'Peixes', unidade: 'g' },
      { id: 306, nome: 'Tilápia frita', calorias_por_100g: 200, categoria: 'Peixes', unidade: 'g' },
      { id: 307, nome: 'Sardinha grelhada', calorias_por_100g: 208, categoria: 'Peixes', unidade: 'g' },
      { id: 308, nome: 'Sardinha enlatada', calorias_por_100g: 208, categoria: 'Peixes', unidade: 'g' },
      { id: 309, nome: 'Bacalhau cozido', calorias_por_100g: 105, categoria: 'Peixes', unidade: 'g' },
      { id: 310, nome: 'Bacalhau grelhado', calorias_por_100g: 105, categoria: 'Peixes', unidade: 'g' },
      { id: 311, nome: 'Cavala grelhada', calorias_por_100g: 205, categoria: 'Peixes', unidade: 'g' },
      { id: 312, nome: 'Pescada grelhada', calorias_por_100g: 120, categoria: 'Peixes', unidade: 'g' },
      { id: 313, nome: 'Dourado grelhado', calorias_por_100g: 140, categoria: 'Peixes', unidade: 'g' },
      { id: 314, nome: 'Robalo grelhado', calorias_por_100g: 120, categoria: 'Peixes', unidade: 'g' },
      { id: 315, nome: 'Cação grelhado', calorias_por_100g: 130, categoria: 'Peixes', unidade: 'g' },
      
      // ========== OVOS ==========
      // Baseado em FatSecret.com.br - valores por unidade (ovo médio ~50g)
      { id: 400, nome: 'Ovo cozido', calorias_por_100g: 155, categoria: 'Ovos', unidade: 'unidade' },
      { id: 401, nome: 'Ovo frito', calorias_por_100g: 196, categoria: 'Ovos', unidade: 'unidade' },
      { id: 402, nome: 'Ovo mexido', calorias_por_100g: 194, categoria: 'Ovos', unidade: 'unidade' },
      { id: 403, nome: 'Ovo pochê', calorias_por_100g: 143, categoria: 'Ovos', unidade: 'unidade' },
      { id: 404, nome: 'Omelete simples', calorias_por_100g: 154, categoria: 'Ovos', unidade: 'unidade' },
      { id: 405, nome: 'Omelete com queijo', calorias_por_100g: 220, categoria: 'Ovos', unidade: 'unidade' },
      
      // ========== QUEIJOS ==========
      // Baseado em FatSecret.com.br
      { id: 500, nome: 'Queijo muçarela', calorias_por_100g: 300, categoria: 'Laticínios', unidade: 'g' },
      { id: 501, nome: 'Queijo minas frescal', calorias_por_100g: 320, categoria: 'Laticínios', unidade: 'g' },
      { id: 502, nome: 'Queijo minas padrão', calorias_por_100g: 320, categoria: 'Laticínios', unidade: 'g' },
      { id: 503, nome: 'Queijo prato', calorias_por_100g: 360, categoria: 'Laticínios', unidade: 'g' },
      { id: 504, nome: 'Queijo cheddar', calorias_por_100g: 400, categoria: 'Laticínios', unidade: 'g' },
      { id: 505, nome: 'Queijo parmesão', calorias_por_100g: 431, categoria: 'Laticínios', unidade: 'g' },
      { id: 506, nome: 'Ricota', calorias_por_100g: 140, categoria: 'Laticínios', unidade: 'g' },
      { id: 507, nome: 'Cottage', calorias_por_100g: 98, categoria: 'Laticínios', unidade: 'g' },
      { id: 508, nome: 'Requeijão cremoso', calorias_por_100g: 257, categoria: 'Laticínios', unidade: 'g' },
      
      // ========== LEGUMES E VERDURAS ==========
      // Baseado em FatSecret.com.br
      { id: 600, nome: 'Alface', calorias_por_100g: 15, categoria: 'Legumes', unidade: 'g' },
      { id: 601, nome: 'Tomate', calorias_por_100g: 18, categoria: 'Legumes', unidade: 'g' },
      { id: 602, nome: 'Tomate cereja', calorias_por_100g: 18, categoria: 'Legumes', unidade: 'g' },
      { id: 603, nome: 'Cenoura crua', calorias_por_100g: 41, categoria: 'Legumes', unidade: 'g' },
      { id: 604, nome: 'Cenoura cozida', calorias_por_100g: 35, categoria: 'Legumes', unidade: 'g' },
      { id: 605, nome: 'Brócolis cozido', calorias_por_100g: 35, categoria: 'Legumes', unidade: 'g' },
      { id: 606, nome: 'Brócolis refogado', calorias_por_100g: 45, categoria: 'Legumes', unidade: 'g' },
      { id: 607, nome: 'Couve refogada', calorias_por_100g: 90, categoria: 'Legumes', unidade: 'g' },
      { id: 608, nome: 'Couve-flor cozida', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
      { id: 609, nome: 'Abobrinha cozida', calorias_por_100g: 17, categoria: 'Legumes', unidade: 'g' },
      { id: 610, nome: 'Berinjela cozida', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
      { id: 611, nome: 'Chuchu cozido', calorias_por_100g: 19, categoria: 'Legumes', unidade: 'g' },
      { id: 612, nome: 'Vagem cozida', calorias_por_100g: 31, categoria: 'Legumes', unidade: 'g' },
      { id: 613, nome: 'Espinafre refogado', calorias_por_100g: 23, categoria: 'Legumes', unidade: 'g' },
      { id: 614, nome: 'Repolho cozido', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
      { id: 615, nome: 'Rúcula', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
      { id: 616, nome: 'Agrião', calorias_por_100g: 16, categoria: 'Legumes', unidade: 'g' },
      { id: 617, nome: 'Pepino', calorias_por_100g: 16, categoria: 'Legumes', unidade: 'g' },
      { id: 618, nome: 'Pimentão verde', calorias_por_100g: 20, categoria: 'Legumes', unidade: 'g' },
      { id: 619, nome: 'Pimentão vermelho', calorias_por_100g: 31, categoria: 'Legumes', unidade: 'g' },
      { id: 620, nome: 'Cebola refogada', calorias_por_100g: 92, categoria: 'Legumes', unidade: 'g' },
      { id: 621, nome: 'Alho refogado', calorias_por_100g: 149, categoria: 'Legumes', unidade: 'g' },
      
      // ========== FRUTAS ==========
      // Baseado em FatSecret.com.br
      { id: 700, nome: 'Banana prata', calorias_por_100g: 89, categoria: 'Frutas', unidade: 'g' },
      { id: 701, nome: 'Banana nanica', calorias_por_100g: 92, categoria: 'Frutas', unidade: 'g' },
      { id: 702, nome: 'Maçã', calorias_por_100g: 52, categoria: 'Frutas', unidade: 'g' },
      { id: 703, nome: 'Laranja', calorias_por_100g: 47, categoria: 'Frutas', unidade: 'g' },
      { id: 704, nome: 'Morango', calorias_por_100g: 32, categoria: 'Frutas', unidade: 'g' },
      { id: 705, nome: 'Abacate', calorias_por_100g: 160, categoria: 'Frutas', unidade: 'g' },
      { id: 706, nome: 'Mamão', calorias_por_100g: 45, categoria: 'Frutas', unidade: 'g' },
      { id: 707, nome: 'Manga', calorias_por_100g: 60, categoria: 'Frutas', unidade: 'g' },
      { id: 708, nome: 'Pera', calorias_por_100g: 57, categoria: 'Frutas', unidade: 'g' },
      { id: 709, nome: 'Uva', calorias_por_100g: 69, categoria: 'Frutas', unidade: 'g' },
      { id: 710, nome: 'Melancia', calorias_por_100g: 30, categoria: 'Frutas', unidade: 'g' },
      { id: 711, nome: 'Melão', calorias_por_100g: 29, categoria: 'Frutas', unidade: 'g' },
      { id: 712, nome: 'Abacaxi', calorias_por_100g: 48, categoria: 'Frutas', unidade: 'g' },
      { id: 713, nome: 'Kiwi', calorias_por_100g: 51, categoria: 'Frutas', unidade: 'g' },
      { id: 714, nome: 'Goiaba', calorias_por_100g: 54, categoria: 'Frutas', unidade: 'g' },
      
      // ========== LÍQUIDOS E BEBIDAS ==========
      // Baseado em FatSecret.com.br
      { id: 800, nome: 'Leite integral', calorias_por_100g: 61, categoria: 'Líquidos', unidade: 'ml' },
      { id: 801, nome: 'Leite desnatado', calorias_por_100g: 34, categoria: 'Líquidos', unidade: 'ml' },
      { id: 802, nome: 'Leite semidesnatado', calorias_por_100g: 46, categoria: 'Líquidos', unidade: 'ml' },
      { id: 803, nome: 'Leite de soja', calorias_por_100g: 33, categoria: 'Líquidos', unidade: 'ml' },
      { id: 804, nome: 'Leite de amêndoas', calorias_por_100g: 17, categoria: 'Líquidos', unidade: 'ml' },
      
      // ========== GORDURAS E ÓLEOS ==========
      // Baseado em FatSecret.com.br
      { id: 900, nome: 'Azeite de oliva', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
      { id: 901, nome: 'Óleo de soja', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
      { id: 902, nome: 'Óleo de canola', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
      { id: 903, nome: 'Manteiga', calorias_por_100g: 717, categoria: 'Gorduras', unidade: 'g' },
      { id: 904, nome: 'Margarina', calorias_por_100g: 720, categoria: 'Gorduras', unidade: 'g' },
      
      // ========== AÇÚCARES E DOCES ==========
      // Baseado em FatSecret.com.br
      { id: 1000, nome: 'Açúcar refinado', calorias_por_100g: 387, categoria: 'Açúcares', unidade: 'g' },
      { id: 1001, nome: 'Açúcar cristal', calorias_por_100g: 387, categoria: 'Açúcares', unidade: 'g' },
      { id: 1002, nome: 'Mel', calorias_por_100g: 304, categoria: 'Açúcares', unidade: 'g' },
      { id: 1003, nome: 'Açúcar mascavo', calorias_por_100g: 376, categoria: 'Açúcares', unidade: 'g' },
      
      // ========== LATICÍNIOS ADICIONAIS ==========
      // Baseado em FatSecret.com.br
      { id: 1100, nome: 'Iogurte natural', calorias_por_100g: 59, categoria: 'Laticínios', unidade: 'g' },
      { id: 1101, nome: 'Iogurte grego', calorias_por_100g: 100, categoria: 'Laticínios', unidade: 'g' },
      { id: 1102, nome: 'Iogurte desnatado', calorias_por_100g: 45, categoria: 'Laticínios', unidade: 'g' },
      { id: 1103, nome: 'Iogurte com frutas', calorias_por_100g: 105, categoria: 'Laticínios', unidade: 'g' },
      
      // ========== CEREAIS E GRÃOS ==========
      // Baseado em FatSecret.com.br
      { id: 1200, nome: 'Aveia em flocos', calorias_por_100g: 389, categoria: 'Cereais', unidade: 'g' },
      { id: 1201, nome: 'Quinoa cozida', calorias_por_100g: 120, categoria: 'Cereais', unidade: 'g' },
      { id: 1202, nome: 'Couscous cozido', calorias_por_100g: 112, categoria: 'Cereais', unidade: 'g' },
      { id: 1203, nome: 'Milho cozido', calorias_por_100g: 98, categoria: 'Cereais', unidade: 'g' },
      { id: 1204, nome: 'Milho verde enlatado', calorias_por_100g: 97, categoria: 'Cereais', unidade: 'g' },
    ]
    
    data.alimentos = alimentosComuns
    writeData(data)
  }
}

// Adicionar novos alimentos se não existirem
function adicionarNovosAlimentos() {
  const data = readData()
  
  // Lista completa de novos alimentos para adicionar
  const novosAlimentos = [
    // Arroz
    { id: 3, nome: 'Arroz parboilizado cozido', calorias_por_100g: 123, categoria: 'Carboidratos', unidade: 'g' },
    { id: 4, nome: 'Arroz 7 grãos cozido', calorias_por_100g: 108, categoria: 'Carboidratos', unidade: 'g' },
    { id: 5, nome: 'Arroz de jasmim cozido', calorias_por_100g: 130, categoria: 'Carboidratos', unidade: 'g' },
    
    // Feijões
    { id: 49, nome: 'Feijão branco cozido', calorias_por_100g: 62, categoria: 'Carboidratos', unidade: 'g' },
    { id: 50, nome: 'Feijão fradinho cozido', calorias_por_100g: 84, categoria: 'Carboidratos', unidade: 'g' },
    { id: 51, nome: 'Feijão de corda cozido', calorias_por_100g: 76, categoria: 'Carboidratos', unidade: 'g' },
    
    // Macarrão
    { id: 7, nome: 'Macarrão integral cozido', calorias_por_100g: 124, categoria: 'Carboidratos', unidade: 'g' },
    { id: 8, nome: 'Espaguete cozido', calorias_por_100g: 131, categoria: 'Carboidratos', unidade: 'g' },
    { id: 9, nome: 'Lasanha', calorias_por_100g: 132, categoria: 'Carboidratos', unidade: 'g' },
    { id: 10, nome: 'Nhoque cozido', calorias_por_100g: 131, categoria: 'Carboidratos', unidade: 'g' },
    
    // Batatas
    { id: 11, nome: 'Batata inglesa cozida', calorias_por_100g: 87, categoria: 'Carboidratos', unidade: 'g' },
    { id: 13, nome: 'Batata frita', calorias_por_100g: 267, categoria: 'Carboidratos', unidade: 'g' },
    { id: 14, nome: 'Batata assada', calorias_por_100g: 93, categoria: 'Carboidratos', unidade: 'g' },
    { id: 15, nome: 'Purê de batata', calorias_por_100g: 83, categoria: 'Carboidratos', unidade: 'g' },
    
    // Pães
    { id: 18, nome: 'Pão francês', calorias_por_100g: 300, categoria: 'Carboidratos', unidade: 'g' },
    { id: 19, nome: 'Pão de centeio', calorias_por_100g: 258, categoria: 'Carboidratos', unidade: 'g' },
    { id: 20, nome: 'Pão de aveia', calorias_por_100g: 265, categoria: 'Carboidratos', unidade: 'g' },
    
    // Carnes bovinas - cortes
    { id: 100, nome: 'Alcatra grelhada', calorias_por_100g: 260, categoria: 'Carnes', unidade: 'g' },
    { id: 101, nome: 'Picanha grelhada', calorias_por_100g: 300, categoria: 'Carnes', unidade: 'g' },
    { id: 102, nome: 'Maminha grelhada', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
    { id: 103, nome: 'Contrafilé grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 104, nome: 'Filé mignon grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 105, nome: 'Coxão mole grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 106, nome: 'Coxão duro grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 107, nome: 'Patinho grelhado', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
    { id: 108, nome: 'Fraldinha grelhada', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
    { id: 109, nome: 'Acém grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 110, nome: 'Paleta grelhada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 111, nome: 'Peito grelhado', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 112, nome: 'Lagarto grelhado', calorias_por_100g: 240, categoria: 'Carnes', unidade: 'g' },
    
    // Carnes bovinas - preparações (baseado em FatSecret.com.br)
    { id: 113, nome: 'Carne moída', calorias_por_100g: 156, categoria: 'Carnes', unidade: 'g' },
    { id: 114, nome: 'Carne moída refogada', calorias_por_100g: 212, categoria: 'Carnes', unidade: 'g' },
    { id: 125, nome: 'Carne moída grelhada', calorias_por_100g: 156, categoria: 'Carnes', unidade: 'g' },
    { id: 126, nome: 'Carne moída patinho', calorias_por_100g: 150, categoria: 'Carnes', unidade: 'g' },
    { id: 127, nome: 'Carne moída acém', calorias_por_100g: 212, categoria: 'Carnes', unidade: 'g' },
    { id: 128, nome: 'Carne moída 95% magra', calorias_por_100g: 137, categoria: 'Carnes', unidade: 'g' },
    { id: 129, nome: 'Carne moída 90% magra', calorias_por_100g: 176, categoria: 'Carnes', unidade: 'g' },
    { id: 130, nome: 'Carne moída 80% magra', calorias_por_100g: 254, categoria: 'Carnes', unidade: 'g' },
    { id: 131, nome: 'Carne moída bolonhesa', calorias_por_100g: 223, categoria: 'Carnes', unidade: 'g' },
    { id: 115, nome: 'Carne de panela', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
    { id: 116, nome: 'Carne assada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 117, nome: 'Carne cozida', calorias_por_100g: 270, categoria: 'Carnes', unidade: 'g' },
    { id: 118, nome: 'Carne grelhada', calorias_por_100g: 250, categoria: 'Carnes', unidade: 'g' },
    { id: 119, nome: 'Carne frita', calorias_por_100g: 320, categoria: 'Carnes', unidade: 'g' },
    { id: 120, nome: 'Carne ensopada', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
    { id: 121, nome: 'Carne guisada', calorias_por_100g: 290, categoria: 'Carnes', unidade: 'g' },
    { id: 122, nome: 'Almôndegas', calorias_por_100g: 280, categoria: 'Carnes', unidade: 'g' },
    { id: 123, nome: 'Hambúrguer caseiro', calorias_por_100g: 295, categoria: 'Carnes', unidade: 'g' },
    
    // Frango
    { id: 200, nome: 'Peito de frango grelhado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
    { id: 201, nome: 'Peito de frango cozido', calorias_por_100g: 170, categoria: 'Aves', unidade: 'g' },
    { id: 202, nome: 'Peito de frango assado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
    { id: 203, nome: 'Coxa de frango grelhada', calorias_por_100g: 215, categoria: 'Aves', unidade: 'g' },
    { id: 204, nome: 'Sobrecoxa de frango grelhada', calorias_por_100g: 200, categoria: 'Aves', unidade: 'g' },
    { id: 205, nome: 'Asa de frango grelhada', calorias_por_100g: 220, categoria: 'Aves', unidade: 'g' },
    { id: 206, nome: 'Frango inteiro grelhado', calorias_por_100g: 190, categoria: 'Aves', unidade: 'g' },
    { id: 207, nome: 'Frango assado', calorias_por_100g: 190, categoria: 'Aves', unidade: 'g' },
    { id: 208, nome: 'Frango cozido', calorias_por_100g: 170, categoria: 'Aves', unidade: 'g' },
    { id: 209, nome: 'Frango desfiado', calorias_por_100g: 165, categoria: 'Aves', unidade: 'g' },
    { id: 210, nome: 'Frango à milanesa', calorias_por_100g: 280, categoria: 'Aves', unidade: 'g' },
    
    // Peixes
    { id: 300, nome: 'Salmão grelhado', calorias_por_100g: 206, categoria: 'Peixes', unidade: 'g' },
    { id: 301, nome: 'Salmão assado', calorias_por_100g: 206, categoria: 'Peixes', unidade: 'g' },
    { id: 302, nome: 'Atum grelhado', calorias_por_100g: 184, categoria: 'Peixes', unidade: 'g' },
    { id: 303, nome: 'Atum enlatado em água', calorias_por_100g: 116, categoria: 'Peixes', unidade: 'g' },
    { id: 304, nome: 'Atum enlatado em óleo', calorias_por_100g: 184, categoria: 'Peixes', unidade: 'g' },
    { id: 305, nome: 'Tilápia grelhada', calorias_por_100g: 128, categoria: 'Peixes', unidade: 'g' },
    { id: 306, nome: 'Tilápia frita', calorias_por_100g: 200, categoria: 'Peixes', unidade: 'g' },
    { id: 307, nome: 'Sardinha grelhada', calorias_por_100g: 208, categoria: 'Peixes', unidade: 'g' },
    { id: 308, nome: 'Sardinha enlatada', calorias_por_100g: 208, categoria: 'Peixes', unidade: 'g' },
    { id: 309, nome: 'Bacalhau cozido', calorias_por_100g: 105, categoria: 'Peixes', unidade: 'g' },
    { id: 310, nome: 'Bacalhau grelhado', calorias_por_100g: 105, categoria: 'Peixes', unidade: 'g' },
    { id: 311, nome: 'Cavala grelhada', calorias_por_100g: 205, categoria: 'Peixes', unidade: 'g' },
    { id: 312, nome: 'Pescada grelhada', calorias_por_100g: 120, categoria: 'Peixes', unidade: 'g' },
    { id: 313, nome: 'Dourado grelhado', calorias_por_100g: 140, categoria: 'Peixes', unidade: 'g' },
    { id: 314, nome: 'Robalo grelhado', calorias_por_100g: 120, categoria: 'Peixes', unidade: 'g' },
    { id: 315, nome: 'Cação grelhado', calorias_por_100g: 130, categoria: 'Peixes', unidade: 'g' },
    
    // Ovos
    { id: 400, nome: 'Ovo cozido', calorias_por_100g: 155, categoria: 'Ovos', unidade: 'unidade' },
    { id: 401, nome: 'Ovo frito', calorias_por_100g: 196, categoria: 'Ovos', unidade: 'unidade' },
    { id: 402, nome: 'Ovo mexido', calorias_por_100g: 194, categoria: 'Ovos', unidade: 'unidade' },
    { id: 403, nome: 'Ovo pochê', calorias_por_100g: 143, categoria: 'Ovos', unidade: 'unidade' },
    { id: 404, nome: 'Omelete simples', calorias_por_100g: 154, categoria: 'Ovos', unidade: 'unidade' },
    { id: 405, nome: 'Omelete com queijo', calorias_por_100g: 220, categoria: 'Ovos', unidade: 'unidade' },
    
    // Queijos
    { id: 500, nome: 'Queijo muçarela', calorias_por_100g: 300, categoria: 'Laticínios', unidade: 'g' },
    { id: 501, nome: 'Queijo minas frescal', calorias_por_100g: 320, categoria: 'Laticínios', unidade: 'g' },
    { id: 502, nome: 'Queijo minas padrão', calorias_por_100g: 320, categoria: 'Laticínios', unidade: 'g' },
    { id: 503, nome: 'Queijo prato', calorias_por_100g: 360, categoria: 'Laticínios', unidade: 'g' },
    { id: 504, nome: 'Queijo cheddar', calorias_por_100g: 400, categoria: 'Laticínios', unidade: 'g' },
    { id: 505, nome: 'Queijo parmesão', calorias_por_100g: 431, categoria: 'Laticínios', unidade: 'g' },
    { id: 506, nome: 'Ricota', calorias_por_100g: 140, categoria: 'Laticínios', unidade: 'g' },
    { id: 507, nome: 'Cottage', calorias_por_100g: 98, categoria: 'Laticínios', unidade: 'g' },
    { id: 508, nome: 'Requeijão cremoso', calorias_por_100g: 257, categoria: 'Laticínios', unidade: 'g' },
    
    // Legumes e verduras
    { id: 600, nome: 'Alface', calorias_por_100g: 15, categoria: 'Legumes', unidade: 'g' },
    { id: 601, nome: 'Tomate', calorias_por_100g: 18, categoria: 'Legumes', unidade: 'g' },
    { id: 602, nome: 'Tomate cereja', calorias_por_100g: 18, categoria: 'Legumes', unidade: 'g' },
    { id: 603, nome: 'Cenoura crua', calorias_por_100g: 41, categoria: 'Legumes', unidade: 'g' },
    { id: 604, nome: 'Cenoura cozida', calorias_por_100g: 35, categoria: 'Legumes', unidade: 'g' },
    { id: 605, nome: 'Brócolis cozido', calorias_por_100g: 35, categoria: 'Legumes', unidade: 'g' },
    { id: 606, nome: 'Brócolis refogado', calorias_por_100g: 45, categoria: 'Legumes', unidade: 'g' },
    { id: 607, nome: 'Couve refogada', calorias_por_100g: 90, categoria: 'Legumes', unidade: 'g' },
    { id: 608, nome: 'Couve-flor cozida', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
    { id: 609, nome: 'Abobrinha cozida', calorias_por_100g: 17, categoria: 'Legumes', unidade: 'g' },
    { id: 610, nome: 'Berinjela cozida', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
    { id: 611, nome: 'Chuchu cozido', calorias_por_100g: 19, categoria: 'Legumes', unidade: 'g' },
    { id: 612, nome: 'Vagem cozida', calorias_por_100g: 31, categoria: 'Legumes', unidade: 'g' },
    { id: 613, nome: 'Espinafre refogado', calorias_por_100g: 23, categoria: 'Legumes', unidade: 'g' },
    { id: 614, nome: 'Repolho cozido', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
    { id: 615, nome: 'Rúcula', calorias_por_100g: 25, categoria: 'Legumes', unidade: 'g' },
    { id: 616, nome: 'Agrião', calorias_por_100g: 16, categoria: 'Legumes', unidade: 'g' },
    { id: 617, nome: 'Pepino', calorias_por_100g: 16, categoria: 'Legumes', unidade: 'g' },
    { id: 618, nome: 'Pimentão verde', calorias_por_100g: 20, categoria: 'Legumes', unidade: 'g' },
    { id: 619, nome: 'Pimentão vermelho', calorias_por_100g: 31, categoria: 'Legumes', unidade: 'g' },
    { id: 620, nome: 'Cebola refogada', calorias_por_100g: 92, categoria: 'Legumes', unidade: 'g' },
    { id: 621, nome: 'Alho refogado', calorias_por_100g: 149, categoria: 'Legumes', unidade: 'g' },
    
    // Frutas
    { id: 700, nome: 'Banana prata', calorias_por_100g: 89, categoria: 'Frutas', unidade: 'g' },
    { id: 701, nome: 'Banana nanica', calorias_por_100g: 92, categoria: 'Frutas', unidade: 'g' },
    { id: 702, nome: 'Maçã', calorias_por_100g: 52, categoria: 'Frutas', unidade: 'g' },
    { id: 703, nome: 'Laranja', calorias_por_100g: 47, categoria: 'Frutas', unidade: 'g' },
    { id: 704, nome: 'Morango', calorias_por_100g: 32, categoria: 'Frutas', unidade: 'g' },
    { id: 705, nome: 'Abacate', calorias_por_100g: 160, categoria: 'Frutas', unidade: 'g' },
    { id: 706, nome: 'Mamão', calorias_por_100g: 45, categoria: 'Frutas', unidade: 'g' },
    { id: 707, nome: 'Manga', calorias_por_100g: 60, categoria: 'Frutas', unidade: 'g' },
    { id: 708, nome: 'Pera', calorias_por_100g: 57, categoria: 'Frutas', unidade: 'g' },
    { id: 709, nome: 'Uva', calorias_por_100g: 69, categoria: 'Frutas', unidade: 'g' },
    { id: 710, nome: 'Melancia', calorias_por_100g: 30, categoria: 'Frutas', unidade: 'g' },
    { id: 711, nome: 'Melão', calorias_por_100g: 29, categoria: 'Frutas', unidade: 'g' },
    { id: 712, nome: 'Abacaxi', calorias_por_100g: 48, categoria: 'Frutas', unidade: 'g' },
    { id: 713, nome: 'Kiwi', calorias_por_100g: 51, categoria: 'Frutas', unidade: 'g' },
    { id: 714, nome: 'Goiaba', calorias_por_100g: 54, categoria: 'Frutas', unidade: 'g' },
    
    // Líquidos
    { id: 800, nome: 'Leite integral', calorias_por_100g: 61, categoria: 'Líquidos', unidade: 'ml' },
    { id: 801, nome: 'Leite desnatado', calorias_por_100g: 34, categoria: 'Líquidos', unidade: 'ml' },
    { id: 802, nome: 'Leite semidesnatado', calorias_por_100g: 46, categoria: 'Líquidos', unidade: 'ml' },
    { id: 803, nome: 'Leite de soja', calorias_por_100g: 33, categoria: 'Líquidos', unidade: 'ml' },
    { id: 804, nome: 'Leite de amêndoas', calorias_por_100g: 17, categoria: 'Líquidos', unidade: 'ml' },
    
    // Gorduras
    { id: 900, nome: 'Azeite de oliva', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
    { id: 901, nome: 'Óleo de soja', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
    { id: 902, nome: 'Óleo de canola', calorias_por_100g: 884, categoria: 'Gorduras', unidade: 'ml' },
    { id: 903, nome: 'Manteiga', calorias_por_100g: 717, categoria: 'Gorduras', unidade: 'g' },
    { id: 904, nome: 'Margarina', calorias_por_100g: 720, categoria: 'Gorduras', unidade: 'g' },
    
    // Açúcares
    { id: 1000, nome: 'Açúcar refinado', calorias_por_100g: 387, categoria: 'Açúcares', unidade: 'g' },
    { id: 1001, nome: 'Açúcar cristal', calorias_por_100g: 387, categoria: 'Açúcares', unidade: 'g' },
    { id: 1002, nome: 'Mel', calorias_por_100g: 304, categoria: 'Açúcares', unidade: 'g' },
    { id: 1003, nome: 'Açúcar mascavo', calorias_por_100g: 376, categoria: 'Açúcares', unidade: 'g' },
    
    // Laticínios
    { id: 1100, nome: 'Iogurte natural', calorias_por_100g: 59, categoria: 'Laticínios', unidade: 'g' },
    { id: 1101, nome: 'Iogurte grego', calorias_por_100g: 100, categoria: 'Laticínios', unidade: 'g' },
    { id: 1102, nome: 'Iogurte desnatado', calorias_por_100g: 45, categoria: 'Laticínios', unidade: 'g' },
    { id: 1103, nome: 'Iogurte com frutas', calorias_por_100g: 105, categoria: 'Laticínios', unidade: 'g' },
    
    // Cereais
    { id: 1200, nome: 'Aveia em flocos', calorias_por_100g: 389, categoria: 'Cereais', unidade: 'g' },
    { id: 1201, nome: 'Quinoa cozida', calorias_por_100g: 120, categoria: 'Cereais', unidade: 'g' },
    { id: 1202, nome: 'Couscous cozido', calorias_por_100g: 112, categoria: 'Cereais', unidade: 'g' },
    { id: 1203, nome: 'Milho cozido', calorias_por_100g: 98, categoria: 'Cereais', unidade: 'g' },
    { id: 1204, nome: 'Milho verde enlatado', calorias_por_100g: 97, categoria: 'Cereais', unidade: 'g' },
  ]
  
  let adicionouAlgo = false
  novosAlimentos.forEach(novoAlimento => {
    const existe = data.alimentos.find(a => a.id === novoAlimento.id || a.nome.toLowerCase() === novoAlimento.nome.toLowerCase())
    if (!existe) {
      data.alimentos.push(novoAlimento)
      adicionouAlgo = true
    }
  })
  
  if (adicionouAlgo) {
    writeData(data)
  }
}

// Inicializar dados
initializeAlimentos()
adicionarNovosAlimentos()

// Rotas

// Buscar alimentos
app.get('/api/alimentos', (req, res) => {
  const data = readData()
  const { search } = req.query
  
  let alimentos = data.alimentos
  
  if (search) {
    alimentos = alimentos.filter(a => 
      a.nome.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  res.json(alimentos.slice(0, 50))
})

// Buscar alimento específico
app.get('/api/alimentos/:id', (req, res) => {
  const data = readData()
  const alimento = data.alimentos.find(a => a.id === parseInt(req.params.id))
  
  if (alimento) {
    res.json(alimento)
  } else {
    res.status(404).json({ error: 'Alimento não encontrado' })
  }
})

// Calcular calorias
app.post('/api/calcular-calorias', (req, res) => {
  const { alimento_id, quantidade, unidade } = req.body
  const data = readData()
  
  const alimento = data.alimentos.find(a => a.id === alimento_id)
  if (!alimento) {
    return res.status(404).json({ error: 'Alimento não encontrado' })
  }
  
  let calorias = 0
  
  // Se a unidade for diferente, converter
  if (unidade === 'unidade' && alimento.unidade === 'g') {
    // Aproximação: 1 unidade = 50g para ovos, etc
    const quantidadeEmGramas = quantidade * 50
    calorias = (alimento.calorias_por_100g / 100) * quantidadeEmGramas
  } else if (unidade === 'ml' && alimento.unidade === 'g') {
    // 1ml ≈ 1g para a maioria dos líquidos
    calorias = (alimento.calorias_por_100g / 100) * quantidade
  } else {
    // Mesma unidade ou conversão simples
    calorias = (alimento.calorias_por_100g / 100) * quantidade
  }
  
  res.json({ calorias: Math.round(calorias) })
})

// Adicionar refeição
app.post('/api/refeicoes', (req, res) => {
  const { data: dataRefeicao, tipo, itens, alimento_id, alimento_nome, quantidade, calorias, calorias_total } = req.body
  const data = readData()
  
  // Se tem itens (nova estrutura), usar itens
  if (itens && Array.isArray(itens)) {
    const novaRefeicao = {
      id: Date.now(),
      data: dataRefeicao || new Date().toISOString().split('T')[0],
      tipo,
      itens: itens,
      calorias_total: calorias_total || itens.reduce((sum, item) => sum + (item.calorias || 0), 0),
      timestamp: new Date().toISOString()
    }
    
    data.refeicoes.push(novaRefeicao)
    writeData(data)
    return res.json({ id: novaRefeicao.id })
  }
  
  // Compatibilidade com estrutura antiga (um alimento por refeição)
  const novaRefeicao = {
    id: Date.now(),
    data: dataRefeicao || new Date().toISOString().split('T')[0],
    tipo,
    alimento_id,
    alimento_nome,
    quantidade: parseFloat(quantidade),
    calorias: parseFloat(calorias),
    timestamp: new Date().toISOString()
  }
  
  data.refeicoes.push(novaRefeicao)
  writeData(data)
  
  res.json({ id: novaRefeicao.id })
})

// Buscar refeições do dia
app.get('/api/refeicoes', (req, res) => {
  const data = readData()
  const { data: dataQuery } = req.query
  const hoje = dataQuery || new Date().toISOString().split('T')[0]
  
  const refeicoes = data.refeicoes
    .filter(r => r.data === hoje)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  
  res.json(refeicoes)
})

// Deletar refeição
app.delete('/api/refeicoes/:id', (req, res) => {
  const data = readData()
  const id = parseInt(req.params.id)
  
  const index = data.refeicoes.findIndex(r => r.id === id)
  if (index !== -1) {
    data.refeicoes.splice(index, 1)
    writeData(data)
    res.json({ success: true })
  } else {
    res.status(404).json({ error: 'Refeição não encontrada' })
  }
})

// Adicionar água
app.post('/api/agua', (req, res) => {
  const { data: dataAgua, quantidade } = req.body
  const data = readData()
  
  const novoRegistro = {
    id: Date.now(),
    data: dataAgua || new Date().toISOString().split('T')[0],
    quantidade: parseInt(quantidade),
    timestamp: new Date().toISOString()
  }
  
  data.agua.push(novoRegistro)
  writeData(data)
  
  res.json({ id: novoRegistro.id })
})

// Buscar água do dia
app.get('/api/agua', (req, res) => {
  const data = readData()
  const { data: dataQuery } = req.query
  const hoje = dataQuery || new Date().toISOString().split('T')[0]
  
  const registros = data.agua
    .filter(a => a.data === hoje)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  
  const total = registros.reduce((sum, r) => sum + r.quantidade, 0)
  
  res.json({ total, registros })
})

// Deletar registro de água
app.delete('/api/agua/:id', (req, res) => {
  const data = readData()
  const id = parseInt(req.params.id)
  
  const index = data.agua.findIndex(a => a.id === id)
  if (index !== -1) {
    data.agua.splice(index, 1)
    writeData(data)
    res.json({ success: true })
  } else {
    res.status(404).json({ error: 'Registro não encontrado' })
  }
})

// Relatório semanal
app.get('/api/relatorio-semanal', (req, res) => {
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
  
  const data = readData()
  const dados = dias.map(dataDia => {
    const refeicoes = data.refeicoes.filter(r => r.data === dataDia)
    const agua = data.agua.filter(a => a.data === dataDia)
    
    const totalCalorias = refeicoes.reduce((sum, r) => {
      // Se a refeição tem itens, somar os itens, senão usar calorias_total ou calorias
      if (r.itens && r.itens.length > 0) {
        return sum + r.itens.reduce((s, item) => s + (item.calorias || 0), 0)
      }
      return sum + (r.calorias_total || r.calorias || 0)
    }, 0)
    const totalAgua = agua.reduce((sum, a) => sum + a.quantidade, 0)
    const bateuCalorias = totalCalorias <= 1600 && totalCalorias >= 1280  // 80% de 1600
    const bateuAgua = totalAgua >= 4000
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
  })
  
  res.json(dados)
})

// Função para calcular TMB (Taxa Metabólica Basal) usando fórmula de Mifflin-St Jeor
function calcularTMB(idade, genero, altura, peso) {
  // Altura em cm, peso em kg
  // Fórmula: TMB = (10 × peso) + (6.25 × altura) - (5 × idade) + S
  // S = +5 para homens, -161 para mulheres
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
      // Déficit de 500 kcal para perder ~0.5kg por semana
      return Math.max(1200, manutencao - 500)
    case 'ganho_massa':
      // Superávit de 300-500 kcal para ganhar massa
      return manutencao + 400
    case 'manutencao':
    default:
      return manutencao
  }
}

// Perfil do usuário
app.get('/api/perfil', (req, res) => {
  const data = readData()
  if (!data.perfil) {
    return res.status(404).json({ error: 'Perfil não encontrado' })
  }
  res.json(data.perfil)
})

app.post('/api/perfil', (req, res) => {
  try {
    const { idade, genero, altura, peso, atividade, objetivo } = req.body
    
    // Validação mais flexível
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
    
    const data = readData()
    data.perfil = {
      idade: parseInt(idade),
      genero,
      altura: parseFloat(altura),
      peso: parseFloat(peso),
      atividade,
      objetivo,
      atualizado_em: new Date().toISOString()
    }
    
    writeData(data)
    res.json({ success: true, perfil: data.perfil })
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)
    res.status(500).json({ error: 'Erro interno do servidor ao salvar perfil' })
  }
})

// Calcular meta calórica
app.get('/api/calcular-meta-calorica', (req, res) => {
  try {
    const data = readData()
    
    if (!data.perfil) {
      return res.json({ meta: 1600, tmb: 0 }) // Meta padrão
    }
    
    const { idade, genero, altura, peso, atividade, objetivo } = data.perfil
    
    if (!idade || !genero || !altura || !peso || !atividade || !objetivo) {
      return res.json({ meta: 1600, tmb: 0 }) // Meta padrão se dados incompletos
    }
    
    const tmb = calcularTMB(idade, genero, altura, peso)
    const fatorAtividade = getFatorAtividade(atividade)
    const meta = calcularMetaCalorica(tmb, fatorAtividade, objetivo)
    
    res.json({ meta, tmb, objetivo, atividade })
  } catch (error) {
    console.error('Erro ao calcular meta:', error)
    res.json({ meta: 1600, tmb: 0 }) // Retornar meta padrão em caso de erro
  }
})

// Adicionar novo alimento
app.post('/api/alimentos', (req, res) => {
  const { nome, calorias_por_100g, categoria, unidade } = req.body
  const data = readData()
  
  // Verificar se já existe
  const existe = data.alimentos.find(a => a.nome.toLowerCase() === nome.toLowerCase())
  if (existe) {
    return res.status(400).json({ error: 'Alimento já existe' })
  }
  
  const novoId = Math.max(...data.alimentos.map(a => a.id), 0) + 1
  const novoAlimento = {
    id: novoId,
    nome,
    calorias_por_100g: parseFloat(calorias_por_100g),
    categoria: categoria || 'Outros',
    unidade: unidade || 'g'
  }
  
  data.alimentos.push(novoAlimento)
  writeData(data)
  
  res.json({ id: novoAlimento.id })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`📊 Dados salvos em: data.json`)
  console.log(`📦 Banco de dados com ${readData().alimentos.length} alimentos`)
})
