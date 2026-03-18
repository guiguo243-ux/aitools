import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './material-mall.scss'

const materials = [
  { id: 1, name: '高清背景', category: '背景', count: 1280, icon: '🖼️' },
  { id: 2, name: '热门音乐', category: '音乐', count: 2560, icon: '🎵' },
  { id: 3, name: '特效转场', category: '特效', count: 890, icon: '✨' },
  { id: 4, name: '动态贴纸', category: '贴纸', count: 3200, icon: '💫' },
  { id: 5, name: '字幕模板', category: '字幕', count: 560, icon: '📝' },
  { id: 6, name: '滤镜调色', category: '滤镜', count: 1800, icon: '🎨' },
  { id: 7, name: '片头片尾', category: '包装', count: 320, icon: '📦' },
  { id: 8, name: '表情包', category: '贴纸', count: 980, icon: '😄' },
]

export default function MaterialMall() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchText, setSearchText] = useState('')

  const categories = ['全部', '背景', '音乐', '特效', '贴纸', '字幕', '滤镜', '包装']

  const filteredMaterials = activeCategory === '全部' 
    ? materials 
    : materials.filter(m => m.category === activeCategory)

  return (
    <View className='material-mall'>
      <View className='header'>
        <Text className='header-title'>素材商城</Text>
      </View>

      <View className='search-box'>
        <View className='search-input-wrap'>
          <Text>🔍</Text>
          <input 
            className='search-input'
            placeholder='搜索素材'
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <View className='tabs'>
        {categories.map(cat => (
          <View 
            key={cat} 
            className={`tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </View>
        ))}
      </View>

      <ScrollView scrollY className='material-list'>
        <View className='material-grid'>
          {filteredMaterials.map(item => (
            <View 
              key={item.id} 
              className='material-item'
              onClick={() => Taro.showToast({ title: '进入素材库', icon: 'none' })}
            >
              <View className='material-icon'>{item.icon}</View>
              <View className='material-name'>{item.name}</View>
              <View className='material-count'>{item.count.toLocaleString()}个</View>
            </View>
          ))}
        </View>

        <View className='hot-section'>
          <View className='hot-title'>热门推荐</View>
          <View className='hot-list'>
            <View className='hot-item'>
              <View className='hot-icon'>🔥</View>
              <View className='hot-name'>最新流行音乐</View>
            </View>
            <View className='hot-item'>
              <View className='hot-icon'>💯</View>
              <View className='hot-name'>必用转场</View>
            </View>
            <View className='hot-item'>
              <View className='hot-icon'>⭐</View>
              <View className='hot-name'>收藏榜</View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
