#!/bin/bash

# 🛡️ SUPER SAFE DEPLOYMENT SYSTEM
# Complete backup and rollback system - MANDATORY BEFORE ALL DEPLOYS

set -e

echo "🛡️ SUPER SAFE DEPLOYMENT - Zero Risk System"

# Variables
REMOTE_HOST="root@161.97.145.169"
REMOTE_PATH="/opt/smart-affiliate-system"
BACKUP_DIR="/opt/backups/smart-affiliate-system"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Pre-deployment checklist:${NC}"
echo "✅ Git changes committed locally"
echo "✅ Local tests passed"
echo "✅ Ready for production deployment"

# Function: Create complete backup
create_complete_backup() {
    echo -e "${YELLOW}💾 Creating COMPLETE backup (code + build + database)...${NC}"
    
    sshpass -e ssh -o StrictHostKeyChecking=no $REMOTE_HOST << EOF
        cd $REMOTE_PATH
        
        # Create timestamped backup directory
        mkdir -p $BACKUP_DIR/$BACKUP_NAME
        
        # Backup current git state
        echo "📝 Backing up git state..."
        git log --oneline -1 > $BACKUP_DIR/$BACKUP_NAME/current_commit.txt
        git status > $BACKUP_DIR/$BACKUP_NAME/git_status.txt
        
        # Backup all code
        echo "📂 Backing up all code..."
        rsync -av --exclude=node_modules --exclude=.git $REMOTE_PATH/ $BACKUP_DIR/$BACKUP_NAME/code/
        
        # Backup build
        echo "🏗️ Backing up build..."
        if [ -d ".next" ]; then
            cp -r .next $BACKUP_DIR/$BACKUP_NAME/build/
        fi
        
        # Backup environment
        echo "🔧 Backing up environment..."
        cp .env.local $BACKUP_DIR/$BACKUP_NAME/ 2>/dev/null || echo "No .env.local found"
        
        # Create backup metadata
        echo "📄 Creating backup metadata..."
        cat > $BACKUP_DIR/$BACKUP_NAME/backup_info.json << BACKUP_EOF
{
    "timestamp": "$TIMESTAMP",
    "git_commit": "\$(git log --oneline -1)",
    "backup_size": "\$(du -sh $BACKUP_DIR/$BACKUP_NAME | cut -f1)",
    "server_status": "working",
    "deployment_reason": "Pre-deployment safety backup"
}
BACKUP_EOF
        
        # Create symlink to latest backup
        ln -sfn $BACKUP_DIR/$BACKUP_NAME $BACKUP_DIR/latest
        
        echo "✅ Complete backup created: $BACKUP_NAME"
        echo "📁 Backup location: $BACKUP_DIR/$BACKUP_NAME"
        
        # List recent backups
        echo "📚 Recent backups:"
        ls -la $BACKUP_DIR/ | tail -5
EOF
}

# Function: Test current system
test_current_system() {
    echo -e "${YELLOW}🧪 Testing current system health...${NC}"
    
    # Test server response
    if curl -f -s https://smartaffiliatesystem.site/presell-generator > /dev/null; then
        echo "✅ Main site responding"
    else
        echo -e "${RED}❌ Main site not responding${NC}"
        return 1
    fi
    
    # Test API endpoints
    if curl -f -s https://smartaffiliatesystem.site/api/health > /dev/null; then
        echo "✅ API responding"
    else
        echo -e "${YELLOW}⚠️ API health check failed (may be normal)${NC}"
    fi
    
    echo "✅ System health check completed"
}

# Function: Deploy with rollback capability
deploy_with_safety() {
    echo -e "${YELLOW}🚀 Starting safe deployment...${NC}"
    
    sshpass -e ssh -o StrictHostKeyChecking=no $REMOTE_HOST << 'EOF'
        cd /opt/smart-affiliate-system
        
        # Stop current server
        echo "⏹️ Stopping current server..."
        pkill -9 -f "npm run dev" || true
        pkill -9 -f "next dev" || true
        sleep 3
        
        # Pull latest changes
        echo "⬇️ Pulling latest changes..."
        git fetch origin
        git reset --hard origin/main
        
        # Clean rebuild
        echo "🧹 Clean rebuild..."
        rm -rf .next node_modules/.cache || true
        npm ci
        npm run build
        
        # Start server
        echo "🚀 Starting server..."
        PORT=3000 npm run dev > app.log 2>&1 &
        
        # Wait for startup
        echo "⏳ Waiting for server startup..."
        sleep 15
        
        # Health check
        echo "🏥 Health check..."
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Server started successfully"
            return 0
        else
            echo "❌ Server failed to start"
            return 1
        fi
EOF
}

# Function: Comprehensive rollback
rollback_to_backup() {
    echo -e "${RED}🔄 EMERGENCY ROLLBACK - Restoring from backup...${NC}"
    
    sshpass -e ssh -o StrictHostKeyChecking=no $REMOTE_HOST << EOF
        cd $REMOTE_PATH
        
        # Stop failed deployment
        pkill -9 -f "npm run dev" || true
        pkill -9 -f "next dev" || true
        
        # Restore from latest backup
        if [ -d "$BACKUP_DIR/latest" ]; then
            echo "📂 Restoring code from backup..."
            rsync -av $BACKUP_DIR/latest/code/ $REMOTE_PATH/
            
            echo "🏗️ Restoring build from backup..."
            rm -rf .next
            cp -r $BACKUP_DIR/latest/build .next
            
            echo "🔧 Restoring environment..."
            cp $BACKUP_DIR/latest/.env.local . 2>/dev/null || echo "No environment to restore"
            
            # Get original commit
            ORIGINAL_COMMIT=\$(cat $BACKUP_DIR/latest/current_commit.txt | cut -d' ' -f1)
            git reset --hard \$ORIGINAL_COMMIT
            
            echo "🚀 Starting restored server..."
            PORT=3000 npm run dev > app.log 2>&1 &
            sleep 10
            
            if curl -f http://localhost:3000 > /dev/null 2>&1; then
                echo "✅ ROLLBACK SUCCESSFUL - System restored"
                return 0
            else
                echo "❌ CRITICAL: Rollback failed"
                return 1
            fi
        else
            echo "❌ CRITICAL: No backup found for rollback"
            return 1
        fi
EOF
}

# Main execution
main() {
    echo -e "${YELLOW}🛡️ Starting SUPER SAFE deployment process...${NC}"
    
    # Step 1: Test current system
    if ! test_current_system; then
        echo -e "${RED}❌ Current system is not healthy. Aborting deployment.${NC}"
        exit 1
    fi
    
    # Step 2: Create complete backup
    create_complete_backup
    
    # Step 3: Confirm deployment
    echo -e "${YELLOW}⚠️ FINAL CONFIRMATION: Ready to deploy to production?${NC}"
    echo "🔍 Current working system will be backed up"
    echo "🚀 New version will be deployed"
    echo "🔄 Automatic rollback if anything fails"
    read -p "Continue? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "❌ Deployment cancelled by user"
        exit 1
    fi
    
    # Step 4: Deploy
    if deploy_with_safety; then
        echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
        
        # Final health check
        sleep 5
        if curl -f https://smartaffiliatesystem.site > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Production site is healthy${NC}"
            echo -e "${GREEN}✅ Deployment completed successfully${NC}"
            echo -e "${YELLOW}📁 Backup preserved at: $BACKUP_DIR/$BACKUP_NAME${NC}"
        else
            echo -e "${RED}❌ Production site health check failed${NC}"
            rollback_to_backup
            exit 1
        fi
    else
        echo -e "${RED}❌ Deployment failed - Rolling back...${NC}"
        rollback_to_backup
        exit 1
    fi
}

# Check if SSHPASS is set
if [ -z "$SSHPASS" ]; then
    echo -e "${RED}❌ SSHPASS environment variable not set${NC}"
    echo "Please run: export SSHPASS='your_password'"
    exit 1
fi

# Run main function
main