import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/config/env.config'
import { setupAuthInterceptor } from './interceptors/auth.interceptor'
import { setupErrorInterceptors } from './interceptors/error.interceptor'

/**
 * Base Axios client configuration
 *
 * Features:
 * - Automatic JWT token attachment
 * - Token refresh on 401 errors
 * - Consistent error handling
 * - Request/response transformation
 *
 */

// Create Axios instance with default configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Don't throw errors for status codes (handled by interceptor)
  validateStatus: () => true,
})

// Request ID for debugging and correlation
let requestIdCounter = 0

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Add request ID for tracking
  config.headers['X-Request-ID'] = `req-${Date.now()}_${++requestIdCounter}`

  // Log request in development mode
  if (env.isDevelopment) {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      requestId: config.headers['X-Request-ID'],
      data: config.data,
      params: config.params,
    })
  }

  return config
})

// Setup interceptors
setupAuthInterceptor(apiClient)
setupErrorInterceptors(apiClient)

// Export convenience methods
export const api = {
  get: apiClient.get,
  post: apiClient.post,
  put: apiClient.put,
  patch: apiClient.patch,
  delete: apiClient.delete,
}
