# Migração para PostgreSQL

Este documento explica como migrar o app de controle de dieta do banco JSON para PostgreSQL.

## 📋 Visão Geral

A aplicação foi migrada de um arquivo JSON (`data.json`) para um banco de dados PostgreSQL profissional. Isso traz várias vantagens:

- ✅ **Escalabilidade**: Suporta milhões de registros
- ✅ **Performance**: Consultas otimizadas com índices
- ✅ **Integridade**: Relacionamentos e constraints garantem consistência
- ✅ **Concorrência**: Múltiplos usuários podem acessar simultaneamente
- ✅ **Backup**: Sistema de backup automático no Render

## 🗄️ Estrutura do Banco de Dados

O banco PostgreSQL possui as seguintes tabelas:

- `alimentos` - Catálogo de alimentos com calorias
- `usuarios` - Usuários identificados por deviceId
- `metas` - Metas de calorias e água por usuário
- `refeicoes` - Refeições registradas
- `refeicao_itens` - Itens dentro de cada refeição
- `agua` - Registros de consumo de água
- `perfil` - Perfil do usuário (idade, peso, altura, etc)
- `templates` - Templates de refeições salvas
- `notas` - Notas gerais do usuário
- `peso` - Histórico de peso
- `conquistas` - Conquistas desbloqueadas
- `streaks` - Sequências de dias (calorias, água, ambas)

## 🚀 Configuração no Render

### Passo 1: Criar Banco PostgreSQL no Render

1. Acesse o [Dashboard do Render](https://dashboard.render.com)
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `controle-dieta-db`
   - **Database**: `controle_dieta`
   - **User**: `controle_dieta_user`
   - **Region**: Escolha a região mais próxima
   - **Plan**: `Free` (ou outro plano conforme necessário)
4. Clique em **"Create Database"**

### Passo 2: Conectar o Banco ao Serviço Web

1. No dashboard do Render, vá para o serviço web do backend
2. Na seção **"Environment"**, você verá a variável `DATABASE_URL` já configurada automaticamente
3. Se não aparecer, adicione manualmente:
   - **Key**: `DATABASE_URL`
   - **Value**: Copie a **Internal Database URL** do banco PostgreSQL criado

### Passo 3: Deploy

O Render irá:
1. Instalar as dependências (`npm install`)
2. Executar o servidor (`npm start`)
3. O servidor irá criar as tabelas automaticamente na primeira inicialização

## 📦 Estrutura de Arquivos

```
server/
├── database/
│   ├── schema.sql          # Schema SQL do banco de dados
│   ├── db.js               # Módulo de conexão com PostgreSQL
│   ├── migrate.js          # Script de migração do JSON para PostgreSQL
│   └── repositories/      # Repositórios de acesso aos dados
│       ├── alimentos.js
│       ├── usuarios.js
│       ├── refeicoes.js
│       ├── agua.js
│       └── perfil.js
└── server.js               # Servidor Express adaptado para PostgreSQL
```

## 🔄 Migração dos Dados Existentes

Se você já tem dados no arquivo `data.json` e quer migrá-los para PostgreSQL:

### Opção 1: Migração Automática (Recomendado)

O servidor irá migrar automaticamente os dados na primeira inicialização se o arquivo `data.json` existir.

### Opção 2: Migração Manual

Execute o script de migração manualmente:

```bash
cd server
npm run migrate
```

O script irá:
1. Ler o arquivo `data.json`
2. Criar todas as tabelas necessárias
3. Migrar todos os dados (alimentos, usuários, refeições, água, perfil, etc)
4. Manter o arquivo JSON como backup

## 🔧 Variáveis de Ambiente

### Necessárias

- `DATABASE_URL` - URL de conexão do PostgreSQL (configurada automaticamente pelo Render)
- `PORT` - Porta do servidor (padrão: 3000)
- `NODE_ENV` - Ambiente (production/development)

### Exemplo de DATABASE_URL

```
postgresql://usuario:senha@host:5432/nome_banco?sslmode=require
```

## 🧪 Testando Localmente

Para testar localmente com PostgreSQL:

1. **Instalar PostgreSQL localmente** ou usar Docker:
   ```bash
   docker run --name postgres-dieta -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=controle_dieta -p 5432:5432 -d postgres:15
   ```

2. **Configurar DATABASE_URL**:
   ```bash
   export DATABASE_URL="postgresql://postgres:senha123@localhost:5432/controle_dieta"
   ```

3. **Instalar dependências**:
   ```bash
   cd server
   npm install
   ```

4. **Executar servidor**:
   ```bash
   npm start
   ```

5. **Migrar dados (opcional)**:
   ```bash
   npm run migrate
   ```

## 📊 Verificando o Banco de Dados

### Via Render Dashboard

1. Acesse o banco PostgreSQL no dashboard
2. Clique em **"Connect"** → **"psql"**
3. Execute queries SQL diretamente

### Via psql (linha de comando)

```bash
psql $DATABASE_URL
```

Exemplos de queries:

```sql
-- Ver todas as tabelas
\dt

-- Contar alimentos
SELECT COUNT(*) FROM alimentos;

-- Ver refeições de um usuário
SELECT * FROM refeicoes WHERE device_id = 'default' LIMIT 10;

-- Ver estatísticas
SELECT 
  COUNT(DISTINCT device_id) as total_usuarios,
  COUNT(*) as total_refeicoes
FROM refeicoes;
```

## ⚠️ Troubleshooting

### Erro: "relation does not exist"

**Causa**: Tabelas não foram criadas ainda.

**Solução**: O servidor cria as tabelas automaticamente na primeira inicialização. Verifique os logs do servidor.

### Erro: "connection refused"

**Causa**: DATABASE_URL incorreta ou banco não está acessível.

**Solução**: 
- Verifique se o banco PostgreSQL está rodando no Render
- Confirme que a DATABASE_URL está correta
- Use a **Internal Database URL** (não a External) no Render

### Erro: "password authentication failed"

**Causa**: Credenciais incorretas.

**Solução**: Verifique a DATABASE_URL e use as credenciais do banco criado no Render.

### Dados não aparecem após migração

**Causa**: Migração pode ter falhado silenciosamente.

**Solução**:
1. Verifique os logs do servidor durante a inicialização
2. Execute a migração manualmente: `npm run migrate`
3. Verifique se o arquivo `data.json` existe e tem dados

## 🔐 Segurança

- ✅ **SSL obrigatório**: Conexões usam SSL em produção
- ✅ **Credenciais seguras**: Senhas não são expostas no código
- ✅ **Prepared statements**: Todas as queries usam prepared statements (proteção contra SQL injection)
- ✅ **Validação de dados**: Dados são validados antes de inserir no banco

## 📈 Próximos Passos

Após a migração, você pode:

1. **Remover o arquivo data.json** (após confirmar que tudo está funcionando)
2. **Fazer backup regular** do banco PostgreSQL no Render
3. **Otimizar queries** adicionando índices conforme necessário
4. **Monitorar performance** usando as ferramentas do Render

## 📚 Recursos

- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)
- [Documentação do pg (driver Node.js)](https://node-postgres.com/)
- [Documentação do Render - PostgreSQL](https://render.com/docs/databases)

## ✅ Checklist de Migração

- [ ] Banco PostgreSQL criado no Render
- [ ] DATABASE_URL configurada no serviço web
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor iniciado e tabelas criadas
- [ ] Dados migrados (se houver data.json)
- [ ] Testado todas as funcionalidades
- [ ] Backup do data.json mantido (opcional)

---

**Nota**: O arquivo `data.json` pode ser mantido como backup, mas não será mais usado pelo servidor após a migração para PostgreSQL.

