import { NextRequest, NextResponse } from 'next/server'
import { ProductIntelligenceEngine } from '@/lib/intelligence/product-intelligence-engine'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/v1/intelligence',
    methods: ['POST'],
    description: 'Complete product intelligence analysis combining YouTube, Google Ads, and competition data',
    features: [
      'YouTube Channel Intelligence - Find channels promoting products',
      'Google Ads Transparency - Analyze competitor ad strategies',
      'Competition Scoring - High search volume + low ads = GOLD opportunity',
      'Ad Copy Analysis - Extract winning phrases and strategies',
      'Exclusivity Detection - Find restricted/exclusive products',
      'Action Recommendations - Prioritized next steps with ROI estimates'
    ],
    intelligenceScore: {
      description: 'Composite score (0-100) based on opportunity rating, YouTube validation, exclusivity, and payment model',
      factors: {
        opportunityRating: 'Gold=40pts, Silver=30pts, Bronze=20pts, Saturated=5pts',
        youtubeValidation: 'Multiple channels promoting = higher validation',
        exclusivityBonus: 'Exclusive=20pts, Restricted=15pts, Open=10pts',
        paymentModel: 'High CPA or commission = higher points'
      }
    },
    example: {
      productName: 'Leptitox'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    const body = await request.json()
    const { productName } = body
    
    if (!productName) {
      return NextResponse.json({
        success: false,
        error: 'Product name is required',
        example: { productName: 'Leptitox' }
      }, { status: 400 })
    }

    console.log(`🔍 Starting intelligence analysis for: ${productName}`)

    // Initialize Intelligence Engine
    const intelligenceEngine = new ProductIntelligenceEngine()
    
    // Run complete analysis
    const intelligence = await intelligenceEngine.analyzeProduct(productName)
    
    const processingTime = Date.now() - startTime

    console.log(`✅ Intelligence analysis completed:`, {
      product: productName,
      score: intelligence.intelligenceScore,
      opportunity: intelligence.competitionAnalysis.opportunityRating,
      processingTime: `${processingTime}ms`
    })

    const response = {
      success: true,
      intelligence,
      meta: {
        processingTime,
        timestamp: new Date().toISOString(),
        analysisType: 'complete-intelligence',
        dataSource: 'combined'
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Intelligence analysis error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze product intelligence',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}