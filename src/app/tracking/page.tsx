'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  Activity,
  Calendar,
  Zap
} from 'lucide-react'

interface ROIAnalysis {
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

interface PerformanceReport {
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
}

export default function ROITrackingPage() {
  const [analyses, setAnalyses] = useState<ROIAnalysis[]>([])
  const [report, setReport] = useState<PerformanceReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const loadData = async () => {
    setLoading(true)
    try {
      // Carrega todas as análises
      const analysesResponse = await fetch('/api/v1/tracking?action=all')
      const analysesData = await analysesResponse.json()

      // Carrega relatório de performance
      const reportResponse = await fetch('/api/v1/tracking?action=report')
      const reportData = await reportResponse.json()

      if (analysesData.success && reportData.success) {
        setAnalyses(analysesData.data.campaigns || [])
        setReport(reportData.data)
        setLastUpdate(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error('Erro ao carregar dados de tracking:', error)
    } finally {
      setLoading(false)
    }
  }

  const simulateData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_data' })
      })

      if (response.ok) {
        await loadData()
      }
    } catch (error) {
      console.error('Erro ao simular dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Auto-refresh a cada 60 segundos
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'scale_up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'scale_down': return <TrendingDown className="w-4 h-4 text-orange-600" />
      case 'pause': return <XCircle className="w-4 h-4 text-red-600" />
      case 'maintain': return <CheckCircle className="w-4 h-4 text-blue-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'scale_up': return 'bg-green-50 text-green-700 border-green-200'
      case 'scale_down': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'pause': return 'bg-red-50 text-red-700 border-red-200'
      case 'maintain': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  const formatPercentage = (value: number) => 
    `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">ROI Tracking</h1>
          </div>
          <p className="text-xl text-gray-600">
            Monitoramento de ROI com janela móvel de 3 dias • Scaling automático &gt; 60%
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={loadData} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button onClick={simulateData} variant="outline" disabled={loading}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Simular Dados
            </Button>
          </div>
          {lastUpdate && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Última atualização: {lastUpdate}
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campanhas</CardTitle>
                <Target className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalCampaigns}</div>
                <p className="text-xs text-muted-foreground">
                  {report.summary.activeCampaigns} ativas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(report.summary.avgROI)}
                </div>
                <p className="text-xs text-muted-foregreen">
                  {report.summary.profitableCount} lucrativas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
                <DollarSign className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(report.summary.totalSpend)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Receita: {formatCurrency(report.summary.totalRevenue)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ações Necessárias</CardTitle>
                <Zap className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {report.recommendations.scaleUp}
                </div>
                <p className="text-xs text-muted-foreground">
                  Scale up • {report.recommendations.pause} pausar
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campanhas ({analyses.length})</TabsTrigger>
            <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
            <TabsTrigger value="scaling">Scaling ({analyses.filter(a => a.scalingRecommendation.action !== 'maintain').length})</TabsTrigger>
          </TabsList>

          {/* Todas as Campanhas */}
          <TabsContent value="campaigns" className="space-y-4">
            {analyses.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Nenhum Dado Disponível
                  </CardTitle>
                  <CardDescription>
                    Clique em "Simular Dados" para gerar métricas de exemplo ou adicione dados reais via API
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.campaignId} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{analysis.campaignId}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getActionColor(analysis.scalingRecommendation.action)}>
                            {getActionIcon(analysis.scalingRecommendation.action)}
                            {analysis.scalingRecommendation.action.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant={analysis.metrics.roi >= 60 ? "default" : analysis.metrics.roi >= 30 ? "secondary" : "destructive"}>
                            ROI: {formatPercentage(analysis.metrics.roi)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Investimento</div>
                          <div className="font-semibold">{formatCurrency(analysis.metrics.totalSpend)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Receita</div>
                          <div className="font-semibold">{formatCurrency(analysis.metrics.totalRevenue)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">ROAS</div>
                          <div className="font-semibold">{analysis.metrics.roas.toFixed(2)}x</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Conversões</div>
                          <div className="font-semibold">{analysis.metrics.totalConversions}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {analysis.trend.direction === 'rising' && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {analysis.trend.direction === 'declining' && <TrendingDown className="w-4 h-4 text-red-600" />}
                          {analysis.trend.direction === 'stable' && <Activity className="w-4 h-4 text-blue-600" />}
                          <span className="text-sm">
                            Tendência: {analysis.trend.direction} ({analysis.trend.strength})
                          </span>
                        </div>

                        {analysis.scalingRecommendation.budgetChange !== 0 && (
                          <Badge variant="outline" className="text-xs">
                            Orçamento: {analysis.scalingRecommendation.budgetChange > 0 ? '+' : ''}{analysis.scalingRecommendation.budgetChange}%
                          </Badge>
                        )}
                      </div>

                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <div className="font-medium mb-1">Recomendação (Confiança: {analysis.scalingRecommendation.confidence}%)</div>
                        <div className="text-gray-600">{analysis.scalingRecommendation.reason}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Top Performers */}
          <TabsContent value="top-performers" className="space-y-4">
            {report?.topPerformers.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    Nenhum top performer encontrado
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {report?.topPerformers.map((analysis, index) => (
                  <Card key={analysis.campaignId} className="border-green-200 bg-green-50">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-600">#{index + 1}</Badge>
                        <CardTitle className="text-lg">{analysis.campaignId}</CardTitle>
                        <Badge variant="default">ROI: {formatPercentage(analysis.metrics.roi)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Receita</div>
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(analysis.metrics.totalRevenue)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Margem</div>
                          <div className="text-xl font-bold">
                            {formatPercentage(analysis.metrics.profitMargin)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Predição 24h</div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatPercentage(analysis.trend.predictedROI24h)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Campanhas para Scaling */}
          <TabsContent value="scaling" className="space-y-4">
            {analyses.filter(a => a.scalingRecommendation.action !== 'maintain').map((analysis) => (
              <Card key={analysis.campaignId} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getActionIcon(analysis.scalingRecommendation.action)}
                      {analysis.campaignId}
                    </CardTitle>
                    <Badge className={analysis.scalingRecommendation.action === 'scale_up' ? 'bg-green-600' : 
                                    analysis.scalingRecommendation.action === 'pause' ? 'bg-red-600' : 'bg-orange-600'}>
                      {analysis.scalingRecommendation.action.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>ROI Atual:</span>
                      <span className="font-bold">{formatPercentage(analysis.metrics.roi)}</span>
                    </div>
                    
                    {analysis.scalingRecommendation.budgetChange !== 0 && (
                      <div className="flex items-center justify-between">
                        <span>Ajuste de Orçamento:</span>
                        <span className="font-bold text-blue-600">
                          {analysis.scalingRecommendation.budgetChange > 0 ? '+' : ''}{analysis.scalingRecommendation.budgetChange}%
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span>Confiança:</span>
                      <span className="font-bold">{analysis.scalingRecommendation.confidence}%</span>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <div className="text-sm font-medium mb-1">Razão:</div>
                      <div className="text-sm text-gray-600">{analysis.scalingRecommendation.reason}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}