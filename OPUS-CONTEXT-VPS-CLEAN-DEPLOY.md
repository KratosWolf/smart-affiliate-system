# 🎯 CONTEXTO COMPLETO PARA OPUS - VPS Clean Deploy

**Criado em**: 04 Setembro 2025, 14:45  
**Para uso às**: 18:00 (Opus planning session)  
**Objetivo**: Arquitetar estrutura limpa de deploy VPS para presells

---

## 📋 **SITUAÇÃO ATUAL**

### ✅ **O QUE FUNCIONA PERFEITAMENTE:**

1. **Presell Generation System**:
   - Cookie template working 100%
   - File generation: `index.html`, `style.css`, `script.js`
   - Screenshot API functional
   - Template customization working

2. **VPS Infrastructure**:
   - **Server**: 161.97.145.169 (root access working)
   - **SSH**: `sshpass -e ssh root@161.97.145.169` 
   - **Password**: CQK6njr3wjthvp2dmf
   - **File transfer**: rsync/scp working

3. **Domain Configuration**:
   - **Purchased**: airbolt.shop (GoDaddy)
   - **DNS**: A record pointing to 161.97.145.169 ✅
   - **SSL Certs**: Generated via Let's Encrypt ✅

4. **Next.js Application**:
   - **Frontend**: localhost:3000 working
   - **Presell Generator**: `/presell-generator` functional
   - **Deploy API**: `/api/flexible-deploy` working

---

## ❌ **O QUE NÃO FUNCIONA:**

### **Problema Principal**: Nginx Configuration Hell
- Multiple conflicting server blocks
- Certbot auto-managed rules conflicting with manual configs
- Sites-enabled not being properly included
- Redirect loops and HTTPS issues
- Too complex to debug reliably

### **Current VPS Nginx State**:
- nginx.conf heavily modified by certbot
- Multiple airbolt.shop configurations conflicting
- SSL working but routing broken
- Port 443 not properly listening

---

## 🎯 **OBJETIVO PARA OPUS PLANEJAR:**

### **Requisito Principal**:
**Criar estrutura ISOLADA e LIMPA para deploy de presells** no VPS atual, sem mexer no sistema existente do smartaffiliatesystem.site.

### **Requisitos Específicos**:

1. **URL Pattern**: `https://airbolt.shop/[slug]/`
   - Exemplo: `https://airbolt.shop/air-bolt-usa/`
   - Slug gerado automaticamente do nome do produto
   - Deve servir arquivos estáticos (index.html, style.css, script.js)

2. **Deploy Flow**:
   - User generates presell in `/presell-generator`
   - Clicks "Deploy to VPS" button (blue button)  
   - Files uploaded via API to VPS
   - Immediately accessible via HTTPS URL

3. **Isolation Requirements**:
   - ✅ Don't touch existing smartaffiliatesystem.site config
   - ✅ Don't break existing SSL configs
   - ✅ Use separate directory structure
   - ✅ Clean, simple nginx config

---

## 🛠️ **RECURSOS DISPONÍVEIS:**

### **VPS Current State**:
- OS: Ubuntu with nginx 1.24.0
- Root access via SSH
- SSL certificates for airbolt.shop exist
- Ports 80/443 available

### **File Upload System**:
- rsync working
- scp working
- API can create temp directories

### **Development Environment**:
- Next.js 15.5.0 running on localhost:3000
- API `/api/flexible-deploy` ready to modify
- Presell generator interface working

---

## 📊 **CURRENT FILE STRUCTURE:**

### **VPS Files**:
```
/opt/smart-affiliate-system/
├── domains/
│   ├── airbolt.shop/
│   │   ├── air-bolt-usa/          # Has files but not accessible
│   │   └── teste-presell/         # Has files but not accessible  
│   └── smartaffiliatesystem.site/ # Don't touch
/etc/nginx/
├── nginx.conf                     # Complex, certbot-managed
├── sites-available/
│   └── airbolt.shop               # Clean config but not loading
└── sites-enabled/
    └── airbolt.shop -> sites-available/airbolt.shop
```

### **Next.js Files**:
```
src/
├── app/
│   ├── presell-generator/page.tsx      # Working UI
│   └── api/flexible-deploy/route.ts    # Working API
└── lib/
    └── deployment/
        └── vps-flexible-deploy.ts      # Working functions
```

---

## 🔍 **RESEARCH DONE:**

### **Problems Identified**:
1. nginx.conf includes conflicts with sites-enabled configs
2. Certbot created duplicate server blocks  
3. SSL certificates exist but routing fails
4. Multiple redirect rules creating loops

### **Working Components**:
1. File generation and upload ✅
2. SSH/SCP connectivity ✅  
3. SSL certificate generation ✅
4. DNS resolution ✅

---

## 💡 **PARA OPUS DECIDIR:**

### **Architecture Questions**:
1. **Directory Structure**: `/var/www/presells/` vs `/opt/smart-affiliate-system/presells/`?
2. **Nginx Approach**: New dedicated config vs fix existing?  
3. **SSL Management**: Reuse existing certs vs generate new?
4. **Isolation Level**: Completely separate vs shared resources?

### **Technical Questions**:
1. **Port Strategy**: Dedicated port for presells vs shared 443?
2. **Domain Strategy**: Subdirectory vs subdomain approach?
3. **Upload Method**: rsync vs scp vs native nginx upload?
4. **Config Management**: Manual vs automated nginx reload?

---

## 🎯 **SUCCESS CRITERIA:**

When finished, we should have:

1. **Working URL**: `https://airbolt.shop/air-bolt-usa/` loads presell page
2. **Clean Deploy**: Blue button in presell generator uploads and deploys in <30s
3. **Stable System**: No conflicts with existing smartaffiliatesystem.site
4. **SSL Working**: HTTPS certificate valid and loading
5. **Maintainable**: Simple enough to understand and debug

---

## 📅 **TIMELINE:**

- **14:45-18:00**: Documentation preparation (current)
- **18:00-18:30**: Opus architecture planning  
- **18:30-19:30**: Implementation with confidence
- **19:30+**: Testing and refinement

---

## 🔗 **QUICK ACCESS INFO:**

**VPS Access**:
```bash
export SSHPASS='CQK6njr3wjthvp2dmf' && sshpass -e ssh root@161.97.145.169
```

**Current Test URLs**:
- https://airbolt.shop/ (redirect loops)
- https://airbolt.shop/air-bolt-usa (redirect loops) 
- http://airbolt.shop/air-bolt-usa (301 redirects)

**Local Development**:
- http://localhost:3000/presell-generator (working)
- API endpoint: `/api/flexible-deploy` (working)

---

**🎯 OPUS: Please architect a clean, isolated VPS presell deployment system that meets these requirements with minimal complexity and maximum reliability.**