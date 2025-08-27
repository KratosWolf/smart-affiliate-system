/**
 * GERADOR DE DOMÍNIOS PARA SCALING HORIZONTAL
 * 
 * Sistema para gerar múltiplas URLs/domínios para evitar competição interna
 * entre campanhas do Google Ads. Cada campanha usa uma URL única para
 * maximizar o reach e evitar leilões internos.
 * 
 * Implementação: 27/08/2024
 */

export interface DomainConfig {
  baseProduct: string
  niche: string
  country: string
  language: string
  template: 'cookie' | 'quiz' | 'review' | 'expert' | 'cod' | 'simple'
}

export interface GeneratedDomain {
  id: string
  domain: string
  subdomain: string
  fullUrl: string
  purpose: string
  campaign: {
    name: string
    keywords: string[]
    targetCountry: string
    language: string
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  created: Date
  status: 'active' | 'pending' | 'retired'
}

export class DomainGenerator {
  private usedDomains: Set<string> = new Set()
  private domainTemplates = {
    health: [
      'health-{keyword}',
      'fit-{keyword}',
      'wellness-{keyword}',
      'natural-{keyword}',
      'healthy-{keyword}',
      'pure-{keyword}'
    ],
    business: [
      'profit-{keyword}',
      'income-{keyword}',
      'cash-{keyword}',
      'money-{keyword}',
      'wealth-{keyword}',
      'success-{keyword}'
    ],
    technology: [
      'tech-{keyword}',
      'digital-{keyword}',
      'online-{keyword}',
      'smart-{keyword}',
      'pro-{keyword}',
      'advanced-{keyword}'
    ],
    lifestyle: [
      'life-{keyword}',
      'style-{keyword}',
      'living-{keyword}',
      'daily-{keyword}',
      'personal-{keyword}',
      'modern-{keyword}'
    ]
  }

  private subdomainPrefixes = [
    'www', 'secure', 'official', 'new', 'latest', 'premium', 
    'exclusive', 'special', 'limited', 'free', 'instant', 'quick',
    'safe', 'trusted', 'verified', 'genuine', 'real', 'authentic'
  ]

  private domainExtensions = [
    '.com', '.net', '.org', '.co', '.info', '.biz'
  ]

  /**
   * Gera múltiplos domínios para uma campanha
   */
  generateDomains(config: DomainConfig, count: number = 5): GeneratedDomain[] {
    const domains: GeneratedDomain[] = []
    const niche = this.detectNiche(config.niche)
    
    for (let i = 0; i < count; i++) {
      const domain = this.createUniqueDomain(config, niche, i)
      if (domain) {
        domains.push(domain)
      }
    }

    return domains
  }

  /**
   * Cria um domínio único
   */
  private createUniqueDomain(config: DomainConfig, niche: keyof typeof this.domainTemplates, index: number): GeneratedDomain | null {
    let attempts = 0
    const maxAttempts = 50

    while (attempts < maxAttempts) {
      try {
        // Seleciona template baseado no nicho
        const templates = this.domainTemplates[niche] || this.domainTemplates.health
        const template = templates[Math.floor(Math.random() * templates.length)]

        // Gera keyword baseada no produto
        const keyword = this.generateKeyword(config.baseProduct, config.niche, index + attempts)
        const domainName = template.replace('{keyword}', keyword)

        // Seleciona extensão
        const extension = this.domainExtensions[Math.floor(Math.random() * this.domainExtensions.length)]
        const fullDomain = `${domainName}${extension}`

        // Verifica se já foi usado
        if (this.usedDomains.has(fullDomain)) {
          attempts++
          continue
        }

        // Gera subdomínio
        const subdomain = this.generateSubdomain(config, index + attempts)
        const fullUrl = `https://${subdomain}.${domainName}${extension}`

        // Marca como usado
        this.usedDomains.add(fullDomain)

        // Gera configuração completa
        const domain: GeneratedDomain = {
          id: this.generateId(),
          domain: fullDomain,
          subdomain: subdomain,
          fullUrl: fullUrl,
          purpose: this.generatePurpose(config.template, config.niche),
          campaign: {
            name: this.generateCampaignName(config, keyword),
            keywords: this.generateKeywords(config.baseProduct, keyword, config.niche),
            targetCountry: config.country,
            language: config.language
          },
          seo: {
            title: this.generateSEOTitle(config.baseProduct, keyword, config.template),
            description: this.generateSEODescription(config.baseProduct, keyword, config.niche),
            keywords: this.generateSEOKeywords(config.baseProduct, keyword, config.niche)
          },
          created: new Date(),
          status: 'pending'
        }

        return domain
      } catch (error) {
        attempts++
        continue
      }
    }

    return null
  }

  /**
   * Detecta nicho baseado no input
   */
  private detectNiche(niche: string): keyof typeof this.domainTemplates {
    const lowerNiche = niche.toLowerCase()
    
    if (lowerNiche.includes('health') || lowerNiche.includes('fitness') || lowerNiche.includes('diet') || lowerNiche.includes('weight')) {
      return 'health'
    }
    if (lowerNiche.includes('money') || lowerNiche.includes('business') || lowerNiche.includes('profit') || lowerNiche.includes('income')) {
      return 'business'
    }
    if (lowerNiche.includes('tech') || lowerNiche.includes('software') || lowerNiche.includes('digital') || lowerNiche.includes('online')) {
      return 'technology'
    }
    
    return 'lifestyle'
  }

  /**
   * Gera keyword única
   */
  private generateKeyword(product: string, niche: string, seed: number): string {
    const productWords = product.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8)
    const nicheWords = niche.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6)
    
    const variations = [
      productWords,
      nicheWords,
      `${productWords}${seed}`,
      `${nicheWords}${seed}`,
      `${productWords.substring(0, 4)}${nicheWords.substring(0, 4)}`,
      `${productWords}${nicheWords}`.substring(0, 10)
    ]
    
    return variations[seed % variations.length] || `product${seed}`
  }

  /**
   * Gera subdomínio
   */
  private generateSubdomain(config: DomainConfig, seed: number): string {
    const prefixes = [...this.subdomainPrefixes]
    
    // Adiciona prefixos específicos do template
    switch (config.template) {
      case 'cookie':
        prefixes.push('news', 'report', 'breaking', 'alert')
        break
      case 'quiz':
        prefixes.push('quiz', 'test', 'check', 'discover')
        break
      case 'review':
        prefixes.push('review', 'honest', 'real', 'truth')
        break
      case 'expert':
        prefixes.push('expert', 'doctor', 'pro', 'medical')
        break
      case 'cod':
        prefixes.push('order', 'buy', 'get', 'claim')
        break
    }

    return prefixes[seed % prefixes.length] || 'www'
  }

  /**
   * Gera ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  }

  /**
   * Gera propósito da campanha
   */
  private generatePurpose(template: string, niche: string): string {
    const purposes = {
      cookie: `Landing page estilo notícia para ${niche}`,
      quiz: `Quiz interativo para descoberta de ${niche}`,
      review: `Resenha detalhada e confiável de ${niche}`,
      expert: `Análise especializada e científica de ${niche}`,
      cod: `Página de vendas contra-reembolso para ${niche}`,
      simple: `Página de vendas simplificada para ${niche}`
    }

    return purposes[template as keyof typeof purposes] || `Presell page para ${niche}`
  }

  /**
   * Gera nome da campanha
   */
  private generateCampaignName(config: DomainConfig, keyword: string): string {
    const templates = [
      `${config.baseProduct} - ${keyword.toUpperCase()} - ${config.country}`,
      `${keyword.toUpperCase()} ${config.baseProduct} Campaign - ${config.template.toUpperCase()}`,
      `${config.niche} ${keyword} - ${config.country} ${config.template}`,
      `${config.baseProduct} ${config.template} - ${keyword} ${config.country}`
    ]

    return templates[Math.floor(Math.random() * templates.length)]
  }

  /**
   * Gera keywords para Google Ads
   */
  private generateKeywords(product: string, keyword: string, niche: string): string[] {
    const baseKeywords = [
      product.toLowerCase(),
      keyword,
      niche.toLowerCase(),
      `${product} review`,
      `${product} benefits`,
      `${product} where to buy`,
      `${product} discount`,
      `${product} official`,
      `${keyword} ${niche}`,
      `best ${product}`,
      `${product} results`,
      `${product} real`,
      `${product} legit`,
      `${product} scam`,
      `${product} price`,
      `${product} order`,
      `buy ${product}`,
      `${product} trial`,
      `${product} free`,
      `${product} supplement`,
      `${product} formula`,
      `${product} ingredients`,
      `${product} side effects`,
      `${product} testimonials`,
      `${product} before after`
    ]

    // Remove duplicatas e limita a 20 keywords
    return [...new Set(baseKeywords.filter(k => k.trim()))].slice(0, 20)
  }

  /**
   * Gera título SEO
   */
  private generateSEOTitle(product: string, keyword: string, template: string): string {
    const titles = {
      cookie: `BREAKING: ${product} Discovery Shocks Experts - ${keyword} Report`,
      quiz: `QUIZ: Are You Ready for ${product}? Take ${keyword} Test Now`,
      review: `${product} Review - Honest ${keyword} Analysis & Results`,
      expert: `Dr. Study: ${product} Scientific Analysis - ${keyword} Research`,
      cod: `${product} - Order Now ${keyword} | Pay When You Receive`,
      simple: `${product} Official - Get ${keyword} Results Today`
    }

    return titles[template as keyof typeof titles] || `${product} - ${keyword} Results`
  }

  /**
   * Gera descrição SEO
   */
  private generateSEODescription(product: string, keyword: string, niche: string): string {
    const descriptions = [
      `Discover the truth about ${product}. Real ${keyword} results from ${niche} experts. Read honest reviews and get exclusive discounts.`,
      `${product} breakthrough in ${niche}. See how ${keyword} is changing lives. Limited time offer - act now!`,
      `Official ${product} website. Proven ${keyword} formula for ${niche} results. Free shipping and money-back guarantee.`,
      `${keyword} revealed: How ${product} is revolutionizing ${niche}. Get the facts, see the results, order today.`
    ]

    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  /**
   * Gera keywords SEO
   */
  private generateSEOKeywords(product: string, keyword: string, niche: string): string[] {
    return [
      product.toLowerCase(),
      keyword,
      niche.toLowerCase(),
      `${product} review`,
      `${product} results`,
      `${keyword} ${niche}`,
      `best ${product}`,
      `${product} benefits`,
      `${product} where to buy`,
      `${product} discount`
    ]
  }

  /**
   * Gera campanhas para scaling horizontal
   */
  generateScalingCampaigns(
    product: string,
    niche: string,
    targetCountries: string[],
    templates: Array<DomainConfig['template']>
  ): GeneratedDomain[] {
    const campaigns: GeneratedDomain[] = []

    targetCountries.forEach(country => {
      templates.forEach(template => {
        const config: DomainConfig = {
          baseProduct: product,
          niche: niche,
          country: country,
          language: this.getLanguageForCountry(country),
          template: template
        }

        // Gera 3-5 domínios por combinação
        const domainCount = Math.floor(Math.random() * 3) + 3
        const domains = this.generateDomains(config, domainCount)
        campaigns.push(...domains)
      })
    })

    return campaigns
  }

  /**
   * Mapeia país para idioma
   */
  private getLanguageForCountry(country: string): string {
    const languageMap: Record<string, string> = {
      'US': 'en',
      'CA': 'en',
      'GB': 'en',
      'AU': 'en',
      'BR': 'pt',
      'DE': 'de',
      'FR': 'fr',
      'ES': 'es',
      'IT': 'it',
      'NL': 'nl'
    }

    return languageMap[country] || 'en'
  }

  /**
   * Valida disponibilidade de domínio (simulado)
   */
  async checkDomainAvailability(domain: string): Promise<{
    available: boolean
    suggestions?: string[]
    estimatedCost?: number
  }> {
    // Simula verificação de disponibilidade
    const available = Math.random() > 0.3 // 70% dos domínios estão disponíveis

    return {
      available,
      suggestions: !available ? this.generateSimilarDomains(domain, 3) : undefined,
      estimatedCost: available ? Math.floor(Math.random() * 50) + 10 : undefined
    }
  }

  /**
   * Gera domínios similares como sugestões
   */
  private generateSimilarDomains(originalDomain: string, count: number): string[] {
    const [name, extension] = originalDomain.split('.')
    const suggestions = []

    const modifiers = ['pro', 'plus', 'max', 'ultra', 'super', 'new', '2024', 'official']
    const alternatives = ['.com', '.net', '.org', '.co', '.info']

    for (let i = 0; i < count; i++) {
      if (i < 2) {
        // Adiciona modificador
        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
        suggestions.push(`${name}${modifier}.${extension}`)
      } else {
        // Muda extensão
        const altExt = alternatives[Math.floor(Math.random() * alternatives.length)]
        suggestions.push(`${name}${altExt}`)
      }
    }

    return suggestions
  }

  /**
   * Gera relatório de scaling horizontal
   */
  generateScalingReport(domains: GeneratedDomain[]): {
    summary: {
      totalDomains: number
      byTemplate: Record<string, number>
      byCountry: Record<string, number>
      estimatedReach: number
    }
    recommendations: {
      priority: GeneratedDomain[]
      secondary: GeneratedDomain[]
      experimental: GeneratedDomain[]
    }
    costEstimate: {
      domainCosts: number
      setupCosts: number
      monthlyCosts: number
      total: number
    }
  } {
    const byTemplate: Record<string, number> = {}
    const byCountry: Record<string, number> = {}
    
    domains.forEach(domain => {
      const template = domain.campaign.name.toLowerCase().includes('quiz') ? 'quiz' :
                      domain.campaign.name.toLowerCase().includes('review') ? 'review' :
                      domain.campaign.name.toLowerCase().includes('cookie') ? 'cookie' :
                      domain.campaign.name.toLowerCase().includes('expert') ? 'expert' :
                      domain.campaign.name.toLowerCase().includes('cod') ? 'cod' : 'simple'
      
      byTemplate[template] = (byTemplate[template] || 0) + 1
      byCountry[domain.campaign.targetCountry] = (byCountry[domain.campaign.targetCountry] || 0) + 1
    })

    // Priorização baseada em performance estimada
    const priority = domains.slice(0, Math.ceil(domains.length * 0.3))
    const secondary = domains.slice(Math.ceil(domains.length * 0.3), Math.ceil(domains.length * 0.7))
    const experimental = domains.slice(Math.ceil(domains.length * 0.7))

    const domainCosts = domains.length * 15 // $15 por domínio
    const setupCosts = domains.length * 25  // $25 setup por domínio
    const monthlyCosts = domains.length * 10 // $10/mês hosting por domínio

    return {
      summary: {
        totalDomains: domains.length,
        byTemplate,
        byCountry,
        estimatedReach: domains.length * 1000 // 1000 pessoas por domínio
      },
      recommendations: {
        priority,
        secondary,
        experimental
      },
      costEstimate: {
        domainCosts,
        setupCosts,
        monthlyCosts,
        total: domainCosts + setupCosts + (monthlyCosts * 12)
      }
    }
  }
}

// Instância global
export const domainGenerator = new DomainGenerator()