import { useState } from 'react'
import { View, Text, Button } from '@tarojs/taro'
import './login.scss'

interface UserInfo {
  avatar: string
  nickname: string
}

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [phone, setPhone] = useState('')

  const handleWechatLogin = () => {
    setIsLoggedIn(true)
    setUserInfo({
      avatar: '👤',
      nickname: '微信用户'
    })
  }

  const handlePhoneLogin = () => {
    if (phone.length === 11) {
      setIsLoggedIn(true)
      setUserInfo({
        avatar: '👤',
        nickname: '用户' + phone.slice(-4)
      })
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserInfo(null)
    setPhone('')
  }

  const handleGetPhone = () => {
    console.log('获取微信手机号')
    setIsLoggedIn(true)
    setUserInfo({
      avatar: '👤',
      nickname: '微信用户'
    })
  }

  if (isLoggedIn && userInfo) {
    return (
      <View className="login-page">
        <View className="logged-in-view">
          <View className="user-card">
            <View className="user-avatar">
              <Text className="avatar-icon">{userInfo.avatar}</Text>
            </View>
            <Text className="user-nickname">{userInfo.nickname}</Text>
            <View className="user-badge">
              <Text className="badge-text">VIP会员</Text>
            </View>
          </View>

          <View className="stats-section">
            <View className="stat-item">
              <Text className="stat-value">12</Text>
              <Text className="stat-label">创作数</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value">1,280</Text>
              <Text className="stat-label">粉丝</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value">5,600</Text>
              <Text className="stat-label">获赞</Text>
            </View>
          </View>

          <View className="menu-section">
            <View className="menu-item">
              <Text className="menu-icon">📊</Text>
              <Text className="menu-label">我的数据</Text>
              <Text className="menu-arrow">→</Text>
            </View>
            <View className="menu-item">
              <Text className="menu-icon">❤️</Text>
              <Text className="menu-label">我的收藏</Text>
              <Text className="menu-arrow">→</Text>
            </View>
            <View className="menu-item">
              <Text className="menu-icon">💰</Text>
              <Text className="menu-label">积分商城</Text>
              <Text className="menu-arrow">→</Text>
            </View>
            <View className="menu-item">
              <Text className="menu-icon">👥</Text>
              <Text className="menu-label">邀请好友</Text>
              <Text className="menu-arrow">→</Text>
            </View>
          </View>

          <Button className="logout-btn" onClick={handleLogout}>
            退出登录
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className="login-page">
      <View className="login-header">
        <Text className="logo">🎬</Text>
        <Text className="app-name">智剪AI</Text>
        <Text className="app-slogan">智能视频创作平台</Text>
      </View>

      <View className="login-content">
        <View className="login-section">
          <Text className="section-title">登录方式</Text>
          
          <Button className="wechat-login-btn" onClick={handleWechatLogin}>
            <Text className="btn-icon">💬</Text>
            <Text className="btn-text">微信一键登录</Text>
          </Button>

          <View className="divider">
            <View className="divider-line" />
            <Text className="divider-text">或</Text>
            <View className="divider-line" />
          </View>

          <View className="phone-login">
            <Text className="phone-label">手机号登录</Text>
            <View className="phone-input-wrap">
              <input 
                className="phone-input"
                type="number"
                placeholder="请输入手机号"
                maxLength={11}
                value={phone}
                onChange={(e: any) => setPhone(e.detail.value)}
              />
            </View>
            <Button 
              className={`phone-login-btn ${phone.length !== 11 ? 'disabled' : ''}`}
              onClick={handlePhoneLogin}
              disabled={phone.length !== 11}
            >
              获取验证码
            </Button>
          </View>
        </View>

        <View className="agreement-section">
          <Text className="agreement-text">
            登录即表示同意
            <Text className="link">《用户协议》</Text>
            和
            <Text className="link">《隐私政策》</Text>
          </Text>
        </View>

        <View className="benefits-section">
          <Text className="benefits-title">登录后享受</Text>
          <View className="benefits-list">
            <View className="benefit-item">
              <Text className="benefit-icon">🎁</Text>
              <Text className="benefit-text">新用户专属礼包</Text>
            </View>
            <View className="benefit-item">
              <Text className="benefit-icon">⬆️</Text>
              <Text className="benefit-text">高清导出权限</Text>
            </View>
            <View className="benefit-item">
              <Text className="benefit-icon">☁️</Text>
              <Text className="benefit-text">云端保存作品</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
