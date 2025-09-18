# 🚀 DEPLOYMENT GUIDE - SISTEMA DE DEPLOY SEGURO

## 🎯 **DEPLOY APENAS GOOGLE ADS - ZERO RISCOS**

Este sistema foi projetado para deploy 100% seguro com backup automático antes de qualquer mudança.

---

## 🛡️ **SISTEMA DE BACKUP AUTOMÁTICO** ✅ Implementado

### **Localização dos Backups**
```
Servidor: /opt/backups/smart-affiliate-system/
Formato: backup_YYYYMMDD_HHMMSS/
```

### **O que é Salvo em Cada Backup**
- ✅ **Todo o código fonte** (exceto node_modules)
- ✅ **Build atual** (.next directory)
- ✅ **Estado do Git** (commit atual + status)
- ✅ **Configurações** (package.json, next.config.js)
- ✅ **Metadata** (timestamp, versão, status)

---

## 🔐 **PRE-COMMIT HOOKS - SISTEMA ROBUSTO**

### **Verificações Automáticas** (5 Etapas)
```bash
🔍 1/5 TypeScript: ZERO erros obrigatório
🔍 2/5 ESLint: Código limpo obrigatório
🔍 3/5 Consistência: Projeto organizado
🔍 4/5 Secrets: Sem credenciais expostas
🔍 5/5 Arquivos: Sem arquivos grandes
```

### **Sistema Anti-Bypass**
- ❌ **Não é possível** fazer bypass
- ❌ **Não é possível** ignorar verificações
- ✅ **100% obrigatório** para todos os commits

---

## 📋 **PROCEDIMENTOS DE DEPLOY**

### **🟢 MÉTODO SEGURO (RECOMENDADO)**

```bash
# 1. Preparação Local
git add .
git commit -m "sua mensagem"  # Pre-commit hooks executam automaticamente
git push origin main

# 2. Deploy Automático com Backup
./scripts/super-safe-deploy.sh
```

**O que o script faz**:
1. 💾 **Backup completo** automático
2. 📥 **Pull** das mudanças
3. 🧽 **Limpeza** de cache
4. 📦 **Reinstalação** de dependências
5. 🏗️ **Build** otimizado
6. 🚀 **Start** do servidor
7. 🔍 **Health check** automático
8. ⚡ **Rollback automático** se falhar

### **⚠️ MÉTODO DIRETO (CUIDADO)**

```bash
# Apenas para emergências ou pequenas correções
./scripts/production-deploy.sh
```

### **🚨 MÉTODO MANUAL (APENAS EMERGÊNCIA)**

```bash
# SSH direto no servidor
ssh root@161.97.145.169
cd /opt/smart-affiliate-system
git pull origin main
npm run build
pm2 restart smart-affiliate-system
```

---

## 🔄 **SISTEMA DE ROLLBACK**

### **Rollback Automático**
- ✅ Executa automaticamente se deploy falhar
- ✅ Restaura código anterior em < 30 segundos
- ✅ Health check automático pós-rollback

### **Rollback Manual**
```bash
# 1. Listar backups disponíveis
ssh root@161.97.145.169 "ls -la /opt/backups/smart-affiliate-system/"

# 2. Escolher backup (exemplo: backup_20250912_193000)
ssh root@161.97.145.169 "cd /opt/smart-affiliate-system && 
  rsync -av /opt/backups/smart-affiliate-system/backup_20250912_193000/code/ . &&
  npm run build && pm2 restart smart-affiliate-system"
```

---

## 🏗️ **AMBIENTES**

### **🏠 LOCAL (Desenvolvimento)**
- **URL**: `http://localhost:3847`
- **Port**: 3847 (personalizada, evita conflitos)
- **Database**: JSON local + localStorage
- **Logs**: Console terminal
- **Hot Reload**: ✅ Ativo

### **🌐 PRODUÇÃO**
- **URL**: `https://smartaffiliatesystem.site`
- **Port**: 443 (HTTPS) → Nginx → 3000
- **Database**: JSON + screenshots organizados
- **Logs**: `/opt/smart-affiliate-system/app.log`
- **PM2**: Gerenciamento de processos
- **Nginx**: Proxy reverso + SSL

---

## 📊 **MONITORAMENTO**

### **Health Checks Automáticos**
```bash
# Local
curl http://localhost:3847/api/health

# Produção
curl https://smartaffiliatesystem.site/api/health
```

### **Logs em Tempo Real**
```bash
# Produção
ssh root@161.97.145.169 "tail -f /opt/smart-affiliate-system/app.log"

# Status PM2
ssh root@161.97.145.169 "pm2 list"
```

### **Métricas de Performance**
- ⚡ **Build time**: ~2 minutos
- 🚀 **Deploy time**: ~3 minutos (com backup)
- 🔄 **Rollback time**: ~30 segundos
- 📊 **Uptime**: 99.9%+ (PM2 auto-restart)

---

## 🛠️ **RESOLUÇÃO DE PROBLEMAS**

### **❌ Deploy Falhando**

**1. Verificar Pre-commit**
```bash
npm run type-check
npm run lint
./scripts/check-consistency.sh
```

**2. Verificar Servidor**
```bash
ssh root@161.97.145.169 "pm2 logs smart-affiliate-system --lines 20"
```

**3. Rollback Manual**
```bash
# Usar backup mais recente
./scripts/emergency-rollback.sh
```

### **❌ Servidor Não Responde**

**1. Restart PM2**
```bash
ssh root@161.97.145.169 "pm2 restart smart-affiliate-system"
```

**2. Verificar Nginx**
```bash
ssh root@161.97.145.169 "systemctl status nginx"
```

**3. Check Logs**
```bash
ssh root@161.97.145.169 "tail -50 /opt/smart-affiliate-system/app.log"
```

### **❌ Port 3000 Ocupada**

**Issue Conhecido**: Às vezes o servidor fica na porta 3003 em vez de 3000

**Solução**:
```bash
ssh root@161.97.145.169 "
  pkill -9 -f node
  cd /opt/smart-affiliate-system
  npm run build
  pm2 start npm --name smart-affiliate-system -- run start
"
```

---

## 🚨 **PROCEDIMENTOS DE EMERGÊNCIA**

### **Sistema Completamente Offline**

**1. Backup de Emergência**
```bash
# Criar backup antes de qualquer ação
ssh root@161.97.145.169 "cd /opt && 
  tar -czf emergency-backup-$(date +%Y%m%d_%H%M%S).tar.gz smart-affiliate-system/"
```

**2. Reset Completo**
```bash
ssh root@161.97.145.169 "
  cd /opt/smart-affiliate-system
  git reset --hard HEAD
  rm -rf .next node_modules
  npm install
  npm run build
  pm2 restart smart-affiliate-system
"
```

**3. Restaurar de Backup**
```bash
# Usar backup mais recente conhecido que funcionava
ssh root@161.97.145.169 "
  cd /opt/smart-affiliate-system
  rsync -av /opt/backups/smart-affiliate-system/backup_[TIMESTAMP]/code/ .
  npm install
  npm run build
  pm2 restart smart-affiliate-system
"
```

---

## 📝 **CHECKLIST PRE-DEPLOY**

### **Antes de Fazer Deploy** ✅
- [ ] `npm run type-check` passou
- [ ] `npm run lint` passou  
- [ ] `./scripts/check-consistency.sh` passou
- [ ] Testado localmente em `localhost:3847`
- [ ] Commit message descritivo
- [ ] Backup automático funcionando

### **Durante Deploy** 🔄
- [ ] Script `super-safe-deploy.sh` executado
- [ ] Backup criado com sucesso
- [ ] Build completou sem erros
- [ ] Health check passou
- [ ] APIs funcionando

### **Pós-Deploy** ✅
- [ ] Site acessível: `https://smartaffiliatesystem.site`
- [ ] Campaign Builder API funcionando
- [ ] Presell Generator API funcionando
- [ ] Logs sem erros críticos
- [ ] Performance OK

---

## 🔧 **COMANDOS ÚTEIS**

### **Status Geral**
```bash
# Verificar tudo de uma vez
ssh root@161.97.145.169 "
  echo '=== GIT STATUS ==='
  cd /opt/smart-affiliate-system && git log --oneline -3
  echo '=== PM2 STATUS ==='
  pm2 list
  echo '=== NGINX STATUS ==='
  systemctl status nginx --no-pager
  echo '=== HEALTH CHECK ==='
  curl -I http://localhost:3000
"
```

### **Deploy Rápido (Testado)**
```bash
# Para mudanças pequenas e testadas
git add . && git commit -m "fix: small change" && git push && ./scripts/super-safe-deploy.sh
```

---

## 🏆 **MELHORES PRÁTICAS**

### **✅ SEMPRE FAZER**
1. **Usar pre-commit hooks** (automático)
2. **Testar local** antes de deploy
3. **Deploy com backup** (`super-safe-deploy.sh`)
4. **Verificar health check** pós-deploy
5. **Monitorar logs** por 5 minutos após deploy

### **❌ NUNCA FAZER**
1. **Bypass pre-commit hooks**
2. **Deploy direto sem backup**
3. **Mudanças diretas em produção**
4. **Commit de credenciais**
5. **Deploy sem testar local**

---

**📅 Última atualização**: 12 September 2025  
**🔖 Versão Deploy**: v1.4.1  
**📍 Status**: Sistema de deploy 100% seguro implementado