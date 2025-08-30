/**
 * YouTube Channel Monitor
 * Monitora canais conhecidos + descobre novos
 */

import { google } from 'googleapis'
import SmartAdvIntegration from './smartadv-integration'

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
   */
  private async analyzeChannelProductPattern(channelId: string): Promise<{
    isPromising: boolean
    uniqueProducts: number
    recurringProducts: number
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
      
      // Critérios PREMIUM
      const isPremium = (
        uniqueProducts >= 5 &&      // 5+ produtos únicos
        recurringProducts >= 2 &&   // 2+ produtos recorrentes  
        meetsBasicCriteria          // Critérios básicos
      )
      
      const isGood = (
        uniqueProducts >= 3 &&      // 3+ produtos únicos
        recurringProducts >= 1 &&   // 1+ produto recorrente
        meetsBasicCriteria
      )
      
      const channelQuality = isPremium ? 'premium' : isGood ? 'high' : meetsBasicCriteria ? 'medium' : 'low'
      
      console.log(`📊 Channel pattern analysis: ${uniqueProducts} unique, ${recurringProducts} recurring, gaps: ${hasGapPatterns}, quality: ${channelQuality}`)
      
      return {
        isPromising: isPremium || isGood, // Só adiciona se for good ou premium
        uniqueProducts,
        recurringProducts,
        hasGapPatterns,
        channelQuality
      }
      
    } catch (error) {
      console.warn(`⚠️ Failed to analyze channel pattern: ${channelId}`)
      return {
        isPromising: false,
        uniqueProducts: 0,
        recurringProducts: 0,
        hasGapPatterns: false,
        channelQuality: 'low'
      }
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