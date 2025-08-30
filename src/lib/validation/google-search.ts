import { GoogleSearchRequest, GoogleSearchResponse, SearchResult } from '@/types';

/**
 * Google Custom Search API client for product validation
 */
export class GoogleSearchClient {
  private apiKey: string;
  private searchEngineId: string;
  private baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor(apiKey?: string, searchEngineId?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_API_KEY || '';
    this.searchEngineId = searchEngineId || process.env.GOOGLE_SEARCH_ENGINE_ID || '';
    
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('⚠️ Google Search API credentials not configured');
    }
  }

  /**
   * Search for products and market information
   */
  async search(request: GoogleSearchRequest): Promise<GoogleSearchResponse> {
    if (!this.apiKey || !this.searchEngineId) {
      throw new Error('Google Search API not configured');
    }

    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        cx: this.searchEngineId,
        q: request.query,
        num: Math.min(request.resultsCount || 10, 10).toString(),
        safe: 'active',
      });

      if (request.country) {
        params.set('gl', request.country.toLowerCase());
      }

      if (request.language) {
        params.set('hl', request.language.toLowerCase());
      }

      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SmartAffiliateSystem/1.0',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const searchTime = Date.now() - startTime;

      return this.formatResponse(data, request.query, searchTime);
    } catch (error) {
      console.error('Google Search API error:', error);
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for product-specific information
   */
  async searchProduct(productName: string, options?: {
    includeReviews?: boolean;
    includePricing?: boolean;
    country?: string;
  }): Promise<{
    productInfo: SearchResult[];
    reviews: SearchResult[];
    pricing: SearchResult[];
    competition: SearchResult[];
  }> {
    const { includeReviews = true, includePricing = true, country } = options || {};

    // Base product search
    const productResults = await this.search({
      query: `"${productName}" buy`,
      country,
      resultsCount: 10
    });

    const results = {
      productInfo: productResults.results,
      reviews: [] as SearchResult[],
      pricing: [] as SearchResult[],
      competition: [] as SearchResult[],
    };

    // Search for reviews if requested
    if (includeReviews) {
      try {
        const reviewResults = await this.search({
          query: `"${productName}" review rating`,
          country,
          resultsCount: 5
        });
        results.reviews = reviewResults.results;
      } catch (error) {
        console.warn('Failed to fetch review results:', error);
      }
    }

    // Search for pricing if requested
    if (includePricing) {
      try {
        const pricingResults = await this.search({
          query: `"${productName}" price cost`,
          country,
          resultsCount: 5
        });
        results.pricing = pricingResults.results;
      } catch (error) {
        console.warn('Failed to fetch pricing results:', error);
      }
    }

    // Search for competition
    try {
      const competitionResults = await this.search({
        query: `${productName} alternative similar`,
        country,
        resultsCount: 5
      });
      results.competition = competitionResults.results;
    } catch (error) {
      console.warn('Failed to fetch competition results:', error);
    }

    return results;
  }

  /**
   * Get keyword suggestions for a product
   */
  async getKeywordSuggestions(baseKeyword: string, country?: string): Promise<string[]> {
    const suggestions = new Set<string>();

    // Common keyword modifiers for affiliate marketing
    const modifiers = [
      'buy',
      'review',
      'best',
      'cheap',
      'discount',
      'coupon',
      'deal',
      'price',
      'compare',
      'alternative'
    ];

    for (const modifier of modifiers) {
      try {
        const query = `${baseKeyword} ${modifier}`;
        const results = await this.search({
          query,
          country,
          resultsCount: 3
        });

        // Extract keywords from titles and descriptions
        results.results.forEach(result => {
          const text = `${result.title} ${result.description}`.toLowerCase();
          
          // Simple keyword extraction
          const words = text.match(/\b\w{3,}\b/g) || [];
          words.forEach(word => {
            if (word.includes(baseKeyword.toLowerCase()) || 
                modifiers.includes(word) ||
                word.length > 4) {
              suggestions.add(word);
            }
          });
        });
      } catch (error) {
        console.warn(`Failed to get suggestions for "${modifier}":`, error);
      }
    }

    return Array.from(suggestions).slice(0, 20);
  }

  /**
   * Analyze search competition level
   */
  async analyzeCompetition(keyword: string, country?: string): Promise<{
    level: 'low' | 'medium' | 'high';
    totalResults: number;
    topDomains: string[];
    adIndicators: number;
  }> {
    try {
      const results = await this.search({
        query: keyword,
        country,
        resultsCount: 10
      });

      // Extract domains
      const domains = results.results.map(result => {
        try {
          return new URL(result.url).hostname;
        } catch {
          return result.domain || 'unknown';
        }
      });

      // Count unique domains (diversity indicator)
      const uniqueDomains = [...new Set(domains)];
      
      // Look for ad indicators in results
      const adIndicators = results.results.filter(result =>
        result.title.toLowerCase().includes('ad') ||
        result.description.toLowerCase().includes('sponsored') ||
        result.url.includes('googleadservices') ||
        result.url.includes('doubleclick')
      ).length;

      // Determine competition level
      let level: 'low' | 'medium' | 'high';
      
      if (results.totalResults < 100000 && uniqueDomains.length > 7) {
        level = 'low';
      } else if (results.totalResults < 1000000 && adIndicators < 3) {
        level = 'medium';
      } else {
        level = 'high';
      }

      return {
        level,
        totalResults: results.totalResults,
        topDomains: uniqueDomains.slice(0, 5),
        adIndicators
      };
    } catch (error) {
      console.error('Competition analysis failed:', error);
      return {
        level: 'high', // Default to high competition on error
        totalResults: 0,
        topDomains: [],
        adIndicators: 0
      };
    }
  }

  /**
   * Format Google API response to our interface
   */
  private formatResponse(data: any, query: string, searchTime: number): GoogleSearchResponse {
    const items = data.items || [];
    
    return {
      query,
      totalResults: parseInt(data.searchInformation?.totalResults || '0'),
      searchTime,
      results: items.map((item: any, index: number) => ({
        title: item.title || '',
        url: item.link || '',
        description: item.snippet || '',
        domain: this.extractDomain(item.link),
        position: index + 1,
        featured: item.pagemap?.metatags?.[0]?.['og:type'] === 'product'
      })),
      relatedQueries: data.queries?.request?.[0]?.relatedQueries || [],
      suggestions: this.extractSuggestions(data)
    };
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Extract search suggestions from response
   */
  private extractSuggestions(data: any): string[] {
    const suggestions: string[] = [];
    
    // From related searches
    if (data.queries?.relatedSearches) {
      data.queries.relatedSearches.forEach((search: any) => {
        if (search.title) {
          suggestions.push(search.title);
        }
      });
    }

    // From spelling corrections
    if (data.spelling?.correctedQuery) {
      suggestions.push(data.spelling.correctedQuery);
    }

    return suggestions.slice(0, 10);
  }
}

/**
 * Default Google Search client instance
 */
export const googleSearchClient = new GoogleSearchClient();