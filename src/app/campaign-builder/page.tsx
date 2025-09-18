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

  // Generate multilingual fallback CSV content
  const generateSampleCSV = (csvType: string): string => {
    const productName = campaignData.productName || 'Sample Product'
    const platform = campaignData.platform || 'DR Cash'
    const commissionValue = campaignData.commissionValue || 30
    const currency = 'USD' // Force USD for commission currency in fallback
    const convertedBudget = currency === 'USD' && campaignData.dailyBudget >= 100 ?
      Math.round(campaignData.dailyBudget / 5.4) : campaignData.dailyBudget
    const targetCpa = campaignData.targetCpa || 33

    // Get language for target country using dynamic mapping
    const targetCountry = campaignData.targetCountry || 'US'
    const getLanguageTemplates = (country: string) => {
      switch (country) {
        case 'HU': // Hungarian
          return {
            headlines: [
              `${productName} Eredeti`, `Vásároljon ${productName}`, `${productName} Hivatalos`,
              `Legjobb Ár ${productName}`, `${productName} Kedvezmény`, `Ajánlat ${productName}`,
              `${productName} Gyors`, `${productName} Akció`, `Hivatalos ${productName}`,
              `${productName} Most`, `${productName} Olcsón`, `${productName} Garancia`,
              `${productName} Ingyen`, `Eredeti ${productName}`, `${productName} Szállítás`
            ],
            descriptions: [
              `${productName} eredeti termék 30 napos garanciával. Ingyenes szállítás!`,
              `Vásároljon ${productName} most! Exkluzív kedvezmény csak ma.`,
              `Hivatalos ${productName} weboldal. Garantált eredmény 90 nap.`,
              `${productName} legjobb ár online. Gyors szállítás Magyarországon.`
            ],
            sitelinks: [
              'Rólunk', 'Hogyan Működik', 'Előnyök', 'Vásárlás Most',
              'Garancia', 'Hivatalos Oldal', 'Gyors Szállítás', 'Legjobb Ár'
            ],
            callouts: [
              'Ingyenes Szállítás', 'Gyors Szállítás', 'Hivatalos Oldal', 'Legjobb Ár',
              'Exkluzív Kedvezmény', '30 Napos Garancia', '24 órás Támogatás'
            ]
          }
        case 'PL': // Polish
          return {
            headlines: [
              `${productName} Oryginalny`, `Kup ${productName}`, `${productName} Oficjalny`,
              `Najlepsza Cena ${productName}`, `${productName} ze Zniżką`, `Oferta ${productName}`,
              `${productName} Szybko`, `${productName} Promocja`, `Oficjalny ${productName}`,
              `${productName} Teraz`, `${productName} Tanio`, `${productName} Gwarancja`,
              `${productName} Gratis`, `Oryginalny ${productName}`, `${productName} Dostawa`
            ],
            descriptions: [
              `${productName} oryginalny produkt z 30-dniową gwarancją. Darmowa dostawa!`,
              `Kup ${productName} teraz! Ekskluzywna zniżka tylko dziś.`,
              `Oficjalna strona ${productName}. Gwarantowane efekty przez 90 dni.`,
              `${productName} najlepsza cena online. Szybka dostawa w Polsce.`
            ],
            sitelinks: [
              'O Nas', 'Jak Działa', 'Korzyści', 'Kup Teraz',
              'Gwarancja', 'Oficjalna Strona', 'Szybka Dostawa', 'Najlepsza Cena'
            ],
            callouts: [
              'Darmowa Dostawa', 'Szybka Dostawa', 'Oficjalna Strona', 'Najlepsza Cena',
              'Ekskluzywna Zniżka', '30 Dni Gwarancji', '24h Wsparcie'
            ]
          }
        case 'DE': // German
          return {
            headlines: [
              `${productName} Original`, `${productName} Kaufen`, `${productName} Offiziell`,
              `Bester Preis ${productName}`, `${productName} Rabatt`, `${productName} Angebot`,
              `${productName} Schnell`, `${productName} Aktion`, `Offiziell ${productName}`,
              `${productName} Jetzt`, `${productName} Günstig`, `${productName} Garantie`,
              `${productName} Kostenlos`, `Original ${productName}`, `${productName} Versand`
            ],
            descriptions: [
              `${productName} original mit 30-Tage-Garantie. Kostenloser Versand!`,
              `${productName} jetzt kaufen! Exklusiver Rabatt nur heute.`,
              `Offizielle ${productName} Website. Garantierte Ergebnisse 90 Tage.`,
              `${productName} bester Preis online. Schneller Versand in Deutschland.`
            ],
            sitelinks: [
              'Über Uns', 'Wie Es Funktioniert', 'Vorteile', 'Jetzt Kaufen',
              'Garantie', 'Offizielle Seite', 'Schneller Versand', 'Bester Preis'
            ],
            callouts: [
              'Kostenloser Versand', 'Schneller Versand', 'Offizielle Seite', 'Bester Preis',
              'Exklusiver Rabatt', '30 Tage Garantie', '24h Support'
            ]
          }
        case 'ES': case 'MX': case 'AR': case 'CO': case 'CL': case 'PE': // Spanish
          return {
            headlines: [
              `${productName} Original`, `Comprar ${productName}`, `${productName} Oficial`,
              `Mejor Precio ${productName}`, `${productName} con Descuento`, `Oferta ${productName}`,
              `${productName} Rápido`, `${productName} Promoción`, `Oficial ${productName}`,
              `${productName} Ahora`, `${productName} Barato`, `${productName} Garantía`,
              `${productName} Gratis`, `Original ${productName}`, `${productName} Envío`
            ],
            descriptions: [
              `${productName} original con garantía de 30 días. ¡Envío gratis!`,
              `¡Compra ${productName} ahora! Descuento exclusivo solo hoy.`,
              `Sitio oficial de ${productName}. Resultados garantizados 90 días.`,
              `${productName} mejor precio online. Envío rápido en España.`
            ],
            sitelinks: [
              'Sobre Nosotros', 'Cómo Funciona', 'Beneficios', 'Comprar Ahora',
              'Garantía', 'Sitio Oficial', 'Envío Rápido', 'Mejor Precio'
            ],
            callouts: [
              'Envío Gratis', 'Envío Rápido', 'Sitio Oficial', 'Mejor Precio',
              'Descuento Exclusivo', '30 Días Garantía', 'Soporte 24h'
            ]
          }
        case 'FR': // French
          return {
            headlines: [
              `${productName} Original`, `Acheter ${productName}`, `${productName} Officiel`,
              `Meilleur Prix ${productName}`, `${productName} Remise`, `Offre ${productName}`,
              `${productName} Rapide`, `${productName} Promotion`, `Officiel ${productName}`,
              `${productName} Maintenant`, `${productName} Pas Cher`, `${productName} Garantie`,
              `${productName} Gratuit`, `Original ${productName}`, `${productName} Livraison`
            ],
            descriptions: [
              `${productName} original avec garantie 30 jours. Livraison gratuite!`,
              `Achetez ${productName} maintenant! Remise exclusive aujourd'hui seulement.`,
              `Site officiel ${productName}. Résultats garantis 90 jours.`,
              `${productName} meilleur prix en ligne. Livraison rapide en France.`
            ],
            sitelinks: [
              'À Propos', 'Comment Ça Marche', 'Avantages', 'Acheter Maintenant',
              'Garantie', 'Site Officiel', 'Livraison Rapide', 'Meilleur Prix'
            ],
            callouts: [
              'Livraison Gratuite', 'Livraison Rapide', 'Site Officiel', 'Meilleur Prix',
              'Remise Exclusive', '30 Jours Garantie', 'Support 24h'
            ]
          }
        case 'IT': // Italian
          return {
            headlines: [
              `${productName} Originale`, `Comprare ${productName}`, `${productName} Ufficiale`,
              `Miglior Prezzo ${productName}`, `${productName} Sconto`, `Offerta ${productName}`,
              `${productName} Veloce`, `${productName} Promozione`, `Ufficiale ${productName}`,
              `${productName} Adesso`, `${productName} Economico`, `${productName} Garanzia`,
              `${productName} Gratis`, `Originale ${productName}`, `${productName} Spedizione`
            ],
            descriptions: [
              `${productName} originale con garanzia 30 giorni. Spedizione gratuita!`,
              `Compra ${productName} adesso! Sconto esclusivo solo oggi.`,
              `Sito ufficiale ${productName}. Risultati garantiti 90 giorni.`,
              `${productName} miglior prezzo online. Spedizione veloce in Italia.`
            ],
            sitelinks: [
              'Chi Siamo', 'Come Funziona', 'Vantaggi', 'Comprare Adesso',
              'Garanzia', 'Sito Ufficiale', 'Spedizione Veloce', 'Miglior Prezzo'
            ],
            callouts: [
              'Spedizione Gratuita', 'Spedizione Veloce', 'Sito Ufficiale', 'Miglior Prezzo',
              'Sconto Esclusivo', '30 Giorni Garanzia', 'Supporto 24h'
            ]
          }
        case 'BR': // Portuguese Brazil
          return {
            headlines: [
              `${productName} Original`, `Comprar ${productName}`, `${productName} Oficial`,
              `Melhor Preço ${productName}`, `${productName} com Desconto`, `Oferta ${productName}`,
              `${productName} Rápido`, `${productName} Promoção`, `Oficial ${productName}`,
              `${productName} Agora`, `${productName} Barato`, `${productName} Garantia`,
              `${productName} Grátis`, `Original ${productName}`, `${productName} Entrega`
            ],
            descriptions: [
              `${productName} original com garantia de 30 dias. Frete grátis!`,
              `Compre ${productName} agora! Desconto exclusivo só hoje.`,
              `Site oficial ${productName}. Resultados garantidos 90 dias.`,
              `${productName} melhor preço online. Entrega rápida no Brasil.`
            ],
            sitelinks: [
              'Sobre Nós', 'Como Funciona', 'Benefícios', 'Comprar Agora',
              'Garantia', 'Site Oficial', 'Entrega Rápida', 'Melhor Preço'
            ],
            callouts: [
              'Frete Grátis', 'Entrega Rápida', 'Site Oficial', 'Melhor Preço',
              'Desconto Exclusivo', '30 Dias Garantia', 'Suporte 24h'
            ]
          }
        default: // English fallback
          return {
            headlines: [
              `${productName} Original`, `Buy ${productName}`, `${productName} Official`,
              `Best Price ${productName}`, `${productName} Discount`, `${productName} Offer`,
              `${productName} Fast`, `${productName} Sale`, `Official ${productName}`,
              `${productName} Now`, `${productName} Cheap`, `${productName} Guarantee`,
              `${productName} Free`, `Original ${productName}`, `${productName} Shipping`
            ],
            descriptions: [
              `${productName} original with 30-day guarantee. Free shipping!`,
              `Buy ${productName} now! Exclusive discount today only.`,
              `Official ${productName} website. Guaranteed results 90 days.`,
              `${productName} best price online. Fast shipping worldwide.`
            ],
            sitelinks: [
              'About Us', 'How It Works', 'Benefits', 'Buy Now',
              'Guarantee', 'Official Site', 'Fast Shipping', 'Best Price'
            ],
            callouts: [
              'Free Shipping', 'Fast Shipping', 'Official Site', 'Best Price',
              'Exclusive Discount', '30 Day Guarantee', '24h Support'
            ]
          }
      }
    }

    const templates = getLanguageTemplates(targetCountry)

    switch (csvType) {
      case 'campaignStructure':
        const campaignName = `${productName} - ${targetCountry} - ${platform} - ${currency}${commissionValue}`
        return `Campaign,Status,Budget,Target CPA,Locations
${campaignName},Active,${convertedBudget},${targetCpa},"${targetCountry}"`

      case 'keywords':
        return `Keyword,Match Type,Status,Max CPC
${productName.toLowerCase()},Broad,Active,2.50
${productName.toUpperCase()},Broad,Active,2.50`

      case 'headlines':
        const headlinesText = templates.headlines.map(headline => `${headline},Active`).join('\n')
        return `Headline,Status\n${headlinesText}`

      case 'descriptions':
        const descriptionsText = templates.descriptions.map(description => `${description},Active`).join('\n')
        return `Description,Status\n${descriptionsText}`

      case 'ads':
        const adsText = templates.headlines.slice(0, 4).map((headline, index) =>
          `${headline},${templates.descriptions[index]},Active`
        ).join('\n')
        return `Headline,Description,Status\n${adsText}`

      case 'sitelinks':
        const sitelinksText = templates.sitelinks.map(sitelink => `${sitelink},Active`).join('\n')
        return `Sitelink Text,Status\n${sitelinksText}`

      case 'callouts':
        const calloutsText = templates.callouts.map(callout => `${callout},Active`).join('\n')
        return `Callout Text,Status\n${calloutsText}`

      case 'snippets':
        const snippetsText = templates.callouts.slice(0, 6).map((snippet, index) => {
          const categories = ['Information', 'Price', 'Delivery', 'Quality', 'Offer', 'Support']
          return `${snippet},${categories[index] || 'General'},Active`
        }).join('\n')
        return `Snippet Text,Category,Status\n${snippetsText}`

      case 'bilingual':
        const languageCode = targetCountry.toLowerCase()
        const englishTemplates = getLanguageTemplates('US')

        const bilingualEntries = [
          ...templates.headlines.slice(0, 4).map((headline, index) =>
            `${headline},${headline.length},${englishTemplates.headlines[index]},Headlines,Active`
          ),
          ...templates.descriptions.slice(0, 4).map((description, index) =>
            `${description},${description.length},${englishTemplates.descriptions[index]},Descriptions,Active`
          ),
          ...templates.callouts.slice(0, 4).map((callout, index) =>
            `${callout},${callout.length},${englishTemplates.callouts[index]},Callouts,Active`
          ),
          ...templates.sitelinks.slice(0, 4).map((sitelink, index) =>
            `${sitelink},${sitelink.length},${englishTemplates.sitelinks[index]},Sitelinks,Active`
          )
        ]

        return `Content_${languageCode.toUpperCase()},Characters,Content_EN,Category,Status\n${bilingualEntries.join('\n')}`

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
      console.log('🔍 AVAILABLE CSV KEYS:', campaign?.csvFiles ? Object.keys(campaign.csvFiles) : 'NO csvFiles')
      
      // CRITICAL FIX: Force Hungarian fallback for Hungary campaigns
      // The API returns mixed Portuguese/Hungarian content, so we force pure Hungarian
      const forceHungarianFallback = campaignData.targetCountry === 'HU'
      const realCsvData = campaign?.csvFiles?.[csvType]

      if (realCsvData && !forceHungarianFallback) {
        console.log('✅ Using real campaign CSV data')
        csvContent = realCsvData
      } else {
        if (forceHungarianFallback) {
          console.log('🇭🇺 FORCING Hungarian fallback for Hungary campaign')
        } else {
          console.log('⚠️ Using fallback sample CSV data - real CSV data not found')
        }
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
        { type: 'headlines', name: 'Headlines.csv' },
        { type: 'descriptions', name: 'Descriptions.csv' },
        { type: 'ads', name: 'Anuncios_Completos.csv' },
        { type: 'sitelinks', name: 'Sitelinks.csv' },
        { type: 'callouts', name: 'Callouts.csv' },
        { type: 'snippets', name: 'Snippets.csv' },
        { type: 'bilingual', name: 'Arquivo_Consolidado_Bilingue.csv' }
      ]
      
      // Adiciona cada arquivo CSV ao ZIP
      filesToDownload.forEach(file => {
        const forceHungarianFallback = campaignData.targetCountry === 'HU'
        const realCsvData = campaign?.csvFiles?.[file.type]
        let csvContent = ''

        if (realCsvData && !forceHungarianFallback) {
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
        { type: 'headlines', name: 'Headlines.csv' },
        { type: 'descriptions', name: 'Descriptions.csv' },
        { type: 'ads', name: 'Anuncios_Completos.csv' },
        { type: 'sitelinks', name: 'Sitelinks.csv' },
        { type: 'callouts', name: 'Callouts.csv' },
        { type: 'snippets', name: 'Snippets.csv' },
        { type: 'bilingual', name: 'Arquivo_Consolidado_Bilingue.csv' }
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