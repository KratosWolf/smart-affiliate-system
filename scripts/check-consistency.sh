#!/bin/bash
# 🛡️ Script de Verificação de Consistência do Projeto
# Garante que versionamento, estrutura e documentação estão corretos

echo "🔍 Verificando consistência do Smart Affiliate System..."
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Verificar versioning consistente
echo "📋 Verificando versionamento..."
PACKAGE_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)

if [ -f "README.md" ]; then
    README_VERSION=$(grep -o "v[0-9]\+\.[0-9]\+\.[0-9]\+" README.md | head -1 | sed 's/v//')
    if [ "$PACKAGE_VERSION" != "$README_VERSION" ]; then
        echo -e "${RED}❌ ERRO: Versões inconsistentes!${NC}"
        echo "   package.json: $PACKAGE_VERSION"  
        echo "   README.md: v$README_VERSION"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ Versionamento consistente: v$PACKAGE_VERSION${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  README.md não encontrado${NC}"
fi

# 2. Verificar arquivos .md na raiz (exceto permitidos)
echo "📁 Verificando arquivos .md na raiz..."
ALLOWED_FILES="README.md|GOVERNANCE.md|CHANGELOG.md"
MD_FILES=$(find . -maxdepth 1 -name "*.md" | grep -vE "($ALLOWED_FILES)" | wc -l)

if [ $MD_FILES -gt 0 ]; then
    echo -e "${RED}❌ ERRO: Arquivos .md não permitidos na raiz:${NC}"
    find . -maxdepth 1 -name "*.md" | grep -vE "($ALLOWED_FILES)"
    echo "   → Mover para docs/ ou backup/"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Estrutura de arquivos .md correta${NC}"
fi

# 3. Verificar estrutura de pastas essenciais
echo "🏗️  Verificando estrutura de pastas..."
REQUIRED_DIRS="docs src backup"
for dir in $REQUIRED_DIRS; do
    if [ ! -d "$dir" ]; then
        echo -e "${RED}❌ ERRO: Pasta obrigatória '$dir' não existe!${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ Pasta '$dir' encontrada${NC}"
    fi
done

# 4. Verificar se docs/ tem estrutura mínima
echo "📚 Verificando estrutura docs/..."
if [ -d "docs" ]; then
    if [ ! -f "docs/README.md" ] && [ ! -f "docs/CHANGELOG.md" ]; then
        echo -e "${YELLOW}⚠️  docs/ existe mas falta documentação básica${NC}"
    else
        echo -e "${GREEN}✅ Documentação básica presente${NC}"
    fi
fi

# 5. Verificar processos npm duplicados
echo "⚙️  Verificando processos Node.js..."
NODE_PROCESSES=$(ps aux | grep "npm run dev" | grep -v grep | wc -l)
if [ $NODE_PROCESSES -gt 1 ]; then
    echo -e "${YELLOW}⚠️  $NODE_PROCESSES processos 'npm run dev' rodando${NC}"
    echo "   → Considere matar processos desnecessários"
else
    echo -e "${GREEN}✅ Processos Node.js sob controle${NC}"
fi

# 6. Verificar .gitignore
echo "🔐 Verificando .gitignore..."
if [ ! -f ".gitignore" ]; then
    echo -e "${RED}❌ ERRO: .gitignore não encontrado!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ .gitignore presente${NC}"
fi

# Resultado final
echo "=================================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 PROJETO 100% CONSISTENTE E ORGANIZADO!${NC}"
    echo -e "${GREEN}✅ Todas as verificações passaram${NC}"
    exit 0
else
    echo -e "${RED}💥 ENCONTRADOS $ERRORS PROBLEMAS DE CONSISTÊNCIA${NC}"
    echo -e "${RED}❌ Corrija os problemas antes de continuar${NC}"
    exit 1
fi