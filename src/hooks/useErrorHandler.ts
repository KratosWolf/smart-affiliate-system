import { useState, useCallback } from 'react'
import { AppError } from '../lib/errors/AppError'

interface UseErrorHandlerReturn {
  error: string | null
  isError: boolean
  clearError: () => void
  handleError: (error: unknown) => void
  createErrorHandler: (fallbackMessage?: string) => (error: unknown) => void
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((error: unknown) => {
    let message = 'An unexpected error occurred'
    
    if (error instanceof AppError) {
      message = error.message
    } else if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }

    setError(message)
    
    // Log for debugging
    console.error('Error handled:', error)
  }, [])

  const createErrorHandler = useCallback((fallbackMessage?: string) => {
    return (error: unknown) => {
      let message = fallbackMessage || 'An unexpected error occurred'
      
      if (error instanceof AppError) {
        message = error.message
      } else if (error instanceof Error) {
        message = error.message
      } else if (typeof error === 'string') {
        message = error
      }

      setError(message)
      console.error('Error handled:', error)
    }
  }, [])

  return {
    error,
    isError: error !== null,
    clearError,
    handleError,
    createErrorHandler
  }
}