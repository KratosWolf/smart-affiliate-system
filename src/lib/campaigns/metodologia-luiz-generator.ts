/**
 * Metodologia Luiz - Campaign Generator
 * Baseado nas planilhas visuais fornecidas pelo usuário
 * 
 * CATEGORIAS DE HEADLINES:
 * - PRODUCT: Foco no nome do produto
 * - CTA: Call-to-actions diretos
 * - SAVINGS: Desconto e economia
 * - DELIVERY: Informações de entrega
 * - GUARANTEE: Período de garantia
 * - SCARCITY: Urgência e escassez
 * 
 * PLACEHOLDERS IDENTIFICADOS:
 * - [PDTO]: Nome do produto
 * - [VALUE DISCOUNT]: Valor do desconto
 * - [UNIT PRICE]: Preço unitário
 * - [GUARANTEE]: Período de garantia
 * - [Delivery]: Tipo de entrega
 * - [LOCATION(City)]: Cidade alvo
 */

export interface MetodologiaLuizData {
  productName: string
  productPrice: number
  pack3Price?: number
  pack5Price?: number
  currency: string
  guaranteePeriod?: string
  deliveryType?: string
  targetCity?: string
  bonuses?: string
  scarcityType?: string
  returnPolicy?: string
  targetCountry: string
}

export interface HeadlinesByCategory {
  PRODUCT: string[]
  CTA: string[]
  SAVINGS: string[]
  DELIVERY: string[]
  GUARANTEE: string[]
  SCARCITY: string[]
}

export interface CalloutsByCategory {
  PROMO: string[]
  DELIVERY: string[]
  GUARANTEE: string[]
  BONUS: string[]
  GENERAL: string[]
}

export interface DescriptionsByCategory {
  PRODUCT: string[]
  BENEFITS: string[]
  OFFER: string[]
  GUARANTEE: string[]
}

export interface SiteLink {
  text: string
  description?: string
  category: 'PRODUCT' | 'REVIEWS' | 'SUPPORT' | 'INFO'
}

export interface StructuredSnippet {
  header: 'Benefits' | 'Features' | 'Types' | 'Brands' | 'Services'
  values: string[]
}

export class MetodologiaLuizGenerator {
  
  /**
   * Gera 15 headlines seguindo METODOLOGIA LUIZ EXATA
   * 7 FIXAS (com nome produto) + 8 FLEXÍVEIS (AI decide)
   */
  generateHeadlines(data: MetodologiaLuizData, competitorInsights?: any): HeadlinesByCategory {
    // HEADLINES 1-7: FIXAS conforme Excel
    const fixedHeadlines = this.generateFixedProductHeadlines(data)
    
    // HEADLINES 8-15: FLEXÍVEIS baseadas em AI/Competitive Intelligence  
    const flexibleHeadlines = this.generateFlexibleHeadlines(data, competitorInsights)
    
    // Distribuir em categorias para compatibilidade
    const headlines: HeadlinesByCategory = {
      PRODUCT: fixedHeadlines, // Headlines 1-7 (fixas)
      CTA: flexibleHeadlines.slice(0, 2), // Headlines 8-9 
      SAVINGS: flexibleHeadlines.slice(2, 4), // Headlines 10-11
      DELIVERY: flexibleHeadlines.slice(4, 5), // Headline 12
      GUARANTEE: flexibleHeadlines.slice(5, 6), // Headline 13
      SCARCITY: flexibleHeadlines.slice(6, 8) // Headlines 14-15
    }

    return headlines
  }

  /**
   * Gera descriptions de 90 caracteres máximo por categoria
   */
  generateDescriptions(data: MetodologiaLuizData): DescriptionsByCategory {
    const descriptions: DescriptionsByCategory = {
      PRODUCT: this.generateProductDescriptions(data),
      BENEFITS: this.generateBenefitDescriptions(data),
      OFFER: this.generateOfferDescriptions(data),
      GUARANTEE: this.generateGuaranteeDescriptions(data)
    }

    // Garantir limite de 90 caracteres
    Object.keys(descriptions).forEach(category => {
      descriptions[category as keyof DescriptionsByCategory] = descriptions[category as keyof DescriptionsByCategory]
        .map(desc => desc.substring(0, 90))
        .filter(desc => desc.length > 0)
    })

    return descriptions
  }

  /**
   * Gera sitelinks com descriptions opcionais
   */
  generateSitelinks(data: MetodologiaLuizData): SiteLink[] {
    const sitelinks: SiteLink[] = []
    
    // Product sitelinks
    sitelinks.push(
      { text: 'Reviews', description: 'Customer testimonials', category: 'REVIEWS' },
      { text: 'Ingredients', description: 'Full ingredient list', category: 'PRODUCT' },
      { text: 'How it Works', description: 'Learn the science', category: 'INFO' }
    )

    // Guarantee sitelink
    if (data.guaranteePeriod) {
      sitelinks.push({
        text: 'Guarantee',
        description: `${data.guaranteePeriod} money back`,
        category: 'SUPPORT'
      })
    }

    // Delivery sitelink
    if (data.deliveryType) {
      sitelinks.push({
        text: 'Shipping',
        description: data.deliveryType.substring(0, 35),
        category: 'SUPPORT'
      })
    }

    // Support sitelink
    sitelinks.push({
      text: 'Contact',
      description: '24/7 customer support',
      category: 'SUPPORT'
    })

    // Garantir limites: texto 25 chars, description 35 chars
    return sitelinks
      .map(link => ({
        ...link,
        text: link.text.substring(0, 25),
        description: link.description?.substring(0, 35)
      }))
      .slice(0, 6) // máximo 6 sitelinks
  }

  /**
   * Gera structured snippets por categoria
   */
  generateStructuredSnippets(data: MetodologiaLuizData): StructuredSnippet[] {
    const snippets: StructuredSnippet[] = []

    // Benefits snippet
    const benefits = this.extractBenefits(data)
    if (benefits.length > 0) {
      snippets.push({
        header: 'Benefits',
        values: benefits.slice(0, 10) // máximo 10 valores
      })
    }

    // Features snippet
    const features = this.extractFeatures(data)
    if (features.length > 0) {
      snippets.push({
        header: 'Features',
        values: features.slice(0, 10)
      })
    }

    // Types snippet (baseado nos packs)
    if (data.pack3Price || data.pack5Price) {
      const types = []
      if (data.productPrice) types.push('Single Bottle')
      if (data.pack3Price) types.push('3-Pack Bundle')
      if (data.pack5Price) types.push('5-Pack Bundle')
      
      snippets.push({
        header: 'Types',
        values: types
      })
    }

    // Garantir limite de 25 caracteres por valor
    return snippets.map(snippet => ({
      ...snippet,
      values: snippet.values
        .map(value => value.substring(0, 25))
        .filter(value => value.length > 0)
    }))
  }

  /**
   * Gera callouts de 25 caracteres máximo por categoria
   */
  generateCallouts(data: MetodologiaLuizData): CalloutsByCategory {
    const callouts: CalloutsByCategory = {
      PROMO: this.generatePromoCallouts(data),
      DELIVERY: this.generateDeliveryCallouts(data),
      GUARANTEE: this.generateGuaranteeCallouts(data),
      BONUS: this.generateBonusCallouts(data),
      GENERAL: this.generateGeneralCallouts(data)
    }

    // Garantir limite de 25 caracteres
    Object.keys(callouts).forEach(category => {
      callouts[category as keyof CalloutsByCategory] = callouts[category as keyof CalloutsByCategory]
        .map(callout => callout.substring(0, 25))
        .filter(callout => callout.length > 0)
    })

    return callouts
  }

  /**
   * Calcula desconto percentual baseado nos preços
   */
  calculateDiscount(data: MetodologiaLuizData): { 
    pack3Discount: number, 
    pack5Discount: number,
    maxDiscount: number 
  } {
    const { productPrice, pack3Price, pack5Price } = data
    
    let pack3Discount = 0
    let pack5Discount = 0
    
    if (pack3Price && productPrice) {
      pack3Discount = Math.round(((productPrice * 3 - pack3Price) / (productPrice * 3)) * 100)
    }
    
    if (pack5Price && productPrice) {
      pack5Discount = Math.round(((productPrice * 5 - pack5Price) / (productPrice * 5)) * 100)
    }
    
    const maxDiscount = Math.max(pack3Discount, pack5Discount)
    
    return { pack3Discount, pack5Discount, maxDiscount }
  }

  /**
   * METODOLOGIA LUIZ - Headlines 1-7 (FIXOS com nome do produto)
   * Baseado exatamente na planilha Excel fornecida
   */
  private generateFixedProductHeadlines(data: MetodologiaLuizData): string[] {
    const { productName, guaranteePeriod, deliveryType } = data
    const discounts = this.calculateDiscount(data)
    
    const fixedHeadlines = []
    
    // #1 - SEMPRE: {KeyWord:[PRODUTO] Online Store} (Google Ads Dynamic)
    fixedHeadlines.push(`{KeyWord:${productName} Online Store}`)
    
    // #2 - SEMPRE: [PRODUTO] Reviews & Results  
    fixedHeadlines.push(`${productName} Reviews & Results`)
    
    // #3 - SEMPRE: Buy [PRODUTO] Online
    fixedHeadlines.push(`Buy ${productName} Online`)
    
    // #4 - SE TEM DESCONTO: [PRODUTO] - [X]% Off
    if (discounts.maxDiscount > 0) {
      fixedHeadlines.push(`${productName} - ${discounts.maxDiscount}% Off`)
    } else {
      fixedHeadlines.push(`${productName} - Best Price`)
    }
    
    // #5 - SE TEM GARANTIA: [PRODUTO] [GARANTIA] Guarantee
    if (guaranteePeriod) {
      fixedHeadlines.push(`${productName} ${guaranteePeriod} Guarantee`)
    } else {
      fixedHeadlines.push(`${productName} - Money Back`)
    }
    
    // #6 - SE TEM DELIVERY: [PRODUTO] [DELIVERY]
    if (deliveryType) {
      const shortDelivery = deliveryType.substring(0, 30 - productName.length - 3) // Garantir 30 chars
      fixedHeadlines.push(`${productName} ${shortDelivery}`)
    } else {
      fixedHeadlines.push(`${productName} Fast Shipping`)
    }
    
    // #7 - SEMPRE: Get [PRODUTO] Now
    fixedHeadlines.push(`Get ${productName} Now`)
    
    return fixedHeadlines
  }

  /**
   * Headlines 8-15 FLEXÍVEIS (AI/Competitive Intelligence decide)
   */
  private generateFlexibleHeadlines(data: MetodologiaLuizData, competitorInsights?: any): string[] {
    const { productName, targetCity, scarcityType } = data
    
    const flexibleHeadlines = []
    
    // Usar insights da competitive intelligence se disponível
    if (competitorInsights?.topPerformers) {
      // Adaptar top performers mantendo o nome do produto
      competitorInsights.topPerformers.slice(0, 4).forEach((competitor: any) => {
        const adaptedHeadline = competitor.headline.replace(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/, productName)
        flexibleHeadlines.push(adaptedHeadline)
      })
    }
    
    // Adicionar headlines contextuais
    if (targetCity) {
      flexibleHeadlines.push(`${productName} in ${targetCity}`)
    }
    
    if (scarcityType) {
      flexibleHeadlines.push(`${scarcityType}: ${productName}`)
    }
    
    // Preencher até 8 headlines flexíveis (total 15 = 7 fixas + 8 flexíveis)
    const defaultFlexible = [
      `Order ${productName} Today`,
      `${productName} Available Now`,
      `Try ${productName} Risk-Free`,
      `${productName} - Limited Time`,
      `${productName} Special Offer`,
      `${productName} - Act Now`,
      `${productName} - Top Rated`,
      `${productName} - Trusted Brand`
    ]
    
    // Adicionar defaults se precisar completar
    while (flexibleHeadlines.length < 8) {
      const nextDefault: string | undefined = defaultFlexible[flexibleHeadlines.length]
      if (nextDefault) flexibleHeadlines.push(nextDefault)
      else break
    }
    
    return flexibleHeadlines.slice(0, 8) // Máximo 8 flexíveis
  }

  /**
   * Headlines categoria PRODUCT (mantido para compatibilidade)
   */
  private generateProductHeadlines(data: MetodologiaLuizData): string[] {
    // Combinar fixos + flexíveis
    const fixedHeadlines = this.generateFixedProductHeadlines(data)
    const flexibleHeadlines = this.generateFlexibleHeadlines(data)
    
    return [...fixedHeadlines, ...flexibleHeadlines].slice(0, 15) // Total máximo 15
  }

  /**
   * Headlines categoria CTA
   */
  private generateCTAHeadlines(data: MetodologiaLuizData): string[] {
    const { productName } = data
    
    return [
      `Order ${productName} Today`,
      `Get ${productName} Now`,
      `Buy ${productName} Online`,
      `Try ${productName} Risk-Free`
    ]
  }

  /**
   * Headlines categoria SAVINGS
   */
  private generateSavingsHeadlines(data: MetodologiaLuizData): string[] {
    const { productName, currency, productPrice, pack5Price } = data
    const discounts = this.calculateDiscount(data)
    
    const headlines = []
    
    if (discounts.maxDiscount > 0) {
      headlines.push(`${productName} - ${discounts.maxDiscount}% Off`)
      headlines.push(`Save ${discounts.maxDiscount}% on ${productName}`)
    }
    
    if (productPrice) {
      headlines.push(`${productName} For Only ${currency}${productPrice}`)
    }
    
    if (pack5Price && discounts.pack5Discount > 0) {
      const savings = (productPrice * 5) - pack5Price
      headlines.push(`Save ${currency}${savings.toFixed(0)} on ${productName}`)
    }
    
    return headlines
  }

  /**
   * Headlines categoria DELIVERY
   */
  private generateDeliveryHeadlines(data: MetodologiaLuizData): string[] {
    const { productName, deliveryType } = data
    
    const headlines = []
    
    if (deliveryType) {
      headlines.push(`${productName} - ${deliveryType}`)
      
      if (deliveryType.toLowerCase().includes('free') || deliveryType.toLowerCase().includes('grátis')) {
        headlines.push(`${productName} + Free Delivery`)
      }
      
      if (deliveryType.toLowerCase().includes('express') || deliveryType.toLowerCase().includes('rápid')) {
        headlines.push(`${productName} Express Delivery`)
      }
    }
    
    return headlines
  }

  /**
   * Headlines categoria GUARANTEE
   */
  private generateGuaranteeHeadlines(data: MetodologiaLuizData): string[] {
    const { productName, guaranteePeriod, returnPolicy } = data
    
    const headlines = []
    
    if (guaranteePeriod) {
      headlines.push(`${productName} - ${guaranteePeriod} Guarantee`)
      headlines.push(`${guaranteePeriod} Money-Back ${productName}`)
    }
    
    if (returnPolicy) {
      headlines.push(`${productName} - ${returnPolicy}`)
    }
    
    return headlines
  }

  /**
   * Headlines categoria SCARCITY
   */
  private generateScarcityHeadlines(data: MetodologiaLuizData): string[] {
    const { productName, scarcityType } = data
    
    const headlines = []
    
    if (scarcityType) {
      headlines.push(`${productName} - ${scarcityType}`)
      
      switch (scarcityType) {
        case 'Limited Time':
          headlines.push(`Limited Time: ${productName}`)
          break
        case 'Stock Limited':
          headlines.push(`${productName} - Low Stock`)
          break
        case 'Today Only':
          headlines.push(`Today Only: ${productName} Deal`)
          break
        case 'While Supplies Last':
          headlines.push(`${productName} While Supplies Last`)
          break
      }
    }
    
    return headlines
  }

  /**
   * Callouts categoria PROMO (máximo 25 chars)
   */
  private generatePromoCallouts(data: MetodologiaLuizData): string[] {
    const discounts = this.calculateDiscount(data)
    const callouts = []
    
    if (discounts.maxDiscount > 0) {
      callouts.push(`${discounts.maxDiscount}% Off Today`)
      callouts.push(`Save ${discounts.maxDiscount}%`)
    }
    
    callouts.push('Special Offer')
    callouts.push('Limited Time Deal')
    
    return callouts
  }

  /**
   * Callouts categoria DELIVERY (máximo 25 chars)
   */
  private generateDeliveryCallouts(data: MetodologiaLuizData): string[] {
    const { deliveryType } = data
    const callouts = []
    
    if (deliveryType) {
      // Truncar para 25 chars se necessário
      callouts.push(deliveryType.substring(0, 25))
      
      if (deliveryType.toLowerCase().includes('free') || deliveryType.toLowerCase().includes('grátis')) {
        callouts.push('Free Delivery')
      }
      
      if (deliveryType.toLowerCase().includes('express')) {
        callouts.push('Express Delivery')
      }
    }
    
    callouts.push('Fast Shipping')
    callouts.push('Worldwide Delivery')
    
    return callouts
  }

  /**
   * Callouts categoria GUARANTEE (máximo 25 chars)
   */
  private generateGuaranteeCallouts(data: MetodologiaLuizData): string[] {
    const { guaranteePeriod, returnPolicy } = data
    const callouts = []
    
    if (guaranteePeriod) {
      callouts.push(`${guaranteePeriod} Guarantee`)
    }
    
    if (returnPolicy) {
      callouts.push(returnPolicy.substring(0, 25))
    }
    
    callouts.push('Money Back Guarantee')
    callouts.push('Risk Free Trial')
    
    return callouts
  }

  /**
   * Callouts categoria BONUS (máximo 25 chars)
   */
  private generateBonusCallouts(data: MetodologiaLuizData): string[] {
    const { bonuses } = data
    const callouts = []
    
    if (bonuses) {
      const bonusList = bonuses.split(',').map(b => b.trim())
      bonusList.forEach(bonus => {
        if (bonus.length <= 25) {
          callouts.push(bonus)
        }
      })
    }
    
    callouts.push('Free Bonus Inside')
    callouts.push('Extra Benefits')
    
    return callouts
  }

  /**
   * Callouts categoria GENERAL (máximo 25 chars)
   */
  private generateGeneralCallouts(data: MetodologiaLuizData): string[] {
    return [
      'Official Website',
      'Trusted Brand',
      '100% Natural',
      'Clinically Proven',
      'Doctor Recommended',
      '24/7 Support',
      'Secure Checkout'
    ]
  }

  /**
   * Descriptions categoria PRODUCT
   */
  private generateProductDescriptions(data: MetodologiaLuizData): string[] {
    const { productName, guaranteePeriod } = data
    
    const descriptions = [
      `${productName} - Natural formula for optimal health support`,
      `Advanced ${productName} with premium ingredients for best results`
    ]

    if (guaranteePeriod) {
      descriptions.push(`${productName} with ${guaranteePeriod} satisfaction guarantee`)
    }

    return descriptions
  }

  /**
   * Descriptions categoria BENEFITS
   */
  private generateBenefitDescriptions(data: MetodologiaLuizData): string[] {
    return [
      'Support your wellness goals with clinically studied ingredients',
      'Natural formula designed for optimal daily health support',
      'Premium quality ingredients for maximum effectiveness'
    ]
  }

  /**
   * Descriptions categoria OFFER
   */
  private generateOfferDescriptions(data: MetodologiaLuizData): string[] {
    const { currency, productPrice, deliveryType } = data
    const discounts = this.calculateDiscount(data)
    
    const descriptions = []
    
    if (discounts.maxDiscount > 0) {
      descriptions.push(`Save ${discounts.maxDiscount}% on bulk orders - Limited time special offer`)
    }
    
    if (productPrice) {
      descriptions.push(`Starting from ${currency}${productPrice} with fast worldwide delivery`)
    }
    
    if (deliveryType?.toLowerCase().includes('free') || deliveryType?.toLowerCase().includes('grátis')) {
      descriptions.push('Free shipping on all orders plus exclusive bonuses included')
    }

    return descriptions
  }

  /**
   * Descriptions categoria GUARANTEE
   */
  private generateGuaranteeDescriptions(data: MetodologiaLuizData): string[] {
    const { guaranteePeriod, returnPolicy } = data
    
    const descriptions = []
    
    if (guaranteePeriod && returnPolicy) {
      descriptions.push(`${guaranteePeriod} ${returnPolicy} - Risk-free trial available`)
    } else if (guaranteePeriod) {
      descriptions.push(`${guaranteePeriod} money-back guarantee for your peace of mind`)
    }
    
    descriptions.push('Try risk-free with our satisfaction guarantee policy')
    
    return descriptions
  }

  /**
   * Extrai benefícios do produto
   */
  private extractBenefits(data: MetodologiaLuizData): string[] {
    const benefits = ['Natural Formula', 'Quality Tested']
    
    if (data.guaranteePeriod) {
      benefits.push('Money Back Guarantee')
    }
    
    if (data.deliveryType?.toLowerCase().includes('free')) {
      benefits.push('Free Shipping')
    }
    
    if (data.bonuses) {
      const bonusList = data.bonuses.split(',').map(b => b.trim().substring(0, 25))
      benefits.push(...bonusList.slice(0, 3))
    }
    
    return benefits
  }

  /**
   * Extrai características do produto
   */
  private extractFeatures(data: MetodologiaLuizData): string[] {
    const features = ['Premium Quality', 'Third Party Tested']
    
    if (data.pack3Price) {
      features.push('Bundle Discounts')
    }
    
    if (data.targetCity) {
      features.push('Local Support')
    }
    
    return features
  }

  /**
   * Gera a campanha completa para Google Ads Editor
   * Integra competitive intelligence se disponível
   */
  generateCampaignData(data: MetodologiaLuizData, competitorInsights?: any) {
    const headlines = this.generateHeadlines(data, competitorInsights)
    const descriptions = this.generateDescriptions(data)
    const callouts = this.generateCallouts(data)
    const sitelinks = this.generateSitelinks(data)
    const structuredSnippets = this.generateStructuredSnippets(data)
    const discounts = this.calculateDiscount(data)
    
    // Combinar todas as headlines em um array plano (máximo 15)
    const allHeadlines = [
      ...headlines.PRODUCT,
      ...headlines.CTA,
      ...headlines.SAVINGS,
      ...headlines.DELIVERY,
      ...headlines.GUARANTEE,
      ...headlines.SCARCITY
    ].slice(0, 15)
    
    // Combinar todas as descriptions (máximo 4)
    const allDescriptions = [
      ...descriptions.PRODUCT,
      ...descriptions.BENEFITS,
      ...descriptions.OFFER,
      ...descriptions.GUARANTEE
    ].slice(0, 4)
    
    // Combinar todos os callouts (máximo 10)
    const allCallouts = [
      ...callouts.PROMO,
      ...callouts.DELIVERY,
      ...callouts.GUARANTEE,
      ...callouts.BONUS,
      ...callouts.GENERAL
    ].slice(0, 10)

    return {
      headlines: allHeadlines,
      descriptions: allDescriptions,
      callouts: allCallouts,
      sitelinks,
      structuredSnippets,
      discounts,
      metadata: {
        categorizedHeadlines: headlines,
        categorizedDescriptions: descriptions,
        categorizedCallouts: callouts,
        productData: data
      }
    }
  }
}