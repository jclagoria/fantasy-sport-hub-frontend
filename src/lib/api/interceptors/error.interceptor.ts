import type { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import type { ApiError, RateLimitHeaders } from '@/lib/types/api.types'

/**
 * Error handling interceptor
 *
 * Responsibilities:
 * - Transform backend errors to consistent format
 * - Extract rate limiting information
 * - Handle network errors
 * - Provide user-friendly error messages
 */
export class ApiErrorException extends Error {
  public readonly status: number
  public readonly error: string
  public readonly path: string
  public readonly timestamp: string
  public readonly details?: Array<{ field: string; message: string }>
  public readonly rateLimit?: RateLimitHeaders

  constructor(
    errorData: ApiError,
    status: number,
    rateLimit?: RateLimitHeaders,
  ) {
    super(errorData.message)
    this.name = 'ApiErrorException'
    this.status = status
    this.error = errorData.error
    this.path = errorData.path
    this.timestamp = errorData.timestamp
    this.details = errorData.details
    this.rateLimit = rateLimit
  }
}

/**
 * Extract rate limit headers from response
 */
function extractRateLimitInfo(
  response: AxiosResponse,
): RateLimitHeaders | undefined {
  const limit = response.headers['x-ratelimit-limit']
  const remaining = response.headers['x-ratelimit-remaining']
  const reset = response.headers['x-ratelimit-reset']

  if (limit && remaining && reset) {
    return {
      limit: Number(limit),
      remaining: Number(remaining),
      reset: Number(reset),
    }
  }

  return undefined
}

/**
 * Create user-friendly error message
 */
function getUserFriendlyMessage(error: AxiosError, status: number): string {
  // Use backend message for known errors
  if (error.message) {
    return error.message
  }

  // Fallback messages for common status codes
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'
    case 401:
      return 'Authentication required. Please log in.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 409:
      return 'This action conflicts with existing data.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'An internal server error occurred. Please try again.'
    case 503:
      return 'Service temporarily unavailable. Please try again later.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Setup error handling interceptor
 */
export function setupErrorInterceptors(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Success responses (2xx)
      if (response.status >= 200 && response.status < 300) {
        return response
      }

      // Treat non-2xx as errors even if Axios doesn't
      const errorData: ApiError = response.data || {
        error: 'Unknown Error',
        message: getUserFriendlyMessage(response.data, response.status),
        timestamp: new Date().toISOString(),
        path: response.data.path || '',
      }

      const rateLimitInfo = extractRateLimitInfo(response)
      throw new ApiErrorException(errorData, response.status, rateLimitInfo)
    },
    (error: AxiosError<ApiError>) => {
      // Network errors (no response from server)
      if (!error.response) {
        if (error.code === 'ECONNABORTED') {
          throw new ApiErrorException(
            {
              error: 'Timeout',
              message:
                'Request timed out. Please check your connection and try again.',
              timestamp: new Date().toISOString(),
              path: error.config?.url || '',
            },
            0,
          )
        }

        throw new ApiErrorException(
          {
            error: 'Network Error',
            message:
              'Unable to connect to the server. Please check your internet connection.',
            timestamp: new Date().toISOString(),
            path: error.config?.url || '',
          },
          0,
        )
      }

      // Server responded with error status
      const errorData: ApiError = error.response.data || {
        error: 'Server Error',
        message: getUserFriendlyMessage(
          error.response.data,
          error.response.status,
        ),
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
      }

      const rateLimitInfo = extractRateLimitInfo(error.response)

      // Log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('[API Error]', {
          status: error.response.status,
          error: errorData.error,
          message: errorData.message,
          path: errorData.path,
          details: errorData.details,
          rateLimitInfo,
        })
      }

      throw new ApiErrorException(
        errorData,
        error.response.status,
        rateLimitInfo,
      )
    },
  )
}
