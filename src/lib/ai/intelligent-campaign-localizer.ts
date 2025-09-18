/**
 * Intelligent Campaign Localizer
 * Sistema inteligente de localização de campanhas que:
 * 1. Aceita input multi-idioma do usuário
 * 2. Gera copy nativo baseado em análise competitiva  
 * 3. Usa recursos dinâmicos do Google Ads
 * 4. Adapta metodologia Luiz para cada país
 */

import { MultiAIOrchestrator } from './multi-ai-orchestrator'
import { getLanguageForCountry } from '@/lib/constants/languages'
import { getCurrencyForCountry } from '@/lib/constants/currencies'

export interface LocalizedCampaignRequest {
  // Input multi-idioma do usuário
  productName: string
  productDescription: string // Pode ser em qualquer idioma
  guaranteeInfo: string // Pode ser em qualquer idioma  
  deliveryInfo: string // Pode ser em qualquer idioma
  discountInfo?: string // Pode ser em qualquer idioma
  
  // Contexto da campanha
  targetCountry: string // IT, HU, BR, etc.
  productPrice?: number
  competitorInsights?: any[] // Análise de concorrência
  
  // Dados contextuais Phase 1
  discountPercentage?: number
  discountAmount?: number
  guaranteePeriod?: string
  deliveryType?: string
}

export interface LocalizedCampaignOutput {
  headlines: string[] // 15 headlines no idioma nativo
  descriptions: string[] // 4 descriptions no idioma nativo
  callouts: string[] // 5 callouts no idioma nativo
  sitelinks: string[] // 4 sitelinks no idioma nativo
  language: string // Idioma detectado/usado
  currency: string // Moeda do país
  countryCode: string // Código do país
  dynamicResources: {
    keywordInsertion: string // {KeyWord:ProductName}
    locationInsertion: string // {Location (City):CountryCode}
  }
}

export class IntelligentCampaignLocalizer {
  private aiOrchestrator: MultiAIOrchestrator

  constructor(aiConfig: any) {
    this.aiOrchestrator = new MultiAIOrchestrator(aiConfig)
  }

  /**
   * Gera campanha localizada completa
   */
  async generateLocalizedCampaign(request: LocalizedCampaignRequest): Promise<LocalizedCampaignOutput> {
    console.log(`🌍 Starting intelligent localization for ${request.targetCountry}`)
    
    // 1. Detectar contexto e idioma alvo
    const targetLanguage = getLanguageForCountry(request.targetCountry)
    const targetCurrency = getCurrencyForCountry(request.targetCountry)
    
    // 2. Análise competitiva inteligente
    const competitorInsights = await this.analyzeCompetitors(request)
    const enhancedRequest = { 
      ...request, 
      competitorInsights: competitorInsights 
    }
    
    // 3. Preparar prompt inteligente para a AI
    const localizationPrompt = this.buildIntelligentPrompt(enhancedRequest, targetLanguage)
    
    // 4. Gerar content localizado usando Claude
    const localizedContent = await this.generateNativeContent(localizationPrompt, enhancedRequest)
    
    // 5. Criar recursos dinâmicos do Google Ads
    const dynamicResources = this.buildGoogleAdsDynamicResources(enhancedRequest, targetLanguage)
    
    // 6. Integrar recursos dinâmicos nas headlines
    const enhancedHeadlines = await this.integrateGoogleAdsResources(
      localizedContent.headlines, 
      dynamicResources, 
      enhancedRequest
    )

    return {
      headlines: enhancedHeadlines,
      descriptions: localizedContent.descriptions,
      callouts: localizedContent.callouts,
      sitelinks: localizedContent.sitelinks,
      language: targetLanguage,
      currency: targetCurrency,
      countryCode: request.targetCountry,
      dynamicResources
    }
  }

  /**
   * Constrói prompt inteligente que considera:
   * - Input multi-idioma
   * - Análise competitiva INTELIGENTE (não cópia)
   * - Metodologia Luiz adaptada
   * - Compliance Google Ads
   */
  private buildIntelligentPrompt(request: LocalizedCampaignRequest, targetLanguage: string): string {
    const languageNames = {
      'pt-BR': 'português brasileiro',
      'en-US': 'inglês americano',
      'it-IT': 'italiano',
      'hu-HU': 'húngaro',
      'es-ES': 'espanhol',
      'fr-FR': 'francês',
      'de-DE': 'alemão',
      'pl-PL': 'polonês',
      'ro-RO': 'romeno',
      'tr-TR': 'turco',
      'da-DK': 'dinamarquês'
    }

    const targetLanguageName = languageNames[targetLanguage as keyof typeof languageNames] || targetLanguage

    return `
Você é um copywriter SENIOR especialista em Google Ads com 15+ anos de experiência em marketing de afiliados e diferenciação competitiva.

TAREFA: Criar uma campanha Google Ads CONSERVADORA e EFICAZ em ${targetLanguageName} para ${request.targetCountry}.

DADOS CONTEXTUAIS VALIDADOS (Fase 1):
- Produto: ${request.productName}
- Descrição: ${request.productDescription}
- Garantia: ${request.guaranteeInfo}
- Entrega: ${request.deliveryInfo}
${request.discountInfo ? `- Desconto: ${request.discountInfo}` : ''}
${request.productPrice ? `- Preço: ${request.productPrice}` : ''}
${request.discountPercentage ? `- Desconto (%): ${request.discountPercentage}%` : ''}
${request.guaranteePeriod ? `- Período Garantia: ${request.guaranteePeriod}` : ''}
${request.deliveryType ? `- Tipo Entrega: ${request.deliveryType}` : ''}

🎯 REGRAS FUNDAMENTAIS - COPYWRITING CONSERVADOR:

1. FOQUE APENAS NO FUNDO DE FUNIL:
   - Compra, oferta, urgência, garantia, entrega
   - NÃO use características do produto (meio de funil)
   - NÃO invente benefícios não mencionados

2. USE APENAS DADOS VALIDADOS:
   - Se não há % desconto validado → NÃO mencione desconto
   - Se não há período garantia → NÃO mencione dias específicos
   - Se não há endosso de experts → NÃO use "experts recomendam"
   - Se não há revolução comprovada → NÃO use "revolution"

3. CLICHÊS vs ALTERNATIVAS:
   - MANTENHA clichês que funcionam ("Fri frakt", "Köp nu", "Bästa pris")
   - SÓ mude se a alternativa for COMPROVADAMENTE superior
   - Teste: "Fri frakt" vs "Transport inkluderad" → MANTENHA "Fri frakt"

4. LOCALIZAÇÃO CULTURAL NATIVA:
   - Traduza naturalmente para ${targetLanguageName}
   - Use expressões locais comuns
   - Mantenha simplicidade e clareza

5. COMPLIANCE GOOGLE ADS:
   - Máximo 30 caracteres por headline
   - Máximo 90 caracteres por description
   - Sem promessas não comprovadas
   - Sem superlativos exagerados

ENTREGUE (apenas ${targetLanguageName} nativo):
- 15 headlines baseados nos dados validados
- 4 descriptions factual
- 5 callouts conservadores
- 4 sitelinks diretos

OBJETIVO: Campanha que CONVERTE pela CLAREZA e CONFIANÇA, não por hype ou invenções.
`
  }

  /**
   * Gera conteúdo nativo usando Claude
   */
  private async generateNativeContent(prompt: string, request: LocalizedCampaignRequest) {
    try {
      const response = await this.aiOrchestrator.generateCopywriting({
        task: 'headlines',
        productData: request,
        language: getLanguageForCountry(request.targetCountry),
        targetCountry: request.targetCountry,
        competitorInsights: request.competitorInsights,
        customPrompt: prompt
      })

      // Parse da resposta da AI
      return this.parseAIResponse(response.content)
    } catch (error) {
      console.error('❌ Error generating native content:', error)
      // Fallback para conteúdo básico
      return this.generateFallbackContent(request)
    }
  }

  /**
   * Cria recursos dinâmicos do Google Ads
   */
  private buildGoogleAdsDynamicResources(request: LocalizedCampaignRequest, targetLanguage: string) {
    return {
      keywordInsertion: `{KeyWord:${request.productName}}`,
      locationInsertion: `{Location (City):${request.targetCountry}}`
    }
  }

  /**
   * Integra recursos dinâmicos nas headlines usando AI para traduções
   */
  private async integrateGoogleAdsResources(
    headlines: string[], 
    dynamicResources: any, 
    request: LocalizedCampaignRequest
  ): Promise<string[]> {
    const enhancedHeadlines = [...headlines]
    const targetLanguage = getLanguageForCountry(request.targetCountry)
    
    try {
      // 1. AI traduz "Online Store" para o idioma nativo
      const onlineStoreTranslation = await this.translateWithAI(
        'Online Store', 
        targetLanguage, 
        'Google Ads headline for e-commerce website'
      )
      
      enhancedHeadlines[0] = `${dynamicResources.keywordInsertion} ${onlineStoreTranslation}`

      // 2. Se tem informação de delivery, AI traduz "Shipping to"
      if (request.deliveryInfo) {
        const shippingTranslation = await this.translateWithAI(
          'Shipping to', 
          targetLanguage, 
          'Google Ads headline prefix for delivery information'
        )
        
        enhancedHeadlines[6] = `${shippingTranslation} ${dynamicResources.locationInsertion}`
      }
    } catch (error) {
      console.error('❌ AI translation failed, using English fallback:', error)
      // Fallback simples em inglês se AI falhar
      enhancedHeadlines[0] = `${dynamicResources.keywordInsertion} Online Store`
      if (request.deliveryInfo) {
        enhancedHeadlines[6] = `Shipping to ${dynamicResources.locationInsertion}`
      }
    }

    return enhancedHeadlines
  }

  /**
   * Traduz texto usando IA com contexto específico
   */
  private async translateWithAI(
    text: string, 
    targetLanguage: string, 
    context: string
  ): Promise<string> {
    const translationPrompt = `
Traduza "${text}" para ${targetLanguage} nativo.

CONTEXTO: ${context}

INSTRUÇÕES:
- Use a tradução mais natural e persuasiva
- Adapte culturalmente para o mercado local
- Mantenha o tom comercial/promocional
- Máximo 15 caracteres se possível

RESPONDA APENAS COM A TRADUÇÃO:
`

    try {
      const response = await this.aiOrchestrator.generateCopywriting({
        task: 'headlines',
        productData: { productName: text },
        language: targetLanguage,
        targetCountry: '',
        customPrompt: translationPrompt
      })

      // Extrai apenas a tradução da resposta
      const contentText = Array.isArray(response.content) ? response.content[0] : String(response.content)
      return contentText.trim().replace(/['"]/g, '')
    } catch (error) {
      console.error('❌ AI translation error:', error)
      return text // Fallback para texto original
    }
  }

  /**
   * Parse da resposta da AI - extrai apenas headlines limpos
   */
  private parseAIResponse(content: any) {
    // Lidar com diferentes formatos de resposta da IA
    let contentText: string
    
    if (typeof content === 'string') {
      contentText = content
    } else if (content && content.content) {
      contentText = content.content
    } else if (content && typeof content === 'object') {
      contentText = JSON.stringify(content)
    } else {
      console.error('❌ Unexpected content format:', typeof content, content)
      throw new Error('Invalid AI response format')
    }
    
    // Parse inteligente - extrai apenas headlines limpos
    const lines = contentText.split('\n').filter(line => line.trim())
    const cleanHeadlines = []
    const cleanDescriptions = []
    const cleanCallouts = []
    const cleanSitelinks = []
    
    for (const line of lines) {
      const cleaned = line.trim()
      
      // Skip explicações da AI - só queremos headlines finais
      if (cleaned.includes('translation') || 
          cleaned.includes('Alternative') || 
          cleaned.includes('Here') ||
          cleaned.length > 50 ||
          cleaned.startsWith('-') ||
          cleaned.startsWith('•')) {
        continue
      }
      
      // Headlines válidos são curtos e diretos
      if (cleaned.length <= 30 && cleaned.length > 5) {
        if (cleanHeadlines.length < 15) {
          cleanHeadlines.push(cleaned)
        } else if (cleanDescriptions.length < 4) {
          cleanDescriptions.push(cleaned)
        } else if (cleanCallouts.length < 5) {
          cleanCallouts.push(cleaned)
        } else if (cleanSitelinks.length < 4) {
          cleanSitelinks.push(cleaned)
        }
      }
    }
    
    return {
      headlines: cleanHeadlines,
      descriptions: cleanDescriptions,
      callouts: cleanCallouts,
      sitelinks: cleanSitelinks
    }
  }

  /**
   * Conteúdo de fallback CONSERVADOR se a AI falhar
   */
  private generateFallbackContent(request: LocalizedCampaignRequest) {
    const targetLanguage = getLanguageForCountry(request.targetCountry)
    
    // Templates CONSERVADORES baseados apenas em dados validados
    const baseHeadlines = [
      `${request.productName} Loja`,
      `${request.productName} Site Oficial`, 
      `${request.productName} Comprar Agora`,
      'Últimas Unidades',
      'Compra Segura',
      'Produto Aprovado'
    ]
    
    // Adiciona apenas se dados estão validados
    if (request.discountPercentage) {
      baseHeadlines.push(`${request.productName} ${request.discountPercentage}% Desconto`)
    }
    if (request.guaranteePeriod) {
      baseHeadlines.push(`Garantia ${request.guaranteePeriod}`)
    }
    if (request.deliveryInfo) {
      baseHeadlines.push('Entrega Rápida')
    }
    
    // Completa até 15 headlines com variações conservadoras
    while (baseHeadlines.length < 15) {
      baseHeadlines.push(`${request.productName} Original`)
    }
    
    // Templates básicos por idioma - CONSERVADORES
    const templates = {
      'pt-BR': {
        headlines: [
          ...baseHeadlines,
          'Qualidade Garantida',
          'Entrega Rápida',
          'Satisfação Garantida'
        ],
        descriptions: [
          `${request.productName} original com garantia. Site oficial autorizado.`,
          `Compre com segurança ${request.productName}. Pagamento protegido.`,
          `Oferta especial ${request.productName}. Frete grátis.`,
          `${request.productName} com resultado comprovado. Aproveite hoje.`
        ]
      },
      'it-IT': {
        headlines: [
          `${request.productName} Negozio`,
          `${request.productName} Sito Ufficiale`,
          `${request.productName} Acquista Ora`,
          `${request.productName} Offerta Speciale`,
          `${request.productName} Miglior Prezzo`,
          `${request.productName} Originale`,
          `${request.productName} Offerta Limitata`,
          'Ultime Unità',
          'Garanzia Totale',
          'Spedizione Gratuita',
          'Acquisto Sicuro',
          'Prodotto Approvato',
          'Qualità Garantita',
          'Consegna Rapida',
          'Soddisfazione Garantita'
        ],
        descriptions: [
          `${request.productName} originale con garanzia. Sito ufficiale autorizzato.`,
          `Acquista in sicurezza ${request.productName}. Pagamento protetto.`,
          `Offerta speciale ${request.productName}. Spedizione gratuita.`,
          `${request.productName} con risultati comprovati. Approfitta oggi.`
        ]
      },
      'da-DK': {
        headlines: [
          `{KeyWord:${request.productName}} Online Butik`,
          `${request.productName} Officielt Websted`,
          `${request.productName} Køb Nu`,
          `${request.productName} Særligt Tilbud`,
          `${request.productName} Bedste Pris`,
          `${request.productName} Original`,
          `Levering til {Location (City):DK}`,
          'Sidste Enheder',
          'Total Garanti',
          'Gratis Fragt',
          'Sikker Handel',
          'Godkendt Produkt',
          'Kvalitet Garanteret',
          'Hurtig Levering',
          'Tilfredshed Garanteret'
        ],
        descriptions: [
          `${request.productName} original med garanti. Officielt autoriseret websted.`,
          `Køb sikkert ${request.productName}. Beskyttet betaling.`,
          `${request.deliveryInfo || 'Gratis og hurtig levering'}. Særligt tilbud.`,
          `${request.productName} med dokumenterede resultater. Få det i dag.`
        ]
      }
    }

    const template = templates[targetLanguage as keyof typeof templates] || templates['pt-BR']
    
    return {
      headlines: template.headlines,
      descriptions: template.descriptions,
      callouts: ['100% Natural', 'Aprovado', 'Entrega Imediata', 'Compra Segura', 'Satisfação Garantida'],
      sitelinks: ['Oferta Especial', 'Garantia Total', 'Frete Grátis', 'Comprar Agora']
    }
  }

  /**
   * Análise competitiva inteligente usando IA
   */
  private async analyzeCompetitors(request: LocalizedCampaignRequest): Promise<any[]> {
    console.log(`🔍 Analyzing competitors for ${request.productName} in ${request.targetCountry}`)
    
    const competitorAnalysisPrompt = `
Você é um analista de marketing especialista em Google Ads e análise competitiva.

TAREFA: Analise os padrões de copy mais comuns para "${request.productName}" no mercado de ${request.targetCountry}.

INSTRUÇÕES:
1. Identifique as 5 frases mais CLICHÊS usadas por concorrentes
2. Para cada clichê, sugira 2 alternativas mais persuasivas
3. Foque em palavras que transmitem o mesmo benefício mas soam únicas

FORMATO DA RESPOSTA (JSON):
{
  "cliches": [
    {
      "original": "Melhor Oferta",
      "alternatives": ["Oportunidade Única", "Chance Exclusiva"]
    },
    {
      "original": "Frete Grátis", 
      "alternatives": ["Entrega Sem Custo", "Envio Incluído"]
    }
  ],
  "insights": [
    "Evite superlativos absolutos",
    "Use verbos de ação específicos"
  ]
}

RESPONDA APENAS COM O JSON:
`

    try {
      const response = await this.aiOrchestrator.generateCopywriting({
        task: 'descriptions',
        productData: { productName: request.productName },
        language: getLanguageForCountry(request.targetCountry),
        targetCountry: request.targetCountry,
        customPrompt: competitorAnalysisPrompt
      })

      // Parse da resposta JSON
      const contentText = Array.isArray(response.content) ? response.content[0] : String(response.content)
      const analysis = JSON.parse(contentText.trim())
      console.log(`✅ Competitive analysis completed: ${analysis.cliches?.length || 0} clichés identified`)
      
      return analysis.cliches || []
    } catch (error) {
      console.error('❌ Competitive analysis failed:', error)
      
      // Fallback com análise básica baseada no produto
      return this.getBasicCompetitorInsights(request)
    }
  }

  /**
   * Fallback: insights competitivos básicos
   */
  private getBasicCompetitorInsights(request: LocalizedCampaignRequest): any[] {
    const productCategory = this.categorizeProduct(request.productName)
    
    const basicInsights: Record<string, any[]> = {
      health: [
        { original: "100% Natural", alternatives: ["Totalmente Orgânico", "Pureza Garantida"] },
        { original: "Resultado Garantido", alternatives: ["Eficácia Comprovada", "Sucesso Assegurado"] },
        { original: "Sem Efeitos Colaterais", alternatives: ["Fórmula Segura", "Zero Contraindicações"] }
      ],
      beauty: [
        { original: "Beleza Instantânea", alternatives: ["Transformação Imediata", "Mudança Visível"] },
        { original: "Anti-idade", alternatives: ["Renovação Celular", "Juventude Restaurada"] },
        { original: "Pele Perfeita", alternatives: ["Cutis Impecável", "Aparência Radiante"] }
      ],
      fitness: [
        { original: "Queima Gordura", alternatives: ["Acelera Metabolismo", "Potencializa Energia"] },
        { original: "Músculos Definidos", alternatives: ["Físico Esculpido", "Força Máxima"] },
        { original: "Resultado Rápido", alternatives: ["Progresso Acelerado", "Evolução Visível"] }
      ],
      default: [
        { original: "Melhor Preço", alternatives: ["Valor Imbatível", "Investimento Inteligente"] },
        { original: "Qualidade Premium", alternatives: ["Excelência Superior", "Padrão Elevado"] },
        { original: "Satisfação Garantida", alternatives: ["Confiança Total", "Certeza Absoluta"] }
      ]
    }

    return basicInsights[productCategory] || basicInsights.default
  }

  /**
   * Categoriza produto para análise competitiva
   */
  private categorizeProduct(productName: string): string {
    const name = productName.toLowerCase()
    
    if (name.includes('skin') || name.includes('creme') || name.includes('serum')) return 'beauty'
    if (name.includes('fit') || name.includes('muscle') || name.includes('burn')) return 'fitness'
    if (name.includes('health') || name.includes('supplement') || name.includes('natural')) return 'health'
    
    return 'default'
  }
}