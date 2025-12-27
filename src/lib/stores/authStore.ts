import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types/api.types'

interface AuthState {
    // State
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean

    // Actions
    login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void
    logout: () => void
    setTokens: ( accessToken: string, refreshToken: string ) => void
    setUser: (user: User | null) => void
    clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial State
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            // Login action
            login: (tokens, user) => {
                set({
                    user,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    isAuthenticated: true,
                })
            },

            // Logout action
            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                })
            },

            // Update tokens (used by token refresh)
            setTokens: (accessToken: string, refreshToken: string) => {
                set({
                    accessToken,
                    refreshToken,
                })
            },

            // Update user info
            setUser: (user) => {
                set({ user })
            },

            // Clear all auth state
            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                })
            },
        }),
        {
            name: 'fantasy-sports-auth', // localStorage key
            partialize: (state) => ({
                // Only persist tokens, not user data
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)