import { NextRequest, NextResponse } from 'next/server'
import { ActiveIntelligenceEngine } from '@/lib/intelligence/active-intelligence-engine'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/v1/intelligence/mining',
    methods: ['POST'],
    description: 'Active intelligence mining system - continuous product discovery',
    features: [
      'YouTube Channel Monitoring - Monitor TOP channels + discover new ones',
      'Random Product Testing - Test random products in Ads Transparency', 
      'Advertiser Portfolio Discovery - Find advertisers with extensive portfolios',
      'Exclusivity Detection - Identify exclusive/restricted products in both channels',
      'Hot Product Detection - Find products mentioned frequently',
      'Real-time Opportunity Scoring - Hot + Exclusivity + Competition scoring'
    ],
    miningProcess: {
      youtubeIntelligence: {
        monitorKnownChannels: 'Track products in established affiliate channels',
        discoverNewChannels: 'Continuously find new channels worth monitoring', 
        detectHotProducts: 'Identify products mentioned frequently across channels',
        findExclusiveProducts: 'Spot products promoted by few/exclusive channels'
      },
      adsIntelligence: {
        processYouTubeFindings: 'Analyze YouTube discoveries in Ads Transparency',
        randomProductTesting: 'Test random products to discover new advertisers',
        monitorAdvertisers: 'Track advertisers with large product portfolios',
        detectExclusiveAds: 'Find products with sophisticated/limited targeting'
      }
    },
    exclusivityLevels: {
      public: 'Widely promoted across multiple channels and ads',
      'semi-exclusive': 'Limited promotion but still accessible',
      exclusive: 'Very few promotions, likely restricted access',
      'super-exclusive': 'Extremely limited exposure, high-value opportunity'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    console.log('🎯 Starting active intelligence mining...')

    // Initialize Active Intelligence Engine
    const miningEngine = new ActiveIntelligenceEngine()
    
    // Run complete garimpagem cycle
    const discoveries = await miningEngine.runGarimpagem()
    
    const processingTime = Date.now() - startTime

    // Generate mining statistics
    const stats = {
      channelsMonitored: 12, // Mock - would be real count
      newChannelsFound: 3,
      productsDiscovered: discoveries.length,
      exclusiveFinds: discoveries.filter(d => 
        d.exclusivityLevel === 'exclusive' || d.exclusivityLevel === 'super-exclusive'
      ).length,
      hotProducts: discoveries.filter(d => d.hotScore > 80).length,
      highOpportunity: discoveries.filter(d => d.opportunityScore > 85).length
    }

    console.log('✅ Intelligence mining completed:', {
      discoveries: discoveries.length,
      exclusiveFinds: stats.exclusiveFinds,
      hotProducts: stats.hotProducts,
      processingTime: `${processingTime}ms`
    })

    const response = {
      success: true,
      discoveries,
      stats,
      meta: {
        processingTime,
        timestamp: new Date().toISOString(),
        miningCycle: 'complete',
        nextRecommendedMining: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Intelligence mining error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to run intelligence mining',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}