/**
 * METODOLOGIA OFICIAL LUIZ - GERADOR DE CAMPANHAS
 * ATUALIZADO PARA FASE 1: Smart headlines contextuais
 */

import { ProductValidationResponse } from '@/types';
import { luizCampaignV3, LuizCampaignConfigV3 } from './luiz-campaign-v3';
import { countryDetector } from '../localization/country-detector';

export interface LuizCampaignData {
  // Dados extraídos da página do produtor
  productName: string;
  guarantee: string | number; // "NA" ou número de dias
  unitPrice: number;
  discountPercent: number;
  valueDiscount: number;
  country: string;
  language: string;
  currency: string;
  currencyExample: string;
}

export interface LuizCampaignOutput {
  campaign: {
    name: string;
    budget: number;
    targetCpa: number;
    currency: string;
    type: 'SEARCH';
    structure: '1_CAMPAIGN_1_AD';
  };
  keywords: Array<{
    keyword: string;
    matchType: 'BROAD';
    case: 'lowercase' | 'uppercase';
  }>;
  ads: {
    headlines: string[]; // Máximo 15
    descriptions: string[]; // Máximo 4
  };
  extensions: {
    sitelinks: Array<{ text: string; category: string }>;
    callouts: Array<{ text: string; category: string }>;
    snippets: Array<{ text: string; category: string }>;
  };
  csvFiles: {
    campaignStructure: string;
    keywords: string;
    ads: string;
    sitelinks: string;
    callouts: string;
    snippets: string;
  };
}

export class LuizCampaignGenerator {

  /**
   * TEMPLATES OFICIAIS (BASEADO NOS PRINTS)
   */
  private readonly TEMPLATES = {
    
    // HEADLINES FIXAS 1-7 (SEMPRE COM NOME DO PRODUTO)
    FIXED_HEADLINES: [
      '[PDTO] + Online Store',
      '[PDTO] Order Now',
      '[PDTO] Buy Now', 
      '[PDTO] Special Offer',
      '[PDTO] Save up to [VALUE_DISCOUNT]',
      '[PDTO] Biggest Discount',
      '[PDTO] Get Your Offer'
    ],

    // HEADLINES 8-15 (MIX DE CATEGORIAS)
    CATEGORY_HEADLINES: {
      SAVINGS: [
        '[PDTO] Insane Factory Sale',
        '[PDTO] | Save [DISCOUNT%] Today',
        '[PDTO] | Best Offer Here',
        '[PDTO] | Half Price Offer',
        'Save Big Per Bottle Today',
        'Huge Discount Running Now',
        '[PDTO] | Get [DISCOUNT%] Off',
        'Special Offer {LOCATION(City)}'
      ],
      CTA: [
        'Start Your Order NOw',
        '[PDTO] Order Now',
        'Get Your Offer',
        'Get Yours Today',
        'Get It Now'
      ],
      SCARCITY: [
        'Order Now While Supplies Last',
        'Last Hours Offer, Act Now',
        'Last Units Available',
        'Limited Time Only',
        'Get It Before It\'s Gone'
      ],
      DELIVERY: [
        'Free Shipping to {Location (City):US}',
        'Free Prompt Delivery',
        'Direct From Factory'
      ],
      GUARANTEE: [
        '[GUARANTEE]-Day Money Back Guarantee',
        'GuaranteeDays to Try With Money Back'
      ],
      COD: [
        'Ship Now, Pay Later',
        'Pay Only When Delivered',
        'Buy Now, Pay on Delivery',
        'Order Now, Pay Later',
        'Get It First, Pay Later'
      ]
    },

    // DESCRIPTIONS (EXEMPLOS REAIS DOS PRINTS)
    DESCRIPTIONS: [
      'Order [PDTO] Here On Website With [GUARANTEE] Days Guarantee. Best Value Pack [Unite Value]/Bottle Now',
      'Buy [PDTO] Today & Get $780 Off With [GUARANTEE]-Days Money Back Guarantee + Free Shipping',
      '[PDTO]: #1 Voted Product. 100% Pure & Natural With Free U.S Shipping.',
      'Get [PDTO] Now For Over [DISCOUNT%] Off and Free Prompt Delivery! Don\'t Miss Out On Savings',
      'You Can Try [PDTO] For [GUARANTEE]Days With Your Money Back Guarantee, Get It Before It\'s Gone',
      '[PDTO] with Free & Fast Shipping. Get [Guarantee] day 100% Guarantee',
      'Buy [PDTO] for only [Unite Value]/bottle + free shipping to your door',
      'Run and enjoy the last hours with [DISCOUNT%] off. Best price on the web'
    ],

    // SITELINKS (BASEADO NOS PRINTS)
    SITELINKS: {
      SAVINGS: [
        'Where to Buy [PDTO]',
        '[PDTO] is Only Available for',
        'Purchase On Website',
        'Half Price Offer',
        'Big Sale in Progress',
        'Get [DISCOUNT%] Off',
        'Save Up To [DISCOUNT%]',
        'Only [UNIT_PRICE] + Free Shipping',
        'Save [VALUE_DISCOUNT] Today'
      ],
      DELIVERY: [
        'Free Private Delivery',
        'Get it Home',
        'With Privacy And Free',
        'Free Shipping',
        'Direct To Your Door'
      ],
      GUARANTEE: [
        '[GUARANTEE] Days to Try',
        '[GUARANTEE] Day Money Back Guarantee',
        'Place Your Order and Try it',
        'Money Back Guarantee',
        'With [GUARANTEE] Days 100% Refund'
      ],
      CTA: [
        'Official Website',
        'Start Your Order Here',
        '[PDTO] Order Now',
        'Get It Now'
      ],
      SCARCITY: [
        'Last Units Available',
        'Last Offer Call',
        'Low Stock Available',
        'Limited Time Only',
        'Last Hours'
      ]
    },

    // CALLOUTS (BASEADO NOS PRINTS)
    CALLOUTS: {
      SAVINGS: [
        'Only $49 per Bottle Today',
        'Save Up to $780',
        'Half Price Offer',
        'Only [UNIT_PRICE]/bottle',
        'Best Offer Guarantee',
        'Exclusive Deal to You',
        'Discount Only Today'
      ],
      CTA: [
        '[PDTO] Order Now',
        'Don\'t Miss This Out'
      ],
      SCARCITY: [
        'Last Units Available'
      ],
      GUARANTEE: [
        '[GUARANTEE] Days to Try With Money Back',
        'Money Back Guarantee'
      ],
      DELIVERY: [
        'Free Private Shipping',
        'Free Shipping',
        'Free and Fast Shipping'
      ],
      PRODUCT: [
        '100% Organic & Natural',
        'Approved By Experts',
        'Lots of Happy Customers'
      ]
    },

    // STRUCTURED SNIPPETS (BASEADO NOS PRINTS)
    SNIPPETS: {
      SAVINGS: [
        'Half Price Offer',
        'Save Big, Order Now',
        'One-day Flash Sale',
        'Only [Unite Value]/bottle',
        'Deal of the Day',
        'Lowest Price',
        'Exclusive Discount'
      ],
      DELIVERY: [
        'Free Private Delivery',
        'Free Shipping'
      ],
      GUARANTEE: [
        '[GUARANTEE]Days Money Back'
      ],
      PRODUCT: [
        'Instant Access',
        'As Soon As You Complete Your Order',
        'Activate Your [PDTO] Today'
      ],
      SCARCITY: [
        'Limited-Time Offer',
        'Ending Soon',
        'Ends This Week',
        'Limited Time Only',
        'Last Offer Call',
        'Low Stock Available'
      ],
      GIFTS: [
        'Get Free Gifts Now',
        'Ideal Future Creation Infographic'
      ],
      CTA: [
        'Get The Genius Visualization',
        '[PDTO] Buy Today',
        'Get Yours Today',
        'Get It Now'
      ]
    }
  };

  /**
   * GERA CAMPANHA COMPLETA USANDO METODOLOGIA LUIZ
   */
  async generateCampaign(
    validation: ProductValidationResponse,
    affiliateUrl: string,
    campaignData: Partial<LuizCampaignData> = {}
  ): Promise<LuizCampaignOutput> {
    
    console.log('🚀 USANDO FASE 1 - Smart Headlines Contextuais!');
    
    // Mapeia dados antigos para o formato da Fase 1
    const phase1Config: LuizCampaignConfigV3 = {
      productName: campaignData.productName || validation.productName,
      platform: ((campaignData as any).platform || (validation as any).platform || 'CLICKBANK') as any,
      commissionValue: (campaignData as any).commissionValue || (campaignData as any).unitPrice || 45,
      country: campaignData.country || validation.targetCountry,
      currency: (validation.productData.currency === 'BRL' ? 'BRL' : 'USD') as 'BRL' | 'USD',
      producerPageUrl: validation.productUrl || 'https://example.com',
      affiliateUrl: affiliateUrl,
      // Dados contextuais opcionais da Fase 1
      discountPercentage: (campaignData as any).discountPercentage || (campaignData as any).discountPercent,
      discountAmount: (campaignData as any).discountAmount || (campaignData as any).valueDiscount,
      productPrice: (campaignData as any).productPrice,
      guaranteePeriod: (campaignData as any).guaranteePeriod || (
        typeof (campaignData as any).guarantee === 'string' ? (campaignData as any).guarantee :
        (campaignData as any).guarantee && (campaignData as any).guarantee !== undefined ? `${(campaignData as any).guarantee} dias` : undefined
      ),
      deliveryType: (campaignData as any).deliveryType
    };
    
    console.log('🎯 Config Fase 1:', {
      productName: phase1Config.productName,
      country: phase1Config.country,
      currency: phase1Config.currency,
      discountPercentage: phase1Config.discountPercentage,
      discountAmount: phase1Config.discountAmount,
      productPrice: phase1Config.productPrice,
      guaranteePeriod: phase1Config.guaranteePeriod,
      deliveryType: phase1Config.deliveryType
    });
    
    // Usa o gerador da Fase 1
    const phase1Result = await luizCampaignV3.generateCampaign(phase1Config);
    
    // Converte resultado para formato esperado pelo sistema atual
    const convertedResult: LuizCampaignOutput = {
      campaign: {
        name: phase1Result.campaign.name,
        budget: phase1Result.campaign.budget,
        targetCpa: phase1Result.campaign.targetCPA,
        currency: phase1Result.campaign.currency,
        type: 'SEARCH' as const,
        structure: '1_CAMPAIGN_1_AD' as const
      },
      keywords: phase1Result.keywords.map(k => ({
        keyword: k.keyword,
        matchType: 'BROAD' as const,
        case: k.keyword === k.keyword.toLowerCase() ? 'lowercase' as const : 'uppercase' as const
      })),
      ads: {
        headlines: phase1Result.ads[0]?.headlines || [],
        descriptions: phase1Result.ads[0]?.descriptions || []
      },
      extensions: {
        sitelinks: phase1Result.extensions.sitelinks.map((s: any) => ({
          text: s.text,
          category: 'GENERAL'
        })),
        callouts: phase1Result.extensions.callouts.map((c: any) => ({
          text: c,
          category: 'GENERAL'
        })),
        snippets: phase1Result.extensions.snippets.map((s: any) => ({
          text: s.values.join(', '),
          category: s.header.toUpperCase()
        }))
      },
      csvFiles: this.generateCSVFiles({
        campaign: {
          name: phase1Result.campaign.name,
          budget: phase1Result.campaign.budget,
          targetCpa: phase1Result.campaign.targetCPA,
          currency: phase1Result.campaign.currency,
          type: 'SEARCH' as const,
          structure: '1_CAMPAIGN_1_AD' as const
        },
        keywords: phase1Result.keywords.map(k => ({
          keyword: k.keyword,
          matchType: 'BROAD' as const,
          case: k.keyword === k.keyword.toLowerCase() ? 'lowercase' as const : 'uppercase' as const
        })),
        headlines: phase1Result.ads[0]?.headlines || [],
        descriptions: phase1Result.ads[0]?.descriptions || [],
        sitelinks: phase1Result.extensions.sitelinks.map((s: any) => ({
          text: s.text,
          category: 'GENERAL'
        })),
        callouts: phase1Result.extensions.callouts.map((c: any) => ({
          text: c,
          category: 'GENERAL'
        })),
        snippets: phase1Result.extensions.snippets.map((s: any) => ({
          text: s.values.join(', '),
          category: s.header.toUpperCase()
        })),
        affiliateUrl
      })
    };
    
    console.log('✅ FASE 1 RESULTADO:', {
      headlines: convertedResult.ads.headlines.length,
      descriptions: convertedResult.ads.descriptions.length,
      sitelinks: convertedResult.extensions.sitelinks.length,
      validation: phase1Result.csvFiles.metadata?.validation?.isValid
    });
    
    return convertedResult;
  }

  /**
   * GERA KEYWORDS (MINÚSCULA + MAIÚSCULA)
   */
  private generateKeywords(data: LuizCampaignData): Array<{
    keyword: string;
    matchType: 'BROAD';
    case: 'lowercase' | 'uppercase';
  }> {
    return [
      {
        keyword: data.productName.toLowerCase(),
        matchType: 'BROAD',
        case: 'lowercase'
      },
      {
        keyword: data.productName.toUpperCase(),
        matchType: 'BROAD', 
        case: 'uppercase'
      }
    ];
  }

  /**
   * GERA HEADLINES (7 FIXAS + 8 CATEGORIA MIX)
   */
  private generateHeadlines(data: LuizCampaignData): string[] {
    const headlines: string[] = [];

    // FIXAS 1-7
    this.TEMPLATES.FIXED_HEADLINES.forEach(template => {
      headlines.push(this.replaceVariables(template, data));
    });

    // 8-15: Mix de categorias (2 de cada categoria principais)
    const categories = ['SAVINGS', 'CTA', 'SCARCITY', 'DELIVERY'] as const;
    
    categories.forEach(category => {
      const categoryTemplates = this.TEMPLATES.CATEGORY_HEADLINES[category];
      // Pega 2 templates aleatórios de cada categoria
      const selected = this.getRandomItems(categoryTemplates, 2);
      selected.forEach(template => {
        headlines.push(this.replaceVariables(template, data));
      });
    });

    // Garante máximo 15 headlines
    return headlines.slice(0, 15);
  }

  /**
   * GERA DESCRIPTIONS (ATÉ 4, SEMPRE COM NOME DO PRODUTO)
   */
  private generateDescriptions(data: LuizCampaignData): string[] {
    const descriptions: string[] = [];
    
    // Pega 4 templates aleatórios
    const selected = this.getRandomItems(this.TEMPLATES.DESCRIPTIONS, 4);
    
    selected.forEach(template => {
      descriptions.push(this.replaceVariables(template, data));
    });

    return descriptions;
  }

  /**
   * GERA SITELINKS (ATÉ 6, MIX DE CATEGORIAS)
   */
  private generateSitelinks(data: LuizCampaignData): Array<{ text: string; category: string }> {
    const sitelinks: Array<{ text: string; category: string }> = [];
    const categories = Object.keys(this.TEMPLATES.SITELINKS) as Array<keyof typeof this.TEMPLATES.SITELINKS>;
    
    categories.forEach(category => {
      const templates = this.TEMPLATES.SITELINKS[category];
      const selected = this.getRandomItems(templates, 1); // 1 de cada categoria
      selected.forEach(template => {
        sitelinks.push({
          text: this.replaceVariables(template, data),
          category
        });
      });
    });

    return sitelinks.slice(0, 6);
  }

  /**
   * GERA CALLOUTS (4-10, MIX DE CATEGORIAS)
   */
  private generateCallouts(data: LuizCampaignData): Array<{ text: string; category: string }> {
    const callouts: Array<{ text: string; category: string }> = [];
    const categories = Object.keys(this.TEMPLATES.CALLOUTS) as Array<keyof typeof this.TEMPLATES.CALLOUTS>;
    
    categories.forEach(category => {
      const templates = this.TEMPLATES.CALLOUTS[category];
      const selected = this.getRandomItems(templates, 2); // 2 de cada categoria
      selected.forEach(template => {
        callouts.push({
          text: this.replaceVariables(template, data),
          category
        });
      });
    });

    return callouts.slice(0, 10);
  }

  /**
   * GERA STRUCTURED SNIPPETS (ATÉ 10)
   */
  private generateSnippets(data: LuizCampaignData): Array<{ text: string; category: string }> {
    const snippets: Array<{ text: string; category: string }> = [];
    const categories = Object.keys(this.TEMPLATES.SNIPPETS) as Array<keyof typeof this.TEMPLATES.SNIPPETS>;
    
    categories.forEach(category => {
      const templates = this.TEMPLATES.SNIPPETS[category];
      const selected = this.getRandomItems(templates, 1); // 1 de cada categoria
      selected.forEach(template => {
        snippets.push({
          text: this.replaceVariables(template, data),
          category
        });
      });
    });

    return snippets.slice(0, 10);
  }

  /**
   * SUBSTITUI VARIÁVEIS DINÂMICAS
   */
  private replaceVariables(template: string, data: LuizCampaignData): string {
    return template
      .replace(/\[PDTO\]/g, data.productName)
      .replace(/\[GUARANTEE\]/g, data.guarantee.toString())
      .replace(/\[UNIT_PRICE\]/g, data.unitPrice.toString())
      .replace(/\[DISCOUNT%\]/g, `${data.discountPercent}%`)
      .replace(/\[VALUE_DISCOUNT\]/g, data.valueDiscount.toString())
      .replace(/\[Unite Value\]/g, data.unitPrice.toString())
      .replace(/\{Location \(City\):US\}/g, data.country)
      .replace(/\{LOCATION\(City\)\}/g, data.country);
  }

  /**
   * GERA ARQUIVOS CSV PARA GOOGLE ADS EDITOR (IMPLEMENTAÇÃO SIMPLES)
   */
  private generateCSVFiles(data: any): any {
    // Implementação básica para evitar erros
    return {
      campaignStructure: 'Campaign,Campaign Type,Status,Budget,Budget Type,Bid Strategy,Target CPA,Currency,Target Locations,Excluded Locations\n' + 
        `${data.campaign.name},Search,Active,${data.campaign.budget},Daily,Target CPA,${data.campaign.targetCpa || 20},${data.campaign.currency || 'USD'},"${(data.campaign.locations || ['PL']).join('; ')}","${(data.campaign.excludedLocations || ['Brasil', 'Brazil', 'Índia', 'India', 'Vietnã', 'Vietnam', 'Indonésia', 'Indonesia', 'China', 'Nigéria', 'Nigeria', 'Rússia', 'Russia', 'Venezuela', 'Colômbia', 'Colombia']).join('; ')}"`,
      keywords: 'Keyword,Match Type,Status\n' + data.keywords.map((k: any) => `${k.keyword},Broad,Active`).join('\n'),
      ads: 'Headlines,Descriptions\n' + `"${data.headlines.join(', ')}","${data.descriptions.join(', ')}"`,
      sitelinks: 'Sitelink,Category\n' + data.sitelinks.map((s: any) => `${s.text},${s.category}`).join('\n'),
      callouts: 'Callout,Category\n' + data.callouts.map((c: any) => `${c.text},${c.category}`).join('\n'),
      snippets: 'Snippet,Category\n' + data.snippets.map((s: any) => `${s.text},${s.category}`).join('\n')
    };
  }

  // UTILITY FUNCTIONS

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private getCountryCode(country: string): string {
    const codes: Record<string, string> = {
      'Brasil': 'BR',
      'Hungary': 'HU',
      'Poland': 'PL',
      'United States': 'US',
      'Germany': 'DE',
      'France': 'FR'
    };
    return codes[country] || country.substring(0, 2).toUpperCase();
  }
}

// Export singleton
export const luizCampaignGenerator = new LuizCampaignGenerator();