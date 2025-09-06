'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BackToDashboard from '@/components/BackToDashboard'
import { BarChart3 } from 'lucide-react'
import { ErrorBoundary } from '@/lib/errors/ErrorBoundary'
import { useCampaignBuilder } from '@/hooks/useCampaignBuilder'
import { ErrorDisplay } from '@/components/shared/ErrorDisplay'
import { CampaignForm } from '@/components/campaign/CampaignForm'
import { CampaignDisplay } from '@/components/campaign/CampaignDisplay'

import { CampaignParams } from '@/lib/types'

interface CampaignData extends CampaignParams {
  dailyBudget: number
  targetCpa: number
  platform?: string
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

function CampaignBuilderContainer() {
  const { campaign, isLoading, error, generateCampaign, clearError, safeAccess } = useCampaignBuilder()
  const [campaignData, setCampaignData] = useState<CampaignData>({
    productName: '',
    targetCountry: 'US',
    budgetRange: '350',
    targetCpa: '45',
    dailyBudget: 350,
    platform: 'SMARTADV',
    commissionValue: 100,
    currency: 'USD',
    useEdisTracking: true,
    edisBaseUrl: 'www.test.com',
    description: ''
  })
  
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null)
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

  const handleGenerateCampaign = async () => {
    if (!campaignData.productName) {
      alert('Por favor, preencha o nome do produto')
      return
    }

    clearError()
    
    try {
      await generateCampaign({
        productName: campaignData.productName,
        targetCountry: campaignData.targetCountry,
        budgetRange: campaignData.budgetRange,
        targetCpa: campaignData.targetCpa.toString(),
        description: campaignData.description
      })
      
      // Se sucesso, mover para aba de campanha
      if (campaign) {
        setActiveTab('campaign')
        alert('✅ Campanha gerada! Use a aba "Exportar" para baixar os CSVs do Google Ads.')
      }
    } catch (err) {
      // Error já tratado pelo hook
      console.error('Campaign generation failed:', err)
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
            <TabsTrigger value="campaign" disabled={!campaign}>📊 Campanha Gerada</TabsTrigger>
            <TabsTrigger value="export" disabled={!campaign}>📤 Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6">
            {error && (
              <ErrorDisplay 
                error={error} 
                onRetry={clearError}
                className="mb-6" 
              />
            )}
            <CampaignForm
              campaignData={campaignData}
              onInputChange={handleInputChange}
              onSubmit={handleGenerateCampaign}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="campaign" className="mt-6">
            {campaign && (
              <CampaignDisplay 
                campaign={campaign}
                safeAccess={safeAccess}
              />
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

          {/* Export Tab */}
          <TabsContent value="export" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Campanha</CardTitle>
                <CardDescription>
                  Funcionalidade de exportação será implementada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function CampaignBuilderClient() {
  return (
    <ErrorBoundary>
      <CampaignBuilderContainer />
    </ErrorBoundary>
  )
}