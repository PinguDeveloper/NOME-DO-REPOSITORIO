# 🔧 Corrigir Erro: "Missing script: start"

## ❌ Erro que você está vendo:
```
npm error Missing script: "start"
```

## 🔍 Causa:
O Render está procurando o `package.json` na pasta errada. Ele precisa estar na pasta `server/`.

---

## ✅ Solução Passo a Passo:

### 1. No Painel do Render:

1. Acesse o seu serviço no Render
2. Clique em **"Settings"** (Configurações)
3. Procure a seção **"Build & Deploy"**

### 2. Configure o Root Directory:

**⚠️ CRÍTICO:** Na seção **"Root Directory"**, configure:

```
server
```

**IMPORTANTE:**
- ❌ NÃO use: `/server` ou `server/` ou `/server/`
- ✅ Use apenas: `server` (sem barra)

### 3. Configure os Comandos:

Na seção **"Build Command"**, deixe:

```
npm install
```

Na seção **"Start Command"**, deixe:

```
npm start
```

### 4. Salve e Refaça o Deploy:

1. Clique em **"Save Changes"**
2. Vá em **"Manual Deploy"** → **"Deploy latest commit"**
3. Aguarde o deploy terminar

---

## 🔍 Verificar se Está Correto:

Depois do deploy, verifique os logs. Você deve ver algo como:

```
> controle-dieta-server@1.0.0 start
> node server.js
🚀 Servidor rodando em http://localhost:3000
```

Se aparecer isso, está funcionando! ✅

---

## 🆘 Se Ainda Não Funcionar:

### Opção 1: Deletar e Recriar o Serviço

1. No Render, delete o serviço atual
2. Crie um novo serviço
3. **IMPORTANTE:** Na hora de criar, configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Opção 2: Usar Comandos Absolutos

Se o Root Directory não funcionar, use comandos completos:

**Build Command:**
```
cd server && npm install
```

**Start Command:**
```
cd server && npm start
```

Mas deixe o **Root Directory VAZIO** neste caso.

---

## ✅ Checklist:

- [ ] Root Directory = `server` (sem barra)
- [ ] Build Command = `npm install`
- [ ] Start Command = `npm start`
- [ ] Variáveis de ambiente configuradas (PORT=3000, NODE_ENV=production)
- [ ] Deploy refeito
- [ ] Logs mostrando "Servidor rodando"

---

## 💡 Dica Importante:

O Render pode levar alguns minutos para aplicar as mudanças. Se ainda não funcionar após 2-3 minutos, tente a Opção 2 acima.

---

**Depois de corrigir, o backend deve funcionar! 🚀**

