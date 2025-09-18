export interface Campaign {
  id: string
  name: string
  budget: number
  targetCpa: number
  locations: string[]
  status: CampaignStatus
  keywords?: Keyword[]
  ads?: Ad[]
}

export interface CampaignData {
  campaign: Campaign
  keywords: Keyword[]
  ads: Ad[]
  csvData?: Record<string, string>
  // NEW: Bilingual CSV data
  bilingualCsvData?: BilingualCsvData
}

// NEW: Bilingual CSV export structure
export interface BilingualCsvData {
  standardCsvs: {
    headlines: string
    descriptions: string
    sitelinks: string
    callouts: string
    snippets: string
  }
  consolidatedCsv: string
  targetLanguage: string
  countryCode: string
}

export interface CampaignResponse {
  success: boolean
  data?: CampaignData
  error?: string
}

export interface CampaignParams {
  productName: string
  targetCountry: string
  budgetRange: string
  targetCpa: string
  description?: string
  // Platform and commission fields
  platform?: string
  commissionValue?: number
  currency?: string
  // NEW FIELDS - Campaign Builder Redesign
  urlBase: string
  campaignType: 'Standard' | 'COD' | 'Review' | 'E-commerce' | 'Produto Restrito'
  // Tracking fields
  useEdisTracking?: boolean
  edisBaseUrl?: string
  // Phase 1 contextual fields
  discountPercentage?: number
  discountAmount?: number
  productPrice?: number
  guaranteePeriod?: string
  deliveryType?: string
  // Enhanced contextual fields
  packQuantity?: number
  packTotalPrice?: number
  returnPolicy?: string
  targetCity?: string
  excludedRegions?: string
  bonuses?: string
  scarcityType?: string
}

export interface Keyword {
  text: string
  matchType?: string
  cpc?: number
}

export interface Ad {
  headline: string
  description: string
  url?: string
}

// NEW: Enhanced ad components with categorization
export interface AdComponent {
  type: 'Headlines' | 'Descriptions' | 'Sitelinks' | 'Callouts' | 'Snippets'
  content_local: string
  characters: number
  category: 'Preço' | 'Urgência' | 'Escassez' | 'Confiança' | 'Benefício' | 'Promocional' | 'Informativo'
  content_en: string
  position: string
}

export interface SitelinkComponent {
  title: string
  description: string
  category: string
}

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed'

export interface PresellData {
  productName: string
  templateType: string
  content: string
  url?: string
}

export interface PresellResponse {
  success: boolean
  data?: PresellData
  error?: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}