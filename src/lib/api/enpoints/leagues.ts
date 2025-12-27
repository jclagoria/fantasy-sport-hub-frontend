import { apiClient } from '@/lib/api/client'
import type { CursorPagination } from '@/lib/types/api.types'

interface League {
  id: string
  name: string
  sportId: string
  commissionerId: string
  maxTeams: number
  currentTeams: number
  status: 'DRAFT' | 'ACTIVE' | 'FINISHED'
  createdAt: string
}

interface LeagueFilters {
  sportId?: string
  status?: string
  cursor?: string
  limit?: number
}

export const leaguesApi = {
  /**
   * List leagues with optional filters
   */
  async list(filters?: LeagueFilters): Promise<CursorPagination<League>> {
    const response = await apiClient.get<CursorPagination<League>>('leagues', {
      params: filters,
    })
    return response.data
  },

  /**
   * Get league by ID
   */
  async getById(leagueId: string): Promise<League> {
    const response = await apiClient.get<League>(`leagues/${leagueId}`)
    return response.data
  },

  /**
   * Create new league
   */
  async create(data: Partial<League>): Promise<League> {
    const response = await apiClient.post<League>('/leagues', data)
    return response.data
  },
}
