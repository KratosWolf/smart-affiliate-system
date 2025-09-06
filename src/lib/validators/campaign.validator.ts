import { z } from 'zod'
import { CampaignResponse, CampaignParams, CampaignData } from '../types'

const CampaignSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  budget: z.number().positive(),
  targetCpa: z.number().positive(),
  locations: z.array(z.string()).default([]),
  status: z.enum(['draft', 'active', 'paused', 'completed']),
  keywords: z.array(z.object({
    text: z.string(),
    matchType: z.string().optional(),
    cpc: z.number().optional()
  })).optional(),
  ads: z.array(z.object({
    headline: z.string(),
    description: z.string(),
    url: z.string().optional()
  })).optional()
})

const CampaignDataSchema = z.object({
  campaign: CampaignSchema,
  keywords: z.array(z.object({
    text: z.string(),
    matchType: z.string().optional(),
    cpc: z.number().optional()
  })).default([]),
  ads: z.array(z.object({
    headline: z.string(),
    description: z.string(),
    url: z.string().optional()
  })).default([]),
  csvData: z.record(z.string()).optional()
})

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
  description: z.string().optional()
})

export function validateCampaignResponse(data: unknown): CampaignResponse | null {
  try {
    return CampaignResponseSchema.parse(data)
  } catch (error) {
    console.error('Campaign response validation failed:', error)
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

export function createSafeCampaignAccess(data: CampaignData | null) {
  return {
    getCampaignName: () => data?.campaign?.name || 'N/A',
    getCampaignBudget: () => data?.campaign?.budget || 0,
    getCampaignLocations: () => data?.campaign?.locations?.join?.(', ') || 'N/A',
    getKeywordCount: () => data?.keywords?.length || 0,
    getAdCount: () => data?.ads?.length || 0,
    hasValidData: () => data !== null && data.campaign !== undefined
  }
}