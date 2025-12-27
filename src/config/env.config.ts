/**
 * Environment configuration for API client
 * Centralizes environment variable access with type safety
 */
import { defaultValueTypes } from 'framer-motion'

interface EnvConfig {
  apiUrl: string
  apiTimeout: number
  environment: 'development' | 'staging' | 'production'
  isDevelopment: boolean
  isProduction: boolean
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env: EnvConfig = {
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
  apiTimeout: Number(getEnvVar('NEXT_PUBLIC_API_TIMEOUT', '30000')),
  environment: getEnvVar('NEXT_PUBLIC_ENVIRONMENT', 'development') as EnvConfig['environment'],
  isDevelopment: getEnvVar('NEXT_PUBLIC_ENVIRONMENT', 'development') === 'development',
  isProduction: getEnvVar('NEXT_PUBLIC_ENVIRONMENT', 'development') === 'production',
}

// Validation
if (!env.apiUrl.startsWith('http')) {
  throw new Error('NEXT_PUBLIC_API_URL must start with http:// or https://')
}

if (env.apiTimeout < 1000 || env.apiTimeout > 60000) {
  throw new Error('NEXT_PUBLIC_API_TIMEOUT must be between 1000 and 60000ms')
}
