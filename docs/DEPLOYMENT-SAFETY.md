# 🛡️ Deployment Safety Guide

## Sistema de Proteção Multicamadas

Este documento descreve o sistema completo de proteção implementado para evitar deployments quebrados.

## 🔒 Camadas de Proteção

### 1. Pre-Commit Hooks (Local)
```bash
# Automático em todos os commits
npm run lint          # ESLint check
npm run type-check     # TypeScript validation
./scripts/check-consistency.sh  # Project consistency
```

### 2. Branch Protection (GitHub)
- ❌ Direct commits to main blocked
- ✅ Pull requests required
- ✅ Status checks required
- 🔄 Auto-dismiss stale reviews

### 3. Safe Deploy Script
```bash
# Production deployment with safety checks
./scripts/production-deploy.sh

# Features:
- ✅ Automatic backup before deploy
- ✅ Health checks after deploy  
- ✅ Auto-rollback on failure
- ✅ Port and process verification
```

### 4. Emergency Bypass
```bash
# For urgent fixes only
URGENT_DEPLOY=true git commit --no-verify -m "urgent fix"
```

## 🚀 Safe Deployment Workflow

### Normal Development Flow:
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit (auto-protected)
git add .
git commit -m "feat: add new feature"

# 3. Push and create PR
git push origin feature/new-feature

# 4. Merge after review
# 5. Deploy to production
./scripts/production-deploy.sh
```

### Emergency Fixes:
```bash
# 1. Make minimal fix
git add fixed-file.js

# 2. Emergency commit (bypasses hooks)
URGENT_DEPLOY=true git commit --no-verify -m "fix: critical bug - URGENT"

# 3. Push immediately
git push origin main

# 4. Safe production deploy
export SSHPASS='CQK6njr3wjthvp2dmf'
./scripts/production-deploy.sh
```

## 📊 System Verification

### Localhost vs Production Alignment:
```bash
# Check local status
git log --oneline -3

# Check production status  
ssh root@161.97.145.169 "cd /opt/smart-affiliate-system && git log --oneline -3"
```

### Protection System Test:
```bash
# This should FAIL (protection working):
echo "var unused = 'test';" > test.js
git add test.js
git commit -m "test"
# ❌ Should be blocked by TypeScript/ESLint errors
```

### Health Checks:
```bash
# Site accessibility
curl -I https://smartaffiliatesystem.site

# CSS loading
curl -I "https://smartaffiliatesystem.site/_next/static/css/"

# API endpoints
curl https://smartaffiliatesystem.site/api/health
```

## 🔧 Troubleshooting

### Common Issues:

1. **CSS Not Loading (400/404 errors)**
   - Check Node.js process running on port 3000
   - Verify nginx configuration
   - Rebuild static files: `npm run build`

2. **Port Conflicts**
   - Kill existing processes: `pkill -f node`
   - Check port usage: `ss -tulpn | grep :3000`

3. **Git Hook Failures**
   - Fix TypeScript errors or use `URGENT_DEPLOY=true`
   - Check pre-commit configuration in package.json

4. **Production Sync Issues**
   - Compare commits: local vs production
   - Force sync: `git reset --hard origin/main`

## 📈 Monitoring

### Production Health:
- Site: https://smartaffiliatesystem.site
- Status: Should load with full CSS/JS
- Features: Campaign Builder, Presell Generator working

### Key Files to Monitor:
- `package.json` - Dependencies and scripts
- `.pre-commit-config.yaml` - Hook configuration  
- `scripts/production-deploy.sh` - Deploy automation
- `/etc/nginx/sites-enabled/smartaffiliatesystem-main` - Web server config

## 🎯 Success Metrics

✅ **System is Protected When:**
- Commits with errors are automatically blocked
- Production deploys include health checks
- Rollback works automatically on failures
- CSS and static files load correctly
- All features (Campaign Builder, etc.) work

❌ **Take Action If:**
- Commits with obvious errors get through
- Production site loads without styling  
- Features return 400/500 errors
- Deploy script fails without rollback

---

**Last Updated:** September 8, 2025
**System Status:** 🟢 Fully Protected
**Test Status:** ✅ All Protection Layers Active