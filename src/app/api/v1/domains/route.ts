import { NextRequest, NextResponse } from 'next/server'
import { domainGenerator, type DomainConfig, type GeneratedDomain } from '@/lib/scaling/domain-generator'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/v1/domains',
    methods: ['POST'],
    description: 'Sistema de geração de domínios para scaling horizontal de campanhas',
    features: [
      'Geração de múltiplos domínios únicos por campanha',
      'Prevenção de competição interna no Google Ads',
      'Templates personalizados por nicho (health, business, tech, lifestyle)',
      'Keywords e SEO automáticos',
      'Estimativas de custo e disponibilidade',
      'Relatórios de scaling horizontal'
    ],
    endpoints: {
      'POST /generate': 'Gera domínios para uma configuração específica',
      'POST /scaling': 'Gera campanhas para scaling horizontal',
      'POST /check': 'Verifica disponibilidade de domínios',
      'POST /report': 'Gera relatório de scaling'
    },
    examples: {
      generate: {
        baseProduct: 'Leptitox',
        niche: 'health_fitness',
        country: 'US',
        language: 'en',
        template: 'review',
        count: 5
      },
      scaling: {
        product: 'Leptitox',
        niche: 'weight_loss',
        countries: ['US', 'CA', 'GB', 'AU'],
        templates: ['cookie', 'quiz', 'review', 'expert']
      }
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    switch (action) {
      case 'generate':
        return await handleGenerate(params)
      
      case 'scaling':
        return await handleScaling(params)
      
      case 'check':
        return await handleCheck(params)
      
      case 'report':
        return await handleReport(params)
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported: generate, scaling, check, report'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Domain generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process domain request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function handleGenerate(params: DomainConfig & { count?: number }) {
  const { baseProduct, niche, country, language, template, count = 5 } = params

  // Validação
  if (!baseProduct || !niche || !country || !language || !template) {
    return NextResponse.json({
      success: false,
      error: 'Missing required fields: baseProduct, niche, country, language, template'
    }, { status: 400 })
  }

  console.log('🌐 Generating domains:', {
    product: baseProduct,
    niche: niche,
    country: country,
    count: count
  })

  const domains = domainGenerator.generateDomains({
    baseProduct,
    niche,
    country,
    language,
    template
  }, count)

  return NextResponse.json({
    success: true,
    data: {
      domains,
      count: domains.length,
      config: {
        baseProduct,
        niche,
        country,
        language,
        template
      },
      timestamp: new Date().toISOString()
    }
  })
}

async function handleScaling(params: {
  product: string
  niche: string
  countries: string[]
  templates: Array<DomainConfig['template']>
}) {
  const { product, niche, countries, templates } = params

  if (!product || !niche || !countries || !templates) {
    return NextResponse.json({
      success: false,
      error: 'Missing required fields: product, niche, countries, templates'
    }, { status: 400 })
  }

  console.log('🚀 Generating scaling campaigns:', {
    product,
    niche,
    countries: countries.length,
    templates: templates.length
  })

  const campaigns = domainGenerator.generateScalingCampaigns(
    product,
    niche,
    countries,
    templates
  )

  const report = domainGenerator.generateScalingReport(campaigns)

  return NextResponse.json({
    success: true,
    data: {
      campaigns,
      report,
      summary: {
        totalCampaigns: campaigns.length,
        countries: countries.length,
        templates: templates.length,
        estimatedReach: report.summary.estimatedReach,
        estimatedCost: report.costEstimate.total
      },
      timestamp: new Date().toISOString()
    }
  })
}

async function handleCheck(params: { domains: string[] }) {
  const { domains } = params

  if (!domains || !Array.isArray(domains)) {
    return NextResponse.json({
      success: false,
      error: 'Domains array is required'
    }, { status: 400 })
  }

  console.log('🔍 Checking domain availability:', domains.length + ' domains')

  const results = await Promise.all(
    domains.map(async (domain) => ({
      domain,
      ...(await domainGenerator.checkDomainAvailability(domain))
    }))
  )

  const available = results.filter(r => r.available)
  const unavailable = results.filter(r => !r.available)

  return NextResponse.json({
    success: true,
    data: {
      results,
      summary: {
        total: domains.length,
        available: available.length,
        unavailable: unavailable.length,
        availabilityRate: Math.round((available.length / domains.length) * 100),
        totalEstimatedCost: available.reduce((sum, r) => sum + (r.estimatedCost || 0), 0)
      },
      timestamp: new Date().toISOString()
    }
  })
}

async function handleReport(params: { domains: GeneratedDomain[] }) {
  const { domains } = params

  if (!domains || !Array.isArray(domains)) {
    return NextResponse.json({
      success: false,
      error: 'Domains array is required'
    }, { status: 400 })
  }

  console.log('📊 Generating scaling report for', domains.length, 'domains')

  const report = domainGenerator.generateScalingReport(domains)

  return NextResponse.json({
    success: true,
    data: {
      report,
      insights: {
        topTemplate: Object.entries(report.summary.byTemplate)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none',
        topCountry: Object.entries(report.summary.byCountry)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none',
        averageCostPerDomain: Math.round(report.costEstimate.total / domains.length),
        recommendedPhase1: report.recommendations.priority.length,
        roiProjection: Math.round(report.summary.estimatedReach * 0.02 * 50) // 2% conv * $50 AOV
      },
      timestamp: new Date().toISOString()
    }
  })
}