# 📦 Comandos Git Corretos para Enviar ao GitHub

## ⚠️ IMPORTANTE: Comandos Git são em INGLÊS!

Os comandos Git **NÃO** devem ser traduzidos. Use sempre os comandos originais em inglês.

---

## ❌ ERRADO (traduzido):
```bash
git initTradução
git adicionar README.md
ramo git -M principal
git remoto adicionar origem
```

## ✅ CORRETO (inglês):
```bash
git init
git add README.md
git branch -M main
git remote add origin
```

---

## 🚀 Comandos Completos (Passo a Passo)

### 1. Inicializar Git
```bash
git init
```

### 2. Adicionar todos os arquivos
```bash
git add .
```

### 3. Fazer commit
```bash
git commit -m "Primeiro commit - Controle de Dieta"
```

### 4. Renomear branch para main
```bash
git branch -M main
```

### 5. Adicionar repositório remoto
```bash
git remote add origin https://github.com/PinguDeveloper/NOME-DO-REPOSITORIO.git
```
**⚠️ Substitua `NOME-DO-REPOSITORIO` pelo nome real do seu repositório!**

### 6. Enviar para GitHub
```bash
git push -u origin main
```

---

## 🔥 Todos os Comandos de Uma Vez

Se você já criou o repositório no GitHub:

```bash
git init
git add .
git commit -m "Primeiro commit - Controle de Dieta"
git branch -M main
git remote add origin https://github.com/PinguDeveloper/NOME-DO-REPOSITORIO.git
git push -u origin main
```

---

## 📋 Pré-requisitos

1. **Instalar Git:**
   - Baixe em: https://git-scm.com/download/win
   - Instale e reinicie o terminal

2. **Criar repositório no GitHub:**
   - Acesse: https://github.com
   - Clique em "New repository"
   - Dê um nome (ex: `controle-dieta`)
   - NÃO marque "Initialize with README"
   - Clique em "Create repository"

3. **Copiar a URL do repositório** (aparecerá na página)

---

## 🎯 Depois do Push

1. Vá para: https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New Project"
4. Importe seu repositório
5. Clique em "Deploy"
6. Configure a variável `VITE_API_URL` após o primeiro deploy

---

## 💡 Dicas

- Se der erro de autenticação, use Personal Access Token
- Se pedir usuário/senha, use seu username do GitHub e um token
- Para criar token: GitHub → Settings → Developer settings → Personal access tokens
