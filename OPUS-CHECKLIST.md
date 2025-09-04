# 🎯 OPUS CHECKLIST - VPS Clean Deploy Architecture

**Session Time**: 18:00 - 19:00  
**Current Time**: 14:55  
**Objective**: Design clean, isolated VPS presell deployment system

---

## 📚 **REQUIRED READING** *(5 min)*

1. **Main Context**: `OPUS-CONTEXT-VPS-CLEAN-DEPLOY.md`
2. **Technical Details**: `OPUS-TECHNICAL-SNAPSHOT.md`
3. **Architecture Docs**: `VPS-DEPLOYMENT-ARCHITECTURE.md`

---

## 🎯 **DECISION FRAMEWORK**

### **Primary Goal**:
User clicks blue "Deploy to VPS" button → `https://airbolt.shop/air-bolt-usa/` loads presell page in <30s

### **Constraints**:
- ✅ Don't break smartaffiliatesystem.site
- ✅ Use existing VPS (161.97.145.169)
- ✅ Use airbolt.shop domain (already configured)
- ✅ SSL must work (certificates exist)
- ✅ Must be maintainable and debuggable

---

## 🔍 **KEY ARCHITECTURAL DECISIONS**

### **Decision 1: Directory Structure**
**Options**:
- A) `/opt/smart-affiliate-system/domains/airbolt.shop/` (current, broken routing)
- B) `/var/www/presells/airbolt.shop/` (isolated, clean)
- C) `/opt/presells/` (separate from existing system)

**Recommendation**: Choose based on isolation vs simplicity

### **Decision 2: Nginx Approach**
**Options**:
- A) Fix existing nginx.conf conflicts (complex, risky)
- B) Create dedicated nginx site config (clean, isolated)
- C) Use different port (8080) with proxy (alternative)

**Recommendation**: Choose based on maintainability

### **Decision 3: SSL Strategy**
**Options**:
- A) Reuse existing airbolt.shop certificates (simple)
- B) Generate new certificates for isolated structure (clean)

**Recommendation**: Reuse existing certs if possible

---

## ⚡ **IMPLEMENTATION CHECKLIST**

### **Phase 1: Architecture Design** *(Opus - 15 min)*
- [ ] Choose directory structure approach
- [ ] Design nginx configuration strategy
- [ ] Plan SSL certificate usage
- [ ] Define file upload workflow
- [ ] Create step-by-step implementation plan

### **Phase 2: Implementation** *(Post-Opus - 30 min)*
- [ ] Create directory structure
- [ ] Write nginx configuration
- [ ] Update deploy API if needed
- [ ] Test file uploads
- [ ] Configure SSL
- [ ] Test HTTPS access

### **Phase 3: Validation** *(10 min)*
- [ ] Deploy test presell from localhost
- [ ] Verify `https://airbolt.shop/[slug]/` loads
- [ ] Test multiple deploys
- [ ] Verify no impact on existing system

---

## 🧠 **TECHNICAL CONSIDERATIONS**

### **Nginx Config Requirements**:
```nginx
# Must handle:
server {
    listen 443 ssl;
    server_name airbolt.shop;
    
    # SSL config
    ssl_certificate /path/to/cert;
    ssl_certificate_key /path/to/key;
    
    # Static file serving
    location / {
        root /path/to/presells;
        try_files $uri $uri/ $uri/index.html =404;
    }
}
```

### **Directory Structure Example**:
```
/chosen/path/
├── airbolt.shop/
│   ├── air-bolt-usa/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── another-slug/
│       └── ...
```

### **API Integration Points**:
- `vps-flexible-deploy.ts` may need path updates
- Upload commands (rsync/scp) may need target changes
- Nginx reload commands may be needed

---

## 🎯 **SUCCESS CRITERIA VERIFICATION**

### **Must Work After Implementation**:
1. **Deploy Flow**: 
   - Open http://localhost:3000/presell-generator
   - Generate presell for "Air Bolt USA"
   - Click blue "Deploy to VPS" button
   - Get success message with URL

2. **Access Flow**:
   - Open `https://airbolt.shop/air-bolt-usa/`
   - Page loads without redirects
   - CSS and JS load properly
   - Affiliate links work

3. **System Integrity**:
   - `https://smartaffiliatesystem.site/` still works
   - No nginx errors in logs
   - SSL certificates remain valid

---

## 🔧 **TOOLS AVAILABLE**

### **VPS Access**:
```bash
export SSHPASS='CQK6njr3wjthvp2dmf'
sshpass -e ssh -o StrictHostKeyChecking=no root@161.97.145.169
```

### **File Transfer**:
```bash
sshpass -e scp -o StrictHostKeyChecking=no [local] root@161.97.145.169:[remote]
sshpass -e rsync -avz -e "ssh -o StrictHostKeyChecking=no" [local]/ root@161.97.145.169:[remote]/
```

### **Nginx Management**:
```bash
nginx -t                    # Test config
systemctl reload nginx      # Reload config
tail -f /var/log/nginx/error.log  # Check errors
```

---

## ⏰ **TIME MANAGEMENT**

- **18:00-18:15**: Read context + make architectural decisions
- **18:15-18:30**: Design detailed implementation plan
- **18:30-19:00**: Implement and test solution
- **19:00+**: Refinement if needed

---

## 📝 **FINAL NOTES**

### **What's Already Working**:
- Presell generation ✅
- File upload to VPS ✅  
- SSH/SCP connectivity ✅
- SSL certificates exist ✅
- DNS resolution ✅

### **What Needs Architecture**:
- Clean nginx routing 🔧
- Isolated directory structure 🔧
- Maintainable configuration 🔧

---

**🚀 Ready for Opus to architect the cleanest, most maintainable solution!**