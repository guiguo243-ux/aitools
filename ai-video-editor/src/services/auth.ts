import { api } from './request'
import type { User, LoginResponse } from './types'

export const authApi = {
  wechatLogin: async (code: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/api/auth/wechat/login', { code })
  },

  phoneLogin: async (phone: string, code: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/api/auth/phone/login', { phone, code })
  },

  getUserInfo: async (): Promise<User> => {
    return api.get<User>('/api/user/info')
  },

  updateUserInfo: async (data: Partial<User>): Promise<User> => {
    return api.put<User>('/api/user/info', data)
  },

  bindPhone: async (phone: string, code: string): Promise<User> => {
    return api.post<User>('/api/user/bind-phone', { phone, code })
  },

  sendSmsCode: async (phone: string): Promise<void> => {
    return api.post('/api/auth/sms/send', { phone })
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return api.post('/api/auth/refresh')
  },

  logout: async (): Promise<void> => {
    return api.post('/api/auth/logout')
  }
}
