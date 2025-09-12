/**
 * Google Custom Search API Implementation for Product Validation
 * Free tier: 100 searches per day
 */

import { API_CONFIG, isAPIEnabled } from '@/lib/config/api-config'

interface GoogleSearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
}

interface CompetitorAd {
  title: string
  description: string
  domain: string
  url: string
  callToActions: string[]
  benefits: string[]
  promotions: string[]
  urgencyWords: string[]
  queryType: string
}

interface GoogleSearchResponse {
  items: GoogleSearchResult[]
  searchInformation: {
    totalResults: string
    searchTime: number
  }
  queries: {
    request: Array<{
      totalResults: string
      searchTerms: string
    }>
  }
}

export class GoogleSearchValidator {
  private readonly config = API_CONFIG.google.customSearchAPI
  
  /**
   * Validate product using real Google Custom Search API with competitive intelligence
   */
  async validateProduct(productName: string): Promise<{
    score: number
    viable: boolean
    reasoning: string
    searchData: {
      totalResults: number
      specificResults: number
      genericResults: number
      searchTime: number
      competitionIndicators: {
        ecommerceResults: number
        reviewSites: number
        adResults: number
        highAuthorityDomains: number
        estimatedCPC: string
        competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High'
      }
      competitorIntelligence?: {
        topCompetitors: CompetitorAd[]
        commonBenefits: string[]
        commonCTAs: string[]
        commonPromotions: string[]
        patternAnalysis: {
          avgTitleLength: number
          mostUsedWords: string[]
          urgencyLevel: 'Low' | 'Medium' | 'High'
        }
      }
    }
  }> {
    try {
      // Check if API is configured
      if (!isAPIEnabled('google', 'customSearchAPI')) {
        console.log('🔄 Google Search API not configured, using enhanced mock data')
        return this.getEnhancedMockValidation(productName)
      }

      // Verify API key and search engine ID are present
      if (!this.config.apiKey || !this.config.searchEngineId) {
        console.warn('⚠️ Google Search API: Missing API key or Search Engine ID, using mock data')
        return this.getEnhancedMockValidation(productName)
      }

      console.log(`🔍 Running competitive intelligence analysis for: ${productName}`)
      
      const startTime = Date.now()
      
      // Multiple search queries for comprehensive analysis
      const searchQueries = [
        `"${productName}"`, // Brand specific
        `${productName} review`, // Review intent
        `${productName} buy`, // Purchase intent
        `${productName} official`, // Official sites
        `${productName} discount` // Promotional intent
      ]
      
      console.log(`📊 Running ${searchQueries.length} search queries for comprehensive analysis`)
      
      // Execute all searches in parallel for better performance
      const searchPromises = searchQueries.map(async (query, index) => {
        const searchUrl = new URL(this.config.baseUrl)
        searchUrl.searchParams.append('key', this.config.apiKey)
        searchUrl.searchParams.append('cx', this.config.searchEngineId)
        searchUrl.searchParams.append('q', query)
        searchUrl.searchParams.append('num', '10')
        searchUrl.searchParams.append('safe', 'active')
        
        const response = await fetch(searchUrl.toString())
        
        if (!response.ok) {
          const errorText = await response.text()
          
          // Handle specific API key errors
          if (response.status === 400 && errorText.includes('API key not valid')) {
            throw new Error('INVALID_API_KEY')
          }
          
          console.warn(`⚠️ Search query ${index + 1} failed:`, response.status, errorText)
          return null
        }
        
        const data: GoogleSearchResponse = await response.json()
        return { query, data, queryType: this.getQueryType(query) }
      })
      
      const searchResults = await Promise.all(searchPromises)
      const validResults = searchResults.filter(result => result !== null)
      
      if (validResults.length === 0) {
        throw new Error('All search queries failed')
      }
      
      console.log(`✅ Successfully completed ${validResults.length}/${searchQueries.length} searches`)
      
      // Use the first successful search for main validation data
      const mainSearch = validResults[0]
      const data: GoogleSearchResponse = mainSearch.data
      
      // Analyze main search results
      const analysis = this.analyzeSearchResults(data, productName)
      
      // Generate competitive intelligence from all searches
      const competitorIntelligence = await this.generateCompetitorIntelligence(validResults, productName)
      
      const endTime = Date.now()
      const processingTime = (endTime - startTime) / 1000
      
      console.log(`🎯 Competitive analysis completed in ${processingTime}s`)
      console.log(`📈 Found ${competitorIntelligence.topCompetitors.length} competitor ads`)
      console.log(`🔍 Common benefits: ${competitorIntelligence.commonBenefits.slice(0, 3).join(', ')}`)
      console.log(`📢 Common CTAs: ${competitorIntelligence.commonCTAs.slice(0, 3).join(', ')}`)
      
      return {
        score: analysis.score,
        viable: analysis.viable,
        reasoning: analysis.reasoning,
        searchData: {
          ...analysis.searchData,
          searchTime: processingTime,
          competitorIntelligence
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      if (errorMessage === 'INVALID_API_KEY') {
        console.error('🔑 Google Search API Key Error:')
        console.error('   ❌ The Google API key is invalid or expired')
        console.error('   📋 To fix this:')
        console.error('   1. Go to Google Cloud Console (console.cloud.google.com)')
        console.error('   2. Enable Custom Search API')
        console.error('   3. Create/regenerate API key')
        console.error('   4. Update .env.local with new key')
        console.error('   ⚠️ Current key:', this.config.apiKey ? `${this.config.apiKey.substring(0, 15)}...` : 'MISSING')
      } else {
        console.error('❌ Google Search API error:', errorMessage)
      }
      
      console.log('🔄 Falling back to enhanced mock data')
      return this.getEnhancedMockValidation(productName)
    }
  }

  /**
   * Analyze Google Search results to determine product viability
   */
  private analyzeSearchResults(data: GoogleSearchResponse, productName: string): {
    score: number
    viable: boolean
    reasoning: string
    searchData: {
      totalResults: number
      specificResults: number
      genericResults: number
      searchTime: number
      competitionIndicators: {
        ecommerceResults: number
        reviewSites: number
        adResults: number
        highAuthorityDomains: number
        estimatedCPC: string
        competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High'
      }
    }
  } {
    const results = data.items || []
    const totalResults = parseInt(data.searchInformation?.totalResults || '0')
    
    // Count specific vs generic results
    const specificResults = results.filter(result => 
      this.isSpecificResult(result, productName)
    ).length
    
    const genericResults = results.length - specificResults
    
    // Analyze competition indicators
    const competitionData = this.analyzeCompetition(results, productName, totalResults)
    
    // Calculate viability score
    let score = 0
    
    // Base score from total results
    if (totalResults > 100000) score += 20
    else if (totalResults > 10000) score += 15
    else if (totalResults > 1000) score += 10
    else if (totalResults > 100) score += 5
    
    // Specific results bonus (most important factor)
    score += (specificResults / results.length) * 60
    
    // Domain diversity bonus
    const uniqueDomains = new Set(results.map(r => r.displayLink)).size
    score += Math.min(uniqueDomains * 2, 20)
    
    // Competition penalty (NEW - very important!)
    if (competitionData.competitionLevel === 'Very High') {
      score -= 30 // Heavy penalty
    } else if (competitionData.competitionLevel === 'High') {
      score -= 20
    } else if (competitionData.competitionLevel === 'Medium') {
      score -= 10
    }
    
    // High authority domains penalty
    score -= (competitionData.highAuthorityDomains * 8)
    
    // Determine viability
    const viable = score >= 40 // Minimum threshold for viability
    
    // Generate reasoning with competition analysis
    let reasoning = ''
    const competitionWarning = competitionData.competitionLevel === 'Very High' ? ' ⚠️ WARNING: Very high competition detected!' : 
                              competitionData.competitionLevel === 'High' ? ' ⚠️ High competition - requires significant budget.' : ''
    
    if (score >= 80) {
      reasoning = `Highly viable product with ${specificResults} specific results. Competition: ${competitionData.competitionLevel} (${competitionData.highAuthorityDomains} authority domains). Est. CPC: ${competitionData.estimatedCPC}.${competitionWarning}`
    } else if (score >= 60) {
      reasoning = `Moderately viable product. Competition: ${competitionData.competitionLevel} with ${competitionData.highAuthorityDomains} major players. Est. CPC: ${competitionData.estimatedCPC}.${competitionWarning}`
    } else if (score >= 40) {
      reasoning = `Risky but possible. High competition (${competitionData.competitionLevel}) may make it difficult. Est. CPC: ${competitionData.estimatedCPC}.${competitionWarning}`
    } else {
      reasoning = `NOT RECOMMENDED. Competition too high (${competitionData.competitionLevel}) with ${competitionData.highAuthorityDomains} authority domains. Est. CPC: ${competitionData.estimatedCPC}. Consider other products.${competitionWarning}`
    }

    return {
      score: Math.round(score),
      viable,
      reasoning,
      searchData: {
        totalResults,
        specificResults,
        genericResults,
        searchTime: data.searchInformation?.searchTime || 0,
        competitionIndicators: competitionData
      }
    }
  }

  /**
   * Analyze competition indicators from search results
   */
  private analyzeCompetition(results: GoogleSearchResult[], productName: string, totalResults: number) {
    const highAuthorityDomains = ['amazon.com', 'walmart.com', 'target.com', 'cvs.com', 'walgreens.com', 'healthline.com', 'webmd.com']
    const reviewSiteDomains = ['trustpilot.com', 'sitejabber.com', 'bbb.org', 'consumeraffairs.com', 'glassdoor.com']
    const ecommerceDomains = ['shopify.com', 'squarespace.com', 'wix.com', 'wordpress.com']
    
    let ecommerceResults = 0
    let reviewSites = 0
    let adResults = 0
    let highAuthorityDomains_count = 0
    
    results.forEach(result => {
      const domain = result.displayLink.toLowerCase()
      
      // Check for high authority domains
      if (highAuthorityDomains.some(auth => domain.includes(auth))) {
        highAuthorityDomains_count++
      }
      
      // Check for review sites
      if (reviewSiteDomains.some(review => domain.includes(review))) {
        reviewSites++
      }
      
      // Check for ecommerce platforms
      if (ecommerceDomains.some(ecom => domain.includes(ecom))) {
        ecommerceResults++
      }
      
      // Check for potential ads (shopping results, affiliate sites)
      if (result.title.toLowerCase().includes('buy') || 
          result.title.toLowerCase().includes('sale') ||
          result.title.toLowerCase().includes('discount') ||
          result.snippet.toLowerCase().includes('official')) {
        adResults++
      }
    })
    
    // Estimate CPC based on competition indicators
    let estimatedCPC = '$0.50-$1.00'
    let competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High' = 'Low'
    
    if (highAuthorityDomains_count >= 3 || totalResults > 500000) {
      estimatedCPC = '$2.00-$5.00+'
      competitionLevel = 'Very High'
    } else if (highAuthorityDomains_count >= 2 || totalResults > 100000) {
      estimatedCPC = '$1.50-$3.00'
      competitionLevel = 'High'  
    } else if (highAuthorityDomains_count >= 1 || totalResults > 50000) {
      estimatedCPC = '$1.00-$2.00'
      competitionLevel = 'Medium'
    }
    
    return {
      ecommerceResults,
      reviewSites,
      adResults,
      highAuthorityDomains: highAuthorityDomains_count,
      estimatedCPC,
      competitionLevel
    }
  }

  /**
   * Get query type for competitive analysis
   */
  private getQueryType(query: string): string {
    if (query.includes('review')) return 'review'
    if (query.includes('buy')) return 'purchase'
    if (query.includes('official')) return 'official'
    if (query.includes('discount')) return 'promotional'
    return 'brand'
  }

  /**
   * Generate comprehensive competitive intelligence
   */
  private async generateCompetitorIntelligence(
    searchResults: Array<{ query: string; data: GoogleSearchResponse; queryType: string }>,
    productName: string
  ): Promise<{
    topCompetitors: CompetitorAd[]
    commonBenefits: string[]
    commonCTAs: string[]
    commonPromotions: string[]
    patternAnalysis: {
      avgTitleLength: number
      mostUsedWords: string[]
      urgencyLevel: 'Low' | 'Medium' | 'High'
    }
  }> {
    const allCompetitors: CompetitorAd[] = []
    
    // Extract competitor data from all searches
    for (const searchResult of searchResults) {
      const { data, queryType } = searchResult
      
      if (data.items) {
        for (const item of data.items.slice(0, 10)) { // Top 10 per query
          const competitor = this.extractCompetitorData(item, queryType, productName)
          if (competitor) {
            allCompetitors.push(competitor)
          }
        }
      }
    }
    
    // Remove duplicates based on domain + title similarity
    const uniqueCompetitors = this.deduplicateCompetitors(allCompetitors)
    
    // Sort by relevance and take top 10
    const topCompetitors = uniqueCompetitors
      .sort((a, b) => this.calculateRelevanceScore(b, productName) - this.calculateRelevanceScore(a, productName))
      .slice(0, 10)
    
    // Analyze patterns
    const patternAnalysis = this.analyzeCompetitorPatterns(topCompetitors)
    
    return {
      topCompetitors,
      commonBenefits: patternAnalysis.commonBenefits,
      commonCTAs: patternAnalysis.commonCTAs,
      commonPromotions: patternAnalysis.commonPromotions,
      patternAnalysis: {
        avgTitleLength: patternAnalysis.avgTitleLength,
        mostUsedWords: patternAnalysis.mostUsedWords,
        urgencyLevel: patternAnalysis.urgencyLevel
      }
    }
  }

  /**
   * Extract competitor data from search result
   */
  private extractCompetitorData(item: GoogleSearchResult, queryType: string, productName: string): CompetitorAd | null {
    const title = item.title
    const description = item.snippet
    const domain = item.displayLink
    const url = item.link
    
    // Skip if it's clearly not a competitor ad
    if (this.isNonCommercialResult(item)) {
      return null
    }
    
    return {
      title,
      description,
      domain,
      url,
      callToActions: this.extractCTAs(title, description),
      benefits: this.extractBenefits(title, description, productName),
      promotions: this.extractPromotions(title, description),
      urgencyWords: this.extractUrgencyWords(title, description),
      queryType
    }
  }

  /**
   * Extract Call-to-Actions from text
   */
  private extractCTAs(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const ctaPatterns = [
      'buy now', 'order now', 'get now', 'try now', 'click here',
      'shop now', 'learn more', 'read more', 'find out',
      'discover', 'explore', 'start now', 'join now',
      'sign up', 'get started', 'free trial', 'download'
    ]
    
    return ctaPatterns.filter(cta => text.includes(cta))
  }

  /**
   * Extract product benefits from text
   */
  private extractBenefits(title: string, description: string, productName: string): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const benefitPatterns = [
      'weight loss', 'fat burn', 'natural', 'organic', 'safe',
      'effective', 'fast results', 'proven', 'clinically tested',
      'fda approved', 'doctor recommended', 'no side effects',
      'money back', 'guarantee', 'risk free', 'satisfaction',
      'healthy', 'boost', 'improve', 'enhance', 'increase'
    ]
    
    return benefitPatterns.filter(benefit => text.includes(benefit))
  }

  /**
   * Extract promotional language from text
   */
  private extractPromotions(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const promoPatterns = [
      'free shipping', 'discount', 'sale', '50% off', 'limited time',
      'special offer', 'bonus', 'free trial', 'money back',
      'lowest price', 'best price', 'compare prices',
      'coupon', 'promo', 'deal'
    ]
    
    return promoPatterns.filter(promo => text.includes(promo))
  }

  /**
   * Extract urgency words from text
   */
  private extractUrgencyWords(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const urgencyPatterns = [
      'limited time', 'act now', 'hurry', 'don\'t miss',
      'expires', 'today only', 'while supplies last',
      'urgent', 'immediate', 'now', 'asap'
    ]
    
    return urgencyPatterns.filter(urgency => text.includes(urgency))
  }

  /**
   * Determine if a search result is specifically about the product
   */
  private isSpecificResult(result: GoogleSearchResult, productName: string): boolean {
    const productWords = productName.toLowerCase().split(' ')
    const titleLower = result.title.toLowerCase()
    const snippetLower = result.snippet.toLowerCase()
    
    // Check if product name appears in title (strong signal)
    if (productWords.every(word => titleLower.includes(word))) {
      return true
    }
    
    // Check for product-specific indicators
    const specificIndicators = [
      'review', 'scam', 'legit', 'does it work', 'side effects',
      'ingredients', 'buy', 'price', 'discount', 'coupon',
      'before and after', 'results', 'testimonial'
    ]
    
    const hasProductInSnippet = productWords.some(word => snippetLower.includes(word))
    const hasSpecificIndicator = specificIndicators.some(indicator => 
      titleLower.includes(indicator) || snippetLower.includes(indicator)
    )
    
    return hasProductInSnippet && hasSpecificIndicator
  }

  /**
   * Check if result is non-commercial (news, wiki, etc.)
   */
  private isNonCommercialResult(item: GoogleSearchResult): boolean {
    const domain = item.displayLink.toLowerCase()
    const nonCommercialDomains = [
      'wikipedia.org', 'news.', 'cnn.com', 'bbc.com',
      'reuters.com', 'gov.', 'edu.', '.org'
    ]
    
    return nonCommercialDomains.some(nonCommercial => domain.includes(nonCommercial))
  }

  /**
   * Remove duplicate competitors
   */
  private deduplicateCompetitors(competitors: CompetitorAd[]): CompetitorAd[] {
    const seen = new Set<string>()
    return competitors.filter(competitor => {
      const key = `${competitor.domain}-${competitor.title.slice(0, 50)}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  /**
   * Calculate relevance score for competitor
   */
  private calculateRelevanceScore(competitor: CompetitorAd, productName: string): number {
    let score = 0
    
    // Commercial indicators
    score += competitor.callToActions.length * 10
    score += competitor.benefits.length * 5
    score += competitor.promotions.length * 8
    score += competitor.urgencyWords.length * 3
    
    // Product relevance
    const productWords = productName.toLowerCase().split(' ')
    const titleWords = competitor.title.toLowerCase().split(' ')
    const matchingWords = productWords.filter(word => titleWords.includes(word))
    score += matchingWords.length * 15
    
    return score
  }

  /**
   * Analyze patterns across competitors
   */
  private analyzeCompetitorPatterns(competitors: CompetitorAd[]): {
    commonBenefits: string[]
    commonCTAs: string[]
    commonPromotions: string[]
    avgTitleLength: number
    mostUsedWords: string[]
    urgencyLevel: 'Low' | 'Medium' | 'High'
  } {
    if (competitors.length === 0) {
      return {
        commonBenefits: [],
        commonCTAs: [],
        commonPromotions: [],
        avgTitleLength: 0,
        mostUsedWords: [],
        urgencyLevel: 'Low'
      }
    }
    
    // Count occurrences
    const benefitCounts = new Map<string, number>()
    const ctaCounts = new Map<string, number>()
    const promoCounts = new Map<string, number>()
    const wordCounts = new Map<string, number>()
    let totalTitleLength = 0
    let totalUrgencyWords = 0
    
    competitors.forEach(competitor => {
      // Count benefits
      competitor.benefits.forEach(benefit => {
        benefitCounts.set(benefit, (benefitCounts.get(benefit) || 0) + 1)
      })
      
      // Count CTAs
      competitor.callToActions.forEach(cta => {
        ctaCounts.set(cta, (ctaCounts.get(cta) || 0) + 1)
      })
      
      // Count promotions
      competitor.promotions.forEach(promo => {
        promoCounts.set(promo, (promoCounts.get(promo) || 0) + 1)
      })
      
      // Count words
      const words = competitor.title.toLowerCase().split(' ')
      words.forEach(word => {
        if (word.length > 3) { // Skip short words
          wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
        }
      })
      
      totalTitleLength += competitor.title.length
      totalUrgencyWords += competitor.urgencyWords.length
    })
    
    // Get top items (appearing in at least 20% of competitors)
    const minFrequency = Math.max(1, Math.floor(competitors.length * 0.2))
    
    const commonBenefits = Array.from(benefitCounts.entries())
      .filter(([, count]) => count >= minFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([benefit]) => benefit)
      .slice(0, 10)
    
    const commonCTAs = Array.from(ctaCounts.entries())
      .filter(([, count]) => count >= minFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([cta]) => cta)
      .slice(0, 10)
    
    const commonPromotions = Array.from(promoCounts.entries())
      .filter(([, count]) => count >= minFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([promo]) => promo)
      .slice(0, 10)
    
    const mostUsedWords = Array.from(wordCounts.entries())
      .filter(([, count]) => count >= minFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
      .slice(0, 15)
    
    // Calculate urgency level
    const avgUrgencyPerCompetitor = totalUrgencyWords / competitors.length
    let urgencyLevel: 'Low' | 'Medium' | 'High' = 'Low'
    if (avgUrgencyPerCompetitor >= 2) urgencyLevel = 'High'
    else if (avgUrgencyPerCompetitor >= 1) urgencyLevel = 'Medium'
    
    return {
      commonBenefits,
      commonCTAs,
      commonPromotions,
      avgTitleLength: Math.round(totalTitleLength / competitors.length),
      mostUsedWords,
      urgencyLevel
    }
  }

  /**
   * Enhanced mock validation with realistic patterns
   * Used when API is not available
   */
  private getEnhancedMockValidation(productName: string): {
    score: number
    viable: boolean
    reasoning: string
    searchData: {
      totalResults: number
      specificResults: number
      genericResults: number
      searchTime: number
      competitionIndicators: {
        ecommerceResults: number
        reviewSites: number
        adResults: number
        highAuthorityDomains: number
        estimatedCPC: string
        competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High'
      }
    }
  } {
    // Simulate realistic search patterns based on product name characteristics
    const nameLength = productName.length
    const hasNumbers = /\d/.test(productName)
    const commonWords = ['pro', 'max', 'ultra', 'plus', 'advanced', 'premium']
    const hasCommonWords = commonWords.some(word => 
      productName.toLowerCase().includes(word)
    )
    
    // Simulate search volume based on name characteristics
    let mockTotalResults = 15000 + (nameLength * 1000)
    if (hasNumbers) mockTotalResults += 5000
    if (hasCommonWords) mockTotalResults += 10000
    
    // Simulate specific results ratio (realistic: 30-70%)
    const specificRatio = 0.3 + (Math.random() * 0.4)
    const mockSpecificResults = Math.round(10 * specificRatio)
    const mockGenericResults = 10 - mockSpecificResults
    
    // Calculate score using same logic as real API
    let score = 0
    if (mockTotalResults > 100000) score += 20
    else if (mockTotalResults > 10000) score += 15
    else if (mockTotalResults > 1000) score += 10
    
    score += (mockSpecificResults / 10) * 60
    score += 15 // Domain diversity bonus
    
    const viable = score >= 40
    
    let reasoning = ''
    if (score >= 80) {
      reasoning = `Highly viable product with ${mockSpecificResults} specific results. Strong market interest with ${mockTotalResults.toLocaleString()} total results. [Enhanced Mock Data]`
    } else if (score >= 60) {
      reasoning = `Moderately viable product. Good market presence but competitive landscape. [Enhanced Mock Data]`
    } else if (score >= 40) {
      reasoning = `Potentially viable but requires careful market analysis. [Enhanced Mock Data]`
    } else {
      reasoning = `Not recommended for promotion. Limited market interest detected. [Enhanced Mock Data]`
    }
    
    return {
      score: Math.round(score),
      viable,
      reasoning,
      searchData: {
        totalResults: mockTotalResults,
        specificResults: mockSpecificResults,
        genericResults: mockGenericResults,
        searchTime: 0.15 + (Math.random() * 0.1),
        competitionIndicators: {
          ecommerceResults: Math.floor(Math.random() * 3) + 1,
          reviewSites: Math.floor(Math.random() * 2) + 1,
          adResults: Math.floor(Math.random() * 4) + 2,
          highAuthorityDomains: Math.floor(Math.random() * 2),
          estimatedCPC: '$0.50-$2.00',
          competitionLevel: mockTotalResults > 100000 ? 'High' : mockTotalResults > 50000 ? 'Medium' : 'Low'
        }
      }
    }
  }
}

// Helper function to set up Google Custom Search API
export const setupGoogleSearchAPI = () => {
  const instructions = `
🔧 SETUP GOOGLE CUSTOM SEARCH API (FREE):

1. Go to Google Cloud Console (console.cloud.google.com)
2. Create new project or select existing
3. Enable "Custom Search API" in APIs & Services
4. Create API Key in Credentials
5. Go to Custom Search Engine (cse.google.com)
6. Create new search engine:
   - Sites to search: "*.com" (entire web)
   - Name: "Product Research Engine"
7. Copy Search Engine ID from setup page
8. Add to environment variables:
   GOOGLE_API_KEY=your_api_key_here
   GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
9. Set enabled: true in api-config.ts

FREE TIER LIMITS:
- 100 searches per day
- $5 per 1000 additional queries
- No setup cost
  `
  
  console.log(instructions)
  return instructions
}