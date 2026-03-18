import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/taro'
import './cut-same.scss'

type SortType = 'hot' | 'new' | 'trend'
type CategoryType = 'all' | 'dance' | 'funny' | 'food' | 'travel' | 'beauty' | 'education'

interface SameVideo {
  id: string
  title: string
  cover: string
  author: string
  authorAvatar: string
  plays: number
  uses: number
  tags: string[]
  category: CategoryType
}

export default function CutSame() {
  const [sortType, setSortType] = useState<SortType>('hot')
  const [category, setCategory] = useState<CategoryType>('all')
  const [searchText, setSearchText] = useState('')

  const sortOptions: { key: SortType; label: string }[] = [
    { key: 'hot', label: '最热' },
    { key: 'new', label: '最新' },
    { key: 'trend', label: '飙升' }
  ]

  const categories: { key: CategoryType; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '🎬' },
    { key: 'dance', label: '舞蹈', icon: '💃' },
    { key: 'funny', label: '搞笑', icon: '😂' },
    { key: 'food', label: '美食', icon: '🍜' },
    { key: 'travel', label: '旅行', icon: '✈️' },
    { key: 'beauty', label: '美妆', icon: '💄' },
    { key: 'education', label: '教育', icon: '📚' }
  ]

  const sameVideos: SameVideo[] = [
    { id: '1', title: '科目三舞蹈', cover: '', author: '舞蹈达人', authorAvatar: '💃', plays: 1500000, uses: 85000, tags: ['舞蹈', '科目三'], category: 'dance' },
    { id: '2', title: '多巴胺穿搭', cover: '', author: '时尚博主', authorAvatar: '👗', plays: 980000, uses: 62000, tags: ['时尚', '穿搭'], category: 'beauty' },
    { id: '3', title: '快速做家常菜', cover: '', author: '美食家', authorAvatar: '🍳', plays: 750000, uses: 45000, tags: ['美食', '教程'], category: 'food' },
    { id: '4', title: '搞笑配音', cover: '', author: '配音秀', authorAvatar: '🎤', plays: 620000, uses: 38000, tags: ['搞笑', '配音'], category: 'funny' },
    { id: '5', title: '旅行vlog', cover: '', author: '旅行家', authorAvatar: '🧳', plays: 580000, uses: 32000, tags: ['旅行', 'vlog'], category: 'travel' },
    { id: '6', title: '英语口语教学', cover: '', author: '英语老师', authorAvatar: '📖', plays: 420000, uses: 28000, tags: ['教育', '英语'], category: 'education' },
    { id: '7', title: '变装视频', cover: '', author: '变装达人', authorAvatar: '🎭', plays: 1200000, uses: 75000, tags: ['变装', '创意'], category: 'beauty' },
    { id: '8', title: '手势舞', cover: '', author: '手势舞王', authorAvatar: '👐', plays: 380000, uses: 22000, tags: ['手势舞', '舞蹈'], category: 'dance' }
  ]

  const filteredVideos = sameVideos.filter(v => {
    const matchCategory = category === 'all' || v.category === category
    const matchSearch = !searchText || v.title.includes(searchText) || v.tags.some(t => t.includes(searchText))
    return matchCategory && matchSearch
  })

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return String(num)
  }

  const handleUseSame = (video: SameVideo) => {
    console.log('使用同款:', video.title)
  }

  return (
    <View className="cut-same-page">
      <View className="header">
        <Text className="title">剪同款</Text>
        <Text className="subtitle">使用热门视频模板，一键生成同款</Text>
      </View>

      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <input 
            className="search-input"
            placeholder="搜索同款视频..."
            value={searchText}
            onChange={(e: any) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <View className="sort-bar">
        {sortOptions.map(opt => (
          <View 
            key={opt.key}
            className={`sort-item ${sortType === opt.key ? 'active' : ''}`}
            onClick={() => setSortType(opt.key)}
          >
            <Text>{opt.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollX className="category-scroll">
        <View className="category-list">
          {categories.map(cat => (
            <View 
              key={cat.key}
              className={`category-item ${category === cat.key ? 'active' : ''}`}
              onClick={() => setCategory(cat.key)}
            >
              <Text className="category-icon">{cat.icon}</Text>
              <Text className="category-label">{cat.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <ScrollView scrollY className="video-grid">
        <View className="grid">
          {filteredVideos.map(video => (
            <View key={video.id} className="video-item">
              <View className="video-cover">
                <Text className="cover-icon">🎬</Text>
                <View className="play-overlay">
                  <Text className="play-icon">▶️</Text>
                </View>
                <View className="video-stats">
                  <Text>👁️ {formatNumber(video.plays)}</Text>
                </View>
              </View>
              <View className="video-info">
                <View className="author-row">
                  <Text className="author-avatar">{video.authorAvatar}</Text>
                  <Text className="author-name">{video.author}</Text>
                </View>
                <Text className="video-title">{video.title}</Text>
                <View className="video-tags">
                  {video.tags.map((tag, i) => (
                    <Text key={i} className="tag">#{tag}</Text>
                  ))}
                </View>
                <View className="use-section">
                  <Text className="use-count">{formatNumber(video.uses)} 人使用</Text>
                  <button className="use-btn" onClick={() => handleUseSame(video)}>
                    剪同款
                  </button>
                </View>
              </View>
            </View>
          ))}
        </View>

        {filteredVideos.length === 0 && (
          <View className="empty-state">
            <Text className="empty-icon">🔍</Text>
            <Text className="empty-text">暂无相关同款视频</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
