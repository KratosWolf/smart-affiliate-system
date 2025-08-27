import { NextRequest, NextResponse } from 'next/server'
import { roiMonitor, type CampaignMetrics, type ROIAnalysis } from '@/lib/tracking/roi-monitor'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const campaignId = searchParams.get('campaignId')

  try {
    switch (action) {
      case 'analyze':
        if (!campaignId) {
          return NextResponse.json({
            success: false,
            error: 'Campaign ID required for analysis'
          }, { status: 400 })
        }
        
        const analysis = roiMonitor.analyzeROI(campaignId)
        if (!analysis) {
          return NextResponse.json({
            success: false,
            error: 'No data available for this campaign'
          }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: analysis
        })

      case 'scaling':
        const scalingCampaigns = roiMonitor.getCampaignsForScaling()
        return NextResponse.json({
          success: true,
          data: {
            campaigns: scalingCampaigns,
            count: scalingCampaigns.length,
            timestamp: new Date().toISOString()
          }
        })

      case 'report':
        const report = roiMonitor.generatePerformanceReport()
        return NextResponse.json({
          success: true,
          data: report
        })

      case 'all':
      default:
        const allAnalyses = roiMonitor.analyzeAllCampaigns()
        return NextResponse.json({
          success: true,
          data: {
            campaigns: allAnalyses,
            count: allAnalyses.length,
            timestamp: new Date().toISOString()
          }
        })
    }
  } catch (error) {
    console.error('❌ ROI tracking error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process tracking request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'add_metrics':
        if (!Array.isArray(data)) {
          return NextResponse.json({
            success: false,
            error: 'Metrics data must be an array'
          }, { status: 400 })
        }

        // Validação básica dos dados
        for (const metric of data) {
          if (!metric.campaignId || !metric.date || metric.spend === undefined || metric.revenue === undefined) {
            return NextResponse.json({
              success: false,
              error: 'Invalid metric data. Required fields: campaignId, date, spend, revenue'
            }, { status: 400 })
          }
        }

        roiMonitor.addCampaignMetrics(data)
        
        return NextResponse.json({
          success: true,
          message: `Added ${data.length} metrics to tracking system`,
          timestamp: new Date().toISOString()
        })

      case 'simulate_data':
        // Gerar dados simulados para demonstração
        const simulatedMetrics = generateSimulatedMetrics()
        roiMonitor.addCampaignMetrics(simulatedMetrics)

        return NextResponse.json({
          success: true,
          message: `Generated ${simulatedMetrics.length} simulated metrics`,
          data: {
            campaigns: [...new Set(simulatedMetrics.map(m => m.campaignId))],
            dateRange: {
              start: simulatedMetrics[0].date,
              end: simulatedMetrics[simulatedMetrics.length - 1].date
            }
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: add_metrics, simulate_data'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ ROI tracking POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process tracking data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Gera métricas simuladas para demonstração
 */
function generateSimulatedMetrics(): CampaignMetrics[] {
  const campaigns = [
    { id: 'CMP_LEPTITOX_001', name: 'Leptitox Weight Loss - Health', product: 'leptitox' },
    { id: 'CMP_BIOFIT_002', name: 'BioFit Probiotic - Health', product: 'biofit' },
    { id: 'CMP_AFFILIATE_003', name: 'Make Money Online Course', product: 'affiliate_course' },
    { id: 'CMP_FOREX_004', name: 'Forex Trading System', product: 'forex_system' },
    { id: 'CMP_KETO_005', name: 'Keto Diet Plan', product: 'keto_diet' }
  ]

  const metrics: CampaignMetrics[] = []
  const today = new Date()

  // Gera dados para últimos 5 dias
  for (let dayOffset = 4; dayOffset >= 0; dayOffset--) {
    const date = new Date(today)
    date.setDate(date.getDate() - dayOffset)
    const dateStr = date.toISOString().split('T')[0]

    campaigns.forEach((campaign, campaignIndex) => {
      // ROI varia por campanha para simular diferentes performances
      const baseROI = [85, 45, 120, 25, 70][campaignIndex] // ROIs base diferentes
      const variance = (Math.random() - 0.5) * 20 // ±10% variance
      const dayROI = Math.max(0, baseROI + variance + (dayOffset * 2)) // Trend ligeiramente crescente

      // Calcula métricas baseadas no ROI target
      const spend = 100 + Math.random() * 200 // $100-300 spend
      const revenue = spend * (1 + dayROI / 100)
      const conversions = Math.floor(Math.random() * 10 + 1)
      const clicks = Math.floor(conversions * (10 + Math.random() * 40)) // 10-50 clicks por conversão
      const impressions = Math.floor(clicks * (20 + Math.random() * 80)) // 20-100 impressões por click

      metrics.push({
        campaignId: campaign.id,
        campaignName: campaign.name,
        date: dateStr,
        spend: Math.round(spend * 100) / 100,
        revenue: Math.round(revenue * 100) / 100,
        conversions,
        clicks,
        impressions,
        ctr: Math.round((clicks / impressions) * 10000) / 100, // CTR em %
        cpc: Math.round((spend / clicks) * 100) / 100,
        platform: ['google', 'facebook', 'microsoft'][campaignIndex % 3] as 'google' | 'facebook' | 'microsoft',
        productId: campaign.product,
        presellType: ['cookie', 'quiz', 'review', 'expert', 'cod'][campaignIndex % 5]
      })
    })
  }

  return metrics.sort((a, b) => a.date.localeCompare(b.date))
}