/**
 * Hostinger SFTP Deployment
 * Deploy automático via SFTP (porta 22) para múltiplos produtos
 * Substitui FTP que estava com problemas de conectividade
 */

import { NodeSSH } from 'node-ssh'
import * as path from 'path'
import * as fs from 'fs/promises'

export interface HostingerSFTPConfig {
  host: string
  username: string
  password: string
  port: number
}

export class HostingerSFTPDeploy {
  private config: HostingerSFTPConfig
  
  constructor() {
    // Configuração SFTP usando as mesmas credenciais do FTP mas porta 22
    this.config = {
      host: process.env.FTP_HOST || 'mediumblue-monkey-640112.hostingersite.com',
      username: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
      password: process.env.FTP_PASSWORD || '',
      port: 22 // SFTP usa porta 22 em vez de 21
    }
  }

  // Método dinâmico que aceita qualquer produto
  private createDomainConfig(productName: string) {
    const slug = productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    return {
      domain: `bestbargains24x7.com/${slug}`,
      remotePath: `/public_html/${slug}`
    };
  }
  
  /**
   * Deploy de pre-sell para um produto específico via SFTP
   */
  async deployPresell(
    productKey: string,
    localPath: string,
    remotePath?: string
  ): Promise<boolean> {
    
    // Usar configuração dinâmica que aceita qualquer produto
    const domainConfig = this.createDomainConfig(productKey)
    const finalRemotePath = remotePath || domainConfig.remotePath
    
    console.log(`🚀 Deploying to Hostinger via SFTP: ${domainConfig.domain}`)
    console.log(`📁 Local: ${localPath} → Remote: ${finalRemotePath}`)
    console.log(`🔐 Using SFTP (port 22) for secure transfer`)
    
    const ssh = new NodeSSH()
    
    try {
      // Conectar ao SSH/SFTP
      await ssh.connect({
        host: this.config.host,
        username: this.config.username,
        password: this.config.password,
        port: this.config.port,
        readyTimeout: 60000, // 60 segundos timeout
        algorithms: {
          kex: ['diffie-hellman-group14-sha256', 'diffie-hellman-group-exchange-sha256'],
          cipher: ['aes128-ctr', 'aes192-ctr', 'aes256-ctr'],
          serverHostKey: ['rsa-sha2-512', 'rsa-sha2-256', 'ssh-rsa'],
          hmac: ['hmac-sha2-256', 'hmac-sha2-512']
        }
      })
      
      console.log('✅ Conectado ao SFTP da Hostinger')
      
      // Criar diretório remoto se não existir
      await ssh.execCommand(`mkdir -p ${finalRemotePath}`)
      
      // Upload de diretório completo
      console.log(`📤 Uploading directory: ${localPath} → ${finalRemotePath}`)
      
      const uploadResult = await ssh.putDirectory(localPath, finalRemotePath, {
        recursive: true,
        concurrency: 3, // Upload 3 arquivos em paralelo
        validate: (itemPath) => {
          // Validar quais arquivos fazer upload
          const basename = path.basename(itemPath)
          return !basename.startsWith('.') // Ignorar arquivos ocultos
        },
        tick: (localPath, remotePath, error) => {
          if (error) {
            console.error(`❌ Erro no upload: ${localPath}`, error)
          } else {
            console.log(`✅ Uploaded: ${path.basename(localPath)}`)
          }
        }
      })
      
      if (uploadResult) {
        console.log('✅ Deploy SFTP completo!')
        console.log(`🌐 Acesse: https://${domainConfig.domain}`)
        return true
      } else {
        console.error('❌ Falha no upload de arquivos')
        return false
      }
      
    } catch (error) {
      console.error('❌ Erro no deploy SFTP:', error)
      
      // Log detalhado do erro para diagnóstico
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      
      return false
      
    } finally {
      ssh.dispose()
    }
  }
  
  /**
   * Verificar status do servidor remoto
   */
  async getServerInfo(): Promise<any> {
    const ssh = new NodeSSH()
    
    try {
      await ssh.connect({
        host: this.config.host,
        username: this.config.username,
        password: this.config.password,
        port: this.config.port,
        readyTimeout: 30000
      })
      
      // Executar comandos para obter informações do servidor
      const commands = [
        'pwd',
        'ls -la /public_html',
        'df -h',
        'whoami'
      ]
      
      const results: any = {}
      
      for (const cmd of commands) {
        try {
          const result = await ssh.execCommand(cmd)
          results[cmd] = {
            stdout: result.stdout,
            stderr: result.stderr,
            code: result.code
          }
        } catch (error) {
          results[cmd] = { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
      
      return results
      
    } catch (error) {
      console.error('❌ Erro ao obter informações do servidor:', error)
      return null
    } finally {
      ssh.dispose()
    }
  }
  
  /**
   * Teste de conexão SFTP
   */
  async testConnection(productKey: string): Promise<boolean> {
    // Usar configuração dinâmica que aceita qualquer produto
    const domainConfig = this.createDomainConfig(productKey)
    
    const ssh = new NodeSSH()
    
    try {
      console.log(`🔍 Testando conexão SFTP para ${domainConfig.domain}...`)
      console.log(`🔐 Host: ${this.config.host}:${this.config.port}`)
      
      await ssh.connect({
        host: this.config.host,
        username: this.config.username,
        password: this.config.password,
        port: this.config.port,
        readyTimeout: 60000
      })
      
      console.log('✅ Conexão SFTP funcionando!')
      
      // Listar arquivos no diretório público
      const result = await ssh.execCommand('ls -la /public_html')
      
      if (result.code === 0) {
        console.log(`📁 Conteúdo de /public_html:`)
        console.log(result.stdout)
        
        // Contar arquivos/diretórios
        const lines = result.stdout.split('\n').filter(line => line.trim() && !line.startsWith('total'))
        console.log(`📊 Total de itens: ${lines.length}`)
        
        return true
      } else {
        console.error('❌ Erro ao listar diretório:', result.stderr)
        return false
      }
      
    } catch (error) {
      console.error('❌ Falha na conexão SFTP:', error)
      
      // Log detalhado do erro para diagnóstico
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      
      return false
      
    } finally {
      ssh.dispose()
    }
  }
  
  /**
   * Listar arquivos remotos em um diretório
   */
  async listRemoteFiles(remotePath: string = '/public_html'): Promise<any[]> {
    const ssh = new NodeSSH()
    
    try {
      await ssh.connect({
        host: this.config.host,
        username: this.config.username,
        password: this.config.password,
        port: this.config.port,
        readyTimeout: 30000
      })
      
      const result = await ssh.execCommand(`ls -la "${remotePath}"`)
      
      if (result.code === 0) {
        // Parse da saída do ls para criar array de objetos
        const lines = result.stdout.split('\n').filter(line => line.trim() && !line.startsWith('total'))
        
        return lines.map(line => {
          const parts = line.trim().split(/\s+/)
          if (parts.length >= 9) {
            return {
              name: parts.slice(8).join(' '), // Nome do arquivo (pode ter espaços)
              type: line.startsWith('d') ? 'd' : 'f', // diretório ou arquivo
              permissions: parts[0],
              size: parts[4],
              modifyTime: `${parts[5]} ${parts[6]} ${parts[7]}`
            }
          }
          return null
        }).filter(Boolean)
      }
      
      return []
      
    } catch (error) {
      console.error('❌ Erro ao listar arquivos remotos:', error)
      return []
      
    } finally {
      ssh.dispose()
    }
  }
  
  /**
   * Remover arquivos/diretórios remotos
   */
  async removeRemoteDir(remotePath: string): Promise<boolean> {
    const ssh = new NodeSSH()
    
    try {
      await ssh.connect({
        host: this.config.host,
        username: this.config.username,
        password: this.config.password,
        port: this.config.port,
        readyTimeout: 30000
      })
      
      console.log(`🗑️ Removendo ${remotePath}...`)
      
      const result = await ssh.execCommand(`rm -rf "${remotePath}"`)
      
      if (result.code === 0) {
        console.log(`✅ ${remotePath} removido com sucesso`)
        return true
      } else {
        console.error(`❌ Erro ao remover ${remotePath}:`, result.stderr)
        return false
      }
      
    } catch (error) {
      console.error('❌ Erro ao remover diretório:', error)
      return false
      
    } finally {
      ssh.dispose()
    }
  }
}

// Exportar instância singleton
export const hostingerSFTPDeploy = new HostingerSFTPDeploy()