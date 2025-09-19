/**
 * 🤖 AI CAMPAIGN BUILDER API - ENDPOINT LIMPO
 * Gera campanhas Google Ads usando 100% AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { CampaignAIGenerator, type CampaignInput } from '@/lib/ai/campaign-ai-generator'

export async function POST(request: NextRequest) {
  console.log('🚀 AI Campaign Builder API - Request received')

  try {
    // 1. Parse e validação do input
    const body = await request.json()

    const input: CampaignInput = {
      productName: body.productName?.trim(),
      countryCode: body.countryCode?.toUpperCase(),
      platform: body.platform?.trim(),
      commissionValue: parseFloat(body.commissionValue) || 0,
      commissionCurrency: body.commissionCurrency || 'USD',
      baseUrl: body.baseUrl?.trim(),
      campaignType: body.campaignType || 'Standard'
    }

    // 2. Validações básicas
    if (!input.productName) {
      return NextResponse.json(
        { error: 'Nome do produto é obrigatório' },
        { status: 400 }
      )
    }

    if (!input.countryCode) {
      return NextResponse.json(
        { error: 'País de targeting é obrigatório' },
        { status: 400 }
      )
    }

    if (!input.platform) {
      return NextResponse.json(
        { error: 'Plataforma de afiliado é obrigatória' },
        { status: 400 }
      )
    }

    if (input.commissionValue <= 0) {
      return NextResponse.json(
        { error: 'Valor da comissão deve ser maior que zero' },
        { status: 400 }
      )
    }

    console.log('✅ Input validated:', input)

    // 3. Gerar campanha via AI
    const generator = new CampaignAIGenerator()
    const campaign = await generator.generateCampaign(input)

    // 4. Converter para formato CSV
    const csvFiles = generateCSVFiles(campaign)

    // 5. Resposta final
    const response = {
      success: true,
      campaign: {
        name: campaign.campaignName,
        country: input.countryCode,
        product: input.productName,
        platform: input.platform,
        commission: `${input.commissionCurrency} ${input.commissionValue}`
      },
      csvFiles,
      metadata: {
        headlinesCount: campaign.headlines.length,
        descriptionsCount: campaign.descriptions.length,
        sitelinksCount: campaign.sitelinks.length,
        snippetsCount: campaign.snippets.length,
        keywordsCount: campaign.keywords.length,
        generatedAt: new Date().toISOString()
      }
    }

    console.log('✅ Campaign generated successfully:', response.metadata)

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('❌ AI Campaign Builder Error:', error)

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

/**
 * 📊 GERAR ARQUIVOS CSV
 */
function generateCSVFiles(campaign: any) {
  // Headlines CSV
  const headlinesCSV = [
    'Headline',
    ...campaign.headlines.map((h: string) => `"${h}"`)
  ].join('\\n')

  // Descriptions CSV
  const descriptionsCSV = [
    'Description',
    ...campaign.descriptions.map((d: string) => `"${d}"`)
  ].join('\\n')

  // Sitelinks CSV
  const sitelinksCSV = [
    'Sitelink Title,Sitelink Description',
    ...campaign.sitelinks.map((s: any) => `"${s.title}","${s.description}"`)
  ].join('\\n')

  // Snippets CSV
  const snippetsCSV = [
    'Snippet',
    ...campaign.snippets.map((s: string) => `"${s}"`)
  ].join('\\n')

  // Keywords CSV
  const keywordsCSV = [
    'Keyword',
    ...campaign.keywords.map((k: string) => `"${k}"`)
  ].join('\\n')

  // Campaign Structure CSV
  const campaignStructureCSV = [
    'Campaign Name,Status,Budget Type,Budget',
    `"${campaign.campaignName}","Enabled","Daily","350"`
  ].join('\\n')

  return {
    headlines: headlinesCSV,
    descriptions: descriptionsCSV,
    sitelinks: sitelinksCSV,
    snippets: snippetsCSV,
    keywords: keywordsCSV,
    campaignStructure: campaignStructureCSV
  }
}

/**
 * 📋 GET - INFORMAÇÕES DA API
 */
export async function GET() {
  return NextResponse.json({
    name: 'AI Campaign Builder API',
    version: '1.0.0',
    description: 'Gera campanhas Google Ads usando 100% AI',
    endpoints: {
      'POST /api/v1/ai-campaign-builder': 'Gerar campanha completa'
    },
    requiredFields: [
      'productName',
      'countryCode',
      'platform',
      'commissionValue',
      'commissionCurrency',
      'baseUrl'
    ],
    supportedCountries: [
      'HU (Hungria)',
      'DE (Alemanha)',
      'ES (Espanha)',
      'PL (Polônia)',
      'FR (França)',
      'IT (Itália)'
    ],
    outputFiles: [
      'headlines.csv (15 headlines)',
      'descriptions.csv (4 descriptions)',
      'sitelinks.csv (6 sitelinks)',
      'snippets.csv (2 snippets)',
      'keywords.csv (5 keywords)',
      'campaignStructure.csv (1 campaign)'
    ]
  })
}