# FTP Deployment Server

Servidor dedicado para deployments FTP do Smart Affiliate System.

## 🚀 Como Usar

### Opção 1: Deploy em VPS (Recomendado)

1. **Faça deploy em um VPS** (DigitalOcean, Linode, etc):
```bash
# Clone o repositório
git clone https://github.com/KratosWolf/smart-affiliate-system.git
cd smart-affiliate-system/ftp-server

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais FTP

# Inicie o servidor
npm start
```

2. **Configure PM2** para manter rodando:
```bash
npm install -g pm2
pm2 start server.js --name ftp-deploy
pm2 save
pm2 startup
```

3. **Configure Nginx** como proxy reverso:
```nginx
server {
    listen 80;
    server_name ftp-deploy.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Opção 2: Deploy Local (Para Testes)

```bash
cd ftp-server
npm install
npm start
```

## 🔧 Configuração

Crie um arquivo `.env`:
```env
PORT=3001
FTP_HOST=mediumblue-monkey-640112.hostingersite.com
FTP_USER=u973230760.bestbargains24x7.com
FTP_PASSWORD=FTPBestBargains2025#Main!
```

## 📡 Endpoints

- `POST /deploy` - Deploy presell files via FTP
- `GET /health` - Verifica status do servidor
- `GET /test-ftp` - Testa conexão FTP

## 🔄 Integração com Vercel

Atualize a URL da API no frontend:
```javascript
// Em production
const FTP_SERVER = 'https://ftp-deploy.yourdomain.com';

// Em desenvolvimento
const FTP_SERVER = 'http://localhost:3001';
```

## 🐳 Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

Build e run:
```bash
docker build -t ftp-deploy .
docker run -p 3001:3001 --env-file .env ftp-deploy
```