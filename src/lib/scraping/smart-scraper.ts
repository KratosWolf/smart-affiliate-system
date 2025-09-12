/**
 * Smart Web Scraper for Product Intelligence
 * Follows the path: Ad → Presell → Sales Page → Checkout → Platform Detection
 */

interface ScrapingResult {
  productName: string
  platform: 'clickbank' | 'smartadv' | 'drcash' | 'warriorplus' | 'jvzoo' | 'digistore24' | 'unknown'
  salesFunnel: {
    adUrl?: string
    presellUrl?: string
    salesPageUrl?: string
    checkoutUrl?: string
  }
  productDetails: {
    price: number
    currency: string
    paymentType: 'cpa' | 'commission' | 'unknown'
    vendor: string
    productDescription: string
  }
  marketingIntelligence: {
    headlines: string[]
    callToActions: string[]
    testimonials: string[]
    guarantees: string[]
    scarcityTactics: string[]
    socialProof: string[]
  }
  technicalDetails: {
    trackingCodes: string[]
    affiliateLinks: string[]
    redirectChain: string[]
  }
}

export class SmartScraper {
  private readonly delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  /**
   * Main scraping function that follows the complete funnel
   */
  async scrapeProductFunnel(startingUrl: string, productName: string): Promise<ScrapingResult> {
    console.log(`🕷️ Starting smart scraping for: ${productName}`)
    console.log(`📍 Starting URL: ${startingUrl}`)

    const result: ScrapingResult = {
      productName,
      platform: 'unknown',
      salesFunnel: {},
      productDetails: {
        price: 0,
        currency: 'USD',
        paymentType: 'unknown',
        vendor: '',
        productDescription: ''
      },
      marketingIntelligence: {
        headlines: [],
        callToActions: [],
        testimonials: [],
        guarantees: [],
        scarcityTactics: [],
        socialProof: []
      },
      technicalDetails: {
        trackingCodes: [],
        affiliateLinks: [],
        redirectChain: []
      }
    }

    try {
      // Step 1: Analyze the starting page (could be ad, presell, or sales page)
      const startingPageData = await this.scrapePage(startingUrl)
      result.salesFunnel.adUrl = startingUrl
      result.technicalDetails.redirectChain.push(startingUrl)

      // Step 2: Follow the funnel to find the sales page
      const salesPageUrl = await this.findSalesPage(startingPageData, startingUrl)
      if (salesPageUrl && salesPageUrl !== startingUrl) {
        result.salesFunnel.salesPageUrl = salesPageUrl
        result.technicalDetails.redirectChain.push(salesPageUrl)
      }

      // Step 3: Analyze the sales page
      const salesPageData = await this.scrapePage(salesPageUrl || startingUrl)
      this.extractMarketingIntelligence(salesPageData, result.marketingIntelligence)
      this.extractProductDetails(salesPageData, result.productDetails)

      // Step 4: Find and analyze the checkout page
      const checkoutUrl = await this.findCheckoutPage(salesPageData, salesPageUrl || startingUrl)
      if (checkoutUrl) {
        result.salesFunnel.checkoutUrl = checkoutUrl
        result.technicalDetails.redirectChain.push(checkoutUrl)
        
        const checkoutPageData = await this.scrapePage(checkoutUrl)
        result.platform = this.detectPlatform(checkoutPageData, checkoutUrl)
        
        // Get more accurate pricing from checkout
        const checkoutDetails = this.extractCheckoutDetails(checkoutPageData)
        if (checkoutDetails.price > 0) {
          result.productDetails.price = checkoutDetails.price
        }
      }

      // Step 5: Analyze affiliate links and tracking
      result.technicalDetails.affiliateLinks = this.extractAffiliateLinks(salesPageData)
      result.technicalDetails.trackingCodes = this.extractTrackingCodes(salesPageData)

      console.log(`✅ Smart scraping completed for ${productName}:`, {
        platform: result.platform,
        price: result.productDetails.price,
        funnelSteps: result.technicalDetails.redirectChain.length
      })

      return result

    } catch (error) {
      console.error('❌ Smart scraping error:', error)
      return result
    }
  }

  /**
   * Scrape a single page and return structured data
   */
  private async scrapePage(url: string): Promise<{
    html: string
    text: string
    links: string[]
    forms: any[]
    meta: Record<string, string>
    scripts: string[]
  }> {
    // In a real implementation, this would use a headless browser
    // For now, we'll simulate the structure
    console.log(`📄 Scraping page: ${url}`)
    
    // Add delay to be respectful
    await this.delay(2000)

    // This would be the actual fetch and parsing logic
    // Using a mock structure for demonstration
    return {
      html: `<html><head><title>Mock Page</title></head><body>Mock content for ${url}</body></html>`,
      text: `Mock text content from ${url}`,
      links: this.generateMockLinks(url),
      forms: this.generateMockForms(url),
      meta: { title: 'Mock Page', description: 'Mock description' },
      scripts: ['google-analytics.js', 'facebook-pixel.js']
    }
  }

  /**
   * Find the sales page from the current page
   */
  private async findSalesPage(pageData: any, currentUrl: string): Promise<string | null> {
    // Look for common sales page indicators
    const salesPageIndicators = [
      'order-now', 'buy-now', 'get-instant-access', 'add-to-cart',
      'limited-time', 'special-offer', 'discount', 'bonus'
    ]

    // Check links for sales page patterns
    for (const link of pageData.links) {
      const linkLower = link.toLowerCase()
      if (salesPageIndicators.some(indicator => linkLower.includes(indicator))) {
        return this.resolveUrl(link, currentUrl)
      }
    }

    return null
  }

  /**
   * Find the checkout page from sales page
   */
  private async findCheckoutPage(pageData: any, currentUrl: string): Promise<string | null> {
    const checkoutIndicators = [
      'checkout', 'order', 'payment', 'billing', 'secure',
      'cart', 'purchase', 'pay-now', 'credit-card'
    ]

    // Check forms first (checkout is usually a form submission)
    for (const form of pageData.forms) {
      if (form.action && checkoutIndicators.some(indicator => 
        form.action.toLowerCase().includes(indicator)
      )) {
        return this.resolveUrl(form.action, currentUrl)
      }
    }

    // Then check links
    for (const link of pageData.links) {
      const linkLower = link.toLowerCase()
      if (checkoutIndicators.some(indicator => linkLower.includes(indicator))) {
        return this.resolveUrl(link, currentUrl)
      }
    }

    return null
  }

  /**
   * Detect the platform based on checkout page
   */
  private detectPlatform(checkoutData: any, checkoutUrl: string): ScrapingResult['platform'] {
    const url = checkoutUrl.toLowerCase()
    const content = checkoutData.text.toLowerCase()

    // URL-based detection (most reliable)
    if (url.includes('clickbank') || url.includes('clkbank') || url.includes('1.clkbank.com')) {
      return 'clickbank'
    }
    if (url.includes('smartadv') || url.includes('smart-adv')) {
      return 'smartadv'
    }
    if (url.includes('drcash') || url.includes('dr-cash')) {
      return 'drcash'
    }
    if (url.includes('warriorplus') || url.includes('wplus')) {
      return 'warriorplus'
    }
    if (url.includes('jvzoo') || url.includes('jvz')) {
      return 'jvzoo'
    }
    if (url.includes('digistore24') || url.includes('digi1')) {
      return 'digistore24'
    }

    // Content-based detection (fallback)
    const platformKeywords = {
      clickbank: ['clickbank', 'clkbank', 'secure.avangate'],
      smartadv: ['smartadv', 'smart advertising'],
      drcash: ['drcash', 'dr cash'],
      warriorplus: ['warrior plus', 'warriorplus'],
      jvzoo: ['jvzoo', 'jv zoo'],
      digistore24: ['digistore24', 'digistore 24']
    }

    for (const [platform, keywords] of Object.entries(platformKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        return platform as ScrapingResult['platform']
      }
    }

    return 'unknown'
  }

  /**
   * Extract marketing intelligence from the page
   */
  private extractMarketingIntelligence(pageData: any, intelligence: ScrapingResult['marketingIntelligence']) {
    const text = pageData.text.toLowerCase()

    // Extract headlines (simulate finding H1, H2 tags)
    intelligence.headlines = [
      'Transform Your Life in 30 Days',
      'Breakthrough Scientific Discovery',
      'Limited Time Special Offer'
    ]

    // Extract call-to-actions
    const ctaPatterns = ['order now', 'buy now', 'get instant access', 'claim your', 'download now']
    intelligence.callToActions = ctaPatterns.filter(cta => text.includes(cta))

    // Extract guarantees
    const guaranteePatterns = ['money back guarantee', '30 day guarantee', 'risk free', 'satisfaction guaranteed']
    intelligence.guarantees = guaranteePatterns.filter(guarantee => text.includes(guarantee))

    // Extract scarcity tactics
    const scarcityPatterns = ['limited time', 'only available', 'exclusive offer', 'hurry', 'expires soon']
    intelligence.scarcityTactics = scarcityPatterns.filter(scarcity => text.includes(scarcity))

    // Extract social proof
    const socialProofPatterns = ['testimonials', 'customer reviews', 'success stories', 'verified buyers']
    intelligence.socialProof = socialProofPatterns.filter(proof => text.includes(proof))
  }

  /**
   * Extract product details from sales page
   */
  private extractProductDetails(pageData: any, details: ScrapingResult['productDetails']) {
    const text = pageData.text

    // Extract price (simulate finding price patterns)
    const priceMatches = text.match(/\$(\d+(?:\.\d{2})?)/g)
    if (priceMatches) {
      const prices = priceMatches.map((p: string) => parseFloat(p.replace('$', '')))
      details.price = Math.max(...prices) // Usually the main product price is the highest
    }

    // Extract vendor information
    const vendorPatterns = ['by ', 'created by ', 'developed by ']
    // This would extract actual vendor names from the content
    details.vendor = 'Health Innovations Corp' // Mock

    // Product description would be extracted from meta tags or main content
    details.productDescription = 'Revolutionary health supplement with proven results'
  }

  /**
   * Extract checkout-specific details
   */
  private extractCheckoutDetails(checkoutData: any): { price: number; currency: string } {
    // This would parse the actual checkout form for precise pricing
    return {
      price: 97, // Mock - would extract from checkout form
      currency: 'USD'
    }
  }

  /**
   * Extract affiliate links from page
   */
  private extractAffiliateLinks(pageData: any): string[] {
    const affiliatePatterns = [
      'hop.clickbank.net',
      'affiliates.smartadv.com',
      'track.drcash.com',
      'warriorplus.com/o2/',
      'jvz1.com/c/',
      'digi1.link'
    ]

    return pageData.links.filter((link: string) =>
      affiliatePatterns.some(pattern => link.includes(pattern))
    )
  }

  /**
   * Extract tracking codes from page
   */
  private extractTrackingCodes(pageData: any): string[] {
    const trackingPatterns = [
      'UA-', 'GTM-', 'fbq(', 'ga(', '_gaq', 'pixel',
      'track', 'analytics', 'conversion'
    ]

    const codes: string[] = []
    for (const script of pageData.scripts) {
      for (const pattern of trackingPatterns) {
        if (script.includes(pattern)) {
          codes.push(pattern)
        }
      }
    }

    return [...new Set(codes)] // Remove duplicates
  }

  /**
   * Helper: Resolve relative URLs to absolute
   */
  private resolveUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http')) return url
    if (url.startsWith('//')) return 'https:' + url
    if (url.startsWith('/')) {
      const base = new URL(baseUrl)
      return `${base.protocol}//${base.host}${url}`
    }
    return new URL(url, baseUrl).toString()
  }

  /**
   * Generate mock links for demonstration
   */
  private generateMockLinks(url: string): string[] {
    const mockLinks = [
      'https://example.com/order-now',
      'https://secure.example.com/checkout',
      'https://example.com/special-offer',
      '/testimonials',
      '/guarantee'
    ]
    
    return mockLinks.map(link => this.resolveUrl(link, url))
  }

  /**
   * Generate mock forms for demonstration
   */
  private generateMockForms(url: string): any[] {
    return [
      {
        action: 'https://secure.example.com/checkout',
        method: 'POST',
        fields: ['email', 'payment']
      }
    ]
  }
}

/**
 * Factory function to create scraper with rate limiting
 */
export const createSmartScraper = (options: {
  delayBetweenRequests?: number
  maxRetries?: number
  respectRobotsTxt?: boolean
} = {}) => {
  return new SmartScraper()
}

/**
 * Helper to scrape multiple products in parallel (with rate limiting)
 */
export const scrapeMultipleProducts = async (
  products: Array<{ url: string; name: string }>,
  maxConcurrent: number = 3
): Promise<ScrapingResult[]> => {
  const scraper = createSmartScraper()
  const results: ScrapingResult[] = []
  
  // Process in batches to respect rate limits
  for (let i = 0; i < products.length; i += maxConcurrent) {
    const batch = products.slice(i, i + maxConcurrent)
    const batchPromises = batch.map(product => 
      scraper.scrapeProductFunnel(product.url, product.name)
    )
    
    const batchResults = await Promise.allSettled(batchPromises)
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      }
    }
    
    // Delay between batches
    if (i + maxConcurrent < products.length) {
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
  
  return results
}