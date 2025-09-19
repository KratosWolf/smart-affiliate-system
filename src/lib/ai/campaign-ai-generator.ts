/**
 * 🤖 AI CAMPAIGN GENERATOR - SISTEMA LIMPO
 * Gera campanhas Google Ads usando 100% AI sem fallbacks complexos
 */

import { getLanguageForCountry, getCountryInfo } from '@/lib/constants/countries-languages'

export interface CampaignInput {
  productName: string
  countryCode: string
  platform: string
  commissionValue: number
  commissionCurrency: string
  baseUrl: string
  campaignType?: string
}

export interface CampaignCSVs {
  headlines: string[]
  descriptions: string[]
  sitelinks: { title: string; description: string }[]
  snippets: string[]
  campaignName: string
  keywords: string[]
}

export class CampaignAIGenerator {

  /**
   * 🎯 MÉTODO PRINCIPAL - GERA CAMPANHA COMPLETA
   */
  async generateCampaign(input: CampaignInput): Promise<CampaignCSVs> {
    console.log('🚀 AI Campaign Generator - Starting:', input)

    // 1. Mapear país para idioma
    const languageCode = getLanguageForCountry(input.countryCode)
    const countryInfo = getCountryInfo(input.countryCode)

    console.log(`🌍 Country: ${countryInfo?.name} (${input.countryCode}) → Language: ${languageCode}`)

    // 2. Gerar nome da campanha
    const campaignName = this.generateCampaignName(input, countryInfo)

    // 3. Gerar keywords simples
    const keywords = this.generateKeywords(input.productName)

    // 4. Gerar conteúdo via AI
    const headlines = await this.generateHeadlines(input, languageCode)
    const descriptions = await this.generateDescriptions(input, languageCode)
    const sitelinks = await this.generateSitelinks(input, languageCode)
    const snippets = await this.generateSnippets(input, languageCode)

    const result = {
      headlines,
      descriptions,
      sitelinks,
      snippets,
      campaignName,
      keywords
    }

    console.log('✅ AI Campaign Generated:', {
      headlinesCount: headlines.length,
      descriptionsCount: descriptions.length,
      sitelinksCount: sitelinks.length,
      snippetsCount: snippets.length,
      language: languageCode
    })

    return result
  }

  /**
   * 📝 GERAR NOME DA CAMPANHA
   */
  private generateCampaignName(input: CampaignInput, countryInfo: any): string {
    return `${input.productName} - ${input.countryCode} - ${input.platform} - ${input.commissionCurrency}${input.commissionValue}`
  }

  /**
   * 🔑 GERAR KEYWORDS SIMPLES
   */
  private generateKeywords(productName: string): string[] {
    return [
      productName.toLowerCase(),
      productName.toUpperCase(),
      `${productName.toLowerCase()} original`,
      `comprar ${productName.toLowerCase()}`,
      `${productName.toLowerCase()} preço`
    ]
  }

  /**
   * 📢 GERAR HEADLINES VIA AI
   */
  private async generateHeadlines(input: CampaignInput, languageCode: string): Promise<string[]> {
    const prompt = `
You are a Google Ads expert. Generate exactly 15 headlines in ${languageCode} language for:

Product: ${input.productName}
Platform: ${input.platform}
Commission: ${input.commissionCurrency} ${input.commissionValue}

Requirements:
- Each headline max 30 characters
- Focus on: buying, original product, best price, guarantee
- Use action words in ${languageCode}
- Include product name in most headlines
- Generate urgency and trust

Return ONLY a JSON array of 15 strings, nothing else.
`

    try {
      const response = await this.callAI(prompt)
      const headlines = JSON.parse(response)

      if (Array.isArray(headlines) && headlines.length === 15) {
        return headlines
      }

      throw new Error('Invalid headlines format')
    } catch (error) {
      console.error('❌ Headlines AI failed:', error)
      return this.getHeadlinesFallback(input, languageCode)
    }
  }

  /**
   * 📝 GERAR DESCRIPTIONS VIA AI
   */
  private async generateDescriptions(input: CampaignInput, languageCode: string): Promise<string[]> {
    const prompt = `
Generate exactly 4 descriptions in ${languageCode} language for Google Ads:

Product: ${input.productName}
Platform: ${input.platform}

Requirements:
- Each description max 90 characters
- Focus on: benefits, guarantee, free shipping
- Use persuasive language in ${languageCode}
- Include call-to-action

Return ONLY a JSON array of 4 strings, nothing else.
`

    try {
      const response = await this.callAI(prompt)
      const descriptions = JSON.parse(response)

      if (Array.isArray(descriptions) && descriptions.length === 4) {
        return descriptions
      }

      throw new Error('Invalid descriptions format')
    } catch (error) {
      console.error('❌ Descriptions AI failed:', error)
      return this.getDescriptionsFallback(input, languageCode)
    }
  }

  /**
   * 🔗 GERAR SITELINKS VIA AI
   */
  private async generateSitelinks(input: CampaignInput, languageCode: string): Promise<{ title: string; description: string }[]> {
    const prompt = `
Generate exactly 6 sitelinks in ${languageCode} language for:

Product: ${input.productName}

Requirements:
- Each title max 25 characters
- Each description max 35 characters
- Focus on: purchase, about us, how it works, guarantee, support, benefits
- Use ${languageCode} language

Return ONLY a JSON array of 6 objects with "title" and "description" properties, nothing else.
`

    try {
      const response = await this.callAI(prompt)
      const sitelinks = JSON.parse(response)

      if (Array.isArray(sitelinks) && sitelinks.length === 6) {
        return sitelinks
      }

      throw new Error('Invalid sitelinks format')
    } catch (error) {
      console.error('❌ Sitelinks AI failed:', error)
      return this.getSitelinksFallback(input, languageCode)
    }
  }

  /**
   * 🏷️ GERAR SNIPPETS VIA AI
   */
  private async generateSnippets(input: CampaignInput, languageCode: string): Promise<string[]> {
    const prompt = `
Generate exactly 2 snippets in ${languageCode} language for:

Product: ${input.productName}

Requirements:
- Each snippet max 25 characters
- Focus on: free shipping, official store
- Use ${languageCode} language

Return ONLY a JSON array of 2 strings, nothing else.
`

    try {
      const response = await this.callAI(prompt)
      const snippets = JSON.parse(response)

      if (Array.isArray(snippets) && snippets.length === 2) {
        return snippets
      }

      throw new Error('Invalid snippets format')
    } catch (error) {
      console.error('❌ Snippets AI failed:', error)
      return this.getSnippetsFallback(input, languageCode)
    }
  }

  /**
   * 🤖 CHAMAR AI (CLAUDE/GEMINI)
   */
  private async callAI(prompt: string): Promise<string> {
    // Simular chamada para Claude/Gemini
    // Em produção, usar API real
    const response = await fetch('/api/v1/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
      throw new Error(`AI API failed: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  }

  /**
   * 🚨 FALLBACKS INTELIGENTES (POR IDIOMA)
   */
  private getHeadlinesFallback(input: CampaignInput, languageCode: string): string[] {
    const product = input.productName

    // Fallback específico para húngaro
    if (languageCode === 'hu-HU') {
      return [
        `${product} Eredeti`,
        `Vásároljon ${product}`,
        `${product} Legjobb Ár`,
        `Hivatalos ${product}`,
        `${product} Garancia`,
        `Rendelje ${product} Ma`,
        `${product} Ingyenes Szállítás`,
        `Szerezze ${product} Most`,
        `${product} Kedvezmény`,
        `${product} Különleges Ajánlat`,
        `${product} Pénz Megtakarítás`,
        `${product} Gyors Szállítás`,
        `${product} Megbízható Bolt`,
        `${product} Korlátozott Idő`,
        `${product} Prémium Minőség`
      ]
    }

    // Fallback específico para alemão
    if (languageCode === 'de-DE') {
      return [
        `${product} Original`,
        `${product} Jetzt Kaufen`,
        `${product} Bester Preis`,
        `Offizieller ${product}`,
        `${product} Garantie`,
        `${product} Heute Bestellen`,
        `${product} Kostenloser Versand`,
        `${product} Jetzt Holen`,
        `${product} Rabatt`,
        `${product} Sonderangebot`,
        `${product} Geld Sparen`,
        `${product} Schnelle Lieferung`,
        `${product} Vertrauenswürdig`,
        `${product} Begrenzte Zeit`,
        `${product} Premium Qualität`
      ]
    }

    // Fallback específico para espanhol
    if (languageCode === 'es-ES') {
      return [
        `${product} Original`,
        `Comprar ${product} Ahora`,
        `${product} Mejor Precio`,
        `${product} Oficial`,
        `${product} Garantía`,
        `Pedir ${product} Hoy`,
        `${product} Envío Gratis`,
        `Conseguir ${product} Ahora`,
        `${product} Descuento`,
        `${product} Oferta Especial`,
        `${product} Ahorrar Dinero`,
        `${product} Entrega Rápida`,
        `${product} Tienda Confiable`,
        `${product} Tiempo Limitado`,
        `${product} Calidad Premium`
      ]
    }

    // Fallback padrão em inglês para outros idiomas
    return [
      `${product} Original`,
      `Buy ${product} Now`,
      `${product} Best Price`,
      `Official ${product}`,
      `${product} Guarantee`,
      `Order ${product} Today`,
      `${product} Free Shipping`,
      `Get ${product} Now`,
      `${product} Discount`,
      `${product} Special Offer`,
      `${product} Save Money`,
      `${product} Fast Delivery`,
      `${product} Trusted Store`,
      `${product} Limited Time`,
      `${product} Premium Quality`
    ]
  }

  private getDescriptionsFallback(input: CampaignInput, languageCode: string): string[] {
    const product = input.productName

    // Fallback húngaro
    if (languageCode === 'hu-HU') {
      return [
        `${product} eredeti garanciával. Rendelj most ingyenes szállítással!`,
        `Szerezd meg ${product} legjobb áron. Gyors szállítás és pénzvisszafizetés.`,
        `Hivatalos ${product} bolt. Prémium minőség és 24/7 támogatás.`,
        `${product} különleges ajánlat. Korlátozott idejű kedvezmény!`
      ]
    }

    // Fallback alemão
    if (languageCode === 'de-DE') {
      return [
        `${product} original mit Garantie. Jetzt mit kostenlosem Versand bestellen!`,
        `${product} zum besten Preis. Schnelle Lieferung und Geld-zurück-Garantie.`,
        `Offizieller ${product} Shop. Premium-Qualität und 24/7 Support.`,
        `${product} Sonderangebot. Zeitlich begrenzter Rabatt, heute bestellen!`
      ]
    }

    // Fallback espanhol
    if (languageCode === 'es-ES') {
      return [
        `${product} original con garantía. ¡Pide ahora con envío gratuito!`,
        `Consigue ${product} al mejor precio. Entrega rápida y garantía de devolución.`,
        `Tienda oficial ${product}. Calidad premium y soporte 24/7.`,
        `Oferta especial ${product}. Descuento por tiempo limitado, ¡pide hoy!`
      ]
    }

    // Fallback inglês padrão
    return [
      `${product} original with guarantee. Order now with free shipping!`,
      `Get ${product} at best price. Fast delivery and money back guarantee.`,
      `Official ${product} store. Premium quality and 24/7 support.`,
      `${product} special offer. Limited time discount, order today!`
    ]
  }

  private getSitelinksFallback(input: CampaignInput, languageCode: string): { title: string; description: string }[] {
    // Fallback húngaro
    if (languageCode === 'hu-HU') {
      return [
        { title: 'Rólunk', description: 'Hivatalos bolt információk' },
        { title: 'Hogyan Működik', description: 'Termék használati útmutató' },
        { title: 'Vásárlás Most', description: 'Rendelés legjobb áron' },
        { title: 'Garancia', description: 'Pénzvisszafizetési garancia' },
        { title: 'Támogatás', description: '24/7 ügyfélszolgálat' },
        { title: 'Előnyök', description: 'Termék fő előnyei' }
      ]
    }

    // Fallback alemão
    if (languageCode === 'de-DE') {
      return [
        { title: 'Über Uns', description: 'Offizieller Shop Informationen' },
        { title: 'Wie Es Funktioniert', description: 'Produkt Anwendungsanleitung' },
        { title: 'Jetzt Kaufen', description: 'Bestellen zum besten Preis' },
        { title: 'Garantie', description: 'Geld-zurück-Garantie' },
        { title: 'Support', description: '24/7 Kundensupport' },
        { title: 'Vorteile', description: 'Produkt Hauptvorteile' }
      ]
    }

    // Fallback espanhol
    if (languageCode === 'es-ES') {
      return [
        { title: 'Sobre Nosotros', description: 'Información tienda oficial' },
        { title: 'Cómo Funciona', description: 'Guía uso del producto' },
        { title: 'Comprar Ahora', description: 'Pedir al mejor precio' },
        { title: 'Garantía', description: 'Garantía devolución dinero' },
        { title: 'Soporte', description: 'Atención cliente 24/7' },
        { title: 'Beneficios', description: 'Beneficios principales' }
      ]
    }

    // Fallback inglês padrão
    return [
      { title: 'About Us', description: 'Official store information' },
      { title: 'How It Works', description: 'Product usage guide' },
      { title: 'Buy Now', description: 'Order with best price' },
      { title: 'Guarantee', description: 'Money back guarantee' },
      { title: 'Support', description: '24/7 customer support' },
      { title: 'Benefits', description: 'Product main benefits' }
    ]
  }

  private getSnippetsFallback(input: CampaignInput, languageCode: string): string[] {
    // Fallback húngaro
    if (languageCode === 'hu-HU') {
      return [
        'Ingyenes Szállítás',
        'Hivatalos Bolt'
      ]
    }

    // Fallback alemão
    if (languageCode === 'de-DE') {
      return [
        'Kostenloser Versand',
        'Offizieller Shop'
      ]
    }

    // Fallback espanhol
    if (languageCode === 'es-ES') {
      return [
        'Envío Gratis',
        'Tienda Oficial'
      ]
    }

    // Fallback inglês padrão
    return [
      'Free Shipping',
      'Official Store'
    ]
  }
}