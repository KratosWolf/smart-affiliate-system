# 📊 TECHNICAL SNAPSHOT - Current Working Systems

**For Opus Context at 18:00**  
**Current Time: 14:50**

---

## 🔧 **WORKING CODE ANALYSIS**

### **API Route: `/api/flexible-deploy/route.ts`**
- ✅ **Status**: Fully functional
- ✅ **Key Feature**: Accepts `presellFiles` parameter for direct deployment
- ✅ **Flow**: Creates temp directory → writes files → calls VPS deploy
- ✅ **Method**: Handles both file uploads and presell generation

**Key Code Snippet**:
```typescript
const { action, productName, type, domain, slug, country, localPath, presellFiles } = await request.json()

// Creates temp directory from presellFiles if no localPath
if (!localPath && presellFiles) {
  const tmpDir = `/tmp/${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`
  fs.mkdirSync(tmpDir, { recursive: true })
  Object.entries(presellFiles).forEach(([filename, content]: [string, string]) => {
    fs.writeFileSync(path.join(tmpDir, filename), content)
  })
  finalLocalPath = tmpDir
}
```

### **VPS Deploy Library: `/lib/deployment/vps-flexible-deploy.ts`**
- ✅ **Status**: SSH/SCP functions working
- ✅ **VPS Config**: Direct access to 161.97.145.169 configured
- ✅ **Types**: Supports 'domain-with-slug', 'custom-domain', 'subdomain'
- ✅ **Methods**: File upload, nginx config creation working

**VPS Connection**:
```typescript
private vpsConfig = {
  host: '161.97.145.169',
  username: 'root', 
  password: 'CQK6njr3wjthvp2dmf',
  port: 22
}
```

---

## 🎨 **FRONTEND INTEGRATION**

### **Presell Generator UI**: `/app/presell-generator/page.tsx`
- ✅ **Status**: Interface working perfectly
- ✅ **Template**: Cookie template generating files correctly
- ✅ **Deploy Buttons**: Green (Hostinger) + Blue (VPS) buttons
- ✅ **Slug Generation**: Proper hyphenation from product names

**Deploy Function**:
```typescript
const deployToVPS = async () => {
  const response = await fetch('/api/flexible-deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'deploy',
      productName: productData.name,
      type: 'domain-with-slug',
      domain: 'airbolt.shop',
      slug: slug,
      presellFiles: {
        'index.html': htmlContent,
        'style.css': cssContent, 
        'script.js': jsContent
      }
    })
  })
}
```

---

## 🌐 **VPS CURRENT STATE**

### **Access Working**:
```bash
export SSHPASS='CQK6njr3wjthvp2dmf'
sshpass -e ssh -o StrictHostKeyChecking=no root@161.97.145.169
```

### **File Structure Created**:
```
/opt/smart-affiliate-system/domains/airbolt.shop/
├── air-bolt-usa/
│   ├── index.html (5,263 bytes)
│   ├── style.css (9,635 bytes)
│   └── script.js (1,837 bytes)
└── teste-presell/
    ├── index.html
    ├── style.css  
    └── script.js
```

### **SSL Certificates Available**:
```
/etc/letsencrypt/live/airbolt.shop/
├── cert.pem -> ../../archive/airbolt.shop/cert1.pem
├── chain.pem -> ../../archive/airbolt.shop/chain1.pem  
├── fullchain.pem -> ../../archive/airbolt.shop/fullchain1.pem
└── privkey.pem -> ../../archive/airbolt.shop/privkey1.pem
```

---

## ❌ **BLOCKING ISSUES**

### **Nginx Configuration Problems**:

1. **Complex nginx.conf**: Heavily modified by certbot, multiple conflicting rules
2. **Sites-enabled not loading**: Include directive missing or broken
3. **Duplicate server blocks**: Multiple airbolt.shop configs causing conflicts
4. **SSL routing broken**: Certificates exist but HTTPS routing fails

### **Current nginx.conf Issues**:
- No `include /etc/nginx/sites-enabled/*;` directive
- Certbot-managed server blocks conflicting with sites-available
- Complex redirect rules creating loops

### **Test Results**:
- ❌ `https://airbolt.shop/air-bolt-usa` → Redirect loops
- ❌ `http://airbolt.shop/air-bolt-usa` → 301 redirects to root
- ✅ Files exist on disk and are readable
- ✅ SSH/SCP upload working perfectly

---

## 🎯 **WHAT OPUS NEEDS TO ARCHITECT**

### **Core Challenge**:
**How to serve static files from `/opt/smart-affiliate-system/domains/airbolt.shop/[slug]/` via clean HTTPS URLs without breaking existing system?**

### **Options to Evaluate**:

1. **Path A - Fix Current Structure**:
   - Repair existing nginx.conf conflicts
   - Make sites-enabled include work
   - Risk: Complex and fragile

2. **Path B - Isolated Structure**:
   - New directory: `/var/www/presells/`
   - Dedicated nginx config
   - Completely separate from existing system

3. **Path C - Port-based Separation**:
   - Use different port (e.g., 8080) for presells
   - Proxy or direct access
   - Clean isolation

### **Success Metrics**:
- ✅ `https://airbolt.shop/air-bolt-usa/` loads the deployed presell
- ✅ Deploy from localhost interface works in <30s
- ✅ No impact on smartaffiliatesystem.site
- ✅ Maintainable and debuggable

---

## 📋 **RESOURCES READY FOR OPUS**:

1. **Full Context Document**: `OPUS-CONTEXT-VPS-CLEAN-DEPLOY.md` ✅
2. **Technical Details**: This document ✅  
3. **Working Code**: Upload/deploy systems functional ✅
4. **VPS Access**: SSH and file transfer working ✅
5. **Domain/SSL**: airbolt.shop configured with certificates ✅

---

**⏰ Ready for Opus at 18:00 to architect the cleanest solution!**