import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { query, initDatabase } from './db.js'
import * as alimentosRepo from './repositories/alimentos.js'
import * as usuariosRepo from './repositories/usuarios.js'
import * as refeicoesRepo from './repositories/refeicoes.js'
import * as aguaRepo from './repositories/agua.js'
import * as perfilRepo from './repositories/perfil.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Caminho para o arquivo JSON antigo
const DATA_FILE = join(__dirname, '..', 'data.json')

async function migrateFromJSON() {
  try {
    console.log('🔄 Iniciando migração do JSON para PostgreSQL...')
    
    // Verificar se o arquivo JSON existe
    if (!existsSync(DATA_FILE)) {
      console.log('⚠️  Arquivo data.json não encontrado. Pulando migração.')
      return
    }
    
    // Ler dados do JSON
    console.log('📖 Lendo dados do arquivo JSON...')
    const jsonData = JSON.parse(readFileSync(DATA_FILE, 'utf8'))
    
    // Inicializar banco de dados
    await initDatabase()
    
    // 1. Migrar alimentos
    if (jsonData.alimentos && Array.isArray(jsonData.alimentos)) {
      console.log(`📦 Migrando ${jsonData.alimentos.length} alimentos...`)
      for (const alimento of jsonData.alimentos) {
        try {
          const existe = await alimentosRepo.getAlimentoByNome(alimento.nome)
          if (!existe) {
            await alimentosRepo.createAlimento({
              nome: alimento.nome,
              calorias_por_100g: alimento.calorias_por_100g,
              categoria: alimento.categoria || 'Outros',
              unidade: alimento.unidade || 'g'
            })
          }
        } catch (error) {
          console.error(`Erro ao migrar alimento ${alimento.nome}:`, error.message)
        }
      }
      console.log('✅ Alimentos migrados com sucesso!')
    }
    
    // 2. Migrar usuários e seus dados
    if (jsonData.usuarios && typeof jsonData.usuarios === 'object') {
      const deviceIds = Object.keys(jsonData.usuarios)
      console.log(`👥 Migrando dados de ${deviceIds.length} usuário(s)...`)
      
      for (const deviceId of deviceIds) {
        const userData = jsonData.usuarios[deviceId]
        
        try {
          // Criar usuário
          await usuariosRepo.getOrCreateUsuario(deviceId)
          
          // Migrar metas
          if (userData.metas) {
            await usuariosRepo.updateMetas(deviceId, {
              calorias: userData.metas.calorias,
              agua: userData.metas.agua
            })
          }
          
          // Migrar streaks
          if (userData.streaks) {
            await usuariosRepo.updateStreaks(deviceId, {
              calorias: userData.streaks.calorias || 0,
              agua: userData.streaks.agua || 0,
              ambas: userData.streaks.ambas || 0
            })
          }
          
          // Migrar refeições
          if (userData.refeicoes && Array.isArray(userData.refeicoes)) {
            console.log(`  📝 Migrando ${userData.refeicoes.length} refeições para ${deviceId}...`)
            for (const refeicao of userData.refeicoes) {
              try {
                // Converter estrutura antiga para nova
                let itens = []
                if (refeicao.itens && Array.isArray(refeicao.itens)) {
                  // Já está na estrutura nova
                  itens = refeicao.itens
                } else {
                  // Estrutura antiga (um alimento por refeição)
                  itens = [{
                    alimento_id: refeicao.alimento_id || null,
                    alimento_nome: refeicao.alimento_nome || '',
                    quantidade: refeicao.quantidade || 0,
                    unidade: 'g',
                    calorias: refeicao.calorias || 0
                  }]
                }
                
                await refeicoesRepo.createRefeicao(deviceId, {
                  data: refeicao.data,
                  tipo: refeicao.tipo,
                  itens: itens,
                  calorias_total: refeicao.calorias_total || refeicao.calorias || 0,
                  notas: refeicao.notas || ''
                })
              } catch (error) {
                console.error(`    Erro ao migrar refeição ${refeicao.id}:`, error.message)
              }
            }
          }
          
          // Migrar registros de água
          if (userData.agua && Array.isArray(userData.agua)) {
            console.log(`  💧 Migrando ${userData.agua.length} registros de água para ${deviceId}...`)
            for (const registro of userData.agua) {
              try {
                await aguaRepo.createAgua(deviceId, {
                  data: registro.data,
                  quantidade: registro.quantidade
                })
              } catch (error) {
                console.error(`    Erro ao migrar registro de água ${registro.id}:`, error.message)
              }
            }
          }
          
          console.log(`  ✅ Dados do usuário ${deviceId} migrados!`)
        } catch (error) {
          console.error(`  ❌ Erro ao migrar dados do usuário ${deviceId}:`, error.message)
        }
      }
    }
    
    // 3. Migrar perfil (estrutura antiga - perfil único)
    if (jsonData.perfil) {
      console.log('👤 Migrando perfil...')
      try {
        const deviceId = 'default' // Perfil antigo vai para o deviceId padrão
        await usuariosRepo.getOrCreateUsuario(deviceId)
        
        await perfilRepo.upsertPerfil(deviceId, {
          idade: jsonData.perfil.idade,
          genero: jsonData.perfil.genero,
          altura: jsonData.perfil.altura,
          peso: jsonData.perfil.peso,
          atividade: jsonData.perfil.atividade,
          objetivo: jsonData.perfil.objetivo
        })
        console.log('✅ Perfil migrado com sucesso!')
      } catch (error) {
        console.error('❌ Erro ao migrar perfil:', error.message)
      }
    }
    
    // 4. Migrar dados antigos (estrutura sem usuarios)
    if (jsonData.refeicoes && !jsonData.usuarios) {
      console.log('📝 Migrando refeições antigas (estrutura sem usuarios)...')
      const deviceId = 'default'
      await usuariosRepo.getOrCreateUsuario(deviceId)
      
      if (Array.isArray(jsonData.refeicoes)) {
        for (const refeicao of jsonData.refeicoes) {
          try {
            const itens = [{
              alimento_id: refeicao.alimento_id || null,
              alimento_nome: refeicao.alimento_nome || '',
              quantidade: refeicao.quantidade || 0,
              unidade: 'g',
              calorias: refeicao.calorias || 0
            }]
            
            await refeicoesRepo.createRefeicao(deviceId, {
              data: refeicao.data,
              tipo: refeicao.tipo,
              itens: itens,
              calorias_total: refeicao.calorias || 0,
              notas: refeicao.notas || ''
            })
          } catch (error) {
            console.error(`  Erro ao migrar refeição antiga:`, error.message)
          }
        }
      }
    }
    
    if (jsonData.agua && !jsonData.usuarios) {
      console.log('💧 Migrando registros de água antigos...')
      const deviceId = 'default'
      
      if (Array.isArray(jsonData.agua)) {
        for (const registro of jsonData.agua) {
          try {
            await aguaRepo.createAgua(deviceId, {
              data: registro.data,
              quantidade: registro.quantidade
            })
          } catch (error) {
            console.error(`  Erro ao migrar registro de água antigo:`, error.message)
          }
        }
      }
    }
    
    console.log('✅ Migração concluída com sucesso!')
    console.log('💡 Você pode manter o arquivo data.json como backup ou removê-lo.')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
    throw error
  }
}

// Executar migração se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateFromJSON()
    .then(() => {
      console.log('🎉 Migração finalizada!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erro fatal na migração:', error)
      process.exit(1)
    })
}

export { migrateFromJSON }

