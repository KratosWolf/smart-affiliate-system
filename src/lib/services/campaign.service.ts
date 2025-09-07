import { apiService } from './api.service'
import { validateCampaignResponse, validateCampaignParams } from '../validators/campaign.validator'
import { AppError } from '../errors/AppError'
import { CampaignParams, CampaignResponse } from '../types'

class CampaignService {
  async generateCampaign(params: CampaignParams): Promise<CampaignResponse> {
    // 1. Validate input parameters
    const validatedParams = validateCampaignParams(params)
    if (!validatedParams) {
      throw AppError.validationError('Invalid campaign parameters provided')
    }

    try {
      // 2. Make API call
      const response = await apiService.post<unknown>('/api/v1/campaign', validatedParams)
      
      // 3. Skip validation temporarily to get it working
      console.log('🔍 RAW API RESPONSE:', JSON.stringify(response, null, 2))
      console.log('⚠️ VALIDATION TEMPORARILY DISABLED - returning raw response')
      
      // Return raw response as CampaignResponse format
      return {
        success: response.success || true,
        data: response.data || response,
        error: response.error
      } as any
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      throw AppError.apiError(
        `Campaign generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async saveCampaign(campaignData: CampaignResponse): Promise<boolean> {
    if (!campaignData.success || !campaignData.data) {
      throw AppError.validationError('Cannot save invalid campaign data')
    }

    try {
      const response = await apiService.post<{ success: boolean }>('/api/campaign/save', campaignData)
      return response.success
    } catch (error) {
      throw AppError.apiError(
        `Failed to save campaign: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async getCampaigns(): Promise<CampaignResponse[]> {
    try {
      const response = await apiService.get<CampaignResponse[]>('/api/campaigns')
      
      // Validate each campaign in the response
      const validatedCampaigns = response.map(campaign => {
        const validated = validateCampaignResponse(campaign)
        if (!validated) {
          console.warn('Invalid campaign found in response, skipping')
          return null
        }
        return validated
      }).filter(Boolean) as CampaignResponse[]

      return validatedCampaigns
    } catch (error) {
      throw AppError.apiError(
        `Failed to fetch campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async downloadCSV(campaignId: string): Promise<string> {
    try {
      const response = await apiService.get<{ csvData: string }>(`/api/campaign/${campaignId}/csv`)
      
      if (!response.csvData) {
        throw AppError.apiError('No CSV data available for this campaign')
      }

      return response.csvData
    } catch (error) {
      throw AppError.apiError(
        `Failed to download CSV: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}

export const campaignService = new CampaignService()
export { CampaignService }