/**
 * API Configuration for Free Services
 * Centralized configuration for all free APIs we can use
 */

export const API_CONFIG = {
  // Google APIs (Free tier)
  google: {
    customSearchAPI: {
      enabled: true, // ✅ ATIVADO - APIs configuradas
      apiKey: process.env.GOOGLE_API_KEY || '',
      searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || '',
      baseUrl: 'https://www.googleapis.com/customsearch/v1',
      dailyLimit: 100, // Free tier
      costPerQuery: 0 // First 100 free
    },
    
    youtubeAPI: {
      enabled: true, // ✅ ATIVADO - APIs configuradas
      apiKey: process.env.YOUTUBE_API_KEY || '',
      baseUrl: 'https://www.googleapis.com/youtube/v3',
      dailyLimit: 10000, // Free tier
      costPerQuery: 0 // Free up to quota
    }
  },

  // Alternative free sources
  alternatives: {
    // For YouTube data when API is not available
    youtubeAlternatives: [
      {
        name: 'YouTube RSS feeds',
        method: 'rss',
        baseUrl: 'https://www.youtube.com/feeds/videos.xml',
        limitations: 'Limited data, no analytics'
      },
      {
        name: 'YouTube-DL metadata',
        method: 'youtubedl',
        limitations: 'Requires external tool, may break'
      }
    ],

    // For Google Search when API is not available
    searchAlternatives: [
      {
        name: 'DuckDuckGo Instant Answer API',
        method: 'duckduckgo',
        baseUrl: 'https://api.duckduckgo.com/',
        limitations: 'Limited results, no ranking'
      },
      {
        name: 'Bing Search API',
        method: 'bing',
        baseUrl: 'https://api.bing.microsoft.com/v7.0/search',
        freeTier: '3000 transactions/month'
      }
    ]
  },

  // Web scraping targets (legal public data)
  scraping: {
    clickbank: {
      marketplaceUrl: 'https://clickbank.com/marketplace',
      searchUrl: 'https://clickbank.com/marketplace/search',
      rateLimitMs: 2000, // 2 seconds between requests
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProductResearchBot/1.0)'
      }
    },
    
    adsTransparency: {
      // These are public transparency pages - legal to scrape
      sources: [
        {
          name: 'Google Ads Transparency Report',
          url: 'https://adstransparency.google.com',
          method: 'public_data'
        },
        {
          name: 'Facebook Ad Library',
          url: 'https://www.facebook.com/ads/library',
          api: 'https://graph.facebook.com/v18.0/ads_archive',
          apiKey: process.env.FACEBOOK_ACCESS_TOKEN || '',
          free: true
        }
      ]
    }
  },

  // Rate limiting configuration
  rateLimits: {
    googleSearch: { requests: 100, period: 'day' },
    youtube: { requests: 10000, period: 'day' },
    scraping: { requests: 1, period: 2000 }, // 1 request per 2 seconds
    facebook: { requests: 200, period: 'hour' }
  }
}

// Helper functions
export const isAPIEnabled = (service: string, api: string): boolean => {
  return (API_CONFIG as any)[service]?.[api]?.enabled || false
}

export const getAPIKey = (service: string, api: string): string => {
  return (API_CONFIG as any)[service]?.[api]?.apiKey || ''
}

export const getRateLimit = (service: string) => {
  return API_CONFIG.rateLimits[service as keyof typeof API_CONFIG.rateLimits]
}