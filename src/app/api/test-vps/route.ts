/**
 * API para testar deployment no VPS
 * Substitui Hostinger que tem limitações de SSH/FTP
 */

import { NextRequest, NextResponse } from 'next/server'
import { vpsDeploy } from '@/lib/deployment/vps-deploy'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testando conexão com VPS...')
    
    // Test VPS connection
    const connectionTest = await vpsDeploy.testConnection()
    
    if (connectionTest) {
      // List existing presells
      const presells = await vpsDeploy.listPresells()
      
      return NextResponse.json({
        success: true,
        message: 'Conexão VPS funcionando perfeitamente!',
        details: {
          vpsHost: '161.97.145.169',
          domain: 'smartaffiliatesystem.site',
          baseUrl: 'https://smartaffiliatesystem.site/presells',
          presellsFound: presells.length,
          existingPresells: presells
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha na conexão VPS',
        details: {
          vpsHost: '161.97.145.169',
          error: 'Não foi possível conectar ao VPS'
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Erro no teste VPS:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno no teste VPS',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productName, action, localPath } = await request.json()
    
    console.log(`🔍 Ação VPS: ${action} para produto: ${productName}`)
    
    switch (action) {
      case 'test-connection':
        const testResult = await vpsDeploy.testConnection()
        return NextResponse.json({
          success: testResult,
          message: testResult ? 'Conexão VPS OK' : 'Falha na conexão VPS',
          productName
        })
        
      case 'deploy':
        if (!localPath) {
          return NextResponse.json({
            success: false,
            message: 'localPath é obrigatório para deploy'
          }, { status: 400 })
        }
        
        const deployResult = await vpsDeploy.deployPresell(productName, localPath)
        return NextResponse.json(deployResult)
        
      case 'list-presells':
        const presells = await vpsDeploy.listPresells()
        return NextResponse.json({
          success: true,
          message: 'Presells listadas',
          presells
        })
        
      case 'remove':
        const removeResult = await vpsDeploy.removePresell(productName)
        return NextResponse.json({
          success: removeResult,
          message: removeResult ? 'Presell removida' : 'Erro ao remover presell',
          productName
        })
        
      case 'setup-nginx':
        const nginxResult = await vpsDeploy.setupNginxConfig()
        return NextResponse.json({
          success: nginxResult,
          message: nginxResult ? 'Nginx configurado' : 'Erro ao configurar nginx'
        })
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Ação não reconhecida',
          availableActions: ['test-connection', 'deploy', 'list-presells', 'remove', 'setup-nginx']
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('❌ Erro no VPS POST:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro na operação VPS',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}