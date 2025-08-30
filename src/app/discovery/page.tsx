'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BackToDashboard from '@/components/BackToDashboard'
import { 
  Search, 
  TrendingUp, 
  Globe, 
  DollarSign, 
  Star, 
  ExternalLink,
  Filter,
  RefreshCw,
  Youtube,
  BarChart3,
  Target
} from 'lucide-react'

interface ProductOpportunity {
  id: string
  productName: string
  vendor: string
  platform: string
  category: string
  commission: number
  gravity?: number
  averagePrice: number
  currency: string
  trending: boolean
  discoverySource: string
  opportunityScore: number
  marketData: {
    searchVolume: number
    competition: 'low' | 'medium' | 'high'
    trendDirection: 'rising' | 'stable' | 'declining'
  }
  urls: {
    salesPage?: string
    affiliateLink?: string
  }
  discoveredAt: Date
}

interface DiscoveryResponse {
  success: boolean
  data: {
    opportunities: ProductOpportunity[]
    summary: {
      totalFound: number
      returned: number
      platforms: Record<string, number>
      sources: Record<string, number>
      averageScore: number
      topCategories: { category: string; count: number }[]
      processingTime: number
    }
    recommendations: Array<{
      type: string
      title: string
      description: string
      action: string
      productId?: string
    }>
  }
}

export default function ProductDiscoveryPage() {
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [discoveryData, setDiscoveryData] = useState<DiscoveryResponse | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState(['clickbank', 'smartadv', 'drcash'])
  const [paymentModel, setPaymentModel] = useState<'cpa' | 'commission' | 'both'>('both')
  const [searchMode, setSearchMode] = useState<'general' | 'filtered'>('general')

  const platforms = [
    { id: 'clickbank', name: 'ClickBank', description: 'Global marketplace' },
    { id: 'smartadv', name: 'SmartAdv', description: 'International network' },
    { id: 'drcash', name: 'Dr Cash', description: 'European platform' },
    { id: 'warriorplus', name: 'WarriorPlus', description: 'Digital marketing' },
    { id: 'jvzoo', name: 'JVZoo', description: 'Software & digital' },
    { id: 'digistore24', name: 'DigiStore24', description: 'European marketplace' }
  ]

  const paymentModels = [
    { id: 'both', name: 'CPA + Commission', description: 'Buscar todos os tipos (PLAYBOOK: CPA 40-45%)', icon: '💰' },
    { id: 'cpa', name: 'CPA Only', description: 'CPA Target: 40-45% da comissão (Máx: 80%)', icon: '🎯' },
    { id: 'commission', name: 'Commission Only', description: 'Produtos exclusivos: 35-50% commission', icon: '📈' }
  ]

  const handleDiscover = async () => {
    setIsDiscovering(true)
    
    try {
      const response = await fetch('/api/v1/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          paymentModel,
          searchMode,
          countries: ['US', 'FR', 'DE', 'GB', 'CA', 'DK', 'SE', 'PL', 'RO'],
          languages: ['en', 'pt', 'fr', 'de']
        })
      })
      
      const data = await response.json()
      setDiscoveryData(data)
      
    } catch (error) {
      console.error('Discovery failed:', error)
      setDiscoveryData({
        success: false,
        data: {
          opportunities: [],
          summary: {
            totalFound: 0,
            returned: 0,
            platforms: {},
            sources: {},
            averageScore: 0,
            topCategories: [],
            processingTime: 0
          },
          recommendations: [{
            type: 'error',
            title: 'Discovery Failed',
            description: 'Please check your connection and try again',
            action: 'Retry discovery'
          }]
        }
      })
    } finally {
      setIsDiscovering(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      clickbank: '🏪',
      smartadv: '🌐',
      drcash: '💼',
      warriorplus: '⚔️',
      jvzoo: '🚀',
      digistore24: '🛍️',
      other: '📦'
    }
    return icons[platform] || '📦'
  }

  const getSourceIcon = (source: string) => {
    const icons: Record<string, any> = {
      youtube: <Youtube className="w-4 h-4" />,
      'google-trends': <TrendingUp className="w-4 h-4" />,
      'platform-trending': <BarChart3 className="w-4 h-4" />,
      'competitor-analysis': <Target className="w-4 h-4" />
    }
    return icons[source] || <Search className="w-4 h-4" />
  }

  const getCompetitionColor = (competition: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return colors[competition as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <BackToDashboard />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">🔍 Product Discovery & Mining</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Sistema Quality-First com critérios rigorosos • 15-30 produtos/dia • Automação às 6:00 AM
          </p>
          
          {/* PLAYBOOK Quality-First Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📺</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">YouTube Mining</h4>
                <p className="text-sm text-gray-600">5K+ subs, 50+ videos<br/>500K+ total views</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🎩</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Ads Transparency</h4>
                <p className="text-sm text-gray-600">10+ produtos ativos<br/>$5K+ monthly spend</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Multi-Geo</h4>
                <p className="text-sm text-gray-600">9 países simultâneos<br/>Gap detection 60+ dias</p>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYBOOK Criteria Details */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Critérios Quality-First (RIGOROSOS)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-red-800 mb-3">📺 YouTube Channels Mining</h4>
              <ul className="text-sm space-y-1">
                <li>📋 <strong>Subscribers:</strong> Mínimo 5.000 (não 1K)</li>
                <li>📹 <strong>Videos:</strong> Mínimo 50 (muito ativo)</li>
                <li>👁️ <strong>Views:</strong> Mínimo 500.000 total</li>
                <li>📈 <strong>Engagement:</strong> 50+ views por subscriber</li>
                <li>🏆 <strong>Premium:</strong> 5+ produtos únicos, 2+ recorrentes</li>
                <li>🟡 <strong>Good:</strong> 3+ produtos únicos, 1+ recorrente</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">🎩 Ads Transparency Mining</h4>
              <ul className="text-sm space-y-1">
                <li>💼 <strong>Portfolio:</strong> Mínimo 10 produtos (não 5)</li>
                <li>💰 <strong>Spend estimado:</strong> $5.000+ monthly</li>
                <li>📅 <strong>Campaign duration:</strong> 30+ dias ativo</li>
                <li>🎯 <strong>Targeting:</strong> Advanced ou Sophisticated</li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">🎆 Golden Sources (SEUS DADOS)</h4>
              <ul className="text-sm space-y-1">
                <li>📺 @butecohits4948 (Buteco Hits)</li>
                <li>👩 @LizyRomance (LizyRomance)</li>
                <li>👨‍💼 @val_le (Val Le)</li>
                <li>⚖️ @legitdiv (Legitdiv)</li>
                <li>🤼 @wrestlingfullhd, @wrestlingbest1</li>
                <li>🎆 @RookieSubs (Rookie Subs)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-3">🌍 Multi-Geo Strategy</h4>
              <ul className="text-sm space-y-1">
                <li>🇺🇸 <strong>US, 🇫🇷 FR, 🇩🇪 DE, 🇬🇧 GB:</strong> Principais</li>
                <li>🇨🇦 <strong>CA, 🇩🇰 DK, 🇸🇪 SE:</strong> Secundários</li>
                <li>🇵🇱 <strong>PL, 🇷🇴 RO:</strong> Emergentes</li>
                <li>🔍 <strong>Gap Patterns:</strong> Produtos ausentes 60+ dias</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Discovery Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Discovery Configuration
            </CardTitle>
            <CardDescription>
              Automação diária às 6:00 AM • Target 15-30 produtos/dia • Quality-First approach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Platform Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map(platform => (
                  <div
                    key={platform.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (selectedPlatforms.includes(platform.id)) {
                        setSelectedPlatforms(prev => prev.filter(p => p !== platform.id))
                      } else {
                        setSelectedPlatforms(prev => [...prev, platform.id])
                      }
                    }}
                  >
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-sm text-gray-500">{platform.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Model Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tipo de Pagamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {paymentModels.map(model => (
                  <div
                    key={model.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentModel === model.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentModel(model.id as any)}
                  >
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <span>{model.icon}</span>
                      {model.name}
                    </div>
                    <div className="text-sm text-gray-600">{model.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Mode */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Modo de Busca</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    searchMode === 'general'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSearchMode('general')}
                >
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <span>🎯</span>
                    Busca Geral (Recomendado)
                  </div>
                  <div className="text-sm text-gray-600">
                    Produtos com maior potencial de todas as categorias
                  </div>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    searchMode === 'filtered'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSearchMode('filtered')}
                >
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <span>🔍</span>
                    Busca Específica
                  </div>
                  <div className="text-sm text-gray-600">
                    Filtrar por categorias específicas
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Products & Primary Advertiser */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-orange-800 mb-3">🎆 Produtos Exclusivos</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>💊 Glucosense:</span>
                      <span className="font-semibold">45% comm. (95% pop.)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🧠 NerveCalm:</span>
                      <span className="font-semibold">40% comm. (88% pop.)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🩺 GlicoShield:</span>
                      <span className="font-semibold">50% comm. (92% pop.)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💧 GutDrops:</span>
                      <span className="font-semibold">35% comm. (85% pop.)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-3">💼 Primary Advertiser</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <div className="font-semibold">Y&F EMPREENDIMENTOS DIGITAIS LTDA</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Domain:</span>
                      <div className="font-semibold text-blue-600">global-review2025.blog</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <div className="font-semibold text-red-600">VERY HIGH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discovery Button */}
            <Button 
              onClick={handleDiscover}
              disabled={isDiscovering || selectedPlatforms.length === 0}
              className="w-full"
              size="lg"
            >
              {isDiscovering ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Discovering Products...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Start Discovery
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {discoveryData && (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Discovery Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {discoveryData.data.summary.totalFound}
                    </div>
                    <div className="text-sm text-gray-500">Total Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {discoveryData.data.summary.averageScore}
                    </div>
                    <div className="text-sm text-gray-500">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.keys(discoveryData.data.summary.platforms).length}
                    </div>
                    <div className="text-sm text-gray-500">Platforms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {discoveryData.data.summary.processingTime}ms
                    </div>
                    <div className="text-sm text-gray-500">Processing Time</div>
                  </div>
                </div>

                {/* Recommendations */}
                {discoveryData.data.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Recommendations</h3>
                    {discoveryData.data.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="font-medium text-blue-900">{rec.title}</div>
                        <div className="text-sm text-blue-700">{rec.description}</div>
                        <div className="text-xs text-blue-600 mt-1">→ {rec.action}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Tabs defaultValue="opportunities" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="opportunities" className="space-y-4">
                {discoveryData.data.opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                              {getPlatformIcon(opportunity.platform)}
                            </span>
                            <h3 className="text-xl font-semibold">
                              {opportunity.productName}
                            </h3>
                            {opportunity.trending && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                🔥 Trending
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>Vendor: {opportunity.vendor}</span>
                            <span>Platform: {opportunity.platform.toUpperCase()}</span>
                            <Badge variant="outline" className="text-xs">
                              {opportunity.category.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {opportunity.opportunityScore}/100
                          </div>
                          <div className="text-sm text-gray-500">Opportunity Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">
                              {opportunity.commission > 0 ? `${opportunity.commission}%` : 'CPA'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {opportunity.commission > 0 ? 'Commission' : 'Fixed CPA'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium">
                              {opportunity.currency} {opportunity.averagePrice}
                            </div>
                            <div className="text-xs text-gray-500">Avg Price</div>
                          </div>
                        </div>
                        
                        {opportunity.gravity && (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-600" />
                            <div>
                              <div className="font-medium">{opportunity.gravity}</div>
                              <div className="text-xs text-gray-500">Gravity</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {getSourceIcon(opportunity.discoverySource)}
                          <div>
                            <div className="font-medium capitalize">
                              {opportunity.discoverySource.replace('-', ' ')}
                            </div>
                            <div className="text-xs text-gray-500">Source</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            className={getCompetitionColor(opportunity.marketData.competition)}
                          >
                            {opportunity.marketData.competition.toUpperCase()} Competition
                          </Badge>
                          
                          <Badge variant="outline">
                            {opportunity.marketData.searchVolume.toLocaleString()} searches
                          </Badge>
                          
                          <Badge variant="outline" className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {opportunity.marketData.trendDirection}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          {opportunity.urls.salesPage && (
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={opportunity.urls.salesPage} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Sales Page
                              </a>
                            </Button>
                          )}
                          
                          <Button size="sm">
                            Validate Product
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {discoveryData.data.opportunities.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your discovery parameters or check different platforms
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(discoveryData.data.summary.platforms).map(([platform, count]) => (
                          <div key={platform} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{getPlatformIcon(platform)}</span>
                              <span className="capitalize">{platform}</span>
                            </div>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {discoveryData.data.summary.topCategories.map((cat) => (
                          <div key={cat.category} className="flex items-center justify-between">
                            <span className="capitalize">{cat.category.replace('_', ' ')}</span>
                            <span className="font-medium">{cat.count}</span>
                          </div>
                        ))}
                      </div>
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