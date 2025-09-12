/**
 * METODOLOGIA LUIZ v2 - ATUALIZADA COM FASE 1
 * Headlines inteligentes sem APIs externas
 */

import { ProductValidationResponse } from '@/types';
import { smartFixedHeadlines, SmartHeadlineConfig } from './smart-headlines';

export interface LuizCampaignConfigV2 {
  // Dados essenciais
  productName: string;
  platform: 'CLICKBANK' | 'MONETIZZE' | 'HOTMART' | 'EDUZZ' | 'OUTROS';
  commissionValue: number; // Valor da comissão em reais
  country: string;
  currency: 'BRL' | 'USD';
  producerPageUrl: string;
  affiliateUrl: string;
  presellUrl?: string;
  // EDIS Tracking
  useEdisTracking?: boolean;
  edisBaseUrl?: string; // Ex: www.test.com
}

export class LuizCampaignGeneratorV2 {
  
  /**
   * Gera nome da campanha com TODOS os componentes
   */
  private generateCampaignName(config: LuizCampaignConfigV2): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const commission = config.currency === 'BRL' 
      ? `R$${config.commissionValue.toFixed(0)}` 
      : `$${config.commissionValue.toFixed(0)}`;
    
    // Formato: [PRODUTO] - [PAÍS] - [DATA] - [PLATAFORMA] - [COMISSÃO]
    return `${config.productName} - ${config.country} - ${date} - ${config.platform} - ${commission}`;
  }

  /**
   * Calcula orçamento diário baseado na moeda da conta
   */
  private calculateDailyBudget(config: LuizCampaignConfigV2): number {
    if (config.currency === 'BRL') {
      return 350; // Mínimo R$ 350/dia
    } else {
      // Converte para USD (assumindo taxa de 5:1)
      return 70; // Mínimo $70/dia
    }
  }

  /**
   * Calcula CPA alvo: 40-50% da comissão
   */
  private calculateTargetCPA(config: LuizCampaignConfigV2): number {
    // Usa 45% como padrão (meio termo entre 40-50%)
    return config.commissionValue * 0.45;
  }

  /**
   * Gera keywords: Nome do produto em MAIÚSCULA e minúscula
   */
  private generateKeywords(productName: string): Array<{keyword: string, matchType: string}> {
    return [
      { keyword: productName.toUpperCase(), matchType: 'BROAD' },
      { keyword: productName.toLowerCase(), matchType: 'BROAD' }
    ];
  }

  /**
   * FASE 1: Gera conteúdo inteligente sem APIs externas
   */
  private generateSmartContent(config: LuizCampaignConfigV2) {
    const smartConfig: SmartHeadlineConfig = {
      productName: config.productName,
      country: config.country,
      currency: config.currency,
      discountPercentage: (config as any).discountPercentage,
      discountAmount: (config as any).discountAmount,
      guaranteePeriod: (config as any).guaranteePeriod,
      deliveryType: (config as any).deliveryType,
      platform: config.platform,
      commissionValue: config.commissionValue
    };
    
    return smartFixedHeadlines.generateSmartHeadlines(smartConfig);
  }

  /**
   * Gera headlines inteligentes baseadas na análise
   */
  private async generateSmartHeadlines(
    config: LuizCampaignConfigV2,
    analysis: any
  ): Promise<string[]> {
    const product = config.productName;
    const discount = analysis.discount || '50%';
    const guarantee = analysis.guarantee || '30 dias';
    
    // PRIMEIRA HEADLINE OBRIGATÓRIA - formato do print
    const mandatoryFirstHeadline = `{KeyWord:${product} Online Store}`;
    
    // Headlines fixas 2-7 (após a obrigatória)
    const fixedHeadlines = [
      mandatoryFirstHeadline, // SEMPRE a primeira
      `${product} Site Oficial`,
      `${product} Comprar Agora`,
      `${product} Oferta Especial`,
      `${product} Desconto ${discount}`,
      `${product} Melhor Preço`,
      `${product} Original`
    ];

    // Headlines variáveis 8-15 (baseadas na análise)
    const variableHeadlines = [
      `Economize ${discount} Hoje`,
      `Garantia de ${guarantee}`,
      'Entrega Imediata',
      'Últimas Unidades',
      'Frete Grátis Brasil',
      'Compra 100% Segura',
      'Satisfação Garantida',
      'Aprovado pela ANVISA'
    ];

    return [...fixedHeadlines, ...variableHeadlines].slice(0, 15);
  }

  /**
   * Gera descriptions inteligentes
   */
  private generateSmartDescriptions(
    config: LuizCampaignConfigV2,
    analysis: any
  ): string[] {
    const product = config.productName;
    const platform = config.platform;
    
    return [
      `${product} original com garantia. Entrega imediata após aprovação. Site oficial autorizado.`,
      `Compre ${product} com segurança. Pagamento protegido ${platform}. Satisfação garantida ou seu dinheiro de volta.`,
      `Oferta especial ${product} por tempo limitado. Frete grátis para todo Brasil. Compre agora!`,
      `${product} com resultado comprovado. ${analysis.guarantee} de garantia. Aproveite o desconto hoje.`
    ];
  }

  /**
   * Seleciona extensões inteligentes baseadas no produto
   */
  private selectSmartExtensions(
    config: LuizCampaignConfigV2,
    analysis: any
  ): {
    sitelinks: Array<{text: string, description1: string, description2: string}>,
    callouts: string[],
    snippets: Array<{header: string, values: string[]}>
  } {
    // Sitelinks adaptados
    const sitelinks = [
      {
        text: 'Oferta Especial',
        description1: `Desconto de ${analysis.discount}`,
        description2: 'Por tempo limitado'
      },
      {
        text: 'Garantia Total',
        description1: `${analysis.guarantee} de garantia`,
        description2: 'Satisfação garantida'
      },
      {
        text: 'Frete Grátis',
        description1: 'Entrega rápida',
        description2: 'Para todo Brasil'
      },
      {
        text: 'Compre Agora',
        description1: 'Estoque limitado',
        description2: 'Aproveite hoje'
      }
    ];

    // Callouts baseados nos benefícios encontrados
    const callouts = analysis.benefits.slice(0, 6);

    // Snippets estruturados
    const snippets = [
      {
        header: 'Benefícios',
        values: analysis.benefits.slice(0, 3)
      },
      {
        header: 'Garantias',
        values: ['Devolução', 'Qualidade', 'Originalidade']
      }
    ];

    return { sitelinks, callouts, snippets };
  }

  /**
   * MÉTODO PRINCIPAL - Gera campanha completa v2
   */
  async generateCampaign(config: LuizCampaignConfigV2): Promise<{
    campaign: any;
    keywords: any[];
    ads: any[];
    extensions: any;
    csvFiles: any;
  }> {
    // Analisa página do produtor
    const pageAnalysis = await (this as any).analyzeProducerPage(config.producerPageUrl);
    
    // Gera componentes inteligentes
    const campaignName = this.generateCampaignName(config);
    const budget = this.calculateDailyBudget(config);
    const targetCPA = this.calculateTargetCPA(config);
    const keywords = this.generateKeywords(config.productName);
    const headlines = await this.generateSmartHeadlines(config, pageAnalysis);
    const descriptions = this.generateSmartDescriptions(config, pageAnalysis);
    const extensions = this.selectSmartExtensions(config, pageAnalysis);

    return {
      campaign: {
        name: campaignName,
        budget: budget,
        budgetType: 'Daily',
        currency: config.currency,
        targetCPA: targetCPA, // Para referência, mas não usado na estratégia
        biddingStrategy: 'Target CPA', // VOLTA AO CPA - confirmado pelo usuário
        networks: 'Google Search', // SEM Rede de Parceiros e SEM Display
        campaignSubtype: 'STANDARD_SEARCH', // Rede de pesquisa com visitas ao site
        targetNewCustomers: false, // NÃO para novos clientes
        locations: [config.country],
        excludedLocations: [
          'Brasil', 'Brazil', 'Índia', 'India', 'Vietnã', 'Vietnam', 
          'Indonésia', 'Indonesia', 'China', 'Nigéria', 'Nigeria', 
          'Rússia', 'Russia', 'Venezuela', 'Colômbia', 'Colombia'
        ],
        languages: [], // Qualquer idioma - não restringir
        status: 'Enabled'
      },
      keywords: keywords,
      ads: [{
        type: 'Responsive Search Ad',
        headlines: headlines,
        descriptions: descriptions,
        finalUrl: this.generateFinalUrl(config),
        displayUrl: this.generateDisplayUrl(config),
        path1: config.productName.substring(0, 15),
        path2: 'Oficial'
      }],
      extensions: extensions,
      csvFiles: {
        // Será gerado pelo csv-export-advanced.ts
        ready: true
      }
    };
  }

  /**
   * Gera URL final com tracking Edis
   */
  private generateFinalUrl(config: LuizCampaignConfigV2): string {
    const baseUrl = config.presellUrl || config.affiliateUrl;
    
    if (!config.useEdisTracking || !config.edisBaseUrl) {
      return baseUrl;
    }

    // Monta URL com parâmetros Edis
    const edisUrl = config.edisBaseUrl.startsWith('http') 
      ? config.edisBaseUrl 
      : `https://${config.edisBaseUrl}`;

    const edisParams = [
      'campaignid={campaignid}',
      'keyword={keyword}', 
      'network={network}',
      'extensionid={extensionid}',
      'matchtype={matchtype}',
      'adgroupid={adgroupid}'
    ].join('&');

    // URL final com Edis tracking que redireciona para o affiliate
    const finalUrl = `${edisUrl}?${edisParams}&redirect=${encodeURIComponent(baseUrl)}`;
    
    console.log('🔗 URL com tracking Edis:', finalUrl);
    return finalUrl;
  }

  /**
   * Gera display URL baseado na URL de tracking
   */
  private generateDisplayUrl(config: LuizCampaignConfigV2): string {
    if (config.useEdisTracking && config.edisBaseUrl) {
      return config.edisBaseUrl.replace('https://', '').replace('http://', '');
    }
    
    const baseUrl = config.presellUrl || config.affiliateUrl;
    try {
      const domain = new URL(baseUrl).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'site-oficial.com';
    }
  }

  /**
   * Helpers
   */
  private getLanguageByCountry(country: string): string[] {
    const languages: {[key: string]: string[]} = {
      'Brasil': ['pt'],
      'Portugal': ['pt'],
      'Estados Unidos': ['en'],
      'United States': ['en'],
      'México': ['es'],
      'Espanha': ['es'],
      'França': ['fr'],
      'Alemanha': ['de']
    };
    return languages[country] || ['pt'];
  }

  private extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'site-oficial.com';
    }
  }
}

export const luizCampaignV2 = new LuizCampaignGeneratorV2();