'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import BackToDashboard from '@/components/BackToDashboard'
import { 
  BarChart3, 
  Target, 
  Globe, 
  DollarSign, 
  Zap, 
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface CampaignData {
  productName: string
  affiliateUrl: string
  presellUrl?: string
  targetCountry: string
  dailyBudget: number
  targetCpa: number
}

interface GeneratedCampaign {
  campaign: {
    name: string
    budget: number
    currency: string
    locations: string[]
    languages: string[]
    biddingStrategy: string
    targetCpa?: number
  }
  keywords: Array<{
    keyword: string
    matchType: string
    maxCpc: number
    finalUrl: string
  }>
  ads: Array<{
    headlines: string[]
    descriptions: string[]
    finalUrl: string
    displayUrl: string
  }>
  extensions: Array<{
    type: string
    text: string
    url?: string
  }>
  metadata: {
    productName: string
    country: string
    estimatedCpa: number
    generatedAt: string
  }
}

export default function CampaignBuilderPage() {
  const [campaignData, setCampaignData] = useState<CampaignData>({
    productName: '',
    affiliateUrl: '',
    presellUrl: '',
    targetCountry: 'Brasil',
    dailyBudget: 50,
    targetCpa: 25
  })
  
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('setup')

  const countries = [
    { code: 'Brasil', flag: '🇧🇷' },
    { code: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'Alemanha', flag: '🇩🇪' },
    { code: 'França', flag: '🇫🇷' },
    { code: 'Espanha', flag: '🇪🇸' },
    { code: 'Portugal', flag: '🇵🇹' },
    { code: 'Polônia', flag: '🇵🇱' }
  ]

  const handleInputChange = (field: keyof CampaignData, value: string | number) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateCampaign = async () => {
    if (!campaignData.productName || !campaignData.affiliateUrl) {
      alert('Por favor, preencha pelo menos o nome do produto e URL de afiliado')
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/v1/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setGeneratedCampaign(result.data.campaign)
          setActiveTab('campaign')
        } else {
          throw new Error(result.error || 'Erro ao gerar campanha')
        }
      } else {
        throw new Error('Erro ao gerar campanha')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar campanha. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copiado para a área de transferência!')
  }

  const downloadCampaign = () => {
    if (!generatedCampaign) return
    
    const dataStr = JSON.stringify(generatedCampaign, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `campaign-${generatedCampaign.metadata.productName.toLowerCase()}.json`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <BackToDashboard />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">📊 Campaign Builder</h1>
          </div>
          <p className="text-xl text-gray-600">Google Ads campaigns automáticas com targeting inteligente • CPA optimization • Multi-geo support</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">🔧 Setup Campanha</TabsTrigger>
            <TabsTrigger value="campaign" disabled={!generatedCampaign}>📊 Campanha Gerada</TabsTrigger>
            <TabsTrigger value="export" disabled={!generatedCampaign}>📤 Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  Configuração da Campanha
                </CardTitle>
                <CardDescription>
                  Configure os dados básicos para gerar uma campanha Google Ads otimizada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Produto *
                    </label>
                    <Input
                      placeholder="Ex: GlicoShield, NerveCalm, Leptitox"
                      value={campaignData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País de Targeting
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={campaignData.targetCountry}
                      onChange={(e) => handleInputChange('targetCountry', e.target.value)}
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Afiliado *
                    </label>
                    <Input
                      placeholder="https://hop.clickbank.net/your-link"
                      value={campaignData.affiliateUrl}
                      onChange={(e) => handleInputChange('affiliateUrl', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Presell (Opcional)
                    </label>
                    <Input
                      placeholder="https://sua-presell.com"
                      value={campaignData.presellUrl}
                      onChange={(e) => handleInputChange('presellUrl', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orçamento Diário ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={campaignData.dailyBudget}
                      onChange={(e) => handleInputChange('dailyBudget', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPA Alvo ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={campaignData.targetCpa}
                      onChange={(e) => handleInputChange('targetCpa', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">💡 Dicas para Melhores Resultados</h4>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>• Use presells para aumentar conversões e reduzir CPA</li>
                        <li>• CPA alvo deve ser máximo 60% da comissão do produto</li>
                        <li>• Orçamento mínimo recomendado: $30/dia para teste inicial</li>
                        <li>• Para produtos internacionais, teste países com menor concorrência</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={generateCampaign}
                    disabled={isGenerating || !campaignData.productName || !campaignData.affiliateUrl}
                    className="px-8 py-3 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Gerando Campanha...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Gerar Campanha Google Ads
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaign" className="mt-6">
            {generatedCampaign && (
              <div className="space-y-6">
                {/* Campaign Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Campanha Gerada: {generatedCampaign.campaign.name}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        CPA: ${generatedCampaign.campaign.targetCpa}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Orçamento Diário:</span>
                        <p className="font-semibold">{generatedCampaign.campaign.currency} {generatedCampaign.campaign.budget}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Estratégia:</span>
                        <p className="font-semibold">{generatedCampaign.campaign.biddingStrategy}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Localização:</span>
                        <p className="font-semibold">{generatedCampaign.campaign.locations[0]}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Idioma:</span>
                        <p className="font-semibold">{generatedCampaign.campaign.languages[0]}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle>🔍 Palavras-chave ({generatedCampaign.keywords.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {generatedCampaign.keywords.map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{keyword.keyword}</span>
                            <Badge className="ml-2 text-xs">{keyword.matchType}</Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Max CPC: ${keyword.maxCpc.toFixed(2)}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(keyword.keyword)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Ads */}
                <Card>
                  <CardHeader>
                    <CardTitle>📝 Anúncios Gerados ({generatedCampaign.ads.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedCampaign.ads.map((ad, adIndex) => (
                      <div key={adIndex} className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="mb-3">
                            <h4 className="font-semibold text-green-700 mb-2">📱 Preview do Anúncio</h4>
                            <div className="bg-white border border-gray-200 rounded p-3 max-w-md">
                              <p className="text-blue-600 text-sm">{ad.displayUrl}</p>
                              <div className="space-y-1 mt-1">
                                {ad.headlines.map((headline, hIndex) => (
                                  <p key={hIndex} className="font-medium text-gray-900">{headline}</p>
                                ))}
                              </div>
                              <div className="space-y-1 mt-2">
                                {ad.descriptions.map((desc, dIndex) => (
                                  <p key={dIndex} className="text-sm text-gray-700">{desc}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <h5 className="font-medium mb-2">Headlines:</h5>
                              <ul className="space-y-1">
                                {ad.headlines.map((headline, hIndex) => (
                                  <li key={hIndex} className="text-sm flex items-center justify-between">
                                    <span>{headline}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(headline)}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">Descriptions:</h5>
                              <ul className="space-y-1">
                                {ad.descriptions.map((desc, dIndex) => (
                                  <li key={dIndex} className="text-sm flex items-center justify-between">
                                    <span>{desc}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(desc)}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Extensions */}
                <Card>
                  <CardHeader>
                    <CardTitle>⚡ Extensões ({generatedCampaign.extensions.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {generatedCampaign.extensions.map((extension, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <Badge className="text-xs mb-1">{extension.type}</Badge>
                            <p className="font-medium">{extension.text}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(extension.text)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="export" className="mt-6">
            {generatedCampaign && (
              <Card>
                <CardHeader>
                  <CardTitle>📤 Exportar Campanha</CardTitle>
                  <CardDescription>
                    Baixe ou copie os dados da campanha para importar no Google Ads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={downloadCampaign} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download JSON
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(generatedCampaign, null, 2))}
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar JSON
                    </Button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">📋 Próximos Passos</h4>
                    <ol className="text-sm text-yellow-800 space-y-1">
                      <li>1. Baixe o arquivo JSON da campanha</li>
                      <li>2. Acesse o Google Ads Editor ou interface web</li>
                      <li>3. Crie uma nova campanha usando os dados gerados</li>
                      <li>4. Configure o tracking de conversões</li>
                      <li>5. Inicie com orçamento baixo para testes</li>
                      <li>6. Monitor performance e otimize com base nos resultados</li>
                    </ol>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={() => {
                        setActiveTab('setup')
                        setGeneratedCampaign(null)
                        setCampaignData({
                          productName: '',
                          affiliateUrl: '',
                          presellUrl: '',
                          targetCountry: 'Brasil',
                          dailyBudget: 50,
                          targetCpa: 25
                        })
                      }}
                      variant="outline"
                    >
                      🔄 Nova Campanha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}