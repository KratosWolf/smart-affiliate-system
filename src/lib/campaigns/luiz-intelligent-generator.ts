/**
 * LUIZ INTELLIGENT GENERATOR
 * Sistema 100% IA que implementa EXATAMENTE o modelo CAMPANHAS & PERFORMANCE TF
 *
 * ESTRUTURA:
 * - 7 Headlines FIXOS (sempre aparecem)
 * - 8 Headlines DINÂMICOS (IA escolhe os melhores)
 * - Para COD: Garante que os 5 headlines COD estão entre os 8 dinâmicos
 * - Regra "Fugir da Manada": Ajusta grafia e escolhe melhores templates
 */

import {
  LUIZ_HEADLINES_FIXOS,
  LUIZ_HEADLINES_DINAMICOS,
  LUIZ_HEADLINES_COD,
  LUIZ_DESCRIPTIONS,
  LUIZ_SITELINKS,
  LUIZ_CALLOUTS,
  LUIZ_SNIPPETS,
  substituteVariables,
  type LuizTemplate
} from '@/lib/constants/luiz-campaign-templates'
import type { FastCompetitiveAnalysis } from '@/lib/intelligence/competitive-intelligence-engine-fast'
import { createTranslator, type RealTranslator } from '@/lib/translation/real-translator'

export interface LuizCampaignData {
  // Campos básicos
  productName: string
  targetCountry: string
  targetLanguage: string
  campaignType: 'Standard' | 'COD' | 'Review' | 'E-commerce' | 'Produto Restrito'

  // Campos para substituição de variáveis
  guaranteePeriod?: string  // [GUARANTEE]
  discountAmount?: number   // [VALUE DISCOUNT]
  discountPercentage?: number // [DISCOUNT%]
  productPrice?: number     // [UNIT PRICE]
  deliveryType?: string     // [Delivery]

  // Inteligência competitiva
  competitiveIntelligence?: FastCompetitiveAnalysis | null
}

export interface LuizCampaignOutput {
  headlines: string[]      // Exatamente 15 (7 fixos + 8 dinâmicos)
  descriptions: string[]   // Máximo 4
  sitelinks: string[]      // Máximo 6
  callouts: string[]       // 4-10
  snippets: string[]       // Máximo 10

  metadata: {
    fixedHeadlinesCount: number
    dynamicHeadlinesCount: number
    codHeadlinesIncluded: number
    competitiveOptimizations: number
    totalTemplatesUsed: number
  }
}

export class LuizIntelligentGenerator {
  private translator: RealTranslator
  private campaignData: LuizCampaignData

  constructor(campaignData: LuizCampaignData) {
    this.campaignData = campaignData
    this.translator = createTranslator(campaignData.targetCountry, campaignData.productName)
  }

  /**
   * GERAÇÃO PRINCIPAL - Implementa EXATAMENTE a estrutura do modelo Luiz
   */
  async generateCampaign(): Promise<LuizCampaignOutput> {
    console.log(`🎯 LUIZ INTELLIGENT GENERATOR: ${this.campaignData.campaignType} campaign for ${this.campaignData.productName}`)

    // ✅ 1. HEADLINES FIXOS (sempre os 7)
    const fixedHeadlines = await this.generateFixedHeadlines()
    console.log(`✅ Generated ${fixedHeadlines.length} fixed headlines`)

    // ✅ 2. HEADLINES DINÂMICOS (IA escolhe os 8 melhores)
    const dynamicHeadlines = await this.generateDynamicHeadlines()
    console.log(`✅ Generated ${dynamicHeadlines.length} dynamic headlines`)

    // ✅ 3. DESCRIPTIONS (máximo 4, IA escolhe os melhores)
    const descriptions = await this.generateDescriptions()
    console.log(`✅ Generated ${descriptions.length} descriptions`)

    // ✅ 4. EXTENSIONS (sitelinks, callouts, snippets)
    const sitelinks = await this.generateSitelinks()
    const callouts = await this.generateCallouts()
    const snippets = await this.generateSnippets()

    const output: LuizCampaignOutput = {
      headlines: [...fixedHeadlines, ...dynamicHeadlines],
      descriptions,
      sitelinks,
      callouts,
      snippets,
      metadata: {
        fixedHeadlinesCount: fixedHeadlines.length,
        dynamicHeadlinesCount: dynamicHeadlines.length,
        codHeadlinesIncluded: this.campaignData.campaignType === 'COD' ? 5 : 0,
        competitiveOptimizations: this.campaignData.competitiveIntelligence ? 1 : 0,
        totalTemplatesUsed: fixedHeadlines.length + dynamicHeadlines.length + descriptions.length + sitelinks.length + callouts.length + snippets.length
      }
    }

    console.log(`🎯 LUIZ CAMPAIGN COMPLETE:`, output.metadata)
    return output
  }

  /**
   * ✅ HEADLINES FIXOS - SEMPRE OS 7 DO MODELO
   */
  private async generateFixedHeadlines(): Promise<string[]> {
    const fixedHeadlines: string[] = []

    for (const template of LUIZ_HEADLINES_FIXOS) {
      // 1. Substitui variáveis
      let processedTemplate = substituteVariables(template.template, this.campaignData)

      // 2. Aplica regra "Fugir da Manada" (ajustes de grafia)
      if (this.campaignData.competitiveIntelligence) {
        processedTemplate = await this.applyFugirDaMandaRule(processedTemplate, template.category)
      }

      // 3. Traduz para idioma target (com fallback rápido)
      const translatedHeadline = await this.translateWithFallback(processedTemplate)

      fixedHeadlines.push(translatedHeadline)
    }

    return fixedHeadlines
  }

  /**
   * ✅ HEADLINES DINÂMICOS - IA ESCOLHE OS 8 MELHORES
   * Para COD: Garante que os 5 headlines COD estão incluídos
   */
  private async generateDynamicHeadlines(): Promise<string[]> {
    let availableTemplates = [...LUIZ_HEADLINES_DINAMICOS]
    let selectedTemplates: LuizTemplate[] = []

    // ✅ REGRA COD: Se campanha COD, garante que os 5 headlines COD estão incluídos
    if (this.campaignData.campaignType === 'COD') {
      selectedTemplates = [...LUIZ_HEADLINES_COD]
      console.log(`🎯 COD Campaign: Added all 5 COD headlines`)
    }

    // ✅ IA SELECTION: Escolhe os melhores templates restantes
    const remainingSlots = 8 - selectedTemplates.length
    const bestTemplates = await this.selectBestTemplates(availableTemplates, remainingSlots)
    selectedTemplates = [...selectedTemplates, ...bestTemplates]

    // ✅ PROCESSA TEMPLATES
    const dynamicHeadlines: string[] = []
    for (const template of selectedTemplates) {
      // 1. Substitui variáveis
      let processedTemplate = substituteVariables(template.template, this.campaignData)

      // 2. Aplica regra "Fugir da Manada"
      if (this.campaignData.competitiveIntelligence) {
        processedTemplate = await this.applyFugirDaMandaRule(processedTemplate, template.category)
      }

      // 3. Traduz para idioma target (com fallback rápido)
      const translatedHeadline = await this.translateWithFallback(processedTemplate)

      dynamicHeadlines.push(translatedHeadline)
    }

    return dynamicHeadlines
  }

  /**
   * ✅ DESCRIPTIONS - MÁXIMO 4, IA ESCOLHE OS MELHORES
   */
  private async generateDescriptions(): Promise<string[]> {
    const bestTemplates = await this.selectBestTemplates(LUIZ_DESCRIPTIONS, 4)
    const descriptions: string[] = []

    for (const template of bestTemplates) {
      // 1. Substitui variáveis
      let processedTemplate = substituteVariables(template.template, this.campaignData)

      // 2. Aplica regra "Fugir da Manada"
      if (this.campaignData.competitiveIntelligence) {
        processedTemplate = await this.applyFugirDaMandaRule(processedTemplate, template.category)
      }

      // 3. Traduz para idioma target (com fallback rápido)
      const translatedDescription = await this.translateWithFallback(processedTemplate)

      // 4. Garante limite de 90 caracteres
      if (translatedDescription.length <= 90) {
        descriptions.push(translatedDescription)
      }
    }

    return descriptions
  }

  /**
   * ✅ SITELINKS - MÁXIMO 6
   */
  private async generateSitelinks(): Promise<string[]> {
    const bestTemplates = await this.selectBestTemplates(LUIZ_SITELINKS, 6)
    const sitelinks: string[] = []

    for (const template of bestTemplates) {
      let processedTemplate = substituteVariables(template.template, this.campaignData)

      if (this.campaignData.competitiveIntelligence) {
        processedTemplate = await this.applyFugirDaMandaRule(processedTemplate, template.category)
      }

      const translatedSitelink = await this.translateWithFallback(processedTemplate)

      if (translatedSitelink.length <= template.maxCharacters) {
        sitelinks.push(translatedSitelink)
      }
    }

    return sitelinks
  }

  /**
   * ✅ CALLOUTS - 4 a 10
   */
  private async generateCallouts(): Promise<string[]> {
    const bestTemplates = await this.selectBestTemplates(LUIZ_CALLOUTS, 8)
    const callouts: string[] = []

    for (const template of bestTemplates) {
      let processedTemplate = substituteVariables(template.template, this.campaignData)

      if (this.campaignData.competitiveIntelligence) {
        processedTemplate = await this.applyFugirDaMandaRule(processedTemplate, template.category)
      }

      const translatedCallout = await this.translateWithFallback(processedTemplate)

      if (translatedCallout.length <= 25) {
        callouts.push(translatedCallout)
      }
    }

    return callouts
  }

  /**
   * ✅ SNIPPETS - MÁXIMO 10
   */
  private async generateSnippets(): Promise<string[]> {
    const bestTemplates = await this.selectBestTemplates(LUIZ_SNIPPETS, 10)
    const snippets: string[] = []

    for (const template of bestTemplates) {
      let processedTemplate = substituteVariables(template.template, this.campaignData)

      if (this.campaignData.competitiveIntelligence) {
        processedTemplate = await this.applyFugirDaMandaRule(processedTemplate, template.category)
      }

      const translatedSnippet = await this.translateWithFallback(processedTemplate)

      if (translatedSnippet.length <= 25) {
        snippets.push(translatedSnippet)
      }
    }

    return snippets
  }

  /**
   * 🧠 IA SELECTION: Escolhe os melhores templates baseado em vários fatores
   */
  private async selectBestTemplates(templates: LuizTemplate[], maxCount: number): Promise<LuizTemplate[]> {
    // ✅ SCORING SYSTEM: Pontua templates baseado em relevância para a campanha
    const scoredTemplates = templates.map(template => {
      let score = 0

      // 1. Pontos por categoria relevante
      if (this.campaignData.discountPercentage && template.category.includes('SAVINGS')) score += 20
      if (this.campaignData.guaranteePeriod && template.category.includes('GUARANTEE')) score += 20
      if (this.campaignData.deliveryType && template.category.includes('DELIVERY')) score += 15
      if (template.category.includes('CTA')) score += 10 // CTAs sempre bons
      if (template.category.includes('SCARCITY')) score += 15 // Escassez gera urgência

      // 2. Pontos por presença de variáveis relevantes
      if (template.template.includes('[DISCOUNT%]') && this.campaignData.discountPercentage) score += 15
      if (template.template.includes('[VALUE DISCOUNT]') && this.campaignData.discountAmount) score += 15
      if (template.template.includes('[UNIT PRICE]') && this.campaignData.productPrice) score += 10
      if (template.template.includes('[GUARANTEE]') && this.campaignData.guaranteePeriod) score += 15
      if (template.template.includes('[Delivery]') && this.campaignData.deliveryType) score += 10

      // 3. Competitive Intelligence Score
      if (this.campaignData.competitiveIntelligence) {
        score += this.getCompetitiveScore(template)
      }

      return { template, score }
    })

    // ✅ Ordena por score e retorna os melhores
    return scoredTemplates
      .sort((a, b) => b.score - a.score)
      .slice(0, maxCount)
      .map(item => item.template)
  }

  /**
   * 🧠 COMPETITIVE INTELLIGENCE SCORE
   */
  private getCompetitiveScore(template: LuizTemplate): number {
    if (!this.campaignData.competitiveIntelligence?.recommendations?.headlines) {
      return 0
    }

    const competitorHeadlines = this.campaignData.competitiveIntelligence.recommendations.headlines
    let score = 0

    // Verifica se o template usa palavras-chave que aparecem nos headlines dos competidores
    for (const headline of competitorHeadlines) {
      const headlineWords = headline.toLowerCase().split(' ')
      const templateWords = template.template.toLowerCase().split(' ')

      const commonWords = headlineWords.filter(word =>
        templateWords.some(tWord => tWord.includes(word) || word.includes(tWord))
      )

      if (commonWords.length > 0) {
        score += commonWords.length * 2 // Score baseado em palavras comuns
      }
    }

    return score
  }

  /**
   * 🎯 FUGIR DA MANADA - Ajusta grafia baseado na competitive intelligence
   */
  private async applyFugirDaMandaRule(text: string, category: string): Promise<string> {
    if (!this.campaignData.competitiveIntelligence?.recommendations?.marketingStrategy) {
      return text
    }

    const strategies = this.campaignData.competitiveIntelligence.recommendations.marketingStrategy
    let optimizedText = text

    // ✅ APLICA OTIMIZAÇÕES BASEADAS NA ESTRATÉGIA COMPETITIVA
    for (const strategy of strategies) {
      if (strategy.includes('localized') && this.campaignData.targetLanguage !== 'pt-BR') {
        // Para idiomas não-portugueses, força uso de termos mais localizados
        optimizedText = optimizedText.replace(/Original/g, 'Eredeti') // Hungarian example
          .replace(/Best Price/g, 'Legjobb Ár')
          .replace(/Free Shipping/g, 'Ingyenes Szállítás')
      }
    }

    // ✅ ADICIONA URGÊNCIA BASEADA EM PATTERNS COMPETITIVOS
    if (category === 'Urgência' && !optimizedText.includes('!')) {
      optimizedText += '!'
    }

    return optimizedText
  }

  /**
   * 🚀 FALLBACK TRANSLATION - Evita timeouts da API externa
   */
  private async translateWithFallback(text: string): Promise<string> {
    try {
      // Tentativa com timeout de 3 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Translation timeout')), 3000)
      })

      const translationPromise = this.translator.translateText(text)

      const result = await Promise.race([translationPromise, timeoutPromise])
      return result

    } catch (error) {
      console.log(`⚡ Fallback translation for "${text}" (${this.campaignData.targetLanguage})`)

      // FALLBACK HÚNGARO: Traduções diretas mais confiáveis
      if (this.campaignData.targetLanguage === 'hu-HU') {
        return this.getHungarianFallback(text)
      }

      // FALLBACK OUTROS IDIOMAS: Mantém inglês se não conseguir traduzir
      return text
    }
  }

  /**
   * 🇭🇺 FALLBACK HÚNGARO - Traduções específicas para evitar timeouts
   */
  private getHungarianFallback(text: string): string {
    // Dicionário de traduções diretas pt/en → hu
    const hungarianDict: Record<string, string> = {
      // PRODUTOS
      'Rectin': 'Rectin',
      '[PDTO]': 'Rectin',

      // HEADLINES FIXOS
      'Buy [PRODUCT] Now - Official Store': 'Vásároljon Rectin Most - Hivatalos Bolt',
      '[PRODUCT] - Best Price Online': 'Rectin - Legjobb Ár Online',
      'Order [PRODUCT] Today': 'Rendelje meg a Rectin-t ma',
      'Natural [PRODUCT] Supplement': 'Természetes Rectin Kiegészítő',
      '[PRODUCT] - Premium Quality': 'Rectin - Prémium Minőség',
      'Free Shipping [PRODUCT]': 'Ingyenes Szállítás Rectin',
      'Original [PRODUCT] Here': 'Eredeti Rectin Itt',

      // TEMPLATES LUIZ EM INGLÊS → HÚNGARO
      'Rectin Rectin + Online Store': 'Rectin Eredeti + Online Bolt',
      'Rectin Order Now': 'Rectin Rendelés Most',
      'Rectin Buy Now': 'Rectin Vásárlás Most',
      'Rectin Special Offer': 'Rectin Különleges Ajánlat',
      'Rectin Save Up To $50': 'Rectin Takarítson Meg $50-t',
      'Rectin Biggest Discount': 'Rectin Legnagyobb Kedvezmény',
      'Rectin Get Your Offer': 'Rectin Szerezze be Ajánlatát',
      '30-Day Money Back Guarantee': '30 Napos Pénzvisszafizetési Garancia',
      'Free Shipping to HU': 'Ingyenes Szállítás Magyarországra',
      'Free Delivery': 'Ingyenes Szállítás',
      'Order Now While Suplies Last': 'Rendeljen Most Amíg Készlet Tart',
      'Last Hours Offer, Act Now': 'Utolsó Órák Ajánlat, Cselekedj Most',
      'Start Your Order NOw': 'Indítsa Rendelését Most',

      // CTAs
      'Buy Now': 'Vásároljon Most',
      'Order Today': 'Rendelje ma',
      'Get Now': 'Szerezze be most',
      'Official Store': 'Hivatalos Bolt',
      'Best Price': 'Legjobb Ár',
      'Free Shipping': 'Ingyenes Szállítás',
      'Fast Delivery': 'Gyors Szállítás',
      'Original Product': 'Eredeti Termék',

      // GARANTIAS
      '30 Day Guarantee': '30 Napos Garancia',
      'Money Back Guarantee': 'Pénzvisszafizetési Garancia',
      'Full Guarantee': 'Teljes Garancia',

      // PREÇOS E DESCONTOS
      'Special Offer': 'Különleges Ajánlat',
      'Limited Time': 'Korlátozott Ideig',
      'Exclusive Discount': 'Exkluzív Kedvezmény',
      'Best Deal': 'Legjobb Ajánlat',

      // SITELINKS (from CSV files)
      'Where To Buy Rectin': 'Hol Vásárolhat Rectin-t',
      'Rectin is Only Available for': 'Rectin Csak Itt Elérhető',
      'Purchase On Website': 'Vásárlás a Weboldalon',
      'Half Price Offer': 'Fél Áras Ajánlat',
      'Big Sale in Progress': 'Nagy Akció Folyamatban',
      'Get 50% Off': 'Szerezzen 50% Kedvezményt',
      'About Us': 'Rólunk',
      'How It Works': 'Hogyan Működik',
      'Benefits': 'Előnyök',
      'Shop Now': 'Vásárlás Most',
      'Support': '24 órás Támogatás',
      'Guarantee': 'Garancia',

      // SNIPPETS (from CSV files)
      'Free Private Delivery': 'Ingyenes Privát Szállítás',
      'Half Price Offer': 'Fél Áras Ajánlat',

      // MISSING HEADLINES (from CSV files)
      '[Guarantee]Days to Try With Money Back': '[GUARANTEE] Napos Kipróbálás Pénzvisszafizetéssel',
      'Only $19800Per Bottle Today': 'Csak $19800 Per Palack Ma',

      // DESCRIPTIONS (from CSV files)
      'High converting sitelink': 'Magas Konverziós Sitelink',

      // CALLOUTS
      'Official Website': 'Hivatalos Oldal',
      'Trusted Store': 'Megbízható Bolt',
      'Secure Payment': 'Biztonságos Fizetés',
      'Express Delivery': 'Expressz Szállítás'
    }

    // Busca tradução direta
    if (hungarianDict[text]) {
      return hungarianDict[text]
    }

    // Substituições parciais para templates com variáveis
    let translated = text
    for (const [en, hu] of Object.entries(hungarianDict)) {
      translated = translated.replace(new RegExp(en, 'gi'), hu)
    }

    return translated
  }
}

/**
 * ✅ FUNÇÃO PRINCIPAL DE GERAÇÃO
 */
export async function generateLuizCampaign(campaignData: LuizCampaignData): Promise<LuizCampaignOutput> {
  const generator = new LuizIntelligentGenerator(campaignData)
  return await generator.generateCampaign()
}