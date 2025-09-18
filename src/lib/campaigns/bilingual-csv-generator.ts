// Bilingual CSV Generator - Campaign Builder Redesign Implementation
import { AdComponent, SitelinkComponent } from '@/lib/types'
import { HEADLINE_TEMPLATES, DESCRIPTION_TEMPLATES, SITELINK_TEMPLATES, CALLOUT_TEMPLATES, SNIPPET_TEMPLATES, COD_HEADLINE_ADAPTATIONS, COD_DESCRIPTION_ADAPTATIONS, COD_CALLOUTS } from '@/lib/constants/campaign-templates'
import { getCurrencyForCountry } from '@/lib/constants/currencies'
import { createTranslator, RealTranslator } from '@/lib/translation/real-translator'

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

    // Generate dynamic headlines (first 15)
    const dynamicTemplates = HEADLINE_TEMPLATES.filter(h => h.type === 'dynamic').slice(0, 15)
    for (let i = 0; i < dynamicTemplates.length; i++) {
      const template = dynamicTemplates[i]
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

    this.components.push(...headlines)
  }

  private async generateDescriptions(): Promise<void> {
    const descriptions: AdComponent[] = []

    for (let i = 0; i < DESCRIPTION_TEMPLATES.length; i++) {
      const template = DESCRIPTION_TEMPLATES[i]
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
    // Use real translator for proper language conversion
    return await this.translator.translateText(template)
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