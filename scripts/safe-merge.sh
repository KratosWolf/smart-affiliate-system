#!/bin/bash
# 🔀 SAFE MERGE SYSTEM - Merge Seguro com Validação Total
# Garante que branch só faz merge se passar em TODAS as verificações

echo "🔀 Safe Merge System - Validação Total"
echo "======================================"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

ERRORS=0

# Função para executar comando e verificar resultado
run_check() {
    local description=$1
    local command=$2
    local critical=${3:-true}
    
    echo -e "${BLUE}🔍 $description${NC}"
    
    if eval "$command"; then
        echo -e "${GREEN}   ✅ Passou${NC}"
        return 0
    else
        echo -e "${RED}   ❌ Falhou${NC}"
        if [ "$critical" = true ]; then
            ERRORS=$((ERRORS + 1))
        fi
        return 1
    fi
}

# Função para verificar branch atual
check_current_branch() {
    local current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        echo -e "${RED}❌ ERRO: Você está na branch main!${NC}"
        echo -e "${YELLOW}   → Use este script apenas em feature branches${NC}"
        echo -e "${YELLOW}   → Para criar nova branch: npm run branch nome-da-feature${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Branch atual: $current_branch${NC}"
    return 0
}

# Função para fazer backup antes de merge
create_merge_backup() {
    local current_branch=$(git branch --show-current)
    local timestamp=$(date +"%Y%m%d-%H%M%S")
    local backup_tag="merge-backup-$current_branch-$timestamp"
    
    echo -e "${BLUE}💾 Criando backup antes do merge...${NC}"
    git tag -a "$backup_tag" -m "Backup before merging $current_branch"
    git push origin --tags
    echo -e "${GREEN}✅ Backup criado: $backup_tag${NC}"
}

# Função principal de validação
validate_for_merge() {
    echo -e "${PURPLE}🛡️ EXECUTANDO VALIDAÇÕES OBRIGATÓRIAS${NC}"
    echo "============================================="
    
    # 1. VERIFICAR CONSISTÊNCIA
    run_check "Verificando consistência do projeto" "./scripts/check-consistency.sh"
    
    # 2. LIMPAR PROCESSOS NPM
    run_check "Limpando processos NPM duplicados" "npm run clean:npm" false
    
    # 3. INSTALAR DEPENDÊNCIAS
    run_check "Verificando dependências" "npm install"
    
    # 4. TYPESCRIPT CHECK
    run_check "Verificando TypeScript" "npm run type-check"
    
    # 5. LINTING
    run_check "Verificando ESLint" "npm run lint"
    
    # 6. BUILD COMPLETO
    run_check "Testando build completo" "npm run build"
    
    # 7. TESTAR TODOS MÓDULOS
    run_check "Testando todos os módulos" "./scripts/test-all-modules.sh"
    
    # 8. VERIFICAR SE MAIN ESTÁ ATUALIZADA
    echo -e "${BLUE}🔄 Verificando se main está atualizada...${NC}"
    git fetch origin main
    
    local commits_behind=$(git rev-list --count HEAD..origin/main)
    if [ $commits_behind -gt 0 ]; then
        echo -e "${YELLOW}⚠️ Sua branch está $commits_behind commits atrás da main${NC}"
        read -p "Fazer rebase com main? (recomendado) (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git rebase origin/main
            if [ $? -ne 0 ]; then
                echo -e "${RED}❌ Conflito no rebase! Resolva manualmente${NC}"
                ERRORS=$((ERRORS + 1))
            fi
        else
            echo -e "${YELLOW}⚠️ Continuando sem rebase (não recomendado)${NC}"
        fi
    fi
    
    return $ERRORS
}

# Função para executar merge
execute_merge() {
    local current_branch=$(git branch --show-current)
    
    echo -e "${PURPLE}🔀 EXECUTANDO MERGE SEGURO${NC}"
    echo "================================="
    
    # Mudar para main
    echo -e "${BLUE}🔄 Mudando para branch main...${NC}"
    git checkout main
    git pull origin main
    
    # Fazer merge
    echo -e "${BLUE}🔀 Fazendo merge de '$current_branch'...${NC}"
    git merge --no-ff "$current_branch" -m "feat: merge $current_branch
    
    ✅ Todas as verificações passaram
    🧪 Todos os módulos testados
    🏗️ Build OK
    🛡️ Governança verificada"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Merge realizado com sucesso!${NC}"
        
        # Push para origin
        git push origin main
        
        # Deletar branch local e remota
        read -p "Deletar branch '$current_branch'? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git branch -d "$current_branch"
            git push origin --delete "$current_branch"
            echo -e "${GREEN}✅ Branch '$current_branch' deletada${NC}"
        fi
        
        return 0
    else
        echo -e "${RED}❌ Falha no merge!${NC}"
        git checkout "$current_branch"
        return 1
    fi
}

# MAIN SCRIPT
main() {
    echo -e "${BLUE}🌳 SMART SAFE MERGE SYSTEM${NC}"
    echo "=============================="
    
    # Verificar se está em feature branch
    check_current_branch
    
    local current_branch=$(git branch --show-current)
    echo -e "${YELLOW}📋 Preparando merge de: '$current_branch' → main${NC}"
    echo ""
    
    # Executar todas as validações
    if validate_for_merge; then
        echo ""
        echo -e "${GREEN}🎉 TODAS AS VALIDAÇÕES PASSARAM!${NC}"
        echo -e "${GREEN}✅ Branch está segura para merge${NC}"
        echo ""
        
        # Criar backup
        create_merge_backup
        
        # Perguntar se quer continuar com merge
        read -p "🔀 Executar merge agora? (y/n): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            execute_merge
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}🎉 MERGE CONCLUÍDO COM SUCESSO!${NC}"
                echo -e "${GREEN}✅ Sistema permanece estável${NC}"
                echo -e "${GREEN}🚀 Pronto para deploy${NC}"
            else
                echo -e "${RED}❌ Falha no merge - verifique conflitos${NC}"
            fi
        else
            echo -e "${YELLOW}⏸️ Merge cancelado - branch preservada${NC}"
        fi
    else
        echo ""
        echo -e "${RED}💥 MERGE BLOQUEADO!${NC}"
        echo -e "${RED}❌ $ERRORS validações falharam${NC}"
        echo -e "${RED}🛠️ Corrija os problemas antes de tentar merge${NC}"
        echo ""
        echo -e "${YELLOW}💡 Comandos úteis:${NC}"
        echo -e "${YELLOW}   → npm run type-check    # Verificar TypeScript${NC}"
        echo -e "${YELLOW}   → npm run lint:fix      # Corrigir linting${NC}"
        echo -e "${YELLOW}   → npm run build         # Testar build${NC}"
        echo -e "${YELLOW}   → npm run test:modules  # Testar módulos${NC}"
        exit 1
    fi
}

# Executar script
main "$@"