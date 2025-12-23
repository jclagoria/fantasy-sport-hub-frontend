import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AuthState } from '@/lib/types/state.types'

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                user: null,
                isAuthenticated: false,
                isLoading: false,

                // Actions
                setUser: (user) =>
                    set({ user, isAuthenticated: true }, false, 'auth/setUser'),

                logout: () =>
                    set({ user: null, isAuthenticated: false }, false, 'auth/logout'),

                setLoading: (loading) =>
                    set({ isLoading: loading }, false, 'auth/setLoading'),
            }),
            {
                name: 'auth-storage', // localStorage key
                partialize: (state) => ({
                    // Only persist user data, not loading state
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
        {
            name: 'AuthStore', // DevTools name
            enabled: process.env.NODE_ENV === 'development',
        }
    )
)