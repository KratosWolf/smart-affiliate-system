#!/bin/bash
# 🌳 SMART BRANCHING SYSTEM - Criação Automática de Branches por Nível de Risco
# Analisa automaticamente o risco da feature e cria branch apropriado

echo "🌳 Smart Branching System - Análise de Risco Automática"
echo "======================================================"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Função para analisar risco
analyze_risk() {
    local feature_name=$1
    local risk_level="low"
    local branch_prefix=""
    
    echo -e "${BLUE}🔍 Analisando risco da feature: '$feature_name'${NC}"
    
    # PALAVRAS-CHAVE DE ALTO RISCO
    HIGH_RISK_KEYWORDS=(
        "mining" "youtube-monitor" "api-config" "database" "auth" 
        "payment" "security" "deploy" "migration" "core" "critical"
        "campaign-builder" "presell-generator" "validation" "discovery"
    )
    
    # PALAVRAS-CHAVE DE MÉDIO RISCO  
    MEDIUM_RISK_KEYWORDS=(
        "component" "page" "route" "style" "ui" "form" "modal"
        "dashboard" "analytics" "tracking" "integration"
    )
    
    # PALAVRAS-CHAVE DE BAIXO RISCO
    LOW_RISK_KEYWORDS=(
        "text" "copy" "color" "font" "spacing" "margin" "padding"
        "readme" "docs" "comment" "log" "debug"
    )
    
    # Analisar palavras-chave
    for keyword in "${HIGH_RISK_KEYWORDS[@]}"; do
        if [[ "$feature_name" == *"$keyword"* ]]; then
            risk_level="high"
            branch_prefix="hotfix"
            break
        fi
    done
    
    if [[ "$risk_level" == "low" ]]; then
        for keyword in "${MEDIUM_RISK_KEYWORDS[@]}"; do
            if [[ "$feature_name" == *"$keyword"* ]]; then
                risk_level="medium"
                branch_prefix="feature"
                break
            fi
        done
    fi
    
    if [[ "$risk_level" == "low" ]]; then
        branch_prefix="minor"
    fi
    
    echo "$risk_level:$branch_prefix"
}

# Função para verificar estado do repositório
check_repo_state() {
    echo -e "${BLUE}🔍 Verificando estado do repositório...${NC}"
    
    # Verificar se há mudanças não commitadas
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${RED}❌ ERRO: Há mudanças não commitadas!${NC}"
        echo -e "${YELLOW}   → Execute: git add . && git commit -m 'WIP: salvando progresso'${NC}"
        echo -e "${YELLOW}   → Ou execute: git stash${NC}"
        return 1
    fi
    
    # Verificar se está na main
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        echo -e "${YELLOW}⚠️ Você não está na branch main (está em: $current_branch)${NC}"
        read -p "Mudar para main? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git checkout main
            git pull origin main
        fi
    fi
    
    return 0
}

# Função para criar branch baseado no risco
create_smart_branch() {
    local feature_name=$1
    local risk_info=$(analyze_risk "$feature_name")
    local risk_level=$(echo "$risk_info" | cut -d':' -f1)
    local branch_prefix=$(echo "$risk_info" | cut -d':' -f2)
    
    # Timestamp para uniqueness
    local timestamp=$(date +"%m%d")
    local branch_name="${branch_prefix}/${feature_name}-${timestamp}"
    
    echo -e "${PURPLE}📊 ANÁLISE DE RISCO COMPLETA:${NC}"
    echo "   Feature: $feature_name"
    echo "   Nível de Risco: $risk_level"
    echo "   Tipo de Branch: $branch_prefix"
    echo "   Branch Name: $branch_name"
    echo ""
    
    # Mostrar descrição do risco
    case $risk_level in
        "high")
            echo -e "${RED}🚨 RISCO ALTO - FEATURE CRÍTICA${NC}"
            echo "   → Afeta módulos core do sistema"
            echo "   → Requer backup automático antes de começar"
            echo "   → Testes extensivos obrigatórios"
            echo "   → Review obrigatório antes de merge"
            ;;
        "medium") 
            echo -e "${YELLOW}⚠️ RISCO MÉDIO - FEATURE PADRÃO${NC}"
            echo "   → Afeta funcionalidades existentes"
            echo "   → Testes automáticos obrigatórios"
            echo "   → Verificação de integração necessária"
            ;;
        "low")
            echo -e "${GREEN}✅ RISCO BAIXO - MUDANÇA MENOR${NC}"
            echo "   → Impacto mínimo no sistema"
            echo "   → Testes básicos suficientes"
            echo "   → Merge rápido permitido"
            ;;
    esac
    
    echo ""
    read -p "Criar branch '$branch_name'? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # BACKUP AUTOMÁTICO PARA HIGH RISK
        if [ "$risk_level" == "high" ]; then
            echo -e "${BLUE}🔄 Criando backup automático (risco alto)...${NC}"
            git tag -a "backup-before-$feature_name-$(date +%Y%m%d-%H%M)" -m "Backup before high-risk feature: $feature_name"
            git push origin --tags
            echo -e "${GREEN}✅ Backup criado e enviado para GitHub${NC}"
        fi
        
        # Criar e mudar para branch
        git checkout -b "$branch_name"
        git push -u origin "$branch_name"
        
        echo -e "${GREEN}✅ Branch '$branch_name' criado com sucesso!${NC}"
        
        # Executar verificações iniciais
        echo -e "${BLUE}🧪 Executando verificações iniciais...${NC}"
        npm run governance
        npm run test:modules
        
        return 0
    else
        echo -e "${YELLOW}⏸️ Operação cancelada${NC}"
        return 1
    fi
}

# MAIN SCRIPT
main() {
    # Verificar se feature name foi fornecido
    if [ $# -eq 0 ]; then
        echo -e "${YELLOW}💡 Uso: ./scripts/smart-branch.sh nome-da-feature${NC}"
        echo ""
        echo "Exemplos:"
        echo "  ./scripts/smart-branch.sh fix-mining-bug         # → hotfix/fix-mining-bug-0106"
        echo "  ./scripts/smart-branch.sh new-dashboard-widget   # → feature/new-dashboard-widget-0106"
        echo "  ./scripts/smart-branch.sh update-button-color    # → minor/update-button-color-0106"
        echo ""
        read -p "Digite o nome da feature: " feature_name
        if [ -z "$feature_name" ]; then
            echo -e "${RED}❌ Nome da feature é obrigatório${NC}"
            exit 1
        fi
    else
        feature_name=$1
    fi
    
    # Sanitizar nome (remover espaços, caracteres especiais)
    feature_name=$(echo "$feature_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    
    # Verificar estado do repositório
    if ! check_repo_state; then
        exit 1
    fi
    
    # Criar branch inteligente
    create_smart_branch "$feature_name"
}

# Executar script
main "$@"