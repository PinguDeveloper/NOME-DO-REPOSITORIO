# 🔄 Solução Alternativa para Render

Se o Root Directory não estiver funcionando, use esta configuração:

---

## 📋 Configuração no Render:

### **Root Directory:**
Deixe **VAZIO** (não coloque nada)

### **Build Command:**
```
cd server && npm install
```

### **Start Command:**
```
cd server && npm start
```

### **Variáveis de Ambiente:**
- `PORT=3000`
- `NODE_ENV=production`

---

## ✅ Por que isso funciona?

Quando o Root Directory está vazio, o Render executa os comandos a partir da raiz do projeto. Então usamos `cd server &&` para entrar na pasta correta antes de executar os comandos.

---

## 🚀 Depois de Configurar:

1. Salve as mudanças
2. Faça um novo deploy manual
3. Verifique os logs - deve aparecer "Servidor rodando"

---

**Essa é uma solução mais confiável! ✅**

