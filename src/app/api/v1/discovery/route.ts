import { NextRequest, NextResponse } from 'next/server'
import { ProductDiscoveryEngine, defaultDiscoveryConfig, type DiscoveryConfig } from '@/lib/discovery/product-discovery'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/v1/discovery',
    methods: ['POST'],
    description: 'Automated product discovery from international affiliate platforms',
    supportedPlatforms: [
      'ClickBank - Global marketplace with gravity metrics',
      'SmartAdv - International affiliate network',
      'Dr Cash - European affiliate platform',
      'WarriorPlus - Digital marketing products',
      'JVZoo - Software and digital products',
      'DigiStore24 - European marketplace'
    ],
    discoveryMethods: [
      'YouTube Trending - Products mentioned in viral videos',
      'Google Trends - Rising search terms matched to products',
      'Platform Trending - Hot products from affiliate marketplaces',
      'Competitor Analysis - Products from competitor ads'
    ],
    parameters: {
      platforms: 'array - Platforms to search (clickbank, smartadv, drcash, etc.)',
      paymentModel: 'string - Payment preference: cpa, commission, both',
      searchMode: 'string - Search type: general, filtered',
      categories: 'array - Product categories (optional for general search)',
      minCommission: 'number - Minimum commission percentage (optional)',
      minCPA: 'number - Minimum CPA value (optional)',
      countries: 'array - Target countries for products',
      languages: 'array - Languages for product search'
    },
    example: {
      platforms: ['clickbank', 'smartadv', 'drcash'],
      paymentModel: 'both',
      searchMode: 'general',
      countries: ['US', 'CA', 'GB'],
      languages: ['en', 'pt']
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Parse request body
    let discoveryConfig: DiscoveryConfig
    
    try {
      const body = await request.json()
      
      // Merge with default config
      discoveryConfig = {
        ...defaultDiscoveryConfig,
        ...body
      }
      
      // Validate required parameters
      if (!Array.isArray(discoveryConfig.platforms) || discoveryConfig.platforms.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Platforms array is required and must not be empty',
          availablePlatforms: ['clickbank', 'smartadv', 'drcash', 'warriorplus', 'jvzoo', 'digistore24']
        }, { status: 400 })
      }
      
    } catch (parseError) {
      // If no body provided, use default config
      discoveryConfig = defaultDiscoveryConfig
    }

    console.log('🔍 Starting product discovery with config:', {
      platforms: discoveryConfig.platforms,
      paymentModel: discoveryConfig.paymentModel,
      searchMode: discoveryConfig.searchMode,
      categories: discoveryConfig.categories,
      countries: discoveryConfig.countries
    })

    // Initialize discovery engine
    const discoveryEngine = new ProductDiscoveryEngine(discoveryConfig)
    
    // Run product discovery
    const opportunities = await discoveryEngine.discoverProducts()
    
    const processingTime = Date.now() - startTime
    
    // Filter top opportunities (limit to 50 for performance)
    const topOpportunities = opportunities
      .slice(0, 50)
      .map(opportunity => ({
        ...opportunity,
        // Add additional metadata
        metadata: {
          discoveredAt: opportunity.discoveredAt,
          opportunityRank: opportunities.indexOf(opportunity) + 1,
          totalOpportunities: opportunities.length
        }
      }))

    // Generate summary statistics
    const summary = {
      totalFound: opportunities.length,
      returned: topOpportunities.length,
      platforms: {
        clickbank: opportunities.filter(o => o.platform === 'CLICKBANK').length,
        smartadv: opportunities.filter(o => o.platform === 'SMARTADV').length,
        drcash: opportunities.filter(o => o.platform === 'DRCASH').length,
        buygoods: opportunities.filter(o => o.platform === 'BUYGOODS').length,
        other: opportunities.filter(o => o.platform === 'OTHER').length
      },
      sources: {
        youtube: opportunities.filter(o => o.discoverySource === 'youtube').length,
        trends: opportunities.filter(o => o.discoverySource === 'google-trends').length,
        platforms: opportunities.filter(o => o.discoverySource === 'platform-trending').length,
        competitors: opportunities.filter(o => o.discoverySource === 'competitor-analysis').length
      },
      averageScore: opportunities.length > 0 
        ? Math.round(opportunities.reduce((sum, o) => sum + o.opportunityScore, 0) / opportunities.length)
        : 0,
      topCategories: getTopCategories(opportunities),
      processingTime
    }

    console.log('✅ Product discovery completed:', {
      totalFound: summary.totalFound,
      avgScore: summary.averageScore,
      processingTime: `${processingTime}ms`
    })

    const response = {
      success: true,
      data: {
        opportunities: topOpportunities,
        summary,
        config: {
          platforms: discoveryConfig.platforms,
          paymentModel: discoveryConfig.paymentModel,
          searchMode: discoveryConfig.searchMode,
          categories: discoveryConfig.categories,
          countries: discoveryConfig.countries
        },
        recommendations: generateRecommendations(topOpportunities)
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Product discovery error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to discover products',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * Helper function to get top categories from opportunities
 */
function getTopCategories(opportunities: any[]) {
  const categoryCount: Record<string, number> = {}
  
  opportunities.forEach(opportunity => {
    categoryCount[opportunity.category] = (categoryCount[opportunity.category] || 0) + 1
  })
  
  return Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }))
}

/**
 * Generate actionable recommendations based on discovered opportunities
 */
function generateRecommendations(opportunities: any[]) {
  const recommendations = []
  
  if (opportunities.length === 0) {
    return [{
      type: 'no_results',
      title: 'No Products Found',
      description: 'Try expanding your search criteria or checking different platforms',
      action: 'Modify discovery parameters'
    }]
  }
  
  // Top opportunity recommendation
  const topOpportunity = opportunities[0]
  if (topOpportunity && topOpportunity.opportunityScore >= 70) {
    const paymentInfo = topOpportunity.paymentType === 'cpa' 
      ? `CPA: $${topOpportunity.cpaValue}`
      : topOpportunity.paymentType === 'hybrid'
        ? `CPA: $${topOpportunity.cpaValue} + ${topOpportunity.commission}%`
        : `Commission: ${topOpportunity.commission}%`
    
    recommendations.push({
      type: 'high_opportunity',
      title: `High-Value Opportunity: ${topOpportunity.productName}`,
      description: `Score: ${topOpportunity.opportunityScore}/100, ${paymentInfo}`,
      action: 'Validate this product immediately',
      productId: topOpportunity.id
    })
  }
  
  // Platform recommendations
  const platformCounts = opportunities.reduce((acc: Record<string, number>, opp) => {
    acc[opp.platform] = (acc[opp.platform] || 0) + 1
    return acc
  }, {})
  
  const topPlatform = Object.entries(platformCounts)
    .sort(([,a], [,b]) => b - a)[0]
  
  if (topPlatform) {
    recommendations.push({
      type: 'platform_focus',
      title: `Focus on ${topPlatform[0].toUpperCase()}`,
      description: `${topPlatform[1]} opportunities found on this platform`,
      action: `Explore more ${topPlatform[0]} products`
    })
  }
  
  // Trending recommendations
  const trendingCount = opportunities.filter(o => o.trending).length
  if (trendingCount > 0) {
    recommendations.push({
      type: 'trending',
      title: `${trendingCount} Trending Products Found`,
      description: 'These products are showing high interest and activity',
      action: 'Prioritize trending products for faster results'
    })
  }
  
  return recommendations
}