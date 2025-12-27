import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'
import { useAuthStore } from '@/lib/stores/authStore'
import type { TokenPair } from '@/lib/types/api.types'

/**
 * Authentication interceptor for JWT token management
 *
 * Request Interceptor:
 * - Attaches Bearer token to all requests
 *
 * Response Interceptor:
 * - Detects 401 Unauthorized errors
 * - Attempts token refresh with refreshToken
 * - Retries original request with new token
 * - Logs out user if refresh fails
 */
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * Add subscriber to queue waiting for token refresh
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * Notify all subscribers when token refresh completes
 */
function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

/**
 * Setup authentication interceptor
 */
export function setupAuthInterceptor(axiosInstance: AxiosInstance): void {
  // Request interceptor - attach token
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = useAuthStore.getState()

      // Skip auth for public endpoints
      if (
        config.url?.includes('/aut/login') ||
        config.url?.includes('/auth/register')
      ) {
        return config
      }

      // Attach Bearer token if available
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor - handle 401 and token refresh
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig

      // Only handle 401 errors for requests that haven't been retried
      if (error.response?.status === 401 || originalRequest._retry) {
        return Promise.reject(error)
      }

      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const { refreshToken } = useAuthStore.getState()

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Attempt to refresh token
        const response = await axiosInstance.post<TokenPair>('/auth/refresh', {
          refreshToken,
        })

        if (response?.status !== 200 || !response.data) {
          throw new Error('Token refresh failed')
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data

        // Update tokens in store
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)

        // Update Authorization header for original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        // Notify all queued requests
        onTokenRefreshed(newAccessToken)

        isRefreshing = false

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Token refresh failed - logout user
        isRefreshing = false
        refreshSubscribers = []

        useAuthStore.getState().logout()

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      }
    },
  )
}
