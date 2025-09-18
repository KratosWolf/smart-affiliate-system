# 📁 PROJETO 100% ORGANIZADO - SMART AFFILIATE SYSTEM

## 🎯 **FOCO ÚNICO: GOOGLE ADS PARA USO PESSOAL**
- Sistema exclusivo para **10 campanhas/dia max**
- **APENAS Google Ads** (não é SaaS)
- Keywords simples: `productname` + `PRODUCTNAME`
- Port personalizado: **localhost:3847**

---

## 📂 **ESTRUTURA ATUAL DO PROJETO**

```
smart-affiliate-system/
├── 📁 src/                    # Código fonte principal
│   ├── app/                   # Next.js App Router
│   ├── components/            # Componentes React
│   ├── lib/                   # Lógica de negócio
│   └── hooks/                 # React hooks customizados
│
├── 📁 docs/                   # DOCUMENTAÇÃO CENTRALIZADA
│   ├── PROJECT-ORGANIZATION.md   # Este arquivo
│   ├── API-REFERENCE.md          # Documentação APIs
│   ├── DEPLOYMENT-GUIDE.md       # Guia deploy seguro
│   └── CLAUDE.md                 # Instruções para Claude
│
├── 📁 scripts/                # Scripts de automação
│   ├── super-safe-deploy.sh     # Deploy com backup automático
│   ├── check-consistency.sh     # Verificação consistência
│   ├── test-all-modules.sh      # Testes completos
│   └── production-deploy.sh     # Deploy produção
│
├── 📁 .githooks/             # Git hooks obrigatórios
│   └── pre-commit              # Verificação TypeScript obrigatória
│
├── 📁 public/                # Assets públicos
│   └── screenshots/           # Screenshots produtos organizados
│
└── 📁 tests/                 # Testes automatizados
```

---

## 🛡️ **SISTEMAS DE SEGURANÇA IMPLEMENTADOS**

### **✅ Pre-Commit Hooks** (OBRIGATÓRIO)
```bash
# Localização: .githooks/pre-commit
# Executa automaticamente antes de cada commit
✅ Verificação TypeScript (ZERO ERROS obrigatório)
✅ Não permite bypass
✅ Bloqueia commits com problemas
```

### **✅ Super Safe Deploy System**
```bash
# Script: scripts/super-safe-deploy.sh
✅ Backup completo automático (code + build + metadata)
✅ Rollback automático em caso de falha
✅ Timestamps únicos para cada backup
✅ Health checks pós-deploy
✅ Armazenamento em /opt/backups/smart-affiliate-system/
```

### **✅ Consistency Checks**
```bash
# Script: scripts/check-consistency.sh
✅ Verifica versionamento (package.json ↔ README.md)
✅ Estrutura de pastas organizada
✅ Documentação atualizada
✅ Prevenção de arquivos .md na raiz
```

---

## 🔧 **COMANDOS ORGANIZADOS POR CATEGORIA**

### **Desenvolvimento Local**
```bash
npm run dev              # Servidor desenvolvimento (porta 3847)
npm run build            # Build otimizado para produção
npm run type-check       # Verificação TypeScript manual
npm run lint             # Verificação ESLint
```

### **Testes e Qualidade**
```bash
./scripts/test-all-modules.sh     # Testa todos os módulos
./scripts/check-consistency.sh    # Verifica consistência projeto
npm run governance                 # Executa verificações governança
```

### **Deploy Seguro**
```bash
./scripts/super-safe-deploy.sh    # Deploy com backup automático
./scripts/production-deploy.sh    # Deploy direto produção (cuidado!)
npm run deploy:safe               # Alias para deploy seguro
```

### **Backup e Recovery**
```bash
# Backups automáticos em /opt/backups/smart-affiliate-system/
# Formato: backup_YYYYMMDD_HHMMSS/
# Contém: código + build + git state + metadata
```

---

## 🎯 **GOOGLE ADS - ESPECIFICAÇÕES TÉCNICAS**

### **Campaign Builder API**
```
Endpoint: POST /api/v1/campaign
Port: localhost:3847 (local) | smartaffiliatesystem.site (prod)
Status: ✅ 100% Funcional

Keywords Strategy:
- glicoshield (lowercase)
- GLICOSHIELD (uppercase)
- SIMPLES e EFETIVO
```

### **Presell Generator API**
```
Endpoint: POST /api/v1/presell
Template: cookie (único funcional)
Output: HTML + CSS + JS completo
Status: ✅ 100% Funcional
```

### **Metodologia Luiz Implementada**
```
✅ Estrutura: 1 Campaign = 1 Ad
✅ Budget: R$ 70/dia (automático)
✅ CPA Target: $45 (45% da comissão)
✅ 12 Headlines + 4 Descriptions
✅ 6 CSVs prontos para Google Ads import
```

---

## 📊 **STATUS DE CADA MÓDULO**

| Módulo | Status | Funcionalidade | Prioridade |
|--------|--------|---------------|------------|
| Campaign Builder | ✅ 100% | CSV Google Ads | CRÍTICA |
| Presell Generator | ✅ 90% | Template cookie | ALTA |
| Discovery Mining | ⚠️ 70% | Melhorar produtos não-óbvios | MÉDIA |
| Validation Engine | ✅ 85% | Google Search API | ALTA |
| Intelligence | ⚠️ 60% | Merge com Discovery | BAIXA |
| Channel Converter | ❌ 30% | Necessita correção | BAIXA |
| Dashboard Guide | ✅ 100% | Documentação | ALTA |

---

## 🚀 **ROADMAP DE MELHORIAS**

### **PRÓXIMAS IMPLEMENTAÇÕES** (Por prioridade)
1. **🤖 AI Integration no Campaign Builder** (manter keywords simples)
2. **🔍 Discovery Mining 2.0** (produtos não-óbvios)
3. **📊 Google Ads Tracking Module** (ROI em tempo real)
4. **🛠️ Channel Converter Fix**

### **GUIDELINES DE DESENVOLVIMENTO**
- ✅ **SEMPRE** executar `npm run type-check` antes de commit
- ✅ **SEMPRE** usar `./scripts/super-safe-deploy.sh` para deploy
- ✅ **NUNCA** fazer mudanças diretas em produção
- ✅ **SEMPRE** manter keywords simples (lowercase + UPPERCASE)
- ✅ **SEMPRE** focar apenas em Google Ads

---

## 📝 **DOCUMENTAÇÃO OBRIGATÓRIA**

### **Para Claude IA**
- Localização: `docs/CLAUDE.md`
- Instruções completas sobre o sistema
- APIs funcionando e configuração

### **Para Deploy**
- Localização: `docs/DEPLOYMENT-GUIDE.md`
- Procedimentos seguros de deploy
- Scripts de backup e recovery

### **Para APIs**
- Localização: `docs/API-REFERENCE.md`
- Documentação completa das APIs
- Exemplos de uso e responses

---

## 🔍 **COMO USAR ESTE SISTEMA**

### **Para Desenvolvimento**
1. `git pull origin main`
2. `npm install`
3. `npm run type-check` (verificar se está OK)
4. `npm run dev` (roda na porta 3847)
5. Fazer mudanças
6. `git add .` → Pre-commit hook executa automaticamente
7. `git commit -m "sua mensagem"`

### **Para Deploy**
1. `./scripts/super-safe-deploy.sh`
2. Script faz backup automático
3. Deploy com health checks
4. Rollback automático se falhar

### **Para Emergência**
1. Acessar `/opt/backups/smart-affiliate-system/`
2. Escolher backup mais recente
3. Executar rollback automático

---

**📅 Última atualização**: 12 September 2025  
**🔖 Versão**: v1.4.1 - Sistema 100% Organizado  
**📍 Status**: ✅ Projeto completamente documentado e seguro