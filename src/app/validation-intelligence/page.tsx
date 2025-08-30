"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  Youtube,
  BarChart3,
  DollarSign,
  Globe,
  Clock
} from 'lucide-react'

export default function ValidationIntelligencePage() {
  const [formData, setFormData] = useState({
    productName: '',
    country: 'Brasil',
    affiliateLink: '',
    commissionValue: '',
    commissionType: 'CPA'
  })
  
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [intelligenceResult, setIntelligenceResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState('validation')

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.productName.trim()) {
      setError('Please enter a product name')
      return
    }
    
    setIsValidating(true)
    setError('')
    setValidationResult(null)
    setIntelligenceResult(null)
    
    try {
      console.log('🔍 Running complete product analysis...')
      
      // 1. Product Validation
      const validationResponse = await fetch('/api/validate-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: formData.productName,
          country: formData.country,
          commissionValue: formData.commissionValue,
          commissionType: formData.commissionType
        })
      })
      
      if (validationResponse.ok) {
        const validationData = await validationResponse.json()
        setValidationResult(validationData)
        
        // 2. Intelligence Analysis (simulated for now)
        const intelligenceData = {
          youtubeAnalysis: {
            mentioningChannels: [
              { name: '@butecohits4948', subscribers: '25K', lastMention: '2 days ago', sentiment: 'positive' },
              { name: '@LizyRomance', subscribers: '18K', lastMention: '5 days ago', sentiment: 'neutral' }
            ],
            totalMentions: 12,
            averageViews: 45000,
            trendingScore: 78
          },
          adsIntelligence: {
            activeAdvertisers: [
              { name: 'Y&F EMPREENDIMENTOS DIGITALS LTDA', domain: 'global-review2025.blog', spend: '$8,500', active: true },
              { name: 'Health Marketing Pro', domain: 'healthpro.com', spend: '$3,200', active: true }
            ],
            totalActiveAds: 6,
            estimatedSpend: '$11,700',
            competitionLevel: 'Medium'
          },
          exclusivityAnalysis: {
            level: 'Semi-Exclusive',
            indicators: ['Limited advertiser base', 'User golden channel mentions', 'Moderate competition'],
            opportunityScore: 82
          }
        }
        
        setIntelligenceResult(intelligenceData)
        console.log('✅ Complete analysis completed')
        
        // Switch to results tab
        setActiveTab('results')
        
      } else {
        throw new Error('Validation failed')
      }
      
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze product. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Product Validation + Intelligence</h1>
          </div>
          <p className="text-xl text-gray-600">
            Complete Product Analysis: Validation + YouTube + Ads + Competition
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="validation">🎯 Product Analysis</TabsTrigger>
            <TabsTrigger value="results">📊 Intelligence Results</TabsTrigger>
          </TabsList>

          {/* Product Analysis Tab */}
          <TabsContent value="validation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Complete Product Analysis
                </CardTitle>
                <CardDescription>
                  Enter product details for comprehensive validation + intelligence analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleValidation} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Name</label>
                      <Input
                        type="text"
                        placeholder="e.g. ProDentim, Glucosense..."
                        value={formData.productName}
                        onChange={(e) => setFormData({...formData, productName: e.target.value})}
                        className="border-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="border-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Commission Value ($)</label>
                      <Input
                        type="number"
                        placeholder="50"
                        value={formData.commissionValue}
                        onChange={(e) => setFormData({...formData, commissionValue: e.target.value})}
                        className="border-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Commission Type</label>
                      <select 
                        className="w-full p-2 border-2 rounded-md"
                        value={formData.commissionType}
                        onChange={(e) => setFormData({...formData, commissionType: e.target.value})}
                      >
                        <option value="CPA">CPA</option>
                        <option value="RevShare">RevShare</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={isValidating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  >
                    {isValidating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Running Complete Analysis...
                      </>
                    ) : (
                      <>
                        <Target className="w-5 h-5 mr-2" />
                        Run Complete Analysis (Validation + Intelligence)
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            {validationResult && intelligenceResult ? (
              <div className="space-y-6">
                {/* Overview */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <CheckCircle className="w-5 h-5" />
                      Analysis Complete: {formData.productName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {validationResult.data?.score || 'N/A'}
                        </div>
                        <div className="text-sm text-green-700">Validation Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {intelligenceResult.exclusivityAnalysis.opportunityScore}
                        </div>
                        <div className="text-sm text-blue-700">Opportunity Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {intelligenceResult.exclusivityAnalysis.level}
                        </div>
                        <div className="text-sm text-indigo-700">Exclusivity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          ${validationResult.data?.cpaTargets?.target || 'N/A'}
                        </div>
                        <div className="text-sm text-purple-700">CPA Target</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Validation Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Validation Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Competition Level:</span>
                        <Badge variant={validationResult.data?.competitionData?.competitionLevel === 'High' ? 'destructive' : 'secondary'}>
                          {validationResult.data?.competitionData?.competitionLevel}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. CPC:</span>
                        <span className="font-semibold">{validationResult.data?.competitionData?.estimatedCPC}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Results:</span>
                        <span className="font-semibold">{validationResult.data?.totalResults?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI Potential:</span>
                        <span className="font-semibold text-green-600">{validationResult.data?.roiPotential?.display}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* YouTube Intelligence */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-red-600" />
                        YouTube Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="font-semibold">Mentioning Channels:</div>
                        {intelligenceResult.youtubeAnalysis.mentioningChannels.map((channel: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span>{channel.name} ({channel.subscribers})</span>
                            <Badge variant={channel.sentiment === 'positive' ? 'default' : 'secondary'}>
                              {channel.sentiment}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <span>Total Mentions:</span>
                        <span className="font-semibold">{intelligenceResult.youtubeAnalysis.totalMentions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Views:</span>
                        <span className="font-semibold">{intelligenceResult.youtubeAnalysis.averageViews.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ads Intelligence */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Ads Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="font-semibold">Active Advertisers:</div>
                        {intelligenceResult.adsIntelligence.activeAdvertisers.map((advertiser: any, i: number) => (
                          <div key={i} className="text-sm">
                            <div className="font-medium">{advertiser.name}</div>
                            <div className="text-gray-600">{advertiser.domain} • {advertiser.spend}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <span>Total Active Ads:</span>
                        <span className="font-semibold">{intelligenceResult.adsIntelligence.totalActiveAds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Total Spend:</span>
                        <span className="font-semibold text-green-600">{intelligenceResult.adsIntelligence.estimatedSpend}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Exclusivity Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-indigo-600" />
                        Exclusivity Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Exclusivity Level:</span>
                        <Badge variant="default">{intelligenceResult.exclusivityAnalysis.level}</Badge>
                      </div>
                      <div>
                        <div className="font-semibold mb-2">Indicators:</div>
                        <div className="space-y-1">
                          {intelligenceResult.exclusivityAnalysis.indicators.map((indicator: string, i: number) => (
                            <div key={i} className="text-sm flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              {indicator}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Opportunity Score:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {intelligenceResult.exclusivityAnalysis.opportunityScore}/100
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Analysis Results</h3>
                  <p className="text-gray-500">Run a product analysis to see detailed results here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}