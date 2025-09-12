import { z } from 'zod'
import { CampaignResponse, CampaignParams, CampaignData } from '../types'

const CampaignSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  budget: z.number().positive(),
  targetCpa: z.number().positive(),
  locations: z.array(z.string()).default([]),
  status: z.enum(['draft', 'active', 'paused', 'completed'])
}).passthrough() // Allow extra fields

const CampaignDataSchema = z.object({
  campaign: CampaignSchema,
  keywords: z.array(z.any()).default([]),
  ads: z.array(z.any()).default([]),
  csvData: z.any().optional()
}).passthrough() // Allow extra fields

const CampaignResponseSchema = z.object({
  success: z.boolean(),
  data: CampaignDataSchema.optional(),
  error: z.string().optional()
})

const CampaignParamsSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  targetCountry: z.string().min(1, 'Target country is required'),
  budgetRange: z.string().min(1, 'Budget range is required'),
  targetCpa: z.string().min(1, 'Target CPA is required'),
  description: z.string().optional(),
  // Platform and commission fields
  platform: z.string().optional(),
  commissionValue: z.number().optional(),
  currency: z.enum(['BRL', 'USD']).optional(),
  // Tracking fields
  useEdisTracking: z.boolean().optional(),
  edisBaseUrl: z.string().optional(),
  // Phase 1 contextual fields - CRÍTICOS para funcionamento!
  discountPercentage: z.number().optional(),
  discountAmount: z.number().optional(),
  productPrice: z.number().optional(), // FIXED: Missing field was blocking Phase 1!
  guaranteePeriod: z.string().optional(),
  deliveryType: z.string().optional()
}).passthrough() // Allow extra fields para compatibilidade

export function validateCampaignResponse(data: unknown): CampaignResponse | null {
  try {
    return CampaignResponseSchema.parse(data)
  } catch (error) {
    console.error('Campaign response validation failed:', error)
    console.error('Data received:', JSON.stringify(data, null, 2))
    if (error instanceof Error && 'issues' in error) {
      console.error('Validation issues:', (error as any).issues)
    }
    return null
  }
}

export function validateCampaignParams(params: unknown): CampaignParams | null {
  try {
    return CampaignParamsSchema.parse(params)
  } catch (error) {
    console.error('Campaign params validation failed:', error)
    return null
  }
}

export function validateCampaignData(data: unknown): CampaignData | null {
  try {
    return CampaignDataSchema.parse(data)
  } catch (error) {
    console.error('Campaign data validation failed:', error)
    return null
  }
}

export function createSafeCampaignAccess(data: any) {
  console.log('🔍 SafeAccess received data:', data)
  
  return {
    getCampaignName: () => {
      const name = data?.campaign?.name || data?.data?.campaign?.name || 'N/A'
      console.log('getCampaignName:', name)
      return name
    },
    getCampaignBudget: () => {
      const budget = data?.campaign?.budget || data?.data?.campaign?.budget || 0
      console.log('getCampaignBudget:', budget)
      return budget
    },
    getCampaignLocations: () => {
      const locations = data?.campaign?.locations || data?.data?.campaign?.locations || []
      const result = Array.isArray(locations) ? locations.join(', ') : 'N/A'
      console.log('getCampaignLocations:', result)
      return result
    },
    getKeywordCount: () => {
      const keywords = data?.keywords || data?.data?.keywords || []
      const count = Array.isArray(keywords) ? keywords.length : 0
      console.log('getKeywordCount:', count)
      return count
    },
    getAdCount: () => {
      const ads = data?.ads || data?.data?.ads || []
      const count = Array.isArray(ads) ? ads.length : 0
      console.log('getAdCount:', count)
      return count
    },
    hasValidData: () => {
      const hasData = data !== null && (data.campaign || data.data?.campaign)
      console.log('hasValidData:', hasData)
      return hasData
    }
  }
}