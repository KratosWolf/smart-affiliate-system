#!/bin/bash

# 🚀 PRODUCTION DEPLOYMENT SCRIPT
# Safe deployment with rollback capability

set -e

echo "🔍 Starting Production Deployment..."

# Variables
REMOTE_HOST="root@161.97.145.169"
REMOTE_PATH="/opt/smart-affiliate-system"
BACKUP_DIR="/opt/backups/smart-affiliate-system"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Functions
deploy_to_production() {
    echo "📦 Deploying to production..."
    
    sshpass -e ssh -o StrictHostKeyChecking=no $REMOTE_HOST << 'EOF'
        cd /opt/smart-affiliate-system
        
        # Create backup
        echo "💾 Creating backup..."
        mkdir -p /opt/backups/smart-affiliate-system
        cp -r .next /opt/backups/smart-affiliate-system/.next_$TIMESTAMP || true
        
        # Stop current process
        echo "⏹️ Stopping current server..."
        pkill -9 -f "npm run dev" || true
        pkill -9 -f "next dev" || true
        
        # Pull latest changes
        echo "⬇️ Pulling latest changes..."
        git fetch origin
        git reset --hard origin/main
        
        # Clean install
        echo "🧹 Clean install..."
        rm -rf .next
        npm ci
        
        # Build
        echo "🏗️ Building..."
        npm run build
        
        # Start server
        echo "🚀 Starting server..."
        nohup npm run dev > app.log 2>&1 &
        
        # Wait for server
        echo "⏳ Waiting for server..."
        sleep 10
        
        # Health check
        echo "🏥 Health check..."
        curl -f http://localhost:3000 || exit 1
        
        echo "✅ Deployment successful!"
EOF
}

rollback_deployment() {
    echo "🔄 Rolling back deployment..."
    
    sshpass -e ssh -o StrictHostKeyChecking=no $REMOTE_HOST << 'EOF'
        cd /opt/smart-affiliate-system
        
        # Stop current process
        pkill -9 -f "npm run dev" || true
        
        # Restore backup
        if [ -d "/opt/backups/smart-affiliate-system/.next_latest" ]; then
            rm -rf .next
            cp -r /opt/backups/smart-affiliate-system/.next_latest .next
            nohup npm run dev > app.log 2>&1 &
            echo "✅ Rollback successful!"
        else
            echo "❌ No backup found for rollback"
            exit 1
        fi
EOF
}

# Main deployment
if deploy_to_production; then
    echo "🎉 Production deployment completed successfully!"
    
    # Test the deployment
    echo "🧪 Testing deployment..."
    if curl -f https://smartaffiliatesystem.site > /dev/null 2>&1; then
        echo "✅ Site is responding correctly"
    else
        echo "❌ Site check failed, consider rollback"
        exit 1
    fi
else
    echo "💥 Deployment failed, attempting rollback..."
    rollback_deployment
    exit 1
fi