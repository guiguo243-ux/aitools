import { api } from './request'
import type { InviteRecord, PointsRecord } from './types'

export const inviteApi = {
  getMyInviteCode: async (): Promise<{ code: string; url: string }> => {
    return api.get<{ code: string; url: string }>('/api/invite/my-code')
  },

  getInviteRecords: async (params?: {
    page?: number
    pageSize?: number
  }): Promise<{ list: InviteRecord[]; total: number }> => {
    return api.get<{ list: InviteRecord[]; total: number }>('/api/invite/records', params)
  },

  getRankList: async (): Promise<{
    list: { rank: number; user: { nickname: string; avatar: string }; count: number }[]
    myRank: { rank: number; count: number }
  }> => {
    return api.get('/api/invite/rank')
  },

  getInviteRewards: async (): Promise<{
    newUserReward: { type: string; value: number }
    inviteReward: { points: number }
    ladderReward: { threshold: number; reward: string }
  }> => {
    return api.get('/api/invite/rewards')
  }
}

export const pointsApi = {
  getBalance: async (): Promise<{ balance: number }> => {
    return api.get<{ balance: number }>('/api/points/balance')
  },

  getRecords: async (params?: {
    type?: string
    page?: number
    pageSize?: number
  }): Promise<{ list: PointsRecord[]; total: number }> => {
    return api.get<{ list: PointsRecord[]; total: number }>('/api/points/records', params)
  },

  signIn: async (): Promise<{ points: number;连续签到: number }> => {
    return api.post<{ points: number;连续签到: number }>('/api/points/signin')
  }
}
