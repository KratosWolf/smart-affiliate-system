'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BackToDashboard from '@/components/BackToDashboard'
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
        <BackToDashboard />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">📈 ROI Tracking & Scaling</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Monitoramento baseado nos critérios PLAYBOOK • CPA 40-45% • ROI mínimo 150%
          </p>
          
          {/* PLAYBOOK Criteria Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">CPA Target</h4>
                <p className="text-sm text-gray-600">40-45% da comissão<br/>Máx: 80%</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">ROI Mínimo</h4>
                <p className="text-sm text-gray-600">150% para prosseguir<br/>Scaling &gt; 60%</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Budget Teste</h4>
                <p className="text-sm text-gray-600">R$350 mínimo<br/>ou 5x comissão</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🛑</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Stop Loss</h4>
                <p className="text-sm text-gray-600">100% da comissão<br/>Pause automático</p>
              </div>
            </div>
          </div>
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

        {/* PLAYBOOK Criteria Details */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Critérios de Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">📊 Intelligence Sources</h4>
              <ul className="text-sm space-y-1">
                <li>📺 <strong>YouTube Channels:</strong> @butecohits4948, @LizyRomance</li>
                <li>📺 <strong>Canais Premium:</strong> @val_le, @legitdiv</li>
                <li>🏆 <strong>Wrestling:</strong> @wrestlingfullhd, @wrestlingbest1</li>
                <li>🔄 <strong>Rookie Subs:</strong> @RookieSubs (novatos)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">🎆 Produtos Exclusivos</h4>
              <ul className="text-sm space-y-1">
                <li>💊 <strong>Glucosense:</strong> 45% comm. (95% pop.)</li>
                <li>🧠 <strong>NerveCalm:</strong> 40% comm. (88% pop.)</li>
                <li>🩺 <strong>GlicoShield:</strong> 50% comm. (92% pop.)</li>
                <li>💧 <strong>GutDrops:</strong> 35% comm. (85% pop.)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">🌍 Multi-Geo Strategy</h4>
              <ul className="text-sm space-y-1">
                <li>🇺🇸 US, 🇫🇷 FR, 🇩🇪 DE, 🇬🇧 GB</li>
                <li>🇨🇦 CA, 🇩🇰 DK, 🇸🇪 SE</li>
                <li>🇵🇱 PL, 🇷🇴 RO (9 países)</li>
                <li>🔍 <strong>Gap Detection:</strong> 60+ dias ausente</li>
              </ul>
            </div>
          </div>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Campanhas ({analyses.length})</TabsTrigger>
            <TabsTrigger value="scoring">Scoring System</TabsTrigger>
            <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
            <TabsTrigger value="scaling">Scaling ({analyses.filter(a => a.scalingRecommendation.action !== 'maintain').length})</TabsTrigger>
          </TabsList>

          {/* Scoring System */}
          <TabsContent value="scoring" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📊 Sistema de Scoring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hot Score (0-40):</span>
                      <span className="font-semibold">Frequência + Recency</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Exclusivity Score (0-30):</span>
                      <span className="font-semibold">Público(5) → Super-exclusivo(30)</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Competition Score (0-30):</span>
                      <span className="font-semibold">YouTube vs Ads ratio</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Opportunity Score:</span>
                      <span className="font-bold text-blue-600">Combined (max 100)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💼 Primary Advertiser</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Company:</div>
                    <div className="font-semibold">Y&F EMPREENDIMENTOS DIGITAIS LTDA</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Domain:</div>
                    <div className="font-semibold text-blue-600">global-review2025.blog</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Priority:</div>
                    <div className="font-semibold text-red-600">VERY HIGH</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Sempre monitorar este anunciante para oportunidades exclusivas
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Recomendações de Ação</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• <strong>Score 80+:</strong> Ação imediata recomendada</li>
                    <li>• <strong>Exclusive/Super-exclusive:</strong> Pesquisar processo de afiliação</li>
                    <li>• <strong>Frequência 3+:</strong> Monitoramento prioritário</li>
                    <li>• <strong>Gap Pattern:</strong> Produto voltou após 60+ dias ausente</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

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