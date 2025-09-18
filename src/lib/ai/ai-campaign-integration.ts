/**
 * AI Campaign Integration
 * Integra Claude + Gemini + Competitive Intelligence com Campaign Builder
 * Implementa a Metodologia Luiz com AI real
 */

import { MultiAIOrchestrator, type AIConfig } from './multi-ai-orchestrator'
import { CompetitiveIntelligenceEngineV3, type EnterpriseCompetitiveAnalysis } from '@/lib/intelligence/competitive-intelligence-engine-v3'
import { GoogleAdsValidationEngine } from '@/lib/google-ads/validation-engine'
import { MetodologiaLuizGenerator, type MetodologiaLuizData } from '@/lib/campaigns/metodologia-luiz-generator'
import { getLanguageForCountry, getLanguageCode, ITALIAN_HEADLINES_TEMPLATES, ITALIAN_DESCRIPTIONS_TEMPLATES } from '@/lib/constants/languages'

export interface AICampaignRequest {
  // Product data
  productName: string
  productPrice: number
  pack3Price?: number
  pack5Price?: number
  currency: string
  
  // Campaign details
  targetCountry: string
  language: string
  keyword?: string
  
  // Optional enhancements
  guaranteePeriod?: string
  deliveryType?: string
  targetCity?: string
  bonuses?: string
  scarcityType?: string
  
  // AI configuration
  useRealAI?: boolean
  useCompetitiveIntelligence?: boolean
}

export interface AICampaignResult {
  // Main campaign data
  campaign: any
  
  // AI-generated content
  aiHeadlines: {
    original: string[]
    validated: string[]
    confidence: number
    reasoning: string[]
  }
  
  aiDescriptions: {
    original: string[]
    validated: string[]
    confidence: number
  }
  
  // Competitive insights
  competitorAnalysis?: any
  
  // Metadata
  metadata: {
    aiModelsUsed: string[]
    processingTime: number
    totalCost: number
    success: boolean
    fallbacksUsed: string[]
  }
}

export class AICampaignIntegration {
  private multiAI: MultiAIOrchestrator
  private competitiveEngine: CompetitiveIntelligenceEngineV3
  private validationEngine: GoogleAdsValidationEngine

  constructor() {
    // Initialize AI configuration from environment
    const aiConfig: AIConfig = {
      claude: {
        apiKey: process.env.CLAUDE_API_KEY || '',
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 4000
      },
      gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
        model: 'gemini-2.0-flash',
        maxTokens: 2000
      },
      nanoBanana: {
        apiKey: process.env.NANO_BANANA_API_KEY || 'mock-key',
        endpoint: 'https://mock-nano.com/api'
      }
    }

    this.multiAI = new MultiAIOrchestrator(aiConfig)
    this.competitiveEngine = new CompetitiveIntelligenceEngineV3()
    this.validationEngine = new GoogleAdsValidationEngine()
  }

  /**
   * GERAR CAMPANHA COMPLETA COM AI
   * Combina Metodologia Luiz + Claude + Gemini + Competitive Intelligence
   */
  async generateAICampaign(request: AICampaignRequest): Promise<AICampaignResult> {
    console.log(`🚀 Starting AI Campaign Generation for ${request.productName}...`)
    const startTime = Date.now()
    const aiModelsUsed: string[] = []
    const fallbacksUsed: string[] = []
    
    // 🎯 AUTO-DETECT LANGUAGE FROM TARGET COUNTRY
    const detectedLanguage = getLanguageForCountry(request.targetCountry)
    const finalLanguage = request.language || detectedLanguage
    const languageCode = getLanguageCode(finalLanguage)
    
    console.log(`🌍 Target: ${request.targetCountry} → Language: ${finalLanguage} (${languageCode})`)
    
    try {
      // 1. ENTERPRISE COMPETITIVE INTELLIGENCE (sempre ativo se keyword fornecida)
      let competitorAnalysis: EnterpriseCompetitiveAnalysis | null = null
      if (request.keyword) {
        console.log('🚀 Running ENTERPRISE competitive intelligence...')
        try {
          competitorAnalysis = await this.competitiveEngine.analyzeCompetitorsEnterprise(
            request.keyword,
            request.targetCountry,
            finalLanguage
          )
          aiModelsUsed.push(...competitorAnalysis.metadata.sourcesUsed)
          console.log(`✅ Enterprise CI completed: ${competitorAnalysis.metadata.reliability}% reliability`)
        } catch (error) {
          console.error('❌ Enterprise competitive intelligence failed:', error)
          if (request.useCompetitiveIntelligence) {
            fallbacksUsed.push('enterprise-competitive-intelligence')
          }
        }
      }

      // 2. GENERATE BASE CAMPAIGN (Metodologia Luiz)
      console.log('🏗️ Generating base campaign with Metodologia Luiz...')
      const metodologiaData: MetodologiaLuizData = {
        productName: request.productName,
        productPrice: request.productPrice,
        pack3Price: request.pack3Price,
        pack5Price: request.pack5Price,
        currency: request.currency,
        targetCountry: request.targetCountry,
        guaranteePeriod: request.guaranteePeriod,
        deliveryType: request.deliveryType,
        targetCity: request.targetCity,
        bonuses: request.bonuses,
        scarcityType: request.scarcityType
      }

      const generator = new MetodologiaLuizGenerator()
      const baseCampaign = generator.generateCampaignData(metodologiaData)

      // 3. SPECIAL ITALIAN LANGUAGE HANDLING 🇮🇹
      let italianFallbackUsed = false
      if (languageCode === 'it') {
        console.log('🇮🇹 Italian target detected - preparing Italian content templates...')
        italianFallbackUsed = true
      }

      // 4. AI ENHANCEMENT - Headlines (Headlines 8-15 com Claude)
      let aiHeadlines: { original: string[], validated: string[], confidence: number, reasoning: string[] } = { 
        original: [], 
        validated: [], 
        confidence: 0, 
        reasoning: [] 
      }
      if (request.useRealAI && this.multiAI) {
        console.log('🎨 Enhancing headlines with Claude AI...')
        try {
          const headlineRequest = {
            task: 'headlines' as const,
            productData: {
              name: request.productName,
              price: request.productPrice,
              currency: request.currency,
              type: 'supplement'
            },
            competitorInsights: competitorAnalysis,
            language: finalLanguage,
            targetCountry: request.targetCountry
          }

          const claudeHeadlines = await this.multiAI.generateCopywriting(headlineRequest)
          aiModelsUsed.push('claude-sonnet')

          // Validate with Gemini
          try {
            const geminiValidation = await this.multiAI.validateContent({
              content: claudeHeadlines.content,
              type: 'headlines',
              policies: ['google-ads-policy', 'health-supplements']
            })
            aiModelsUsed.push('gemini-flash')

            aiHeadlines = {
              original: claudeHeadlines.content,
              validated: [...geminiValidation.valid, ...geminiValidation.corrected],
              confidence: claudeHeadlines.confidence,
              reasoning: claudeHeadlines.reasoning
            }
          } catch (validationError) {
            console.warn('⚠️ Gemini validation failed, using Claude results directly')
            fallbacksUsed.push('gemini-validation')
            aiHeadlines = {
              original: claudeHeadlines.content,
              validated: claudeHeadlines.content,
              confidence: claudeHeadlines.confidence * 0.8, // Reduced confidence
              reasoning: claudeHeadlines.reasoning
            }
          }

        } catch (headlineError) {
          console.warn('⚠️ Claude headline generation failed, using fallback')
          fallbacksUsed.push('claude-headlines')
          
          // 🇮🇹 Use Italian templates as fallback for Italy
          if (languageCode === 'it') {
            console.log('🇮🇹 Using Italian template fallback for headlines...')
            const italianHeadlines = ITALIAN_HEADLINES_TEMPLATES.map(template => 
              template.replace('{product}', request.productName)
            )
            aiHeadlines = {
              original: italianHeadlines,
              validated: italianHeadlines,
              confidence: 0.85, // High confidence for templates
              reasoning: ['Italian template fallback used']
            }
          }
        }
      }

      // 4. AI ENHANCEMENT - Descriptions
      let aiDescriptions: { original: string[], validated: string[], confidence: number } = { 
        original: [], 
        validated: [], 
        confidence: 0 
      }
      if (request.useRealAI && aiHeadlines.original.length > 0) {
        console.log('📝 Enhancing descriptions with Claude AI...')
        try {
          const descriptionRequest = {
            task: 'descriptions' as const,
            productData: {
              name: request.productName,
              price: request.productPrice,
              currency: request.currency,
              type: 'supplement'
            },
            competitorInsights: competitorAnalysis,
            language: finalLanguage,
            targetCountry: request.targetCountry
          }

          const claudeDescriptions = await this.multiAI.generateCopywriting(descriptionRequest)
          
          aiDescriptions = {
            original: claudeDescriptions.content,
            validated: claudeDescriptions.content,
            confidence: claudeDescriptions.confidence
          }

        } catch (descError) {
          console.warn('⚠️ Claude description generation failed')
          fallbacksUsed.push('claude-descriptions')
          
          // 🇮🇹 Use Italian templates as fallback for Italy
          if (languageCode === 'it') {
            console.log('🇮🇹 Using Italian template fallback for descriptions...')
            const italianDescriptions = ITALIAN_DESCRIPTIONS_TEMPLATES.map(template => 
              template.replace('{product}', request.productName)
            )
            aiDescriptions = {
              original: italianDescriptions,
              validated: italianDescriptions,
              confidence: 0.85 // High confidence for templates
            }
          }
        }
      }

      // 5. MERGE AI CONTENT WITH BASE CAMPAIGN
      const enhancedCampaign = this.mergeAIWithCampaign(baseCampaign, aiHeadlines, aiDescriptions)

      const processingTime = Date.now() - startTime
      console.log(`✅ AI Campaign generation completed in ${processingTime}ms`)

      return {
        campaign: enhancedCampaign,
        aiHeadlines,
        aiDescriptions,
        competitorAnalysis,
        metadata: {
          aiModelsUsed,
          processingTime,
          totalCost: this.calculateCosts(aiModelsUsed),
          success: true,
          fallbacksUsed
        }
      }

    } catch (error) {
      console.error('❌ AI Campaign generation failed:', error)
      
      // Return base campaign as fallback
      const generator = new MetodologiaLuizGenerator()
      const baseCampaign = generator.generateCampaignData({
        productName: request.productName,
        productPrice: request.productPrice,
        pack3Price: request.pack3Price,
        pack5Price: request.pack5Price,
        currency: request.currency,
        targetCountry: request.targetCountry
      })

      return {
        campaign: baseCampaign,
        aiHeadlines: { original: [] as string[], validated: [] as string[], confidence: 0, reasoning: ['AI generation failed - using fallback'] },
        aiDescriptions: { original: [] as string[], validated: [] as string[], confidence: 0 },
        competitorAnalysis: null,
        metadata: {
          aiModelsUsed: [] as string[],
          processingTime: Date.now() - startTime,
          totalCost: 0,
          success: false,
          fallbacksUsed: ['complete-fallback'] as string[]
        }
      }
    }
  }

  /**
   * MERGE AI CONTENT WITH BASE CAMPAIGN
   * Substitui headlines 8-15 e descriptions com conteúdo AI
   */
  private mergeAIWithCampaign(baseCampaign: any, aiHeadlines: any, aiDescriptions: any): any {
    const enhanced = { ...baseCampaign }

    // Merge AI headlines (positions 8-15)
    if (aiHeadlines.validated.length > 0) {
      const aiHeadlinesCleaned = aiHeadlines.validated
        .filter((h: string) => h.trim().length > 0 && h.length <= 30)
        .slice(0, 8) // Max 8 AI headlines

      // Replace headlines 8-15 with AI content
      if (enhanced.headlines && enhanced.headlines.length >= 7) {
        // Keep headlines 1-7 (fixed), replace 8-15 with AI
        enhanced.headlines = [
          ...enhanced.headlines.slice(0, 7), // Headlines 1-7 fixed
          ...aiHeadlinesCleaned // Headlines 8-15 from AI
        ]
      }
    }

    // Merge AI descriptions
    if (aiDescriptions.validated.length > 0) {
      const aiDescCleaned = aiDescriptions.validated
        .filter((d: string) => d.trim().length > 0 && d.length <= 90)
        .slice(0, 4) // Max 4 descriptions

      if (aiDescCleaned.length > 0) {
        enhanced.descriptions = [
          ...enhanced.descriptions.slice(0, 2), // Keep original first 2
          ...aiDescCleaned // Add AI descriptions
        ].slice(0, 4) // Max 4 total
      }
    }

    return enhanced
  }

  /**
   * Calculate estimated costs for AI usage
   */
  private calculateCosts(aiModelsUsed: string[]): number {
    const costs = {
      'claude-sonnet': 0.006, // $6/M tokens estimate
      'gemini-flash': 0.0002, // $0.2/M tokens estimate
      'puppeteer-scraper': 0.001 // Compute cost estimate
    }

    return aiModelsUsed.reduce((total, model) => {
      return total + (costs[model as keyof typeof costs] || 0)
    }, 0)
  }
}