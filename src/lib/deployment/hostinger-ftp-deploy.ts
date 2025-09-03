/**
 * Hostinger FTP Deployment
 * Deploy automático para múltiplos Addon Domains
 */

import * as ftp from 'basic-ftp'
import * as path from 'path'
import * as fs from 'fs/promises'

export interface HostingerConfig {
  host: string
  baseUserId: string  // u973230760
  domains: {
    [key: string]: {  // produto -> domínio
      domain: string
      ftpUser: string
      ftpPassword: string
      remotePath?: string
    }
  }
}

export class HostingerFTPDeploy {
  private config: HostingerConfig
  
  constructor() {
    // Configuração para bestbargains24x7.com com subpastas para cada produto
    this.config = {
      host: process.env.FTP_HOST || '147.79.84.17',
      baseUserId: 'u973230760',
      domains: {
        // Estrutura usando SUBPASTAS no domínio principal
        'glicoshield': {
          domain: 'bestbargains24x7.com/glicoshield',
          ftpUser: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
          ftpPassword: process.env.FTP_PASSWORD || '',
          remotePath: '/public_html/glicoshield'
        },
        'nervecalm': {
          domain: 'bestbargains24x7.com/nervecalm',
          ftpUser: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
          ftpPassword: process.env.FTP_PASSWORD || '',
          remotePath: '/public_html/nervecalm'
        },
        'oxyscrema': {
          domain: 'bestbargains24x7.com/oxyscrema',
          ftpUser: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
          ftpPassword: process.env.FTP_PASSWORD || '',
          remotePath: '/public_html/oxyscrema'
        },
        'gutdrops': {
          domain: 'bestbargains24x7.com/gutdrops',
          ftpUser: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
          ftpPassword: process.env.FTP_PASSWORD || '',
          remotePath: '/public_html/gutdrops'
        },
        'skinatrin': {
          domain: 'bestbargains24x7.com/skinatrin',
          ftpUser: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
          ftpPassword: process.env.FTP_PASSWORD || '',
          remotePath: '/public_html/skinatrin'
        }
      }
    }
  }

  // Método dinâmico que aceita qualquer produto
  private createDomainConfig(productName: string) {
    const slug = productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    return {
      domain: `bestbargains24x7.com/${slug}`,
      ftpUser: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
      ftpPassword: process.env.FTP_PASSWORD || '',
      remotePath: `/public_html/${slug}`
    };
  }
  
  /**
   * Deploy de pre-sell para um Addon Domain específico
   */
  async deployPresell(
    productKey: string,
    localPath: string,
    remotePath: string = '/public_html'
  ): Promise<boolean> {
    
    // Usar configuração dinâmica que aceita qualquer produto
    const domainConfig = this.createDomainConfig(productKey)
    
    console.log(`🚀 Deploying to Hostinger Addon Domain: ${domainConfig.domain}`)
    console.log(`📁 Local: ${localPath} → Remote: ${remotePath}`)
    
    const client = new ftp.Client()
    client.ftp.verbose = true
    
    try {
      // Conectar ao FTP com modo passivo e timeout maior
      await client.access({
        host: this.config.host,
        user: domainConfig.ftpUser,
        password: domainConfig.ftpPassword,
        secure: false,
        port: 21,
        connTimeout: 60000, // 60 segundos timeout
        pasvTimeout: 60000, // 60 segundos timeout passivo  
        keepalive: 10000    // Keep-alive 10 segundos
      })
      
      console.log('✅ Conectado ao FTP da Hostinger')
      
      // Verificar/criar diretório remoto
      await client.ensureDir(remotePath)
      
      // Upload de arquivos
      const files = await fs.readdir(localPath)
      
      for (const file of files) {
        const localFile = path.join(localPath, file)
        const remoteFile = path.join(remotePath, file)
        
        const stats = await fs.stat(localFile)
        
        if (stats.isDirectory()) {
          // Recursivamente fazer upload de diretórios
          await this.uploadDirectory(client, localFile, remoteFile)
        } else {
          // Upload de arquivo individual
          console.log(`📤 Uploading: ${file}`)
          await client.uploadFrom(localFile, remoteFile)
        }
      }
      
      console.log('✅ Deploy completo!')
      console.log(`🌐 Acesse: https://${domainConfig.domain}`)
      
      return true
      
    } catch (error) {
      console.error('❌ Erro no deploy FTP:', error)
      return false
      
    } finally {
      client.close()
    }
  }
  
  /**
   * Upload recursivo de diretório
   */
  private async uploadDirectory(
    client: ftp.Client,
    localDir: string,
    remoteDir: string
  ): Promise<void> {
    
    await client.ensureDir(remoteDir)
    const files = await fs.readdir(localDir)
    
    for (const file of files) {
      const localPath = path.join(localDir, file)
      const remotePath = path.join(remoteDir, file)
      
      const stats = await fs.stat(localPath)
      
      if (stats.isDirectory()) {
        await this.uploadDirectory(client, localPath, remotePath)
      } else {
        await client.uploadFrom(localPath, remotePath)
      }
    }
  }
  
  /**
   * Criar novo Addon Domain via cPanel API (se disponível)
   */
  async createAddonDomain(domain: string, subdomain: string): Promise<boolean> {
    console.log(`📝 Para adicionar novo domínio ${domain}:`);
    console.log('1. Acesse hPanel: https://hpanel.hostinger.com')
    console.log('2. Vá em "Websites" → "Addon Domains"')
    console.log(`3. Adicione: ${domain}`)
    console.log(`4. Subdomínio: ${subdomain}`)
    console.log(`5. Diretório: /public_html/${subdomain}`)
    console.log('6. Crie conta FTP: u973230760.' + domain)
    
    // Hostinger não tem API pública para criar Addon Domains
    // Precisa ser feito manualmente no hPanel
    
    return false
  }
  
  /**
   * Listar todos os domínios configurados
   */
  listConfiguredDomains(): void {
    console.log('📋 Domínios Configurados na Hostinger:')
    console.log('=====================================')
    
    for (const [key, config] of Object.entries(this.config.domains)) {
      console.log(`\n🌐 ${key}:`)
      console.log(`   Domain: ${config.domain}`)
      console.log(`   FTP User: ${config.ftpUser}`)
      console.log(`   URL: https://${config.domain}`)
    }
    
    console.log('\n💡 Para adicionar novo domínio:')
    console.log('   1. Crie Addon Domain no hPanel')
    console.log('   2. Configure FTP específico')
    console.log('   3. Adicione no objeto "domains" acima')
  }
  
  /**
   * Teste de conexão FTP
   */
  async testConnection(productKey: string): Promise<boolean> {
    // Usar configuração dinâmica que aceita qualquer produto
    const domainConfig = this.createDomainConfig(productKey)
    
    const client = new ftp.Client()
    
    try {
      console.log(`🔍 Testando conexão para ${domainConfig.domain}...`)
      
      await client.access({
        host: this.config.host,
        user: domainConfig.ftpUser,
        password: domainConfig.ftpPassword,
        secure: false,
        port: 21,
        connTimeout: 60000, // 60 segundos timeout
        pasvTimeout: 60000, // 60 segundos timeout passivo  
        keepalive: 10000    // Keep-alive 10 segundos
      })
      
      console.log('✅ Conexão FTP funcionando!')
      
      // Listar arquivos no diretório raiz
      const list = await client.list('/public_html')
      console.log(`📁 Arquivos em /public_html: ${list.length} items`)
      
      return true
      
    } catch (error) {
      console.error('❌ Falha na conexão:', error)
      return false
      
    } finally {
      client.close()
    }
  }
}

// Exportar instância singleton
export const hostingerDeploy = new HostingerFTPDeploy()