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

export default function CampaignBuilderClient() {
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
    
    if (validatedProduct) {
      try {
        const data = JSON.parse(validatedProduct)
        setCampaignData(prev => ({
          ...prev,
          productName: data.productName || '',
          targetCountry: data.targetCountry || 'US',
          platform: data.platform || 'CLICKBANK',
          commissionValue: data.commissionPercentage || 100
        }))
        
        // Limpa dados após usar (evita conflito)
        localStorage.removeItem('validatedProduct')
        
        // Mostra alerta de sucesso
        console.log('✅ Dados da validação carregados automaticamente!')
        
      } catch (error) {
        console.error('Erro ao carregar dados da validação:', error)
      }
    } else if (savedCampaignData) {
      try {
        const data = JSON.parse(savedCampaignData)
        setCampaignData(data)
        
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
    if (!campaignData.productName || !campaignData.finalUrl) {
      alert('Por favor, preencha o nome do produto e a URL final da campanha')
      return
    }

    setIsGenerating(true)
    
    try {
      // Adaptar dados para API (ainda espera affiliateUrl)
      const apiData = {
        ...campaignData,
        affiliateUrl: campaignData.finalUrl, // Mapeia finalUrl para affiliateUrl
        presellUrl: campaignData.finalUrl // Usa a mesma URL
      }
      
      const response = await fetch('/api/v1/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        // Salva a campanha completa
        setGeneratedCampaign(result.data?.campaign || result.data || result)
        // Muda para aba de campanha
        setTimeout(() => {
          setActiveTab('campaign')
          alert('✅ Campanha gerada! Use a aba "Exportar" para baixar os CSVs do Google Ads.')
        }, 100)
      } else {
        alert(result.error || 'Erro ao gerar campanha. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro na geração:', error)
      alert('Erro ao conectar com o servidor. Verifique sua conexão.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copiado para a área de transferência!')
  }

  const downloadJSON = () => {
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
                      onChange={(e) => handleInputChange('commissionValue', parseFloat(e.target.value) || 0)}
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
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">🎯 Metodologia Luiz</h4>
                      <p className="text-sm text-blue-700">
                        Sistema automatizado baseado nas melhores práticas de campaigns de afiliados de sucesso.
                        Usa estrutura 1 campanha = 1 ad, orçamento fixo R$ 350, e otimização baseada em 3 dias de dados.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={generateCampaign}
                    disabled={isGenerating || !campaignData.productName || !campaignData.finalUrl}
                    className="px-8 py-3 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Gerando Campanha...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        🚀 Gerar Campanha Google Ads
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generated Campaign Tab */}
          <TabsContent value="campaign" className="mt-6">
            {generatedCampaign && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Campanha Gerada com Sucesso!
                    </CardTitle>
                    <CardDescription>
                      Revise os detalhes da sua campanha antes de exportar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">📊 Informações da Campanha</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Nome:</span> {generatedCampaign.campaign.name}
                        </div>
                        <div>
                          <span className="font-medium">Orçamento:</span> ${generatedCampaign.campaign.budget}/dia
                        </div>
                        <div>
                          <span className="font-medium">CPA Alvo:</span> ${generatedCampaign.campaign.targetCpa}
                        </div>
                        <div>
                          <span className="font-medium">País:</span> {generatedCampaign.campaign.locations.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">🔑 Palavras-chave ({generatedCampaign.keywords.length})</h3>
                      <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                        {generatedCampaign.keywords.map((kw, i) => (
                          <div key={i} className="text-sm py-1 border-b last:border-0">
                            {kw.keyword} [{kw.matchType}] - CPC: ${kw.maxCpc}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">📝 Anúncios ({generatedCampaign.ads.length})</h3>
                      {generatedCampaign.ads.map((ad, i) => (
                        <Card key={i} className="mb-3">
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-sm">Headlines:</span>
                                <div className="text-sm text-gray-600">{ad.headlines.join(' | ')}</div>
                              </div>
                              <div>
                                <span className="font-medium text-sm">Descriptions:</span>
                                <div className="text-sm text-gray-600">{ad.descriptions.join(' | ')}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Exportar Campanha
                </CardTitle>
                <CardDescription>
                  Baixe os arquivos prontos para importar no Google Ads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">📥 Download dos Arquivos</h3>
                  <div className="space-y-3">
                    <Button onClick={downloadCSVs} className="w-full" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      📊 Baixar CSVs para Google Ads
                    </Button>
                    <Button onClick={downloadJSON} variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      💾 Baixar JSON (Backup)
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">📚 Guia de Importação</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                    <li>Acesse sua conta Google Ads</li>
                    <li>Vá em Ferramentas → Upload em massa</li>
                    <li>Faça upload dos CSVs baixados</li>
                    <li>Revise e aplique as mudanças</li>
                    <li>Ative a campanha e monitore por 3 dias</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Próximos Passos</h3>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Monitorar performance após 3 dias</li>
                    <li>• Se ROI maior que 2.0, aumentar budget para R$ 1750</li>
                    <li>• Se ROI menor que 1.5, pausar e testar outro produto</li>
                    <li>• Usar tracking Edis para análise detalhada</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}