import { NextRequest, NextResponse } from 'next/server'
import { GoogleSearchValidator } from '@/lib/validation/google-search-validator'

export async function POST(request: NextRequest) {
  try {
    const { productName, country, commissionValue, commissionType } = await request.json()
    
    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }
    
    console.log(`🔍 Validating product "${productName}" for country "${country}"`)
    
    const validator = new GoogleSearchValidator()
    const result = await validator.validateProduct(productName)
    
    // Calculate CPA targets based on commission
    const commission = parseFloat(commissionValue) || 0
    const targetCPA = commission * 0.45 // 45% of commission
    const maxCPA = commission * 0.8 // 80% of commission
    const stopLoss = commission // Stop if spent equals commission without sale
    const testBudget = Math.max(350, commission * 5) // R$350 minimum or 5x commission
    
    // Calculate ROI potential based on estimated CPC
    const estimatedCPC = result.searchData.competitionIndicators?.estimatedCPC || '$1.00-$2.00'
    const cpcMin = parseFloat(estimatedCPC.replace(/[^0-9.-]/g, '').split('-')[0]) || 1
    const cpcMax = parseFloat(estimatedCPC.replace(/[^0-9.-]/g, '').split('-')[1]) || 2
    const roiPotentialMin = commission > 0 ? ((commission - cpcMax) / cpcMax * 100).toFixed(0) : '0'
    const roiPotentialMax = commission > 0 ? ((commission - cpcMin) / cpcMin * 100).toFixed(0) : '0'
    
    console.log(`✅ Validation completed:`, {
      score: result.score,
      viable: result.viable,
      totalResults: result.searchData.totalResults,
      competitionLevel: result.searchData.competitionIndicators?.competitionLevel,
      commission,
      targetCPA,
      roiPotential: `${roiPotentialMin}%-${roiPotentialMax}%`
    })
    
    return NextResponse.json({
      success: true,
      data: {
        productName,
        country,
        score: result.score,
        viable: result.viable,
        totalResults: result.searchData.totalResults,
        specificResults: result.searchData.specificResults,
        processingTime: Math.round(result.searchData.searchTime * 1000),
        reasoning: result.reasoning,
        apiStatus: 'REAL_API',
        competitionData: result.searchData.competitionIndicators,
        competitorIntelligence: result.searchData.competitorIntelligence,
        // Commission and CPA calculations
        commissionValue: commission,
        commissionType: commissionType || 'CPA',
        cpaTargets: {
          target: targetCPA,
          max: maxCPA,
          stopLoss,
          testBudgetBRL: testBudget,
          testBudgetUSD: testBudget / 5 // Approximate conversion
        },
        roiPotential: {
          min: parseInt(roiPotentialMin.toString()),
          max: parseInt(roiPotentialMax.toString()),
          display: `${roiPotentialMin}%-${roiPotentialMax}%`
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Validation failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}