/**
 * Competitive Intelligence Engine
 * Análise inteligente de anúncios concorrentes com 6 navegadores diferentes
 * Identifica padrões de linguagem local e melhores performers
 */

import { GoogleAdsValidationEngine } from '@/lib/google-ads/validation-engine'
import { PuppeteerScraper } from '@/lib/scraping/puppeteer-scraper'

export interface CompetitorAd {
  headline: string
  description: string
  sitelinks: string[]
  callouts: string[]
  url: string
  position: number
  location: string
  language: string
  estimatedQualityScore: number
}

export interface CompetitiveAnalysis {
  keyword: string
  location: string
  language: string
  totalAdsFound: number
  topPerformers: CompetitorAd[]
  languagePatterns: {
    commonPhrases: { phrase: string, frequency: number, performance: number }[]
    localExpressions: string[]
    culturalAdaptations: string[]
    bestCallToActions: string[]
  }
  recommendations: {
    headlines: string[]
    descriptions: string[]
    callouts: string[]
    sitelinks: string[]
    reasoning: string[]
  }
}

export interface BrowserConfig {
  userAgent: string
  location: string
  language: string
  proxy?: string
}

export class CompetitiveIntelligenceEngine {
  private validationEngine = new GoogleAdsValidationEngine()
  private puppeteerScraper = new PuppeteerScraper({
    headless: true,
    timeout: 30000,
    maxRetries: 3,
    delayRange: [2000, 5000],
    rotateProxies: false
  })
  
  /**
   * Configurações de 6 navegadores diferentes para simular usuários reais
   */
  private browserConfigs: BrowserConfig[] = [
    {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'US',
      language: 'en-US'
    },
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'BR',
      language: 'pt-BR'
    },
    {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101',
      location: 'PL',
      language: 'pl-PL'
    },
    {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      location: 'DE',
      language: 'de-DE'
    },
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
      location: 'UK',
      language: 'en-GB'
    },
    {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      location: 'CA',
      language: 'en-CA'
    }
  ]

  /**
   * Análise completa de competidores para uma keyword específica
   */
  async analyzeCompetitors(
    keyword: string, 
    targetLocation: string, 
    targetLanguage: string
  ): Promise<CompetitiveAnalysis> {
    console.log(`🔍 Starting competitive analysis for: "${keyword}" in ${targetLocation}`)
    
    // 1. Scraping real com Puppeteer
    const allAds = await this.multirowserScraping(keyword, targetLocation)
    
    // 2. Análise de linguagem e performance
    const languagePatterns = this.analyzeLanguagePatterns(allAds, targetLanguage)
    
    // 3. Identificar top performers (não apenas mais comuns)
    const topPerformers = this.identifyTopPerformers(allAds)
    
    // 4. Gerar recomendações baseadas em intelligence
    const recommendations = this.generateIntelligentRecommendations(
      topPerformers,
      languagePatterns,
      targetLocation,
      targetLanguage
    )

    return {
      keyword,
      location: targetLocation,
      language: targetLanguage,
      totalAdsFound: allAds.length,
      topPerformers,
      languagePatterns,
      recommendations
    }
  }

  /**
   * Scraping com 6 navegadores diferentes
   */
  private async multirowserScraping(keyword: string, targetLocation: string): Promise<CompetitorAd[]> {
    const allAds: CompetitorAd[] = []
    
    console.log('🌐 Starting multi-browser scraping...')
    
    for (const browser of this.browserConfigs) {
      try {
        const ads = await this.scrapeWithBrowser(keyword, browser, targetLocation)
        allAds.push(...ads)
        
        // Delay entre requests para evitar detecção
        await this.delay(2000 + Math.random() * 3000)
        
      } catch (error) {
        console.error(`❌ Error with browser ${browser.location}:`, error)
      }
    }

    // Remover duplicatas baseado na URL
    const uniqueAds = allAds.filter((ad, index, self) => 
      index === self.findIndex(a => a.url === ad.url && a.headline === ad.headline)
    )

    console.log(`✅ Found ${uniqueAds.length} unique ads across ${this.browserConfigs.length} browsers`)
    
    return uniqueAds
  }

  /**
   * Scraping com um navegador específico (MOCK - implementar com Puppeteer)
   */
  private async scrapeWithBrowser(
    keyword: string, 
    browser: BrowserConfig, 
    targetLocation: string
  ): Promise<CompetitorAd[]> {
    // MOCK IMPLEMENTATION - Em produção, usar Puppeteer real
    console.log(`🔍 Scraping "${keyword}" with ${browser.location} browser...`)
    
    // Simular delay de scraping real
    await this.delay(1000 + Math.random() * 2000)
    
    // Mock data baseado na localização
    const mockAds: CompetitorAd[] = this.generateMockAds(keyword, browser, targetLocation)
    
    return mockAds
  }

  /**
   * Gera dados mock realistas para teste (substituir por Puppeteer real)
   */
  private generateMockAds(keyword: string, browser: BrowserConfig, targetLocation: string): CompetitorAd[] {
    const locationPatterns = {
      'PL': {
        headlines: [`Zamów ${keyword} Dziś`, `${keyword} - Najlepsze Ceny`, `Kup ${keyword} Online`],
        descriptions: [`Naturalny ${keyword} z gwarancją 60 dni`, `Premium ${keyword} - darmowa dostawa`],
        callouts: ['Darmowa Dostawa', 'Gwarancja 60 Dni', 'Naturalny Skład'],
        sitelinks: ['Opinie', 'Składniki', 'Kontakt']
      },
      'US': {
        headlines: [`Buy ${keyword} Now`, `${keyword} - Best Price`, `Order ${keyword} Today`],
        descriptions: [`Natural ${keyword} with 60-day guarantee`, `Premium ${keyword} - free shipping`],
        callouts: ['Free Shipping', '60-Day Guarantee', 'Natural Formula'],
        sitelinks: ['Reviews', 'Ingredients', 'Contact']
      },
      'BR': {
        headlines: [`Comprar ${keyword} Agora`, `${keyword} - Melhor Preço`, `${keyword} Original`],
        descriptions: [`${keyword} natural com garantia de 60 dias`, `${keyword} premium - frete grátis`],
        callouts: ['Frete Grátis', 'Garantia 60 Dias', 'Fórmula Natural'],
        sitelinks: ['Avaliações', 'Ingredientes', 'Contato']
      }
    }

    const patterns = locationPatterns[browser.location as keyof typeof locationPatterns] || locationPatterns['US']
    
    return patterns.headlines.map((headline, index) => ({
      headline,
      description: patterns.descriptions[index] || patterns.descriptions[0],
      sitelinks: patterns.sitelinks,
      callouts: patterns.callouts,
      url: `example-${index}.com`,
      position: index + 1,
      location: browser.location,
      language: browser.language,
      estimatedQualityScore: 8.5 - (index * 0.5) // Top ads têm score maior
    }))
  }

  /**
   * Analisa padrões de linguagem e expressões locais
   */
  private analyzeLanguagePatterns(ads: CompetitorAd[], targetLanguage: string) {
    const allText = ads.map(ad => `${ad.headline} ${ad.description} ${ad.callouts.join(' ')}`).join(' ')
    
    // Análise de frases comuns
    const words = allText.toLowerCase().split(/\s+/)
    const phraseFrequency: Record<string, { count: number, totalScore: number }> = {}
    
    // Análise de bi-gramas e tri-gramas
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`
      if (!phraseFrequency[bigram]) {
        phraseFrequency[bigram] = { count: 0, totalScore: 0 }
      }
      phraseFrequency[bigram].count++
      
      // Encontrar qual ad contém essa frase para pegar o quality score
      const containingAd = ads.find(ad => 
        ad.headline.toLowerCase().includes(bigram) || 
        ad.description.toLowerCase().includes(bigram)
      )
      if (containingAd) {
        phraseFrequency[bigram].totalScore += containingAd.estimatedQualityScore
      }
    }

    // Ordenar por performance (não apenas frequência)
    const commonPhrases = Object.entries(phraseFrequency)
      .filter(([phrase, data]) => data.count >= 2) // Aparecer pelo menos 2 vezes
      .map(([phrase, data]) => ({
        phrase,
        frequency: data.count,
        performance: data.totalScore / data.count // Score médio
      }))
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 10)

    // Identificar expressões locais específicas
    const localExpressions = this.identifyLocalExpressions(ads, targetLanguage)
    
    // Identificar adaptações culturais
    const culturalAdaptations = this.identifyCulturalAdaptations(ads, targetLanguage)
    
    // Melhores CTAs baseados em performance
    const bestCallToActions = ads
      .filter(ad => ad.estimatedQualityScore > 8)
      .flatMap(ad => this.extractCallToActions(ad.headline, ad.description))
      .slice(0, 5)

    return {
      commonPhrases,
      localExpressions,
      culturalAdaptations,
      bestCallToActions
    }
  }

  /**
   * Identifica top performers baseado em quality score, não frequência
   */
  private identifyTopPerformers(ads: CompetitorAd[]): CompetitorAd[] {
    return ads
      .sort((a, b) => b.estimatedQualityScore - a.estimatedQualityScore)
      .slice(0, 5) // Top 5 performers
  }

  /**
   * Gera recomendações inteligentes baseadas na análise
   */
  private generateIntelligentRecommendations(
    topPerformers: CompetitorAd[],
    languagePatterns: any,
    targetLocation: string,
    targetLanguage: string
  ) {
    const reasoning: string[] = []
    
    // Headlines baseados nos top performers
    const headlines = topPerformers.map(ad => {
      // Adaptar o headline mantendo a estrutura mas mudando o produto
      const adaptedHeadline = ad.headline.replace(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/, '[PRODUCT_NAME]')
      reasoning.push(`Headline adapted from top performer (score: ${ad.estimatedQualityScore})`)
      return adaptedHeadline
    })

    // Descriptions baseados em padrões de alta performance
    const descriptions = languagePatterns.commonPhrases
      .slice(0, 3)
      .map((pattern: any) => {
        reasoning.push(`Description uses high-performance phrase: "${pattern.phrase}" (performance: ${pattern.performance.toFixed(1)})`)
        return `Natural [PRODUCT_NAME] ${pattern.phrase} with satisfaction guarantee`
      })

    // Callouts baseados em expressões locais
    const callouts = languagePatterns.bestCallToActions
      .slice(0, 5)
      .map((cta: string) => {
        reasoning.push(`Callout adapted from best performing CTAs in ${targetLocation}`)
        return cta
      })

    // Sitelinks baseados em padrões culturais
    const sitelinks = topPerformers
      .flatMap(ad => ad.sitelinks)
      .filter((link, index, self) => self.indexOf(link) === index) // unique
      .slice(0, 6)

    // Validar tudo com Google Ads compliance
    const validatedHeadlines = this.validationEngine.validateHeadlines(headlines)
    const validatedDescriptions = this.validationEngine.validateDescriptions(descriptions)
    const validatedCallouts = this.validationEngine.validateCallouts(callouts)

    return {
      headlines: [...validatedHeadlines.valid, ...validatedHeadlines.corrected],
      descriptions: [...validatedDescriptions.valid, ...validatedDescriptions.corrected],
      callouts: [...validatedCallouts.valid, ...validatedCallouts.corrected],
      sitelinks,
      reasoning
    }
  }

  // Helper methods
  private identifyLocalExpressions(ads: CompetitorAd[], targetLanguage: string): string[] {
    // Mock - em produção, usar NLP libraries
    const localExpressions: Record<string, string[]> = {
      'pl-PL': ['dziś', 'natychmiast', 'bezpłatnie', 'gwarancja'],
      'pt-BR': ['hoje mesmo', 'imediatamente', 'grátis', 'garantia'],
      'en-US': ['today only', 'immediately', 'free', 'guarantee']
    }
    
    return localExpressions[targetLanguage] || []
  }

  private identifyCulturalAdaptations(ads: CompetitorAd[], targetLanguage: string): string[] {
    // Mock - em produção, analisar padrões culturais específicos
    return ['Local payment methods', 'Cultural urgency patterns', 'Regional pricing displays']
  }

  private extractCallToActions(headline: string, description: string): string[] {
    const text = `${headline} ${description}`.toLowerCase()
    const ctaPatterns = ['buy now', 'order', 'get', 'try', 'start', 'zamów', 'kup', 'comprar']
    
    return ctaPatterns.filter(cta => text.includes(cta))
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}