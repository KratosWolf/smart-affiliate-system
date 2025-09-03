#!/bin/bash
# VPS Setup Script for Smart Affiliate System
# Run this on your DigitalOcean Ubuntu droplet

echo "🚀 Setting up Smart Affiliate System VPS..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Clone repository
cd /home
sudo git clone https://github.com/KratosWolf/smart-affiliate-system.git
cd smart-affiliate-system

# Install dependencies
sudo npm install

# Copy environment variables
sudo cp .env.example .env.local
echo "
# ⚠️ CONFIGURE ESTAS VARIÁVEIS:
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
" | sudo tee -a .env.local

# Build application
sudo npm run build

# Configure PM2
sudo pm2 start npm --name "smart-affiliate" -- start
sudo pm2 save
sudo pm2 startup

# Configure Nginx
sudo tee /etc/nginx/sites-available/smart-affiliate > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/smart-affiliate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ VPS Setup Complete!"
echo "🌐 Access your app at: http://YOUR_VPS_IP"
echo "🔧 To update: cd /home/smart-affiliate-system && git pull && npm run build && pm2 restart smart-affiliate"