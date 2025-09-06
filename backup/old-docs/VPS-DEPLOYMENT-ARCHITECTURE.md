# 🏗️ VPS Deployment Architecture - Multi-Domain Presell System

## 📋 **System Overview**

O Smart Affiliate System implementa um **sistema híbrido de deployment** que permite:

1. **Multiple Domain Strategy**: Cada nicho tem seu domínio dedicado
2. **Flexible Slug Structure**: Suporte a países e produtos específicos  
3. **Hybrid Nginx Configuration**: Arquivos estáticos + Next.js fallback
4. **Scalable Architecture**: Fácil replicação para novos domínios

---

## 🎯 **Domain Strategy Examples**

### **Estruturas Planejadas:**
```
nervecalm-bestprice.com/usa          → NerveCalm para USA
nervecalm-bestprice.com/fr           → NerveCalm para França
nervecalm-bestprice.com/brazil       → NerveCalm para Brasil

bestreviews2025.site/skinatrin       → Review do Skinatrin
bestreviews2025.site/nervecalm       → Review do NerveCalm

smartaffiliatesystem.site/test-prod  → Sistema principal (testes)
```

### **Benefits:**
- **SEO Optimized**: Domain authority por nicho
- **Country Targeting**: Slug específica por país
- **Clean URLs**: Sem subdomínios desnecessários
- **Flexible Routing**: Suporte a qualquer estrutura

---

## 🏗️ **Technical Architecture**

### **VPS Configuration:**
- **Server IP**: `161.97.145.169`
- **SSH Access**: `root@161.97.145.169`
- **Nginx**: Reverse proxy + Static files hybrid
- **SSL**: Let's Encrypt wildcard certificates

### **Directory Structure:**
```
/opt/smart-affiliate-system/
├── domains/
│   ├── nervecalm-bestprice.com/
│   │   ├── usa/          → Static presell files
│   │   ├── fr/           → Static presell files  
│   │   └── brazil/       → Static presell files
│   ├── bestreviews2025.site/
│   │   ├── skinatrin/    → Review page files
│   │   └── nervecalm/    → Review page files
│   └── smartaffiliatesystem.site/
│       ├── skinatrin-pl/ → Test deployment
│       └── test-prod/    → Additional tests
└── templates/
    └── nginx-config-template.conf
```

---

## 🔧 **Nginx Hybrid Strategy**

### **Core Principle:**
```
1. Try static files FIRST (presells, reviews)
2. Fallback to Next.js ONLY if file doesn't exist  
3. Maintain performance for both approaches
```

### **Configuration Pattern:**
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;
    
    # Static files directory
    root /opt/smart-affiliate-system/domains/domain.com;
    
    # PRIORITY: Static files first
    location / {
        try_files $uri $uri/ $uri/index.html @nextjs_fallback;
    }
    
    # FALLBACK: Next.js only when needed  
    location @nextjs_fallback {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static asset caching
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🚀 **Deployment Flow**

### **From Next.js Application:**

1. **User generates presell** in `/presell-generator`
2. **System creates files**: `index.html`, `style.css`, `script.js`
3. **Flexible Deploy API**: `/api/flexible-deploy`
4. **Deploy types available:**
   - `domain-with-slug`: `domain.com/slug`
   - `custom-domain`: `unique-domain.com`
   - `subdomain`: `slug.domain.com`

### **API Integration:**
```typescript
// Example deploy call
const result = await fetch('/api/flexible-deploy', {
  method: 'POST',
  body: JSON.stringify({
    action: 'deploy',
    productName: 'Skinatrin pl',
    type: 'domain-with-slug',
    domain: 'nervecalm-bestprice.com',
    slug: 'skinatrin-pl',
    presellFiles: {
      'index.html': htmlContent,
      'style.css': cssContent,
      'script.js': jsContent
    }
  })
});
```

---

## 🎛️ **Configuration Management**

### **Key Files:**
- **Main System**: `/src/lib/deployment/vps-flexible-deploy.ts`
- **Deploy API**: `/src/app/api/flexible-deploy/route.ts`  
- **Nginx Configs**: `/etc/nginx/sites-available/`
- **SSL Certs**: `/etc/letsencrypt/live/`

### **For New Domains:**
1. Add DNS A Record → `161.97.145.169`
2. Create SSL certificate: `certbot certonly -d newdomain.com`
3. Copy nginx template with new domain
4. Enable site: `ln -s /etc/nginx/sites-{available,enabled}/newdomain.com`
5. Reload nginx: `systemctl reload nginx`

---

## 🛠️ **Current Status**

### **Completed ✅:**
- VPS deployment system functional
- Flexible Deploy API working
- Multiple domain support
- SSL certificates configured
- File upload and management
- Slug generation and formatting

### **In Progress 🔄:**
- Nginx hybrid configuration optimization
- Static file serving priority fix
- Template system for new domains

### **Next Steps 📋:**
- Complete `smartaffiliatesystem.site/skinatrin-pl` test
- Document reusable nginx templates
- Test with multiple domain scenarios
- Create automated domain setup script

---

## 🔍 **Troubleshooting Guide**

### **Common Issues:**

1. **404 on deployed pages**:
   - Check nginx configuration priority
   - Verify file permissions and ownership
   - Ensure SSL certificate covers domain

2. **Proxy conflicts**:
   - Check `/etc/nginx/nginx.conf` for conflicting rules
   - Verify sites-enabled symlinks
   - Test nginx config: `nginx -t`

3. **SSL Issues**:
   - Verify certificate paths
   - Check certificate validity: `certbot certificates`
   - Ensure proper SSL configuration in nginx

### **Useful Commands:**
```bash
# Test nginx configuration
nginx -t && systemctl reload nginx

# Check deployed files
ls -la /opt/smart-affiliate-system/domains/domain.com/slug/

# View nginx logs  
tail -f /var/log/nginx/domain.com-error.log

# SSL certificate status
certbot certificates | grep domain.com
```

---

## 📚 **Integration with CLAUDE.md**

Este documento complementa as informações do `CLAUDE.md` e deve ser referenciado sempre que houver trabalho relacionado a:

- Deployment de presells
- Configuração de novos domínios  
- Resolução de problemas de nginx
- Arquitetura do sistema VPS

**🔖 Versão**: v1.0.0 - Multi-Domain Architecture  
**📅 Última atualização**: 04 Setembro 2025  
**👤 Contexto**: Sistema híbrido para marketing de afiliados escalável