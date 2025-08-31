import { NextRequest, NextResponse } from 'next/server'
import { campaignBuilder } from '@/lib/campaigns/campaign-builder'
import { csvExporter } from '@/lib/campaigns/csv-exporter'
import { luizCampaignGenerator } from '@/lib/campaigns/luiz-campaign-generator'
import { csvGenerator } from '@/lib/campaigns/csv-generator'
import { ProductValidationResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Support both full validation and basic campaign data
    const { 
      validation, 
      affiliateUrl, 
      presellUrl, 
      exportFormat, 
      productName, 
      targetCountry, 
      dailyBudget, 
      targetCpa,
      // METODOLOGIA LUIZ - dados específicos
      useLuizMethod = true,
      campaignData = {}
    } = body
    
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

    // ESCOLHE MÉTODO DE GERAÇÃO
    let campaign: any
    let csvData: any = null
    let summary: string = ''

    if (useLuizMethod) {
      console.log('🎯 Usando METODOLOGIA LUIZ para gerar campanha...')
      
      // Gera campanha usando metodologia oficial do Luiz
      const luizCampaign = luizCampaignGenerator.generateCampaign(
        validationData, 
        affiliateUrl, 
        campaignData
      )

      // Gera CSVs para Google Ads Editor
      if (exportFormat === 'csv') {
        csvData = csvGenerator.generateAllCSVs({
          campaign: luizCampaign.campaign,
          keywords: luizCampaign.keywords,
          headlines: luizCampaign.ads.headlines,
          descriptions: luizCampaign.ads.descriptions,
          sitelinks: luizCampaign.extensions.sitelinks,
          callouts: luizCampaign.extensions.callouts,
          snippets: luizCampaign.extensions.snippets,
          affiliateUrl
        })
      }

      campaign = luizCampaign
      summary = `# 🎯 CAMPANHA GERADA - METODOLOGIA LUIZ

**Produto:** ${validationData.productName}
**Budget:** R$ ${luizCampaign.campaign.budget}/dia
**CPA Target:** ${luizCampaign.campaign.targetCpa}
**Estrutura:** ${luizCampaign.campaign.structure}

## Headlines (${luizCampaign.ads.headlines.length}):
${luizCampaign.ads.headlines.map((h, i) => `${i+1}. ${h}`).join('\n')}

## Descriptions (${luizCampaign.ads.descriptions.length}):
${luizCampaign.ads.descriptions.map((d, i) => `${i+1}. ${d}`).join('\n')}

## Keywords (${luizCampaign.keywords.length}):
${luizCampaign.keywords.map(k => `- ${k.keyword} (${k.case})`).join('\n')}

## Extensions:
- **Sitelinks:** ${luizCampaign.extensions.sitelinks.length}
- **Callouts:** ${luizCampaign.extensions.callouts.length} 
- **Snippets:** ${luizCampaign.extensions.snippets.length}

**✅ PRONTO PARA IMPORT MANUAL NO GOOGLE ADS EDITOR**`

    } else {
      console.log('🔧 Usando método tradicional...')
      
      // Método tradicional (backward compatibility)
      campaign = await campaignBuilder.buildCampaign(validationData, affiliateUrl, presellUrl)
      
      const validation_result = csvExporter.validateCampaign(campaign)
      if (!validation_result.valid) {
        return NextResponse.json({
          success: false,
          error: 'Campanha gerada não está válida',
          validation_errors: validation_result.errors
        }, { status: 400 })
      }
      
      if (exportFormat === 'csv') {
        csvData = csvExporter.exportCampaign(campaign)
      }
      
      summary = csvExporter.generateSummary(campaign)
    }
    
    const response = {
      success: true,
      data: {
        campaign,
        summary,
        csvData,
        methodology: useLuizMethod ? 'LUIZ_OFFICIAL' : 'TRADITIONAL',
        metadata: {
          productName: validationData.productName,
          targetCountry: validationData.targetCountry,
          budgetStrategy: useLuizMethod ? 'FIXED_350_BRL' : 'DYNAMIC',
          structure: useLuizMethod ? '1_CAMPAIGN_1_AD' : 'TRADITIONAL',
          estimatedPerformance: {
            dailyBudget: useLuizMethod ? 350 : (campaign.campaign?.budget || 50),
            dailyClicks: Math.round((useLuizMethod ? 350 : (campaign.campaign?.budget || 50)) / 2.5), // Assuming $2.5 CPC
            estimatedConversions: Math.round(((useLuizMethod ? 350 : (campaign.campaign?.budget || 50)) / 2.5) * 0.03), // 3% conversion rate
            estimatedCpa: useLuizMethod ? campaign.campaign.targetCpa : (campaign.campaign?.targetCpa || 25),
            estimatedRoi: validationData.recommendations.estimatedRoi,
            scalingThreshold: useLuizMethod ? 'ROI > 2.0' : 'Manual',
            maxBudget: useLuizMethod ? 1750 : 'Unlimited'
          },
          csvFiles: csvData ? Object.keys(csvData).length : 0,
          readyForGoogleAds: !!csvData,
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