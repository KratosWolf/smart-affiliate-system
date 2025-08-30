"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Search, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ValidationPage() {
  const [formData, setFormData] = useState({
    productName: '',
    country: 'Brasil',
    affiliateLink: '',
    commissionValue: '',
    commissionType: 'CPA'
  })
  
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

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
      console.log('🔍 Validating product via API:', formData.productName)
      
      const response = await fetch('/api/validate-product', {
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
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Validation failed')
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Validation was not successful')
      }
      
      setResult(data.data)
      
    } catch (error) {
      console.error('Validation failed:', error)
      setError('Failed to validate product. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const countries = [
    { code: 'Brasil', flag: '🇧🇷' },
    { code: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'Canadá', flag: '🇨🇦' },
    { code: 'Reino Unido', flag: '🇬🇧' },
    { code: 'Austrália', flag: '🇦🇺' },
    { code: 'Alemanha', flag: '🇩🇪' },
    { code: 'França', flag: '🇫🇷' },
    { code: 'Espanha', flag: '🇪🇸' },
    { code: 'Portugal', flag: '🇵🇹' },
    { code: 'Itália', flag: '🇮🇹' },
    { code: 'Holanda', flag: '🇳🇱' },
    { code: 'Argentina', flag: '🇦🇷' },
    { code: 'Chile', flag: '🇨🇱' },
    { code: 'México', flag: '🇲🇽' }
  ]

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-blue-600" />
              Product Validation
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
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Affiliate Link (optional)</label>
                <Input
                  type="url"
                  placeholder="https://your-affiliate-link.com"
                  value={formData.affiliateLink}
                  onChange={(e) => setFormData({...formData, affiliateLink: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Commission Value ($) *</label>
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
                  <h4 className="font-semibold mb-3 text-green-800">💰 Commission & CPA Targets</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">${result.commissionValue}</div>
                      <div className="text-xs text-gray-600">Commission</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">${result.cpaTargets.target.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Target CPA (45%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">${result.cpaTargets.max.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Max CPA (80%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">${result.cpaTargets.stopLoss.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Stop Loss</div>
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
                          {result.competitorIntelligence.commonPromotions.slice(0, 5).map((promo, idx) => (
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
                      {result.competitorIntelligence.topCompetitors.slice(0, 5).map((competitor, idx) => (
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
                            {competitor.callToActions.slice(0, 2).map((cta, ctaIdx) => (
                              <Badge key={ctaIdx} variant="outline" className="text-xs">CTA: {cta}</Badge>
                            ))}
                            {competitor.benefits.slice(0, 2).map((benefit, benefitIdx) => (
                              <Badge key={benefitIdx} variant="outline" className="text-xs">✓ {benefit}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
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