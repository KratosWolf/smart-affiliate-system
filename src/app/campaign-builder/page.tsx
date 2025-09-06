'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BackToDashboard from '@/components/BackToDashboard'
import { BarChart3, Download } from 'lucide-react'
import { ErrorBoundary } from '@/lib/errors/ErrorBoundary'
import { useCampaignBuilder } from '@/hooks/useCampaignBuilder'
import { ErrorDisplay } from '@/components/shared/ErrorDisplay'
import { CampaignForm } from '@/components/campaign/CampaignForm'
import { CampaignDisplay } from '@/components/campaign/CampaignDisplay'
import { COUNTRY_OPTIONS } from '@/lib/constants/countries'
import { PLATFORM_OPTIONS } from '@/lib/constants/platforms'

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
  
  const [activeTab, setActiveTab] = useState('setup')

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
        
        localStorage.removeItem('validatedProduct')
        console.log('✅ Dados da validação carregados automaticamente!')
        
      } catch (error) {
        console.error('Erro ao carregar dados da validação:', error)
      }
    } else if (savedCampaignData) {
      try {
        const data = JSON.parse(savedCampaignData)
        setCampaignData({ ...campaignData, ...data })
        localStorage.removeItem('validatedProduct')
        localStorage.removeItem('campaignData')
        console.log('✅ Dados da validação carregados automaticamente!')
        
      } catch (error) {
        console.error('Erro ao carregar dados da validação:', error)
      }
    }
  }, [])

  const handleInputChange = (field: string, value: string | number | boolean) => {
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
      console.error('Campaign generation failed:', err)
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