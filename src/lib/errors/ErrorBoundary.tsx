'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AppError } from './AppError'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          errorInfo={this.state.errorInfo}
          onRetry={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      )
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  onRetry: () => void
}

function DefaultErrorFallback({ error, errorInfo, onRetry }: DefaultErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.768 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Something went wrong
            </h3>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {error instanceof AppError 
              ? error.message 
              : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        {isDevelopment && error && (
          <div className="mb-4 p-3 bg-gray-100 rounded-md">
            <details>
              <summary className="text-xs font-medium text-gray-700 cursor-pointer">
                Technical Details
              </summary>
              <div className="mt-2 text-xs text-gray-600">
                <p><strong>Error:</strong> {error.message}</p>
                {errorInfo && (
                  <pre className="mt-1 whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </details>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}