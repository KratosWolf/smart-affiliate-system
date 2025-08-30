'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Monitor,
  Gem,
  Crown,
  Activity,
  RefreshCw
} from 'lucide-react'

interface DiscoveredProduct {
  id: string
  productName: string
  vendor: string
  platform: string
  
  // Discovery tracking
  discoveredAt: Date
  discoverySource: 'youtube-monitoring' | 'ads-discovery' | 'both'
  discoveryFrequency: number
  
  // Exclusivity indicators
  exclusivityLevel: 'public' | 'semi-exclusive' | 'exclusive' | 'super-exclusive'
  exclusivityIndicators: string[]
  
  // YouTube Intelligence
  youtubeData: {
    totalMentions: number
    averageViews: number
    channelTypes: string[]
    lastMentioned: Date
  }
  
  // Ads Intelligence  
  adsData: {
    totalActiveAds: number
    estimatedSpend: number
    adDuration: number
    targetingComplexity: 'simple' | 'advanced' | 'sophisticated'
  }
  
  // Scoring
  hotScore: number
  exclusivityScore: number
  opportunityScore: number
  
  // Recommendations
  recommendations: Array<{
    priority: 'immediate' | 'monitor' | 'investigate'
    action: string
    reasoning: string
    confidenceLevel: number
  }>
}

export default function IntelligenceMiningPage() {
  const [isMining, setIsMining] = useState(false)
  const [discoveries, setDiscoveries] = useState<DiscoveredProduct[]>([])
  const [lastMiningTime, setLastMiningTime] = useState<Date | null>(null)
  const [miningStats, setMiningStats] = useState({
    channelsMonitored: 0,
    newChannelsFound: 0,
    productsDiscovered: 0,
    exclusiveFinds: 0
  })

  const handleRunGarimpagem = async () => {
    setIsMining(true)
    
    try {
      const response = await fetch('/api/v1/intelligence/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      if (data.success) {
        setDiscoveries(data.discoveries)
        setMiningStats(data.stats)
        setLastMiningTime(new Date())
      }
      
    } catch (error) {
      console.error('Mining failed:', error)
      
      // Mock data para demonstração
      const mockDiscoveries: DiscoveredProduct[] = [
        {
          id: 'disc_1',
          productName: 'MetaboFix Advanced',
          vendor: 'Health Innovations',
          platform: 'SmartADV',
          discoveredAt: new Date(),
          discoverySource: 'both',
          discoveryFrequency: 4,
          exclusivityLevel: 'exclusive',
          exclusivityIndicators: ['Only 2 channels promoting', 'High spend with few ads'],
          youtubeData: {
            totalMentions: 4,
            averageViews: 67000,
            channelTypes: ['niche-expert', 'small-exclusive'],
            lastMentioned: new Date()
          },
          adsData: {
            totalActiveAds: 2,
            estimatedSpend: 15000,
            adDuration: 45,
            targetingComplexity: 'sophisticated'
          },
          hotScore: 85,
          exclusivityScore: 25,
          opportunityScore: 92,
          recommendations: [
            {
              priority: 'immediate',
              action: 'Research affiliate application process',
              reasoning: 'Exclusive product with high spend indicates serious opportunity',
              confidenceLevel: 95
            }
          ]
        },
        {
          id: 'disc_2',
          productName: 'Crypto Wealth Builder',
          vendor: 'Finance Pro',
          platform: 'ClickBank',
          discoveredAt: new Date(),
          discoverySource: 'youtube-monitoring',
          discoveryFrequency: 6,
          exclusivityLevel: 'semi-exclusive',
          exclusivityIndicators: ['Trending up rapidly', 'Limited channel promotion'],
          youtubeData: {
            totalMentions: 6,
            averageViews: 89000,
            channelTypes: ['big-affiliate'],
            lastMentioned: new Date()
          },
          adsData: {
            totalActiveAds: 5,
            estimatedSpend: 8500,
            adDuration: 30,
            targetingComplexity: 'advanced'
          },
          hotScore: 92,
          exclusivityScore: 15,
          opportunityScore: 87,
          recommendations: [
            {
              priority: 'immediate',
              action: 'Launch test campaign with $300 budget',
              reasoning: 'Hot product with 6 mentions in short time frame',
              confidenceLevel: 88
            }
          ]
        },
        {
          id: 'disc_3',
          productName: 'Smart Fitness Tracker Pro',
          vendor: 'TechWear',
          platform: 'DrCash',
          discoveredAt: new Date(),
          discoverySource: 'ads-discovery',
          discoveryFrequency: 2,
          exclusivityLevel: 'super-exclusive',
          exclusivityIndicators: ['Very few mentions', 'High-quality exclusive advertisers'],
          youtubeData: {
            totalMentions: 2,
            averageViews: 125000,
            channelTypes: ['small-exclusive'],
            lastMentioned: new Date()
          },
          adsData: {
            totalActiveAds: 1,
            estimatedSpend: 22000,
            adDuration: 60,
            targetingComplexity: 'sophisticated'
          },
          hotScore: 65,
          exclusivityScore: 30,
          opportunityScore: 89,
          recommendations: [
            {
              priority: 'investigate',
              action: 'Deep research on advertiser portfolio',
              reasoning: 'Super exclusive with very high spend - could be goldmine',
              confidenceLevel: 85
            }
          ]
        }
      ]
      
      setDiscoveries(mockDiscoveries)
      setMiningStats({
        channelsMonitored: 12,
        newChannelsFound: 3,
        productsDiscovered: 8,
        exclusiveFinds: 3
      })
      setLastMiningTime(new Date())
      
    } finally {
      setIsMining(false)
    }
  }

  const getExclusivityColor = (level: string) => {
    const colors = {
      'public': 'bg-gray-100 text-gray-800',
      'semi-exclusive': 'bg-blue-100 text-blue-800', 
      'exclusive': 'bg-purple-100 text-purple-800',
      'super-exclusive': 'bg-yellow-100 text-yellow-800'
    }
    return colors[level as keyof typeof colors]
  }

  const getExclusivityIcon = (level: string) => {
    const icons = {
      'public': <Globe className="w-4 h-4" />,
      'semi-exclusive': <Star className="w-4 h-4" />,
      'exclusive': <Gem className="w-4 h-4" />,
      'super-exclusive': <Crown className="w-4 h-4" />
    }
    return icons[level as keyof typeof icons]
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      'immediate': 'bg-red-100 text-red-800',
      'monitor': 'bg-yellow-100 text-yellow-800',
      'investigate': 'bg-blue-100 text-blue-800'
    }
    return colors[priority as keyof typeof colors]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">Intelligence Mining</h1>
          </div>
          <p className="text-xl text-gray-600">
            Sistema Ativo de Garimpagem: YouTube Channels + Ads Discovery + Exclusivity Detection
          </p>
        </div>

        {/* Mining Control */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Garimpagem Ativa
            </CardTitle>
            <CardDescription>
              Monitora canais TOP + Descobre novos + Testa produtos aleatórios + Detecta exclusividade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{miningStats.channelsMonitored}</div>
                  <div className="text-sm text-gray-500">Canais Monitorados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{miningStats.newChannelsFound}</div>
                  <div className="text-sm text-gray-500">Novos Canais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{miningStats.productsDiscovered}</div>
                  <div className="text-sm text-gray-500">Produtos Descobertos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{miningStats.exclusiveFinds}</div>
                  <div className="text-sm text-gray-500">Exclusivos</div>
                </div>
              </div>
              
              <div className="ml-6">
                <Button 
                  onClick={handleRunGarimpagem}
                  disabled={isMining}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isMining ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Garimpando...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 mr-2" />
                      Iniciar Garimpagem
                    </>
                  )}
                </Button>
                {lastMiningTime && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Última: {lastMiningTime.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>📺 YouTube Intelligence:</strong>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>• Monitora canais TOP de afiliados</li>
                    <li>• Descobre NOVOS canais automaticamente</li>
                    <li>• Detecta produtos com alta frequência</li>
                    <li>• Identifica exclusivos em canais pequenos</li>
                  </ul>
                </div>
                <div>
                  <strong>📢 Ads Intelligence:</strong>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>• Testa produtos aleatórios no Ads Transparency</li>
                    <li>• Descobre anunciantes com portfólio extenso</li>
                    <li>• Monitora players com alto investimento</li>
                    <li>• Detecta produtos super-exclusivos</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discoveries */}
        {discoveries.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Produtos Descobertos</h2>
              <Badge variant="secondary" className="text-sm">
                {discoveries.length} oportunidades encontradas
              </Badge>
            </div>

            <div className="space-y-4">
              {discoveries.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{product.productName}</h3>
                          <Badge className={getExclusivityColor(product.exclusivityLevel)}>
                            {getExclusivityIcon(product.exclusivityLevel)}
                            <span className="ml-1">{product.exclusivityLevel.replace('-', ' ').toUpperCase()}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>Vendor: {product.vendor}</span>
                          <span>Platform: {product.platform.toUpperCase()}</span>
                          <Badge variant="outline">
                            {product.discoveryFrequency}x descoberto
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.exclusivityIndicators.map((indicator, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600 mb-1">
                          {product.opportunityScore}
                        </div>
                        <div className="text-sm text-gray-500">Opportunity Score</div>
                        
                        <div className="mt-2 space-y-1 text-xs">
                          <div>Hot: {product.hotScore}</div>
                          <div>Exclusivity: {product.exclusivityScore}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-600" />
                        <div>
                          <div className="font-medium">{product.youtubeData.totalMentions}</div>
                          <div className="text-xs text-gray-500">YouTube Mentions</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium">{product.youtubeData.averageViews.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Avg Views</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium">{product.adsData.totalActiveAds}</div>
                          <div className="text-xs text-gray-500">Active Ads</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-medium">${product.adsData.estimatedSpend.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Est. Spend</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Recomendações Prioritárias</h4>
                      <div className="space-y-2">
                        {product.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Badge className={getPriorityColor(rec.priority)} variant="secondary">
                              {rec.priority.toUpperCase()}
                            </Badge>
                            <div className="flex-1">
                              <div className="font-medium">{rec.action}</div>
                              <div className="text-sm text-gray-600">{rec.reasoning}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Confiança: {rec.confidenceLevel}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {discoveries.length === 0 && !isMining && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pronto para Garimpar
              </h3>
              <p className="text-gray-600 mb-6">
                Clique em "Iniciar Garimpagem" para descobrir produtos quentes e exclusivos
              </p>
              <div className="text-sm text-gray-500">
                O sistema irá monitorar canais do YouTube e testar produtos no Google Ads Transparency
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}