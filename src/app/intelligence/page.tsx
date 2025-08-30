'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BackToDashboard from '@/components/BackToDashboard'
import { 
  Search, 
  Eye, 
  Target, 
  TrendingUp, 
  Youtube, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Zap,
  Star,
  Play,
  ExternalLink,
  Monitor
} from 'lucide-react'

interface ProductIntelligenceData {
  id: string
  productName: string
  vendor: string
  platform: string
  category: string
  
  // Intelligence Score
  intelligenceScore: number
  
  // Competition Analysis
  competitionAnalysis: {
    searchVolume: number
    adCount: number
    competitionLevel: 'low' | 'medium' | 'high'
    opportunityRating: 'gold' | 'silver' | 'bronze' | 'saturated'
    exclusivityStatus: 'open' | 'restricted' | 'exclusive' | 'unknown'
  }
  
  // YouTube Intelligence
  youtubeIntelligence: {
    channelsPromoting: number
    totalPromotions: number
    averageViews: number
    promotionFrequency: 'daily' | 'weekly' | 'monthly' | 'rare'
    topChannels: Array<{
      name: string
      subscribers: number
      promotionCount: number
      credibilityScore: number
    }>
  }
  
  // Ads Intelligence
  adsIntelligence: {
    activeAdsCount: number
    estimatedSpend: number
    topAdvertisers: Array<{
      name: string
      spend: number
      adCount: number
    }>
    adCopyInsights: {
      topPhrases: Array<{ phrase: string; frequency: number }>
      emotionalTriggers: string[]
      callToActions: string[]
    }
  }
  
  // Action Recommendations
  actionRecommendations: Array<{
    type: 'immediate' | 'monitor' | 'test' | 'avoid'
    priority: 'high' | 'medium' | 'low'
    action: string
    reasoning: string
    estimatedROI: number
    investmentRequired: number
  }>
  
  // Financial data
  commission: number
  paymentType: 'cpa' | 'commission' | 'hybrid'
  cpaValue?: number
  averagePrice: number
  currency: string
}

export default function IntelligencePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [intelligenceData, setIntelligenceData] = useState<ProductIntelligenceData | null>(null)

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return
    
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/v1/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: searchQuery })
      })
      
      const data = await response.json()
      setIntelligenceData(data.intelligence)
      
    } catch (error) {
      console.error('Intelligence analysis failed:', error)
      // Mock data para demonstração
      setIntelligenceData({
        id: 'intel_demo',
        productName: searchQuery,
        vendor: 'Health Corp',
        platform: 'SmartADV',
        category: 'health_fitness',
        intelligenceScore: 87,
        
        competitionAnalysis: {
          searchVolume: 15420,
          adCount: 3,
          competitionLevel: 'low',
          opportunityRating: 'gold',
          exclusivityStatus: 'restricted'
        },
        
        youtubeIntelligence: {
          channelsPromoting: 4,
          totalPromotions: 12,
          averageViews: 47500,
          promotionFrequency: 'weekly',
          topChannels: [
            { name: 'Health Review Pro', subscribers: 85000, promotionCount: 6, credibilityScore: 92 },
            { name: 'Affiliate Insider', subscribers: 45000, promotionCount: 4, credibilityScore: 78 },
            { name: 'Product Truth', subscribers: 120000, promotionCount: 2, credibilityScore: 95 }
          ]
        },
        
        adsIntelligence: {
          activeAdsCount: 3,
          estimatedSpend: 8500,
          topAdvertisers: [
            { name: 'Health Marketing Pro', spend: 5000, adCount: 2 },
            { name: 'Wellness Direct', spend: 3500, adCount: 1 }
          ],
          adCopyInsights: {
            topPhrases: [
              { phrase: 'scientifically proven', frequency: 3 },
              { phrase: 'limited time offer', frequency: 2 },
              { phrase: 'doctor recommended', frequency: 2 }
            ],
            emotionalTriggers: ['urgency', 'authority', 'social_proof'],
            callToActions: ['Order Now', 'Learn More', 'Get Discount']
          }
        },
        
        actionRecommendations: [
          {
            type: 'immediate',
            priority: 'high',
            action: 'Launch test campaign with $500 budget',
            reasoning: 'Golden opportunity: High search volume (15K) with only 3 active ads',
            estimatedROI: 320,
            investmentRequired: 500
          },
          {
            type: 'monitor',
            priority: 'medium',
            action: 'Monitor top YouTube channels weekly',
            reasoning: 'Track promotion patterns to identify optimal timing',
            estimatedROI: 150,
            investmentRequired: 0
          }
        ],
        
        commission: 0,
        paymentType: 'cpa',
        cpaValue: 89,
        averagePrice: 197,
        currency: 'USD'
      })
      
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getOpportunityColor = (rating: string) => {
    const colors = {
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      silver: 'bg-gray-100 text-gray-800 border-gray-300', 
      bronze: 'bg-orange-100 text-orange-800 border-orange-300',
      saturated: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[rating as keyof typeof colors]
  }

  const getExclusivityColor = (status: string) => {
    const colors = {
      exclusive: 'bg-purple-100 text-purple-800',
      restricted: 'bg-blue-100 text-blue-800',
      open: 'bg-green-100 text-green-800',
      unknown: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors]
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <Zap className="w-4 h-4 text-red-500" />
    if (priority === 'medium') return <Clock className="w-4 h-4 text-yellow-500" />
    return <Monitor className="w-4 h-4 text-blue-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <BackToDashboard />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Product Intelligence</h1>
          </div>
          <p className="text-xl text-gray-600">
            Análise completa: YouTube + Google Ads + Competition + Scoring Inteligente
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Análise de Produto
            </CardTitle>
            <CardDescription>
              Digite o nome do produto para análise completa de intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Ex: Leptitox, Keto Diet Plan, Fitness Tracker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !searchQuery.trim()}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <BarChart3 className="w-5 h-5 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Analisar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {intelligenceData && (
          <div className="space-y-6">
            {/* Intelligence Score & Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-1">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {intelligenceData.intelligenceScore}
                  </div>
                  <div className="text-sm text-gray-500">Intelligence Score</div>
                  <div className="mt-4">
                    <Badge className={getOpportunityColor(intelligenceData.competitionAnalysis.opportunityRating)}>
                      {intelligenceData.competitionAnalysis.opportunityRating.toUpperCase()} OPPORTUNITY
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Competition</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Search Volume</span>
                      <span className="font-medium">{intelligenceData.competitionAnalysis.searchVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Ads</span>
                      <span className="font-medium">{intelligenceData.competitionAnalysis.adCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <span className="font-semibold">YouTube Intel</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Channels</span>
                      <span className="font-medium">{intelligenceData.youtubeIntelligence.channelsPromoting}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Promotions</span>
                      <span className="font-medium">{intelligenceData.youtubeIntelligence.totalPromotions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Payment</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      {intelligenceData.paymentType === 'cpa' ? `$${intelligenceData.cpaValue}` : `${intelligenceData.commission}%`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {intelligenceData.paymentType === 'cpa' ? 'CPA Fixed' : 'Commission'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="recommendations">🎯 Recomendações</TabsTrigger>
                <TabsTrigger value="youtube">📺 YouTube Intel</TabsTrigger>
                <TabsTrigger value="ads">📢 Ads Analysis</TabsTrigger>
                <TabsTrigger value="competition">⚔️ Competition</TabsTrigger>
              </TabsList>
              
              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recomendações Baseadas em Intelligence</CardTitle>
                    <CardDescription>
                      Ações priorizadas baseadas na análise completa dos dados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {intelligenceData.actionRecommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getPriorityIcon(rec.priority)}
                            <div>
                              <div className="font-semibold text-lg">{rec.action}</div>
                              <div className="text-sm text-gray-600">{rec.reasoning}</div>
                            </div>
                          </div>
                          <Badge variant={rec.type === 'immediate' ? 'destructive' : 'secondary'}>
                            {rec.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm">ROI Estimado: <strong>{rec.estimatedROI}%</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Investimento: <strong>${rec.investmentRequired}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* YouTube Intelligence Tab */}
              <TabsContent value="youtube" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Canais Promovendo o Produto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {intelligenceData.youtubeIntelligence.topChannels.map((channel, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{channel.name}</div>
                            <div className="text-sm text-gray-600">
                              {channel.subscribers.toLocaleString()} subscribers
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{channel.promotionCount} promoções</div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs">{channel.credibilityScore}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Padrões de Promoção</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Frequência de Promoção</span>
                          <Badge variant="outline">
                            {intelligenceData.youtubeIntelligence.promotionFrequency.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Views Médias</span>
                          <span className="font-medium">
                            {intelligenceData.youtubeIntelligence.averageViews.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Total de Promoções</span>
                          <span className="font-medium">
                            {intelligenceData.youtubeIntelligence.totalPromotions}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Ads Analysis Tab */}
              <TabsContent value="ads" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Análise de Copy dos Anúncios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Frases Mais Usadas</h4>
                          <div className="space-y-2">
                            {intelligenceData.adsIntelligence.adCopyInsights.topPhrases.map((phrase, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm">"{phrase.phrase}"</span>
                                <Badge variant="outline">{phrase.frequency}x</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Gatilhos Emocionais</h4>
                          <div className="flex flex-wrap gap-2">
                            {intelligenceData.adsIntelligence.adCopyInsights.emotionalTriggers.map((trigger, index) => (
                              <Badge key={index} variant="secondary">{trigger}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Call to Actions</h4>
                          <div className="flex flex-wrap gap-2">
                            {intelligenceData.adsIntelligence.adCopyInsights.callToActions.map((cta, index) => (
                              <Badge key={index} variant="outline">{cta}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Principais Anunciantes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {intelligenceData.adsIntelligence.topAdvertisers.map((advertiser, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{advertiser.name}</div>
                            <div className="text-sm text-gray-600">{advertiser.adCount} anúncios ativos</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">
                              ${advertiser.spend.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">spend estimado</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Competition Tab */}
              <TabsContent value="competition" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Análise de Oportunidade</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="mb-4">
                        <Badge 
                          className={`${getOpportunityColor(intelligenceData.competitionAnalysis.opportunityRating)} text-lg py-2 px-4`}
                        >
                          {intelligenceData.competitionAnalysis.opportunityRating.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Volume de Busca</span>
                          <span className="font-medium">
                            {intelligenceData.competitionAnalysis.searchVolume.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Anúncios Ativos</span>
                          <span className="font-medium">
                            {intelligenceData.competitionAnalysis.adCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ratio (Busca/Ads)</span>
                          <span className="font-medium text-green-600">
                            {Math.round(intelligenceData.competitionAnalysis.searchVolume / intelligenceData.competitionAnalysis.adCount)}:1
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <Badge className={getExclusivityColor(intelligenceData.competitionAnalysis.exclusivityStatus)}>
                          {intelligenceData.competitionAnalysis.exclusivityStatus.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">Status de Exclusividade</div>
                      
                      {intelligenceData.competitionAnalysis.exclusivityStatus === 'exclusive' && (
                        <div className="mt-3 p-2 bg-purple-50 rounded text-xs text-purple-700">
                          ⭐ Produto exclusivo - maior conversão!
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {intelligenceData.competitionAnalysis.competitionLevel.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">Nível de Competição</div>
                      
                      {intelligenceData.competitionAnalysis.competitionLevel === 'low' && (
                        <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                          🎯 Baixa competição = Ótima oportunidade
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}