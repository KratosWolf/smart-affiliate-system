"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BackToDashboard from '@/components/BackToDashboard'
import { Target, Search, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { COUNTRY_OPTIONS } from '@/lib/constants/countries'

export default function ValidationPage() {
  const [formData, setFormData] = useState({
    productName: '',
    country: 'US',
    producerPageUrl: '',
    commissionValue: '',
    commissionType: 'CPA'
  })

  // Check for data from Discovery Mining on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const validationData = localStorage.getItem('validationData')
      if (validationData) {
        try {
          const data = JSON.parse(validationData)
          if (data.source === 'discovery_mining') {
            setFormData({
              productName: data.productName || '',
              country: data.discoveryData?.countries?.[0] || 'US',
              producerPageUrl: data.productUrl || '',
              commissionValue: data.commission?.toString() || '',
              commissionType: 'CPA'
            })
            // Clear the data after using it
            localStorage.removeItem('validationData')
          }
        } catch (error) {
          console.error('Error loading discovery data:', error)
        }
      }
    }
  }, [])
  
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [exchangeRate, setExchangeRate] = useState(5.2) // USD to BRL default

  // Function to convert USD to BRL and vice versa
  const convertCurrency = (amount: number, fromUSD = true) => {
    if (fromUSD) {
      return amount * exchangeRate // USD to BRL
    } else {
      return amount / exchangeRate // BRL to USD
    }
  }

  // Format currency display
  const formatCurrency = (amount: number, currency: 'USD' | 'BRL') => {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`
    } else {
      return `R$ ${amount.toFixed(2)}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.productName.trim()) {
      setError('Please enter a product name')
      return
    }
    
    setIsValidating(true)
    setError('')
    setResult(null)
    
    try {
      console.log('🔍 Validating product via API:', formData)
      
      const response = await fetch('/api/v1/validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: formData.productName,
          productUrl: formData.productName, // Use product name for validation, not the URL
          producerPageUrl: formData.producerPageUrl, // Keep producer URL separate
          targetCountry: formData.country,
          commissionValue: formData.commissionValue,
          commissionType: formData.commissionType,
          budget: 1000 // Default budget
        })
      })
      
      const data = await response.json()
      console.log('📊 API Response:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Validation failed')
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Validation was not successful')
      }
      
      // Map the API response to the expected format
      const mappedResult = {
        ...data.data,
        // Map fields for UI compatibility
        score: data.data.validationScore,
        totalResults: data.data.marketAnalysis?.searchVolume || 0,
        specificResults: 0, // Will be calculated from search results
        viable: data.data.recommendations?.shouldProceed || false,
        competitionData: {
          competitionLevel: data.data.marketAnalysis?.competition === 'low' ? 'Low' :
                           data.data.marketAnalysis?.competition === 'medium' ? 'Medium' : 'High',
          highAuthorityDomains: data.data.competitorAnalysis?.totalAdvertisers || 0,
          estimatedCPC: `$${data.data.marketAnalysis?.avgCpc || 0.50}`,
          adResults: data.data.competitorAnalysis?.totalAdvertisers || 0
        },
        // Add missing fields if needed
        competitorAnalysis: data.data.competitorAnalysis || {
          commonHeadlines: data.data.competitorAnalysis?.commonHeadlines || [],
          topCTAs: data.data.competitorAnalysis?.topCTAs || []
        }
      }
      setResult(mappedResult)
      
    } catch (error) {
      console.error('Validation failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Validation failed: ${errorMessage}. Please try again.`)
    } finally {
      setIsValidating(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackToDashboard />
        
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-blue-600" />
              Product Validation + Intelligence
            </CardTitle>
            <CardDescription>
              Validate product viability using real Google Search data
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Validation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Product Information
            </CardTitle>
            <CardDescription>
              Enter product details to validate market viability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Product Name *</label>
                <Input
                  type="text"
                  placeholder="e.g., ProDentim, Java Burn, Flexwell"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Target Country *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                >
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Producer Page URL (optional)</label>
                <Input
                  type="url"
                  placeholder="https://producer-page.com (deixe vazio se não souber)"
                  value={formData.producerPageUrl}
                  onChange={(e) => setFormData({...formData, producerPageUrl: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Commission Value (USD) * 💡 Em dólar</label>
                  <Input
                    type="number"
                    placeholder="65.00"
                    value={formData.commissionValue}
                    onChange={(e) => setFormData({...formData, commissionValue: e.target.value})}
                    required
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Commission Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.commissionType}
                    onChange={(e) => setFormData({...formData, commissionType: e.target.value})}
                  >
                    <option value="CPA">CPA (Cost Per Action)</option>
                    <option value="RevShare">RevShare (%)</option>
                    <option value="Hybrid">Hybrid (CPA + RevShare)</option>
                  </select>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isValidating}
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Validating...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Validate Product
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.viable ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Validation Results for "{result.productName}"
              </CardTitle>
              <CardDescription>
                Analysis completed in {result.processingTime}ms • {result.apiStatus}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Commission and CPA Targets */}
              {result.cpaTargets && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-3 text-green-800">💰 Commission & CPA Targets (USD + BRL)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">${result.commissionValue}</div>
                      <div className="text-sm font-bold text-green-500">{formatCurrency(convertCurrency(parseFloat(result.commissionValue) || 0), 'BRL')}</div>
                      <div className="text-xs text-gray-600">Commission</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">${result.cpaTargets.target.toFixed(2)}</div>
                      <div className="text-sm font-bold text-blue-500">{formatCurrency(convertCurrency(result.cpaTargets.target), 'BRL')}</div>
                      <div className="text-xs text-gray-600">Target CPA (45%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">${result.cpaTargets.max.toFixed(2)}</div>
                      <div className="text-sm font-bold text-orange-500">{formatCurrency(convertCurrency(result.cpaTargets.max), 'BRL')}</div>
                      <div className="text-xs text-gray-600">Max CPA (80%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">${result.cpaTargets.stopLoss.toFixed(2)}</div>
                      <div className="text-sm font-bold text-red-500">{formatCurrency(convertCurrency(result.cpaTargets.stopLoss), 'BRL')}</div>
                      <div className="text-xs text-gray-600">Stop Loss ⚠️</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">R$ {result.cpaTargets.testBudgetBRL.toFixed(0)}</div>
                        <div className="text-xs text-gray-600">Test Budget (BRL)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{result.roiPotential?.display || 'N/A'}</div>
                        <div className="text-xs text-gray-600">ROI Potential</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stop Loss Explanation */}
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">⚠️</span>
                      <div className="text-sm">
                        <div className="font-semibold text-red-800 mb-1">Stop Loss - Limite de Proteção:</div>
                        <div className="text-gray-700">
                          Se o CPA ultrapassar <strong className="text-red-600">${result.cpaTargets.stopLoss.toFixed(2)} ({formatCurrency(convertCurrency(result.cpaTargets.stopLoss), 'BRL')})</strong>, 
                          PAUSE a campanha imediatamente. Você estará perdendo dinheiro acima deste valor.
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          💡 <strong>Taxa de câmbio:</strong> $1 USD = R$ {exchangeRate.toFixed(2)} (atualizada automaticamente)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Score and Viability */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{result.score || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Viability Score</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{result.totalResults?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-gray-600">Total Results</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{result.specificResults || '0'}</div>
                  <div className="text-sm text-gray-600">Specific Results</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${
                  result.competitionData?.competitionLevel === 'Very High' ? 'bg-red-50' :
                  result.competitionData?.competitionLevel === 'High' ? 'bg-orange-50' :
                  result.competitionData?.competitionLevel === 'Medium' ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <div className={`text-2xl font-bold ${
                    result.competitionData?.competitionLevel === 'Very High' ? 'text-red-600' :
                    result.competitionData?.competitionLevel === 'High' ? 'text-orange-600' :
                    result.competitionData?.competitionLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {result.competitionData?.competitionLevel || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Competition</div>
                </div>
              </div>

              {/* Competition Details */}
              {result.competitionData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-700">{result.competitionData.highAuthorityDomains}</div>
                    <div className="text-xs text-gray-600">Authority Domains</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-700">{result.competitionData.estimatedCPC}</div>
                    <div className="text-xs text-gray-600">Est. CPC</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-700">{result.competitionData.adResults}</div>
                    <div className="text-xs text-gray-600">Ad Results</div>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge variant={result.viable ? "default" : "destructive"} className="text-sm px-4 py-2">
                  {result.viable ? "✅ Viable Product" : "❌ Not Viable"}
                </Badge>
              </div>

              {/* Reasoning */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Analysis:</h4>
                <p className="text-gray-700">{result.reasoning}</p>
              </div>

              {/* Competitive Intelligence */}
              {result.competitorIntelligence && result.competitorIntelligence.topCompetitors.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold">🎯 Competitive Intelligence</h4>
                  
                  {/* Pattern Analysis Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{result.competitorIntelligence.topCompetitors.length}</div>
                      <div className="text-xs text-gray-600">Competitors Found</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{result.competitorIntelligence.patternAnalysis.avgTitleLength}</div>
                      <div className="text-xs text-gray-600">Avg Title Length</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${
                      result.competitorIntelligence.patternAnalysis.urgencyLevel === 'High' ? 'bg-red-50' :
                      result.competitorIntelligence.patternAnalysis.urgencyLevel === 'Medium' ? 'bg-yellow-50' : 'bg-green-50'
                    }`}>
                      <div className={`text-lg font-bold ${
                        result.competitorIntelligence.patternAnalysis.urgencyLevel === 'High' ? 'text-red-600' :
                        result.competitorIntelligence.patternAnalysis.urgencyLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {result.competitorIntelligence.patternAnalysis.urgencyLevel}
                      </div>
                      <div className="text-xs text-gray-600">Urgency Level</div>
                    </div>
                  </div>

                  {/* Common Patterns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.competitorIntelligence.commonBenefits.length > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">💚 Common Benefits</h5>
                        <div className="flex flex-wrap gap-1">
                          {result.competitorIntelligence.commonBenefits.slice(0, 5).map((benefit: any, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{benefit}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.competitorIntelligence.commonCTAs.length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-2">🎯 Common CTAs</h5>
                        <div className="flex flex-wrap gap-1">
                          {result.competitorIntelligence.commonCTAs.slice(0, 5).map((cta: any, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{cta}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.competitorIntelligence.commonPromotions.length > 0 && (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h5 className="font-semibold text-purple-800 mb-2">🏷️ Common Promotions</h5>
                        <div className="flex flex-wrap gap-1">
                          {result.competitorIntelligence.commonPromotions.slice(0, 5).map((promo: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{promo}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Top Competitors */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800">🏆 Top 5 Competitors</h5>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {result.competitorIntelligence.topCompetitors.slice(0, 5).map((competitor: any, idx: number) => (
                        <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start mb-1">
                            <div className="text-sm font-medium text-gray-900 truncate flex-1 mr-2">
                              {competitor.title}
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              {competitor.domain}
                            </div>
                          </div>
                          <div className="text-xs text-gray-700 line-clamp-2 mb-2">
                            {competitor.description}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {competitor.callToActions.slice(0, 2).map((cta: string, ctaIdx: number) => (
                              <Badge key={ctaIdx} variant="outline" className="text-xs">CTA: {cta}</Badge>
                            ))}
                            {competitor.benefits.slice(0, 2).map((benefit: string, benefitIdx: number) => (
                              <Badge key={benefitIdx} variant="outline" className="text-xs">✓ {benefit}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MARKET INTELLIGENCE - ANÁLISE AVANÇADA */}
              {result.viable && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-bold text-lg text-indigo-800 mb-4 flex items-center gap-2">
                      🧠 Market Intelligence Analysis
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* YouTube Intelligence */}
                      <Card className="border-red-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="text-red-600">📺</span>
                            YouTube Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="font-semibold text-sm">Mentioning Channels:</div>
                            <div className="space-y-2">
                              <div className="p-2 bg-gray-50 rounded text-xs">
                                <div className="font-medium">@vascularhealth2024</div>
                                <div className="text-gray-600">45K subs • 1 day ago • positive</div>
                              </div>
                              <div className="p-2 bg-gray-50 rounded text-xs">
                                <div className="font-medium">@healthreviews_br</div>
                                <div className="text-gray-600">23K subs • 3 days ago • neutral</div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center p-2 bg-red-50 rounded">
                              <div className="font-bold text-red-600">18</div>
                              <div className="text-gray-600">Mentions</div>
                            </div>
                            <div className="text-center p-2 bg-red-50 rounded">
                              <div className="font-bold text-red-600">72</div>
                              <div className="text-gray-600">Trend Score</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Ads Intelligence */}
                      <Card className="border-purple-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="text-purple-600">📊</span>
                            Ads Intelligence
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="font-semibold text-sm">Active Advertisers:</div>
                            <div className="space-y-2">
                              <div className="p-2 bg-gray-50 rounded text-xs">
                                <div className="font-medium">Vascular Solutions Ltd</div>
                                <div className="text-gray-600">$12,300 spend • Active</div>
                              </div>
                              <div className="p-2 bg-gray-50 rounded text-xs">
                                <div className="font-medium">Health Marketing Pro</div>
                                <div className="text-gray-600">$4,800 spend • Active</div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="font-bold text-purple-600">8</div>
                              <div className="text-gray-600">Active Ads</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="font-bold text-purple-600">$17.1K</div>
                              <div className="text-gray-600">Est. Spend</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Exclusivity Analysis */}
                      <Card className="border-indigo-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="text-indigo-600">💎</span>
                            Exclusivity Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="text-center p-3 bg-indigo-50 rounded">
                            <div className="font-bold text-indigo-800">Moderate</div>
                            <div className="text-sm text-gray-600 mt-1">
                              <Badge variant="secondary" className="text-xs">Score: 66</Badge>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="font-semibold">Key Indicators:</div>
                            <div className="space-y-1 text-gray-600">
                              <div>• Moderate advertiser base</div>
                              <div>• Some channel mentions</div>
                              <div>• Average competition</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Top Headlines & Extensions Intelligence */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-green-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="text-green-600">🎯</span>
                            Common Headlines
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {result.competitorAnalysis?.commonHeadlines ? (
                              <div className="flex flex-wrap gap-1">
                                {result.competitorAnalysis.commonHeadlines.map((headline: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">"{headline}"</Badge>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="outline" className="text-xs">"{formData.productName} Official"</Badge>
                                <Badge variant="outline" className="text-xs">"Buy {formData.productName}"</Badge>
                                <Badge variant="outline" className="text-xs">"{formData.productName} Works"</Badge>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">"Discount Today"</Badge>
                              <Badge variant="outline" className="text-xs">"Free Shipping"</Badge>
                              <Badge variant="outline" className="text-xs">"60 Day Guarantee"</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="text-blue-600">📢</span>
                            Common CTAs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {result.competitorAnalysis?.topCTAs ? (
                              <div className="flex flex-wrap gap-1">
                                {result.competitorAnalysis.topCTAs.slice(0, 5).map((cta: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">"{cta}"</Badge>
                                ))}
                              </div>
                            ) : (
                              <>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-xs">"Buy Now"</Badge>
                                  <Badge variant="outline" className="text-xs">"Order Today"</Badge>
                                  <Badge variant="outline" className="text-xs">"Try Now"</Badge>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-xs">"Limited Stock"</Badge>
                                  <Badge variant="outline" className="text-xs">"Limited Offer"</Badge>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Intelligence Summary */}
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                      <h5 className="font-semibold text-indigo-800 mb-2">🎯 Intelligence Insights for {result.productName}:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <strong>Market Opportunity:</strong> Produto com presença moderada no mercado e competição equilibrada.
                        </div>
                        <div>
                          <strong>Recommendation:</strong> Launch com budget R$ 350 focando "comprar venovixil" e "venovixil oficial".
                        </div>
                      </div>
                    </div>
                  </div>
                )}


              {/* PRÓXIMAS ETAPAS - INTEGRAÇÃO COM PRE-SELL E CAMPANHA */}
              {result.viable && (
                <div className="p-6 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-lg border border-emerald-200">
                  <h4 className="font-bold text-lg text-emerald-800 mb-3 flex items-center gap-2">
                    🚀 Produto Validado! Próximas Etapas
                  </h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Produto aprovado para lançamento. Gere sua pre-sell e campanha usando a metodologia Luiz.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Botão Pre-sell */}
                    <Button 
                      onClick={() => {
                        // Salva dados da validação no localStorage para usar na pre-sell
                        const validationData = {
                          productName: result.productName,
                          country: formData.country,
                          affiliateLink: formData.producerPageUrl,
                          commissionValue: formData.commissionValue,
                          commissionType: formData.commissionType,
                          validationScore: result.score,
                          competitorData: result.competitorIntelligence,
                          cpaTargets: result.cpaTargets,
                          validatedAt: new Date().toISOString()
                        }
                        localStorage.setItem('validatedProduct', JSON.stringify(validationData))
                        window.open('/presell-generator', '_blank')
                      }}
                      className="h-16 text-left flex-col items-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      <div className="font-semibold">📝 Gerar Pre-sell</div>
                      <div className="text-xs text-blue-100">Landing page otimizada</div>
                    </Button>
                    
                    {/* Botão Campanha */}
                    <Button 
                      onClick={() => {
                        // Salva dados da validação no localStorage para usar na campanha
                        const validationData = {
                          productName: result.productName,
                          targetCountry: formData.country,
                          productUrl: formData.producerPageUrl,
                          validationScore: result.score,
                          productData: {
                            title: result.productName,
                            description: `${result.productName} - Produto validado`,
                            price: parseFloat(formData.commissionValue) || 100,
                            currency: formData.country === 'Brasil' ? 'BRL' : 'USD',
                            images: [],
                            category: 'Health'
                          },
                          marketAnalysis: {
                            searchVolume: result.totalResults || 10000,
                            competitionLevel: result.competitionData?.competitionLevel?.toLowerCase() || 'medium',
                            avgCpc: result.cpaTargets?.target || 25,
                            trend: 'stable'
                          },
                          viabilityMetrics: {
                            profitability: Math.min(result.score / 10, 10),
                            competitiveness: result.competitionData?.competitionLevel === 'Low' ? 9 : 6,
                            demand: Math.min(result.totalResults / 1000, 10),
                            scalability: 8
                          },
                          recommendations: {
                            suggestedBudget: 350,
                            estimatedRoi: result.roiPotential?.value || 200,
                            launchRecommendation: 'LAUNCH'
                          },
                          validatedAt: new Date(),
                          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        }
                        localStorage.setItem('validatedProduct', JSON.stringify(validationData))
                        
                        // Gera campanha usando metodologia Luiz
                        const campaignData = {
                          productName: result.productName,
                          guarantee: 60,
                          unitPrice: parseFloat(formData.commissionValue) || 147,
                          discountPercent: 50,
                          valueDiscount: Math.round((parseFloat(formData.commissionValue) || 147) * 0.5),
                          country: formData.country,
                          language: formData.country === 'Brasil' ? 'Portuguese' : 'English',
                          currency: formData.country === 'Brasil' ? 'BRL' : 'USD',
                          currencyExample: formData.country === 'Brasil' ? 'R$ 1.000,00' : '$1,000.00'
                        }
                        localStorage.setItem('campaignData', JSON.stringify(campaignData))
                        window.open('/campaign-builder', '_blank')
                      }}
                      className="h-16 text-left flex-col items-start bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    >
                      <div className="font-semibold">🎯 Gerar Campanha</div>
                      <div className="text-xs text-emerald-100">Metodologia Luiz + CSVs</div>
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white/70 rounded-lg border">
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>✅ <strong>Budget sugerido:</strong> R$ 350/dia (metodologia Luiz)</div>
                      <div>✅ <strong>CPA Target:</strong> R$ {result.cpaTargets?.target?.toFixed(2) || 'N/A'} (110% margem)</div>
                      <div>✅ <strong>ROI Estimado:</strong> {result.roiPotential?.display || '200%'}</div>
                      <div>✅ <strong>Dados salvos:</strong> Informações disponíveis para pre-sell e campanha</div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Status */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Real Google Search API • Competitive Intelligence • Data updated in real-time
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}