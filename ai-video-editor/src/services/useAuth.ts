import { useState, useEffect } from 'react'
import { authApi } from '../services/auth'
import type { User } from '../services/types'

interface UseAuthReturn {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (code: string) => Promise<void>
  logout: () => Promise<void>
  refreshUserInfo: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    try {
      const token = uni.getStorageSync('token')
      if (token) {
        const userInfo = await authApi.getUserInfo()
        setUser(userInfo)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (code: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.wechatLogin(code)
      uni.setStorageSync('token', response.token)
      uni.setStorageSync('userInfo', response.user)
      setUser(response.user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      setUser(null)
    }
  }

  const refreshUserInfo = async () => {
    try {
      const userInfo = await authApi.getUserInfo()
      uni.setStorageSync('userInfo', userInfo)
      setUser(userInfo)
    } catch (error) {
      console.error('刷新用户信息失败:', error)
    }
  }

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
    refreshUserInfo
  }
}
