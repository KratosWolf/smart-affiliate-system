import { NextRequest, NextResponse } from 'next/server'
import { campaignBuilder } from '@/lib/campaigns/campaign-builder'
import { csvExporter } from '@/lib/campaigns/csv-exporter'
import { ProductValidationResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Support both full validation and basic campaign data
    const { validation, affiliateUrl, presellUrl, exportFormat, productName, targetCountry, dailyBudget, targetCpa } = body
    
    let validationData: ProductValidationResponse
    
    if (validation) {
      // Use full validation data if provided
      validationData = validation
    } else if (productName && targetCountry && affiliateUrl) {
      // Create basic validation data for campaign builder
      validationData = {
        id: crypto.randomUUID(),
        productName,
        productUrl: affiliateUrl,
        targetCountry,
        validationScore: 75,
        status: 'completed' as const,
        productData: {
          title: productName,
          description: `${productName} - Produto de alta qualidade`,
          price: 100,
          currency: 'USD',
          images: [],
          category: 'Health'
        },
        marketAnalysis: {
          searchVolume: 10000,
          competitionLevel: 'medium' as const,
          avgCpc: targetCpa ? targetCpa * 0.4 : 2.5,
          trend: 'stable' as const
        },
        viabilityMetrics: {
          profitability: 8,
          competitiveness: 7,
          demand: 8,
          scalability: 7
        },
        recommendations: {
          suggestedBudget: dailyBudget || 50,
          estimatedRoi: 150,
          launchRecommendation: 'LAUNCH'
        },
        validatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      } as ProductValidationResponse
    } else {
      return NextResponse.json({
        success: false,
        error: 'É necessário fornecer dados de validação OU (productName + targetCountry + affiliateUrl)'
      }, { status: 400 })
    }

    // Gera estrutura da campanha
    const campaign = await campaignBuilder.buildCampaign(validationData, affiliateUrl, presellUrl)
    
    // Valida a campanha gerada
    const validation_result = csvExporter.validateCampaign(campaign)
    
    if (!validation_result.valid) {
      return NextResponse.json({
        success: false,
        error: 'Campanha gerada não está válida',
        validation_errors: validation_result.errors
      }, { status: 400 })
    }
    
    // Gera CSVs se solicitado
    let csvData = null
    if (exportFormat === 'csv') {
      csvData = csvExporter.exportCampaign(campaign)
    }
    
    // Gera resumo
    const summary = csvExporter.generateSummary(campaign)
    
    const response = {
      success: true,
      data: {
        campaign,
        summary,
        csvData,
        validation: validation_result,
        metadata: {
          productName: validationData.productName,
          targetCountry: validationData.targetCountry,
          estimatedPerformance: {
            dailyClicks: Math.round(campaign.campaign.budget / (campaign.keywords[0]?.maxCpc || 2.0)),
            estimatedConversions: Math.round((campaign.campaign.budget / (campaign.keywords[0]?.maxCpc || 2.0)) * 0.03), // 3% conversion rate
            estimatedCpa: campaign.campaign.targetCpa,
            estimatedRoi: validationData.recommendations.estimatedRoi
          },
          generatedAt: new Date().toISOString()
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Campaign generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno na geração da campanha'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/campaign',
    methods: ['POST'],
    description: 'Gera campanha Google Ads otimizada com CSVs prontos',
    requiredParams: {
      validation: 'ProductValidationResponse - dados da validação do produto',
      affiliateUrl: 'string - URL de afiliado para conversão'
    },
    optionalParams: {
      presellUrl: 'string - URL da presell gerada (se disponível)',
      exportFormat: 'string - "csv" para incluir arquivos CSV na resposta'
    },
    example: {
      validation: '{ productName: "Skinatrin", targetCountry: "Polônia", validationScore: 85, ... }',
      affiliateUrl: 'https://go.hotmart.com/abc123',
      presellUrl: 'https://presells.smart-affiliate.com/skinatrin.html',
      exportFormat: 'csv'
    },
    response: {
      campaign: 'Estrutura completa da campanha',
      summary: 'Resumo em markdown para revisão',
      csvData: 'Arquivos CSV prontos para Google Ads (se solicitado)',
      metadata: 'Métricas estimadas e informações extras'
    }
  })
}