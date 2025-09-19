// Bilingual CSV Generator - Campaign Builder Redesign Implementation
import { AdComponent, SitelinkComponent } from '@/lib/types'
import { HEADLINE_TEMPLATES, DESCRIPTION_TEMPLATES, SITELINK_TEMPLATES, CALLOUT_TEMPLATES, SNIPPET_TEMPLATES, COD_HEADLINE_ADAPTATIONS, COD_DESCRIPTION_ADAPTATIONS, COD_CALLOUTS } from '@/lib/constants/campaign-templates'
import { getCurrencyForCountry } from '@/lib/constants/currencies'
import { createTranslator, RealTranslator } from '@/lib/translation/real-translator'
import type { EnterpriseCompetitiveAnalysis } from '@/lib/intelligence/competitive-intelligence-engine-v3'

export interface BilingualCsvOptions {
  productName: string
  targetCountry: string
  targetLanguage: string
  countryCode: string
  hasDiscountData: boolean
  productPrice?: number
  packQuantity?: number
  packTotalPrice?: number
  guaranteePeriod?: string
  deliveryType?: string
  bonuses?: string
  scarcityType?: string
  campaignType: string
  competitiveIntelligence?: EnterpriseCompetitiveAnalysis | null
}

export interface CsvOutput {
  standardCsvs: {
    headlines: string
    descriptions: string
    sitelinks: string
    callouts: string
    snippets: string
  }
  consolidatedCsv: string
  metadata: {
    totalComponents: number
    targetLanguage: string
    countryCode: string
    generatedAt: string
  }
}

export class BilingualCsvGenerator {
  private options: BilingualCsvOptions
  private components: AdComponent[] = []
  private sitelinkComponents: SitelinkComponent[] = []
  private translator: RealTranslator

  constructor(options: BilingualCsvOptions) {
    this.options = options
    this.translator = createTranslator(options.countryCode, options.productName)
  }

  async generateAllCsvs(): Promise<CsvOutput> {
    // Generate all ad components
    await this.generateHeadlines()
    await this.generateDescriptions()
    await this.generateSitelinks()
    await this.generateCallouts()
    await this.generateSnippets()

    // Generate standard Google Ads CSVs
    const standardCsvs = {
      headlines: this.generateStandardHeadlinesCsv(),
      descriptions: this.generateStandardDescriptionsCsv(),
      sitelinks: this.generateStandardSitelinksCsv(),
      callouts: this.generateStandardCalloutsCsv(),
      snippets: this.generateStandardSnippetsCsv()
    }

    // Generate consolidated bilingual CSV
    const consolidatedCsv = this.generateConsolidatedCsv()

    return {
      standardCsvs,
      consolidatedCsv,
      metadata: {
        totalComponents: this.components.length + this.sitelinkComponents.length,
        targetLanguage: this.options.targetLanguage,
        countryCode: this.options.countryCode,
        generatedAt: new Date().toISOString()
      }
    }
  }

  private async generateHeadlines(): Promise<void> {
    const headlines: AdComponent[] = []

    // 🧠 FUGIR DA MANADA: Apply competitive intelligence to improve headlines
    let improvedTemplates = HEADLINE_TEMPLATES.filter(h => h.type === 'dynamic').slice(0, 15)

    if (this.options.competitiveIntelligence) {
      console.log('🎯 Aplicando regra "Fugir da Manada" aos headlines...')
      improvedTemplates = await this.applyFugirDaMandaRule(improvedTemplates)
    }

    // Generate dynamic headlines (first 15) with competitive intelligence
    for (let i = 0; i < improvedTemplates.length; i++) {
      const template = improvedTemplates[i]
      const localContent = await this.translateTemplate(template.template)
      const englishContent = this.getEnglishVersion(template.template)

      headlines.push({
        type: 'Headlines',
        content_local: localContent,
        characters: localContent.length,
        category: template.category,
        content_en: englishContent,
        position: `Dinâmico ${i + 1}`
      })
    }

    // Handle fixed headlines (positions 5-7) with conditional logic and campaign type
    if (this.options.campaignType === 'COD') {
      // COD Campaign: Use COD-specific headlines for positions 5-6, keep position 7
      const codHeadlines = COD_HEADLINE_ADAPTATIONS.slice(0, 2)
      const fixedPosition7 = HEADLINE_TEMPLATES.find(h => h.type === 'fixed' && h.position === 7)

      for (let i = 0; i < codHeadlines.length; i++) {
        const template = codHeadlines[i]
        const localContent = await this.translateTemplate(template)
        const englishContent = this.getEnglishVersion(template)

        headlines.push({
          type: 'Headlines',
          content_local: localContent,
          characters: localContent.length,
          category: 'Confiança',
          content_en: englishContent,
          position: `COD ${5 + i}`
        })
      }

      // Add fixed position 7 (Site Oficial)
      if (fixedPosition7) {
        const localContent = await this.translateTemplate(fixedPosition7.template)
        const englishContent = this.getEnglishVersion(fixedPosition7.template)

        headlines.push({
          type: 'Headlines',
          content_local: localContent,
          characters: localContent.length,
          category: fixedPosition7.category,
          content_en: englishContent,
          position: `Fixo 7`
        })
      }
    } else if (this.options.hasDiscountData) {
      // Standard Campaign with discount data: Use original fixed headlines
      const fixedTemplates = HEADLINE_TEMPLATES.filter(h => h.type === 'fixed')
      for (const template of fixedTemplates) {
        const localContent = await this.translateTemplate(template.template)
        const englishContent = this.getEnglishVersion(template.template)

        headlines.push({
          type: 'Headlines',
          content_local: localContent,
          characters: localContent.length,
          category: template.category,
          content_en: englishContent,
          position: `Fixo ${template.position}`
        })
      }
    } else {
      // Standard Campaign without discount data: Use substitute bank
      const substituteTemplates = HEADLINE_TEMPLATES.filter(h => h.type === 'substitute').slice(0, 2)
      const fixedPosition7 = HEADLINE_TEMPLATES.find(h => h.type === 'fixed' && h.position === 7)

      for (let i = 0; i < substituteTemplates.length; i++) {
        const template = substituteTemplates[i]
        const localContent = await this.translateTemplate(template.template)
        const englishContent = this.getEnglishVersion(template.template)

        headlines.push({
          type: 'Headlines',
          content_local: localContent,
          characters: localContent.length,
          category: template.category,
          content_en: englishContent,
          position: `Substituto ${5 + i}`
        })
      }

      // Add fixed position 7 (Site Oficial)
      if (fixedPosition7) {
        const localContent = await this.translateTemplate(fixedPosition7.template)
        const englishContent = this.getEnglishVersion(fixedPosition7.template)

        headlines.push({
          type: 'Headlines',
          content_local: localContent,
          characters: localContent.length,
          category: fixedPosition7.category,
          content_en: englishContent,
          position: `Fixo 7`
        })
      }
    }

    // ✅ GARANTIR EXATAMENTE 15 HEADLINES (Google Ads compliance)
    const finalHeadlines = headlines.slice(0, 15)
    console.log(`📊 Generated exactly ${finalHeadlines.length} headlines (Google Ads limit)`)

    this.components.push(...finalHeadlines)
  }

  private async generateDescriptions(): Promise<void> {
    const descriptions: AdComponent[] = []

    // ✅ GOOGLE ADS COMPLIANCE: Máximo 4 descriptions
    const maxDescriptions = 4
    const limitedTemplates = DESCRIPTION_TEMPLATES.slice(0, maxDescriptions)

    for (let i = 0; i < limitedTemplates.length; i++) {
      const template = limitedTemplates[i]
      const localContent = await this.translateTemplate(template.template)
      const englishContent = this.getEnglishVersion(template.template)

      descriptions.push({
        type: 'Descriptions',
        content_local: localContent,
        characters: localContent.length,
        category: template.category as any,
        content_en: englishContent,
        position: `Template ${i + 1}`
      })
    }

    console.log(`📊 Generated exactly ${descriptions.length} descriptions (Google Ads limit: max 4)`)
    this.components.push(...descriptions)
  }

  private async generateSitelinks(): Promise<void> {
    // Select diverse sitelinks from different categories
    const selectedSitelinks = [
      ...SITELINK_TEMPLATES.filter(s => s.category === 'Product Information').slice(0, 3),
      ...SITELINK_TEMPLATES.filter(s => s.category === 'Purchase Process').slice(0, 3),
      ...SITELINK_TEMPLATES.filter(s => s.category === 'Trust & Support').slice(0, 3),
      ...SITELINK_TEMPLATES.filter(s => s.category === 'Shipping & Delivery').slice(0, 3)
    ]

    for (let i = 0; i < selectedSitelinks.length; i++) {
      const sitelink = selectedSitelinks[i]

      // Title
      const titleLocal = await this.translateTemplate(sitelink.title)
      const titleEnglish = this.getEnglishVersion(sitelink.title)

      this.components.push({
        type: 'Sitelinks',
        content_local: `${titleLocal} (Título)`,
        characters: titleLocal.length,
        category: 'Informativo',
        content_en: `${titleEnglish} (Title)`,
        position: `Sitelink ${i + 1} - Título`
      })

      // Description
      const descLocal = await this.translateTemplate(sitelink.description)
      const descEnglish = this.getEnglishVersion(sitelink.description)

      this.components.push({
        type: 'Sitelinks',
        content_local: `${descLocal} (Desc)`,
        characters: descLocal.length,
        category: 'Informativo',
        content_en: `${descEnglish} (Desc)`,
        position: `Sitelink ${i + 1} - Descrição`
      })

      // Store sitelink components separately for standard CSV
      this.sitelinkComponents.push({
        title: titleLocal,
        description: descLocal,
        category: sitelink.category
      })
    }
  }

  private async generateCallouts(): Promise<void> {
    const callouts: AdComponent[] = []

    // Select first 10 callouts for diversity
    const selectedCallouts = CALLOUT_TEMPLATES.slice(0, 10)

    for (let i = 0; i < selectedCallouts.length; i++) {
      const callout = selectedCallouts[i]
      const localContent = await this.translateTemplate(callout)
      const englishContent = this.getEnglishVersion(callout)
      const category = this.categorizeCallout(callout)

      callouts.push({
        type: 'Callouts',
        content_local: localContent,
        characters: localContent.length,
        category,
        content_en: englishContent,
        position: `Callout ${i + 1}`
      })
    }

    this.components.push(...callouts)
  }

  private async generateSnippets(): Promise<void> {
    const snippets: AdComponent[] = []

    // Select first 15 snippets for diversity
    const selectedSnippets = SNIPPET_TEMPLATES.slice(0, 15)

    for (let i = 0; i < selectedSnippets.length; i++) {
      const snippet = selectedSnippets[i]
      const localContent = await this.translateTemplate(snippet)
      const englishContent = this.getEnglishVersion(snippet)
      const category = this.categorizeSnippet(snippet)

      snippets.push({
        type: 'Snippets',
        content_local: localContent,
        characters: localContent.length,
        category,
        content_en: englishContent,
        position: `Snippet ${i + 1}`
      })
    }

    this.components.push(...snippets)
  }

  private generateStandardHeadlinesCsv(): string {
    const headlines = this.components.filter(c => c.type === 'Headlines')
    const csvRows = headlines.map(h => `"${h.content_local}"`).join('\n')
    return `Headline\n${csvRows}`
  }

  private generateStandardDescriptionsCsv(): string {
    const descriptions = this.components.filter(c => c.type === 'Descriptions')
    const csvRows = descriptions.map(d => `"${d.content_local}"`).join('\n')
    return `Description\n${csvRows}`
  }

  private generateStandardSitelinksCsv(): string {
    const csvRows = this.sitelinkComponents.map(s =>
      `"${s.title}","${s.description}"`
    ).join('\n')
    return `Sitelink Title,Sitelink Description\n${csvRows}`
  }

  private generateStandardCalloutsCsv(): string {
    const callouts = this.components.filter(c => c.type === 'Callouts')
    const csvRows = callouts.map(c => `"${c.content_local}"`).join('\n')
    return `Callout\n${csvRows}`
  }

  private generateStandardSnippetsCsv(): string {
    const snippets = this.components.filter(c => c.type === 'Snippets')
    const csvRows = snippets.map(s => `"${s.content_local}"`).join('\n')
    return `Snippet\n${csvRows}`
  }

  private generateConsolidatedCsv(): string {
    const header = 'Tipo,Conteúdo_Local,Caracteres,Categoria,Conteúdo_EN,Posição\n'

    const rows = this.components.map(component => {
      return [
        component.type,
        `"${component.content_local}"`,
        component.characters.toString(),
        component.category,
        `"${component.content_en}"`,
        component.position
      ].join(',')
    }).join('\n')

    return header + rows
  }

  private async translateTemplate(template: string): Promise<string> {
    try {
      // Try real translator first with 3-second timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Translation timeout')), 3000)
      })
      const translationPromise = this.translator.translateText(template)
      return await Promise.race([translationPromise, timeoutPromise])
    } catch (error) {
      // If Hungarian and translation fails, use comprehensive fallback
      if (this.options.targetLanguage === 'hu-HU') {
        return this.getHungarianFallback(template)
      }
      // For other languages, return as-is
      return template
    }
  }

  /**
   * 🇭🇺 FALLBACK HÚNGARO COMPLETO - Sistema confiável para evitar conteúdo misto
   */
  private getHungarianFallback(text: string): string {
    // Dicionário completo PT/EN → HU para evitar conteúdo misto
    const hungarianDict: Record<string, string> = {
      // PRODUTOS
      'Rectin': 'Rectin',
      '[PDTO]': 'Rectin',
      '{ProductName}': 'Rectin',

      // SITELINKS - SOLUÇÃO PARA PROBLEMA PRINCIPAL
      'Rólunk Rectin': 'Rólunk Rectin',
      'Hogyan Működik': 'Hogyan Működik',
      'Előnyök': 'Előnyök',
      'Vásárlás Most': 'Vásárlás Most',
      'Ajânlats Especiais': 'Különleges Ajánlatok',  // ❌ ERRO CORRIGIDO
      'Promoções korlátozott ideig': 'Promóciók korlátozott ideig',  // ❌ ERRO CORRIGIDO
      'Formas de Pagamento': 'Fizetési Módok',  // ❌ PORTUGUÊS → HÚNGARO
      'Cartão, PIX ou boleto': 'Kártya, átutalás vagy bankutalvány',  // ❌ PORTUGUÊS → HÚNGARO
      'Garancia': 'Garancia',
      '24 órás Támogatás': '24 órás Támogatás',
      'Política de Troca': 'Csere Szabályzat',  // ❌ PORTUGUÊS → HÚNGARO
      'Troca fácil e sem burocracia': 'Egyszerű csere bürokrácia nélkül',  // ❌ PORTUGUÊS → HÚNGARO
      'Ingyenes Szállítás': 'Ingyenes Szállítás',
      'Entrega gratuita em todo país': 'Ingyenes szállítás az egész országban',  // ❌ PORTUGUÊS → HÚNGARO
      'Entrega Expressa': 'Expressz Szállítás',  // ❌ PORTUGUÊS → HÚNGARO
      'Receba em até 2 dias úteis': 'Átvétel 2 munkanapon belül',  // ❌ PORTUGUÊS → HÚNGARO
      'Rastrear Pedido': 'Rendelés Követése',  // ❌ PORTUGUÊS → HÚNGARO
      'Acompanhe sua encomenda': 'Kövesse nyomon csomagját',  // ❌ PORTUGUÊS → HÚNGARO

      // HEADLINES - CONTEÚDO MISTO CORRIGIDO
      'Comprar Rectin Online': 'Rectin Vásárlás Online',  // ❌ PORTUGUÊS → HÚNGARO
      'Loja Confiável': 'Megbízható Bolt',  // ❌ PORTUGUÊS → HÚNGARO

      // DESCRIPTIONS - MISTURA CORRIGIDA
      'Exkluzív Kedvezmény em Rectin': 'Exkluzív Kedvezmény Rectin-re',  // ❌ MISTURA → HÚNGARO PURO
      'Rectin com garantált': 'Rectin garantált',  // ❌ MISTURA → HÚNGARO PURO
      'Ajânlat especial Rectin': 'Különleges Ajánlat Rectin',  // ❌ MISTURA → HÚNGARO PURO
      'Comprar Rectin még soha': 'Rectin vásárlás még soha',  // ❌ MISTURA → HÚNGARO PURO
      'Desconto especial korlátozott': 'Különleges kedvezmény korlátozott',  // ❌ MISTURA → HÚNGARO PURO
      'felett R$99': 'felett 99 EUR',  // ❌ BRL → EUR PARA HUNGRIA

      // TEMPLATES GERAIS
      'Buy [PRODUCT] Now - Official Store': 'Vásároljon Rectin Most - Hivatalos Bolt',
      '[PRODUCT] - Best Price Online': 'Rectin - Legjobb Ár Online',
      'Order [PRODUCT] Today': 'Rendelje meg a Rectin-t ma',
      'Natural [PRODUCT] Supplement': 'Természetes Rectin Kiegészítő',
      '[PRODUCT] - Premium Quality': 'Rectin - Prémium Minőség',
      'Free Shipping [PRODUCT]': 'Ingyenes Szállítás Rectin',
      'Original [PRODUCT] Here': 'Eredeti Rectin Itt',

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

      // CALLOUTS
      'Official Website': 'Hivatalos Oldal',
      'Trusted Store': 'Megbízható Bolt',
      'Secure Payment': 'Biztonságos Fizetés',
      'Express Delivery': 'Expressz Szállítás',

      // SNIPPETS
      'Hivatalos Oldal': 'Hivatalos Oldal',
      'Legjobb Ár': 'Legjobb Ár',
      'Eredeti Termék': 'Eredeti Termék',
      'Exkluzív Kedvezmény': 'Exkluzív Kedvezmény',
      'Teljes Garancia': 'Teljes Garancia',
      'Díjmentes': 'Díjmentes',
      'Visszatérítés': 'Visszatérítés',
      'Kamatmentes Részletfizetés': 'Kamatmentes Részletfizetés',
      'Ingyenes Visszaküldés': 'Ingyenes Visszaküldés',
      'Megbízható Cég': 'Megbízható Cég',
      'Védett Vásárlás': 'Védett Vásárlás',
      'Tanúsított': 'Tanúsított'
    }

    // Busca tradução direta primeiro
    if (hungarianDict[text]) {
      return hungarianDict[text]
    }

    // Substituições parciais para templates com variáveis
    let translated = text
    for (const [mixed, hu] of Object.entries(hungarianDict)) {
      translated = translated.replace(new RegExp(mixed, 'gi'), hu)
    }

    // Se ainda tem português, força substituições básicas
    translated = translated
      .replace(/comprar|compre/gi, 'vásároljon')
      .replace(/loja/gi, 'bolt')
      .replace(/promoção|promoções/gi, 'promóciók')
      .replace(/especial/gi, 'különleges')
      .replace(/desconto/gi, 'kedvezmény')
      .replace(/entrega/gi, 'szállítás')
      .replace(/política/gi, 'szabályzat')
      .replace(/troca/gi, 'csere')
      .replace(/rastrear/gi, 'követés')

    return translated
  }

  private getEnglishVersion(template: string): string {
    // Replace product name placeholder
    let english = template.replace(/\{ProductName\}/g, this.options.productName)

    // Basic Portuguese to English mapping
    const translations: Record<string, string> = {
      'Frete Grátis': 'Free Shipping',
      'Desconto Exclusivo': 'Exclusive Discount',
      'Site Oficial': 'Official Site',
      'Melhor Preço': 'Best Price',
      'Compre': 'Buy',
      'Original': 'Original',
      'Oficial': 'Official',
      'com Desconto': 'with Discount',
      'Oferta': 'Offer',
      'Entrega Rápida': 'Fast Delivery',
      'Promoção': 'Promotion',
      'Direto': 'Direct',
      'Loja Oficial': 'Official Store',
      'Genuíno': 'Genuine',
      'Super Oferta': 'Super Offer',
      'Exclusivo': 'Exclusive',
      'Premium': 'Premium',
      'Autêntico': 'Authentic',
      'Liquidação': 'Sale'
    }

    for (const [pt, en] of Object.entries(translations)) {
      english = english.replace(new RegExp(pt, 'g'), en)
    }

    return english
  }

  private getBasicTranslation(text: string, targetLang: string): string {
    // Simplified translation - in production, use proper translation API
    if (targetLang === 'en-US' || targetLang === 'en-GB') {
      return this.getEnglishVersion(text)
    }

    // For other languages, return as-is with product name replaced
    // In production, implement proper translation
    return text
  }

  private categorizeCallout(callout: string): AdComponent['category'] {
    const priceRelated = ['Melhor Preço', 'Desconto Exclusivo', 'Sem Taxa Extra', 'Cashback', 'Parcela sem Juros']
    const trustRelated = ['Site Oficial', 'Produto Original', 'Empresa Confiável', 'Compra Segura']
    const urgencyRelated = ['Oferta Limitada', 'Atendimento VIP']
    const benefitRelated = ['Frete Grátis', 'Entrega Rápida', 'Entrega Expressa', 'Garantia 30 dias', 'Suporte 24h', 'Devolução Grátis']

    if (priceRelated.includes(callout)) return 'Preço'
    if (trustRelated.includes(callout)) return 'Confiança'
    if (urgencyRelated.includes(callout)) return 'Urgência'
    if (benefitRelated.includes(callout)) return 'Benefício'

    return 'Promocional'
  }

  private categorizeSnippet(snippet: string): AdComponent['category'] {
    const priceRelated = ['Melhor Preço', 'Desconto Exclusivo', 'Sem Taxa', 'Cashback', 'Parcele sem Juros', 'Liquidação']
    const trustRelated = ['Site Oficial', 'Produto Original', 'Empresa Confiável', 'Compra Protegida', 'Certificado', 'Premiado', 'Recomendado']
    const urgencyRelated = ['Últimas Unidades', 'Por Tempo Limitado', 'Não Perca', 'Aproveite', 'Limitado']
    const scarcityRelated = ['Exclusivo', 'Mais Vendido', 'Novidade', 'Imperdível']
    const benefitRelated = ['Frete Grátis', 'Entrega Rápida', 'Garantia Total', 'Suporte 24h', 'Devolução Grátis']

    if (priceRelated.includes(snippet)) return 'Preço'
    if (trustRelated.includes(snippet)) return 'Confiança'
    if (urgencyRelated.includes(snippet)) return 'Urgência'
    if (scarcityRelated.includes(snippet)) return 'Escassez'
    if (benefitRelated.includes(snippet)) return 'Benefício'

    return 'Promocional'
  }

  /**
   * 🧠 FUGIR DA MANADA RULE
   *
   * Compares our standard headlines with competitor patterns.
   * If competitors have better local expressions for the same concept, use those.
   * Otherwise, keep our original templates.
   *
   * Example: If our template is "promoção termina hoje" but competitors use
   * "última oportunidade" (which tests better), we switch to the competitor phrase.
   */
  private async applyFugirDaMandaRule(templates: any[]): Promise<any[]> {
    if (!this.options.competitiveIntelligence?.puppeteerData?.languagePatterns) {
      console.log('📊 No competitive language patterns found, keeping original templates')
      return templates
    }

    const competitivePatterns = this.options.competitiveIntelligence.puppeteerData.languagePatterns
    const improvedTemplates = [...templates]

    console.log(`🔍 Analyzing ${competitivePatterns.commonPhrases.length} competitive phrases`)

    // Map common concepts to check for improvements
    const conceptMappings = [
      { concept: 'urgency', ourPhrases: ['promoção termina', 'última chance', 'aproveite agora'], category: 'Urgência' },
      { concept: 'trust', ourPhrases: ['site oficial', 'produto original', 'empresa confiável'], category: 'Confiança' },
      { concept: 'price', ourPhrases: ['melhor preço', 'desconto exclusivo', 'oferta especial'], category: 'Preço' },
      { concept: 'benefit', ourPhrases: ['frete grátis', 'entrega rápida', 'garantia'], category: 'Benefício' }
    ]

    for (const mapping of conceptMappings) {
      // Find competitor phrases for this concept that perform better
      const competitorAlternatives = competitivePatterns.commonPhrases.filter(phrase =>
        phrase.performance > 0.7 && // High performance threshold
        this.isRelatedConcept(phrase.phrase, mapping.concept)
      )

      if (competitorAlternatives.length > 0) {
        // Find templates in our set that match this concept
        const templatesForConcept = improvedTemplates.filter(template =>
          mapping.ourPhrases.some(ourPhrase =>
            template.template.toLowerCase().includes(ourPhrase)
          )
        )

        // Replace with best performing competitor alternative
        for (const template of templatesForConcept) {
          const bestAlternative = competitorAlternatives.sort((a, b) => b.performance - a.performance)[0]
          const originalPhrase = mapping.ourPhrases.find(phrase =>
            template.template.toLowerCase().includes(phrase)
          )

          if (originalPhrase && bestAlternative) {
            template.template = template.template.replace(
              new RegExp(originalPhrase, 'gi'),
              bestAlternative.phrase
            )

            console.log(`🔄 FUGIR DA MANADA: "${originalPhrase}" → "${bestAlternative.phrase}" (performance: ${bestAlternative.performance})`)
          }
        }
      }
    }

    // Also check for best local expressions
    if (competitivePatterns.localExpressions.length > 0) {
      console.log(`🌍 Found ${competitivePatterns.localExpressions.length} local expressions, integrating best ones`)

      // Add top local expressions as new templates if they're high quality
      const topLocalExpressions = competitivePatterns.localExpressions.slice(0, 3)
      for (let i = 0; i < topLocalExpressions.length && improvedTemplates.length < 15; i++) {
        const localExpr = topLocalExpressions[i]

        // Add as new dynamic template
        improvedTemplates.push({
          template: `${localExpr} ${this.options.productName}`,
          category: 'Local',
          type: 'dynamic'
        })
      }
    }

    console.log(`✅ FUGIR DA MANADA completed: analyzed ${templates.length} original templates`)
    return improvedTemplates.slice(0, 15) // Ensure we don't exceed 15 headlines
  }

  /**
   * Checks if a competitor phrase is related to a specific concept
   */
  private isRelatedConcept(phrase: string, concept: string): boolean {
    const phraseWords = phrase.toLowerCase().split(' ')

    const conceptKeywords = {
      urgency: ['termina', 'última', 'aproveite', 'agora', 'hoje', 'urgente', 'limitado', 'acaba'],
      trust: ['oficial', 'original', 'confiável', 'seguro', 'garantido', 'certificado', 'autêntico'],
      price: ['preço', 'desconto', 'oferta', 'barato', 'econômico', 'promocional', 'liquidação'],
      benefit: ['grátis', 'rápida', 'expressa', 'garantia', 'devolução', 'suporte', 'benefício']
    }

    const keywords = conceptKeywords[concept as keyof typeof conceptKeywords] || []
    return keywords.some(keyword => phraseWords.some(word => word.includes(keyword)))
  }
}

// Utility function to generate filename
export function generateCsvFilename(type: 'headlines' | 'descriptions' | 'sitelinks' | 'callouts' | 'snippets' | 'consolidated', countryCode: string): string {
  const timestamp = new Date().toISOString().slice(0, 10)

  if (type === 'consolidated') {
    return `campaign_master_control_${countryCode}_EN_${timestamp}.csv`
  }

  return `campaign_${type}_${countryCode}_${timestamp}.csv`
}

// LEGACY SUPPORT - Keep existing interface for compatibility
export interface BilingualCSVRequest {
  originalData: {
    productName: string
    targetCountry: string
    language: string
    currency: string
    headlines: string[]
    descriptions: string[]
  }
}

export interface BilingualCSVResult {
  originalFiles: Record<string, string>
  portugueseFiles: Record<string, string>
  metadata: {
    originalLanguage: string
    targetCountry: string
    filesGenerated: number
  }
}

// Export singleton for backward compatibility
export const bilingualCSVGenerator = new BilingualCsvGenerator({
  productName: '',
  targetCountry: '',
  targetLanguage: 'pt-BR',
  countryCode: 'BR',
  hasDiscountData: false,
  campaignType: 'Standard'
})