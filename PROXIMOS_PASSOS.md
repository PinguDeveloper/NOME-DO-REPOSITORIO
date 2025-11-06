# ✅ Próximos Passos - Backend no Render

## ✅ Você já configurou: `PORT=3000`

### 📋 Adicione também esta variável:

1. Clique em **"+ Add Environment Variable"**
2. Configure:
   - **Key:** `NODE_ENV`
   - **Value:** `production`
3. Clique para salvar

**Por quê?** Isso garante que o CORS permita todas as origens (incluindo o Netlify).

---

## 🔍 Verifique as Configurações Principais:

No painel do Render, vá em **"Settings"** e confira:

### ✅ Root Directory:
Deve estar configurado como: **`server`**
- Sem barra no final
- Sem `src/` antes
- Apenas: `server`

### ✅ Build Command:
Pode estar vazio OU usar: `npm install`

### ✅ Start Command:
Pode estar vazio OU usar: `npm start`

---

## 🚀 Depois de Configurar:

1. **Salve tudo** e aguarde o deploy
2. **Anote a URL** do backend que o Render gerou (ex: `https://controle-dieta-backend.onrender.com`)
3. **Teste a API:**
   - Acesse: `https://SEU-BACKEND.onrender.com/api/alimentos`
   - Deve retornar JSON

---

## 📋 Depois, Configure no Netlify:

1. Acesse: https://app.netlify.com
2. Seu site → "Site settings" → "Environment variables"
3. Adicione:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://SEU-BACKEND.onrender.com/api`
4. Refazer deploy

---

## ✅ Checklist:

- [x] PORT=3000 configurado
- [ ] NODE_ENV=production configurado
- [ ] Root Directory = `server`
- [ ] Backend deployado e funcionando
- [ ] URL do backend anotada
- [ ] VITE_API_URL configurado no Netlify
- [ ] Site funcionando completamente

---

**Continue seguindo os passos! 🚀**

