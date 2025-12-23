import { QueryClient } from '@tanstack/react-query'

// Global query client configuration
export const queryClientConfig = {
    defaultOptions: {
        queries: {
            // Server state cache time (5 minutes)
            staleTime: 1000 * 60 * 5,

            // Keep unused data in cache for 10 minutes
            gcTime: 1000 * 60 * 10,

            // Retry failed requests
            retry: 3,
            retryDelay: (attemptIndex: number) => Math.max(1000 * 2 ** attemptIndex, 3000),

            // Refetch on window focus (useful for live scoring)
            refetchOnWindowFocus: false,

            // Refetch on reconnect
            refetchOnReconnect: true,

            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
        },
        mutations: {
            // Retry mutations on failure
            retry: 1,

            //Network mode for mutations
            networkMode: 'online',
        },
    },
}

// Create singleton query client instance
// @ts-ignore
export const queryClient = new QueryClient(queryClientConfig)