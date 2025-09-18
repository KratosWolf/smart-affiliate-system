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
import { getCurrencyForCountry, formatCurrency } from '@/lib/constants/currencies'

import { CampaignParams } from '@/lib/types'

interface CampaignData extends Omit<CampaignParams, 'targetCpa'> {
  dailyBudget: number
  targetCpa: string // Changed from number to string to match CampaignParams
  platform?: string
  commissionValue?: number
  currency?: string
  useEdisTracking?: boolean
  edisBaseUrl?: string
  // Metodologia Luiz - Preços e descontos
  productPrice?: number
  pack3Price?: number
  pack5Price?: number
  // Informações contextuais
  guaranteePeriod?: string
  returnPolicy?: string
  deliveryType?: string
  targetCity?: string
  bonuses?: string
  scarcityType?: string
  // Campos calculados (legado)
  discountPercentage?: number
  discountAmount?: number
}

function CampaignBuilderContainer() {
  const { campaign, isLoading, error, isSuccess, generateCampaign, clearError, safeAccess } = useCampaignBuilder()
  // Form state that matches CampaignForm expectations
  type CampaignFormState = Omit<CampaignParams, 'targetCpa'> & {
    dailyBudget: number
    targetCpa: number  // Override to number for form inputs
    platform?: string
    commissionValue?: number
    currency?: string
    useEdisTracking?: boolean
    edisBaseUrl?: string
    // Metodologia Luiz - Preços e descontos
    productPrice?: number
    packQuantity?: number
    packTotalPrice?: number
    // Informações contextuais
    guaranteePeriod?: string
    returnPolicy?: string
    deliveryType?: string
    targetCity?: string
    excludedRegions?: string
    bonuses?: string
    scarcityType?: string
    // Campos calculados (legado)
    discountPercentage?: number
    discountAmount?: number
  }

  const [campaignData, setCampaignData] = useState<CampaignFormState>({
    productName: '',
    targetCountry: 'BR',
    budgetRange: '350',
    targetCpa: 45,  // Fixed: number instead of string
    dailyBudget: 350,
    platform: 'SMARTADV',
    commissionValue: 100,
    currency: 'USD',
    useEdisTracking: true,
    edisBaseUrl: 'www.test.com',
    description: '',
    // Required fields
    urlBase: '',
    campaignType: 'Standard',
    // Metodologia Luiz - Campos do produto
    productPrice: undefined,
    packQuantity: undefined,
    packTotalPrice: undefined,
    guaranteePeriod: '',
    returnPolicy: '',
    deliveryType: '',
    targetCity: '',
    excludedRegions: '',
    bonuses: '',
    scarcityType: '',
    // Campos calculados (legado)
    discountPercentage: undefined,
    discountAmount: undefined
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

  // React to campaign generation success
  useEffect(() => {
    if (isSuccess && campaign) {
      setActiveTab('campaign')
      alert('✅ Campanha gerada! Use a aba "Campanha Gerada" para ver os detalhes e "Exportar" para baixar os CSVs do Google Ads.')
    }
  }, [isSuccess, campaign])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setCampaignData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-detect currency when country changes
      if (field === 'targetCountry') {
        const detectedCurrency = getCurrencyForCountry(value as string)
        updated.currency = detectedCurrency
        console.log(`🌍 País alterado para ${value}, moeda detectada: ${detectedCurrency}`)
      }
      
      // Recalcula valores automaticamente
      if (field === 'commissionValue' || field === 'currency' || field === 'targetCountry') {
        // CPA Alvo = 45% da comissão
        updated.targetCpa = Math.round((updated.commissionValue || 100) * 0.45 * 100) / 100
        
        // Orçamento mínimo baseado na moeda
        const getMinBudgetForCurrency = (currency: string): number => {
          switch (currency) {
            case 'BRL': return 350  // Brazil Real - R$ 350
            case 'PLN': return 280  // Polish Zloty - 280 zł
            case 'EUR': return 65   // Euro - €65
            case 'GBP': return 55   // British Pound - £55
            case 'CAD': return 95   // Canadian Dollar - C$95
            case 'AUD': return 105  // Australian Dollar - A$105
            case 'MXN': return 1400 // Mexican Peso - $1400
            case 'USD': 
            default: return 70      // US Dollar - $70 (default)
          }
        }
        const minBudget = getMinBudgetForCurrency(updated.currency || 'USD')
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

    console.log('🎯 Gerando campanha com dados:', {
      productName: campaignData.productName,
      targetCountry: campaignData.targetCountry,
      discountPercentage: campaignData.discountPercentage,
      guaranteePeriod: campaignData.guaranteePeriod,
      deliveryType: campaignData.deliveryType
    })

    clearError()
    
    try {
      await generateCampaign({
        productName: campaignData.productName,
        targetCountry: campaignData.targetCountry,
        budgetRange: campaignData.budgetRange,
        targetCpa: String(campaignData.targetCpa),
        description: campaignData.description,
        // Required fields
        urlBase: campaignData.urlBase,
        campaignType: campaignData.campaignType,
        // Core campaign fields
        platform: campaignData.platform,
        commissionValue: campaignData.commissionValue,
        // Campos contextuais da Fase 1
        discountPercentage: campaignData.discountPercentage,
        discountAmount: campaignData.discountAmount,
        productPrice: campaignData.productPrice,
        guaranteePeriod: campaignData.guaranteePeriod,
        deliveryType: campaignData.deliveryType
      })
      
      // Força atualização da interface
      console.log('✅ Campanha gerada com sucesso!')
      
    } catch (err) {
      console.error('❌ Erro na geração da campanha:', err)
    }
  }

  // Generate sample CSV content based on campaign data
  const generateSampleCSV = (csvType: string): string => {
    const productName = campaignData.productName || 'Sample Product'
    const budget = campaignData.dailyBudget || 350
    const targetCpa = campaignData.targetCpa || 33
    
    switch (csvType) {
      case 'campaignStructure':
        return `Campaign,Status,Budget,Target CPA,Locations
${productName} - ${campaignData.targetCountry} - Teste CPA,Active,${budget},${targetCpa},"${campaignData.targetCountry}"`
      
      case 'keywords':
        return `Keyword,Match Type,Status,Max CPC
${productName.toLowerCase()},Broad,Active,2.50
${productName.toUpperCase()},Broad,Active,2.50`
      
      case 'ads':
        return `Headline,Description,Status
${productName} + Online Store,Order ${productName} Here On Website With 90 Days Guarantee. Best Value Pack 100/Bottle Now,Active
${productName} Order Now,Buy ${productName} Today & Get $780 Off With 90-Days Money Back Guarantee + Free Shipping,Active
${productName} Buy Now,${productName}: #1 Voted Product. 100% Pure & Natural With Free U.S Shipping.,Active
${productName} Special Offer,Get ${productName} Now For Over 50% Off and Free Prompt Delivery! Don't Miss Out On Savings,Active
${productName} Save up to 50%,You Can Try ${productName} For 90Days With Your Money Back Guarantee Get It Before It's Gone,Active
${productName} Official Store,Official ${productName} Website - Order Now With 90 Day Money Back Guarantee,Active
${productName} Best Price,${productName} Best Price Online - Save Up To 50% Today Only Limited Time Offer,Active
${productName} Half Price,Get ${productName} For Half Price Today - Limited Stock Available Order Before It's Gone,Active
${productName} Free Shipping,${productName} With Free Shipping Worldwide - 90 Day Money Back Guarantee Included,Active
${productName} Discount Code,Use Discount Code For ${productName} - Save $780 On Your Order Today Limited Time,Active
${productName} Limited Offer,${productName} Limited Time Offer - Get 3 Bottles For The Price Of 1 Free Shipping,Active
${productName} Reviews,${productName} Reviews: #1 Rated Product - Over 10000 Happy Customers Worldwide,Active
${productName} Guarantee,${productName} 90 Day Money Back Guarantee - Risk Free Trial Order Your Supply Today,Active
${productName} Fast Delivery,${productName} Fast Delivery Worldwide - Order Now And Receive In 3-5 Business Days,Active
${productName} Natural Formula,${productName} 100% Natural Formula - Clinically Proven Results Order Risk Free Today,Active`
      
      case 'sitelinks':
        return `Sitelink Text,Status
Where to Buy ${productName},Active
${productName} is Only Available for,Active
Purchase On Website,Active
Half Price Offer,Active
Big Sale in Progress,Active
Get 50% Off,Active`
      
      case 'callouts':
        return `Callout Text,Status
Only $49 per Bottle Today,Active
Save Up to $780,Active
Half Price Offer,Active
Best Offer Guarantee,Active
${productName} Order Now,Active
Free Private Shipping,Active
100% Organic & Natural,Active`
      
      case 'snippets':
        return `Snippet Text,Category,Status
Half Price Offer,Savings,Active
Save Big Order Now,Savings,Active
Free Private Delivery,Delivery,Active
90Days Money Back,Guarantee,Active
Limited-Time Offer,Scarcity,Active
Get It Now,CTA,Active`
      
      default:
        return `Data,Status
Sample Data,Active`
    }
  }

  // CSV Download functions
  const downloadCSV = (csvType: string, filename: string) => {
    try {
      console.log('🔍 Generating CSV for type:', csvType)
      
      let csvContent: string
      
      // Debug: Log campaign structure
      console.log('🔍 CAMPAIGN OBJECT:', JSON.stringify(campaign, null, 2))
      console.log('🔍 CSV TYPE REQUESTED:', csvType)
      console.log('🔍 AVAILABLE CSV KEYS:', campaign?.csvData ? Object.keys(campaign.csvData) : 'NO csvData')
      
      // Use real campaign data if available, otherwise fallback to sample  
      // Based on API structure: response.data.csvData[csvType]
      const realCsvData = campaign?.csvData?.[csvType]
      
      if (realCsvData) {
        console.log('✅ Using real campaign CSV data')
        csvContent = realCsvData
      } else {
        console.log('⚠️ Using fallback sample CSV data - real CSV data not found')
        console.log('⚠️ Campaign structure:', {
          hasCampaign: !!campaign,
          campaignKeys: campaign ? Object.keys(campaign) : 'No campaign',
          hasCsvData: !!campaign?.csvData,
          csvDataKeys: campaign?.csvData ? Object.keys(campaign.csvData) : 'No csvData',
          requestedType: csvType
        })
        csvContent = generateSampleCSV(csvType)
      }
      
      // Add product name prefix to filename
      const productPrefix = campaignData.productName ? `${campaignData.productName.replace(/[^a-zA-Z0-9]/g, '')}_` : ''
      const finalFilename = `${productPrefix}${filename}`
      
      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(csvBlob)
      downloadLink.download = finalFilename
      downloadLink.click()
      URL.revokeObjectURL(downloadLink.href)
      
      console.log(`✅ Downloaded ${finalFilename}`)
    } catch (error) {
      console.error('Erro ao baixar CSV:', error)
      alert('Erro ao baixar arquivo CSV')
    }
  }

  const downloadAllCSVsAsZip = async () => {
    if (!campaign || !campaignData.productName) {
      alert('❌ Nenhuma campanha disponível para download')
      return
    }

    try {
      // Dynamic import do JSZip
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      
      const productName = campaignData.productName.replace(/[^a-zA-Z0-9]/g, '')
      
      const filesToDownload = [
        { type: 'campaignStructure', name: 'Estrutura_Campanha.csv' },
        { type: 'keywords', name: 'Keywords.csv' },
        { type: 'ads', name: 'Anuncios.csv' },
        { type: 'sitelinks', name: 'Sitelinks.csv' },
        { type: 'callouts', name: 'Callouts.csv' },
        { type: 'snippets', name: 'Snippets.csv' }
      ]
      
      // Adiciona cada arquivo CSV ao ZIP
      filesToDownload.forEach(file => {
        const realCsvData = campaign?.csvData?.[file.type]
        let csvContent = ''
        
        if (realCsvData) {
          csvContent = realCsvData
        } else {
          csvContent = generateSampleCSV(file.type)
        }
        
        const finalFilename = `${productName}_${file.name}`
        zip.file(finalFilename, csvContent)
      })
      
      // Gera e baixa o ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const zipUrl = window.URL.createObjectURL(zipBlob)
      
      const link = document.createElement('a')
      link.href = zipUrl
      link.download = `${productName}_GoogleAds_Campaign.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(zipUrl)
      
      alert(`📦 ZIP baixado: ${productName}_GoogleAds_Campaign.zip`)
      
    } catch (error) {
      console.error('Erro ao criar ZIP:', error)
      alert('❌ Erro ao criar arquivo ZIP')
    }
  }

  const downloadAllCSVs = () => {
    try {
      console.log('🎯 Starting download of all CSVs with product prefix')
      
      const files = [
        { type: 'campaignStructure', name: 'Estrutura_Campanha.csv' },
        { type: 'keywords', name: 'Keywords.csv' },
        { type: 'ads', name: 'Anuncios.csv' },
        { type: 'sitelinks', name: 'Sitelinks.csv' },
        { type: 'callouts', name: 'Callouts.csv' },
        { type: 'snippets', name: 'Snippets.csv' }
      ]

      // Download each file with proper naming and real data
      files.forEach((file, index) => {
        setTimeout(() => downloadCSV(file.type, file.name), index * 300) // Slightly longer delay
      })

      const productName = campaignData.productName || 'Produto'
      alert(`📦 Iniciando downloads dos CSVs para ${productName}! Verifique a pasta de Downloads.`)
      
    } catch (error) {
      console.error('Erro ao baixar todos os CSVs:', error)
      alert('Erro ao iniciar downloads')
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
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-600" />
                    Exportar Campanha para Google Ads
                  </CardTitle>
                  <CardDescription>
                    Baixe os arquivos CSV prontos para importar no Google Ads Editor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaign ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">📋 Como usar os CSVs:</h3>
                        <ol className="text-sm space-y-1 text-blue-700">
                          <li>1. Baixe todos os arquivos CSV abaixo</li>
                          <li>2. Abra o Google Ads Editor</li>
                          <li>3. Vá em "Conta" → "Importar" → "Do arquivo"</li>
                          <li>4. Importe os CSVs na seguinte ordem:</li>
                          <li className="ml-4">• Primeiro: Estrutura da Campanha</li>
                          <li className="ml-4">• Segundo: Keywords</li>
                          <li className="ml-4">• Terceiro: Anúncios</li>
                          <li className="ml-4">• Por último: Extensions (Sitelinks, Callouts, Snippets)</li>
                          <li>5. Revise tudo e publique!</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          onClick={() => downloadCSV('campaignStructure', 'Estrutura_Campanha.csv')}
                          className="flex items-center gap-2 h-12"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Estrutura da Campanha
                        </Button>
                        
                        <Button 
                          onClick={() => downloadCSV('keywords', 'Keywords.csv')}
                          className="flex items-center gap-2 h-12"
                          variant="outline"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Keywords
                        </Button>
                        
                        <Button 
                          onClick={() => downloadCSV('ads', 'Anuncios.csv')}
                          className="flex items-center gap-2 h-12"
                          variant="outline"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Anúncios
                        </Button>
                        
                        <Button 
                          onClick={() => downloadCSV('sitelinks', 'Sitelinks.csv')}
                          className="flex items-center gap-2 h-12"
                          variant="outline"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Sitelinks
                        </Button>
                        
                        <Button 
                          onClick={() => downloadCSV('callouts', 'Callouts.csv')}
                          className="flex items-center gap-2 h-12"
                          variant="outline"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Callouts
                        </Button>
                        
                        <Button 
                          onClick={() => downloadCSV('snippets', 'Snippets.csv')}
                          className="flex items-center gap-2 h-12"
                          variant="outline"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Snippets
                        </Button>
                      </div>

                      <div className="border-t pt-4">
                        <Button 
                          onClick={downloadAllCSVsAsZip}
                          className="w-full flex items-center gap-2 h-12 bg-green-600 hover:bg-green-700"
                        >
                          <Download className="w-4 h-4" />
                          📦 Baixar ZIP Completo
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Gere uma campanha primeiro para poder exportar os CSVs</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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