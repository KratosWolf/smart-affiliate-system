import { useState, useCallback } from 'react'
import { campaignService } from '../lib/services/campaign.service'
import { createSafeCampaignAccess } from '../lib/validators/campaign.validator'
import { CampaignParams, CampaignData } from '../lib/types'
import { AppError } from '../lib/errors/AppError'

interface UseCampaignBuilderReturn {
  campaign: CampaignData | null
  isLoading: boolean
  error: string | null
  isSuccess: boolean
  generateCampaign: (params: CampaignParams) => Promise<void>
  clearError: () => void
  clearCampaign: () => void
  safeAccess: ReturnType<typeof createSafeCampaignAccess>
}

export function useCampaignBuilder(): UseCampaignBuilderReturn {
  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const generateCampaign = useCallback(async (params: CampaignParams) => {
    try {
      setIsLoading(true)
      setError(null)
      setIsSuccess(false)
      
      const result = await campaignService.generateCampaign(params)
      
      if (result.success && result.data) {
        setCampaign(result.data)
        setIsSuccess(true)
      } else {
        throw new AppError(result.error || 'Campaign generation failed')
      }
    } catch (err) {
      const errorMessage = err instanceof AppError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred'
      
      setError(errorMessage)
      setCampaign(null)
      setIsSuccess(false)
      
      // Log error for debugging
      console.error('Campaign generation error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearCampaign = useCallback(() => {
    setCampaign(null)
    setError(null)
    setIsSuccess(false)
  }, [])

  const safeAccess = createSafeCampaignAccess(campaign)

  return {
    campaign,
    isLoading,
    error,
    isSuccess,
    generateCampaign,
    clearError,
    clearCampaign,
    safeAccess
  }
}