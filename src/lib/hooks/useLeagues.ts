import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { leaguesApi } from '@/lib/api/enpoints/leagues'

export function useLeagues(filters?: Parameters<typeof leaguesApi.list>[0]) {
  return useQuery({
    queryKey: ['leagues', filters],
    queryFn: () => leaguesApi.list(filters),
    // TanStack Query handles loading states, errors, and caching automatically
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLeague(leagueId: string) {
  return useQuery({
    queryKey: ['league', leagueId],
    queryFn: () => leaguesApi.getById(leagueId),
    enabled: !!leagueId, // Only run if leagueId is provided
  })
}

export function useCreateLeague() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leaguesApi.create,
    onSuccess: () => {
      // Invalidate leagues list to refetch with new league
      queryClient.invalidateQueries({ queryKey: ['leagues'] })
    },
  })
}
