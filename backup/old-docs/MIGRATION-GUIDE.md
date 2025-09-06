# 🎯 GUIA COMPLETO: Migração para VPS Profissional

## 📋 **PASSO A PASSO COMPLETO**

### **FASE 1: Configuração Inicial (30 min)**

#### **1.1 Criar VPS Contabo**
1. Acesse: https://contabo.com
2. Escolha: **CLOUD VPS €4.28/mês**
3. Configuração:
   - **OS**: Ubuntu 22.04 LTS
   - **Região**: Europa (qualquer)
   - **Nome**: smart-affiliate-system
4. **Pague** e aguarde email com credenciais

#### **1.2 Comprar Domínio**
**Opções baratas:**
- **Porkbun**: https://porkbun.com (~$7/ano)
- **Namecheap**: https://namecheap.com (~$8/ano)
- **Godaddy**: https://godaddy.com (promoções)

**Sugestões de nome:**
- `smartaffiliatesystem.com`
- `affiliategenius.com` 
- `presellmaster.com`
- `affiliatepro.tools`

#### **1.3 Configurar DNS**
No painel do domínio, aponte para o IP do VPS:
```
Tipo: A
Nome: @
Valor: IP_DO_SEU_VPS
TTL: 3600
```

---

### **FASE 2: Setup do VPS (20 min)**

#### **2.1 Conectar ao VPS**
```bash
# Substitua pelo IP que recebeu por email
ssh root@SEU_IP_VPS
```

#### **2.2 Executar Setup Automático**
```bash
# Cole este comando no VPS:
curl -fsSL https://raw.githubusercontent.com/tiagofernandes/smart-affiliate-system/main/vps-setup.sh | bash
```

**Se der erro**, use setup manual:
```bash
# Update sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar PM2 + Git
npm install -g pm2
apt install -y git nginx

# Clonar projeto
cd /opt
git clone https://github.com/KratosWolf/smart-affiliate-system.git
cd smart-affiliate-system

# Instalar dependências
npm install

# Build projeto
npm run build
```

#### **2.3 Configurar Variáveis**
```bash
cd /opt/smart-affiliate-system
nano .env.local
```

**Cole estas variáveis:**
```env
# APIs já funcionais
GOOGLE_API_KEY=AIzaSyDGtmJOvV4yLvQZX-o2V2Gl2TF0xvZUGRU
GOOGLE_SEARCH_ENGINE_ID=24e3f9b2e3bb24799
YOUTUBE_API_KEY=AIzaSyDGtmJOvV4yLvQZX-o2V2Gl2TF0xvZUGRU
REMOVEBG_API_KEY=RDKyALFbkDxS5ovoNLbt1T75

# FTP Hostinger
FTP_HOST=mediumblue-monkey-640112.hostingersite.com
FTP_USER=u973230760.bestbargains24x7.com
FTP_PASSWORD=FTPBestBargains2025#Main!
FTP_PORT=21

# Sistema
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=https://seudominio.com
NEXTAUTH_SECRET=sua_chave_secreta_aqui

# Google Auth (próxima fase)
GOOGLE_CLIENT_ID=sua_google_client_id
GOOGLE_CLIENT_SECRET=sua_google_client_secret
```

#### **2.4 Iniciar Aplicação**
```bash
# Iniciar com PM2
pm2 start npm --name "smart-affiliate" -- start
pm2 save
pm2 startup

# Configurar Nginx
nano /etc/nginx/sites-available/smart-affiliate
```

**Configuração Nginx:**
```nginx
server {
    listen 80;
    server_name seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }
}
```

```bash
# Ativar site
ln -s /etc/nginx/sites-available/smart-affiliate /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Configurar firewall
ufw allow 22
ufw allow 80  
ufw allow 443
ufw --force enable
```

---

### **FASE 3: SSL + Domínio (10 min)**

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Gerar SSL gratuito
certbot --nginx -d seudominio.com

# Auto-renovação
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

---

### **FASE 4: Google Auth (30 min)**

#### **4.1 Configurar Google Console**
1. Acesse: https://console.developers.google.com
2. **Criar projeto**: "Smart Affiliate System"
3. **Ativar APIs**: Google+ API
4. **Criar credenciais**: OAuth 2.0
   - **Authorized origins**: `https://seudominio.com`
   - **Redirect URIs**: `https://seudominio.com/api/auth/callback/google`

#### **4.2 Instalar NextAuth**
```bash
cd /opt/smart-affiliate-system
npm install next-auth
```

#### **4.3 Criar Configuração Auth**
```bash
mkdir -p pages/api/auth
nano pages/api/auth/[...nextauth].js
```

**Conteúdo:**
```javascript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
})
```

#### **4.4 Criar Página de Login**
```bash
mkdir -p pages/auth
nano pages/auth/signin.js
```

```javascript
import { getProviders, signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignIn({ providers }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center">Smart Affiliate System</h2>
          <p className="text-center text-gray-600 mt-2">Entre com sua conta Google</p>
        </div>
        
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Continuar com {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
```

---

### **FASE 5: Implementações Avançadas**

#### **5.1 OpenAI para Copies**
```bash
npm install openai
```

**Criar serviço IA:**
```javascript
// lib/ai/copywriter.js
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateCopy(productData) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `Crie um copy persuasivo para: ${productData.name}. 
                Preço: ${productData.price}. 
                Benefícios: ${productData.benefits.join(', ')}.
                Tom: Profissional mas acessível.
                Tamanho: 150-200 palavras.`
    }],
    max_tokens: 300
  })
  
  return response.choices[0].message.content
}
```

#### **5.2 Templates Avançados**
```javascript
// lib/templates/advanced-generator.js
export class AdvancedTemplateGenerator {
  
  async generateReviewTemplate(productData, aiCopy) {
    // Template de review com IA
    return {
      html: this.buildReviewHTML(productData, aiCopy),
      css: this.buildReviewCSS(),
      js: this.buildReviewJS()
    }
  }
  
  async generateQuizTemplate(productData) {
    // Template de quiz interativo
    const questions = await this.generateQuizQuestions(productData)
    return this.buildQuizTemplate(questions, productData)
  }
  
  async generateVideoSalesLetter(productData) {
    // VSL template
    return this.buildVSLTemplate(productData)
  }
}
```

---

### **FASE 6: Comandos Úteis**

#### **Gerenciamento VPS:**
```bash
# Ver logs da aplicação
pm2 logs smart-affiliate

# Restart aplicação  
pm2 restart smart-affiliate

# Atualizar código
cd /opt/smart-affiliate-system
git pull
npm run build
pm2 restart smart-affiliate

# Ver status
pm2 status
systemctl status nginx

# Ver uso de recursos
htop
df -h
```

#### **Backup automático:**
```bash
# Criar script de backup
nano /opt/backup.sh

#!/bin/bash
cd /opt/smart-affiliate-system
git add .
git commit -m "Auto backup $(date)"
git push origin main

# Tornar executável
chmod +x /opt/backup.sh

# Agendar backup diário
echo "0 2 * * * /opt/backup.sh" | crontab -
```

---

### **FASE 7: Monitoramento**

#### **7.1 Logs centralizados:**
```bash
# Instalar log viewer
npm install -g pm2-logrotate
pm2 install pm2-logrotate
```

#### **7.2 Monitoring básico:**
```bash
# Instalar htop
apt install htop

# Ver recursos em tempo real
htop
```

---

## 🎯 **CHECKLIST FINAL**

### **✅ Sistema Base:**
- [ ] VPS criado e configurado
- [ ] Domínio comprado e apontado  
- [ ] SSL configurado
- [ ] Aplicação rodando
- [ ] Nginx configurado

### **✅ Autenticação:**
- [ ] Google Auth configurado
- [ ] Páginas de login criadas
- [ ] Sessões funcionando

### **✅ Funcionalidades:**
- [ ] FTP deploy funcionando
- [ ] Screenshots salvando
- [ ] Templates gerando
- [ ] APIs respondendo

### **✅ IA & Avançado:**
- [ ] OpenAI API configurada
- [ ] Geração de copies
- [ ] Templates avançados
- [ ] Campanhas melhoradas

### **✅ Operacional:**
- [ ] Backup automático
- [ ] Monitoramento básico
- [ ] Logs organizados
- [ ] Comandos documentados

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Execute Fase 1-3** primeiro
2. **Teste tudo funcionando** básico
3. **Implemente Fase 4** (Google Auth)
4. **Evolua com Fase 5-6** conforme necessidade

**Tempo total estimado**: 2-3 horas para sistema completo profissional!

**Resultado**: Sistema sem limitações, escalável e profissional! 💪