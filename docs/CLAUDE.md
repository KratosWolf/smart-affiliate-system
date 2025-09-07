# 🤖 CLAUDE.md - Instruções para Assistente IA

## 📋 **CONTEXTO PRINCIPAL DO PROJETO**

**Smart Affiliate System** é um sistema completo de marketing de afiliados com **lógica Discovery/Mining baseada na regra 5-7+ vezes** implementada.

### **🎯 LÓGICA PRINCIPAL IMPLEMENTADA** *(CRÍTICO - NÃO PERDER)*
1. **YouTube Review Channels** → Monitora canais de review (não anúncios)  
2. **5-7+ Times Rule** → Produtos mencionados 5-7+ vezes no MESMO canal = ALTA POTENCIALIDADE
3. **Cross-Channel Analysis** → Produtos em múltiplos canais = SUPER HIGH POTENTIAL
4. **Advertiser vs Producer Detection** → Identifica páginas de anunciantes vs produtores oficiais  
5. **Google Ads Transparency Spy** → Espiona anunciantes ativos e seus orçamentos
6. **Continuous Monitoring** → Monitora novos anunciantes entrando no mercado

---

## 🏗️ **ARQUITETURA TÉCNICA**

### **Stack Principal**:
- **Frontend**: Next.js 15.5.0 + TypeScript + Tailwind CSS + shadcn/ui
- **APIs**: Google Search API, YouTube Data API v3, Remove.bg API  
- **Deploy**: VPS Próprio (produção) + Hostinger FTP (presells)
- **Storage**: JSON local + localStorage para persistência
- **Governança**: Sistema automatizado de consistência implementado

### **Módulos Operacionais (8/8 ativos)**:
1. **Discovery/Mining** - Lógica 5-7+ vezes implementada
2. **Validation** - Google Search API para validação  
3. **Intelligence** - Análise de competidores e market insights
4. **Presell Generator** - 6 templates otimizados
5. **Campaign Builder** - Google Ads CSV automático
6. **Tracking** - ROI e métricas em tempo real
7. **Channel Converter** - Utility para múltiplas fontes
8. **Dashboard Guide** - Documentação integrada

---

## 🔑 **APIS CONFIGURADAS E FUNCIONANDO**

```env
# APIs Reais Ativas
GOOGLE_API_KEY=AIzaSyDGtmJOvV4yLvQZX-o2V2Gl2TF0xvZUGRU
GOOGLE_SEARCH_ENGINE_ID=24e3f9b2e3bb24799
YOUTUBE_API_KEY=(mesma chave Google)
REMOVEBG_API_KEY=RDKyALFbkDxS5ovoNLbt1T75

# FTP Deploy Ativo  
FTP_HOST=mediumblue-monkey-640112.hostingersite.com
FTP_USER=u973230760.bestbargains24x7.com
FTP_PASSWORD=FTPBestBargains2025#Main!

# VPS Deploy Ativo
VPS_HOST=161.97.145.169
VPS_USER=root
VPS_PASSWORD=CQK6njr3wjthvp2dmf
```

---

## 🎯 **ARQUIVOS CRÍTICOS - IMPLEMENTAÇÃO 5-7+ VEZES**

### **📍 ARQUIVO PRINCIPAL**:
**`/src/lib/mining/youtube-monitor.ts`** ← **LÓGICA CRÍTICA IMPLEMENTADA**

**Métodos Implementados**:
```typescript
✅ analyzeChannelProductPattern() - Detecta produtos 5-7+ vezes no mesmo canal
✅ analyzeCrossChannelConsistency() - Produtos cross-channel  
✅ analyzeAdvertiserVsProducer() - Classifica advertiser vs producer pages
✅ spyOnAdvertisers() - Google Ads transparency spying
✅ monitorNewAdvertisers() - Continuous competitor monitoring
✅ extractAdKeywords() - Extrai palavras-chave de anúncios
✅ classifyPageType() - Classifica páginas com confidence score
```

### **📊 Canais YouTube Configurados** *(DO USUÁRIO)*:
```typescript
'UCmm7RPs7Zjr7CzVK-zQk3YQ',  // @butecohits4948 - Buteco Hits
'UCKgL0SJkciM_m6TFSArmxmg',  // @LizyRomance  
'UCQWMcsQb99i1pJ9YnBC1DxQ',  // @val_le
'UCA-1Nsp3jfX4Sjpcn7M0Atw',  // @legitdiv
'UCNTp2RUykGHhWbQajgMCFVA',  // @wrestlingfullhd
'UCQbeTU9vgvDOCfbNDv_Wosw',  // @wrestlingbest1
'UC_jt6xXBPVCDEjde7WxpTUA',  // @RookieSubs
```

---

## 📋 **COMANDOS ESSENCIAIS**

### **Desenvolvimento**:
```bash
npm run dev          # Servidor desenvolvimento (localhost:3000)
npm run build        # Build para produção  
npm run start        # Servidor produção
npm run lint         # Verificação ESLint
npm run type-check   # Verificação TypeScript
```

### **Governança e Consistência**:
```bash
./scripts/check-consistency.sh    # Verificação automática de consistência
git add . && git commit -m "..."  # Commit com verificação pre-commit
```

### **Deploy & Backup**:
```bash
# Backup com tag
git add .
git commit -m "Update: descrição da mudança"
git tag -a v1.4.x -m "Versão com funcionalidade X"
git push origin main --tags

# Deploy automático 
npx vercel --prod     # Deploy para produção Vercel
```

---

## 🛡️ **SISTEMA DE GOVERNANÇA IMPLEMENTADO**

### **Arquivos de Governança**:
- `GOVERNANCE.md` - Regras obrigatórias de organização
- `scripts/check-consistency.sh` - Script de verificação automática
- `docs/CHANGELOG.md` - Histórico versionado completo

### **Verificações Automáticas**:
✅ Versionamento consistente (package.json ↔ README.md)  
✅ Estrutura de pastas organizada (docs/, backup/, src/)  
✅ Documentação centralizada em docs/  
✅ Prevenção de arquivos .md na raiz  
✅ Processos npm sob controle

---

## 🛠️ **RESOLUÇÃO DE PROBLEMAS**

### **❌ Problema Comum: "Funcionalidades perdidas"**
**Solução**:
1. Verificar `/src/lib/mining/youtube-monitor.ts` - lógica 5-7+ vezes
2. Testar APIs em `/src/lib/config/api-config.ts`  
3. Verificar documentação em `/dashboard-guide`
4. Executar `./scripts/check-consistency.sh`

### **❌ APIs não funcionando**:
1. Verificar `.env.local` com credenciais corretas
2. Testar endpoint `/api/test-google-api`  
3. Verificar rate limiting (1000ms delays implementados)

### **❌ Deploy FTP falhando**:
1. Verificar credenciais FTP em `.env.local`
2. Testar conexão com `hostingerDeploy.testConnection()`
3. Verificar `hostinger-ftp-deploy.ts`

### **❌ VPS Deploy Issues**:
1. Verificar conexão SSH: `ssh root@161.97.145.169`
2. Verificar processos: `pm2 list`
3. Restart aplicação: `pm2 restart smart-affiliate-system`

---

## 📊 **STATUS ATUAL DO SISTEMA**

```
✅ Discovery/Mining 5-7+ vezes: IMPLEMENTADO  
✅ Cross-channel analysis: IMPLEMENTADO
✅ Advertiser vs Producer detection: IMPLEMENTADO  
✅ Google Ads Transparency spy: IMPLEMENTADO
✅ Continuous advertiser monitoring: IMPLEMENTADO
✅ APIs Google/YouTube: CONFIGURADAS E ATIVAS
✅ FTP Deploy sistema: CONFIGURADO  
✅ VPS Deploy sistema: CONFIGURADO
✅ 6 Templates Presell: ATIVOS
✅ Dashboard-guide: ATUALIZADO COM NOVA LÓGICA
✅ Sistema de Governança: IMPLEMENTADO
✅ Arquitetura refatorada: SEM HYDRATION ERRORS
✅ All modules tested: FUNCIONANDO 100%
```

**✅ Completo**:
- Sistema de governança automático
- Versionamento unificado 
- Estrutura de pastas organizada
- Documentação centralizada
- Zero processos npm duplicados
- All functionality tests passed

---

## 🎯 **INSTRUÇÕES PARA CLAUDE**

### **🚨 SEMPRE FAZER**:
1. **Executar ./scripts/check-consistency.sh** antes de qualquer mudança importante
2. **Verificar dashboard-guide** antes de dizer que algo não existe
3. **Consultar youtube-monitor.ts** para lógica Discovery/Mining
4. **Seguir GOVERNANCE.md** para todas as modificações  
5. **Testar APIs** usando endpoints `/api/test-*`

### **❌ NUNCA FAZER**:
- Dizer que lógica 5-7+ vezes não está implementada (ESTÁ em youtube-monitor.ts)
- Ignorar os 7 canais YouTube configurados pelo usuário
- Criar arquivos .md na raiz (apenas README.md, GOVERNANCE.md, CHANGELOG.md permitidos)
- Reimplementar funcionalidades que já existem
- Fazer mudanças sem verificar impacto nos arquivos críticos  

### **💡 ANTES DE RESPONDER**:
1. Ler `/src/app/dashboard-guide/page.tsx` para status atual
2. Verificar `/src/lib/mining/youtube-monitor.ts` para funcionalidades  
3. Consultar `docs/CHANGELOG.md` para histórico
4. Executar script de consistência se necessário

---

## 🌐 **LINKS IMPORTANTES**

- **🌐 Produção (Site Oficial)**: https://smartaffiliatesystem.site
- **🔧 GitHub**: https://github.com/KratosWolf/smart-affiliate-system  
- **📁 FTP Presells**: bestbargains24x7.com (subpastas por produto)
- **📚 Dashboard**: /dashboard-guide (documentação completa)
- **🖥️ VPS**: 161.97.145.169 (PM2 + Nginx)

---

**📅 Última atualização**: 06 Janeiro 2025  
**🔖 Versão atual**: v1.4.1 - Sistema Completo + Governança Implementada  
**📍 Status**: ✅ Sistema 100% operacional + organizacional

*Este arquivo garante que o Claude entenda completamente o contexto e siga as regras de governança implementadas.*