/**
 * API para deployment flexível
 * Suporta domínio+slug, domínio próprio e subdomínio
 */

import { NextRequest, NextResponse } from 'next/server'
import { flexibleDeploy } from '@/lib/deployment/vps-flexible-deploy'

export async function POST(request: NextRequest) {
  try {
    const { action, productName, type, domain, slug, country, localPath, presellFiles } = await request.json()
    
    console.log(`🌐 Flexible Deploy Action: ${action}`)
    console.log(`📦 Product: ${productName}, Type: ${type}`)
    
    switch (action) {
      case 'deploy':
        if (!productName || !type || !domain) {
          return NextResponse.json({
            success: false,
            message: 'productName, type e domain são obrigatórios'
          }, { status: 400 })
        }

        // Se não tem localPath, mas tem presellFiles, vamos criar um diretório temporário
        let finalLocalPath = localPath
        
        if (!localPath && presellFiles) {
          const fs = require('fs')
          const path = require('path')
          const tmpDir = `/tmp/${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`
          
          try {
            fs.mkdirSync(tmpDir, { recursive: true })
            
            // Escrever arquivos de presell no diretório temporário
            Object.entries(presellFiles).forEach(([filename, content]: [string, string]) => {
              fs.writeFileSync(path.join(tmpDir, filename), content)
            })
            
            finalLocalPath = tmpDir
            console.log(`📁 Arquivos temporários criados em: ${finalLocalPath}`)
          } catch (error) {
            console.error('❌ Erro ao criar arquivos temporários:', error)
            return NextResponse.json({
              success: false,
              message: 'Erro ao processar arquivos de presell'
            }, { status: 500 })
          }
        }

        if (!finalLocalPath) {
          return NextResponse.json({
            success: false,
            message: 'localPath ou presellFiles são obrigatórios'
          }, { status: 400 })
        }
        
        // Validar tipo
        if (!['domain-with-slug', 'custom-domain', 'subdomain'].includes(type)) {
          return NextResponse.json({
            success: false,
            message: 'type deve ser: domain-with-slug, custom-domain ou subdomain'
          }, { status: 400 })
        }
        
        // Validar slug para tipos que precisam
        if ((type === 'domain-with-slug' || type === 'subdomain') && !slug) {
          return NextResponse.json({
            success: false,
            message: `slug é obrigatório para tipo: ${type}`
          }, { status: 400 })
        }
        
        const deployResult = await flexibleDeploy.deployFlexible({
          productName,
          type,
          domain,
          slug,
          country,
          localPath: finalLocalPath
        })
        
        return NextResponse.json(deployResult)
        
      case 'examples':
        return NextResponse.json({
          success: true,
          examples: flexibleDeploy.getExamples(),
          supportedTypes: [
            {
              type: 'domain-with-slug',
              description: 'Domínio + slug (domain.com/usa)',
              example: 'nervecalm-bestprice.com/brazil',
              requiredFields: ['domain', 'slug']
            },
            {
              type: 'custom-domain',
              description: 'Domínio próprio único (domain.com)',
              example: 'glicoshield-official.net',
              requiredFields: ['domain']
            },
            {
              type: 'subdomain',
              description: 'Subdomínio (slug.domain.com)',
              example: 'italy.oxyscrema-deals.com',
              requiredFields: ['domain', 'slug']
            }
          ]
        })
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Ação não reconhecida',
          availableActions: ['deploy', 'examples']
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('❌ Erro na API flexible-deploy:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno na API',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Retornar exemplos e documentação
    return NextResponse.json({
      success: true,
      message: 'Sistema de Deploy Flexível - Domínios Múltiplos',
      documentation: {
        vpsIP: '161.97.145.169',
        dnsSetup: 'Configure A Record: domain → 161.97.145.169',
        supportedTypes: [
          'domain-with-slug: domain.com/slug',
          'custom-domain: unique-domain.com', 
          'subdomain: slug.domain.com'
        ]
      },
      examples: flexibleDeploy.getExamples()
    })
    
  } catch (error) {
    console.error('❌ Erro ao obter documentação:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao obter documentação',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}