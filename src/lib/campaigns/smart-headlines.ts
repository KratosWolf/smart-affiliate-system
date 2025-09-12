/**
 * FASE 1: SMART FIXED HEADLINES
 * Gera headlines inteligentes sem APIs externas + validação rigorosa
 */

import { characterValidator, ValidationResult } from './character-validator';

export interface SmartHeadlineConfig {
  productName: string
  country: string
  currency: 'BRL' | 'USD'
  // Dados opcionais do produto
  discountPercentage?: number
  discountAmount?: number
  productPrice?: number
  guaranteePeriod?: string
  deliveryType?: string
  platform?: string
  commissionValue?: number
}

export interface SmartHeadlineOutput {
  keywords: Array<{ keyword: string; matchType: string }>
  headlines: string[]
  descriptions: string[]
  sitelinks: Array<{ text: string; description1: string; description2: string }>
  callouts: string[]
  snippets: Array<{ header: string; values: string[] }>
  metadata: {
    language: string
    totalHeadlines: number
    contextualElements: string[]
    validation: ValidationResult
    validationReport?: string
  }
}

export class SmartFixedHeadlines {
  
  /**
   * GERA HEADLINES FIXAS INTELIGENTES (FASE 1)
   */
  generateSmartHeadlines(config: SmartHeadlineConfig): SmartHeadlineOutput {
    const language = this.detectLanguage(config.country)
    const contextualElements: string[] = []
    
    // 1. Keywords - sempre minúscula + MAIÚSCULA
    const keywords = this.generateKeywords(config.productName)
    
    // 2. Headlines fixas inteligentes (7 fixas + 8 variáveis)
    const headlines = this.generateContextualHeadlines(config, contextualElements, language)
    
    // 3. Descriptions inteligentes
    const descriptions = this.generateContextualDescriptions(config, language)
    
    // 4. Extensions inteligentes
    const extensions = this.generateContextualExtensions(config, language)
    
    // 5. VALIDAÇÃO RIGOROSA DE CARACTERES
    const sitelinkTexts = extensions.sitelinks.map(s => s.text)
    const validation = characterValidator.validateAndCorrect({
      headlines,
      descriptions,
      sitelinks: sitelinkTexts,
      callouts: extensions.callouts,
      paths: [config.productName.substring(0, 15), 'Oficial']
    })
    
    // Usa conteúdo corrigido se necessário
    const finalContent = validation.correctedContent || {
      headlines,
      descriptions,
      sitelinks: sitelinkTexts,
      callouts: extensions.callouts,
      paths: [config.productName.substring(0, 15), 'Oficial']
    }
    
    return {
      keywords,
      headlines: finalContent.headlines,
      descriptions: finalContent.descriptions,
      sitelinks: extensions.sitelinks.map((s, i) => ({
        ...s,
        text: finalContent.sitelinks[i] || s.text
      })),
      callouts: finalContent.callouts,
      snippets: extensions.snippets,
      metadata: {
        language,
        totalHeadlines: finalContent.headlines.length,
        contextualElements,
        validation,
        validationReport: characterValidator.generateValidationReport(validation)
      }
    }
  }
  
  /**
   * Gera keywords: minúscula + MAIÚSCULA
   */
  private generateKeywords(productName: string): Array<{ keyword: string; matchType: string }> {
    return [
      { keyword: productName.toLowerCase(), matchType: 'BROAD' },
      { keyword: productName.toUpperCase(), matchType: 'BROAD' }
    ]
  }
  
  /**
   * Gera headlines contextuais baseadas nos dados disponíveis
   */
  private generateContextualHeadlines(
    config: SmartHeadlineConfig, 
    contextualElements: string[], 
    language: string
  ): string[] {
    const { productName } = config
    const translations = this.getTranslations(language)
    
    // PRIMEIRA HEADLINE OBRIGATÓRIA (formato exato)
    const headlines = [
      `{KeyWord:${productName}} ${translations.onlineStore}`
    ]
    
    // 6 HEADLINES FIXAS BÁSICAS
    headlines.push(
      `${productName} ${translations.officialSite}`,
      `${productName} ${translations.buyNow}`,
      `${productName} ${translations.specialOffer}`,
      `${productName} ${translations.bestPrice}`,
      `${productName} ${translations.original}`
    )
    
    // 8 HEADLINES VARIÁVEIS CONTEXTUAIS
    // Só adiciona se tiver dados específicos
    
    // Preço do produto - "For Only $X" ou equivalente local
    if (config.productPrice && config.productPrice > 0) {
      const currency = this.getCurrencyForCountry(config.country, config.currency)
      headlines.push(`${translations.forOnly} ${currency}${config.productPrice}`)
      headlines.push(`${productName} ${translations.starting} ${currency}${config.productPrice}`)
      contextualElements.push('product_price')
    }
    
    // Desconto - só se fornecido
    if (config.discountPercentage && config.discountPercentage > 0) {
      headlines.push(`${productName} ${translations.discount} ${config.discountPercentage}%`)
      headlines.push(`${translations.save} ${config.discountPercentage}% ${translations.today}`)
      contextualElements.push('discount_percentage')
    } else if (config.discountAmount && config.discountAmount > 0) {
      const currency = config.currency === 'BRL' ? 'R$' : '$'
      headlines.push(`${translations.save} ${currency}${config.discountAmount}`)
      contextualElements.push('discount_amount')
    }
    
    // Se não tiver preço nem desconto, usa headlines genéricas
    if (!config.productPrice && !config.discountPercentage && !config.discountAmount) {
      headlines.push(`${productName} ${translations.limitedOffer}`)
      headlines.push(`${translations.lastUnits}`)
    }
    
    // Garantia - só se fornecida
    if (config.guaranteePeriod) {
      headlines.push(`${translations.guarantee} ${config.guaranteePeriod}`)
      contextualElements.push('guarantee_period')
    } else {
      headlines.push(`${translations.satisfactionGuaranteed}`)
    }
    
    // Entrega - só se específica
    if (config.deliveryType) {
      if (config.deliveryType.toLowerCase().includes('grátis') || config.deliveryType.toLowerCase().includes('free')) {
        headlines.push(`${translations.freeShipping}`)
        contextualElements.push('free_shipping')
      } else if (config.deliveryType.toLowerCase().includes('express') || config.deliveryType.toLowerCase().includes('rápid')) {
        headlines.push(`${translations.expressDelivery}`)
        contextualElements.push('express_delivery')
      } else {
        headlines.push(`${translations.secureDelivery}`)
        contextualElements.push('custom_delivery')
      }
    } else {
      // Padrão genérico
      headlines.push(`${translations.immediateDelivery}`)
    }
    
    // Headlines de credibilidade
    headlines.push(
      `${translations.securedPurchase}`,
      `${translations.approvedProduct}`
    )
    
    // Garante exatamente 15 headlines
    return headlines.slice(0, 15)
  }
  
  /**
   * Gera descriptions contextuais
   */
  private generateContextualDescriptions(config: SmartHeadlineConfig, language: string): string[] {
    const { productName, platform = 'Plataforma Oficial' } = config
    const translations = this.getTranslations(language)
    
    return [
      `${productName} ${translations.originalWithGuarantee}. ${translations.immediateDeliveryAfterApproval}. ${translations.authorizedOfficialSite}.`,
      `${translations.buySecurely} ${productName}. ${translations.protectedPayment} ${platform}. ${translations.satisfactionOrMoneyBack}.`,
      `${translations.specialOffer} ${productName} ${translations.limitedTime}. ${translations.freeShippingBrazil}. ${translations.buyNow}!`,
      `${productName} ${translations.provenResults}. ${translations.guaranteePeriod}. ${translations.takeAdvantageToday}.`
    ]
  }
  
  /**
   * Gera extensions contextuais
   */
  private generateContextualExtensions(config: SmartHeadlineConfig, language: string) {
    const translations = this.getTranslations(language)
    
    // Sitelinks contextuais
    const sitelinks = [
      {
        text: translations.specialOffer,
        description1: config.discountPercentage ? `${translations.discount} ${config.discountPercentage}%` : translations.bestPrice,
        description2: translations.limitedTime
      },
      {
        text: translations.totalGuarantee,
        description1: config.guaranteePeriod || translations.guaranteePeriod,
        description2: translations.satisfactionGuaranteed
      }
    ]
    
    // Adiciona frete grátis só se específico
    if (config.deliveryType?.toLowerCase().includes('grátis') || config.deliveryType?.toLowerCase().includes('free')) {
      sitelinks.push({
        text: translations.freeShipping,
        description1: translations.fastDelivery,
        description2: translations.entireBrazil
      })
    } else {
      sitelinks.push({
        text: translations.secureDelivery,
        description1: translations.fastDelivery,
        description2: translations.entireBrazil
      })
    }
    
    sitelinks.push({
      text: translations.buyNow,
      description1: translations.limitedStock,
      description2: translations.takeAdvantageToday
    })
    
    // Callouts contextuais
    const callouts = [
      translations.hundredPercentNatural,
      translations.approvedByAnvisa,
      translations.immediateDelivery,
      translations.securedPurchase,
      translations.satisfactionGuaranteed
    ]
    
    // Adiciona elementos específicos se disponíveis
    if (config.discountPercentage && config.discountPercentage > 0) {
      callouts.push(`${config.discountPercentage}% OFF`)
    }
    
    if (config.deliveryType?.toLowerCase().includes('grátis')) {
      callouts.push(translations.freeShipping)
    }
    
    // Snippets estruturados
    const snippets = [
      {
        header: translations.benefits,
        values: [
          translations.immediateDelivery,
          translations.hundredPercentNatural,
          translations.approvedByAnvisa
        ]
      },
      {
        header: translations.guarantees,
        values: [
          translations.moneyBack,
          translations.quality,
          translations.originality
        ]
      }
    ]
    
    return {
      sitelinks,
      callouts: callouts.slice(0, 6), // Max 6 callouts
      snippets
    }
  }
  
  /**
   * Determina a moeda local baseada no país
   */
  private getCurrencyForCountry(country: string, defaultCurrency: 'BRL' | 'USD'): string {
    const currencyMap: Record<string, string> = {
      'BR': 'R$',
      'PT': '€',
      'US': '$',
      'CA': 'CAD$',
      'UK': '£',
      'AU': 'AUD$',
      'ES': '€',
      'MX': 'MXN$',
      'AR': 'ARS$',
      'CO': 'COP$',
      'CL': 'CLP$',
      'PE': 'PEN$',
      'PL': 'zł',
      'FR': '€',
      'DE': '€',
      'AT': '€',
      'IT': '€',
      'SE': 'kr',
      'NO': 'kr',
      'DK': 'kr',
      'FI': '€',
      'RO': 'lei',
      'HU': 'Ft',
      'TR': '₺'
    }
    
    return currencyMap[country] || (defaultCurrency === 'BRL' ? 'R$' : '$')
  }

  /**
   * Detecta idioma baseado no país
   */
  private detectLanguage(country: string): string {
    const countryLanguageMap: Record<string, string> = {
      'BR': 'pt',
      'PT': 'pt',
      'US': 'en',
      'CA': 'en',
      'UK': 'en',
      'AU': 'en',
      'ES': 'es',
      'MX': 'es',
      'AR': 'es',
      'CO': 'es',
      'CL': 'es',
      'PE': 'es',
      'PL': 'pl',
      'FR': 'fr',
      'DE': 'de',
      'AT': 'de',
      'IT': 'it',
      'SE': 'sv',
      'NO': 'no',
      'DK': 'da',
      'FI': 'fi',
      'RO': 'ro',
      'HU': 'hu',
      'TR': 'tr'
    }
    
    return countryLanguageMap[country] || 'pt'
  }
  
  /**
   * Traduções por idioma
   */
  private getTranslations(language: string) {
    const translations = {
      pt: {
        onlineStore: 'Loja Online',
        officialSite: 'Site Oficial',
        buyNow: 'Comprar Agora',
        specialOffer: 'Oferta Especial',
        bestPrice: 'Melhor Preço',
        original: 'Original',
        discount: 'Desconto',
        save: 'Economize',
        today: 'Hoje',
        forOnly: 'Apenas por',
        starting: 'a partir de',
        limitedOffer: 'Oferta Limitada',
        lastUnits: 'Últimas Unidades',
        guarantee: 'Garantia de',
        satisfactionGuaranteed: 'Satisfação Garantida',
        freeShipping: 'Frete Grátis',
        expressDelivery: 'Entrega Express',
        secureDelivery: 'Entrega Segura',
        immediateDelivery: 'Entrega Imediata',
        securedPurchase: 'Compra Segura',
        approvedProduct: 'Produto Aprovado',
        originalWithGuarantee: 'original com garantia',
        immediateDeliveryAfterApproval: 'Entrega imediata após aprovação',
        authorizedOfficialSite: 'Site oficial autorizado',
        buySecurely: 'Compre com segurança',
        protectedPayment: 'Pagamento protegido',
        satisfactionOrMoneyBack: 'Satisfação garantida ou seu dinheiro de volta',
        limitedTime: 'por tempo limitado',
        freeShippingBrazil: 'Frete grátis para todo Brasil',
        provenResults: 'com resultado comprovado',
        guaranteePeriod: '30 dias de garantia',
        takeAdvantageToday: 'Aproveite hoje',
        totalGuarantee: 'Garantia Total',
        fastDelivery: 'Entrega rápida',
        entireBrazil: 'Todo o Brasil',
        limitedStock: 'Estoque limitado',
        hundredPercentNatural: '100% Natural',
        approvedByAnvisa: 'Aprovado ANVISA',
        benefits: 'Benefícios',
        guarantees: 'Garantias',
        moneyBack: 'Dinheiro de Volta',
        quality: 'Qualidade',
        originality: 'Originalidade'
      },
      en: {
        onlineStore: 'Online Store',
        officialSite: 'Official Site',
        buyNow: 'Buy Now',
        specialOffer: 'Special Offer',
        bestPrice: 'Best Price',
        original: 'Original',
        discount: 'Discount',
        save: 'Save',
        today: 'Today',
        forOnly: 'For Only',
        starting: 'Starting at',
        limitedOffer: 'Limited Offer',
        lastUnits: 'Last Units',
        guarantee: 'Guarantee',
        satisfactionGuaranteed: 'Satisfaction Guaranteed',
        freeShipping: 'Free Shipping',
        expressDelivery: 'Express Delivery',
        secureDelivery: 'Secure Delivery',
        immediateDelivery: 'Immediate Delivery',
        securedPurchase: 'Secure Purchase',
        approvedProduct: 'Approved Product',
        originalWithGuarantee: 'original with guarantee',
        immediateDeliveryAfterApproval: 'Immediate delivery after approval',
        authorizedOfficialSite: 'Authorized official site',
        buySecurely: 'Buy securely',
        protectedPayment: 'Protected payment',
        satisfactionOrMoneyBack: 'Satisfaction guaranteed or money back',
        limitedTime: 'for limited time',
        freeShippingBrazil: 'Free shipping worldwide',
        provenResults: 'with proven results',
        guaranteePeriod: '30 days guarantee',
        takeAdvantageToday: 'Take advantage today',
        totalGuarantee: 'Total Guarantee',
        fastDelivery: 'Fast delivery',
        entireBrazil: 'Worldwide',
        limitedStock: 'Limited stock',
        hundredPercentNatural: '100% Natural',
        approvedByAnvisa: 'FDA Approved',
        benefits: 'Benefits',
        guarantees: 'Guarantees',
        moneyBack: 'Money Back',
        quality: 'Quality',
        originality: 'Originality'
      },
      pl: {
        onlineStore: 'Sklep Online',
        officialSite: 'Oficjalna Strona',
        buyNow: 'Kup Teraz',
        specialOffer: 'Oferta Specjalna',
        bestPrice: 'Najlepsza Cena',
        original: 'Oryginał',
        discount: 'Zniżka',
        save: 'Oszczędź',
        today: 'Dziś',
        forOnly: 'Tylko za',
        starting: 'Od',
        limitedOffer: 'Oferta Limitowana',
        lastUnits: 'Ostatnie Sztuki',
        guarantee: 'Gwarancja',
        satisfactionGuaranteed: 'Gwarancja Satysfakcji',
        freeShipping: 'Darmowa Dostawa',
        expressDelivery: 'Dostawa Express',
        secureDelivery: 'Bezpieczna Dostawa',
        immediateDelivery: 'Natychmiastowa Dostawa',
        securedPurchase: 'Bezpieczny Zakup',
        approvedProduct: 'Zatwierdzony Produkt',
        originalWithGuarantee: 'oryginalny z gwarancją',
        immediateDeliveryAfterApproval: 'Natychmiastowa dostawa po zatwierdzeniu',
        authorizedOfficialSite: 'Autoryzowana oficjalna strona',
        buySecurely: 'Kup bezpiecznie',
        protectedPayment: 'Chroniona płatność',
        satisfactionOrMoneyBack: 'Gwarancja satysfakcji lub zwrot pieniędzy',
        limitedTime: 'przez ograniczony czas',
        freeShippingBrazil: 'Darmowa dostawa w Polsce',
        provenResults: 'z udowodnionymi wynikami',
        guaranteePeriod: '30 dni gwarancji',
        takeAdvantageToday: 'Skorzystaj dziś',
        totalGuarantee: 'Pełna Gwarancja',
        fastDelivery: 'Szybka dostawa',
        entireBrazil: 'Cała Polska',
        limitedStock: 'Ograniczony zapas',
        hundredPercentNatural: '100% Naturalne',
        approvedByAnvisa: 'Zatwierdzone',
        benefits: 'Korzyści',
        guarantees: 'Gwarancje',
        moneyBack: 'Zwrot Pieniędzy',
        quality: 'Jakość',
        originality: 'Oryginalność'
      }
    }
    
    return translations[language as keyof typeof translations] || translations.pt
  }
}

export const smartFixedHeadlines = new SmartFixedHeadlines()