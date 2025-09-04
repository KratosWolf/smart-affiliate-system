/**
 * API para deploy em domínios personalizados
 * Cada produto pode ter seu próprio domínio
 */

import { NextRequest, NextResponse } from 'next/server'
import { multiDomainDeploy } from '@/lib/deployment/vps-multi-domain-deploy'

export async function POST(request: NextRequest) {
  try {
    const { action, productName, customDomain, localPath } = await request.json()
    
    console.log(`🌐 Domain Action: ${action} for ${productName} → ${customDomain}`)
    
    switch (action) {
      case 'deploy':
        if (!productName || !customDomain || !localPath) {
          return NextResponse.json({
            success: false,
            message: 'productName, customDomain e localPath são obrigatórios'
          }, { status: 400 })
        }
        
        const deployResult = await multiDomainDeploy.deployToCustomDomain(
          productName,
          customDomain, 
          localPath
        )
        
        return NextResponse.json({
          ...deployResult,
          guide: deployResult.success ? undefined : multiDomainDeploy.getDeploymentGuide(productName, customDomain)
        })
        
      case 'guide':
        if (!productName || !customDomain) {
          return NextResponse.json({
            success: false,
            message: 'productName e customDomain são obrigatórios'
          }, { status: 400 })
        }
        
        return NextResponse.json({
          success: true,
          guide: multiDomainDeploy.getDeploymentGuide(productName, customDomain)
        })
        
      case 'list-domains':
        const domains = await multiDomainDeploy.listDomains()
        return NextResponse.json({
          success: true,
          domains,
          count: domains.length
        })
        
      case 'remove':
        if (!productName || !customDomain) {
          return NextResponse.json({
            success: false,
            message: 'productName e customDomain são obrigatórios'
          }, { status: 400 })
        }
        
        const removeResult = await multiDomainDeploy.removeDomain(productName, customDomain)
        return NextResponse.json({
          success: removeResult,
          message: removeResult ? `Domínio ${customDomain} removido` : 'Erro ao remover domínio'
        })
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Ação não reconhecida',
          availableActions: ['deploy', 'guide', 'list-domains', 'remove']
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('❌ Erro na API deploy-domain:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno na API',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // List all configured domains
    const domains = await multiDomainDeploy.listDomains()
    
    return NextResponse.json({
      success: true,
      message: 'Domínios configurados no VPS',
      domains,
      count: domains.length,
      vpsIP: '161.97.145.169',
      instructions: 'Configure DNS A Record para cada domínio apontando para o IP do VPS'
    })
    
  } catch (error) {
    console.error('❌ Erro ao listar domínios:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao listar domínios',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}