import { NextRequest, NextResponse } from 'next/server'
import { ActiveIntelligenceEngine } from '@/lib/intelligence/active-intelligence-engine'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting REAL API mining operation...')
    
    const engine = new ActiveIntelligenceEngine()
    const discoveries = await engine.runGarimpagem()
    
    console.log(`✅ Mining completed: ${discoveries.length} products discovered with REAL APIs`)
    
    return NextResponse.json({
      success: true,
      data: {
        totalProducts: discoveries.length,
        discoveries: discoveries.slice(0, 20), // Return top 20
        summary: {
          immediate: discoveries.filter(d => d.recommendations.some(r => r.priority === 'immediate')).length,
          exclusive: discoveries.filter(d => d.exclusivityLevel === 'exclusive' || d.exclusivityLevel === 'super-exclusive').length,
          hot: discoveries.filter(d => d.hotScore >= 30).length
        },
        apiStatus: 'REAL_APIS_ACTIVE',
        sources: {
          youtube: discoveries.filter(d => d.discoverySource === 'youtube-monitoring' || d.discoverySource === 'both').length,
          ads: discoveries.filter(d => d.discoverySource === 'ads-discovery' || d.discoverySource === 'both').length,
          both: discoveries.filter(d => d.discoverySource === 'both').length
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Real API mining error:', error)
    return NextResponse.json({
      success: false,
      error: 'Real API mining operation failed',
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}