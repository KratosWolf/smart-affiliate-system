/**
 * Google Ads Competitor Analysis System
 * Analisa anúncios ativos para um produto/local específico
 */

export interface CompetitorAd {
  advertiser: string;
  domain: string;
  headline1: string;
  headline2: string;
  headline3?: string;
  description1: string;
  description2?: string;
  displayUrl: string;
  extensions: AdExtension[];
  position: number;
  frequency: number; // Quantas vezes apareceu em diferentes buscas
}

export interface AdExtension {
  type: 'sitelink' | 'callout' | 'price' | 'promotion' | 'location' | 'call';
  content: string;
}

export interface CompetitorAnalysis {
  productName: string;
  country: string;
  searchDate: Date;
  totalAdvertisers: number;
  totalAdsFound: number;
  
  // Análise de Frequência
  topAdvertisers: {
    domain: string;
    adsCount: number;
    avgPosition: number;
    dominance: number; // % de presença nas buscas
  }[];
  
  // Headlines mais usadas
  topHeadlines: {
    text: string;
    frequency: number;
    advertisers: string[];
  }[];
  
  // Palavras-chave mais frequentes
  topKeywords: {
    keyword: string;
    frequency: number;
    inHeadlines: number;
    inDescriptions: number;
  }[];
  
  // CTAs mais usados
  topCTAs: {
    cta: string;
    frequency: number;
    examples: string[];
  }[];
  
  // Extensões mais comuns
  commonExtensions: {
    type: string;
    frequency: number;
    examples: string[];
  }[];
  
  // Estratégias detectadas
  strategies: {
    priceStrategy: 'hidden' | 'prominent' | 'discount' | 'premium';
    urgencyLevel: 'none' | 'low' | 'medium' | 'high';
    socialProofUsage: boolean;
    brandFocus: boolean;
    benefitsFocus: boolean;
  };
  
  // Recomendações para se destacar
  recommendations: string[];
}

export class GoogleAdsAnalyzer {
  
  /**
   * Simula busca em múltiplos contextos (como fazer manualmente)
   */
  async analyzeCompetitorAds(
    productName: string,
    country: string,
    options?: {
      searches?: number; // Quantas buscas fazer (default: 3)
      variations?: boolean; // Testar variações de keywords
      incognito?: boolean; // Simular modo incógnito
    }
  ): Promise<CompetitorAnalysis> {
    
    const searches = options?.searches || 3;
    const allAds: CompetitorAd[] = [];
    
    // Simula múltiplas buscas como você faz manualmente
    for (let i = 0; i < searches; i++) {
      const searchContext = this.getSearchContext(i);
      const ads = await this.fetchAdsForSearch(
        productName,
        country,
        searchContext
      );
      allAds.push(...ads);
    }
    
    // Analisa todos os anúncios coletados
    return this.analyzeCollectedAds(allAds, productName, country);
  }
  
  /**
   * Diferentes contextos de busca (simula browsers diferentes)
   */
  private getSearchContext(index: number): SearchContext {
    const contexts: SearchContext[] = [
      { type: 'normal', location: 'default', device: 'desktop' },
      { type: 'incognito', location: 'vpn', device: 'desktop' },
      { type: 'mobile', location: 'default', device: 'mobile' }
    ];
    
    return contexts[index % contexts.length];
  }
  
  /**
   * Busca anúncios em um contexto específico
   */
  private async fetchAdsForSearch(
    productName: string,
    country: string,
    context: SearchContext
  ): Promise<CompetitorAd[]> {
    
    // Em produção, isso seria feito via:
    // 1. Puppeteer/Playwright para simular navegador real
    // 2. Proxy para diferentes IPs
    // 3. Google Ads API (limitada)
    
    // Por enquanto, retorna dados simulados baseados em padrões reais
    return this.generateMockAds(productName, country, context);
  }
  
  /**
   * Analisa todos os anúncios coletados
   */
  private analyzeCollectedAds(
    ads: CompetitorAd[],
    productName: string,
    country: string
  ): CompetitorAnalysis {
    
    // Agrupa por anunciante
    const advertiserMap = new Map<string, CompetitorAd[]>();
    ads.forEach(ad => {
      const current = advertiserMap.get(ad.domain) || [];
      current.push(ad);
      advertiserMap.set(ad.domain, current);
    });
    
    // Analisa headlines
    const headlineFrequency = new Map<string, number>();
    const allHeadlines: string[] = [];
    
    ads.forEach(ad => {
      [ad.headline1, ad.headline2, ad.headline3].forEach(h => {
        if (h) {
          allHeadlines.push(h);
          headlineFrequency.set(h, (headlineFrequency.get(h) || 0) + 1);
        }
      });
    });
    
    // Extrai palavras-chave mais comuns
    const keywordFrequency = this.extractKeywordFrequency(ads);
    
    // Detecta CTAs
    const ctaPatterns = this.detectCTAPatterns(ads);
    
    // Analisa extensões
    const extensionAnalysis = this.analyzeExtensions(ads);
    
    // Detecta estratégias
    const strategies = this.detectStrategies(ads);
    
    // Gera recomendações
    const recommendations = this.generateRecommendations(
      advertiserMap,
      strategies,
      keywordFrequency
    );
    
    return {
      productName,
      country,
      searchDate: new Date(),
      totalAdvertisers: advertiserMap.size,
      totalAdsFound: ads.length,
      
      topAdvertisers: Array.from(advertiserMap.entries())
        .map(([domain, domainAds]) => ({
          domain,
          adsCount: domainAds.length,
          avgPosition: domainAds.reduce((sum, ad) => sum + ad.position, 0) / domainAds.length,
          dominance: (domainAds.length / ads.length) * 100
        }))
        .sort((a, b) => b.dominance - a.dominance)
        .slice(0, 5),
      
      topHeadlines: Array.from(headlineFrequency.entries())
        .map(([text, freq]) => ({
          text,
          frequency: freq,
          advertisers: ads.filter(ad => 
            ad.headline1 === text || 
            ad.headline2 === text || 
            ad.headline3 === text
          ).map(ad => ad.domain)
        }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10),
      
      topKeywords: keywordFrequency.slice(0, 10),
      topCTAs: ctaPatterns.slice(0, 5),
      commonExtensions: extensionAnalysis,
      strategies,
      recommendations
    };
  }
  
  /**
   * Extrai palavras-chave mais frequentes
   */
  private extractKeywordFrequency(ads: CompetitorAd[]) {
    const wordFreq = new Map<string, { total: number; headlines: number; descriptions: number }>();
    
    // Palavras importantes para análise
    const importantWords = [
      'official', 'original', 'discount', 'sale', 'free', 'guarantee',
      'natural', 'premium', 'best', 'top', 'proven', 'certified',
      '50%', '60%', '70%', 'today', 'limited', 'exclusive'
    ];
    
    ads.forEach(ad => {
      // Analisa headlines
      const headlineText = `${ad.headline1} ${ad.headline2} ${ad.headline3 || ''}`.toLowerCase();
      const descText = `${ad.description1} ${ad.description2 || ''}`.toLowerCase();
      
      importantWords.forEach(word => {
        if (headlineText.includes(word) || descText.includes(word)) {
          const current = wordFreq.get(word) || { total: 0, headlines: 0, descriptions: 0 };
          current.total++;
          if (headlineText.includes(word)) current.headlines++;
          if (descText.includes(word)) current.descriptions++;
          wordFreq.set(word, current);
        }
      });
    });
    
    return Array.from(wordFreq.entries())
      .map(([keyword, stats]) => ({
        keyword,
        frequency: stats.total,
        inHeadlines: stats.headlines,
        inDescriptions: stats.descriptions
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
  
  /**
   * Detecta padrões de CTA
   */
  private detectCTAPatterns(ads: CompetitorAd[]) {
    const ctaPatterns = new Map<string, string[]>();
    
    const ctaKeywords = [
      'buy now', 'shop now', 'order today', 'get yours',
      'try now', 'learn more', 'see more', 'discover',
      'save now', 'claim offer', 'limited time', 'act fast'
    ];
    
    ads.forEach(ad => {
      const fullText = `${ad.headline1} ${ad.headline2} ${ad.description1}`.toLowerCase();
      
      ctaKeywords.forEach(cta => {
        if (fullText.includes(cta)) {
          const examples = ctaPatterns.get(cta) || [];
          examples.push(ad.domain);
          ctaPatterns.set(cta, examples);
        }
      });
    });
    
    return Array.from(ctaPatterns.entries())
      .map(([cta, examples]) => ({
        cta,
        frequency: examples.length,
        examples: [...new Set(examples)].slice(0, 3)
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
  
  /**
   * Analisa uso de extensões
   */
  private analyzeExtensions(ads: CompetitorAd[]) {
    const extensionFreq = new Map<string, string[]>();
    
    ads.forEach(ad => {
      ad.extensions.forEach(ext => {
        const examples = extensionFreq.get(ext.type) || [];
        examples.push(ext.content);
        extensionFreq.set(ext.type, examples);
      });
    });
    
    return Array.from(extensionFreq.entries())
      .map(([type, examples]) => ({
        type,
        frequency: examples.length,
        examples: [...new Set(examples)].slice(0, 3)
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
  
  /**
   * Detecta estratégias dos concorrentes
   */
  private detectStrategies(ads: CompetitorAd[]) {
    const allText = ads.map(ad => 
      `${ad.headline1} ${ad.headline2} ${ad.description1}`.toLowerCase()
    ).join(' ');
    
    return {
      priceStrategy: this.detectPriceStrategy(allText),
      urgencyLevel: this.detectUrgencyLevel(allText),
      socialProofUsage: allText.includes('review') || allText.includes('testimonial') || allText.includes('trusted'),
      brandFocus: allText.includes('official') || allText.includes('original') || allText.includes('authentic'),
      benefitsFocus: allText.includes('benefit') || allText.includes('result') || allText.includes('improve')
    };
  }
  
  private detectPriceStrategy(text: string): 'hidden' | 'prominent' | 'discount' | 'premium' {
    if (text.includes('%') || text.includes('off') || text.includes('sale')) return 'discount';
    if (text.includes('premium') || text.includes('luxury')) return 'premium';
    if (text.includes('$') || text.includes('€') || text.includes('price')) return 'prominent';
    return 'hidden';
  }
  
  private detectUrgencyLevel(text: string): 'none' | 'low' | 'medium' | 'high' {
    const urgencyWords = ['today', 'now', 'limited', 'last', 'hurry', 'fast', 'ending'];
    const count = urgencyWords.filter(word => text.includes(word)).length;
    
    if (count >= 3) return 'high';
    if (count >= 2) return 'medium';
    if (count >= 1) return 'low';
    return 'none';
  }
  
  /**
   * Gera recomendações baseadas na análise
   */
  private generateRecommendations(
    advertiserMap: Map<string, CompetitorAd[]>,
    strategies: any,
    keywords: any[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Análise de saturação
    if (advertiserMap.size > 5) {
      recommendations.push('Mercado competitivo: Foque em diferenciação única');
    } else {
      recommendations.push('Poucos competidores: Oportunidade de dominar o mercado');
    }
    
    // Estratégia de preço
    if (strategies.priceStrategy === 'discount') {
      recommendations.push('Competidores focam em desconto: Considere estratégia de valor/qualidade');
    } else if (strategies.priceStrategy === 'hidden') {
      recommendations.push('Preço não é foco: Destaque benefícios claros e garantias');
    }
    
    // Urgência
    if (strategies.urgencyLevel === 'high') {
      recommendations.push('Alta urgência nos ads: Use urgência moderada para parecer mais confiável');
    } else {
      recommendations.push('Baixa urgência detectada: Oportunidade para criar escassez');
    }
    
    // Keywords não exploradas
    const underusedKeywords = keywords.filter(k => k.frequency < 3);
    if (underusedKeywords.length > 0) {
      recommendations.push(`Keywords pouco usadas: ${underusedKeywords.slice(0, 3).map(k => k.keyword).join(', ')}`);
    }
    
    return recommendations;
  }
  
  /**
   * Gera dados mock realistas para teste
   */
  private generateMockAds(productName: string, country: string, context: SearchContext): CompetitorAd[] {
    // Dados baseados em padrões reais do Google Ads
    
    if (productName.toLowerCase() === 'skinatrin' && country === 'Polônia') {
      return [
        {
          advertiser: 'Skinatrin Official',
          domain: 'skinatrin-official.pl',
          headline1: 'Skinatrin® Oficjalna Strona',
          headline2: '-50% Tylko Dziś',
          headline3: 'Oryginał z Gwarancją',
          description1: 'Naturalny żel przeciwgrzybiczy. Klinicznie przetestowany.',
          description2: 'Szybka dostawa. 90 dni gwarancji zwrotu pieniędzy.',
          displayUrl: 'skinatrin-official.pl',
          extensions: [
            { type: 'sitelink', content: 'Opinie Klientów' },
            { type: 'sitelink', content: 'Jak Stosować' },
            { type: 'callout', content: '✓ Darmowa Dostawa' },
            { type: 'callout', content: '✓ 100% Naturalny' }
          ],
          position: 1,
          frequency: 3
        },
        {
          advertiser: 'Health Store PL',
          domain: 'zdrowie-sklep.pl',
          headline1: 'Skinatrin Najtaniej',
          headline2: 'Sprawdź Promocję',
          headline3: 'Dostawa 24h',
          description1: 'Najlepsza cena na rynku. Tylko oryginalne produkty.',
          description2: 'Zaufało nam już 10,000+ klientów.',
          displayUrl: 'zdrowie-sklep.pl/skinatrin',
          extensions: [
            { type: 'price', content: '39 PLN' },
            { type: 'promotion', content: 'KOD: ZDROWIE20' }
          ],
          position: 2,
          frequency: 2
        },
        {
          advertiser: 'Pharma Direct',
          domain: 'pharma-direct.eu',
          headline1: 'Skuteczny Na Grzybicę',
          headline2: 'Skinatrin - Wypróbuj',
          description1: 'Potwierdzona skuteczność. Bezpieczny dla skóry.',
          displayUrl: 'pharma-direct.eu',
          extensions: [
            { type: 'callout', content: 'Certyfikat CE' }
          ],
          position: 3,
          frequency: 1
        }
      ];
    }
    
    // Default mock data
    return [
      {
        advertiser: 'Generic Store',
        domain: 'example.com',
        headline1: productName,
        headline2: 'Best Price',
        description1: 'High quality product with guarantee',
        displayUrl: 'example.com',
        extensions: [],
        position: 1,
        frequency: 1
      }
    ];
  }
}

interface SearchContext {
  type: 'normal' | 'incognito' | 'mobile';
  location: 'default' | 'vpn';
  device: 'desktop' | 'mobile';
}

// Export singleton instance
export const adsAnalyzer = new GoogleAdsAnalyzer();