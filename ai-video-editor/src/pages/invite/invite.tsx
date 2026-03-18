import { useState } from 'react'
import { View, Text } from '@tarojs/taro'
import './invite.scss'

interface InviteRecord {
  id: string
  avatar: string
  nickname: string
  time: string
  reward: string
}

export default function Invite() {
  const [inviteCode] = useState('ABC123')
  const [inviteCount] = useState(28)
  const [totalReward] = useState(2800)
  const [selectedTab, setSelectedTab] = useState<'invite' | 'rank'>('invite')

  const inviteRecords: InviteRecord[] = [
    { id: '1', avatar: '👤', nickname: '用户***1', time: '2分钟前', reward: '已奖励' },
    { id: '2', avatar: '👤', nickname: '用户***2', time: '10分钟前', reward: '已奖励' },
    { id: '3', avatar: '👤', nickname: '用户***3', time: '1小时前', reward: '已奖励' },
    { id: '4', avatar: '👤', nickname: '用户***4', time: '3小时前', reward: '已奖励' },
    { id: '5', avatar: '👤', nickname: '用户***5', time: '昨天', reward: '已奖励' }
  ]

  const rankList = [
    { rank: 1, avatar: '🥇', nickname: '邀请王者', count: 588, isMe: false },
    { rank: 2, avatar: '🥈', nickname: '裂变达人', count: 456, isMe: false },
    { rank: 3, avatar: '🥉', nickname: '推广能手', count: 320, isMe: false },
    { rank: 4, avatar: '4', nickname: '我的好友', count: 28, isMe: true },
    { rank: 5, avatar: '5', nickname: '用户***6', count: 15, isMe: false }
  ]

  const handleCopyCode = () => {
    console.log('复制邀请码:', inviteCode)
  }

  const handleShare = (type: string) => {
    console.log('分享到:', type)
  }

  const handleGeneratePoster = () => {
    console.log('生成海报')
  }

  return (
    <View className="invite-page">
      <View className="header">
        <Text className="title">邀请好友</Text>
        <Text className="subtitle">邀请好友赚VIP，畅享会员特权</Text>
      </View>

      <View className="stats-card">
        <View className="stat-item">
          <Text className="stat-value">{inviteCount}</Text>
          <Text className="stat-label">已邀请</Text>
        </View>
        <View className="stat-divider" />
        <View className="stat-item">
          <Text className="stat-value">{totalReward}</Text>
          <Text className="stat-label">积分奖励</Text>
        </View>
      </View>

      <View className="invite-code-section">
        <Text className="section-label">我的邀请码</Text>
        <View className="code-box">
          <Text className="code-text">{inviteCode}</Text>
          <View className="copy-btn" onClick={handleCopyCode}>
            <Text>复制</Text>
          </View>
        </View>
      </View>

      <View className="share-section">
        <Text className="section-label">分享邀请</Text>
        <View className="share-buttons">
          <View className="share-btn" onClick={() => handleShare('wechat')}>
            <Text className="share-icon">💬</Text>
            <Text className="share-label">微信好友</Text>
          </View>
          <View className="share-btn" onClick={() => handleShare('moments')}>
            <Text className="share-icon">📱</Text>
            <Text className="share-label">朋友圈</Text>
          </View>
          <View className="share-btn" onClick={handleGeneratePoster}>
            <Text className="share-icon">🖼️</Text>
            <Text className="share-label">海报</Text>
          </View>
          <View className="share-btn" onClick={() => handleShare('link')}>
            <Text className="share-icon">🔗</Text>
            <Text className="share-label">邀请链接</Text>
          </View>
        </View>
      </View>

      <View className="rewards-section">
        <Text className="section-label">邀请奖励</Text>
        <View className="rewards-list">
          <View className="reward-item">
            <View className="reward-info">
              <Text className="reward-title">新用户礼包</Text>
              <Text className="reward-desc">被邀请人获得7天VIP</Text>
            </View>
            <View className="reward-status">已生效</View>
          </View>
          <View className="reward-item">
            <View className="reward-info">
              <Text className="reward-title">邀请人奖励</Text>
              <Text className="reward-desc">邀请1人获得100积分</Text>
            </View>
            <View className="reward-status">已生效</View>
          </View>
          <View className="reward-item">
            <View className="reward-info">
              <Text className="reward-title">阶梯奖励</Text>
              <Text className="reward-desc">邀请满10人额外奖励VIP月卡</Text>
            </View>
            <View className="reward-status reward-pending">待解锁</View>
          </View>
        </View>
      </View>

      <View className="tabs">
        <View 
          className={`tab-item ${selectedTab === 'invite' ? 'active' : ''}`}
          onClick={() => setSelectedTab('invite')}
        >
          <Text>邀请记录</Text>
        </View>
        <View 
          className={`tab-item ${selectedTab === 'rank' ? 'active' : ''}`}
          onClick={() => setSelectedTab('rank')}
        >
          <Text>邀请榜</Text>
        </View>
      </View>

      {selectedTab === 'invite' && (
        <View className="records-section">
          {inviteRecords.map(record => (
            <View key={record.id} className="record-item">
              <View className="record-avatar">
                <Text>{record.avatar}</Text>
              </View>
              <View className="record-info">
                <Text className="record-name">{record.nickname}</Text>
                <Text className="record-time">{record.time}</Text>
              </View>
              <View className="record-reward">
                <Text>{record.reward}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {selectedTab === 'rank' && (
        <View className="rank-section">
          {rankList.map(item => (
            <View key={item.rank} className={`rank-item ${item.isMe ? 'is-me' : ''}`}>
              <View className="rank-num">
                <Text>{item.avatar}</Text>
              </View>
              <View className="rank-avatar">
                <Text>👤</Text>
              </View>
              <View className="rank-info">
                <Text className="rank-name">{item.nickname}</Text>
                <Text className="rank-count">{item.count}人</Text>
              </View>
              {item.isMe && <View className="rank-badge">我的</View>}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
