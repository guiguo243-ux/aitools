import { api } from './request'
import type { DigitalHuman, GenerateVideoRequest, GenerateVideoResponse } from './types'

export const digitalHumanApi = {
  getList: async (category?: string): Promise<DigitalHuman[]> => {
    const params = category && category !== 'all' ? { category } : {}
    return api.get<DigitalHuman[]>('/api/digital-human/list', params)
  },

  getDetail: async (id: string): Promise<DigitalHuman> => {
    return api.get<DigitalHuman>(`/api/digital-human/${id}`)
  },

  getVoiceList: async (): Promise<{ id: string; name: string }[]> => {
    return api.get<{ id: string; name: string }[]>('/api/digital-human/voice-list')
  },

  generateVideo: async (data: GenerateVideoRequest): Promise<GenerateVideoResponse> => {
    return api.post<GenerateVideoResponse>('/api/digital-human/generate', data)
  },

  getTaskStatus: async (taskId: string): Promise<GenerateVideoResponse> => {
    return api.get<GenerateVideoResponse>(`/api/digital-human/task/${taskId}`)
  },

  cancelGenerate: async (taskId: string): Promise<void> => {
    return api.delete(`/api/digital-human/task/${taskId}`)
  }
}
