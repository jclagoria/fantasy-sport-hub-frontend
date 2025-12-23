import { useAuthStore } from '@/lib/stores'

export function useAuth() {
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isLoading = useAuthStore((state) => state.isLoading)
    const setUser = useAuthStore((state) => state.setUser)
    const logout = useAuthStore((state) => state.logout)
    const setLoading = useAuthStore((state) => state.setLoading)

    return {
        user,
        isAuthenticated,
        isLoading,
        setUser,
        logout,
        setLoading,
    }
}