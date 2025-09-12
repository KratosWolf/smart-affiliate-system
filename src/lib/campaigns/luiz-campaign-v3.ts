/**
 * METODOLOGIA LUIZ v3 - FASE 1 IMPLEMENTADA
 * Headlines inteligentes contextuais sem APIs externas
 */

import { ProductValidationResponse } from '@/types';
import { smartFixedHeadlines, SmartHeadlineConfig } from './smart-headlines';

export interface LuizCampaignConfigV3 {
  // Dados essenciais
  productName: string;
  platform: 'CLICKBANK' | 'MONETIZZE' | 'HOTMART' | 'EDUZZ' | 'BUYGOODS' | 'MAXWEB' | 'GURUMIDIA' | 'SMARTADV' | 'DIGISTORE24' | 'ADCOMBO' | 'DRCASH' | 'MIDIA_SCALERS' | 'SMASH_LOUD' | 'OUTROS';
  commissionValue: number;
  country: string;
  currency: 'BRL' | 'USD';
  producerPageUrl: string;
  affiliateUrl: string;
  presellUrl?: string;
  
  // EDIS Tracking
  useEdisTracking?: boolean;
  edisBaseUrl?: string;
  
  // Dados contextuais opcionais (FASE 1)
  discountPercentage?: number;
  discountAmount?: number;
  productPrice?: number;
  guaranteePeriod?: string;
  deliveryType?: string;
}

export class LuizCampaignGeneratorV3 {
  
  /**
   * MÉTODO PRINCIPAL - Gera campanha completa com FASE 1
   */
  async generateCampaign(config: LuizCampaignConfigV3): Promise<{
    campaign: any;
    keywords: any[];
    ads: any[];
    extensions: any;
    csvFiles: any;
  }> {
    // FASE 1: Gera conteúdo inteligente sem APIs externas
    const smartContent = this.generateSmartContent(config);
    
    // Gera dados da campanha
    const campaignName = this.generateCampaignName(config);
    const budget = this.calculateDailyBudget(config);
    const targetCPA = this.calculateTargetCPA(config);

    return {
      campaign: {
        name: campaignName,
        budget: budget,
        budgetType: 'Daily',
        currency: config.currency,
        targetCPA: targetCPA,
        biddingStrategy: 'Target CPA',
        networks: 'Google Search',
        campaignSubtype: 'STANDARD_SEARCH',
        targetNewCustomers: false,
        locations: [config.country],
        excludedLocations: [
          'Brasil', 'Brazil', 'Índia', 'India', 'Vietnã', 'Vietnam', 
          'Indonésia', 'Indonesia', 'China', 'Nigéria', 'Nigeria', 
          'Rússia', 'Russia', 'Venezuela', 'Colômbia', 'Colombia'
        ],
        languages: [],
        status: 'Enabled'
      },
      keywords: smartContent.keywords,
      ads: [{
        type: 'Responsive Search Ad',
        headlines: smartContent.headlines,
        descriptions: smartContent.descriptions,
        finalUrl: this.generateFinalUrl(config),
        displayUrl: this.generateDisplayUrl(config),
        path1: config.productName.substring(0, 15),
        path2: 'Oficial'
      }],
      extensions: {
        sitelinks: smartContent.sitelinks,
        callouts: smartContent.callouts,
        snippets: smartContent.snippets
      },
      csvFiles: {
        ready: true,
        metadata: smartContent.metadata
      }
    };
  }

  /**
   * FASE 1: Gera conteúdo inteligente sem APIs externas
   */
  private generateSmartContent(config: LuizCampaignConfigV3) {
    const smartConfig: SmartHeadlineConfig = {
      productName: config.productName,
      country: config.country,
      currency: config.currency,
      discountPercentage: config.discountPercentage,
      discountAmount: config.discountAmount,
      guaranteePeriod: config.guaranteePeriod,
      deliveryType: config.deliveryType,
      platform: config.platform,
      commissionValue: config.commissionValue
    };
    
    return smartFixedHeadlines.generateSmartHeadlines(smartConfig);
  }

  /**
   * Gera nome da campanha com TODOS os componentes
   */
  private generateCampaignName(config: LuizCampaignConfigV3): string {
    const date = new Date().toISOString().split('T')[0];
    const commission = config.currency === 'BRL' 
      ? `R$${config.commissionValue.toFixed(0)}` 
      : `$${config.commissionValue.toFixed(0)}`;
    
    return `${config.productName} - ${config.country} - ${date} - ${config.platform} - ${commission}`;
  }

  /**
   * Calcula orçamento diário baseado na moeda
   */
  private calculateDailyBudget(config: LuizCampaignConfigV3): number {
    if (config.currency === 'BRL') {
      return 350; // Mínimo R$ 350/dia
    } else {
      return 70; // Mínimo $70/dia
    }
  }

  /**
   * Calcula CPA alvo: 45% da comissão
   */
  private calculateTargetCPA(config: LuizCampaignConfigV3): number {
    return config.commissionValue * 0.45;
  }

  /**
   * Gera URL final com tracking Edis opcional
   */
  private generateFinalUrl(config: LuizCampaignConfigV3): string {
    const baseUrl = config.presellUrl || config.affiliateUrl;
    
    if (!config.useEdisTracking || !config.edisBaseUrl) {
      return baseUrl;
    }

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

    const finalUrl = `${edisUrl}?${edisParams}&redirect=${encodeURIComponent(baseUrl)}`;
    
    console.log('🔗 URL com tracking Edis:', finalUrl);
    return finalUrl;
  }

  /**
   * Gera display URL
   */
  private generateDisplayUrl(config: LuizCampaignConfigV3): string {
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
}

export const luizCampaignV3 = new LuizCampaignGeneratorV3();