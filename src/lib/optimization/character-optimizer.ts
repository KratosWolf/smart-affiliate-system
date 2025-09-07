import { 
  CharacterOptimizationRequest,
  CharacterOptimizationResponse,
  OptimizationImprovement,
  CHARACTER_LIMITS 
} from '@/types';
import { logSecurityEvent } from '@/lib/security';

/**
 * Character Optimization Engine - Core of Google Ads optimization
 * Optimizes headlines, descriptions, and display URLs for maximum performance
 */
export class CharacterOptimizer {

  /**
   * Optimize content for Google Ads character limits and performance
   */
  async optimizeContent(request: CharacterOptimizationRequest): Promise<CharacterOptimizationResponse> {
    const startTime = Date.now();
    
    try {
      const limits = CHARACTER_LIMITS[request.type];
      const originalLength = request.content.length;
      
      // Generate optimized content
      const optimizedContent = this.generateOptimizedContent(request);
      const optimizedLength = optimizedContent.length;
      
      // Calculate optimization score
      const optimizationScore = this.calculateOptimizationScore(
        request,
        optimizedContent,
        limits
      );
      
      // Generate improvements made
      const improvements = this.analyzeImprovements(
        request.content,
        optimizedContent,
        request.type
      );
      
      // Generate alternative variations
      const alternatives = this.generateAlternatives(request, optimizedContent);
      
      const response: CharacterOptimizationResponse = {
        originalContent: request.content,
        optimizedContent,
        characterCount: {
          original: originalLength,
          optimized: optimizedLength,
          limit: limits.max,
          optimal: limits.optimal
        },
        optimizationScore,
        improvements,
        alternatives
      };

      // Log successful optimization
      logSecurityEvent({
        event: 'character_optimization_completed',
        level: 'low',
        details: {
          type: request.type,
          originalLength,
          optimizedLength,
          score: optimizationScore,
          processingTime: Date.now() - startTime
        }
      });

      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Optimization failed';
      
      logSecurityEvent({
        event: 'character_optimization_failed',
        level: 'medium',
        details: {
          type: request.type,
          error: errorMessage,
          processingTime: Date.now() - startTime
        }
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * Batch optimize multiple content pieces
   */
  async batchOptimize(requests: CharacterOptimizationRequest[]): Promise<CharacterOptimizationResponse[]> {
    const results: CharacterOptimizationResponse[] = [];
    
    for (const request of requests) {
      try {
        const result = await this.optimizeContent(request);
        results.push(result);
      } catch (error) {
        console.warn(`Failed to optimize ${request.type}:`, error);
        // Continue with other optimizations
      }
    }
    
    return results;
  }

  /**
   * Generate complete ad copy set (headlines + descriptions)
   */
  async generateAdCopySet(productInfo: {
    name: string;
    benefits: string[];
    price?: number;
    keywords: string[];
  }): Promise<{
    headlines: CharacterOptimizationResponse[];
    descriptions: CharacterOptimizationResponse[];
  }> {
    
    // Generate 5 headline variations
    const headlinePrompts = this.generateHeadlinePrompts(productInfo);
    const headlines: CharacterOptimizationResponse[] = [];
    
    for (const prompt of headlinePrompts) {
      const result = await this.optimizeContent({
        type: 'headline',
        content: prompt,
        keywords: productInfo.keywords,
        productInfo
      });
      headlines.push(result);
    }

    // Generate 3 description variations
    const descriptionPrompts = this.generateDescriptionPrompts(productInfo);
    const descriptions: CharacterOptimizationResponse[] = [];
    
    for (const prompt of descriptionPrompts) {
      const result = await this.optimizeContent({
        type: 'description',
        content: prompt,
        keywords: productInfo.keywords,
        productInfo
      });
      descriptions.push(result);
    }

    return { headlines, descriptions };
  }

  /**
   * Core optimization logic - generates improved content
   */
  private generateOptimizedContent(request: CharacterOptimizationRequest): string {
    const limits = CHARACTER_LIMITS[request.type];
    const content = request.content.trim();
    
    switch (request.type) {
      case 'headline':
        return this.optimizeHeadline(content, request, limits);
      case 'description':
        return this.optimizeDescription(content, request, limits);
      case 'display_url':
        return this.optimizeDisplayUrl(content, limits);
      default:
        return content;
    }
  }

  /**
   * Optimize headline for maximum impact within character limits
   */
  private optimizeHeadline(content: string, request: CharacterOptimizationRequest, limits: any): string {
    let optimized = content;
    
    // Step 1: Remove unnecessary words
    optimized = this.removeFillerWords(optimized);
    
    // Step 2: Add power words if space allows
    optimized = this.addPowerWords(optimized, request.type, limits);
    
    // Step 3: Include top keyword if not present
    if (request.keywords && request.keywords.length > 0) {
      const topKeyword = request.keywords[0];
      if (!optimized.toLowerCase().includes(topKeyword.toLowerCase())) {
        optimized = this.incorporateKeyword(optimized, topKeyword, limits);
      }
    }
    
    // Step 4: Add urgency/scarcity if appropriate
    optimized = this.addUrgency(optimized, limits);
    
    // Step 5: Ensure within optimal length
    optimized = this.truncateToOptimal(optimized, limits);
    
    return optimized;
  }

  /**
   * Optimize description for maximum conversion within character limits
   */
  private optimizeDescription(content: string, request: CharacterOptimizationRequest, limits: any): string {
    let optimized = content;
    
    // Step 1: Ensure clear benefit statement
    optimized = this.enhanceBenefits(optimized, request.productInfo?.benefits);
    
    // Step 2: Add social proof indicators
    optimized = this.addSocialProof(optimized, limits);
    
    // Step 3: Include call-to-action
    optimized = this.addCallToAction(optimized, limits);
    
    // Step 4: Incorporate keywords naturally
    if (request.keywords) {
      optimized = this.incorporateKeywordsNaturally(optimized, request.keywords, limits);
    }
    
    // Step 5: Ensure within optimal length
    optimized = this.truncateToOptimal(optimized, limits);
    
    return optimized;
  }

  /**
   * Optimize display URL for clarity and trust
   */
  private optimizeDisplayUrl(content: string, limits: any): string {
    let optimized = content.toLowerCase();
    
    // Remove protocol and www
    optimized = optimized.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    // Keep only the essential part
    const parts = optimized.split('/');
    optimized = parts[0]; // Domain only
    
    // Add relevant path if space allows
    if (parts.length > 1 && optimized.length < limits.optimal - 8) {
      const relevantPath = parts[1].substring(0, limits.optimal - optimized.length - 1);
      optimized += `/${relevantPath}`;
    }
    
    return this.truncateToOptimal(optimized, limits);
  }

  /**
   * Calculate optimization score based on multiple factors
   */
  private calculateOptimizationScore(
    request: CharacterOptimizationRequest,
    optimizedContent: string,
    limits: any
  ): number {
    let score = 0;
    const maxScore = 100;
    
    // Length optimization score (30 points)
    const lengthScore = this.calculateLengthScore(optimizedContent.length, limits);
    score += lengthScore * 0.3;
    
    // Keyword integration score (25 points)
    const keywordScore = this.calculateKeywordScore(optimizedContent, request.keywords);
    score += keywordScore * 0.25;
    
    // Power words score (20 points)
    const powerWordScore = this.calculatePowerWordScore(optimizedContent, request.type);
    score += powerWordScore * 0.2;
    
    // CTA/Urgency score (15 points)
    const ctaScore = this.calculateCTAScore(optimizedContent, request.type);
    score += ctaScore * 0.15;
    
    // Readability score (10 points)
    const readabilityScore = this.calculateReadabilityScore(optimizedContent);
    score += readabilityScore * 0.1;
    
    return Math.min(maxScore, Math.max(0, Math.round(score)));
  }

  /**
   * Analyze what improvements were made
   */
  private analyzeImprovements(
    original: string,
    optimized: string,
    type: 'headline' | 'description' | 'display_url'
  ): OptimizationImprovement[] {
    const improvements: OptimizationImprovement[] = [];
    
    // Length improvement
    if (optimized.length < original.length) {
      improvements.push({
        type: 'length',
        description: `Reduced from ${original.length} to ${optimized.length} characters`,
        impact: 'high'
      });
    }
    
    // Keyword improvements
    const originalWords = new Set(original.toLowerCase().split(/\s+/));
    const optimizedWords = new Set(optimized.toLowerCase().split(/\s+/));
    const addedWords = [...optimizedWords].filter(word => !originalWords.has(word));
    
    if (addedWords.length > 0) {
      const powerWords = addedWords.filter(word => this.isPowerWord(word));
      if (powerWords.length > 0) {
        improvements.push({
          type: 'keywords',
          description: `Added power words: ${powerWords.join(', ')}`,
          impact: 'medium'
        });
      }
    }
    
    // CTA improvements
    if (type === 'description' && this.hasCallToAction(optimized) && !this.hasCallToAction(original)) {
      improvements.push({
        type: 'cta',
        description: 'Added call-to-action to improve conversion',
        impact: 'high'
      });
    }
    
    // Urgency improvements
    if (this.hasUrgency(optimized) && !this.hasUrgency(original)) {
      improvements.push({
        type: 'urgency',
        description: 'Added urgency indicators to drive action',
        impact: 'medium'
      });
    }
    
    // Clarity improvements
    const originalComplexity = this.calculateComplexity(original);
    const optimizedComplexity = this.calculateComplexity(optimized);
    
    if (optimizedComplexity < originalComplexity) {
      improvements.push({
        type: 'clarity',
        description: 'Improved readability and clarity',
        impact: 'medium'
      });
    }
    
    return improvements;
  }

  /**
   * Generate alternative variations
   */
  private generateAlternatives(request: CharacterOptimizationRequest, optimized: string): string[] {
    const alternatives: string[] = [];
    const limits = CHARACTER_LIMITS[request.type];
    
    // Generate 3-5 alternatives based on type
    switch (request.type) {
      case 'headline':
        alternatives.push(
          this.createVariation(optimized, 'emphasis', limits),
          this.createVariation(optimized, 'question', limits),
          this.createVariation(optimized, 'benefit', limits)
        );
        break;
        
      case 'description':
        alternatives.push(
          this.createVariation(optimized, 'feature_focus', limits),
          this.createVariation(optimized, 'social_proof', limits),
          this.createVariation(optimized, 'urgency', limits)
        );
        break;
        
      case 'display_url':
        alternatives.push(
          this.createUrlVariation(optimized, 'subdomain'),
          this.createUrlVariation(optimized, 'path')
        );
        break;
    }
    
    return alternatives.filter(alt => alt && alt !== optimized);
  }

  // Helper Methods

  private generateHeadlinePrompts(productInfo: any): string[] {
    const { name, benefits, price, keywords } = productInfo;
    
    return [
      `Buy ${name} - ${benefits[0] || 'Best Quality'}`,
      `${name} - ${keywords[0] || 'Premium'} Deal`,
      `Save on ${name} - ${benefits[0] || 'Limited Time'}`,
      `Best ${name} ${price ? `$${price}` : ''}`,
      `${keywords[0] || 'Top'} ${name} Sale`
    ].slice(0, 3);
  }

  private generateDescriptionPrompts(productInfo: any): string[] {
    const { name, benefits, price } = productInfo;
    
    return [
      `Get ${name} with ${benefits.slice(0, 2).join(' and ')}. ${price ? `Starting at $${price}.` : ''} Order now!`,
      `${name}: ${benefits[0] || 'Premium quality'}. Fast shipping. Buy today!`,
      `Shop ${name} - ${benefits.join(', ')}. ${price ? `Only $${price}.` : ''} Limited stock!`
    ];
  }

  private removeFillerWords(content: string): string {
    const fillerWords = [
      'very', 'really', 'quite', 'rather', 'pretty', 'somewhat',
      'definitely', 'absolutely', 'completely', 'totally',
      'the best', 'amazing', 'incredible', 'awesome'
    ];
    
    let result = content;
    for (const filler of fillerWords) {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      result = result.replace(regex, '').replace(/\s+/g, ' ').trim();
    }
    
    return result;
  }

  private addPowerWords(content: string, type: string, limits: any): string {
    const powerWords = {
      headline: ['Save', 'Free', 'New', 'Best', 'Top', 'Sale'],
      description: ['Guaranteed', 'Proven', 'Exclusive', 'Limited', 'Fast', 'Easy']
    };
    
    const words = powerWords[type as keyof typeof powerWords] || [];
    const availableSpace = limits.optimal - content.length;
    
    if (availableSpace > 8) {
      const word = words.find(w => !content.toLowerCase().includes(w.toLowerCase()));
      if (word) {
        return `${word} ${content}`.substring(0, limits.optimal);
      }
    }
    
    return content;
  }

  private incorporateKeyword(content: string, keyword: string, limits: any): string {
    const available = limits.optimal - content.length - keyword.length - 1;
    if (available >= 0) {
      return `${keyword} ${content}`.substring(0, limits.optimal);
    }
    return content;
  }

  private addUrgency(content: string, limits: any): string {
    const urgencyWords = ['Now', 'Today', 'Limited', 'Sale'];
    const available = limits.optimal - content.length;
    
    if (available > 8 && !this.hasUrgency(content)) {
      const word = urgencyWords[Math.floor(Math.random() * urgencyWords.length)];
      return `${content} ${word}`.substring(0, limits.optimal);
    }
    
    return content;
  }

  private enhanceBenefits(content: string, benefits?: string[]): string {
    if (!benefits || benefits.length === 0) return content;
    
    const benefit = benefits[0];
    if (!content.toLowerCase().includes(benefit.toLowerCase())) {
      return `${content} ${benefit}`.trim();
    }
    
    return content;
  }

  private addSocialProof(content: string, limits: any): string {
    const proofWords = ['Trusted', 'Popular', 'Rated', 'Reviewed'];
    const available = limits.optimal - content.length;
    
    if (available > 10 && !proofWords.some(word => 
      content.toLowerCase().includes(word.toLowerCase())
    )) {
      const word = proofWords[0];
      return `${word} ${content}`.substring(0, limits.optimal);
    }
    
    return content;
  }

  private addCallToAction(content: string, limits: any): string {
    const ctas = ['Buy Now', 'Order Today', 'Shop Now', 'Get Yours'];
    const available = limits.optimal - content.length;
    
    if (available > 12 && !this.hasCallToAction(content)) {
      const cta = ctas[0];
      return `${content} ${cta}`.substring(0, limits.optimal);
    }
    
    return content;
  }

  private incorporateKeywordsNaturally(content: string, keywords: string[], limits: any): string {
    const keyword = keywords[0];
    if (keyword && !content.toLowerCase().includes(keyword.toLowerCase())) {
      const available = limits.optimal - content.length - keyword.length - 1;
      if (available >= 0) {
        return `${content} ${keyword}`.substring(0, limits.optimal);
      }
    }
    return content;
  }

  private truncateToOptimal(content: string, limits: any): string {
    if (content.length <= limits.optimal) return content;
    
    // Try to truncate at word boundary
    const truncated = content.substring(0, limits.optimal);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > limits.optimal * 0.8) {
      return truncated.substring(0, lastSpace).trim();
    }
    
    return truncated.trim();
  }

  private calculateLengthScore(length: number, limits: any): number {
    if (length > limits.max) return 0; // Over limit
    if (length <= limits.optimal) return 100; // Perfect
    
    // Linear decrease from optimal to max
    const overOptimal = length - limits.optimal;
    const maxOverOptimal = limits.max - limits.optimal;
    
    return Math.max(0, 100 - (overOptimal / maxOverOptimal) * 50);
  }

  private calculateKeywordScore(content: string, keywords?: string[]): number {
    if (!keywords || keywords.length === 0) return 50; // Neutral
    
    const contentLower = content.toLowerCase();
    const keywordCount = keywords.filter(keyword => 
      contentLower.includes(keyword.toLowerCase())
    ).length;
    
    return Math.min(100, (keywordCount / keywords.length) * 100);
  }

  private calculatePowerWordScore(content: string, type: string): number {
    const powerWords = [
      'save', 'free', 'new', 'best', 'top', 'sale', 'deal', 'offer',
      'guaranteed', 'proven', 'exclusive', 'limited', 'fast', 'easy'
    ];
    
    const contentLower = content.toLowerCase();
    const powerWordCount = powerWords.filter(word => 
      contentLower.includes(word)
    ).length;
    
    return Math.min(100, powerWordCount * 25);
  }

  private calculateCTAScore(content: string, type: string): number {
    if (type === 'headline') return 100; // Headlines don't need CTAs
    
    return this.hasCallToAction(content) ? 100 : 0;
  }

  private calculateReadabilityScore(content: string): number {
    const avgWordLength = content.split(/\s+/)
      .reduce((sum, word) => sum + word.length, 0) / content.split(/\s+/).length;
    
    // Prefer shorter words for better readability
    if (avgWordLength <= 5) return 100;
    if (avgWordLength <= 7) return 75;
    if (avgWordLength <= 9) return 50;
    return 25;
  }

  private isPowerWord(word: string): boolean {
    const powerWords = [
      'save', 'free', 'new', 'best', 'top', 'sale', 'deal', 'offer',
      'guaranteed', 'proven', 'exclusive', 'limited', 'fast', 'easy'
    ];
    return powerWords.includes(word.toLowerCase());
  }

  private hasCallToAction(content: string): boolean {
    const ctas = [
      'buy now', 'order now', 'shop now', 'get yours', 'purchase',
      'order today', 'buy today', 'get now', 'click here'
    ];
    const contentLower = content.toLowerCase();
    return ctas.some(cta => contentLower.includes(cta));
  }

  private hasUrgency(content: string): boolean {
    const urgencyWords = [
      'now', 'today', 'limited', 'sale', 'hurry', 'fast', 'quick',
      'instant', 'immediate', 'urgent', 'deadline'
    ];
    const contentLower = content.toLowerCase();
    return urgencyWords.some(word => contentLower.includes(word));
  }

  private calculateComplexity(content: string): number {
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const sentenceCount = content.split(/[.!?]+/).length;
    const wordsPerSentence = words.length / Math.max(1, sentenceCount);
    
    return avgWordLength + (wordsPerSentence / 10);
  }

  private createVariation(content: string, style: string, limits: any): string {
    switch (style) {
      case 'emphasis':
        return content.replace(/\b\w+\b/, match => match.toUpperCase());
      case 'question':
        return content.endsWith('?') ? content : `${content}?`;
      case 'benefit':
        return `${content} - Benefits You`;
      case 'feature_focus':
        return content.replace('Buy', 'Discover');
      case 'social_proof':
        return `Trusted ${content}`;
      case 'urgency':
        return `${content} - Limited Time!`;
      default:
        return content;
    }
  }

  private createUrlVariation(url: string, type: string): string {
    switch (type) {
      case 'subdomain':
        return `shop.${url}`;
      case 'path':
        return `${url}/deals`;
      default:
        return url;
    }
  }
}

/**
 * Default character optimizer instance
 */
export const characterOptimizer = new CharacterOptimizer();