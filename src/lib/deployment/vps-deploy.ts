/**
 * VPS Direct Deployment
 * Deploy presells directly to your VPS instead of Hostinger
 * No FTP/SSH restrictions - full control
 */

import { exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs/promises'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface VPSConfig {
  host: string
  username: string
  password: string
  port: number
  presellBasePath: string
  baseUrl: string
}

export class VPSDeploy {
  private config: VPSConfig
  
  constructor() {
    this.config = {
      host: '161.97.145.169', // Your Contabo VPS
      username: 'root',
      password: 'CQK6njr3wjthvp2dmf', // From your VPS
      port: 22,
      presellBasePath: '/opt/smart-affiliate-system/public/presells', // Presells directory
      baseUrl: 'https://smartaffiliatesystem.site/presells'
    }
  }

  /**
   * Create product configuration
   */
  private createProductConfig(productName: string) {
    const slug = productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    return {
      slug,
      localPath: `/tmp/presell-${slug}`,
      remotePath: `${this.config.presellBasePath}/${slug}`,
      url: `${this.config.baseUrl}/${slug}`
    };
  }

  /**
   * Deploy presell to VPS
   */
  async deployPresell(
    productKey: string,
    localPath: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    
    const productConfig = this.createProductConfig(productKey)
    
    console.log(`🚀 Deploying to VPS: ${productConfig.url}`)
    console.log(`📁 Local: ${localPath} → Remote: ${productConfig.remotePath}`)
    
    try {
      // 1. Create remote directory structure
      const mkdirCommand = `sshpass -p '${this.config.password}' ssh -o StrictHostKeyChecking=no root@${this.config.host} "mkdir -p ${productConfig.remotePath}"`
      
      console.log('📁 Creating remote directory...')
      await execAsync(mkdirCommand)
      
      // 2. Upload files using rsync (most efficient)
      const rsyncCommand = `sshpass -p '${this.config.password}' rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" "${localPath}/" root@${this.config.host}:"${productConfig.remotePath}/"`
      
      console.log('📤 Uploading files...')
      const { stdout, stderr } = await execAsync(rsyncCommand)
      
      if (stderr && !stderr.includes('warning')) {
        throw new Error(`Rsync error: ${stderr}`)
      }
      
      // 3. Set correct permissions
      const chmodCommand = `sshpass -p '${this.config.password}' ssh -o StrictHostKeyChecking=no root@${this.config.host} "chmod -R 755 ${productConfig.remotePath}"`
      
      console.log('🔐 Setting permissions...')
      await execAsync(chmodCommand)
      
      console.log('✅ Deploy VPS completo!')
      console.log(`🌐 Presell disponível em: ${productConfig.url}`)
      
      return {
        success: true,
        url: productConfig.url
      }
      
    } catch (error) {
      console.error('❌ Erro no deploy VPS:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * List deployed presells
   */
  async listPresells(): Promise<string[]> {
    try {
      const command = `sshpass -p '${this.config.password}' ssh -o StrictHostKeyChecking=no root@${this.config.host} "ls -1 ${this.config.presellBasePath} 2>/dev/null || echo ''"`
      
      const { stdout } = await execAsync(command)
      
      return stdout
        .split('\n')
        .filter(line => line.trim())
        .map(folder => `${this.config.baseUrl}/${folder}`)
      
    } catch (error) {
      console.error('❌ Erro ao listar presells:', error)
      return []
    }
  }

  /**
   * Remove presell from VPS
   */
  async removePresell(productKey: string): Promise<boolean> {
    const productConfig = this.createProductConfig(productKey)
    
    try {
      const command = `sshpass -p '${this.config.password}' ssh -o StrictHostKeyChecking=no root@${this.config.host} "rm -rf ${productConfig.remotePath}"`
      
      console.log(`🗑️ Removendo presell: ${productConfig.slug}`)
      await execAsync(command)
      
      console.log('✅ Presell removida com sucesso')
      return true
      
    } catch (error) {
      console.error('❌ Erro ao remover presell:', error)
      return false
    }
  }

  /**
   * Setup nginx configuration for presells
   */
  async setupNginxConfig(): Promise<boolean> {
    try {
      // Nginx config for serving presells
      const nginxConfig = `
# Presell pages configuration
location /presells {
    alias /opt/smart-affiliate-system/public/presells;
    try_files $uri $uri/ /index.html;
    
    # Enable CORS
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    
    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
`
      
      // Create nginx config file
      const configPath = '/tmp/presell-nginx.conf'
      await fs.writeFile(configPath, nginxConfig)
      
      // Upload to VPS
      const uploadCommand = `sshpass -p '${this.config.password}' scp -o StrictHostKeyChecking=no ${configPath} root@${this.config.host}:/etc/nginx/sites-available/presells`
      await execAsync(uploadCommand)
      
      // Enable site and reload nginx
      const enableCommands = [
        `ln -sf /etc/nginx/sites-available/presells /etc/nginx/sites-enabled/`,
        `nginx -t`,
        `systemctl reload nginx`
      ].join(' && ')
      
      const enableCommand = `sshpass -p '${this.config.password}' ssh -o StrictHostKeyChecking=no root@${this.config.host} "${enableCommands}"`
      await execAsync(enableCommand)
      
      console.log('✅ Nginx configurado para presells')
      return true
      
    } catch (error) {
      console.error('❌ Erro ao configurar nginx:', error)
      return false
    }
  }

  /**
   * Test VPS connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testando conexão com VPS...')
      
      const command = `sshpass -p '${this.config.password}' ssh -o StrictHostKeyChecking=no root@${this.config.host} "echo 'VPS OK' && pwd && ls -la /opt 2>/dev/null || echo 'Directory not found'"`
      
      const { stdout } = await execAsync(command)
      
      console.log('✅ Conexão VPS funcionando!')
      console.log('📊 Status do VPS:')
      console.log(stdout)
      
      return true
      
    } catch (error) {
      console.error('❌ Falha na conexão VPS:', error)
      return false
    }
  }
}

// Export singleton instance
export const vpsDeploy = new VPSDeploy()