/**
 * VPS Multi-Domain Deployment
 * Deploy presells para domínios específicos de cada produto
 * Cada produto tem seu próprio domínio comprado
 */

import { exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs/promises'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface DomainConfig {
  productName: string
  domain: string
  sslEnabled?: boolean
}

export class VPSMultiDomainDeploy {
  private vpsConfig = {
    host: '161.97.145.169',
    username: 'root', 
    password: 'CQK6njr3wjthvp2dmf',
    port: 22
  }

  /**
   * Deploy presell para domínio específico
   */
  async deployToCustomDomain(
    productName: string,
    customDomain: string,
    localPath: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    
    const slug = productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
    const remotePath = `/opt/smart-affiliate-system/domains/${slug}`
    
    console.log(`🌐 Deploying ${productName} to custom domain: ${customDomain}`)
    console.log(`📁 Local: ${localPath} → Remote: ${remotePath}`)
    
    try {
      // 1. Create domain directory structure
      await this.createDomainStructure(slug, remotePath)
      
      // 2. Upload presell files
      await this.uploadFiles(localPath, remotePath)
      
      // 3. Configure nginx for this domain
      await this.configureNginxForDomain(customDomain, remotePath, slug)
      
      // 4. Setup SSL certificate (Let's Encrypt)
      await this.setupSSL(customDomain)
      
      console.log(`✅ Deploy completo para ${customDomain}!`)
      
      return {
        success: true,
        url: `https://${customDomain}`
      }
      
    } catch (error) {
      console.error('❌ Erro no deploy:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Create directory structure for domain
   */
  private async createDomainStructure(slug: string, remotePath: string): Promise<void> {
    const command = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "mkdir -p ${remotePath} && chmod 755 ${remotePath}"`
    
    console.log('📁 Creating domain directory structure...')
    await execAsync(command)
  }

  /**
   * Upload files to domain directory
   */
  private async uploadFiles(localPath: string, remotePath: string): Promise<void> {
    const rsyncCommand = `sshpass -p '${this.vpsConfig.password}' rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" "${localPath}/" root@${this.vpsConfig.host}:"${remotePath}/"`
    
    console.log('📤 Uploading presell files...')
    await execAsync(rsyncCommand)
    
    // Set permissions
    const chmodCommand = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "chmod -R 755 ${remotePath}"`
    await execAsync(chmodCommand)
  }

  /**
   * Configure nginx for custom domain
   */
  private async configureNginxForDomain(domain: string, remotePath: string, slug: string): Promise<void> {
    const nginxConfig = `
server {
    listen 80;
    server_name ${domain} www.${domain};
    
    root ${remotePath};
    index index.html;
    
    # Serve presell files
    location / {
        try_files \\$uri \\$uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
`
    
    // Create nginx config file
    const configPath = `/tmp/nginx-${slug}.conf`
    await fs.writeFile(configPath, nginxConfig)
    
    // Upload to VPS
    const uploadCommand = `sshpass -p '${this.vpsConfig.password}' scp -o StrictHostKeyChecking=no ${configPath} root@${this.vpsConfig.host}:/etc/nginx/sites-available/${slug}`
    await execAsync(uploadCommand)
    
    // Enable site
    const enableCommand = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "ln -sf /etc/nginx/sites-available/${slug} /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"`
    await execAsync(enableCommand)
    
    // Cleanup temp file
    await fs.unlink(configPath).catch(() => {})
    
    console.log(`✅ Nginx configured for ${domain}`)
  }

  /**
   * Setup SSL certificate with Let's Encrypt
   */
  private async setupSSL(domain: string): Promise<void> {
    try {
      console.log(`🔒 Setting up SSL for ${domain}...`)
      
      const certbotCommand = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "certbot --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos --email admin@${domain} --redirect"`
      
      await execAsync(certbotCommand)
      console.log(`✅ SSL configured for ${domain}`)
      
    } catch (error) {
      console.log(`⚠️ SSL setup failed for ${domain} - domain may not be pointed to VPS yet`)
      console.log('Manual setup required after DNS propagation')
    }
  }

  /**
   * List all configured domains
   */
  async listDomains(): Promise<string[]> {
    try {
      const command = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "ls -1 /etc/nginx/sites-enabled/ | grep -v default | grep -v smartaffiliatesystem"`
      
      const { stdout } = await execAsync(command)
      return stdout.split('\n').filter(line => line.trim())
      
    } catch (error) {
      console.error('❌ Error listing domains:', error)
      return []
    }
  }

  /**
   * Remove domain configuration
   */
  async removeDomain(productName: string, domain: string): Promise<boolean> {
    const slug = productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
    
    try {
      console.log(`🗑️ Removing domain configuration for ${domain}...`)
      
      const commands = [
        `rm -f /etc/nginx/sites-enabled/${slug}`,
        `rm -f /etc/nginx/sites-available/${slug}`,
        `rm -rf /opt/smart-affiliate-system/domains/${slug}`,
        `certbot delete --cert-name ${domain} --non-interactive || true`,
        `nginx -t && systemctl reload nginx`
      ].join(' && ')
      
      const command = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "${commands}"`
      await execAsync(command)
      
      console.log(`✅ Domain ${domain} removed successfully`)
      return true
      
    } catch (error) {
      console.error(`❌ Error removing domain ${domain}:`, error)
      return false
    }
  }

  /**
   * Get deployment guide for new domain
   */
  getDeploymentGuide(productName: string, customDomain: string): string {
    return `
🌐 **GUIA DE DEPLOY PARA ${productName.toUpperCase()}**

**Domínio**: ${customDomain}

**PASSOS OBRIGATÓRIOS:**

1. **📝 Comprar Domínio**: ${customDomain}
   - Registrar em qualquer provedor (GoDaddy, Namecheap, etc.)

2. **🌐 Configurar DNS**:
   - A Record: ${customDomain} → 161.97.145.169
   - A Record: www.${customDomain} → 161.97.145.169
   - Aguardar propagação DNS (pode levar até 24h)

3. **🚀 Fazer Deploy**:
   \`\`\`javascript
   await multiDomainDeploy.deployToCustomDomain(
     "${productName}",
     "${customDomain}",
     "/caminho/para/presell"
   )
   \`\`\`

4. **✅ Verificar**:
   - HTTP: http://${customDomain}
   - HTTPS: https://${customDomain} (após SSL)

**RESULTADO**: Presell funcionando em domínio próprio com SSL!
`
  }
}

// Export singleton instance
export const multiDomainDeploy = new VPSMultiDomainDeploy()