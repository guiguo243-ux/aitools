import { api } from './request'
import type { VideoTemplate } from './types'

export const templateApi = {
  getHotList: async (params?: {
    category?: string
    sort?: 'hot' | 'new' | 'trend'
    page?: number
    pageSize?: number
  }): Promise<{ list: VideoTemplate[]; total: number }> => {
    return api.get<{ list: VideoTemplate[]; total: number }>('/api/template/hot', params)
  },

  search: async (keyword: string): Promise<VideoTemplate[]> => {
    return api.get<VideoTemplate[]>('/api/template/search', { keyword })
  },

  getDetail: async (id: string): Promise<VideoTemplate> => {
    return api.get<VideoTemplate>(`/api/template/${id}`)
  },

  useTemplate: async (templateId: string, data: {
    images?: string[]
    text?: string
  }): Promise<{ projectId: string }> => {
    return api.post<{ projectId: string }>(`/api/template/${templateId}/use`, data)
  },

  getCategoryList: async (): Promise<{ id: string; name: string; icon: string }[]> => {
    return api.get<{ id: string; name: string; icon: string }[]>('/api/template/categories')
  }
}
