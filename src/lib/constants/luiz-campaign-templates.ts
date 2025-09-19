/**
 * LUIZ CAMPAIGN TEMPLATES - CAMPANHAS & PERFORMANCE TF
 * Templates EXATOS baseados no modelo oficial do Luiz
 * Estrutura: 7 FIXOS + Dinâmicos + COD específicos
 */

export interface LuizTemplate {
  id: string
  type: 'FIXO' | 'DINAMICO' | 'COD'
  category: string
  template: string
  maxCharacters: number
  comments?: string
}

// ✅ 7 HEADLINES FIXOS - SEMPRE APARECEM
export const LUIZ_HEADLINES_FIXOS: LuizTemplate[] = [
  {
    id: 'fixo_1',
    type: 'FIXO',
    category: 'PRODUCT',
    template: '{KeyWord:} [PDTO] + Online Store',
    maxCharacters: 30,
    comments: 'Recurso Google Ads'
  },
  {
    id: 'fixo_2',
    type: 'FIXO',
    category: 'CTA',
    template: '[PDTO] Order Now',
    maxCharacters: 30
  },
  {
    id: 'fixo_3',
    type: 'FIXO',
    category: 'CTA',
    template: '[PDTO] Buy Now',
    maxCharacters: 30
  },
  {
    id: 'fixo_4',
    type: 'FIXO',
    category: 'SAVINGS',
    template: '[PDTO] Special Offer',
    maxCharacters: 30
  },
  {
    id: 'fixo_5',
    type: 'FIXO',
    category: 'SAVINGS',
    template: '[PDTO] Save Up To [VALUE DISCOUNT]',
    maxCharacters: 30
  },
  {
    id: 'fixo_6',
    type: 'FIXO',
    category: 'SAVINGS',
    template: '[PDTO] Biggest Discount',
    maxCharacters: 30
  },
  {
    id: 'fixo_7',
    type: 'FIXO',
    category: 'CTA',
    template: '[PDTO] Get Your Offer',
    maxCharacters: 30
  }
]

// ✅ HEADLINES DINÂMICOS - IA ESCOLHE OS 8 MELHORES
export const LUIZ_HEADLINES_DINAMICOS: LuizTemplate[] = [
  {
    id: 'din_1',
    type: 'DINAMICO',
    category: 'DELIVERY',
    template: '[Delivery] Shipping to {Location (City):US}',
    maxCharacters: 30,
    comments: 'Recurso Google Ads'
  },
  {
    id: 'din_2',
    type: 'DINAMICO',
    category: 'GUARANTEE',
    template: '[GUARANTEE]-Day Money Back Guarantee',
    maxCharacters: 30
  },
  {
    id: 'din_3',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Only [UNIT PRICE]Per Bottle Today',
    maxCharacters: 30
  },
  {
    id: 'din_4',
    type: 'DINAMICO',
    category: 'SCARCITY',
    template: 'Order Now While Suplies Last',
    maxCharacters: 30
  },
  {
    id: 'din_5',
    type: 'DINAMICO',
    category: 'CTA',
    template: 'Start Your Order NOw',
    maxCharacters: 30
  },
  {
    id: 'din_6',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: '6 Bottes Pack At [UNIT PRICE] Each',
    maxCharacters: 30
  },
  {
    id: 'din_7',
    type: 'DINAMICO',
    category: 'PRODUCT',
    template: 'FDA Approved And GMP Certified',
    maxCharacters: 30
  },
  {
    id: 'din_8',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: '[PDTO] Insane Factory Sale',
    maxCharacters: 30
  },
  {
    id: 'din_9',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Special Offer To {LOCATION(City)}',
    maxCharacters: 30
  },
  {
    id: 'din_10',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Hottest Deal At 2025 | Get Now',
    maxCharacters: 30
  },
  {
    id: 'din_11',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: '[PDTO] | Save [DISCOUNT%] Today',
    maxCharacters: 30
  },
  {
    id: 'din_12',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: '[PDTO] | Best Offer Here',
    maxCharacters: 30
  },
  {
    id: 'din_13',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Save Big Per Bottle Today',
    maxCharacters: 30
  },
  {
    id: 'din_14',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Ridiculous Offer, Enjoy Now',
    maxCharacters: 30
  },
  {
    id: 'din_15',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Huge Discount Running Now',
    maxCharacters: 30
  },
  {
    id: 'din_16',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: '[PDTO] | Get [DISCOUNT%] Off',
    maxCharacters: 30
  },
  {
    id: 'din_17',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: '[PDTO] | Half Price Offer',
    maxCharacters: 30
  },
  {
    id: 'din_18',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: '[PDTO] | Save [DISCOUNT%]',
    maxCharacters: 30
  },
  {
    id: 'din_19',
    type: 'DINAMICO',
    category: 'PRODUCT',
    template: 'Direct From Factory',
    maxCharacters: 30
  },
  {
    id: 'din_20',
    type: 'DINAMICO',
    category: 'SCARCITY',
    template: 'Last Hours Offer, Act Now',
    maxCharacters: 30
  },
  {
    id: 'din_21',
    type: 'DINAMICO',
    category: 'DELIVERY',
    template: '[Delivery] Delivery',
    maxCharacters: 30
  },
  {
    id: 'din_22',
    type: 'DINAMICO',
    category: 'GUARANTEE',
    template: '[Guarantee]Days to Try With Money Back',
    maxCharacters: 30
  }
]

// ✅ HEADLINES COD - APENAS PARA CAMPANHA COD (devem estar entre os 8 dinâmicos quando COD)
export const LUIZ_HEADLINES_COD: LuizTemplate[] = [
  {
    id: 'cod_1',
    type: 'COD',
    category: 'COD',
    template: 'Ship Now, Pay Later',
    maxCharacters: 30,
    comments: 'APENAS PARA CAMPANHA COD'
  },
  {
    id: 'cod_2',
    type: 'COD',
    category: 'COD',
    template: 'Pay Only When Delivered',
    maxCharacters: 30,
    comments: 'APENAS PARA CAMPANHA COD'
  },
  {
    id: 'cod_3',
    type: 'COD',
    category: 'COD',
    template: 'Buy Now, Pay on Delivery',
    maxCharacters: 30,
    comments: 'APENAS PARA CAMPANHA COD'
  },
  {
    id: 'cod_4',
    type: 'COD',
    category: 'COD',
    template: 'Order Now, Pay Later',
    maxCharacters: 30,
    comments: 'APENAS PARA CAMPANHA COD'
  },
  {
    id: 'cod_5',
    type: 'COD',
    category: 'COD',
    template: 'Get It First, Pay Later',
    maxCharacters: 30,
    comments: 'APENAS PARA CAMPANHA COD'
  }
]

// ✅ DESCRIPTIONS (Máximo 4)
export const LUIZ_DESCRIPTIONS: LuizTemplate[] = [
  {
    id: 'desc_1',
    type: 'DINAMICO',
    category: 'GUARANTEE & SAVINGS',
    template: 'Order [PDTO] Here On Website With [GUARANTEE] Days Guarantee. Best Value Pack [Unite Value]/Bottle Now',
    maxCharacters: 90
  },
  {
    id: 'desc_2',
    type: 'DINAMICO',
    category: 'GUARANTEE & SAVINGS',
    template: 'Buy [PDTO] Today & Get [VALUE DISCOUNT] Off With [GUARANTEE]-Day Money Back Guarantee + [Delivery] Shipping',
    maxCharacters: 90
  },
  {
    id: 'desc_3',
    type: 'DINAMICO',
    category: 'PRODUCT',
    template: '[PDTO]: #1 Voted Product. 100% Pure & Natural With [Delivery] Shipping.',
    maxCharacters: 90
  },
  {
    id: 'desc_4',
    type: 'DINAMICO',
    category: 'SAVINGS & DELIVERY',
    template: 'Get [PDTO] Now For Over [DISCOUNT%] Off And [Delivery] Delivery! Don\'t Miss Out On Savings',
    maxCharacters: 90
  },
  {
    id: 'desc_5',
    type: 'DINAMICO',
    category: 'CAT & GUARANTEE',
    template: 'You Can Try [PDTO] For [GUARANTEE]Days With Your Money Back Guarantee, Get It Before It\'s Gone',
    maxCharacters: 90
  },
  {
    id: 'desc_6',
    type: 'DINAMICO',
    category: 'CAT & GUARANTEE',
    template: '[PDTO] With [Delivery] Shipping. Get [Guarantee] day 100% Guarantee',
    maxCharacters: 90
  },
  {
    id: 'desc_7',
    type: 'DINAMICO',
    category: 'PRODUCT',
    template: '100% Organic And Premium Ingredients. 100% Safe And Secure. Order Now',
    maxCharacters: 90
  },
  {
    id: 'desc_8',
    type: 'DINAMICO',
    category: 'CTA & SAVINGS & DELIVERY',
    template: 'Buy [PDTO] for only [Unite Value]/Bottle + [Delivery] Shipping To Your Door',
    maxCharacters: 90
  },
  {
    id: 'desc_9',
    type: 'DINAMICO',
    category: 'CTA & SAVINGS',
    template: 'Run And Enjoy The Last Hours With [DISCOUNT%] Off. Best Price On The Web',
    maxCharacters: 90
  }
]

// ✅ SITELINKS (Até 6)
export const LUIZ_SITELINKS: LuizTemplate[] = [
  {
    id: 'site_1',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Where To Buy [PDTO]',
    maxCharacters: 25
  },
  {
    id: 'site_2',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: '[PDTO] is Only Available for',
    maxCharacters: 35
  },
  {
    id: 'site_3',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Purchase On Website',
    maxCharacters: 35
  },
  {
    id: 'site_4',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Half Price Offer',
    maxCharacters: 25
  },
  {
    id: 'site_5',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Big Sale in Progress',
    maxCharacters: 35
  },
  {
    id: 'site_6',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Get [DISCOUNT%] Off',
    maxCharacters: 35
  }
  // ... continue with all sitelinks from the model
]

// ✅ CALLOUTS (4-10)
export const LUIZ_CALLOUTS: LuizTemplate[] = [
  {
    id: 'call_1',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Only [UNIT PRICE] Per Bottle Today',
    maxCharacters: 25
  },
  {
    id: 'call_2',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Save Up To [VALUE DISCOUNT]',
    maxCharacters: 25
  },
  {
    id: 'call_3',
    type: 'DINAMICO',
    category: 'CTA',
    template: '[PDTO] Order Now',
    maxCharacters: 25
  }
  // ... continue with all callouts
]

// ✅ SNIPPETS (Até 10)
export const LUIZ_SNIPPETS: LuizTemplate[] = [
  {
    id: 'snip_1',
    type: 'DINAMICO',
    category: 'SAVINGS',
    template: 'Half Price Offer',
    maxCharacters: 25
  },
  {
    id: 'snip_2',
    type: 'DINAMICO',
    category: 'DELIVERY',
    template: 'Free Private Delivery',
    maxCharacters: 25
  }
  // ... continue with all snippets
]

// ✅ SISTEMA DE SUBSTITUIÇÃO DE VARIÁVEIS
export function substituteVariables(template: string, campaignData: any): string {
  return template
    .replace(/\[PDTO\]/g, campaignData.productName || 'Product')
    .replace(/\[GUARANTEE\]/g, campaignData.guaranteePeriod || '30')
    .replace(/\[VALUE DISCOUNT\]/g, campaignData.discountAmount ? `$${campaignData.discountAmount}` : '$50')
    .replace(/\[DISCOUNT%\]/g, campaignData.discountPercentage ? `${campaignData.discountPercentage}%` : '50%')
    .replace(/\[UNIT PRICE\]/g, campaignData.productPrice ? `$${campaignData.productPrice}` : '$29')
    .replace(/\[Delivery\]/g, campaignData.deliveryType || 'Free')
    .replace(/\[Unite Value\]/g, campaignData.productPrice ? `$${campaignData.productPrice}` : '$29')
    .replace(/\{KeyWord:\}/g, campaignData.productName || 'Product')
    .replace(/\{Location \(City\):US\}/g, campaignData.targetCountry || 'US')
    .replace(/\{LOCATION\(City\)\}/g, campaignData.targetCountry || 'US')
}