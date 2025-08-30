import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔍 Test mining endpoint called')
  
  // Simple mock data
  const mockDiscoveries = [
    {
      id: 'test_1',
      productName: 'Glucosense',
      platform: 'SmartAdv',
      discoverySource: 'youtube-monitoring',
      exclusivityLevel: 'exclusive',
      opportunityScore: 85,
      hotScore: 40,
      exclusivityScore: 30,
      youtubeData: { averageViews: 50000, promotingChannels: [{ length: 2 }] },
      recommendations: [{ priority: 'immediate', action: 'Test campaign' }]
    },
    {
      id: 'test_2', 
      productName: 'NerveCalm',
      platform: 'ClickBank',
      discoverySource: 'ads-discovery',
      exclusivityLevel: 'semi-exclusive',
      opportunityScore: 72,
      hotScore: 35,
      exclusivityScore: 25,
      youtubeData: { averageViews: 35000, promotingChannels: [{ length: 1 }] },
      recommendations: [{ priority: 'monitor', action: 'Watch trends' }]
    }
  ]
  
  return NextResponse.json({
    success: true,
    data: {
      totalProducts: mockDiscoveries.length,
      discoveries: mockDiscoveries,
      summary: {
        immediate: 1,
        exclusive: 1,
        hot: 2
      }
    }
  })
}