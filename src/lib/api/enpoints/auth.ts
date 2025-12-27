import { apiClient } from '@/lib/api/client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  TokenPair,
  User,
} from '@/lib/types/api.types'

/**
 * Authentication API endpoints
 *
 * Endpoints:
 * - POST /auth/login - User authentication
 * - POST /auth/register - User registration
 * - POST /auth/refresh - Token refresh
 * - POST /auth/logout - User logout
 */

export const authApi = {
  /**
   * User login
   * @param credentials - Email, password, and optional MFA code
   * @returns Login response with tokens and user data
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials,
    )
    return response.data
  },

  /**
   * User registration
   * @param data - Registration information
   * @returns Created user data
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', data)
    return response.data
  },

  /**
   * Refresh access token
   * @param request - Refresh token
   * @returns New token pair
   */
  async refresh(request: RefreshTokenRequest): Promise<TokenPair> {
    const response = await apiClient.post<TokenPair>('/auth/refresh', request)
    return response.data
  },

  /**
   * User logout
   * Clears server-side session if applicable
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
