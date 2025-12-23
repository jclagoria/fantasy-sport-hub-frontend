import { useQuery } from '@tanstack/react-query';

// Mock API call (replace with actual API client)
async function fetchLeagues() {
    const response = await fetch('/api/v1/leagues')
    if (!response.ok) throw new Error('Failed to fetch leagues')
    return response.json()
}

/**
 * Custom hook for fetching user leagues
 * Demonstrates TanStack Query usage pattern
 */
export function useLeagues() {
    return useQuery({
        queryKey: ['leagues'],
        queryFn: fetchLeagues,
        staleTime: 1000 * 60 * 5, // 5 minutes (override global if needed)
    })
}