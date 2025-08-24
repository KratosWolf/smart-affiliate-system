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
              <div className="flex gap-4 pt-4 border-t">
                <Button className="flex-1">
                  📊 VER DETALHES COMPLETOS
                </Button>
                <Button variant="outline" className="flex-1">
                  ⬇️ DOWNLOAD TUDO
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}