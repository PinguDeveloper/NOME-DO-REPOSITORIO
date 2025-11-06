# 💧 Controle de Dieta e Água

Sistema completo para controle de dieta, calorias e ingestão de água.

## 🚀 Funcionalidades

- ✅ Cadastro de refeições (café da manhã, almoço, café da tarde, jantar, jejum)
- ✅ Múltiplos alimentos por refeição
- ✅ Cálculo automático de calorias (baseado em FatSecret.com.br)
- ✅ Controle de água (meta: 4 litros/dia)
- ✅ Dashboard com visão geral do dia
- ✅ Relatório semanal
- ✅ Aviso quando ultrapassar meta de calorias
- ✅ Banco de dados com mais de 200 alimentos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## 🛠️ Instalação

1. **Clone ou baixe o projeto**

2. **Instale as dependências do frontend:**
```bash
npm install
```

3. **Instale as dependências do backend:**
```bash
cd server
npm install
cd ..
```

## ▶️ Como Executar

### Modo Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Acesse: http://localhost:5173

### Modo Produção

**Build do frontend:**
```bash
npm run build
```

**Iniciar servidor:**
```bash
cd server
npm start
```

## 📦 Deploy

### Frontend (Vercel)
1. Conecte seu repositório no Vercel
2. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Adicione variável de ambiente: `VITE_API_URL` com a URL do seu backend

### Backend (Render/Railway)
1. Conecte seu repositório
2. Configure:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Defina a URL gerada e atualize `VITE_API_URL` no frontend

Veja o arquivo `DEPLOY.md` para instruções detalhadas.

## 🎯 Meta de Calorias

- **Meta diária:** 1600 kcal
- **Meta de água:** 4 litros (4000 ml)

## 📊 Banco de Dados

Mais de 200 alimentos com valores calóricos baseados em:
- FatSecret.com.br
- Tabelas nutricionais brasileiras

## 🛠️ Tecnologias

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Banco de Dados:** JSON (arquivo `server/data.json`)

## 📝 Licença

Este projeto é de uso pessoal.

---

**Desenvolvido para controle pessoal de dieta e água**
