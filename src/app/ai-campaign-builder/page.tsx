'use client'

/**
 * 🤖 AI CAMPAIGN BUILDER - INTERFACE LIMPA
 * Sistema novo e limpo para gerar campanhas Google Ads via AI
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COUNTRIES_LIST } from '@/lib/constants/countries-languages'
import { Download, Loader2, Sparkles } from 'lucide-react'

interface FormData {
  productName: string
  countryCode: string
  platform: string
  commissionValue: string
  commissionCurrency: string
  baseUrl: string
}

interface CampaignResponse {
  success: boolean
  campaign: any
  csvFiles: Record<string, string>
  metadata: any
}

export default function AICampaignBuilder() {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    countryCode: '',
    platform: 'DR Cash',
    commissionValue: '',
    commissionCurrency: 'USD',
    baseUrl: ''
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CampaignResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      console.log('🚀 Generating campaign with:', formData)

      const response = await fetch('/api/v1/ai-campaign-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      setResult(data)
      console.log('✅ Campaign generated:', data)

    } catch (err) {
      console.error('❌ Generation failed:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${formData.productName}_${filename}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAllCSVs = () => {
    if (!result?.csvFiles) return

    Object.entries(result.csvFiles).forEach(([type, content]) => {
      downloadCSV(type, content)
    })
  }

  const isFormValid = formData.productName && formData.countryCode && formData.platform && formData.commissionValue && formData.baseUrl

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Campaign Builder</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistema limpo que gera campanhas Google Ads em qualquer idioma usando 100% inteligência artificial.
            Sem fallbacks complexos, sem problemas de tradução.
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">🇭🇺 Húngaro</Badge>
            <Badge variant="secondary">🇩🇪 Alemão</Badge>
            <Badge variant="secondary">🇪🇸 Espanhol</Badge>
            <Badge variant="secondary">🇵🇱 Polonês</Badge>
          </div>
        </div>

        {/* Formulário */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎯 Configuração da Campanha</CardTitle>
            <CardDescription>
              Preencha os dados básicos para gerar uma campanha Google Ads otimizada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome do Produto */}
              <div className="space-y-2">
                <Label htmlFor="productName">Nome do Produto *</Label>
                <Input
                  id="productName"
                  placeholder="ex: Rectin"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                />
              </div>

              {/* País */}
              <div className="space-y-2">
                <Label>País de Targeting *</Label>
                <Select onValueChange={(value) => handleInputChange('countryCode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES_LIST.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.language})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Plataforma */}
              <div className="space-y-2">
                <Label>Plataforma de Afiliado *</Label>
                <Select
                  defaultValue="DR Cash"
                  onValueChange={(value) => handleInputChange('platform', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DR Cash">💰 DR Cash</SelectItem>
                    <SelectItem value="ClickBank">🏪 ClickBank</SelectItem>
                    <SelectItem value="HotMart">🔥 HotMart</SelectItem>
                    <SelectItem value="Outro">📦 Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comissão */}
              <div className="space-y-2">
                <Label htmlFor="commission">Valor da Comissão *</Label>
                <div className="flex gap-2">
                  <Input
                    id="commission"
                    placeholder="30"
                    value={formData.commissionValue}
                    onChange={(e) => handleInputChange('commissionValue', e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    defaultValue="USD"
                    onValueChange={(value) => handleInputChange('commissionCurrency', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="BRL">BRL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* URL Base */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="baseUrl">URL Base *</Label>
                <Input
                  id="baseUrl"
                  placeholder="https://0z15y.doctormurin.com/l"
                  value={formData.baseUrl}
                  onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                />
              </div>
            </div>

            {/* Botão Gerar */}
            <div className="pt-4">
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando Campanha AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Gerar Campanha Google Ads
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Erro */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-800">
                <strong>❌ Erro:</strong> {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultado */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">✅ Campanha Gerada com Sucesso!</CardTitle>
              <CardDescription>
                <strong>{result.campaign.name}</strong> - {result.metadata.headlinesCount} headlines, {result.metadata.descriptionsCount} descriptions, {result.metadata.sitelinksCount} sitelinks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(result.csvFiles).map(([type, content]) => (
                  <Button
                    key={type}
                    variant="outline"
                    onClick={() => downloadCSV(type, content)}
                    className="h-16 flex-col"
                  >
                    <Download className="h-4 w-4 mb-1" />
                    <span className="text-xs">{type}.csv</span>
                  </Button>
                ))}
              </div>

              <Button onClick={downloadAllCSVs} className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Baixar Todos os CSVs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}