# 🚀 Configurar Backend no Render - Passo a Passo

## ✅ Seu Frontend já está em: `dietaapp.netlify.app`

Agora vamos fazer o backend funcionar no Render!

---

## 📋 Passo 1: Criar Serviço no Render

1. **Acesse:** https://dashboard.render.com
2. Faça login (ou crie conta se não tiver)
3. Clique em **"New +"** → **"Web Service"**

---

## 📋 Passo 2: Conectar Repositório GitHub

1. Selecione **"Connect account"** ou **"Connect GitHub"**
2. Autorize o Render a acessar seus repositórios
3. Selecione o repositório do seu projeto
4. Clique em **"Connect"**

---

## 📋 Passo 3: Configurar o Serviço

Configure assim:

### **Informações Básicas:**
- **Name:** `controle-dieta-backend` (ou qualquer nome)
- **Region:** Escolha a mais próxima (ex: `Oregon (US West)`)

### **Configurações Importantes:**
- **Branch:** `main` (ou `master` se for o nome da sua branch)
- **Root Directory:** `server` ⚠️ **ESSENCIAL!**
- **Runtime:** `Node`
- **Build Command:** Deixe **VAZIO** (ou `npm install`)
- **Start Command:** Deixe **VAZIO** (ou `npm start`)

### **Variáveis de Ambiente:**
Clique em **"Advanced"** → **"Add Environment Variable"** e adicione:
- **Key:** `PORT`
- **Value:** `3000`
- Clique em **"Add"**

---

## 📋 Passo 4: Criar o Serviço

1. Clique em **"Create Web Service"**
2. O Render começará a fazer o deploy automaticamente

---

## ⏳ Passo 5: Aguardar o Deploy

1. Aguarde alguns minutos (pode levar 2-5 minutos)
2. Você verá os logs do build
3. Quando terminar, você verá uma URL como: `https://controle-dieta-backend.onrender.com`

---

## 📋 Passo 6: Anotar a URL do Backend

**IMPORTANTE:** Anote a URL que o Render gerou, será algo como:
```
https://controle-dieta-backend.onrender.com
```

Esta será a URL do seu backend!

---

## 📋 Passo 7: Testar o Backend

1. Abra uma nova aba no navegador
2. Acesse: `https://SEU-BACKEND.onrender.com/api/alimentos`
3. Deve retornar um JSON com a lista de alimentos (ou array vazio `[]`)

Se funcionar, o backend está rodando! ✅

---

## 📋 Passo 8: Configurar Variável no Netlify

Agora vamos conectar o frontend (Netlify) ao backend (Render):

1. **Acesse:** https://app.netlify.com
2. Clique no seu site (`dietaapp`)
3. Vá em **"Site settings"** → **"Environment variables"**
4. Clique em **"Add variable"**
5. Configure:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://SEU-BACKEND.onrender.com/api`
   - **⚠️ IMPORTANTE:** Inclua `/api` no final!
6. Clique em **"Save"**

---

## 📋 Passo 9: Refazer Deploy no Netlify

1. No Netlify, vá em **"Deploys"**
2. Clique nos **"..."** (três pontos) do último deploy
3. Clique em **"Trigger deploy"** → **"Clear cache and deploy site"**
4. Aguarde o deploy terminar

---

## ✅ Pronto!

Agora seu site deve estar funcionando completamente!

- **Frontend:** `https://dietaapp.netlify.app`
- **Backend:** `https://SEU-BACKEND.onrender.com/api`

---

## 🧪 Testar se Está Funcionando

1. Acesse: `https://dietaapp.netlify.app`
2. Tente adicionar uma refeição
3. Se funcionar, está tudo conectado! 🎉

---

## 🆘 Problemas Comuns

### Erro: "Cannot find package 'express'"
**Solução:** Verifique se o **Root Directory** está configurado como `server`

### Erro: "Failed to fetch" no frontend
**Soluções:**
- Verifique se a variável `VITE_API_URL` está configurada no Netlify
- Verifique se a URL do backend está correta (deve terminar com `/api`)
- Aguarde alguns minutos após criar o backend (pode demorar para ficar online)

### Backend não responde
**Soluções:**
- Verifique os logs no Render (aba "Logs")
- Certifique-se de que o Root Directory está como `server`
- Verifique se o `package.json` está na pasta `server/`

---

## 📝 Checklist Final

- [ ] Backend criado no Render
- [ ] Root Directory configurado como `server`
- [ ] Variável `PORT=3000` adicionada
- [ ] Backend respondendo em `https://SEU-BACKEND.onrender.com/api/alimentos`
- [ ] Variável `VITE_API_URL` configurada no Netlify
- [ ] Deploy refeito no Netlify
- [ ] Site funcionando completamente

---

**Boa sorte! 🚀**

