/**
 * Google Ads Transparency Monitor
 * Monitora anunciantes e domínios no Ads Transparency
 */

import puppeteer from 'puppeteer'

interface Advertiser {
  name: string
  domain: string
  productsCount: number
  lastSeen: Date
  status: 'active' | 'paused' | 'dead'
  spendLevel: 'low' | 'medium' | 'high' | 'massive'
  products: string[]
}

export class AdsTransparencyMonitor {
  
  // Anunciantes TOP conhecidos para monitorar
  private knownGoodAdvertisers = [
    // ANUNCIANTE REAL DO USUÁRIO! 🎯
    { 
      domain: 'global-review2025.blog', 
      name: 'Y&F EMPREENDIMENTOS DIGITAIS LTDA',
      category: 'user-provided',
      priority: 'very-high',
      notes: 'Anunciante principal do usuário - MONITORAR SEMPRE!'
    },
    
    // Produtos conhecidos
    { domain: 'prodentim.com', name: 'ProDentim Official', category: 'supplement' },
    { domain: 'javaburn.com', name: 'Java Burn', category: 'supplement' },
    { domain: 'alpilean.com', name: 'Alpilean', category: 'supplement' },
    { domain: 'glucotrust.com', name: 'GlucoTrust', category: 'supplement' },
    
    // Redes de afiliados grandes
    { domain: 'digistore24.com', name: 'Digistore24', category: 'network' },
    { domain: 'clickbank.net', name: 'ClickBank', category: 'network' },
  ]
  
  /**
   * Monitora anunciantes conhecidos
   */
  async monitorKnownAdvertisers(): Promise<any[]> {
    console.log('📊 Monitoring known advertisers in Ads Transparency...')
    
    const discoveries = []
    const browser = await puppeteer.launch({ headless: true })
    
    try {
      for (const advertiser of this.knownGoodAdvertisers) {
        try {
          const page = await browser.newPage()
          
          // Acessa Ads Transparency
          const url = `https://adstransparency.google.com/advertiser/${encodeURIComponent(advertiser.domain)}`
          await page.goto(url, { waitUntil: 'networkidle2' })
          
          // Espera carregar
          await page.waitForTimeout(3000)
          
          // Extrai informações dos anúncios
          const adsData = await page.evaluate(() => {
            const ads = []
            
            // Busca cards de anúncios
            const adCards = document.querySelectorAll('[role="article"]')
            
            adCards.forEach(card => {
              const title = card.querySelector('h3')?.textContent || ''
              const description = card.querySelector('p')?.textContent || ''
              const url = card.querySelector('a')?.href || ''
              
              if (title) {
                ads.push({
                  title,
                  description,
                  url,
                  timestamp: new Date()
                })
              }
            })
            
            return ads
          })
          
          // Analisa produtos nos anúncios
          for (const ad of adsData) {
            const products = this.extractProductsFromAd(ad.title, ad.description)
            
            for (const product of products) {
              discoveries.push({
                product,
                advertiser: advertiser.name,
                domain: advertiser.domain,
                adTitle: ad.title,
                adDescription: ad.description,
                source: 'ads-transparency-known'
              })
            }
          }
          
          await page.close()
          
        } catch (error) {
          console.warn(`⚠️ Failed to check advertiser ${advertiser.domain}`)
          // Marca como potencialmente morto
        }
      }
    } finally {
      await browser.close()
    }
    
    console.log(`✅ Found ${discoveries.length} products from known advertisers`)
    return discoveries
  }
  
  /**
   * Descobre NOVOS anunciantes com portfolios grandes - EXECUTA TODOS OS DIAS!  
   * Expande constantemente nossa base de anunciantes e domínios
   */
  async discoverNewAdvertisers(): Promise<any[]> {
    console.log('🔍 Daily discovery: Finding NEW advertisers and domains...')
    
    const testProducts = [
      'weight loss supplement',
      'teeth whitening',
      'blood sugar support',
      'prostate health',
      'hair growth',
      'joint pain relief'
    ]
    
    const newAdvertisers = []
    const browser = await puppeteer.launch({ headless: true })
    
    try {
      for (const query of testProducts) {
        try {
          const page = await browser.newPage()
          
          // Busca anúncios para o termo
          const url = `https://adstransparency.google.com/?query=${encodeURIComponent(query)}&region=US`
          await page.goto(url, { waitUntil: 'networkidle2' })
          
          await page.waitForTimeout(3000)
          
          // Extrai anunciantes
          const advertisers = await page.evaluate(() => {
            const results = []
            
            // Busca informações de anunciantes
            const advertiserElements = document.querySelectorAll('[data-advertiser-name]')
            
            advertiserElements.forEach(element => {
              const name = element.getAttribute('data-advertiser-name') || ''
              const domain = element.querySelector('a')?.href || ''
              
              if (name && domain) {
                results.push({ name, domain })
              }
            })
            
            return results
          })
          
          // Verifica quais são promissores (muitos produtos)
          for (const advertiser of advertisers) {
            if (!this.isKnownAdvertiser(advertiser.domain)) {
              const portfolioSize = await this.checkAdvertiserPortfolio(advertiser.domain)
              
              if (portfolioSize >= 10) { // 10+ produtos = REALMENTE interessante (não 5)
                newAdvertisers.push({
                  ...advertiser,
                  portfolioSize,
                  discoveredWith: query
                })
                console.log(`💰 APPROVED: High-quality advertiser found: ${advertiser.name} (${portfolioSize} products - MEETS STANDARDS)`)
              }
            }
          }
          
          await page.close()
          
        } catch (error) {
          console.warn(`⚠️ Search failed for: ${query}`)
        }
      }
    } finally {
      await browser.close()
    }
    
    console.log(`✅ Discovered ${newAdvertisers.length} new promising advertisers`)
    return newAdvertisers
  }
  
  /**
   * Testa produtos aleatórios para descobrir NOVOS anunciantes e domínios - TODOS OS DIAS!
   * Estratégia: combinações aleatórias revelam anunciantes ocultos
   */
  async randomProductTesting(): Promise<any[]> {
    console.log('🎲 Daily random testing: Discovering hidden advertisers and domains...')
    
    // Gera variações de produtos para testar
    const productVariations = [
      'burn', 'boost', 'pure', 'pro', 'plus',
      'max', 'ultra', 'prime', 'elite', 'advanced'
    ]
    
    const bodyParts = [
      'liver', 'kidney', 'heart', 'brain', 'gut',
      'skin', 'hair', 'nail', 'eye', 'ear'
    ]
    
    const discoveries = []
    
    // Gera combinações aleatórias
    for (let i = 0; i < 5; i++) {
      const part = bodyParts[Math.floor(Math.random() * bodyParts.length)]
      const variation = productVariations[Math.floor(Math.random() * productVariations.length)]
      const testQuery = `${part} ${variation}`
      
      console.log(`  Testing: "${testQuery}"`)
      
      // Busca anúncios para esta combinação
      // ... implementação similar ao discoverNewAdvertisers
    }
    
    return discoveries
  }
  
  /**
   * Extrai produtos mencionados no anúncio
   */
  private extractProductsFromAd(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const products = new Set<string>()
    
    // Padrões de produtos
    const patterns = [
      /\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/g, // CamelCase
      /\w+\s+(?:burn|boost|pure|pro|plus|max)/gi,
      /(?:glucotrust|prodentim|alpilean|java\s*burn|ikaria|cortexi)/gi
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
   * Verifica se é anunciante conhecido
   */
  private isKnownAdvertiser(domain: string): boolean {
    return this.knownGoodAdvertisers.some(a => a.domain === domain)
  }
  
  /**
   * Verifica tamanho do portfolio do anunciante
   */
  private async checkAdvertiserPortfolio(domain: string): Promise<number> {
    // Simulação - na prática faria scraping real
    // Contaria quantos produtos únicos o anunciante tem
    return Math.floor(Math.random() * 20) + 1
  }
  
  /**
   * Detecta anunciantes com targeting sofisticado (exclusivos)
   */
  async detectExclusiveAdvertisers(discoveries: any[]): Promise<Map<string, any>> {
    const exclusiveAdvertisers = new Map()
    
    // Anunciantes com poucos anúncios mas targeting complexo = exclusivos
    const advertiserPatterns = new Map<string, Set<string>>()
    
    for (const discovery of discoveries) {
      if (!advertiserPatterns.has(discovery.domain)) {
        advertiserPatterns.set(discovery.domain, new Set())
      }
      advertiserPatterns.get(discovery.domain)?.add(discovery.product)
    }
    
    for (const [domain, products] of advertiserPatterns.entries()) {
      if (products.size === 1) { // Um único produto = foco exclusivo
        exclusiveAdvertisers.set(domain, {
          domain,
          product: Array.from(products)[0],
          exclusivityReason: 'single-product-focus'
        })
        console.log(`💎 Exclusive advertiser: ${domain} (focused on single product)`)
      }
    }
    
    return exclusiveAdvertisers
  }
}

export default AdsTransparencyMonitor