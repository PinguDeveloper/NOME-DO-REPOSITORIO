# 🔧 Como Corrigir o Erro no Render

## ❌ Erro que você está vendo:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from /opt/render/project/src/server/server.js
```

## ✅ Solução:

O problema é que o Render não está encontrando o `package.json` do backend. Isso acontece porque o **Root Directory** não está configurado corretamente.

---

## 🚀 Passos para Corrigir:

### 1. No Painel do Render:

1. Acesse: https://dashboard.render.com
2. Clique no seu serviço (backend)
3. Vá em **"Settings"** (Configurações)
4. Procure por **"Root Directory"**
5. **IMPORTANTE:** Configure como:
   ```
   server
   ```
   (sem barra, sem `src/`, apenas `server`)

### 2. Verifique os Comandos:

Na seção **"Build & Deploy"**:

- **Build Command:** Deixe vazio OU use `npm install`
- **Start Command:** Deixe vazio OU use `npm start`

### 3. Variáveis de Ambiente:

Certifique-se de ter:
- `PORT=3000` (ou deixe o Render gerar automaticamente)

### 4. Salve e Refaça o Deploy:

1. Clique em **"Save Changes"**
2. Vá em **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔄 Alternativa: Usar render.yaml

O arquivo `render.yaml` já foi criado na raiz do projeto. Para usar:

1. No Render, vá em **"New +"** → **"Blueprint"**
2. Conecte seu repositório
3. O Render detectará automaticamente o `render.yaml`
4. Clique em **"Apply"**

---

## ✅ Configuração Correta no Render:

```
Name: controle-dieta-backend
Environment: Node
Root Directory: server          ← ESSENCIAL!
Build Command: (vazio ou npm install)
Start Command: (vazio ou npm start)
PORT: 3000 (variável de ambiente)
```

---

## 🧪 Teste Depois do Deploy:

Após o deploy funcionar, teste a API:
```
https://seu-backend.onrender.com/api/alimentos
```

Deve retornar um JSON com a lista de alimentos.

---

## 💡 Dicas:

- O **Root Directory** é o mais importante!
- Se deixar vazio, o Render procura na raiz do projeto
- Como você tem `server/` como subpasta, DEVE especificar `server`
- O Render instala as dependências automaticamente se encontrar `package.json` no Root Directory

---

## 🆘 Se ainda não funcionar:

1. Verifique se o `server/package.json` existe e tem as dependências
2. Verifique os logs do Render (aba "Logs")
3. Tente fazer um novo deploy manual
4. Certifique-se de que o código está no GitHub

---

**Depois de corrigir, o backend deve funcionar! 🚀**

