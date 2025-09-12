/**
 * Hostinger Shell-based Deployment
 * Deploy automático via comandos shell (scp/rsync) para múltiplos produtos
 * Substitui as bibliotecas SSH Node.js que têm problemas com Next.js
 */

import { spawn, exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs/promises'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface HostingerShellConfig {
  host: string
  username: string
  password: string
  port: number
}

export class HostingerShellDeploy {
  private config: HostingerShellConfig
  
  constructor() {
    this.config = {
      host: process.env.FTP_HOST || 'mediumblue-monkey-640112.hostingersite.com',
      username: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
      password: process.env.FTP_PASSWORD || '',
      port: 22
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
   * Criar script de SSH temporário para evitar entrada de senha interativa
   */
  private async createSSHScript(command: string): Promise<string> {
    const scriptPath = `/tmp/ssh-script-${Date.now()}.sh`
    
    const scriptContent = `#!/bin/bash
export SSHPASS='${this.config.password}'
sshpass -e ssh -o StrictHostKeyChecking=no -p ${this.config.port} ${this.config.username}@${this.config.host} "${command}"
`
    
    await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 })
    return scriptPath
  }

  /**
   * Executar comando SSH usando sshpass
   */
  private async executeSSHCommand(command: string): Promise<{ stdout: string, stderr: string, code: number }> {
    try {
      console.log(`🔧 Executando SSH: ${command}`)
      
      const scriptPath = await this.createSSHScript(command)
      
      try {
        const { stdout, stderr } = await execAsync(scriptPath)
        
        // Remover script temporário
        await fs.unlink(scriptPath).catch(() => {}) // Ignore errors
        
        return { stdout, stderr, code: 0 }
      } catch (error: any) {
        // Remover script temporário
        await fs.unlink(scriptPath).catch(() => {}) // Ignore errors
        
        return { 
          stdout: error.stdout || '', 
          stderr: error.stderr || error.message, 
          code: error.code || 1 
        }
      }
    } catch (error: any) {
      return { 
        stdout: '', 
        stderr: error.message, 
        code: 1 
      }
    }
  }

  /**
   * Upload de arquivos usando SCP
   */
  private async uploadWithSCP(localPath: string, remotePath: string): Promise<boolean> {
    try {
      console.log(`📤 SCP Upload: ${localPath} → ${remotePath}`)
      
      const scpCommand = `sshpass -p '${this.config.password}' scp -o StrictHostKeyChecking=no -P ${this.config.port} -r "${localPath}" ${this.config.username}@${this.config.host}:"${remotePath}"`
      
      const { stdout, stderr } = await execAsync(scpCommand)
      
      // Success case - execAsync doesn't throw if successful
      console.log('✅ Upload SCP realizado com sucesso')
      return true
    } catch (error: any) {
      console.error('❌ Erro no SCP:', error.message)
      return false
    }
  }

  /**
   * Upload usando rsync (mais robusto para sincronização)
   */
  private async uploadWithRsync(localPath: string, remotePath: string): Promise<boolean> {
    try {
      console.log(`🔄 Rsync Upload: ${localPath} → ${remotePath}`)
      
      const rsyncCommand = `sshpass -p '${this.config.password}' rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no -p ${this.config.port}" "${localPath}/" ${this.config.username}@${this.config.host}:"${remotePath}/"`
      
      const { stdout, stderr } = await execAsync(rsyncCommand)
      
      // Success case - execAsync doesn't throw if successful
      console.log('✅ Rsync realizado com sucesso')
      console.log('📊 Rsync output:', stdout.split('\n').slice(-5).join('\n')) // Últimas 5 linhas
      return true
    } catch (error: any) {
      console.error('❌ Erro no Rsync:', error.message)
      return false
    }
  }

  /**
   * Deploy de pre-sell para um produto específico
   */
  async deployPresell(
    productKey: string,
    localPath: string,
    remotePath?: string
  ): Promise<boolean> {
    
    // Usar configuração dinâmica que aceita qualquer produto
    const domainConfig = this.createDomainConfig(productKey)
    const finalRemotePath = remotePath || domainConfig.remotePath
    
    console.log(`🚀 Deploying to Hostinger via Shell: ${domainConfig.domain}`)
    console.log(`📁 Local: ${localPath} → Remote: ${finalRemotePath}`)
    console.log(`🔐 Using SSH/SCP (port 22) for secure transfer`)
    
    try {
      // 1. Verificar se diretório local existe
      const localStats = await fs.stat(localPath)
      if (!localStats.isDirectory()) {
        console.error(`❌ Diretório local não encontrado: ${localPath}`)
        return false
      }

      // 2. Criar diretório remoto
      const mkdirResult = await this.executeSSHCommand(`mkdir -p "${finalRemotePath}"`)
      if (mkdirResult.code !== 0) {
        console.error('❌ Falha ao criar diretório remoto:', mkdirResult.stderr)
        return false
      }
      
      console.log(`✅ Diretório criado/verificado: ${finalRemotePath}`)

      // 3. Tentar upload com rsync primeiro (mais eficiente)
      const rsyncSuccess = await this.uploadWithRsync(localPath, finalRemotePath)
      
      if (rsyncSuccess) {
        console.log('✅ Deploy Shell completo via Rsync!')
        console.log(`🌐 Acesse: https://${domainConfig.domain}`)
        return true
      } else {
        // 4. Fallback para SCP se rsync falhar
        console.log('🔄 Tentando fallback com SCP...')
        const scpSuccess = await this.uploadWithSCP(localPath, finalRemotePath)
        
        if (scpSuccess) {
          console.log('✅ Deploy Shell completo via SCP!')
          console.log(`🌐 Acesse: https://${domainConfig.domain}`)
          return true
        } else {
          console.error('❌ Falha em ambos os métodos (rsync e scp)')
          return false
        }
      }
      
    } catch (error) {
      console.error('❌ Erro no deploy Shell:', error)
      return false
    }
  }

  /**
   * Teste de conexão SSH
   */
  async testConnection(productKey: string): Promise<boolean> {
    const domainConfig = this.createDomainConfig(productKey)
    
    try {
      console.log(`🔍 Testando conexão SSH para ${domainConfig.domain}...`)
      console.log(`🔐 Host: ${this.config.host}:${this.config.port}`)
      
      // Testar comando simples
      const result = await this.executeSSHCommand('whoami && pwd && ls -la /public_html | head -10')
      
      if (result.code === 0) {
        console.log('✅ Conexão SSH funcionando!')
        console.log('📁 Informações do servidor:')
        console.log(result.stdout)
        return true
      } else {
        console.error('❌ Falha na conexão SSH:', result.stderr)
        return false
      }
      
    } catch (error) {
      console.error('❌ Erro no teste SSH:', error)
      return false
    }
  }

  /**
   * Listar arquivos remotos
   */
  async listRemoteFiles(remotePath: string = '/public_html'): Promise<any[]> {
    try {
      const result = await this.executeSSHCommand(`ls -la "${remotePath}"`)
      
      if (result.code === 0) {
        // Parse da saída do ls
        const lines = result.stdout.split('\n').filter(line => line.trim() && !line.startsWith('total'))
        
        return lines.map(line => {
          const parts = line.trim().split(/\s+/)
          if (parts.length >= 9) {
            return {
              name: parts.slice(8).join(' '), // Nome do arquivo
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
    }
  }

  /**
   * Verificar se sshpass está instalado
   */
  async checkDependencies(): Promise<{ sshpass: boolean, rsync: boolean, scp: boolean }> {
    const deps = {
      sshpass: false,
      rsync: false,
      scp: false
    }

    try {
      // Verificar sshpass
      await execAsync('which sshpass')
      deps.sshpass = true
    } catch {} // Ignore error

    try {
      // Verificar rsync
      await execAsync('which rsync')
      deps.rsync = true
    } catch {} // Ignore error

    try {
      // Verificar scp
      await execAsync('which scp')
      deps.scp = true
    } catch {} // Ignore error

    return deps
  }

  /**
   * Instalar dependências se necessário (macOS)
   */
  async installDependencies(): Promise<boolean> {
    try {
      console.log('📦 Verificando/instalando dependências...')
      
      const deps = await this.checkDependencies()
      
      if (!deps.sshpass) {
        console.log('📦 Instalando sshpass via Homebrew...')
        await execAsync('brew install sshpass')
        console.log('✅ sshpass instalado')
      }

      if (!deps.rsync) {
        console.log('📦 Instalando rsync via Homebrew...')
        await execAsync('brew install rsync')
        console.log('✅ rsync instalado')
      }

      console.log('✅ Todas as dependências estão disponíveis')
      return true
      
    } catch (error) {
      console.error('❌ Erro ao instalar dependências:', error)
      console.log('💡 Instale manualmente: brew install sshpass rsync')
      return false
    }
  }
}

// Exportar instância singleton
export const hostingerShellDeploy = new HostingerShellDeploy()