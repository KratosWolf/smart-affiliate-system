/**
 * ROI TRACKING SISTEMA ROLLING 3 DIAS
 * 
 * Sistema de monitoramento de ROI com janela móvel de 3 dias
 * - Trigger automático para scaling quando ROI > 60%
 * - Integração com Google Ads API para ajustes de orçamento
 * - Analytics em tempo real
 * 
 * Implementação: 27/08/2024
 */

export interface CampaignMetrics {
  campaignId: string
  campaignName: string
  date: string
  spend: number
  revenue: number
  conversions: number
  clicks: number
  impressions: number
  ctr: number
  cpc: number
  platform: 'google' | 'facebook' | 'microsoft'
  productId?: string
  presellType?: string
}

export interface ROIAnalysis {
  campaignId: string
  period: {
    start: string
    end: string
  }
  metrics: {
    totalSpend: number
    totalRevenue: number
    totalConversions: number
    roi: number
    roas: number
    profitMargin: number
  }
  trend: {
    direction: 'rising' | 'stable' | 'declining'
    strength: 'weak' | 'moderate' | 'strong'
    predictedROI24h: number
  }
  scalingRecommendation: {
    action: 'scale_up' | 'scale_down' | 'pause' | 'maintain'
    budgetChange: number
    confidence: number
    reason: string
  }
}

export class ROIMonitor {
  private metrics: Map<string, CampaignMetrics[]> = new Map()
  private scalingThresholds = {
    roi: {
      scaleUp: 60,      // ROI > 60% = scale up
      maintain: 30,     // ROI 30-60% = maintain
      scaleDown: 10,    // ROI 10-30% = scale down
      pause: 0          // ROI < 10% = pause
    },
    confidence: {
      minimum: 70,      // Mínimo 70% confiança para ação
      high: 85          // 85%+ = ação agressiva
    }
  }

  /**
   * Adiciona métricas de campanha para tracking
   */
  addCampaignMetrics(metrics: CampaignMetrics[]): void {
    metrics.forEach(metric => {
      if (!this.metrics.has(metric.campaignId)) {
        this.metrics.set(metric.campaignId, [])
      }
      
      const campaignMetrics = this.metrics.get(metric.campaignId)!
      
      // Remove dados antigos (> 7 dias para histórico)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const filteredMetrics = campaignMetrics.filter(m => 
        new Date(m.date) > sevenDaysAgo
      )
      
      // Adiciona nova métrica
      filteredMetrics.push(metric)
      
      // Ordena por data
      filteredMetrics.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      this.metrics.set(metric.campaignId, filteredMetrics)
    })
  }

  /**
   * Analisa ROI rolling de 3 dias para uma campanha
   */
  analyzeROI(campaignId: string): ROIAnalysis | null {
    const metrics = this.metrics.get(campaignId)
    if (!metrics || metrics.length === 0) return null

    // Pega últimos 3 dias
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    
    const recentMetrics = metrics.filter(m => 
      new Date(m.date) >= threeDaysAgo
    )

    if (recentMetrics.length === 0) return null

    // Calcula métricas agregadas
    const totalSpend = recentMetrics.reduce((sum, m) => sum + m.spend, 0)
    const totalRevenue = recentMetrics.reduce((sum, m) => sum + m.revenue, 0)
    const totalConversions = recentMetrics.reduce((sum, m) => sum + m.conversions, 0)
    
    const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalSpend) / totalRevenue) * 100 : 0

    // Análise de tendência
    const trend = this.analyzeTrend(recentMetrics)
    
    // Predição ROI 24h
    const predictedROI24h = this.predictROI24h(recentMetrics, trend)

    // Recomendação de scaling
    const scalingRecommendation = this.generateScalingRecommendation(roi, trend, recentMetrics.length)

    return {
      campaignId,
      period: {
        start: recentMetrics[0].date,
        end: recentMetrics[recentMetrics.length - 1].date
      },
      metrics: {
        totalSpend,
        totalRevenue,
        totalConversions,
        roi,
        roas,
        profitMargin
      },
      trend,
      scalingRecommendation
    }
  }

  /**
   * Analisa tendência dos dados
   */
  private analyzeTrend(metrics: CampaignMetrics[]): ROIAnalysis['trend'] {
    if (metrics.length < 2) {
      return {
        direction: 'stable',
        strength: 'weak',
        predictedROI24h: 0
      }
    }

    // Calcula ROI diário
    const dailyROIs: number[] = []
    
    for (let i = 0; i < metrics.length; i++) {
      const metric = metrics[i]
      const roi = metric.spend > 0 ? ((metric.revenue - metric.spend) / metric.spend) * 100 : 0
      dailyROIs.push(roi)
    }

    // Análise de tendência (regressão linear simples)
    const n = dailyROIs.length
    const xSum = (n * (n - 1)) / 2 // 0 + 1 + 2 + ... + (n-1)
    const ySum = dailyROIs.reduce((sum, roi) => sum + roi, 0)
    const xySum = dailyROIs.reduce((sum, roi, i) => sum + (roi * i), 0)
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6 // 0² + 1² + 2² + ... + (n-1)²

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum)

    // Determina direção e força
    let direction: 'rising' | 'stable' | 'declining'
    let strength: 'weak' | 'moderate' | 'strong'

    if (Math.abs(slope) < 1) {
      direction = 'stable'
      strength = 'weak'
    } else if (slope > 0) {
      direction = 'rising'
      strength = slope > 3 ? 'strong' : 'moderate'
    } else {
      direction = 'declining'
      strength = slope < -3 ? 'strong' : 'moderate'
    }

    // Predição simples baseada na tendência
    const lastROI = dailyROIs[dailyROIs.length - 1]
    const predictedROI24h = lastROI + slope

    return {
      direction,
      strength,
      predictedROI24h
    }
  }

  /**
   * Predição de ROI para próximas 24h
   */
  private predictROI24h(metrics: CampaignMetrics[], trend: ROIAnalysis['trend']): number {
    if (metrics.length === 0) return 0

    const lastMetric = metrics[metrics.length - 1]
    const currentROI = lastMetric.spend > 0 
      ? ((lastMetric.revenue - lastMetric.spend) / lastMetric.spend) * 100 
      : 0

    // Ajusta predição baseada na tendência
    let adjustment = 0
    
    switch (trend.direction) {
      case 'rising':
        adjustment = trend.strength === 'strong' ? 5 : trend.strength === 'moderate' ? 2 : 1
        break
      case 'declining':
        adjustment = trend.strength === 'strong' ? -5 : trend.strength === 'moderate' ? -2 : -1
        break
      case 'stable':
        adjustment = 0
        break
    }

    return Math.max(0, currentROI + adjustment)
  }

  /**
   * Gera recomendação de scaling
   */
  private generateScalingRecommendation(
    roi: number, 
    trend: ROIAnalysis['trend'], 
    dataPoints: number
  ): ROIAnalysis['scalingRecommendation'] {
    
    // Calcula confiança baseada em pontos de dados e tendência
    const confidence = Math.min(95, (dataPoints / 3) * 70 + 
      (trend.strength === 'strong' ? 15 : trend.strength === 'moderate' ? 10 : 5))

    let action: ROIAnalysis['scalingRecommendation']['action']
    let budgetChange = 0
    let reason = ''

    if (confidence < this.scalingThresholds.confidence.minimum) {
      action = 'maintain'
      reason = `Confiança muito baixa (${confidence.toFixed(0)}%) - necessário mais dados`
    } else if (roi >= this.scalingThresholds.roi.scaleUp && trend.direction !== 'declining') {
      action = 'scale_up'
      
      // Calcula aumento de orçamento baseado em ROI e confiança
      const baseIncrease = Math.min(50, Math.max(10, (roi - this.scalingThresholds.roi.scaleUp) * 2))
      const confidenceMultiplier = confidence >= this.scalingThresholds.confidence.high ? 1.5 : 1
      const trendMultiplier = trend.direction === 'rising' ? 1.2 : 1
      
      budgetChange = Math.round(baseIncrease * confidenceMultiplier * trendMultiplier)
      
      reason = `ROI ${roi.toFixed(1)}% > threshold ${this.scalingThresholds.roi.scaleUp}% | Trend: ${trend.direction} (${trend.strength})`
      
    } else if (roi <= this.scalingThresholds.roi.pause) {
      action = 'pause'
      reason = `ROI muito baixo (${roi.toFixed(1)}%) - pausar para análise`
      
    } else if (roi <= this.scalingThresholds.roi.scaleDown) {
      action = 'scale_down'
      budgetChange = -Math.min(30, Math.max(10, (this.scalingThresholds.roi.maintain - roi) * 2))
      reason = `ROI baixo (${roi.toFixed(1)}%) - reduzir orçamento`
      
    } else {
      action = 'maintain'
      reason = `ROI estável (${roi.toFixed(1)}%) - manter estratégia atual`
    }

    return {
      action,
      budgetChange,
      confidence: Math.round(confidence),
      reason
    }
  }

  /**
   * Analisa todas as campanhas ativas
   */
  analyzeAllCampaigns(): ROIAnalysis[] {
    const analyses: ROIAnalysis[] = []
    
    for (const campaignId of this.metrics.keys()) {
      const analysis = this.analyzeROI(campaignId)
      if (analysis) {
        analyses.push(analysis)
      }
    }

    // Ordena por ROI descendente
    return analyses.sort((a, b) => b.metrics.roi - a.metrics.roi)
  }

  /**
   * Filtra campanhas que precisam de scaling
   */
  getCampaignsForScaling(): ROIAnalysis[] {
    return this.analyzeAllCampaigns().filter(analysis => 
      analysis.scalingRecommendation.action === 'scale_up' ||
      analysis.scalingRecommendation.action === 'scale_down' ||
      analysis.scalingRecommendation.action === 'pause'
    )
  }

  /**
   * Gera relatório de performance
   */
  generatePerformanceReport(): {
    summary: {
      totalCampaigns: number
      activeCampaigns: number
      avgROI: number
      totalSpend: number
      totalRevenue: number
      profitableCount: number
    }
    recommendations: {
      scaleUp: number
      scaleDown: number
      pause: number
      maintain: number
    }
    topPerformers: ROIAnalysis[]
    underperformers: ROIAnalysis[]
  } {
    const analyses = this.analyzeAllCampaigns()
    
    // Métricas summary
    const totalCampaigns = analyses.length
    const activeCampaigns = analyses.filter(a => a.scalingRecommendation.action !== 'pause').length
    const avgROI = analyses.length > 0 
      ? analyses.reduce((sum, a) => sum + a.metrics.roi, 0) / analyses.length 
      : 0
    const totalSpend = analyses.reduce((sum, a) => sum + a.metrics.totalSpend, 0)
    const totalRevenue = analyses.reduce((sum, a) => sum + a.metrics.totalRevenue, 0)
    const profitableCount = analyses.filter(a => a.metrics.roi > 0).length

    // Contadores de recomendações
    const recommendations = {
      scaleUp: analyses.filter(a => a.scalingRecommendation.action === 'scale_up').length,
      scaleDown: analyses.filter(a => a.scalingRecommendation.action === 'scale_down').length,
      pause: analyses.filter(a => a.scalingRecommendation.action === 'pause').length,
      maintain: analyses.filter(a => a.scalingRecommendation.action === 'maintain').length
    }

    // Top performers (ROI > 50% e tendência positiva)
    const topPerformers = analyses
      .filter(a => a.metrics.roi >= 50 && a.trend.direction !== 'declining')
      .slice(0, 5)

    // Underperformers (ROI < 20% ou tendência negativa forte)
    const underperformers = analyses
      .filter(a => a.metrics.roi < 20 || (a.trend.direction === 'declining' && a.trend.strength === 'strong'))
      .slice(0, 5)

    return {
      summary: {
        totalCampaigns,
        activeCampaigns,
        avgROI,
        totalSpend,
        totalRevenue,
        profitableCount
      },
      recommendations,
      topPerformers,
      underperformers
    }
  }
}

// Instância global do monitor
export const roiMonitor = new ROIMonitor()

// Helper para formatação de números
export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value)
}

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}