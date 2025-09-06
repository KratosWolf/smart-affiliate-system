import React from 'react'
import { AppError } from '../../lib/errors/AppError'

interface ErrorDisplayProps {
  error: string | Error | AppError | null
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ error, onRetry, className = '' }: ErrorDisplayProps) {
  if (!error) return null

  const errorMessage = typeof error === 'string' 
    ? error 
    : error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred'

  const isAppError = error instanceof AppError

  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {isAppError && error.status ? `Error ${error.status}` : 'Error'}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorMessage}</p>
            {isAppError && error.code && (
              <p className="mt-1 text-xs text-red-600">
                Code: {error.code}
              </p>
            )}
          </div>
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}