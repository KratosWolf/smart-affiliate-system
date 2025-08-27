/**
 * Campaign Builder - Gera campanhas Google Ads estruturadas
 * Filosofia: "Estrutura única simplificada" para testes rápidos
 */

import { ProductValidationResponse } from '@/types';
import { countryDetector } from '../localization/country-detector';
import { adsAnalyzer } from '../competitors/ads-analyzer';

export interface CampaignStructure {
  // Campaign Level
  campaign: {
    name: string;
    budget: number;
    currency: string;
    locations: string[];
    languages: string[];
    biddingStrategy: 'TARGET_CPA' | 'MAXIMIZE_CONVERSIONS';
    targetCpa?: number;
  };
  
  // Simplified: No Ad Groups (1 Campaign = 1 Ad)  
  // adGroup: removed - following user's simpler approach
  
  // Keywords
  keywords: CampaignKeyword[];
  
  // Ads  
  ads: CampaignAd[];
  
  // Extensions
  extensions: CampaignExtension[];
  
  // Metadata
  metadata: {
    productName: string;
    country: string;
    validationScore: number;
    estimatedCpa: number;
    generatedAt: string;
  };
}

export interface CampaignKeyword {
  keyword: string;
  matchType: 'BROAD' | 'PHRASE' | 'EXACT';
  maxCpc: number;
  finalUrl: string;
}

export interface CampaignAd {
  headlines: string[]; // Max 3, each 30 chars
  descriptions: string[]; // Max 2, each 90 chars
  finalUrl: string;
  displayUrl: string;
}

export interface CampaignExtension {
  type: 'SITELINK' | 'CALLOUT' | 'STRUCTURED_SNIPPET';
  text: string;
  url?: string;
}

export class CampaignBuilder {
  
  /**
   * Gera campanha completa a partir da validação
   */
  async buildCampaign(
    validation: ProductValidationResponse,
    affiliateUrl: string,
    presellUrl?: string
  ): Promise<CampaignStructure> {
    
    // Detecta configurações do país
    const countrySettings = countryDetector.detectByCountry(validation.targetCountry);
    
    // Analisa competidores para insights
    const competitorAnalysis = await adsAnalyzer.analyzeCompetitorAds(
      validation.productName,
      validation.targetCountry
    );
    
    // Gera nome da campanha
    const campaignName = this.generateCampaignName(validation);
    
    // Calcula orçamento e CPA alvo
    const budgetData = this.calculateBudget(validation);
    
    // Gera palavras-chave otimizadas
    const keywords = this.generateKeywords(validation, competitorAnalysis, countrySettings, presellUrl || affiliateUrl);
    
    // Gera anúncios character-perfect
    const ads = this.generateAds(validation, competitorAnalysis, countrySettings, presellUrl || affiliateUrl);
    
    // Gera extensões
    const extensions = this.generateExtensions(validation, countrySettings);
    
    return {
      campaign: {
        name: campaignName,
        budget: budgetData.dailyBudget,
        currency: countrySettings.currency,
        locations: [countrySettings.adWordsCountryCode],
        languages: [countrySettings.adWordsLanguageCode],
        biddingStrategy: 'TARGET_CPA',
        targetCpa: budgetData.targetCpa
      },
      
      // No adGroup - simplified structure
      
      keywords,
      ads,
      extensions,
      
      metadata: {
        productName: validation.productName,
        country: validation.targetCountry,
        validationScore: validation.validationScore,
        estimatedCpa: budgetData.targetCpa,
        generatedAt: new Date().toISOString()
      }
    };
  }
  
  /**
   * Gera nome da campanha seguindo convenção
   */
  private generateCampaignName(validation: ProductValidationResponse): string {
    const cleanProductName = validation.productName.replace(/[^a-zA-Z0-9]/g, '');
    const shortCountry = this.getCountryAbbreviation(validation.targetCountry);
    
    return `${cleanProductName} - ${shortCountry} - Teste CPA`;
  }
  
  /**
   * Calcula orçamento e estratégia de lances
   */
  private calculateBudget(validation: ProductValidationResponse) {
    const suggestedBudget = validation.recommendations.suggestedBudget;
    const avgCpc = validation.marketAnalysis.avgCpc;
    const estimatedConversionRate = this.estimateConversionRate(validation.validationScore);
    
    // CPA alvo baseado na margem do produto
    const productPrice = validation.productData.price;
    const estimatedMargin = productPrice * 0.3; // 30% commission assumed
    const targetCpa = estimatedMargin * 0.6; // 60% da margem como CPA máximo
    
    return {
      dailyBudget: Math.max(suggestedBudget, avgCpc * 10), // Mín 10 cliques/dia
      targetCpa: Math.max(targetCpa, avgCpc * 5), // Mín 5x o CPC
      defaultBid: avgCpc * 1.2 // 20% acima do CPC médio (ainda usado para cálculos)
    };
  }
  
  /**
   * Gera palavras-chave inteligentes
   */
  private generateKeywords(
    validation: ProductValidationResponse, 
    competitorAnalysis: any,
    countrySettings: any,
    finalUrl: string
  ): CampaignKeyword[] {
    
    const baseKeywords = [
      validation.productName.toLowerCase(),
      `${validation.productName.toLowerCase()} ${countrySettings.commonWords.buy}`,
      `${validation.productName.toLowerCase()} ${countrySettings.commonWords.official}`
    ];
    
    // Adiciona variações dos competidores (se não muito usadas)
    const competitorKeywords = competitorAnalysis.topHeadlines
      .filter((h: any) => h.frequency < 3) // Não muito usadas
      .slice(0, 2)
      .map((h: any) => h.text.toLowerCase());
    
    const allKeywords = [...baseKeywords, ...competitorKeywords];
    
    return allKeywords.map((keyword, index) => ({
      keyword: keyword.trim(),
      matchType: index === 0 ? 'BROAD' as const : 
                 index === 1 ? 'PHRASE' as const : 'EXACT' as const,
      maxCpc: validation.marketAnalysis.avgCpc * (1.5 - index * 0.2), // Decrescente
      finalUrl
    }));
  }
  
  /**
   * Gera anúncios character-perfect
   */
  private generateAds(
    validation: ProductValidationResponse,
    competitorAnalysis: any,
    countrySettings: any,
    finalUrl: string
  ): CampaignAd[] {
    
    // Analisa estratégia dos competidores
    const competitorStrategy = competitorAnalysis.strategies;
    
    // Gera headlines diferenciadas
    const headlines = this.generateHeadlines(validation, competitorStrategy, countrySettings);
    
    // Gera descriptions otimizadas
    const descriptions = this.generateDescriptions(validation, countrySettings);
    
    // URL de exibição
    const displayUrl = this.generateDisplayUrl(finalUrl);
    
    return [{
      headlines,
      descriptions,
      finalUrl,
      displayUrl
    }];
  }
  
  /**
   * Gera headlines character-perfect (30 chars cada)
   */
  private generateHeadlines(validation: ProductValidationResponse, competitorStrategy: any, countrySettings: any): string[] {
    const productName = validation.productName;
    const commonWords = countrySettings.commonWords;
    
    const headlines: string[] = [];
    
    // Headline 1: Produto + Official (para autoridade)
    headlines.push(this.optimizeLength(`${productName}® ${commonWords.official}`, 30));
    
    // Headline 2: Baseada na estratégia dos competidores
    if (competitorStrategy.priceStrategy === 'discount') {
      // Se competidores focam desconto, vamos para qualidade
      headlines.push(this.optimizeLength(`${commonWords.guarantee} 90 Dias`, 30));
    } else {
      // Se não focam desconto, aproveitamos
      headlines.push(this.optimizeLength(`-50% ${commonWords.today}`, 30));
    }
    
    // Headline 3: Urgência (se competidores não usam muito)
    if (competitorStrategy.urgencyLevel === 'low') {
      headlines.push(this.optimizeLength(`${commonWords.limited} ${commonWords.now}`, 30));
    } else {
      headlines.push(this.optimizeLength(`${commonWords.free} Entrega`, 30));
    }
    
    return headlines;
  }
  
  /**
   * Gera descriptions otimizadas (90 chars cada)
   */
  private generateDescriptions(validation: ProductValidationResponse, countrySettings: any): string[] {
    const descriptions: string[] = [];
    const commonWords = countrySettings.commonWords;
    
    // Description 1: Produto + benefício + guarantee
    const desc1 = `${validation.productData.description}. ${commonWords.guarantee} 90 dias.`;
    descriptions.push(this.optimizeLength(desc1, 90));
    
    // Description 2: Entrega + credibilidade  
    const desc2 = `Entrega rápida e segura. Milhares de clientes satisfeitos.`;
    descriptions.push(this.optimizeLength(desc2, 90));
    
    return descriptions;
  }
  
  /**
   * Gera extensões da campanha
   */
  private generateExtensions(validation: ProductValidationResponse, countrySettings: any): CampaignExtension[] {
    const commonWords = countrySettings.commonWords;
    
    return [
      {
        type: 'CALLOUT',
        text: `✓ ${commonWords.guarantee} 90 Dias`
      },
      {
        type: 'CALLOUT', 
        text: `✓ Entrega ${commonWords.free}`
      },
      {
        type: 'CALLOUT',
        text: `✓ 100% ${commonWords.official}`
      },
      {
        type: 'STRUCTURED_SNIPPET',
        text: `Tipos: Gel, Creme, Spray`
      }
    ];
  }
  
  // Helper methods
  
  private getCountryAbbreviation(country: string): string {
    const abbreviations: Record<string, string> = {
      'Brasil': 'BR',
      'Polônia': 'PL', 
      'Estados Unidos': 'US',
      'Alemanha': 'DE',
      'França': 'FR',
      'Espanha': 'ES',
      'Portugal': 'PT'
    };
    
    return abbreviations[country] || country.substring(0, 2).toUpperCase();
  }
  
  private estimateConversionRate(validationScore: number): number {
    // Score alto = conversion rate mais alta
    return Math.max(0.01, (validationScore / 100) * 0.05); // 1% to 5%
  }
  
  private optimizeLength(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    
    // Trunca inteligentemente
    const truncated = text.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > maxLength * 0.7 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }
  
  private generateDisplayUrl(finalUrl: string): string {
    try {
      const url = new URL(finalUrl);
      let displayUrl = url.hostname.replace('www.', '');
      
      // Otimiza para 15 caracteres
      if (displayUrl.length > 15) {
        displayUrl = displayUrl.substring(0, 12) + '...';
      }
      
      return displayUrl;
    } catch {
      return 'oferta-especial.com';
    }
  }
}

// Export singleton
export const campaignBuilder = new CampaignBuilder();