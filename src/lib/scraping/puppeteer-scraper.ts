/**
 * Puppeteer Real Scraper - Enterprise Edition
 * Scraping inteligente de anúncios Google com 6 navegadores diferentes
 * Sistema de proxies por país, rotação avançada, anti-detecção militar
 */

import { CompetitorAd } from '@/lib/intelligence/competitive-intelligence-engine'
import { CountryProxyManager, type ProxyConfig } from '@/lib/proxies/country-proxy-manager'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'

export interface ScrapingConfig {
  headless: boolean
  timeout: number
  maxRetries: number
  delayRange: [number, number]
  rotateProxies: boolean
  proxies?: string[]
}

export interface BrowserSession {
  userAgent: string
  location: string
  language: string
  proxy?: string
  viewport: { width: number, height: number }
}

export class PuppeteerScraper {
  private config: ScrapingConfig
  private browserSessions: BrowserSession[]
  private proxyManager: CountryProxyManager

  constructor(config: ScrapingConfig) {
    this.config = {
      ...config,
      headless: config.headless ?? true,
      timeout: config.timeout ?? 30000,
      maxRetries: config.maxRetries ?? 3,
      delayRange: config.delayRange ?? [2000, 5000],
      rotateProxies: config.rotateProxies ?? true, // ✅ FORCE proxy rotation
    }

    // Inicializar sistema de proxies por país
    this.proxyManager = new CountryProxyManager()

    // 6 configurações diferentes de browser para parecer usuários reais
    this.browserSessions = [
      {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        location: 'US',
        language: 'en-US',
        viewport: { width: 1920, height: 1080 }
      },
      {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        location: 'BR', 
        language: 'pt-BR',
        viewport: { width: 1366, height: 768 }
      },
      {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
        location: 'PL',
        language: 'pl-PL', 
        viewport: { width: 1440, height: 900 }
      },
      {
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        location: 'DE',
        language: 'de-DE',
        viewport: { width: 1600, height: 900 }
      },
      {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (Version/17.0 Safari/605.1.15)',
        location: 'UK',
        language: 'en-GB',
        viewport: { width: 1280, height: 720 }
      },
      {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        location: 'CA',
        language: 'en-CA',
        viewport: { width: 1536, height: 864 }
      }
    ]
  }

  /**
   * Scraping multi-browser de anúncios Google com proxy por país
   */
  async scrapeGoogleAds(keyword: string, targetLocation: string): Promise<CompetitorAd[]> {
    console.log(`🔍 Starting enterprise multi-browser Google Ads scraping for: "${keyword}" in ${targetLocation}`)
    
    // ✅ ENTERPRISE MODE: Force real scraping, no fallbacks
    const puppeteer = await this.loadPuppeteer()
    
    if (!puppeteer) {
      throw new Error(`❌ Puppeteer is required for enterprise competitive intelligence. No fallbacks allowed.`)
    }

    // ✅ COUNTRY-SPECIFIC PROXY: Obter proxy para o país alvo
    const countryProxy = this.proxyManager.getBestProxyForCountry(targetLocation)
    
    if (!countryProxy) {
      console.warn(`⚠️  No proxy available for ${targetLocation}, proceeding without proxy (may affect accuracy)`)
    } else {
      console.log(`🌍 Using ${countryProxy.region} proxy for ${targetLocation} (${countryProxy.reliability}% reliability)`)
    }

    const allAds: CompetitorAd[] = []

    for (const session of this.browserSessions) {
      try {
        console.log(`🌐 Scraping with ${session.location} browser...`)
        
        // ✅ USE COUNTRY PROXY: Passar proxy específico do país para a sessão
        const sessionAds = await this.scrapeWithSession(puppeteer, keyword, session, targetLocation, countryProxy)
        allAds.push(...sessionAds)
        
        // Anti-detection delay
        await this.randomDelay()
        
      } catch (error) {
        console.error(`❌ Error scraping with ${session.location} session:`, error)
        // Continuar com outras sessões
      }
    }

    // Remover duplicatas e processar
    const uniqueAds = this.deduplicateAds(allAds)
    console.log(`✅ Scraped ${uniqueAds.length} unique ads across ${this.browserSessions.length} browsers`)
    
    return uniqueAds
  }

  /**
   * Scraping com uma sessão específica de browser + proxy do país
   */
  private async scrapeWithSession(
    puppeteer: any,
    keyword: string,
    session: BrowserSession,
    targetLocation: string,
    countryProxy?: ProxyConfig | null
  ): Promise<CompetitorAd[]> {
    
    let browser = null
    let page = null
    
    try {
      // ✅ ENTERPRISE PROXY SETUP: Configurar browser com proxy específico do país
      const browserArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-features=VizDisplayCompositor'
      ]

      // ✅ USAR PROXY DO PAÍS: Configurar proxy específico para o país alvo
      if (countryProxy && this.config.rotateProxies) {
        const proxyUrl = this.proxyManager.buildProxyUrl(countryProxy)
        browserArgs.push(`--proxy-server=${proxyUrl}`)
        console.log(`🔗 Using country proxy: ${countryProxy.region} (${countryProxy.host}:${countryProxy.port})`)
      } else if (session.proxy) {
        // Fallback para proxy da sessão (se houver)
        browserArgs.push(`--proxy-server=${session.proxy}`)
      }

      browser = await puppeteer.launch({
        headless: this.config.headless,
        args: browserArgs,
        timeout: this.config.timeout
      })

      page = await browser.newPage()
      
      // Anti-detection measures
      await this.setupAntiDetection(page, session)
      
      // ✅ NAVEGAR PARA GOOGLE LOCAL: Usar domínio específico do país alvo
      const googleUrl = this.buildGoogleSearchUrl(keyword, targetLocation)
      console.log(`🌐 Navigating to: ${googleUrl}`)
      
      await page.goto(googleUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: this.config.timeout 
      })

      // Aguardar carregamento dos anúncios  
      await new Promise(resolve => setTimeout(resolve, this.randomBetween(1000, 3000)))

      // Extrair anúncios
      const ads = await this.extractAdsFromPage(page, session)
      
      return ads.map((ad, index) => ({
        ...ad,
        position: index + 1,
        location: session.location,
        language: session.language,
        estimatedQualityScore: this.estimateQualityScore(ad, index)
      }))

    } finally {
      if (page) await page.close().catch(() => {})
      if (browser) await browser.close().catch(() => {})
    }
  }

  /**
   * Configurar medidas anti-detecção
   */
  private async setupAntiDetection(page: any, session: BrowserSession) {
    // User Agent
    await page.setUserAgent(session.userAgent)
    
    // Viewport
    await page.setViewport(session.viewport)
    
    // Language
    await page.setExtraHTTPHeaders({
      'Accept-Language': `${session.language},en;q=0.9`
    })

    // Remover webdriver property
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      })
    })

    // Mock de plugins e outras properties
    await page.evaluateOnNewDocument(() => {
      // Mock Chrome plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5]
      })
      
      // Mock permissions
      Object.defineProperty(navigator, 'permissions', {
        get: () => ({ query: () => Promise.resolve({ state: 'granted' }) })
      })
    })
  }

  /**
   * Extrair anúncios da página do Google
   */
  private async extractAdsFromPage(page: any, session: BrowserSession): Promise<any[]> {
    try {
      // Aguardar anúncios carregarem
      await page.waitForSelector('[data-text-ad], .ads-ad, .ad_cclk', { 
        timeout: 5000 
      }).catch(() => {
        console.log('⚠️  No ads selector found, trying alternative selectors')
      })

      // Extrair dados dos anúncios
      const ads = await page.evaluate(() => {
        const adElements = document.querySelectorAll([
          '[data-text-ad]',
          '.ads-ad', 
          '.ad_cclk',
          '.commercial-unit-desktop-top',
          '.ads-visurl'
        ].join(','))

        const extractedAds: any[] = []

        adElements.forEach((element: Element) => {
          try {
            // Extrair headline
            const headlineEl = element.querySelector('h3, .ads-creative h3, [role="heading"]')
            const headline = headlineEl?.textContent?.trim() || ''

            // Extrair description  
            const descEl = element.querySelector('.ads-creative .ads-creative-text, .ads-creative span:not(h3)')
            const description = descEl?.textContent?.trim() || ''

            // Extrair URL
            const linkEl = element.querySelector('a')
            const url = linkEl?.getAttribute('href') || ''

            // Extrair sitelinks
            const sitelinksEls = element.querySelectorAll('.ads-sitelinks a, .ads-visurl a')
            const sitelinks = Array.from(sitelinksEls).map(el => el.textContent?.trim() || '')

            // Extrair callouts (extensões)
            const calloutsEls = element.querySelectorAll('.ads-extensions span, .ads-callout')
            const callouts = Array.from(calloutsEls).map(el => el.textContent?.trim() || '')

            if (headline && headline.length > 5) { // Filtrar elementos inválidos
              extractedAds.push({
                headline,
                description,
                url,
                sitelinks: sitelinks.filter(s => s.length > 0),
                callouts: callouts.filter(c => c.length > 0 && c.length <= 25)
              })
            }

          } catch (error) {
            console.error('Error extracting ad element:', error)
          }
        })

        return extractedAds
      })

      return ads
      
    } catch (error) {
      console.error('Error extracting ads from page:', error)
      return []
    }
  }

  /**
   * Carregar Puppeteer dinamicamente
   */
  private async loadPuppeteer() {
    try {
      // Dynamic import para evitar problemas em ambientes sem Puppeteer
      const puppeteer = await import('puppeteer')
      return puppeteer.default
    } catch (error) {
      console.warn('Puppeteer not available:', error)
      return null
    }
  }

  /**
   * Construir URL de busca do Google com domínio e localização específicos por país
   */
  private buildGoogleSearchUrl(keyword: string, location: string): string {
    const countryCode = location.toUpperCase()
    
    // ✅ DOMÍNIOS GOOGLE POR PAÍS: Usar domínio local para resultados mais precisos
    const googleDomains: Record<string, string> = {
      'IT': 'google.it',      // 🇮🇹 Itália
      'PL': 'google.pl',      // 🇵🇱 Polônia  
      'BR': 'google.com.br',  // 🇧🇷 Brasil
      'DE': 'google.de',      // 🇩🇪 Alemanha
      'FR': 'google.fr',      // 🇫🇷 França
      'ES': 'google.es',      // 🇪🇸 Espanha
      'UK': 'google.co.uk',   // 🇬🇧 Reino Unido
      'CA': 'google.ca',      // 🇨🇦 Canadá
      'US': 'google.com'      // 🇺🇸 EUA (padrão)
    }
    
    const domain = googleDomains[countryCode] || 'google.com'
    
    const params = new URLSearchParams({
      q: keyword,
      gl: location.toLowerCase(), // Country code
      hl: this.getLanguageForLocation(location),
      num: '20' // Number of results
    })
    
    const searchUrl = `https://www.${domain}/search?${params.toString()}`
    console.log(`🎯 Searching on local Google: ${domain} for country ${countryCode}`)
    
    return searchUrl
  }

  /**
   * Estimar quality score baseado na posição e conteúdo
   */
  private estimateQualityScore(ad: any, position: number): number {
    let score = 10 - (position * 0.5) // Ads no topo têm score maior
    
    // Bonus por ter sitelinks
    if (ad.sitelinks && ad.sitelinks.length > 0) score += 0.5
    
    // Bonus por ter callouts
    if (ad.callouts && ad.callouts.length > 0) score += 0.3
    
    // Bonus por headline bem estruturado
    if (ad.headline && ad.headline.includes('|') || ad.headline.includes('-')) score += 0.2
    
    return Math.max(1, Math.min(10, score))
  }

  /**
   * Remover anúncios duplicados
   */
  private deduplicateAds(ads: CompetitorAd[]): CompetitorAd[] {
    const seen = new Set<string>()
    return ads.filter(ad => {
      const key = `${ad.headline}-${ad.url}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  /**
   * Fallback data se Puppeteer não estiver disponível
   */
  private getFallbackData(keyword: string, targetLocation: string): CompetitorAd[] {
    console.log('🔄 Using fallback mock data for competitive analysis')
    
    // Retornar dados mock realistas
    return [
      {
        headline: `Buy ${keyword} Online - Best Price`,
        description: `Premium ${keyword} with fast delivery and guarantee`,
        sitelinks: ['Reviews', 'Ingredients', 'Contact'],
        callouts: ['Free Shipping', '60-Day Guarantee'],
        url: 'https://example1.com',
        position: 1,
        location: targetLocation,
        language: this.getLanguageForLocation(targetLocation),
        estimatedQualityScore: 8.5
      },
      {
        headline: `${keyword} - Official Store`,
        description: `Natural ${keyword} supplement - clinically tested formula`,
        sitelinks: ['Testimonials', 'FAQ', 'Support'],
        callouts: ['Money Back', 'Natural Formula'],
        url: 'https://example2.com', 
        position: 2,
        location: targetLocation,
        language: this.getLanguageForLocation(targetLocation),
        estimatedQualityScore: 8.0
      }
    ]
  }

  /**
   * Helpers
   */
  private getLanguageForLocation(location: string): string {
    const languageMap: Record<string, string> = {
      'US': 'en',
      'BR': 'pt',
      'PL': 'pl', 
      'DE': 'de',
      'UK': 'en',
      'CA': 'en'
    }
    return languageMap[location] || 'en'
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private async randomDelay(): Promise<void> {
    const delay = this.randomBetween(this.config.delayRange[0], this.config.delayRange[1])
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}