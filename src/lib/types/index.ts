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
  currency?: 'BRL' | 'USD'
  // Tracking fields
  useEdisTracking?: boolean
  edisBaseUrl?: string
  // Phase 1 contextual fields
  discountPercentage?: number
  discountAmount?: number
  productPrice?: number
  guaranteePeriod?: string
  deliveryType?: string
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