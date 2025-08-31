/**
 * YouTube Channel Monitor
 * Monitora canais conhecidos + descobre novos
 * Implementa detecção de Advertiser vs Producer pages
 */

import { google } from 'googleapis'
import SmartAdvIntegration from './smartadv-integration'
import { GoogleSearchClient } from '../validation/google-search'

const youtube = google.youtube('v3')

interface YouTubeChannel {
  channelId: string
  channelTitle: string
  subscriberCount: number
  videoCount: number
  lastChecked: Date
  status: 'active' | 'inactive' | 'dead'
  reliability: number // 0-100
  productsMentioned: string[]
}

export class YouTubeMonitor {
  private apiKey: string
  private smartAdv: SmartAdvIntegration
  private googleSearch: GoogleSearchClient
  
  // Regiões para busca multi-geo (VPN simulation)
  private targetRegions = [
    'US', 'FR', 'DE', 'GB', 'CA',  // Principais
    'DK', 'SE', 'PL', 'RO'         // Expansão: Dinamarca, Suécia, Polônia, Romênia
  ]
  
  // Canais TOP conhecidos para monitorar (DO USUÁRIO!)
  private knownGoodChannels = [
    // CANAIS REAIS DO USUÁRIO - GOLDEN LIST! 🏆
    'UCmm7RPs7Zjr7CzVK-zQk3YQ',  // @butecohits4948 - Buteco Hits
    'UCKgL0SJkciM_m6TFSArmxmg',  // @LizyRomance
    'UCQWMcsQb99i1pJ9YnBC1DxQ',  // @val_le
    'UCA-1Nsp3jfX4Sjpcn7M0Atw',  // @legitdiv
    'UCNTp2RUykGHhWbQajgMCFVA',  // @wrestlingfullhd
    'UCQbeTU9vgvDOCfbNDv_Wosw',  // @wrestlingbest1
    'UC_jt6xXBPVCDEjde7WxpTUA',  // @RookieSubs
    
    // Affiliate Marketing Channels (genéricos)
    'UCqGZlQH9OaMsKYEXIw5EMLA', // Affiliates Corner
    'UCJvNXMbC6fhH7tOiH7moQbg', // ODi Productions
    'UC1gPOmj_9wh2d6tcEQxlUng', // Greg Jeffries
  ]
  
  // Canais com metadados
  private channelMetadata = new Map([
    ['UCmm7RPs7Zjr7CzVK-zQk3YQ', { name: 'Buteco Hits', priority: 'high', category: 'user-provided' }],
    ['UCKgL0SJkciM_m6TFSArmxmg', { name: 'LizyRomance', priority: 'high', category: 'user-provided' }],
    ['UCQWMcsQb99i1pJ9YnBC1DxQ', { name: 'Val Le', priority: 'high', category: 'user-provided' }],
    ['UCA-1Nsp3jfX4Sjpcn7M0Atw', { name: 'Legitdiv', priority: 'high', category: 'user-provided' }],
    ['UCNTp2RUykGHhWbQajgMCFVA', { name: 'Wrestling Full HD', priority: 'high', category: 'user-provided' }],
    ['UCQbeTU9vgvDOCfbNDv_Wosw', { name: 'Wrestling Best 1', priority: 'high', category: 'user-provided' }],
    ['UC_jt6xXBPVCDEjde7WxpTUA', { name: 'Rookie Subs', priority: 'high', category: 'user-provided' }]
  ])
  
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || ''
    this.smartAdv = new SmartAdvIntegration()
    this.googleSearch = new GoogleSearchClient()
  }
  
  /**
   * Monitora canais conhecidos para produtos novos
   */
  async monitorKnownChannels(): Promise<any[]> {
    console.log('📺 Monitoring known YouTube channels...')
    
    const discoveries = []
    
    for (const channelId of this.knownGoodChannels) {
      try {
        // Busca vídeos recentes do canal (últimas 48h)
        const response = await youtube.search.list({
          key: this.apiKey,
          channelId: channelId,
          part: ['snippet'],
          type: ['video'],
          order: 'date',
          maxResults: 10,
          publishedAfter: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        })
        
        const videos = response.data.items || []
        
        for (const video of videos) {
          // Analisa título e descrição para produtos
          const products = this.extractProductMentions(
            video.snippet?.title || '',
            video.snippet?.description || ''
          )
          
          for (const product of products) {
            discoveries.push({
              product,
              channel: video.snippet?.channelTitle,
              channelId: channelId,
              videoTitle: video.snippet?.title,
              videoId: video.id?.videoId,
              publishedAt: video.snippet?.publishedAt,
              source: 'youtube-known-channel'
            })
          }
        }
        
      } catch (error) {
        console.warn(`⚠️ Failed to check channel ${channelId}:`, error)
        // Marca canal como potencialmente morto
      }
    }
    
    console.log(`✅ Found ${discoveries.length} product mentions from known channels`)
    return discoveries
  }
  
  /**
   * Descobre NOVOS canais promissores - ESTRATÉGIA PREMIUM
   * Busca por produtos EXCLUSIVOS em múltiplas geografias
   */
  async discoverNewChannels(): Promise<string[]> {
    console.log('🔍 Premium discovery: Searching for EXCLUSIVE products across geos...')
    
    // PRODUTOS EXCLUSIVOS do SmartADV + seus produtos específicos
    const exclusiveProducts = [
      ...this.smartAdv.getExclusiveProducts(), // SmartADV exclusivos  
      'Glucosense', 'NerveCalm', 'GlicoShield', 'GutDrops' // Seus produtos específicos
    ]
    
    // Queries inteligentes focadas em REVIEWS ORGÂNICOS (não ads)
    const baseQueries = [
      ...exclusiveProducts.map(product => `${product} review`),
      ...exclusiveProducts.map(product => `${product} honest review`),
      ...exclusiveProducts.map(product => `${product} does it work`),
      ...exclusiveProducts.map(product => `${product} real results`),
    ]
    
    console.log(`🎯 Searching for ${exclusiveProducts.length} exclusive products across ${this.targetRegions.length} regions`)
    
    // Multi-geo search simulation
    const searchQueries = []
    for (const region of this.targetRegions) {
      for (const query of baseQueries) {
        searchQueries.push({ query, region })
      }
    }
    
    const newChannels = new Set<string>()
    
    for (const searchQuery of searchQueries) {
      try {
        console.log(`🌍 Searching "${searchQuery.query}" in region ${searchQuery.region}`)
        
        const response = await youtube.search.list({
          key: this.apiKey,
          q: searchQuery.query,
          part: ['snippet'],
          type: ['video'],
          maxResults: 5, // Menos por query mas mais queries
          order: 'relevance', // Relevância > views para produtos exclusivos
          publishedAfter: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 3 meses
          regionCode: searchQuery.region // Multi-geo search
        })
        
        const videos = response.data.items || []
        
        for (const video of videos) {
          const channelId = video.snippet?.channelId
          
          if (channelId && !this.knownGoodChannels.includes(channelId)) {
            // ANÁLISE PREMIUM: Verifica se canal tem múltiplos produtos
            const channelAnalysis = await this.analyzeChannelProductPattern(channelId)
            
            if (channelAnalysis.isPromising) {
              newChannels.add(channelId)
              console.log(`🏆 PREMIUM CHANNEL FOUND: ${video.snippet?.channelTitle}`)
              console.log(`  - Products found: ${channelAnalysis.uniqueProducts}`)
              console.log(`  - Recurring products: ${channelAnalysis.recurringProducts}`)
              console.log(`  - High-potential products (5-7+ times): ${channelAnalysis.highPotentialProducts.length}`)
              if (channelAnalysis.highPotentialProducts.length > 0) {
                console.log(`  - Products: ${channelAnalysis.highPotentialProducts.join(', ')}`)
              }
              console.log(`  - Gap patterns: ${channelAnalysis.hasGapPatterns ? 'YES' : 'NO'}`)
            }
          }
        }
        
        // Rate limiting para não sobrecarregar API
        await new Promise(resolve => setTimeout(resolve, 100)) // 100ms delay
        
      } catch (error) {
        console.warn(`⚠️ Search failed for: ${searchQuery.query} in ${searchQuery.region}`)
      }
    }
    
    console.log(`✅ Discovered ${newChannels.size} new promising channels`)
    return Array.from(newChannels)
  }
  
  /**
   * Extrai menções de produtos do texto
   */
  private extractProductMentions(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const products = new Set<string>()
    
    // Padrões comuns de produtos
    const patterns = [
      /prodentim/gi,
      /java burn/gi,
      /alpilean/gi,
      /glucotrust/gi,
      /ikaria.*juice/gi,
      /red boost/gi,
      /quietum plus/gi,
      /cortexi/gi,
      /prostadine/gi,
      /sight ?care/gi,
      /liv ?pure/gi,
      /puravive/gi,
      /sugar ?defender/gi,
      // Genérico para capturar nomes de produtos
      /\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/g // CamelCase products
    ]
    
    for (const pattern of patterns) {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => products.add(match.toLowerCase()))
      }
    }
    
    return Array.from(products)
  }
  
  /**
   * Obtém informações do canal
   */
  private async getChannelInfo(channelId: string): Promise<any> {
    try {
      const response = await youtube.channels.list({
        key: this.apiKey,
        id: [channelId],
        part: ['statistics', 'snippet']
      })
      
      const channel = response.data.items?.[0]
      if (!channel) return null
      
      return {
        channelId,
        title: channel.snippet?.title,
        subscriberCount: parseInt(channel.statistics?.subscriberCount || '0'),
        videoCount: parseInt(channel.statistics?.videoCount || '0'),
        viewCount: parseInt(channel.statistics?.viewCount || '0')
      }
    } catch (error) {
      return null
    }
  }
  
  /**
   * Verifica se canal é REALMENTE promissor - critérios RIGOROSOS
   * Melhor não adicionar nada do que adicionar lixo!
   */
  private isChannelPromising(channelInfo: any): boolean {
    // Critérios RIGOROSOS - só os MUITO BONS passam
    const hasGoodSubscribers = channelInfo.subscriberCount > 5000  // Mínimo 5K (não 1K)
    const isActiveChannel = channelInfo.videoCount > 50           // Muito ativo (não 10)
    const hasGoodEngagement = channelInfo.viewCount > 500000     // Boa audiência (não 100K)
    
    // Ratio de views por subscriber (engajamento)
    const engagementRatio = channelInfo.viewCount / channelInfo.subscriberCount
    const hasGoodEngagement2 = engagementRatio > 50 // Pelo menos 50 views por subscriber
    
    console.log(`📊 Channel analysis: subs=${channelInfo.subscriberCount}, videos=${channelInfo.videoCount}, views=${channelInfo.viewCount}, ratio=${engagementRatio.toFixed(2)}`)
    
    // TODOS os critérios devem ser atendidos
    const isPromising = hasGoodSubscribers && isActiveChannel && hasGoodEngagement && hasGoodEngagement2
    
    if (isPromising) {
      console.log('✅ Channel APPROVED: Meets all rigorous criteria')
    } else {
      console.log('❌ Channel REJECTED: Does not meet quality standards')
    }
    
    return isPromising
  }
  
  /**
   * ANÁLISE PREMIUM DE CANAL - Busca padrões de produtos recorrentes e gaps
   * Implementa lógica 5-7+ vezes: produtos mencionados 5-7+ vezes no mesmo canal = alta potencialidade
   */
  private async analyzeChannelProductPattern(channelId: string): Promise<{
    isPromising: boolean
    uniqueProducts: number
    recurringProducts: number
    highPotentialProducts: string[]
    hasGapPatterns: boolean
    channelQuality: 'low' | 'medium' | 'high' | 'premium'
  }> {
    try {
      // Busca últimos 50 vídeos do canal
      const response = await youtube.search.list({
        key: this.apiKey,
        channelId: channelId,
        part: ['snippet'],
        type: ['video'],
        maxResults: 50,
        order: 'date'
      })
      
      const videos = response.data.items || []
      const productMentions = new Map<string, Date[]>()
      
      // Analisa cada vídeo em busca de produtos
      for (const video of videos) {
        const publishedDate = new Date(video.snippet?.publishedAt || '')
        const products = this.extractProductMentions(
          video.snippet?.title || '',
          video.snippet?.description || ''
        )
        
        for (const product of products) {
          if (!productMentions.has(product)) {
            productMentions.set(product, [])
          }
          productMentions.get(product)?.push(publishedDate)
        }
      }
      
      // Análise de padrões
      const uniqueProducts = productMentions.size
      const recurringProducts = Array.from(productMentions.values())
        .filter(dates => dates.length >= 4).length // 4+ menções = recorrente
      
      // LÓGICA 5-7+ VEZES: Produtos com alta potencialidade
      const highPotentialProducts: string[] = []
      for (const [product, dates] of productMentions.entries()) {
        if (dates.length >= 5) { // 5+ menções = ALTA POTENCIALIDADE
          highPotentialProducts.push(product)
          console.log(`🎯 HIGH POTENTIAL PRODUCT: ${product} mentioned ${dates.length} times in channel`)
        }
      }
      
      // Detecta GAP PATTERNS (produto sumiu e voltou)
      let hasGapPatterns = false
      for (const [product, dates] of productMentions.entries()) {
        if (dates.length >= 3) {
          dates.sort((a, b) => a.getTime() - b.getTime())
          
          // Verifica se há gaps > 60 dias entre menções
          for (let i = 1; i < dates.length; i++) {
            const gap = dates[i].getTime() - dates[i-1].getTime()
            const gapDays = gap / (1000 * 60 * 60 * 24)
            
            if (gapDays > 60) {
              hasGapPatterns = true
              console.log(`📊 Gap pattern detected: ${product} had ${gapDays.toFixed(0)} day gap`)
              break
            }
          }
        }
      }
      
      // Verificação básica de qualidade
      const channelInfo = await this.getChannelInfo(channelId)
      const meetsBasicCriteria = channelInfo && this.isChannelPromising(channelInfo)
      
      // Critérios PREMIUM - agora inclui produtos de alta potencialidade (5-7+ vezes)
      const isPremium = (
        uniqueProducts >= 5 &&                    // 5+ produtos únicos
        recurringProducts >= 2 &&                 // 2+ produtos recorrentes  
        highPotentialProducts.length >= 1 &&      // 1+ produto com 5-7+ menções
        meetsBasicCriteria                        // Critérios básicos
      )
      
      const isGood = (
        uniqueProducts >= 3 &&                    // 3+ produtos únicos
        (recurringProducts >= 1 || 
         highPotentialProducts.length >= 1) &&    // 1+ produto recorrente OU 1+ alta potencialidade
        meetsBasicCriteria
      )
      
      const channelQuality = isPremium ? 'premium' : isGood ? 'high' : meetsBasicCriteria ? 'medium' : 'low'
      
      console.log(`📊 Channel pattern analysis: ${uniqueProducts} unique, ${recurringProducts} recurring, ${highPotentialProducts.length} high-potential, gaps: ${hasGapPatterns}, quality: ${channelQuality}`)
      
      if (highPotentialProducts.length > 0) {
        console.log(`🎯 High-potential products in this channel: ${highPotentialProducts.join(', ')}`)
      }
      
      return {
        isPromising: isPremium || isGood, // Só adiciona se for good ou premium
        uniqueProducts,
        recurringProducts,
        highPotentialProducts,
        hasGapPatterns,
        channelQuality
      }
      
    } catch (error) {
      console.warn(`⚠️ Failed to analyze channel pattern: ${channelId}`)
      return {
        isPromising: false,
        uniqueProducts: 0,
        recurringProducts: 0,
        highPotentialProducts: [],
        hasGapPatterns: false,
        channelQuality: 'low'
      }
    }
  }
  
  /**
   * NOVA FUNCIONALIDADE: Análise de consistência cross-channel
   * Identifica produtos mencionados 5-7+ vezes em múltiplos canais
   */
  async analyzeCrossChannelConsistency(discoveries: any[]): Promise<{
    superHighPotential: Map<string, { channels: string[], totalMentions: number, avgMentionsPerChannel: number }>
    crossChannelProducts: Map<string, string[]>
  }> {
    console.log('🔍 Analyzing cross-channel consistency for high-potential products...')
    
    // Agrupa produtos por canal e conta menções
    const productsByChannel = new Map<string, Map<string, number>>()
    
    for (const discovery of discoveries) {
      if (!productsByChannel.has(discovery.channelId)) {
        productsByChannel.set(discovery.channelId, new Map())
      }
      
      const channelProducts = productsByChannel.get(discovery.channelId)!
      const currentCount = channelProducts.get(discovery.product) || 0
      channelProducts.set(discovery.product, currentCount + 1)
    }
    
    // Identifica produtos com 5+ menções por canal
    const highPotentialByChannel = new Map<string, string[]>()
    
    for (const [channelId, products] of productsByChannel.entries()) {
      const highPotentialProducts = Array.from(products.entries())
        .filter(([product, count]) => count >= 5)
        .map(([product, count]) => product)
      
      if (highPotentialProducts.length > 0) {
        highPotentialByChannel.set(channelId, highPotentialProducts)
      }
    }
    
    // Identifica produtos presentes em múltiplos canais como alta potencialidade
    const productChannelMap = new Map<string, string[]>()
    
    for (const [channelId, products] of highPotentialByChannel.entries()) {
      for (const product of products) {
        if (!productChannelMap.has(product)) {
          productChannelMap.set(product, [])
        }
        productChannelMap.get(product)!.push(channelId)
      }
    }
    
    // SUPER HIGH POTENTIAL: produtos com 5+ menções em 2+ canais
    const superHighPotential = new Map<string, { channels: string[], totalMentions: number, avgMentionsPerChannel: number }>()
    
    for (const [product, channels] of productChannelMap.entries()) {
      if (channels.length >= 2) { // Presente em 2+ canais
        let totalMentions = 0
        
        for (const channelId of channels) {
          const channelProducts = productsByChannel.get(channelId)
          if (channelProducts) {
            totalMentions += channelProducts.get(product) || 0
          }
        }
        
        const avgMentionsPerChannel = totalMentions / channels.length
        
        superHighPotential.set(product, {
          channels,
          totalMentions,
          avgMentionsPerChannel
        })
        
        console.log(`🚀 SUPER HIGH POTENTIAL: ${product}`)
        console.log(`  - Present in ${channels.length} channels`)
        console.log(`  - Total mentions: ${totalMentions}`)
        console.log(`  - Average per channel: ${avgMentionsPerChannel.toFixed(1)}`)
      }
    }
    
    return {
      superHighPotential,
      crossChannelProducts: productChannelMap
    }
  }
  
  /**
   * Detecta produtos HOT (mencionados com frequência)
   */
  async detectHotProducts(discoveries: any[]): Promise<Map<string, number>> {
    const productFrequency = new Map<string, number>()
    
    for (const discovery of discoveries) {
      const count = productFrequency.get(discovery.product) || 0
      productFrequency.set(discovery.product, count + 1)
    }
    
    // Ordena por frequência
    const sorted = Array.from(productFrequency.entries())
      .sort((a, b) => b[1] - a[1])
    
    console.log('🔥 Hot products detected:')
    sorted.slice(0, 5).forEach(([product, count]) => {
      console.log(`  - ${product}: mentioned ${count} times`)
    })
    
    return new Map(sorted)
  }
  
  /**
   * NOVA FUNCIONALIDADE: Detecção de Advertiser vs Producer pages
   * Identifica se os resultados de busca são de anunciantes ou produtores
   */
  async analyzeAdvertiserVsProducer(productName: string): Promise<{
    advertiserPages: Array<{ url: string, domain: string, confidence: number, indicators: string[] }>
    producerPages: Array<{ url: string, domain: string, confidence: number, indicators: string[] }>
    analysis: {
      advertiserDominance: number // 0-1 (1 = só advertisers, 0 = só producers)
      competitionLevel: 'low' | 'medium' | 'high'
      marketMaturity: 'emerging' | 'growing' | 'mature'
    }
  }> {
    console.log(`🔍 Analyzing Advertiser vs Producer pages for: ${productName}`)
    
    try {
      // Busca múltiplas variações do produto
      const searchQueries = [
        `"${productName}" buy`,
        `"${productName}" official website`,
        `"${productName}" reviews`,
        `"${productName}" discount`,
        `"${productName}" where to buy`
      ]
      
      const allResults = []
      
      for (const query of searchQueries) {
        try {
          const searchResults = await this.googleSearch.search({
            query,
            resultsCount: 10,
            country: 'US'
          })
          
          allResults.push(...searchResults.results)
        } catch (error) {
          console.warn(`Search failed for query: ${query}`)
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Remove duplicatas
      const uniqueResults = allResults.filter((result, index, self) => 
        index === self.findIndex(r => r.url === result.url)
      )
      
      const advertiserPages = []
      const producerPages = []
      
      for (const result of uniqueResults) {
        const analysis = this.classifyPageType(result, productName)
        
        if (analysis.type === 'advertiser') {
          advertiserPages.push({
            url: result.url,
            domain: result.domain,
            confidence: analysis.confidence,
            indicators: analysis.indicators
          })
        } else if (analysis.type === 'producer') {
          producerPages.push({
            url: result.url,
            domain: result.domain,
            confidence: analysis.confidence,
            indicators: analysis.indicators
          })
        }
      }
      
      // Análise geral do mercado
      const totalPages = advertiserPages.length + producerPages.length
      const advertiserDominance = totalPages > 0 ? advertiserPages.length / totalPages : 0
      
      let competitionLevel: 'low' | 'medium' | 'high'
      let marketMaturity: 'emerging' | 'growing' | 'mature'
      
      // Determina nível de competição
      if (advertiserPages.length < 3) {
        competitionLevel = 'low'
      } else if (advertiserPages.length < 7) {
        competitionLevel = 'medium'
      } else {
        competitionLevel = 'high'
      }
      
      // Determina maturidade do mercado
      if (advertiserDominance < 0.3) {
        marketMaturity = 'emerging' // Poucos advertisers, mercado novo
      } else if (advertiserDominance < 0.7) {
        marketMaturity = 'growing'  // Mix de advertisers e producers
      } else {
        marketMaturity = 'mature'   // Dominado por advertisers
      }
      
      console.log(`📊 Market Analysis for ${productName}:`)
      console.log(`  - Advertiser pages: ${advertiserPages.length}`)
      console.log(`  - Producer pages: ${producerPages.length}`)
      console.log(`  - Advertiser dominance: ${(advertiserDominance * 100).toFixed(1)}%`)
      console.log(`  - Competition level: ${competitionLevel}`)
      console.log(`  - Market maturity: ${marketMaturity}`)
      
      return {
        advertiserPages,
        producerPages,
        analysis: {
          advertiserDominance,
          competitionLevel,
          marketMaturity
        }
      }
      
    } catch (error) {
      console.error(`Error analyzing advertiser vs producer for ${productName}:`, error)
      return {
        advertiserPages: [],
        producerPages: [],
        analysis: {
          advertiserDominance: 0.5,
          competitionLevel: 'medium',
          marketMaturity: 'growing'
        }
      }
    }
  }
  
  /**
   * Classifica uma página como Advertiser ou Producer
   */
  private classifyPageType(result: any, productName: string): {
    type: 'advertiser' | 'producer' | 'unknown'
    confidence: number
    indicators: string[]
  } {
    const url = result.url.toLowerCase()
    const title = result.title.toLowerCase()
    const description = result.description.toLowerCase()
    const domain = result.domain.toLowerCase()
    
    const indicators = []
    let advertiserScore = 0
    let producerScore = 0
    
    // ADVERTISER INDICATORS (score positivo)
    
    // Domínios típicos de afiliados
    if (domain.includes('review') || domain.includes('best') || domain.includes('top') || 
        domain.includes('deal') || domain.includes('discount') || domain.includes('coupon')) {
      advertiserScore += 3
      indicators.push('affiliate-domain')
    }
    
    // URLs com tracking/affiliate patterns
    if (url.includes('ref=') || url.includes('tag=') || url.includes('aff=') || 
        url.includes('tracking') || url.includes('affiliate') || url.includes('partner')) {
      advertiserScore += 4
      indicators.push('tracking-url')
    }
    
    // Texto típico de afiliado
    if (title.includes('review') || title.includes('best') || title.includes('top') ||
        title.includes('compare') || title.includes('vs') || title.includes('honest')) {
      advertiserScore += 2
      indicators.push('review-content')
    }
    
    if (description.includes('discount') || description.includes('coupon') || 
        description.includes('deal') || description.includes('save') || 
        description.includes('special offer')) {
      advertiserScore += 2
      indicators.push('promotion-focus')
    }
    
    // Domínios conhecidos de afiliados
    const knownAffiliatePatterns = ['clickbank', 'commission', 'digistore', 'jvzoo', 'warrior']
    for (const pattern of knownAffiliatePatterns) {
      if (url.includes(pattern) || domain.includes(pattern)) {
        advertiserScore += 5
        indicators.push('known-affiliate-platform')
        break
      }
    }
    
    // PRODUCER INDICATORS (score positivo)
    
    // Domínio oficial do produto
    const productWords = productName.toLowerCase().split(' ')
    const domainMatchesProduct = productWords.some(word => 
      domain.includes(word) && !domain.includes('review') && !domain.includes('best')
    )
    
    if (domainMatchesProduct) {
      producerScore += 4
      indicators.push('official-domain')
    }
    
    // URLs oficiais típicas
    if (url.includes('official') || url.includes('shop') || url.includes('buy') ||
        url.includes('store') || url.includes('product')) {
      producerScore += 2
      indicators.push('official-url')
    }
    
    // Indicadores de página oficial
    if (title.includes('official') || title.includes('authentic') || 
        description.includes('manufacturer') || description.includes('official website')) {
      producerScore += 3
      indicators.push('official-content')
    }
    
    // Grandes plataformas de e-commerce (geralmente producers ou retail oficial)
    const majorEcommerce = ['amazon', 'ebay', 'walmart', 'target', 'shopify']
    for (const platform of majorEcommerce) {
      if (domain.includes(platform)) {
        producerScore += 1 // Pontuação menor pois pode ser ambos
        indicators.push('major-platform')
        break
      }
    }
    
    // Determina tipo e confiança
    let type: 'advertiser' | 'producer' | 'unknown'
    let confidence: number
    
    if (advertiserScore > producerScore && advertiserScore >= 2) {
      type = 'advertiser'
      confidence = Math.min(advertiserScore / 10, 1) // Normaliza para 0-1
    } else if (producerScore > advertiserScore && producerScore >= 2) {
      type = 'producer'
      confidence = Math.min(producerScore / 10, 1)
    } else {
      type = 'unknown'
      confidence = 0
    }
    
    return { type, confidence, indicators }
  }
  
  /**
   * NOVA FUNCIONALIDADE: Google Ads Transparency - Espionagem de Anunciantes
   * Identifica quem está anunciando produtos de alta potencialidade
   */
  async spyOnAdvertisers(productName: string): Promise<{
    activeAdvertisers: Array<{
      domain: string
      adTexts: string[]
      landingPages: string[]
      adKeywords: string[]
      estimatedBudget: 'low' | 'medium' | 'high'
      competitorLevel: 'weak' | 'moderate' | 'strong'
    }>
    marketInsights: {
      totalActiveAds: number
      averageAdPosition: number
      competitiveIndex: number
      suggestedStrategy: string
    }
  }> {
    console.log(`🕵️ Spying on advertisers for product: ${productName}`)
    
    try {
      // Busca por anúncios usando queries específicas que revelam advertisers
      const adSpyQueries = [
        `"${productName}" site:googleadservices.com`,
        `"${productName}" "sponsored" OR "ad"`,
        `"${productName}" inurl:landing OR inurl:lp`,
        `"${productName}" "limited time" OR "special offer"`,
        `"${productName}" "click here" OR "get now"`,
        `"${productName}" inurl:track OR inurl:affiliate`
      ]
      
      const advertisers = new Map<string, {
        domain: string
        adTexts: Set<string>
        landingPages: Set<string>
        keywords: Set<string>
        adCount: number
      }>()
      
      for (const query of adSpyQueries) {
        try {
          console.log(`🔍 Searching ad spy query: ${query}`)
          
          const results = await this.googleSearch.search({
            query,
            resultsCount: 10,
            country: 'US'
          })
          
          for (const result of results.results) {
            const domain = result.domain
            
            if (!advertisers.has(domain)) {
              advertisers.set(domain, {
                domain,
                adTexts: new Set(),
                landingPages: new Set(),
                keywords: new Set(),
                adCount: 0
              })
            }
            
            const advertiser = advertisers.get(domain)!
            advertiser.adCount++
            advertiser.adTexts.add(result.title)
            advertiser.landingPages.add(result.url)
            
            // Extrai palavras-chave do título e descrição
            const keywords = this.extractAdKeywords(result.title + ' ' + result.description, productName)
            keywords.forEach(keyword => advertiser.keywords.add(keyword))
          }
          
        } catch (error) {
          console.warn(`Ad spy query failed: ${query}`)
        }
        
        // Rate limiting mais agressivo para não ser bloqueado
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Processa e ranqueia advertisers
      const activeAdvertisers = Array.from(advertisers.values())
        .filter(advertiser => advertiser.adCount >= 2) // Mínimo 2 anúncios detectados
        .map(advertiser => {
          // Estima orçamento baseado na quantidade de anúncios e variações
          let estimatedBudget: 'low' | 'medium' | 'high'
          if (advertiser.adCount >= 8 && advertiser.keywords.size >= 5) {
            estimatedBudget = 'high'
          } else if (advertiser.adCount >= 4 && advertiser.keywords.size >= 3) {
            estimatedBudget = 'medium'
          } else {
            estimatedBudget = 'low'
          }
          
          // Classifica nível de competidor
          let competitorLevel: 'weak' | 'moderate' | 'strong'
          const diversityScore = advertiser.keywords.size / advertiser.adCount
          
          if (estimatedBudget === 'high' && diversityScore > 0.5) {
            competitorLevel = 'strong'
          } else if (estimatedBudget === 'medium' || diversityScore > 0.3) {
            competitorLevel = 'moderate'
          } else {
            competitorLevel = 'weak'
          }
          
          return {
            domain: advertiser.domain,
            adTexts: Array.from(advertiser.adTexts),
            landingPages: Array.from(advertiser.landingPages),
            adKeywords: Array.from(advertiser.keywords),
            estimatedBudget,
            competitorLevel
          }
        })
        .sort((a, b) => {
          // Ordena por força do competidor
          const scoreA = a.adTexts.length + a.adKeywords.length * 2
          const scoreB = b.adTexts.length + b.adKeywords.length * 2
          return scoreB - scoreA
        })
      
      // Análise de mercado
      const totalActiveAds = activeAdvertisers.reduce((sum, adv) => sum + adv.adTexts.length, 0)
      const strongCompetitors = activeAdvertisers.filter(adv => adv.competitorLevel === 'strong').length
      const competitiveIndex = strongCompetitors / Math.max(activeAdvertisers.length, 1)
      
      // Estratégia sugerida baseada na análise
      let suggestedStrategy = ''
      if (competitiveIndex > 0.6) {
        suggestedStrategy = 'HIGH COMPETITION - Focus on long-tail keywords and unique angles'
      } else if (competitiveIndex > 0.3) {
        suggestedStrategy = 'MODERATE COMPETITION - Good opportunity with targeted approach'
      } else if (activeAdvertisers.length > 0) {
        suggestedStrategy = 'LOW COMPETITION - Great opportunity for aggressive entry'
      } else {
        suggestedStrategy = 'EMERGING MARKET - First-mover advantage possible'
      }
      
      console.log(`📊 Advertiser Spy Results for ${productName}:`)
      console.log(`  - Active advertisers found: ${activeAdvertisers.length}`)
      console.log(`  - Total ads detected: ${totalActiveAds}`)
      console.log(`  - Strong competitors: ${strongCompetitors}`)
      console.log(`  - Competitive index: ${(competitiveIndex * 100).toFixed(1)}%`)
      console.log(`  - Strategy: ${suggestedStrategy}`)
      
      if (activeAdvertisers.length > 0) {
        console.log(`🏆 Top competitors:`)
        activeAdvertisers.slice(0, 3).forEach((adv, idx) => {
          console.log(`  ${idx + 1}. ${adv.domain} (${adv.competitorLevel} - ${adv.estimatedBudget} budget)`)
        })
      }
      
      return {
        activeAdvertisers,
        marketInsights: {
          totalActiveAds,
          averageAdPosition: totalActiveAds / Math.max(activeAdvertisers.length, 1),
          competitiveIndex,
          suggestedStrategy
        }
      }
      
    } catch (error) {
      console.error(`Error in advertiser spying for ${productName}:`, error)
      return {
        activeAdvertisers: [],
        marketInsights: {
          totalActiveAds: 0,
          averageAdPosition: 0,
          competitiveIndex: 0,
          suggestedStrategy: 'Error in analysis - manual research recommended'
        }
      }
    }
  }
  
  /**
   * Extrai palavras-chave de anúncios
   */
  private extractAdKeywords(adText: string, productName: string): string[] {
    const text = adText.toLowerCase()
    const keywords = new Set<string>()
    
    // Palavras-chave típicas de marketing de afiliados
    const marketingKeywords = [
      'buy', 'get', 'order', 'discount', 'save', 'deal', 'offer', 'special',
      'limited', 'exclusive', 'bonus', 'free', 'trial', 'guarantee',
      'best', 'top', 'review', 'honest', 'real', 'proven', 'effective',
      'official', 'authentic', 'original', 'website', 'store'
    ]
    
    // Procura por palavras-chave de marketing
    for (const keyword of marketingKeywords) {
      if (text.includes(keyword)) {
        keywords.add(keyword)
      }
    }
    
    // Procura por variações do nome do produto
    const productWords = productName.toLowerCase().split(' ')
    for (const word of productWords) {
      if (text.includes(word)) {
        keywords.add(word)
      }
    }
    
    // Procura por números (preços, descontos, etc.)
    const numbers = text.match(/\d+/g)
    if (numbers) {
      numbers.forEach(num => {
        if (parseInt(num) > 10 && parseInt(num) < 1000) { // Provavelmente preços
          keywords.add(`$${num}`)
        }
      })
    }
    
    return Array.from(keywords)
  }
  
  /**
   * INTEGRAÇÃO COMPLETA: Monitora concorrentes continuamente
   * Identifica novos anunciantes que entram no mercado
   */
  async monitorNewAdvertisers(productName: string): Promise<{
    newAdvertisers: string[]
    disappearedAdvertisers: string[]
    changesSummary: string
  }> {
    console.log(`👁️ Monitoring new advertisers for: ${productName}`)
    
    // Esta funcionalidade seria implementada com um banco de dados
    // para comparar com análises anteriores
    
    const currentSpy = await this.spyOnAdvertisers(productName)
    const currentAdvertisers = currentSpy.activeAdvertisers.map(adv => adv.domain)
    
    // Por enquanto, retorna os advertisers atuais como "novos"
    // Em implementação completa, compararia com dados históricos
    
    return {
      newAdvertisers: currentAdvertisers,
      disappearedAdvertisers: [],
      changesSummary: `Found ${currentAdvertisers.length} active advertisers. Competitive index: ${(currentSpy.marketInsights.competitiveIndex * 100).toFixed(1)}%`
    }
  }
  
  /**
   * Detecta produtos EXCLUSIVOS (poucos canais promovendo)
   */
  detectExclusiveProducts(discoveries: any[]): Map<string, string[]> {
    const productChannels = new Map<string, Set<string>>()
    
    for (const discovery of discoveries) {
      if (!productChannels.has(discovery.product)) {
        productChannels.set(discovery.product, new Set())
      }
      productChannels.get(discovery.product)?.add(discovery.channelId)
    }
    
    const exclusiveProducts = new Map<string, string[]>()
    
    for (const [product, channels] of productChannels.entries()) {
      if (channels.size <= 2) { // Promovido por 2 ou menos canais = exclusivo
        exclusiveProducts.set(product, Array.from(channels))
        console.log(`💎 Exclusive product found: ${product} (only ${channels.size} channels)`)
      }
    }
    
    return exclusiveProducts
  }
}

export default YouTubeMonitor