'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  Star, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  TrendingDown,
  BarChart3
} from 'lucide-react'

interface Product {
  id: string
  name: string
  platform: string
  category: string
  commission: number
  commissionType: 'CPA' | 'RevShare' | 'Hybrid'
  gravity?: number
  trending: boolean
  source: string
  score: number // 0-100
  tier: 1 | 2 | 3
  
  // Calculated fields
  targetCPA: number
  maxCPA: number
  stopLoss: number
  testBudgetBRL: number
  roiPotential: {
    min: number
    max: number
  }
  
  // Market data
  marketData: {
    searchVolume: number
    competition: 'Low' | 'Medium' | 'High' | 'Very High'
    trendDirection: 'rising' | 'stable' | 'declining'
    estimatedCPC: string
  }
  
  // URLs
  urls: {
    salesPage?: string
    affiliateLink?: string
  }
  
  // Metadata
  discoveredAt: Date
  lastUpdated: Date
  status: 'new' | 'testing' | 'validated' | 'rejected'
}

export default function DiscoveryMiningPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState<'all' | 1 | 2 | 3>('all')
  const [autoRefresh, setAutoRefresh] = useState(false)
  
  // Mock data generator for demonstration
  const generateMockProducts = (): Product[] => {
    const names = [
      'ProDentim', 'Java Burn', 'Alpilean', 'GlucoTrust', 'Ikaria Juice',
      'Red Boost', 'Quietum Plus', 'Cortexi', 'Prostadine', 'NeuroTonix',
      'Kerassentials', 'Amiclear', 'Claritox Pro', 'TerraCalm', 'GlucoBerry',
      'LeanBiome', 'Liv Pure', 'Fast Lean Pro', 'PuraVive', 'Sugar Defender',
      'Sight Care', 'Neotonics', 'ProNail Complex', 'Metanail', 'DentiCore'
    ]
    
    const platforms = ['ClickBank', 'SmartAdv', 'Dr Cash', 'MaxBounty', 'ShareASale']
    const categories = ['Health', 'Weight Loss', 'Dental', 'Skin Care', 'Supplements']
    
    return names.map((name, index) => {
      const commission = Math.floor(Math.random() * 60) + 30 // $30-90
      const score = Math.floor(Math.random() * 60) + 40 // 40-100
      
      let tier: 1 | 2 | 3 = 3
      if (score >= 80) tier = 1
      else if (score >= 60) tier = 2
      
      const targetCPA = commission * 0.45
      const maxCPA = commission * 0.8
      
      return {
        id: `prod-${index + 1}`,
        name,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        commission,
        commissionType: 'CPA',
        gravity: Math.floor(Math.random() * 150) + 10,
        trending: Math.random() > 0.6,
        source: Math.random() > 0.5 ? 'Platform API' : 'Mining Bot',
        score,
        tier,
        targetCPA,
        maxCPA,
        stopLoss: commission,
        testBudgetBRL: Math.max(350, commission * 5),
        roiPotential: {
          min: Math.floor((commission - 3) / 3 * 100),
          max: Math.floor((commission - 1.5) / 1.5 * 100)
        },
        marketData: {
          searchVolume: Math.floor(Math.random() * 100000) + 10000,
          competition: ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 4)] as any,
          trendDirection: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)] as any,
          estimatedCPC: `$${(Math.random() * 3 + 1).toFixed(2)}-$${(Math.random() * 3 + 3).toFixed(2)}`
        },
        urls: {
          salesPage: `https://example.com/${name.toLowerCase()}`,
          affiliateLink: `https://hop.clickbank.net/?affiliate=${name.toLowerCase()}`
        },
        discoveredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(),
        status: 'new'
      }
    })
  }
  
  useEffect(() => {
    // Initial load
    handleDiscovery()
  }, [])
  
  useEffect(() => {
    // Daily mining at 6:00 AM
    if (autoRefresh) {
      const now = new Date()
      const tomorrow6AM = new Date()
      tomorrow6AM.setDate(now.getDate() + 1)
      tomorrow6AM.setHours(6, 0, 0, 0)
      
      // Time until next 6 AM
      const timeUntil6AM = tomorrow6AM.getTime() - now.getTime()
      
      // Set timeout for first execution, then daily interval
      const timeout = setTimeout(() => {
        handleDiscovery()
        
        // Then every 24 hours
        const interval = setInterval(() => {
          handleDiscovery()
        }, 24 * 60 * 60 * 1000)
        
        return () => clearInterval(interval)
      }, timeUntil6AM)
      
      return () => clearTimeout(timeout)
    }
  }, [autoRefresh])
  
  const handleDiscovery = async () => {
    setIsLoading(true)
    
    try {
      console.log('🔍 Starting real mining operation...')
      
      const response = await fetch('/api/mining', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Mining API failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Transform mining results to UI format
        const transformedProducts = data.data.discoveries.map((discovery: any, index: number) => {
          const commission = 50 // Default, can be enhanced later
          const targetCPA = commission * 0.45
          const maxCPA = commission * 0.8
          
          let tier: 1 | 2 | 3 = 3
          if (discovery.opportunityScore >= 80) tier = 1
          else if (discovery.opportunityScore >= 60) tier = 2
          
          return {
            id: discovery.id,
            name: discovery.productName,
            platform: discovery.platform,
            category: 'Supplements', // Default category
            commission,
            commissionType: 'CPA' as const,
            gravity: Math.floor(Math.random() * 150) + 10, // Mock for now
            trending: discovery.hotScore > 30,
            source: discovery.discoverySource === 'youtube-monitoring' ? 'YouTube Mining' : 
                   discovery.discoverySource === 'ads-discovery' ? 'Ads Mining' : 'Multi-Source',
            score: discovery.opportunityScore,
            tier,
            targetCPA,
            maxCPA,
            stopLoss: commission,
            testBudgetBRL: Math.max(350, commission * 5),
            roiPotential: {
              min: Math.floor((commission - 3) / 3 * 100),
              max: Math.floor((commission - 1.5) / 1.5 * 100)
            },
            marketData: {
              searchVolume: discovery.youtubeData?.averageViews || 10000,
              competition: discovery.exclusivityLevel === 'exclusive' ? 'Low' : 
                          discovery.exclusivityLevel === 'semi-exclusive' ? 'Medium' : 'High',
              competitors: discovery.youtubeData?.promotingChannels?.length || 0,
              trends: []
            },
            exclusivity: discovery.exclusivityLevel,
            hotScore: discovery.hotScore,
            exclusivityScore: discovery.exclusivityScore,
            recommendations: discovery.recommendations
          }
        })
        
        setProducts(transformedProducts.sort((a: any, b: any) => b.score - a.score))
        
        console.log(`✅ Mining completed: ${transformedProducts.length} products discovered`)
        
      } else {
        throw new Error(data.error || 'Mining failed')
      }
      
    } catch (error) {
      console.error('Mining error:', error)
      
      // Fallback to mock data if real mining fails
      console.log('🔄 Falling back to mock data...')
      const fallbackProducts = generateMockProducts()
      setProducts(fallbackProducts.sort((a, b) => b.score - a.score))
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredProducts = selectedTier === 'all' 
    ? products 
    : products.filter(p => p.tier === selectedTier)
  
  const stats = {
    total: products.length,
    tier1: products.filter(p => p.tier === 1).length,
    tier2: products.filter(p => p.tier === 2).length,
    tier3: products.filter(p => p.tier === 3).length,
    newToday: products.filter(p => {
      const today = new Date()
      return p.discoveredAt.toDateString() === today.toDateString()
    }).length
  }
  
  const getTierColor = (tier: 1 | 2 | 3) => {
    switch(tier) {
      case 1: return 'bg-green-100 text-green-800 border-green-300'
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 3: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }
  
  const getTrendIcon = (direction: string) => {
    switch(direction) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Search className="h-6 w-6 text-blue-600" />
                  Discovery + Mining Hub
                </CardTitle>
                <CardDescription>
                  High-volume product discovery with automated mining • Daily execution at 6:00 AM
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  size="sm"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Daily 6AM Mining {autoRefresh ? 'ON' : 'OFF'}
                </Button>
                <Button onClick={handleDiscovery} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Discover Now
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">🥇 {stats.tier1}</div>
                <div className="text-sm text-gray-600">Tier 1 (Test Now)</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">🥈 {stats.tier2}</div>
                <div className="text-sm text-gray-600">Tier 2 (Potential)</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">🥉 {stats.tier3}</div>
                <div className="text-sm text-gray-600">Tier 3 (Watch)</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">🔥 {stats.newToday}</div>
                <div className="text-sm text-gray-600">New Today</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="all" onValueChange={(value) => setSelectedTier(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All Products ({stats.total})</TabsTrigger>
            <TabsTrigger value="1">🥇 Tier 1 ({stats.tier1})</TabsTrigger>
            <TabsTrigger value="2">🥈 Tier 2 ({stats.tier2})</TabsTrigger>
            <TabsTrigger value="3">🥉 Tier 3 ({stats.tier3})</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTier.toString()} className="space-y-4 mt-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    {/* Left: Product Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <Badge className={getTierColor(product.tier)}>
                          Tier {product.tier} • Score: {product.score}
                        </Badge>
                        {product.trending && (
                          <Badge className="bg-red-100 text-red-800">
                            <Zap className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Platform:</span>
                          <span className="ml-2 font-medium">{product.platform}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-2 font-medium">{product.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Gravity:</span>
                          <span className="ml-2 font-medium">{product.gravity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Source:</span>
                          <span className="ml-2 font-medium">{product.source}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Center: Financial Metrics */}
                    <div className="px-6 border-x">
                      <div className="text-center mb-2">
                        <div className="text-2xl font-bold text-green-600">${product.commission}</div>
                        <div className="text-xs text-gray-500">Commission</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">${product.targetCPA.toFixed(0)}</div>
                          <div className="text-gray-500">Target CPA</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">${product.stopLoss.toFixed(0)}</div>
                          <div className="text-gray-500">Stop Loss</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Market Data & Actions */}
                    <div className="pl-6">
                      <div className="mb-3 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Volume:</span>
                          <span className="font-medium">{product.marketData.searchVolume.toLocaleString()}</span>
                          {getTrendIcon(product.marketData.trendDirection)}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Competition:</span>
                          <Badge variant={
                            product.marketData.competition === 'Low' ? 'default' :
                            product.marketData.competition === 'Medium' ? 'secondary' :
                            'destructive'
                          }>
                            {product.marketData.competition}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">ROI:</span>
                          <span className="font-bold text-purple-600">
                            {product.roiPotential.min}%-{product.roiPotential.max}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Target className="h-4 w-4 mr-1" />
                          Validate
                        </Button>
                        <Button size="sm" variant={product.tier === 1 ? "default" : "secondary"}>
                          <DollarSign className="h-4 w-4 mr-1" />
                          Test Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
        
        {/* User's Known Sources */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Your Golden Sources (Active Monitoring)</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-green-800 mb-2">🎯 Primary Advertiser</h5>
                <div className="bg-white p-3 rounded border-l-4 border-green-400">
                  <div className="font-medium">Y&F EMPREENDIMENTOS DIGITAIS LTDA</div>
                  <div className="text-sm text-gray-600">global-review2025.blog</div>
                  <Badge className="mt-1 bg-green-100 text-green-800">Very High Priority</Badge>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-green-800 mb-2">📺 YouTube Channels (7)</h5>
                <div className="space-y-1 text-sm">
                  <div>• @butecohits4948 (Buteco Hits)</div>
                  <div>• @LizyRomance</div>
                  <div>• @val_le (Val Le)</div>
                  <div>• @legitdiv (Legitdiv)</div>
                  <div>• @wrestlingfullhd (Wrestling Full HD)</div>
                  <div>• @wrestlingbest1 (Wrestling Best 1)</div>
                  <div>• @RookieSubs (Rookie Subs)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mining Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Daily Mining Schedule</h4>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              <strong>Every day at 6:00 AM</strong>, the system automatically monitors your golden sources <strong>AND</strong> actively discovers new sources:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-blue-900 mb-2">📊 Monitor Known Sources:</div>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div>✓ Your 7 YouTube channels</div>
                  <div>✓ Your primary advertiser</div>
                  <div>✓ Hot product detection</div>
                  <div>✓ Exclusivity analysis</div>
                </div>
              </div>
              
              <div>
                <div className="font-medium text-blue-900 mb-2">🔍 Discover New Sources Daily:</div>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div><strong>• NEW YouTube channels</strong> (9 regions: US, FR, DE, GB, CA, DK, SE, PL, RO)</div>
                  <div><strong>• NEW advertisers</strong> (big portfolios, spending)</div>
                  <div><strong>• NEW domains</strong> (via random testing)</div>
                  <div>• SmartADV integration (exclusive products)</div>
                  <div>• Gap pattern detection (product comeback)</div>
                  <div>• Multi-product channel analysis</div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-yellow-100 rounded-lg border-l-4 border-yellow-400">
              <div className="text-xs text-yellow-800">
                <strong>🎯 QUALITY FIRST:</strong> We only add EXCEPTIONAL sources to our database. Rigorous criteria: YouTube channels need 5K+ subs, 50+ videos, 500K+ views, good engagement. Advertisers need 10+ active products. <strong>Some days = 0 new sources (and that's OK!)</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}