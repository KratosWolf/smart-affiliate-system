"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductValidationRequest, ProductValidationResponse } from '@/types'

export default function ProductValidationForm() {
  const [formData, setFormData] = useState<ProductValidationRequest>({
    productUrl: '',
    targetCountry: 'Brasil',
    budget: 1000,
    niche: ''
  })
  
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<ProductValidationResponse | null>(null)
  const [error, setError] = useState<string>('')
  
  // Presell generation state
  const [isGeneratingPresell, setIsGeneratingPresell] = useState(false)
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [presellGenerated, setPresellGenerated] = useState(false)
  const [presellData, setPresellData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/v1/validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Erro na validação do produto')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error('Validation error:', err)
    } finally {
      setIsValidating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'VIÁVEL'
    if (score >= 60) return 'MODERADO'
    return 'NÃO VIÁVEL'
  }

  const handleGeneratePresell = async () => {
    if (!result || !affiliateUrl) return

    setIsGeneratingPresell(true)
    setError('')

    try {
      const response = await fetch('/api/v1/presell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validation: result,
          affiliateUrl: affiliateUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        setPresellData(data.data)
        setPresellGenerated(true)
      } else {
        setError(data.error || 'Erro na geração da presell')
      }
    } catch (err) {
      setError('Erro ao gerar presell')
      console.error('Presell generation error:', err)
    } finally {
      setIsGeneratingPresell(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Sistema Inteligente para Afiliados
        </h1>
        <p className="text-gray-600">
          Validação automática de produtos + Geração de campanhas otimizadas
        </p>
        <div className="text-sm text-blue-600 font-medium">
          📈 Filosofia: Teste barato → Validação rápida → Scaling inteligente
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔍 Validação de Produto
          </CardTitle>
          <CardDescription>
            Valide a viabilidade do seu produto para campanhas bottom-funnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Flexwell, Colágeno Premium..."
                  value={formData.productUrl}
                  onChange={(e) => setFormData({...formData, productUrl: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País Alvo *
                </label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.targetCountry}
                  onChange={(e) => setFormData({...formData, targetCountry: e.target.value})}
                >
                  <option value="Brasil">🇧🇷 Brasil</option>
                  <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                  <option value="Portugal">🇵🇹 Portugal</option>
                  <option value="Alemanha">🇩🇪 Alemanha</option>
                  <option value="França">🇫🇷 França</option>
                  <option value="Espanha">🇪🇸 Espanha</option>
                  <option value="Polônia">🇵🇱 Polônia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orçamento de Teste (opcional)
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                />
                <p className="text-xs text-gray-500 mt-1">Orçamento inicial para teste da campanha</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nicho (opcional)
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Saúde, Beleza, Fitness..."
                  value={formData.niche}
                  onChange={(e) => setFormData({...formData, niche: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold"
              disabled={isValidating || !formData.productUrl}
            >
              {isValidating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  🔍 Validando produto...
                </div>
              ) : (
                '🚀 VALIDAR PRODUTO E GERAR CAMPANHA'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading States */}
      {isValidating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ⏳ Validando viabilidade no Google local...
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="rounded-full h-4 w-4 bg-gray-200"></div>
                ⏳ Analisando página do produtor...
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="rounded-full h-4 w-4 bg-gray-200"></div>
                ⏳ Pesquisando concorrência ativa...
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="rounded-full h-4 w-4 bg-gray-200"></div>
                ⏳ Gerando presell otimizada...
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="rounded-full h-4 w-4 bg-gray-200"></div>
                ⏳ Criando campanha de teste...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-700">
              ❌ <strong>Erro:</strong> {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✅ RESULTADO DA VALIDAÇÃO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score */}
            <div className="text-center">
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${getScoreColor(result.validationScore)}`}>
                🎯 {result.validationScore}% {getScoreLabel(result.validationScore)}
              </div>
              <p className="text-gray-600 mt-2">Score de Viabilidade Bottom-Funnel</p>
            </div>

            {/* Viability Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.viabilityMetrics.demandScore}%
                </div>
                <div className="text-sm text-blue-700 font-medium">Demanda</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {result.viabilityMetrics.competitionScore}%
                </div>
                <div className="text-sm text-green-700 font-medium">Competição</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {result.viabilityMetrics.profitabilityScore}%
                </div>
                <div className="text-sm text-purple-700 font-medium">Lucro</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {result.viabilityMetrics.difficultyScore}%
                </div>
                <div className="text-sm text-orange-700 font-medium">Dificuldade</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${result.recommendations.shouldProceed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className={`font-semibold ${result.recommendations.shouldProceed ? 'text-green-800' : 'text-red-800'}`}>
                  {result.recommendations.shouldProceed ? '✅ RECOMENDAÇÃO: Prosseguir com campanha teste' : '❌ RECOMENDAÇÃO: Produto não viável'}
                </div>
                <div className="mt-2 text-sm space-y-1">
                  <p><strong>ROI Estimado:</strong> {result.recommendations.estimatedRoi}%</p>
                  <p><strong>Orçamento Sugerido:</strong> R$ {result.recommendations.suggestedBudget}</p>
                  <p><strong>Nível de Risco:</strong> {result.recommendations.riskLevel.toUpperCase()}</p>
                </div>
              </div>

              {/* Insights */}
              {result.recommendations.keyInsights.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Insights Principais:</h4>
                  <ul className="space-y-1">
                    {result.recommendations.keyInsights.map((insight, index) => (
                      <li key={index} className="text-sm text-blue-700">• {insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Competitor Analysis (NEW!) */}
              {result.competitorAnalysis && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">🔍 Análise de Concorrência Google Ads:</h4>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Anunciantes Ativos:</strong> {result.competitorAnalysis.totalAdvertisers}</p>
                    {result.competitorAnalysis.topAdvertisers.length > 0 && (
                      <p><strong>Top Anunciantes:</strong> {result.competitorAnalysis.topAdvertisers.join(', ')}</p>
                    )}
                    {result.competitorAnalysis.commonHeadlines.length > 0 && (
                      <div>
                        <strong>Headlines Mais Usadas:</strong>
                        <ul className="mt-1 ml-4">
                          {result.competitorAnalysis.commonHeadlines.slice(0, 3).map((headline, idx) => (
                            <li key={idx} className="text-xs">• "{headline}"</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p><strong>Posição Média dos Ads:</strong> {result.competitorAnalysis.avgAdPosition.toFixed(1)}</p>
                    {result.competitorAnalysis.dominantStrategies.length > 0 && (
                      <div>
                        <strong>Estratégias para se Destacar:</strong>
                        <ul className="mt-1 ml-4">
                          {result.competitorAnalysis.dominantStrategies.map((strategy, idx) => (
                            <li key={idx} className="text-xs">• {strategy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.recommendations.warnings.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Atenções:</h4>
                  <ul className="space-y-1">
                    {result.recommendations.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-yellow-700">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {result.recommendations.shouldProceed && (
              <div className="space-y-4 pt-4 border-t">
                {!presellGenerated && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de Afiliado *
                      </label>
                      <Input
                        type="url"
                        placeholder="https://go.hotmart.com/abc123"
                        value={affiliateUrl}
                        onChange={(e) => setAffiliateUrl(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">URL para onde o usuário será direcionado para compra</p>
                    </div>
                    
                    <Button 
                      onClick={handleGeneratePresell}
                      className="w-full h-12 text-lg font-semibold"
                      disabled={isGeneratingPresell || !affiliateUrl}
                    >
                      {isGeneratingPresell ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          🌐 Gerando presell otimizada...
                        </div>
                      ) : (
                        '🌐 GERAR PRESELL OTIMIZADA'
                      )}
                    </Button>
                  </div>
                )}
                
                {presellGenerated && (
                  <div className="flex gap-4">
                    <Button className="flex-1">
                      👁️ VISUALIZAR PRESELL
                    </Button>
                    <Button variant="outline" className="flex-1">
                      ⬇️ DOWNLOAD COMPLETO
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Presell Generation Progress */}
      {isGeneratingPresell && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                🎨 Analisando produto e extraindo informações...
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="rounded-full h-4 w-4 bg-gray-200"></div>
                🌍 Detectando idioma e moeda do país alvo...
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="rounded-full h-4 w-4 bg-gray-200"></div>
                📝 Gerando copy otimizada para conversão...
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="rounded-full h-4 w-4 bg-gray-200"></div>
                📱 Criando HTML responsivo + CSS + JS...
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="rounded-full h-4 w-4 bg-gray-200"></div>
                🎯 Configurando tracking e otimizações...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Presell Generated Results */}
      {presellGenerated && presellData && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌐 PRESELL GERADA COM SUCESSO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Generation Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ✅
                </div>
                <div className="text-sm text-green-700 font-medium">HTML Responsivo</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  📱
                </div>
                <div className="text-sm text-blue-700 font-medium">Mobile First</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  🎯
                </div>
                <div className="text-sm text-purple-700 font-medium">SEO Otimizado</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  📊
                </div>
                <div className="text-sm text-orange-700 font-medium">Tracking Ready</div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Detalhes da Presell:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Idioma:</strong> {presellData.metadata.language}</p>
                <p><strong>Moeda:</strong> {presellData.metadata.currency}</p>
                <p><strong>Countdown:</strong> {presellData.metadata.countdownEnabled ? 'Ativo' : 'Desabilitado'}</p>
                <p><strong>Social Proof:</strong> {presellData.metadata.socialProofEnabled ? 'Ativo' : 'Desabilitado'}</p>
                <p><strong>Gerado em:</strong> {new Date(presellData.metadata.generatedAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {/* Preview Link */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🔗 URL da Presell:</h4>
              <div className="text-sm text-gray-600">
                <code className="bg-white px-2 py-1 rounded border">
                  https://presells.smart-affiliate.com/{presellData.productName.toLowerCase().replace(/\s+/g, '-')}.html
                </code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1">
                👁️ VISUALIZAR PRESELL
              </Button>
              <Button variant="outline" className="flex-1">
                ⬇️ DOWNLOAD ARQUIVOS
              </Button>
              <Button variant="outline" className="flex-1">
                📋 COPIAR CÓDIGO
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}