import { AppError } from '../errors/AppError'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

class ApiService {
  private baseUrl: string
  private defaultTimeout: number = 30000

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout
    } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = `${this.baseUrl}${endpoint}`
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: controller.signal
      }

      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body)
      }

      const response = await fetch(url, requestOptions)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw AppError.apiError(
          `HTTP ${response.status}: ${response.statusText}`,
          `HTTP_${response.status}`
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof AppError) {
        throw error
      }

      if (error.name === 'AbortError') {
        throw AppError.apiError('Request timeout', 'TIMEOUT')
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw AppError.apiError('Network error - please check your connection', 'NETWORK_ERROR')
      }

      throw AppError.apiError(
        error instanceof Error ? error.message : 'Unknown API error',
        'UNKNOWN_ERROR'
      )
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }

  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers })
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/api/health')
      return true
    } catch {
      return false
    }
  }
}

export const apiService = new ApiService()
export { ApiService }