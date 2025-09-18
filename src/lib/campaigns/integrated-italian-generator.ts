/**
 * Gerador Integrado para Campanha em Italiano
 * Combina detecção de idioma + templates italianos + fallback sistema
 */

import { getLanguageForCountry, ITALIAN_HEADLINES_TEMPLATES, ITALIAN_DESCRIPTIONS_TEMPLATES } from '@/lib/constants/languages'
import { getCurrencyForCountry } from '@/lib/constants/currencies'

export interface ItalianCampaignRequest {
  productName: string
  targetCountry: string
  productPrice?: number
  guaranteePeriod?: string
  deliveryType?: string
  discountPercentage?: number
  discountAmount?: number
}

export interface ItalianCampaignResult {
  headlines: string[]
  descriptions: string[]
  language: string
  currency: string
  csvData: {
    campaignStructure: string
    ads: string
    keywords: string
  }
}

export class IntegratedItalianGenerator {
  
  /**
   * Gera campanha completa em italiano com fallback garantido
   */
  generateItalianCampaign(request: ItalianCampaignRequest) {
    const language = getLanguageForCountry(request.targetCountry)
    const currency = getCurrencyForCountry(request.targetCountry)
    
    console.log(`🇮🇹 Gerando campanha para ${request.targetCountry}: idioma=${language}, moeda=${currency}`)
    
    // Gerar headlines em italiano
    let headlines: string[] = []
    
    if (request.targetCountry === 'IT' || language === 'it-IT') {
      // Templates específicos para Itália
      headlines = ITALIAN_HEADLINES_TEMPLATES.map(template => 
        template.replace(/\{product\}/g, request.productName)
      )
      
      // Adicionar headlines específicas com dados contextuais
      if (request.discountPercentage) {
        headlines.push(`${request.productName} Sconto ${request.discountPercentage}%`)
      }
      if (request.guaranteePeriod) {
        headlines.push(`${request.productName} Garanzia ${request.guaranteePeriod}`)
      }
      if (request.deliveryType) {
        headlines.push(`${request.productName} Spedizione Gratuita`)
      }
      
      console.log(`✅ Generated ${headlines.length} Italian headlines`)
    } else {
      // Fallback para inglês se não for Itália
      headlines = [
        `${request.productName} Buy Now`,
        `${request.productName} Official Store`,
        `${request.productName} Best Price`,
        `${request.productName} Special Offer`,
        `Order ${request.productName} Today`,
        `${request.productName} Free Shipping`,
        `Get ${request.productName} Now`
      ]
    }
    
    // Gerar descriptions em italiano
    let descriptions: string[] = []
    
    if (request.targetCountry === 'IT' || language === 'it-IT') {
      descriptions = ITALIAN_DESCRIPTIONS_TEMPLATES.map(template => 
        template.replace(/\{product\}/g, request.productName)
          .replace(/\{price\}/g, request.productPrice?.toString() || '49')
          .replace(/\{guarantee\}/g, request.guaranteePeriod || '30 giorni')
      )
      
      console.log(`✅ Generated ${descriptions.length} Italian descriptions`)
    } else {
      descriptions = [
        `Order ${request.productName} with guarantee. Official website.`,
        `Buy ${request.productName} safely. Protected payment.`,
        `${request.productName} Special offer for limited time. Free shipping.`,
        `${request.productName} proven results. Try today.`
      ]
    }
    
    // Gerar CSVs
    const csvData = this.generateCSVs({
      productName: request.productName,
      targetCountry: request.targetCountry,
      currency,
      headlines,
      descriptions
    })
    
    // Return in Luiz format for compatibility
    return {
      campaign: {
        name: `${request.productName} - ${request.targetCountry} Campaign`,
        budget: 350,
        targetCpa: 45,
        structure: '1_CAMPAIGN_1_AD'
      },
      ads: {
        headlines,
        descriptions
      },
      keywords: [
        { keyword: request.productName.toLowerCase(), case: 'lowercase', matchType: 'BROAD' },
        { keyword: request.productName.toUpperCase(), case: 'uppercase', matchType: 'BROAD' }
      ],
      extensions: {
        sitelinks: [],
        callouts: [],
        snippets: []
      },
      csvFiles: csvData,
      language,
      currency
    }
  }
  
  /**
   * Gera CSVs corretos com país e moeda
   */
  private generateCSVs(data: {
    productName: string
    targetCountry: string
    currency: string
    headlines: string[]
    descriptions: string[]
  }) {
    const campaignName = `${data.productName} - ${data.targetCountry} - 2025-09-14 - DRCASH - $84`
    
    return {
      campaignStructure: `Campaign,Campaign Type,Status,Budget,Budget Type,Bid Strategy,Target CPA,Currency,Target Locations,Excluded Locations
${campaignName},Search,Active,65,Daily,Target CPA,37.8,${data.currency},"${data.targetCountry}","Brasil; Brazil; Índia; India; Vietnã; Vietnam; Indonésia; Indonesia; China; Nigéria; Nigeria; Rússia; Russia; Venezuela; Colômbia; Colombia"`,
      
      ads: `Headlines,Descriptions
"${data.headlines.slice(0, 12).join(', ')}","${data.descriptions.join(', ')}"`,
      
      keywords: `Keyword,Match Type,Status
${data.productName.toLowerCase()},Broad,Active
${data.productName.toUpperCase()},Broad,Active`
    }
  }
}

// Export singleton
export const integratedItalianGenerator = new IntegratedItalianGenerator()