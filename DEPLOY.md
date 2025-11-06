# 🚀 Guia de Deploy - Como Colocar o Site Online

Este guia explica como colocar seu site de controle de dieta online para acessar de qualquer lugar.

## ⚡ Deploy Rápido no Vercel

O projeto já está configurado para deploy no Vercel! Siga os passos abaixo.

## 📋 Opções de Deploy

### ⚡ Opção 1: Vercel (Recomendado - Mais Fácil) ⭐

**Vantagens:**
- ✅ Gratuito
- ✅ Deploy automático do GitHub
- ✅ HTTPS automático
- ✅ Muito fácil de usar
- ✅ Atualizações automáticas
- ✅ Já está configurado! (vercel.json incluído)

**Passos:**

1. **Criar conta no GitHub:**
   - Acesse: https://github.com
   - Crie uma conta (se não tiver)
   - Crie um novo repositório

2. **Enviar código para GitHub:**
   ```bash
   # No terminal, na pasta do projeto
   git init
   git add .
   git commit -m "Primeiro commit"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

3. **Conectar ao Vercel:**
   - Acesse: https://vercel.com
   - Faça login com GitHub
   - Clique em "Add New Project"
   - Importe seu repositório
   - ✅ **O Vercel detectará automaticamente as configurações!**
   - Clique em "Deploy"

4. **Configurar Variável de Ambiente:**
   - Após o deploy, vá em "Settings" → "Environment Variables"
   - Adicione: `VITE_API_URL` = `https://seu-backend.onrender.com/api`
   - Faça um novo deploy

5. **Deploy do Backend (Render/Railway):**
   - Veja a Opção 2 abaixo para deploy do backend

**Seu site estará online em: `https://seu-projeto.vercel.app`**

---

### Opção 2: Render (Backend + Frontend)

**Vantagens:**
- ✅ Gratuito (com limitações)
- ✅ Suporta Node.js backend
- ✅ Deploy automático do GitHub

**Passos:**

1. **Backend:**
   - Acesse: https://render.com
   - Faça login com GitHub
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório
   - Configure:
     - **Name:** controle-dieta-backend
     - **Environment:** Node
     - **Build Command:** `npm install` (deixe em branco ou use isso)
     - **Start Command:** `npm start` (deixe em branco ou use isso)
     - **Root Directory:** `server` ⚠️ **IMPORTANTE: Isso é essencial!**
   - Adicione variável de ambiente: `PORT=3000`
   - Clique em "Create Web Service"
   
   **⚠️ IMPORTANTE:** O arquivo `render.yaml` já foi criado na raiz do projeto. Se você usar esse arquivo:
   - No Render, clique em "Apply render.yaml" ou configure manualmente como acima
   - O Root Directory DEVE ser `server` (sem barra, sem src/)

2. **Frontend:**
   - Clique em "New +" → "Static Site"
   - Conecte seu repositório
   - Configure:
     - **Name:** controle-dieta-frontend
     - **Build Command:** `npm run build`
     - **Publish Directory:** `dist`
   - Clique em "Create Static Site"

3. **Atualizar API URL:**
   - No arquivo `src/utils/api.js`, altere:
   ```javascript
   const API_URL = 'https://seu-backend.onrender.com/api'
   ```
   - Faça commit e push

**Seu site estará online em: `https://seu-frontend.onrender.com`**

---

### Opção 3: Netlify (Frontend) + Railway (Backend)

**Netlify (Frontend):**
1. Acesse: https://netlify.com
2. Faça login com GitHub
3. Clique em "Add new site" → "Import an existing project"
4. Selecione seu repositório
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Clique em "Deploy site"

**Railway (Backend):**
1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub"
4. Selecione seu repositório
5. Configure:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
6. Railway gera uma URL automaticamente

**Atualizar API URL:**
- No arquivo `src/utils/api.js`, altere para a URL do Railway

---

## 🔧 Configurações Necessárias

### 1. Atualizar URL da API

Após fazer deploy do backend, atualize o arquivo `src/utils/api.js`:

```javascript
// Para desenvolvimento local:
// const API_URL = 'http://localhost:3000/api'

// Para produção:
const API_URL = 'https://seu-backend.onrender.com/api'
// ou
const API_URL = 'https://seu-backend.railway.app/api'
```

### 2. Configurar CORS no Backend

O arquivo `server/server.js` já tem CORS configurado, mas se precisar adicionar domínios específicos:

```javascript
app.use(cors({
  origin: ['https://seu-frontend.vercel.app', 'https://seu-frontend.netlify.app']
}))
```

### 3. Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` no backend:

```env
PORT=3000
NODE_ENV=production
```

---

## 📝 Checklist de Deploy

- [ ] Código enviado para GitHub
- [ ] Backend deployado (Render/Railway)
- [ ] Frontend deployado (Vercel/Netlify)
- [ ] API URL atualizada no frontend
- [ ] CORS configurado no backend
- [ ] Testado acesso ao site online
- [ ] Testado funcionalidades (adicionar refeição, água, etc.)

---

## 🔄 Atualizações Automáticas

**Com GitHub:**
- Faça alterações no código
- Faça commit: `git add . && git commit -m "Sua mensagem"`
- Faça push: `git push`
- O deploy é automático! (Vercel, Render, Netlify fazem isso automaticamente)

---

## 🆘 Problemas Comuns

### Erro: "Cannot connect to API"
- Verifique se o backend está rodando
- Verifique se a URL da API está correta
- Verifique CORS no backend

### Erro: "Build failed"
- Verifique se todas as dependências estão no `package.json`
- Verifique se os comandos de build estão corretos

### Site não atualiza
- Limpe o cache do navegador (Ctrl+Shift+R)
- Aguarde alguns minutos (deploy pode levar 1-2 minutos)

---

## 💡 Dicas

1. **Use domínio personalizado:** Vercel e Netlify permitem adicionar seu próprio domínio
2. **Monitore logs:** Use o painel do serviço para ver logs de erros
3. **Backup:** Mantenha seu código no GitHub sempre atualizado
4. **Teste localmente:** Teste tudo localmente antes de fazer deploy

---

## 📞 Suporte

Se tiver problemas, verifique:
- Logs do serviço de deploy
- Console do navegador (F12)
- Status do serviço (Vercel/Render/Netlify têm páginas de status)

---

**Boa sorte com o deploy! 🚀**

