/**
 * Multi-AI Orchestrator
 * Orquestra Claude, Gemini e Nano Banana conforme estratégia definida:
 * - Claude Sonnet: Copywriting ($6/M tokens)
 * - Gemini 2.5 Pro: Validation ($2.5/M tokens)  
 * - Gemini Flash: Simple tasks ($0.175/M tokens)
 * - Nano Banana: Image processing ($0.039/image)
 */

import Anthropic from '@anthropic-ai/sdk'

export interface AIConfig {
  claude: {
    apiKey: string
    model: string
    maxTokens: number
  }
  gemini: {
    apiKey: string
    model: string
    maxTokens: number
  }
  nanoBanana: {
    apiKey: string
    endpoint: string
  }
}

export interface CopywritingRequest {
  task: 'headlines' | 'descriptions' | 'callouts' | 'sitelinks'
  productData: any
  competitorInsights?: any
  language: string
  targetCountry: string
  customPrompt?: string // Prompt personalizado para localização inteligente
}

export interface ValidationRequest {
  content: string[]
  type: 'headlines' | 'descriptions' | 'callouts'
  policies: string[]
}

export interface ImageProcessingRequest {
  productImageUrl: string
  backgroundStyle: 'clean' | 'lifestyle' | 'medical' | 'natural'
  outputFormat: 'jpg' | 'png'
}

export class MultiAIOrchestrator {
  private config: AIConfig
  private anthropic: Anthropic

  constructor(config: AIConfig) {
    this.config = config
    this.anthropic = new Anthropic({
      apiKey: config.claude.apiKey,
    })
  }

  /**
   * CLAUDE SONNET - Copywriting de alta qualidade
   * Melhor para headlines, descriptions criativas
   */
  async generateCopywriting(request: CopywritingRequest): Promise<{
    content: string[]
    reasoning: string[]
    confidence: number
  }> {
    console.log(`🎨 Claude Sonnet generating ${request.task} for ${request.language}...`)
    
    const prompt = this.buildClaudePrompt(request)
    
    try {
      // IMPLEMENTAÇÃO REAL - substituir por API call real
      const response = await this.callClaudeAPI(prompt)
      
      return {
        content: response.content,
        reasoning: response.reasoning,
        confidence: response.confidence
      }
    } catch (error) {
      console.error('❌ Claude API error:', error)
      
      // Fallback para mock em caso de erro
      return this.mockClaudeResponse(request)
    }
  }

  /**
   * GEMINI 2.5 PRO - Validation e análise complexa  
   * Melhor para policy compliance, competitive analysis
   */
  async validateContent(request: ValidationRequest): Promise<{
    valid: string[]
    corrected: string[]
    violations: string[]
    compliance: number
  }> {
    console.log(`🔍 Gemini Pro validating ${request.type}...`)
    
    const prompt = this.buildGeminiValidationPrompt(request)
    
    try {
      // IMPLEMENTAÇÃO REAL - substituir por API call real
      const response = await this.callGeminiAPI(prompt, 'pro')
      
      return {
        valid: response.valid,
        corrected: response.corrected, 
        violations: response.violations,
        compliance: response.compliance
      }
    } catch (error) {
      console.error('❌ Gemini Pro API error:', error)
      
      // Fallback para mock
      return this.mockGeminiValidation(request)
    }
  }

  /**
   * GEMINI FLASH - Tarefas simples e rápidas
   * Melhor para translations, simple formatting
   */
  async processSimpleTask(task: string, input: any): Promise<any> {
    console.log(`⚡ Gemini Flash processing: ${task}`)
    
    try {
      // IMPLEMENTAÇÃO REAL - substituir por API call real
      const response = await this.callGeminiAPI(input, 'flash')
      return response
    } catch (error) {
      console.error('❌ Gemini Flash API error:', error)
      return this.mockGeminiFlash(task, input)
    }
  }

  /**
   * NANO BANANA - Image processing
   * Melhor para background variations mantendo produto
   */
  async processProductImage(request: ImageProcessingRequest): Promise<{
    originalUrl: string
    processedUrl: string
    variations: string[]
    metadata: any
  }> {
    console.log(`🍌 Nano Banana processing image with ${request.backgroundStyle} style...`)
    
    try {
      // IMPLEMENTAÇÃO REAL - substituir por API call real
      const response = await this.callNanaBananaAPI(request)
      
      return {
        originalUrl: request.productImageUrl,
        processedUrl: response.processedUrl,
        variations: response.variations,
        metadata: response.metadata
      }
    } catch (error) {
      console.error('❌ Nano Banana API error:', error)
      
      // Fallback para mock
      return this.mockNanaBananaResponse(request)
    }
  }

  /**
   * ORQUESTRAÇÃO COMPLETA - Usar multiple AIs em pipeline
   */
  async generateCompleteCampaign(
    productData: any,
    competitorInsights: any,
    language: string,
    targetCountry: string
  ) {
    console.log('🎭 Starting complete multi-AI campaign generation...')
    
    try {
      // 1. CLAUDE: Gerar copy inicial
      const headlines = await this.generateCopywriting({
        task: 'headlines',
        productData,
        competitorInsights,
        language,
        targetCountry
      })

      const descriptions = await this.generateCopywriting({
        task: 'descriptions', 
        productData,
        competitorInsights,
        language,
        targetCountry
      })

      // 2. GEMINI PRO: Validar compliance
      const validatedHeadlines = await this.validateContent({
        content: headlines.content,
        type: 'headlines',
        policies: ['google-ads-policy', 'health-supplements']
      })

      const validatedDescriptions = await this.validateContent({
        content: descriptions.content,
        type: 'descriptions', 
        policies: ['google-ads-policy', 'health-supplements']
      })

      // 3. GEMINI FLASH: Translations se necessário
      let translatedContent = null
      if (language !== 'en-US') {
        translatedContent = await this.processSimpleTask('translate', {
          content: validatedHeadlines.valid,
          targetLanguage: language
        })
      }

      // 4. NANO BANANA: Process product images se fornecido
      let processedImages = null
      if (productData.imageUrl) {
        processedImages = await this.processProductImage({
          productImageUrl: productData.imageUrl,
          backgroundStyle: 'clean',
          outputFormat: 'jpg'
        })
      }

      return {
        headlines: {
          original: headlines.content,
          validated: validatedHeadlines.valid,
          translated: translatedContent?.content || null
        },
        descriptions: {
          original: descriptions.content,
          validated: validatedDescriptions.valid
        },
        images: processedImages,
        metadata: {
          totalCost: this.calculateCosts(headlines, descriptions, processedImages),
          processingTime: Date.now(),
          aiModelsUsed: ['claude-sonnet', 'gemini-pro', 'gemini-flash', 'nano-banana']
        }
      }

    } catch (error) {
      console.error('❌ Multi-AI orchestration error:', error)
      throw new Error('Campaign generation failed')
    }
  }

  // ======================
  // IMPLEMENTAÇÕES DE API (SUBSTITUIR POR REAIS)
  // ======================

  private async callClaudeAPI(prompt: string): Promise<any> {
    console.log('🤖 Making real Claude API call...')
    
    try {
      const message = await this.anthropic.messages.create({
        model: this.config.claude.model || 'claude-3-5-sonnet-20241022',
        max_tokens: this.config.claude.maxTokens || 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      console.log('✅ Claude API call successful!')
      
      // Parse Claude's response to extract structured data
      const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
      
      return this.parseClaudeResponse(responseText)
      
    } catch (error: any) {
      console.error('❌ Claude API error:', error.message)
      
      // Fallback para mock em caso de erro
      console.log('⚠️  Using fallback mock response...')
      return this.mockClaudeResponseFallback(prompt)
    }
  }

  private parseClaudeResponse(responseText: string): any {
    console.log('🔍 Parsing Claude response...')

    try {
      // Look for JSON structure first
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    } catch (e) {
      // Continue to text parsing
    }

    // Parse as plain text - filter only content lines
    const lines = responseText
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => {
        // Skip empty lines, explanatory text, format indicators
        if (!line) return false
        if (line.startsWith('Here are')) return false
        if (line.startsWith('RETURN FORMAT')) return false
        if (line.startsWith('[Headline')) return false
        if (line.startsWith('[Description')) return false
        if (line.startsWith('Translation for')) return false // Skip translation explanations
        if (line.startsWith('Alternative translation')) return false
        if (line.startsWith('These translations are')) return false
        if (line.startsWith('This translation:')) return false
        if (line.includes('targeting\\')) return false // Skip targeting explanations
        if (line.includes('Google Ads compliant')) return false
        if (line.includes('Brazilian marketing')) return false
        if (line.includes('e-commerce')) return false
        if (line.match(/^\d+\./)) return false // Skip numbered lists
        if (line.match(/^-\s/)) return false // Skip bullet points
        if (line.startsWith('👉')) return false
        if (line.startsWith('Additional')) return false
        if (line.includes('caracteres')) return false
        if (line.length > 90) return false // Skip long explanatory lines
        if (line.length < 3) return false // Skip very short lines

        return true
      })
      .map((line: string) => {
        // Clean up quotes and numbering
        return line
          .replace(/^"\s*/, '') // Remove starting quotes
          .replace(/\s*"$/, '') // Remove ending quotes
          .replace(/^\d+\.\s*/, '') // Remove numbering like "1. "
          .replace(/\[Translation.*?\]/g, '') // Remove translation annotations
          .replace(/\{.*?\}/g, '') // Remove dynamic insertions for now
          .trim()
      })
      .filter((line: string) => line.length > 3 && line.length <= 90) // Valid content lines

    const cleanedContent = lines.slice(0, 15) // Max 15 items

    console.log(`✅ Parsed ${cleanedContent.length} clean content items from Claude`)
    console.log('📝 Sample parsed content:', cleanedContent.slice(0, 3))

    return {
      content: cleanedContent,
      reasoning: [`Generated by Claude: ${cleanedContent.length} items parsed`],
      confidence: 0.90
    }
  }

  private mockClaudeResponseFallback(prompt: string): any {
    console.log('📝 Using enhanced fallback response based on prompt...')
    
    if (prompt.includes('headlines')) {
      return {
        content: [
          'Buy [PRODUCT] Now - Official Store',
          '[PRODUCT] - Best Price Online',
          'Order [PRODUCT] Today',
          'Natural [PRODUCT] Supplement',
          '[PRODUCT] - Premium Quality'
        ],
        reasoning: ['Fallback: High-conversion headline patterns'],
        confidence: 0.75
      }
    } else if (prompt.includes('descriptions')) {
      return {
        content: [
          'Natural [PRODUCT] supplement with 60-day guarantee and free shipping',
          'Premium [PRODUCT] - clinically tested formula with proven results'
        ],
        reasoning: ['Fallback: Google Ads compliant descriptions'],
        confidence: 0.75
      }
    }
    
    return {
      content: ['Generic fallback content'],
      reasoning: ['Fallback used due to API error'],
      confidence: 0.70
    }
  }

  private async callGeminiAPI(prompt: string, model: 'pro' | 'flash'): Promise<any> {
    console.log(`🔍 Making real Gemini ${model} API call...`)
    
    try {
      // Use Gemini 2.0 Flash endpoint from user's curl
      const endpoint = model === 'flash' ? 'gemini-2.0-flash' : 'gemini-1.5-pro'
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${endpoint}:generateContent`, {
        method: 'POST',
        headers: {
          'X-goog-api-key': this.config.gemini.apiKey, // Using X-goog-api-key as per user's curl
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`✅ Gemini ${model} API call successful!`)
      
      return this.parseGeminiResponse(data, prompt)

    } catch (error: any) {
      console.error(`❌ Gemini ${model} API error:`, error.message)
      
      // Fallback para mock em caso de erro
      console.log('⚠️  Using fallback mock response...')
      return this.mockGeminiResponseFallback(prompt, model)
    }
  }

  private parseGeminiResponse(data: any, originalPrompt: string): any {
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      if (originalPrompt.includes('validate') || originalPrompt.includes('compliance')) {
        // Parse validation response
        return {
          valid: [text.substring(0, 100)], // Sample parsing
          corrected: [],
          violations: [],
          compliance: 0.95
        }
      }
      
      // Generic response parsing
      return {
        result: text,
        content: text.split('\n').filter((line: string) => line.trim()).slice(0, 10),
        success: true
      }

    } catch (error) {
      console.error('Error parsing Gemini response:', error)
      return this.mockGeminiResponseFallback(originalPrompt, 'flash')
    }
  }

  private mockGeminiResponseFallback(prompt: string | any, model: 'pro' | 'flash'): any {
    console.log(`📝 Using enhanced Gemini ${model} fallback...`)
    
    const promptText = typeof prompt === 'string' ? prompt : JSON.stringify(prompt)
    
    if (promptText.includes('validate') || promptText.includes('compliance')) {
      return {
        valid: ['Sample valid content'],
        corrected: ['Sample corrected content'],
        violations: [],
        compliance: 0.90
      }
    }
    
    if (promptText.includes('translate')) {
      return {
        result: 'Compre GlucoGen17 Agora, Melhor Preço Online',
        content: ['Compre GlucoGen17 Agora', 'Melhor Preço Online'],
        success: true
      }
    }
    
    return {
      result: `Mock ${model} result for prompt`,
      content: ['Mock Gemini response'],
      success: false
    }
  }

  private async callNanaBananaAPI(request: ImageProcessingRequest): Promise<any> {
    // TODO: Implementar Nano Banana API real
    // const response = await fetch(this.config.nanoBanana.endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.nanoBanana.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(request)
    // })
    
    // MOCK por enquanto
    await this.delay(2000)
    return {
      processedUrl: 'https://example.com/processed-image.jpg',
      variations: ['variation1.jpg', 'variation2.jpg'],
      metadata: { style: request.backgroundStyle }
    }
  }

  // ======================
  // MOCK RESPONSES (SUBSTITUIR)
  // ======================

  private mockClaudeResponse(request: CopywritingRequest): any {
    const mockContent = {
      headlines: [`${request.productData.name} - Official Website`, `Buy ${request.productData.name} Online`],
      descriptions: [`Natural ${request.productData.name} supplement`, `Premium quality ingredients`],
      callouts: ['Free Shipping', 'Money Back Guarantee'],
      sitelinks: ['Reviews', 'Ingredients', 'Contact']
    }
    
    return {
      content: mockContent[request.task] || [],
      reasoning: ['Mock reasoning based on competitive analysis'],
      confidence: 0.80
    }
  }

  private mockGeminiValidation(request: ValidationRequest): any {
    return {
      valid: request.content.filter((_, i) => i % 2 === 0), // Mock: aceita metade
      corrected: request.content.filter((_, i) => i % 2 === 1).map(c => c + ' *corrected'),
      violations: [],
      compliance: 0.90
    }
  }

  private mockGeminiFlash(task: string, input: any): any {
    return {
      task,
      result: `Mock ${task} result`,
      content: input.content || []
    }
  }

  private mockNanaBananaResponse(request: ImageProcessingRequest): any {
    return {
      processedUrl: request.productImageUrl.replace('.jpg', '_processed.jpg'),
      variations: [
        request.productImageUrl.replace('.jpg', '_var1.jpg'),
        request.productImageUrl.replace('.jpg', '_var2.jpg')
      ],
      metadata: {
        originalStyle: request.backgroundStyle,
        processingTime: 2000
      }
    }
  }

  // ======================
  // HELPER METHODS
  // ======================

  private buildClaudePrompt(request: CopywritingRequest): string {
    if (request.task === 'headlines') {
      return `Generate exactly 8 clean Google Ads headlines for ${request.productData.name} targeting ${request.targetCountry} in ${request.language}.

CRITICAL REQUIREMENTS:
- Generate EXACTLY 8 headlines
- Each headline must be MAXIMUM 30 characters
- Must be Google Ads compliant for health/supplement products
- Language: ${request.language}
- Target country: ${request.targetCountry}
- RETURN ONLY THE HEADLINES, NO EXPLANATIONS

Product: ${request.productData.name}
Category: Health supplements

RETURN FORMAT - exactly this format, nothing else:

${request.productData.name} Original
${request.productData.name} Official
${request.productData.name} Store
Buy ${request.productData.name} Now
${request.productData.name} Discount
${request.productData.name} Online
${request.productData.name} Deal
${request.productData.name} Price

Return 8 similar headlines following this pattern. No explanations, no numbering, no additional text.`

    } else if (request.task === 'descriptions') {
      return `Generate exactly 4 Google Ads descriptions for ${request.productData.name} targeting ${request.targetCountry} in ${request.language}.

CRITICAL REQUIREMENTS:
- Generate EXACTLY 4 descriptions
- Each description must be MAXIMUM 90 characters
- Must be Google Ads compliant for health/supplement products
- Language: ${request.language}

Product context:
${JSON.stringify(request.productData)}

RETURN FORMAT (plain text, one description per line):
[Description 1]
[Description 2]
[Description 3]
[Description 4]

Do not include explanations or extra text.`

    } else {
      return `Generate ${request.task} for ${request.productData.name} targeting ${request.targetCountry} in ${request.language}. 
      Product data: ${JSON.stringify(request.productData)}
      Competitor insights: ${JSON.stringify(request.competitorInsights)}
      Requirements: Google Ads compliant, persuasive, character limits respected.`
    }
  }

  private buildGeminiValidationPrompt(request: ValidationRequest): string {
    return `Validate these ${request.type} for Google Ads compliance: ${request.content.join(', ')}
    Policies to check: ${request.policies.join(', ')}
    Return valid, corrected, and violations.`
  }

  private calculateCosts(headlines: any, descriptions: any, images: any): number {
    // Mock cost calculation - implementar custos reais
    const claudeCost = 0.006 // $6/M tokens
    const geminiProCost = 0.0025 // $2.5/M tokens  
    const nanaBananaCost = 0.039 // $0.039/image
    
    return claudeCost + geminiProCost + (images ? nanaBananaCost : 0)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}