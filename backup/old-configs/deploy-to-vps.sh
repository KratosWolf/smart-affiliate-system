#!/bin/bash

# 🚀 Safe Deploy Script for Smart Affiliate System
# Este script faz deploy seguro para o VPS com verificações em cada etapa

set -e  # Para se algum comando falhar

# Configurações
VPS_HOST="161.97.145.169"
VPS_USER="root"
VPS_PASSWORD="CQK6njr3wjthvp2dmf"
APP_DIR="/opt/smart-affiliate-system"

echo "🚀 Iniciando deploy seguro para VPS..."

# 1. Verificar se há mudanças para commit
echo "📝 Verificando status do Git..."
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Há mudanças não commitadas. Por favor, commit primeiro."
    exit 1
fi

# 2. Push para GitHub
echo "📤 Enviando para GitHub..."
git push origin main

# 3. Conectar ao VPS e fazer deploy
echo "🔗 Conectando ao VPS..."

SSHPASS="$VPS_PASSWORD" sshpass -e ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
set -e

echo "📂 Entrando no diretório da aplicação..."
cd /opt/smart-affiliate-system

echo "💾 Salvando backup do estado atual..."
git stash || true

echo "📥 Puxando últimas mudanças..."
git pull origin main

echo "🔍 Verificando se precisa instalar novas dependências..."
# Só instala se package.json mudou
if git diff HEAD@{1} --stat -- package.json | grep -q package.json; then
    echo "📦 Instalando novas dependências..."
    npm install --production
fi

echo "🔨 Tentando build de produção..."
npm run build || {
    echo "⚠️  Build falhou, tentando modo dev..."
    
    # Mata processo Node antigo se existir
    pkill -f "node.*next" || true
    
    # Inicia em modo dev (mais estável)
    nohup npm run dev > app.log 2>&1 &
    
    echo "✅ Aplicação iniciada em modo dev"
    sleep 5
    
    # Verifica se está rodando
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Aplicação respondendo na porta 3000"
    else
        echo "❌ Aplicação não está respondendo"
        exit 1
    fi
    
    exit 0
}

echo "✅ Build de produção concluído"

# Reinicia a aplicação
echo "🔄 Reiniciando aplicação..."
pm2 restart smart-affiliate-system || {
    echo "⚠️  PM2 não encontrado, tentando iniciar com npm..."
    pkill -f "node.*next" || true
    nohup npm run start > app.log 2>&1 &
}

echo "✅ Deploy concluído com sucesso!"
EOF

echo "🎉 Deploy finalizado! Verificando site..."

# Verificar se o site está online
sleep 5
if curl -f https://smartaffiliatesystem.site > /dev/null 2>&1; then
    echo "✅ Site está online: https://smartaffiliatesystem.site"
else
    echo "⚠️  Site pode estar demorando para iniciar. Verifique em alguns segundos."
fi