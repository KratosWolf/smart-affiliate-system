/**
 * YouTube Data API v3 Implementation for Product Intelligence
 * Free tier: 10,000 requests per day
 */

import { API_CONFIG, isAPIEnabled } from '@/lib/config/api-config'

interface YouTubeVideo {
  id: string
  title: string
  description: string
  channelId: string
  channelTitle: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  duration: string
  tags: string[]
}

interface YouTubeChannel {
  id: string
  title: string
  description: string
  subscriberCount: number
  viewCount: number
  videoCount: number
  customUrl: string
  publishedAt: string
}

interface ProductYouTubeIntelligence {
  productName: string
  totalVideosFound: number
  totalViews: number
  averageViews: number
  promotingChannels: YouTubeChannel[]
  topVideos: YouTubeVideo[]
  sentimentAnalysis: {
    positive: number
    neutral: number
    negative: number
  }
  exclusivityIndicators: string[]
  hotScore: number
  recommendations: string[]
}

export class YouTubeIntelligenceEngine {
  private readonly config = API_CONFIG.google.youtubeAPI

  /**
   * Analyze product presence on YouTube using real API
   */
  async analyzeProductOnYouTube(productName: string): Promise<ProductYouTubeIntelligence> {
    try {
      if (!isAPIEnabled('google', 'youtubeAPI')) {
        console.log('🔄 YouTube API not configured, using enhanced mock data')
        return this.getEnhancedMockIntelligence(productName)
      }

      console.log(`📺 Running real YouTube intelligence for: ${productName}`)

      // 1. Search for videos mentioning the product
      const videos = await this.searchVideos(productName)
      
      // 2. Get detailed channel information
      const channels = await this.getChannelDetails(videos)
      
      // 3. Analyze the data
      const intelligence = this.analyzeYouTubeData(productName, videos, channels)
      
      console.log('✅ Real YouTube intelligence completed:', {
        videosFound: intelligence.totalVideosFound,
        channelsFound: intelligence.promotingChannels.length,
        hotScore: intelligence.hotScore
      })

      return intelligence

    } catch (error) {
      console.error('❌ YouTube API error:', error)
      console.log('🔄 Falling back to enhanced mock data')
      return this.getEnhancedMockIntelligence(productName)
    }
  }

  /**
   * Search for videos using YouTube Data API v3
   */
  private async searchVideos(productName: string): Promise<YouTubeVideo[]> {
    const searchQueries = [
      `${productName} review`,
      `${productName} scam`,
      `${productName} results`,
      `${productName} honest review`,
      productName
    ]

    const allVideos: YouTubeVideo[] = []

    for (const query of searchQueries) {
      try {
        // Search for videos
        const searchUrl = new URL(`${this.config.baseUrl}/search`)
        searchUrl.searchParams.append('key', this.config.apiKey)
        searchUrl.searchParams.append('q', query)
        searchUrl.searchParams.append('part', 'snippet')
        searchUrl.searchParams.append('type', 'video')
        searchUrl.searchParams.append('maxResults', '20')
        searchUrl.searchParams.append('order', 'relevance')
        searchUrl.searchParams.append('safeSearch', 'strict')

        const response = await fetch(searchUrl.toString())
        if (!response.ok) continue

        const data = await response.json()
        const videoIds = data.items?.map((item: any) => item.id.videoId) || []

        if (videoIds.length === 0) continue

        // Get detailed video statistics
        const statsUrl = new URL(`${this.config.baseUrl}/videos`)
        statsUrl.searchParams.append('key', this.config.apiKey)
        statsUrl.searchParams.append('id', videoIds.join(','))
        statsUrl.searchParams.append('part', 'snippet,statistics,contentDetails')

        const statsResponse = await fetch(statsUrl.toString())
        if (!statsResponse.ok) continue

        const statsData = await statsResponse.json()
        
        const videos = statsData.items?.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          viewCount: parseInt(item.statistics.viewCount || '0'),
          likeCount: parseInt(item.statistics.likeCount || '0'),
          commentCount: parseInt(item.statistics.commentCount || '0'),
          duration: item.contentDetails.duration,
          tags: item.snippet.tags || []
        })) || []

        allVideos.push(...videos)

        // Rate limiting - YouTube allows 100 requests per 100 seconds
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`Error searching for "${query}":`, error)
        continue
      }
    }

    // Remove duplicates and return
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    )

    return uniqueVideos
  }

  /**
   * Get detailed channel information
   */
  private async getChannelDetails(videos: YouTubeVideo[]): Promise<YouTubeChannel[]> {
    const uniqueChannelIds = [...new Set(videos.map(v => v.channelId))]
    
    if (uniqueChannelIds.length === 0) return []

    try {
      const channelUrl = new URL(`${this.config.baseUrl}/channels`)
      channelUrl.searchParams.append('key', this.config.apiKey)
      channelUrl.searchParams.append('id', uniqueChannelIds.join(','))
      channelUrl.searchParams.append('part', 'snippet,statistics')

      const response = await fetch(channelUrl.toString())
      if (!response.ok) return []

      const data = await response.json()
      
      return data.items?.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
        viewCount: parseInt(item.statistics.viewCount || '0'),
        videoCount: parseInt(item.statistics.videoCount || '0'),
        customUrl: item.snippet.customUrl || '',
        publishedAt: item.snippet.publishedAt
      })) || []

    } catch (error) {
      console.error('Error getting channel details:', error)
      return []
    }
  }

  /**
   * Analyze YouTube data to generate intelligence
   */
  private analyzeYouTubeData(
    productName: string,
    videos: YouTubeVideo[],
    channels: YouTubeChannel[]
  ): ProductYouTubeIntelligence {
    // Filter videos that actually mention the product
    const relevantVideos = videos.filter(video => 
      this.isRelevantVideo(video, productName)
    )

    const totalViews = relevantVideos.reduce((sum, v) => sum + v.viewCount, 0)
    const averageViews = relevantVideos.length > 0 ? totalViews / relevantVideos.length : 0

    // Analyze sentiment from titles and descriptions
    const sentiment = this.analyzeSentiment(relevantVideos)

    // Detect exclusivity indicators
    const exclusivityIndicators = this.detectExclusivityIndicators(relevantVideos, channels)

    // Calculate hot score
    const hotScore = this.calculateHotScore(relevantVideos, channels)

    // Generate recommendations
    const recommendations = this.generateRecommendations(relevantVideos, channels, hotScore)

    return {
      productName,
      totalVideosFound: relevantVideos.length,
      totalViews,
      averageViews: Math.round(averageViews),
      promotingChannels: channels,
      topVideos: relevantVideos
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 10),
      sentimentAnalysis: sentiment,
      exclusivityIndicators,
      hotScore,
      recommendations
    }
  }

  /**
   * Check if video is actually relevant to the product
   */
  private isRelevantVideo(video: YouTubeVideo, productName: string): boolean {
    const productWords = productName.toLowerCase().split(' ')
    const titleLower = video.title.toLowerCase()
    const descriptionLower = video.description.toLowerCase()

    // Must have product name in title or description
    const hasProductName = productWords.every(word => 
      titleLower.includes(word) || descriptionLower.includes(word)
    )

    if (!hasProductName) return false

    // Should have relevant keywords
    const relevantKeywords = [
      'review', 'scam', 'legit', 'honest', 'opinion', 'experience',
      'results', 'before', 'after', 'works', 'worth', 'buy',
      'price', 'discount', 'bonus', 'testimonial', 'unboxing'
    ]

    const hasRelevantKeywords = relevantKeywords.some(keyword =>
      titleLower.includes(keyword) || descriptionLower.includes(keyword)
    )

    return hasRelevantKeywords
  }

  /**
   * Analyze sentiment of video titles and descriptions
   */
  private analyzeSentiment(videos: YouTubeVideo[]): {
    positive: number
    neutral: number
    negative: number
  } {
    const positiveWords = ['amazing', 'great', 'excellent', 'love', 'best', 'perfect', 'works', 'results']
    const negativeWords = ['scam', 'fake', 'bad', 'terrible', 'waste', 'fraud', 'lie', 'awful']

    let positive = 0
    let negative = 0
    let neutral = 0

    videos.forEach(video => {
      const text = `${video.title} ${video.description}`.toLowerCase()
      
      const positiveCount = positiveWords.filter(word => text.includes(word)).length
      const negativeCount = negativeWords.filter(word => text.includes(word)).length

      if (positiveCount > negativeCount) positive++
      else if (negativeCount > positiveCount) negative++
      else neutral++
    })

    const total = videos.length || 1
    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100)
    }
  }

  /**
   * Detect exclusivity indicators
   */
  private detectExclusivityIndicators(videos: YouTubeVideo[], channels: YouTubeChannel[]): string[] {
    const indicators: string[] = []

    if (videos.length <= 5) {
      indicators.push('Very few videos found - potentially exclusive')
    }

    if (channels.length <= 3) {
      indicators.push('Only promoted by few channels - limited distribution')
    }

    const smallChannels = channels.filter(c => c.subscriberCount < 50000).length
    if (smallChannels / channels.length > 0.5) {
      indicators.push('Promoted mostly by smaller channels - niche product')
    }

    const highEngagementVideos = videos.filter(v => 
      v.likeCount / Math.max(v.viewCount, 1) > 0.05
    ).length

    if (highEngagementVideos / videos.length > 0.7) {
      indicators.push('High engagement rate - quality exclusive content')
    }

    return indicators
  }

  /**
   * Calculate hot score based on YouTube activity
   */
  private calculateHotScore(videos: YouTubeVideo[], channels: YouTubeChannel[]): number {
    if (videos.length === 0) return 0

    let score = 0

    // Video count score (0-25 points)
    score += Math.min(videos.length * 3, 25)

    // View count score (0-25 points)
    const avgViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length
    if (avgViews > 100000) score += 25
    else if (avgViews > 50000) score += 20
    else if (avgViews > 10000) score += 15
    else if (avgViews > 1000) score += 10
    else score += 5

    // Channel quality score (0-25 points)
    const avgSubscribers = channels.reduce((sum, c) => sum + c.subscriberCount, 0) / channels.length
    if (avgSubscribers > 100000) score += 25
    else if (avgSubscribers > 50000) score += 20
    else if (avgSubscribers > 10000) score += 15
    else score += 10

    // Recent activity score (0-25 points)
    const recentVideos = videos.filter(v => {
      const publishedDate = new Date(v.publishedAt)
      const monthsAgo = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      return monthsAgo <= 6
    })

    score += Math.min((recentVideos.length / videos.length) * 25, 25)

    return Math.min(Math.round(score), 100)
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(
    videos: YouTubeVideo[], 
    channels: YouTubeChannel[], 
    hotScore: number
  ): string[] {
    const recommendations: string[] = []

    if (hotScore >= 80) {
      recommendations.push('🔥 Hot product! Consider immediate campaign launch')
    } else if (hotScore >= 60) {
      recommendations.push('📊 Good potential, test with small budget first')
    } else if (hotScore >= 40) {
      recommendations.push('⚠️ Moderate interest, deeper research recommended')
    } else {
      recommendations.push('❌ Low YouTube presence, consider other products')
    }

    if (videos.length > 0) {
      const topChannels = channels
        .sort((a, b) => b.subscriberCount - a.subscriberCount)
        .slice(0, 3)
        .map(c => c.title)

      recommendations.push(`📺 Top promoting channels: ${topChannels.join(', ')}`)
    }

    if (videos.some(v => v.title.toLowerCase().includes('scam'))) {
      recommendations.push('⚠️ Some scam-related content found, verify product legitimacy')
    }

    return recommendations
  }

  /**
   * Enhanced mock intelligence when API is not available
   */
  private getEnhancedMockIntelligence(productName: string): ProductYouTubeIntelligence {
    // Simulate realistic patterns
    const mockVideoCount = 3 + Math.floor(Math.random() * 15)
    const mockTotalViews = mockVideoCount * (25000 + Math.floor(Math.random() * 100000))
    
    return {
      productName,
      totalVideosFound: mockVideoCount,
      totalViews: mockTotalViews,
      averageViews: Math.round(mockTotalViews / mockVideoCount),
      promotingChannels: [
        {
          id: 'mock1',
          title: 'Health Review Pro',
          description: 'Product reviews and health tips',
          subscriberCount: 85000,
          viewCount: 2500000,
          videoCount: 340,
          customUrl: '@healthreviewpro',
          publishedAt: '2020-03-15T00:00:00Z'
        }
      ],
      topVideos: [
        {
          id: 'mock_video_1',
          title: `${productName} Review - My Honest Opinion`,
          description: `Complete review of ${productName} with real results`,
          channelId: 'mock1',
          channelTitle: 'Health Review Pro',
          publishedAt: new Date().toISOString(),
          viewCount: 67000,
          likeCount: 1200,
          commentCount: 89,
          duration: 'PT12M34S',
          tags: ['review', 'health', 'supplement']
        }
      ],
      sentimentAnalysis: {
        positive: 70,
        neutral: 20,
        negative: 10
      },
      exclusivityIndicators: ['Limited promotional channels - potentially exclusive'],
      hotScore: 75,
      recommendations: [
        '📊 Good YouTube presence detected [Mock Data]',
        '📺 Top promoting channels: Health Review Pro',
        '✅ Mostly positive sentiment (70%)'
      ]
    }
  }
}

// Helper function to set up YouTube Data API v3
export const setupYouTubeAPI = () => {
  const instructions = `
🔧 SETUP YOUTUBE DATA API v3 (FREE):

1. Go to Google Cloud Console (console.cloud.google.com)
2. Create new project or select existing
3. Enable "YouTube Data API v3" in APIs & Services
4. Create API Key in Credentials
5. Optional: Add restrictions (HTTP referrers, IP addresses)
6. Add to environment variables:
   YOUTUBE_API_KEY=your_api_key_here
7. Set enabled: true in api-config.ts

FREE TIER LIMITS:
- 10,000 requests per day
- Each search = ~1 request
- Each video details = ~1 request per 50 videos
- Each channel details = ~1 request per 50 channels
- No setup cost

RATE LIMITS:
- 100 requests per 100 seconds per user
- Automatically handled with delays in code
  `
  
  console.log(instructions)
  return instructions
}