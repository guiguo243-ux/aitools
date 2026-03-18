import { apiConfig } from './config'

class ApiRequest {
  private baseUrl = apiConfig.baseUrl

  private async request<T>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      data?: Record<string, any>
      header?: Record<string, string>
    } = {}
  ): Promise<T> {
    const token = uni.getStorageSync('token')

    try {
      const response = await uni.request({
        url: this.baseUrl + url,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.header
        }
      })

      if (response.statusCode === 200) {
        return response.data as T
      } else if (response.statusCode === 401) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        throw new Error('请先登录')
      } else {
        throw new Error((response.data as any)?.message || '请求失败')
      }
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }

  get<T>(url: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(url, { method: 'GET', data })
  }

  post<T>(url: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(url, { method: 'POST', data })
  }

  put<T>(url: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(url, { method: 'PUT', data })
  }

  delete<T>(url: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', data })
  }
}

export const api = new ApiRequest()
