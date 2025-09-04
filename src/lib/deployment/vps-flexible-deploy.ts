/**
 * VPS Flexible Deployment System
 * Suporta múltiplos formatos de URL:
 * 1. Domínio + Slug: domain.com/usa, domain.com/brazil
 * 2. Domínio próprio: unique-domain.com
 * 3. Subdomínio: usa.domain.com (raramente)
 */

import { exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs/promises'
import { promisify } from 'util'

const execAsync = promisify(exec)

export type DeploymentType = 'domain-with-slug' | 'custom-domain' | 'subdomain'

export interface DeploymentConfig {
  productName: string
  type: DeploymentType
  domain: string
  slug?: string // Para domain-with-slug
  country?: string // Para organização
  localPath: string
}

export class VPSFlexibleDeploy {
  private vpsConfig = {
    host: '161.97.145.169',
    username: 'root', 
    password: 'CQK6njr3wjthvp2dmf',
    port: 22
  }

  /**
   * Deploy flexível - suporta todos os tipos
   */
  async deployFlexible(config: DeploymentConfig): Promise<{ 
    success: boolean; 
    url?: string; 
    fullPath?: string;
    error?: string 
  }> {
    
    console.log(`🚀 Flexible Deploy: ${config.type}`)
    console.log(`📦 Product: ${config.productName}`)
    console.log(`🌐 Domain: ${config.domain}`)
    if (config.slug) console.log(`📁 Slug: ${config.slug}`)
    
    try {
      switch (config.type) {
        case 'domain-with-slug':
          return await this.deployDomainWithSlug(config)
          
        case 'custom-domain':
          return await this.deployCustomDomain(config)
          
        case 'subdomain':
          return await this.deploySubdomain(config)
          
        default:
          throw new Error(`Tipo de deployment não suportado: ${config.type}`)
      }
      
    } catch (error) {
      console.error('❌ Erro no deploy flexível:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Deploy tipo: domain.com/slug (MAIS COMUM)
   */
  private async deployDomainWithSlug(config: DeploymentConfig): Promise<any> {
    if (!config.slug) {
      throw new Error('Slug é obrigatório para domain-with-slug')
    }

    const productSlug = config.productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
    const fullSlug = `${productSlug}-${config.slug}`
    const remotePath = `/var/www/airbolt-presells/${config.slug}`
    const finalUrl = `https://${config.domain}/${config.slug}`
    
    // 1. Create directory structure
    await this.createDomainDirectory(config.domain, config.slug)
    
    // 2. Upload files
    await this.uploadFiles(config.localPath, remotePath)
    
    // 3. Configure nginx for domain with slug support
    await this.configureNginxDomainWithSlugs(config.domain)
    
    // 4. Setup SSL
    await this.setupSSL(config.domain)
    
    return {
      success: true,
      url: finalUrl,
      fullPath: remotePath,
      type: 'domain-with-slug'
    }
  }

  /**
   * Deploy tipo: unique-domain.com (domínio único)
   */
  private async deployCustomDomain(config: DeploymentConfig): Promise<any> {
    const productSlug = config.productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
    const remotePath = `/opt/smart-affiliate-system/domains/${productSlug}`
    const finalUrl = `https://${config.domain}`
    
    // 1. Create directory
    await this.createDirectoryStructure(remotePath)
    
    // 2. Upload files
    await this.uploadFiles(config.localPath, remotePath)
    
    // 3. Configure nginx for single domain
    await this.configureNginxSingleDomain(config.domain, remotePath, productSlug)
    
    // 4. Setup SSL
    await this.setupSSL(config.domain)
    
    return {
      success: true,
      url: finalUrl,
      fullPath: remotePath,
      type: 'custom-domain'
    }
  }

  /**
   * Deploy tipo: slug.domain.com (subdomínio - raramente usado)
   */
  private async deploySubdomain(config: DeploymentConfig): Promise<any> {
    if (!config.slug) {
      throw new Error('Slug é obrigatório para subdomínio')
    }

    const subdomain = `${config.slug}.${config.domain}`
    const productSlug = config.productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
    const remotePath = `/opt/smart-affiliate-system/domains/${productSlug}-${config.slug}`
    const finalUrl = `https://${subdomain}`
    
    // 1. Create directory
    await this.createDirectoryStructure(remotePath)
    
    // 2. Upload files
    await this.uploadFiles(config.localPath, remotePath)
    
    // 3. Configure nginx for subdomain
    await this.configureNginxSingleDomain(subdomain, remotePath, `${productSlug}-${config.slug}`)
    
    // 4. Setup SSL
    await this.setupSSL(subdomain)
    
    return {
      success: true,
      url: finalUrl,
      fullPath: remotePath,
      type: 'subdomain'
    }
  }

  /**
   * Configure nginx para domínio com múltiplos slugs
   */
  private async configureNginxDomainWithSlugs(domain: string): Promise<void> {
    const domainClean = domain.replace(/[^a-zA-Z0-9.-]/g, '')
    const nginxConfig = `
server {
    listen 80;
    server_name ${domain} www.${domain};
    
    # Root directory para domínio
    root /opt/smart-affiliate-system/domains/${domainClean};
    
    # Serve slugs como diretórios
    location / {
        try_files \\$uri \\$uri/ \\$uri/index.html =404;
        
        # Adicionar headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
    
    # Cache para assets estáticos
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Log específico do domínio
    access_log /var/log/nginx/${domainClean}-access.log;
    error_log /var/log/nginx/${domainClean}-error.log;
}
`
    
    await this.createAndEnableNginxConfig(domainClean, nginxConfig)
    console.log(`✅ Nginx configured for domain with slugs: ${domain}`)
  }

  /**
   * Configure nginx para domínio único
   */
  private async configureNginxSingleDomain(domain: string, remotePath: string, configName: string): Promise<void> {
    const nginxConfig = `
server {
    listen 80;
    server_name ${domain} www.${domain};
    
    root ${remotePath};
    index index.html;
    
    location / {
        try_files \\$uri \\$uri/ /index.html;
        
        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
    
    # Cache para assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Logs específicos
    access_log /var/log/nginx/${configName}-access.log;
    error_log /var/log/nginx/${configName}-error.log;
}
`
    
    await this.createAndEnableNginxConfig(configName, nginxConfig)
    console.log(`✅ Nginx configured for single domain: ${domain}`)
  }

  /**
   * Helper methods
   */
  private async createDomainDirectory(domain: string, slug: string): Promise<void> {
    const domainClean = domain.replace(/[^a-zA-Z0-9.-]/g, '')
    const fullPath = `/var/www/airbolt-presells/${slug}`
    
    const command = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "mkdir -p ${fullPath} && chmod -R 755 ${fullPath}"`
    
    console.log(`📁 Creating domain/slug structure: ${fullPath}`)
    await execAsync(command)
  }

  private async createDirectoryStructure(remotePath: string): Promise<void> {
    const command = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "mkdir -p ${remotePath} && chmod 755 ${remotePath}"`
    
    console.log(`📁 Creating directory: ${remotePath}`)
    await execAsync(command)
  }

  private async uploadFiles(localPath: string, remotePath: string): Promise<void> {
    const rsyncCommand = `sshpass -p '${this.vpsConfig.password}' rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" "${localPath}/" root@${this.vpsConfig.host}:"${remotePath}/"`
    
    console.log(`📤 Uploading: ${localPath} → ${remotePath}`)
    await execAsync(rsyncCommand)
    
    // Set permissions
    const chmodCommand = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "chmod -R 755 ${remotePath}"`
    await execAsync(chmodCommand)
  }

  private async createAndEnableNginxConfig(configName: string, nginxConfig: string): Promise<void> {
    // Create config file
    const configPath = `/tmp/nginx-${configName}.conf`
    await fs.writeFile(configPath, nginxConfig)
    
    // Upload to VPS
    const uploadCommand = `sshpass -p '${this.vpsConfig.password}' scp -o StrictHostKeyChecking=no ${configPath} root@${this.vpsConfig.host}:/etc/nginx/sites-available/${configName}`
    await execAsync(uploadCommand)
    
    // Enable site
    const enableCommand = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "ln -sf /etc/nginx/sites-available/${configName} /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"`
    await execAsync(enableCommand)
    
    // Cleanup
    await fs.unlink(configPath).catch(() => {})
  }

  private async setupSSL(domain: string): Promise<void> {
    try {
      console.log(`🔒 Setting up SSL for ${domain}...`)
      
      const certbotCommand = `sshpass -p '${this.vpsConfig.password}' ssh -o StrictHostKeyChecking=no root@${this.vpsConfig.host} "certbot --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos --email admin@${domain} --redirect"`
      
      await execAsync(certbotCommand)
      console.log(`✅ SSL configured for ${domain}`)
      
    } catch (error) {
      console.log(`⚠️ SSL setup failed for ${domain} - DNS may not be propagated yet`)
    }
  }

  /**
   * Get deployment examples
   */
  getExamples(): string {
    return `
🌐 **EXEMPLOS DE DEPLOYMENT FLEXÍVEL**

**1. DOMÍNIO + SLUG** (Mais comum)
\`\`\`javascript
await flexibleDeploy.deployFlexible({
  productName: "NerveCalm",
  type: "domain-with-slug",
  domain: "nervecalm-bestprice.com",
  slug: "usa",
  localPath: "/path/to/presell"
})
// Resultado: https://nervecalm-bestprice.com/usa
\`\`\`

**2. DOMÍNIO PRÓPRIO**
\`\`\`javascript
await flexibleDeploy.deployFlexible({
  productName: "Glicoshield",
  type: "custom-domain", 
  domain: "glicoshield-official.net",
  localPath: "/path/to/presell"
})
// Resultado: https://glicoshield-official.net
\`\`\`

**3. SUBDOMÍNIO** (Raramente)
\`\`\`javascript
await flexibleDeploy.deployFlexible({
  productName: "Oxyscrema",
  type: "subdomain",
  domain: "oxyscrema-deals.com", 
  slug: "italy",
  localPath: "/path/to/presell"
})
// Resultado: https://italy.oxyscrema-deals.com
\`\`\`

**DNS SETUP OBRIGATÓRIO:**
- A Record: domain → 161.97.145.169
- A Record: www.domain → 161.97.145.169
`
  }
}

// Export singleton
export const flexibleDeploy = new VPSFlexibleDeploy()