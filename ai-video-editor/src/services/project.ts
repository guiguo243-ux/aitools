import { api } from './request'
import type { Material, Project } from './types'

export const materialApi = {
  getList: async (params: {
    type?: 'video' | 'image' | 'audio'
    page?: number
    pageSize?: number
  }): Promise<{ list: Material[]; total: number }> => {
    return api.get<{ list: Material[]; total: number }>('/api/material/list', params)
  },

  upload: async (filePath: string, type: 'video' | 'image' | 'audio'): Promise<Material> => {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: api.baseUrl + '/api/material/upload',
        filePath,
        name: 'file',
        formData: { type },
        success: (res) => {
          const data = JSON.parse(res.data)
          if (data.code === 0) {
            resolve(data.data)
          } else {
            reject(new Error(data.message))
          }
        },
        fail: reject
      })
    })
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(`/api/material/${id}`)
  }
}

export const projectApi = {
  getList: async (params?: {
    status?: string
    page?: number
    pageSize?: number
  }): Promise<{ list: Project[]; total: number }> => {
    return api.get<{ list: Project[]; total: number }>('/api/project/list', params)
  },

  getDetail: async (id: string): Promise<Project> => {
    return api.get<Project>(`/api/project/${id}`)
  },

  create: async (data: { name: string; templateId?: string }): Promise<Project> => {
    return api.post<Project>('/api/project', data)
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    return api.put<Project>(`/api/project/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(`/api/project/${id}`)
  },

  export: async (id: string, params: {
    resolution: '720p' | '1080p' | '4k'
    quality: 'low' | 'medium' | 'high'
  }): Promise<{ taskId: string }> => {
    return api.post<{ taskId: string }>(`/api/project/${id}/export`, params)
  }
}
