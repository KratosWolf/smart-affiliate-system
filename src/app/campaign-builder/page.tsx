'use client'

import { useState, useEffect } from 'react'
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
import { COUNTRY_OPTIONS } from '@/lib/constants/countries'
import { PLATFORM_OPTIONS } from '@/lib/constants/platforms'

interface CampaignData {
  productName: string
  finalUrl: string // URL única - presell OU página do produtor
  targetCountry: string
  dailyBudget: number // calculado automaticamente
  targetCpa: number // calculado automaticamente
  platform?: 'CLICKBANK' | 'BUYGOODS' | 'MAXWEB' | 'GURUMIDIA' | 'SMARTADV' | 'DIGISTORE24' | 'ADCOMBO' | 'DRCASH' | 'MIDIA_SCALERS' | 'SMASH_LOUD'
  commissionValue?: number
  currency?: 'BRL' | 'USD'
  useEdisTracking?: boolean
  edisBaseUrl?: string
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
    finalUrl: '',
    targetCountry: 'US',
    dailyBudget: 350, // será calculado automaticamente
    targetCpa: 45, // será calculado automaticamente  
    platform: 'SMARTADV',
    commissionValue: 100,
    currency: 'USD',
    useEdisTracking: true,
    edisBaseUrl: 'www.test.com'
  })
  
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('setup')

  // Cálculo automático do orçamento e CPA
  const calculateBudgetAndCpa = (commissionValue: number, currency: string) => {
    // Orçamento mínimo baseado na moeda
    const minBudget = currency === 'BRL' ? 350 : 70
    const suggestedBudget = Math.max(minBudget, commissionValue * 3.5) // 3.5x da comissão
    
    // CPA alvo: 45% da comissão
    const targetCpa = Math.round(commissionValue * 0.45)
    
    return { suggestedBudget: Math.round(suggestedBudget), targetCpa }
  }

  // Carrega dados da validação quando a página carrega
  useEffect(() => {
    const validatedProduct = localStorage.getItem('validatedProduct')
    const savedCampaignData = localStorage.getItem('campaignData')
    
    if (validatedProduct && savedCampaignData) {
      try {
        const validation = JSON.parse(validatedProduct)
        const campaign = JSON.parse(savedCampaignData)
        
        // Preenche o formulário automaticamente com TODOS os dados necessários
        setCampaignData({
          productName: validation.productName || campaign.productName,
          affiliateUrl: validation.affiliateLink || '',
          presellUrl: '', // Pre-sell será separada
          producerPageUrl: validation.productUrl || '', // URL da página do produtor
          targetCountry: validation.targetCountry || validation.country || 'Brasil',
          dailyBudget: 350, // Metodologia Luiz - fixo R$ 350
          targetCpa: validation.cpaTargets?.target || campaign.unitPrice * 0.3 * 1.1 || 25,
          platform: validation.platform || 'CLICKBANK',
          commissionValue: validation.expectedCommission || 100,
          currency: 'BRL',
          useEdisTracking: true,
          edisBaseUrl: 'www.test.com'
        })
        
        // Limpa dados após usar (evita conflito)
        localStorage.removeItem('validatedProduct')
        localStorage.removeItem('campaignData')
        
        // Mostra alerta de sucesso
        console.log('✅ Dados da validação carregados automaticamente!')
        
      } catch (error) {
        console.error('Erro ao carregar dados da validação:', error)
      }
    }
  }, [])


  const handleInputChange = (field: keyof CampaignData, value: string | number) => {
    setCampaignData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Recalcula valores automaticamente
      if (field === 'commissionValue' || field === 'currency') {
        // CPA Alvo = 45% da comissão
        updated.targetCpa = (updated.commissionValue || 100) * 0.45
        
        // Orçamento mínimo baseado na moeda
        const minBudget = updated.currency === 'BRL' ? 350 : 70
        if (!updated.dailyBudget || updated.dailyBudget < minBudget) {
          updated.dailyBudget = minBudget
        }
      }
      
      return updated
    })
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

  const downloadCSVs = async () => {
    if (!generatedCampaign) return
    
    try {
      const response = await fetch('/api/v1/campaign/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedCampaign)
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Download each CSV file
        Object.entries(result.files).forEach(([key, file]: [string, any]) => {
          const blob = new Blob([file.content], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = file.filename
          link.click()
          
          // Small delay between downloads
          setTimeout(() => URL.revokeObjectURL(url), 100)
        })
        
        alert('✅ CSVs baixados! Siga o guia de importação para Google Ads.')
      }
    } catch (error) {
      console.error('Error downloading CSVs:', error)
      alert('Erro ao gerar CSVs. Tente novamente.')
    }
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
                      Plataforma de Afiliado *
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={campaignData.platform}
                      onChange={(e) => handleInputChange('platform', e.target.value)}
                    >
                      {PLATFORM_OPTIONS.map(platform => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor da Comissão *
                    </label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={campaignData.commissionValue}
                      onChange={(e) => handleInputChange('commissionValue', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moeda da Conta Google Ads
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={campaignData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="BRL">🇧🇷 Real (BRL)</option>
                      <option value="USD">🇺🇸 Dólar (USD)</option>
                    </select>
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
                      {COUNTRY_OPTIONS.map(country => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Final da Campanha * 
                      <span className="text-blue-600 text-xs ml-2">(Para onde vai o tráfego do Google Ads)</span>
                    </label>
                    <Input
                      placeholder="https://sua-presell.com OU https://hop.clickbank.net/your-link"
                      value={campaignData.finalUrl}
                      onChange={(e) => handleInputChange('finalUrl', e.target.value)}
                      className="text-lg"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                      <div className="bg-green-50 p-2 rounded border">
                        <span className="font-medium text-green-700">✅ Se tem presell:</span>
                        <br />Use a URL da sua presell (mais conversão)
                      </div>
                      <div className="bg-blue-50 p-2 rounded border">  
                        <span className="font-medium text-blue-700">📄 Se não tem presell:</span>
                        <br />Use o link de afiliado direto
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-3">💰 Cálculos Automáticos (Regras do Sistema)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-yellow-700 mb-2">
                          Orçamento Diário Calculado
                        </label>
                        <Input
                          type="number"
                          value={campaignData.dailyBudget}
                          disabled
                          className="bg-yellow-100 text-yellow-800 font-semibold"
                        />
                        <p className="text-xs text-yellow-600 mt-1">
                          📊 Fórmula: Máximo entre {campaignData.currency === 'BRL' ? 'R$350' : '$70'} (mínimo) ou 3.5x da comissão
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-yellow-700 mb-2">
                          CPA Alvo Calculado (45% da comissão)
                        </label>
                        <Input
                          type="number"
                          value={campaignData.targetCpa}
                          disabled
                          className="bg-yellow-100 text-yellow-800 font-semibold"
                        />
                        <p className="text-xs text-yellow-600 mt-1">
                          🎯 45% de {campaignData.currency === 'BRL' ? 'R$' : '$'}{campaignData.commissionValue || 100} = {campaignData.currency === 'BRL' ? 'R$' : '$'}{campaignData.targetCpa}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EDIS Tracking Section */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-semibold text-green-800">📊 Tracking Edis</h4>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={campaignData.useEdisTracking}
                        onChange={(e) => handleInputChange('useEdisTracking', e.target.checked)}
                        className="rounded border-green-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-green-700">Ativar tracking</span>
                    </label>
                  </div>
                  
                  {campaignData.useEdisTracking && (
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">
                        URL Base do Edis
                      </label>
                      <Input
                        placeholder="www.test.com"
                        value={campaignData.edisBaseUrl}
                        onChange={(e) => handleInputChange('edisBaseUrl', e.target.value)}
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                      <p className="text-xs text-green-600 mt-1">
                        URLs finais terão: {campaignData.edisBaseUrl}?campaignid={'{campaignid}'}&keyword={'{keyword}'}&network={'{network}'}&extensionid={'{extensionid}'}&matchtype={'{matchtype}'}&adgroupid={'{adgroupid}'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">🎯 Metodologia Luiz - Especificações</h4>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>• <strong>Nome:</strong> [Produto] - [País] - [Data] - [Plataforma] - [Comissão]</li>
                        <li>• <strong>Orçamento:</strong> Mínimo R$ 350/dia (ou $70 para contas USD)</li>
                        <li>• <strong>CPA Alvo:</strong> 40-50% da comissão (45% padrão)</li>
                        <li>• <strong>Estratégia:</strong> Target CPA (confirmado)</li>
                        <li>• <strong>Rede:</strong> Google Search (SEM Parceiros, SEM Display)</li>
                        <li>• <strong>Público:</strong> Não restrito a novos clientes</li>
                        <li>• <strong>Primeira Headline:</strong> {'{KeyWord:[PRODUTO] Online Store}'}</li>
                        <li>• <strong>Exclusões:</strong> Brasil, Índia, Vietnã, Indonésia, China, Nigéria, Rússia, Venezuela, Colômbia</li>
                        <li>• <strong>Keywords:</strong> Nome do produto em MAIÚSCULA e minúscula (Broad Match)</li>
                        <li>• <strong>Headlines:</strong> Checadas com página do produtor</li>
                        <li>• <strong>Extensões:</strong> Selecionadas com inteligência baseada no produto</li>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={downloadCSVs} 
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" />
                      📥 CSVs para Google Ads
                    </Button>
                    
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
                          targetCountry: 'US',
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