// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard error response format from backend
 */
export interface ApiError {
  error: string
  message: string
  timestamp: string
  path: string
  details?: Array<{
    field: string
    message: string
  }>
}

/**
 * Rate limiting headers from backend
 */
export interface RateLimitHeaders {
  limit: number
  remaining: number
  reset: number // Unix timestamp
}

/**
 * Cursor-based pagination response
 */
export interface CursorPagination<T> {
  data: T[]
  pagination: {
    nextCursor: string | null
    hasMore: boolean
    _links: {
      next?: string
    }
  }
}

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * JWT token pair from authentication
 */
export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number // in seconds
  tokenType: 'Bearer'
}

/**
 * User information from backend
 */
export interface User {
  id: string
  email: string
  roles: string[]
  createdAt: string
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string
  password: string
  mfaCode?: string
}

/**
 * Login response
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
  user: User
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  email: string
  password: string
  phoneNumber?: any | string
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string
}
