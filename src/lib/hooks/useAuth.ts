import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/enpoints/auth'
import { useAuthStore } from '@/lib/stores/authStore'
import type { LoginRequest } from '@/lib/types/api.types'
import { ApiErrorException } from '@/lib/api/interceptors/error.interceptor'

/**
 * Authentication hooks using TanStack Query
 *
 * Features:
 * - Automatic cache invalidation on login/logout
 * - Error handling with type-safe errors
 * - Loading states managed by TanStack Query
 * - Integration with Zustand auth store
 */

export function useLogin() {
    const queryClient = useQueryClient()
    const { login: setAuthState } = useAuthStore()

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
        onSuccess: (data) => {
            // Update auth state
            setAuthState(
                {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                },
                data.user
            )

            // Invalidate all queries to refetch with new auth state
            queryClient.invalidateQueries()
        },
        onError: (error) => {
            if (error instanceof ApiErrorException) {
                // Handle specific error cases
                if (error.status === 401) {
                    console.error('Invalid credentials')
                } else if (error.status === 403) {
                    console.error('MFA code required or invalid')
                }
            }
        },
    })
}

export function useLogout() {
    const queryClient = useQueryClient()
    const { logout: clearAuthState } = useAuthStore()

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            // Clear auth state
            clearAuthState()

            // Clear all cached data
            queryClient.clear()
        },
    })
}

export function useRegister() {
    return useMutation({
        mutationFn: authApi.register,
        onError: (error) => {
            if (error instanceof ApiErrorException) {
                if (error.status === 409) {
                    console.error('Email already exists')
                }
            }
        },
    })
}