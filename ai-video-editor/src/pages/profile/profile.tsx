import { View, Text } from '@tarojs/taro'
import './profile.scss'

export default function Profile() {
  const userInfo = {
    avatar: '👤',
    nickname: '智剪用户',
    level: 'VIP会员',
    points: 1280,
    creations: 12,
    followers: 1280,
    likes: 5600
  }

  const menuItems = [
    { id: '1', icon: '📊', label: '我的数据', arrow: '→' },
    { id: '2', icon: '❤️', label: '我的收藏', arrow: '→' },
    { id: '3', icon: '👥', label: '邀请好友', arrow: '→' },
    { id: '4', icon: '💰', label: '积分商城', arrow: '→' },
    { id: '5', icon: '📦', label: '我的订单', arrow: '→' },
    { id: '6', icon: '🎁', label: '会员中心', arrow: '→' },
    { id: '7', icon: '⚙️', label: '设置', arrow: '→' },
    { id: '8', icon: '📞', label: '联系客服', arrow: '→' }
  ]

  return (
    <View className="profile-page">
      <View className="profile-header">
        <View className="user-info">
          <View className="avatar">
            <Text className="avatar-icon">{userInfo.avatar}</Text>
            <View className="vip-badge">
              <Text>VIP</Text>
            </View>
          </View>
          <View className="user-detail">
            <Text className="nickname">{userInfo.nickname}</Text>
            <View className="level-badge">
              <Text className="level-text">{userInfo.level}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="stats-card">
        <View className="stat-item">
          <Text className="stat-value">{userInfo.points}</Text>
          <Text className="stat-label">积分</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-value">{userInfo.creations}</Text>
          <Text className="stat-label">作品</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-value">{userInfo.followers}</Text>
          <Text className="stat-label">粉丝</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-value">{userInfo.likes}</Text>
          <Text className="stat-label">获赞</Text>
        </View>
      </View>

      <View className="points-card">
        <View className="points-info">
          <Text className="points-label">我的积分</Text>
          <Text className="points-value">{userInfo.points}</Text>
        </View>
        <View className="points-action">
          <Text className="action-text">兑换</Text>
        </View>
      </View>

      <View className="vip-banner">
        <View className="banner-content">
          <Text className="banner-title">开通VIP会员</Text>
          <Text className="banner-desc">享高清导出、AI功能无限用</Text>
        </View>
        <View className="banner-btn">
          <Text>立即开通</Text>
        </View>
      </View>

      <View className="menu-section">
        {menuItems.map((item, index) => (
          <View key={item.id} className="menu-item">
            <View className="menu-left">
              <Text className="menu-icon">{item.icon}</Text>
              <Text className="menu-label">{item.label}</Text>
            </View>
            <Text className="menu-arrow">{item.arrow}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
