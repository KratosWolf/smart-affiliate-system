# 🚀 VPS Setup Guide - Smart Affiliate System

## Por que VPS resolve TODOS os problemas:

✅ **FTP funciona 100%** - Sem limitações serverless  
✅ **Screenshots salvos** - Sistema de arquivos completo  
✅ **Sem timeouts** - Sem limitações de execução  
✅ **Controle total** - Você é o admin  
✅ **Custo baixo** - $6/mês vs problemas infinitos  

---

## 📋 Passo a Passo (15 minutos):

### 1️⃣ **Criar VPS**
1. Acesse: https://www.digitalocean.com
2. Crie conta (ou use Linode, Vultr)
3. **Create Droplet**:
   - **Image**: Ubuntu 22.04 LTS
   - **Size**: Basic $6/mês (1GB RAM)
   - **Region**: New York ou San Francisco
   - **Authentication**: SSH Key (mais seguro) ou Password

### 2️⃣ **Conectar ao VPS**
```bash
# No seu terminal local:
ssh root@YOUR_VPS_IP

# Exemplo:
ssh root@167.99.123.456
```

### 3️⃣ **Executar Setup Automático**
```bash
# No VPS, cole este comando:
curl -fsSL https://raw.githubusercontent.com/KratosWolf/smart-affiliate-system/main/vps-setup.sh | bash
```

### 4️⃣ **Acessar Sistema**
- URL: `http://YOUR_VPS_IP`
- Admin: Acesso completo ao sistema
- FTP: Funciona 100% direto no navegador

---

## 🔧 Configuração Manual (se preferir):

### **1. Conectar e atualizar**
```bash
ssh root@YOUR_VPS_IP
apt update && apt upgrade -y
```

### **2. Instalar Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
npm install -g pm2
```

### **3. Clonar projeto**
```bash
cd /home
git clone https://github.com/KratosWolf/smart-affiliate-system.git
cd smart-affiliate-system
npm install
```

### **4. Configurar variáveis**
```bash
cp .env.example .env.local
nano .env.local

# Cole as variáveis:
GOOGLE_API_KEY=AIzaSyDGtmJOvV4yLvQZX-o2V2Gl2TF0xvZUGRU
GOOGLE_SEARCH_ENGINE_ID=24e3f9b2e3bb24799
YOUTUBE_API_KEY=AIzaSyDGtmJOvV4yLvQZX-o2V2Gl2TF0xvZUGRU
REMOVEBG_API_KEY=RDKyALFbkDxS5ovoNLbt1T75
FTP_HOST=mediumblue-monkey-640112.hostingersite.com
FTP_USER=u973230760.bestbargains24x7.com
FTP_PASSWORD=FTPBestBargains2025#Main!
FTP_PORT=21
NODE_ENV=production
PORT=3000
```

### **5. Build e rodar**
```bash
npm run build
pm2 start npm --name "smart-affiliate" -- start
pm2 save
pm2 startup
```

### **6. Instalar Nginx**
```bash
apt install -y nginx

# Configurar proxy
nano /etc/nginx/sites-available/smart-affiliate

# Cole:
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Ativar site
ln -s /etc/nginx/sites-available/smart-affiliate /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🎯 **Vantagens do VPS**:

| Recurso | Vercel | VPS |
|---------|--------|-----|
| FTP Deploy | ❌ Não funciona | ✅ 100% funcional |
| Screenshots | ❌ Read-only | ✅ Salva arquivos |
| Timeouts | ❌ 10s limit | ✅ Sem limite |
| Controle | ❌ Limitado | ✅ Root access |
| Custo/mês | $0 (com problemas) | $6 (sem problemas) |

---

## 🚨 **Comandos Úteis**:

```bash
# Ver logs
pm2 logs smart-affiliate

# Restart app
pm2 restart smart-affiliate

# Update sistema
cd /home/smart-affiliate-system
git pull
npm run build
pm2 restart smart-affiliate

# Ver status
pm2 status
systemctl status nginx
```

---

## 🌐 **Depois do Deploy**:

1. ✅ Acesse: `http://YOUR_VPS_IP`
2. ✅ Teste geração de presell (vai funcionar!)
3. ✅ Teste deploy FTP (vai funcionar!)
4. ✅ Sistema 100% operacional

---

## 💡 **Dica Pro**:

Depois que funcionar, configure um domínio:
1. Aponte seu domínio para o IP do VPS
2. Configure SSL com Certbot
3. Sistema profissional completo!

**Tempo total**: 15 minutos  
**Resultado**: Sistema 100% funcional sem limitações! 🚀