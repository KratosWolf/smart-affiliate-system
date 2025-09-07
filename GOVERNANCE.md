# 🛡️ SISTEMA DE GOVERNANÇA - SMART AFFILIATE SYSTEM

## 🎯 **OBJETIVO**
Garantir que o projeto permaneça SEMPRE organizado, sem duplicidades, com versionamento consistente e documentação atualizada.

---

## 📋 **REGRAS OBRIGATÓRIAS**

### **1. VERSIONAMENTO ÚNICO** ⚠️ CRÍTICO
- **SEMPRE** manter a mesma versão em:
  - `package.json` (version field)
  - `README.md` (## Version section)
  - `src/app/dashboard-guide/page.tsx` (v1.x.x display)
  - `docs/CHANGELOG.md` (latest entry)

### **2. ESTRUTURA DE PASTAS FIXA** 🔒
```
NUNCA CRIAR ARQUIVOS .MD NA RAIZ!
✅ docs/           # TODA documentação aqui
✅ backup/         # Arquivos antigos preservados
✅ src/            # Código fonte apenas
❌ raiz/          # PROIBIDO arquivos .md exceto README.md
```

### **3. DOCUMENTAÇÃO CENTRALIZADA** 📚
- **PONTO ÚNICO**: `/docs/README.md` como índice principal
- **VERSIONAMENTO**: Sempre criar pasta `docs/versions/vX.Y/`
- **CHANGELOG**: Obrigatório atualizar a cada mudança
- **BACKUP**: Preservar versões antigas em `backup/`

### **4. NAMING CONVENTIONS** 📝
```
Arquivos:
- kebab-case.md (documentos)
- PascalCase.tsx (componentes)
- camelCase.ts (utilities)

Pastas:
- kebab-case/ (todas as pastas)
- MAIÚSCULA/ apenas para backup/

Commits:
- feat: nova funcionalidade
- fix: correção de bug  
- docs: atualização documentação
- refactor: reestruturação código
```

---

## 🤖 **AUTOMAÇÕES DE GOVERNANÇA**

### **Script de Verificação de Consistência**
```bash
#!/bin/bash
# scripts/check-consistency.sh

echo "🔍 Verificando consistência do projeto..."

# 1. Verificar versioning
PACKAGE_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)
README_VERSION=$(grep -o "v[0-9]\+\.[0-9]\+\.[0-9]\+" README.md | head -1)

if [ "$PACKAGE_VERSION" != "${README_VERSION:1}" ]; then
    echo "❌ ERRO: Versões inconsistentes!"
    echo "   package.json: $PACKAGE_VERSION"  
    echo "   README.md: $README_VERSION"
    exit 1
fi

# 2. Verificar arquivos .md na raiz
MD_COUNT=$(find . -maxdepth 1 -name "*.md" | grep -v README.md | wc -l)
if [ $MD_COUNT -gt 0 ]; then
    echo "❌ ERRO: Arquivos .md encontrados na raiz!"
    find . -maxdepth 1 -name "*.md" | grep -v README.md
    exit 1
fi

# 3. Verificar estrutura docs/
if [ ! -d "docs" ]; then
    echo "❌ ERRO: Pasta docs/ não existe!"
    exit 1
fi

echo "✅ Projeto consistente e organizado!"
```

### **Hook Pre-commit**
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🛡️ Executando verificações de governança..."

# Executar script de consistência
./scripts/check-consistency.sh

if [ $? -ne 0 ]; then
    echo "❌ Commit bloqueado - corrija as inconsistências primeiro!"
    exit 1
fi

echo "✅ Governança OK - commit permitido"
```

---

## 📊 **PROCESSO DE VERSIONAMENTO**

### **Quando Incrementar Versão**
- **PATCH** (1.4.1 → 1.4.2): Bug fixes, correções menores
- **MINOR** (1.4.2 → 1.5.0): Novas funcionalidades  
- **MAJOR** (1.5.0 → 2.0.0): Breaking changes, reestruturação

### **Checklist Obrigatório para Nova Versão**
```markdown
- [ ] Atualizar package.json
- [ ] Atualizar README.md  
- [ ] Atualizar dashboard-guide
- [ ] Criar entrada no CHANGELOG.md
- [ ] Criar pasta docs/versions/vX.Y/
- [ ] Executar script check-consistency.sh
- [ ] Commit com tag: git tag vX.Y.Z
```

---

## 🚨 **ALERTAS E MONITORAMENTO**

### **Situações que EXIGEM Atenção**
1. **Versionamento Inconsistente**: Verificação automática
2. **Arquivos .md na Raiz**: Detecção automática  
3. **Documentação Desatualizada**: Review mensal
4. **Código sem Documentação**: Review por funcionalidade

### **Responsabilidades**
- **Desenvolvedor**: Seguir regras de naming e estrutura
- **Sistema**: Verificações automáticas pre-commit
- **Review**: Checklist obrigatório para mudanças importantes

---

## 🏆 **BENEFÍCIOS GARANTIDOS**

✅ **Zero Duplicidades**: Estrutura clara impede duplicação  
✅ **Versionamento Consistente**: Verificação automática  
✅ **Documentação Atualizada**: Processo obrigatório  
✅ **Organização Permanente**: Regras claras e automação  
✅ **Manutenibilidade**: Estrutura previsível sempre

---

**📅 Implementado**: $(date)  
**🔄 Versão**: 1.0  
**👨‍💻 Responsável**: Sistema de Governança Automático

*Este arquivo é CRÍTICO - não mover ou deletar!*