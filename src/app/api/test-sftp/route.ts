/**
 * API para testar conectividade SSH/SFTP com Hostinger
 * Usa comandos shell em vez de bibliotecas Node.js SSH
 */

import { NextRequest, NextResponse } from 'next/server'
import { hostingerShellDeploy } from '@/lib/deployment/hostinger-shell-deploy'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando teste de conectividade SFTP...')
    
    // Verificar dependências primeiro
    const deps = await hostingerShellDeploy.checkDependencies()
    console.log('🔍 Dependências:', deps)

    // Testar conexão com produto de exemplo
    const testResult = await hostingerShellDeploy.testConnection('test-product')
    
    if (testResult) {
      // Listar arquivos para confirmar acesso
      const files = await hostingerShellDeploy.listRemoteFiles('/public_html')
      
      return NextResponse.json({
        success: true,
        message: 'Conexão SFTP funcionando perfeitamente!',
        details: {
          host: process.env.FTP_HOST,
          port: 22,
          protocol: 'SSH/SCP Shell Commands',
          dependencies: deps,
          filesFound: files.length,
          sampleFiles: files.slice(0, 10).map(f => ({
            name: f.name,
            type: f.type === 'd' ? 'directory' : 'file',
            size: f.size,
            permissions: f.permissions,
            modifyTime: f.modifyTime
          }))
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha na conexão SFTP',
        details: {
          host: process.env.FTP_HOST,
          port: 22,
          protocol: 'SFTP (SSH File Transfer Protocol)',
          error: 'Conexão timeout ou credenciais inválidas'
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Erro no teste SFTP:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno no teste SFTP',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: {
        host: process.env.FTP_HOST,
        port: 22,
        protocol: 'SFTP (SSH File Transfer Protocol)'
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productName, action } = await request.json()
    
    console.log(`🔍 Teste SFTP para produto: ${productName}`)
    console.log(`🎯 Ação: ${action}`)
    
    switch (action) {
      case 'test-connection':
        const testResult = await hostingerShellDeploy.testConnection(productName)
        return NextResponse.json({
          success: testResult,
          message: testResult ? 'Conexão SSH OK' : 'Falha na conexão SSH',
          productName
        })
        
      case 'list-files':
        const files = await hostingerShellDeploy.listRemoteFiles(`/public_html/${productName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`)
        return NextResponse.json({
          success: true,
          message: `Arquivos listados para ${productName}`,
          files: files.map(f => ({
            name: f.name,
            type: f.type === 'd' ? 'directory' : 'file',
            size: f.size,
            permissions: f.permissions
          }))
        })
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Ação não reconhecida',
          availableActions: ['test-connection', 'list-files']
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('❌ Erro no teste SFTP POST:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro no teste SFTP',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}