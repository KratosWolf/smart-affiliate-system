# ✅ CHECKLIST OBRIGATÓRIO PARA NOVAS FEATURES

## 🎯 **OBJETIVO**
Garantir que TODA nova feature passe por verificações obrigatórias para **NUNCA MAIS quebrar funcionalidades existentes**.

---

## 📋 **CHECKLIST OBRIGATÓRIO** *(NUNCA PULAR)*

### **ANTES DE COMEÇAR A FEATURE**
- [ ] **Criar branch específica**: `git checkout -b feature/nome-da-feature`
- [ ] **Executar verificação inicial**: `./scripts/check-consistency.sh`
- [ ] **Testar todos módulos**: `./scripts/test-all-modules.sh`
- [ ] **Confirmar que está 100% verde** antes de começar

### **DURANTE O DESENVOLVIMENTO**
- [ ] **Seguir arquitetura existente**: Não inventar novos padrões
- [ ] **Usar tipos TypeScript**: Sempre tipar everything
- [ ] **Validar com Zod**: Runtime validation obrigatória
- [ ] **Error boundaries**: Componentes com tratamento de erro
- [ ] **Testar incrementalmente**: A cada mudança, testar

### **ANTES DE CADA COMMIT**
```bash
# COMANDOS OBRIGATÓRIOS (ordem exata):
npm run type-check     # 1. Verificar TypeScript
npm run lint:fix       # 2. Corrigir linting  
npm run build          # 3. Testar build completo
./scripts/test-all-modules.sh  # 4. Testar todos módulos
```

**REGRA DE OURO**: Se QUALQUER comando falhar = **NÃO COMMITAR**

### **TESTE DE INTEGRAÇÃO OBRIGATÓRIO**
- [ ] **Testar rota nova** - Acessar e verificar funcionamento
- [ ] **Testar rotas existentes** - Garantir que não quebrou nada
- [ ] **Testar no mobile** - Responsividade OK
- [ ] **Testar APIs** - Endpoints funcionando
- [ ] **Testar fluxo completo** - Do início ao fim

### **ANTES DO MERGE**
- [ ] **Pull request** com descrição detalhada
- [ ] **Screenshots** da funcionalidade
- [ ] **Executar**: `./scripts/safe-deploy.sh` (deve passar 100%)
- [ ] **Code review** próprio linha por linha
- [ ] **Documentar** mudanças no dashboard-guide se necessário

---

## 🚨 **COMANDOS DE EMERGÊNCIA**

### **Se Quebrou Algo**
```bash
# 1. Reverter último commit
git reset --hard HEAD~1

# 2. Voltar para main
git checkout main

# 3. Verificar se main está OK
./scripts/test-all-modules.sh

# 4. Recomeçar feature do zero se necessário
```

### **Se Processes NPM Duplicados**
```bash
# Matar todos processos npm
pkill -f "npm run dev"

# Limpar cache
npm cache clean --force

# Restart limpo
npm run dev
```

### **Se Build Quebrou**
```bash
# 1. Verificar erros específicos
npm run build

# 2. Verificar TypeScript
npm run type-check

# 3. Verificar linting
npm run lint

# 4. Instalar dependências novamente
rm -rf node_modules package-lock.json
npm install
```

---

## 🛡️ **ARQUIVOS PROIBIDOS DE MODIFICAR** *(SEM AUTORIZAÇÃO)*

### **CRÍTICOS - NÃO TOCAR**
- `src/lib/mining/youtube-monitor.ts` ← **LÓGICA 5-7+ VEZES**
- `src/lib/config/api-config.ts` ← **CONFIGURAÇÃO APIS**
- `GOVERNANCE.md` ← **REGRAS DE GOVERNANÇA**
- `scripts/check-consistency.sh` ← **SCRIPT DE VERIFICAÇÃO**

### **CUIDADO EXTRA**
- `package.json` ← **Só versioning controlado**
- `.env.local` ← **Só se absolutamente necessário**
- `src/app/dashboard-guide/page.tsx` ← **Documentação principal**

---

## 📊 **FLUXO PERFEITO** *(COPIAR E COLAR)*

```bash
# 1. PREPARAÇÃO
git checkout main
git pull origin main
./scripts/check-consistency.sh

# 2. NOVA FEATURE
git checkout -b feature/minha-feature
./scripts/test-all-modules.sh

# 3. DESENVOLVIMENTO
# ... desenvolver ...
npm run type-check && npm run lint:fix && npm run build

# 4. COMMIT SEGURO
git add .
git commit -m "feat: minha nova feature"
# (pre-commit hook roda automaticamente)

# 5. TESTE FINAL
./scripts/safe-deploy.sh

# 6. MERGE
git checkout main
git merge feature/minha-feature
git push origin main
```

---

## 🏆 **BENEFÍCIOS GARANTIDOS**

✅ **Zero Breaking Changes** - Impossível quebrar funcionalidade existente  
✅ **Deploy Seguro** - Só deployar código 100% testado  
✅ **Consistência Permanente** - Arquitetura sempre respeitada  
✅ **Qualidade Garantida** - TypeScript + Linting + Build sempre OK  
✅ **Documentação Atualizada** - Mudanças sempre documentadas  

---

## ⚠️ **PENALIDADES POR NÃO SEGUIR**

1. **Pular checklist** = Commit será REJEITADO pelo pre-commit hook
2. **Forçar push com --no-verify** = Sistema pode quebrar em produção  
3. **Não testar módulos** = Outras funcionalidades podem parar
4. **Não seguir governança** = Projeto fica desorganizado novamente

---

**🎯 REGRA FINAL**: **"Se não está 100% verde, não commitamos"**

**📅 Criado**: 06 Janeiro 2025  
**🎯 Objetivo**: NUNCA MAIS quebrar uma feature ao criar outra  
**✅ Status**: OBRIGATÓRIO para todas as features