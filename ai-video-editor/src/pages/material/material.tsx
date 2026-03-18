import { useState } from 'react'
import { View, Text, Button, ScrollView, Checkbox } from '@tarojs/taro'
import { navigateBack } from '@tarojs/taro'
import './material.scss'

type MaterialCategory = 'all' | 'video' | 'image' | 'audio'

interface Material {
  id: string
  name: string
  type: 'video' | 'image' | 'audio'
  thumbnail?: string
  duration?: number
  size: string
  date: string
  selected?: boolean
}

export default function Material() {
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const categories: { key: MaterialCategory; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '📁' },
    { key: 'video', label: '视频', icon: '🎬' },
    { key: 'image', label: '图片', icon: '🖼️' },
    { key: 'audio', label: '音频', icon: '🎵' }
  ]

  const [materials] = useState<Material[]>([
    { id: '1', name: ' vacation_video.mp4', type: 'video', duration: 120, size: '45MB', date: '2024-01-15' },
    { id: '2', name: 'food_photo.jpg', type: 'image', size: '3.2MB', date: '2024-01-14' },
    { id: '3', name: ' interview.mp4', type: 'video', duration: 180, size: '68MB', date: '2024-01-13' },
    { id: '4', name: 'product_photo.jpg', type: 'image', size: '2.1MB', date: '2024-01-12' },
    { id: '5', name: 'background_music.mp3', type: 'audio', duration: 180, size: '4.5MB', date: '2024-01-11' },
    { id: '6', name: 'travel_clip.mp4', type: 'video', duration: 60, size: '22MB', date: '2024-01-10' },
    { id: '7', name: 'portrait.jpg', type: 'image', size: '1.8MB', date: '2024-01-09' },
    { id: '8', name: 'sound_effect.mp3', type: 'audio', duration: 30, size: '0.8MB', date: '2024-01-08' }
  ])

  const filteredMaterials = activeCategory === 'all' 
    ? materials 
    : materials.filter(m => m.type === activeCategory)

  const handleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMaterials.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredMaterials.map(m => m.id))
    }
  }

  const handleDelete = () => {
    if (selectedItems.length === 0) return
    console.log('删除素材:', selectedItems)
    setSelectedItems([])
  }

  const handleImport = () => {
    console.log('导入素材')
    uni.chooseMedia({
      count: 9,
      mediaType: ['video', 'image'],
      success: (res) => {
        console.log('选择成功:', res)
      }
    })
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬'
      case 'image': return '🖼️'
      case 'audio': return '🎵'
      default: return '📁'
    }
  }

  return (
    <View className="material-page">
      <View className="header">
        <Button className="back-btn" onClick={() => navigateBack()}>←</Button>
        <Text className="title">素材库</Text>
        <Button 
          className={`select-btn ${isSelectionMode ? 'active' : ''}`}
          onClick={() => setIsSelectionMode(!isSelectionMode)}
        >
          {isSelectionMode ? '取消' : '选择'}
        </Button>
      </View>

      <View className="category-bar">
        {categories.map(cat => (
          <View 
            key={cat.key}
            className={`category-item ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            <Text className="category-icon">{cat.icon}</Text>
            <Text className="category-label">{cat.label}</Text>
          </View>
        ))}
      </View>

      {isSelectionMode && (
        <View className="selection-bar">
          <View className="select-all" onClick={handleSelectAll}>
            <Checkbox 
              value="all" 
              checked={selectedItems.length === filteredMaterials.length && filteredMaterials.length > 0}
            />
            <Text>全选</Text>
          </View>
          <Text className="selected-count">已选择 {selectedItems.length} 项</Text>
          <Button 
            className="delete-btn" 
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
          >
            删除
          </Button>
        </View>
      )}

      <ScrollView scrollY className="material-grid">
        <View className="import-card" onClick={handleImport}>
          <Text className="import-icon">+</Text>
          <Text className="import-text">导入素材</Text>
        </View>

        <View className="material-list">
          {filteredMaterials.map(item => (
            <View 
              key={item.id} 
              className={`material-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
              onClick={() => isSelectionMode ? handleSelect(item.id) : navigateBack()}
            >
              <View className="material-thumb">
                <Text className="type-icon">{getTypeIcon(item.type)}</Text>
                {item.duration && (
                  <View className="duration-badge">
                    <Text>{formatDuration(item.duration)}</Text>
                  </View>
                )}
              </View>
              <View className="material-info">
                <Text className="material-name">{item.name}</Text>
                <Text className="material-meta">{item.size} · {item.date}</Text>
              </View>
              {isSelectionMode && (
                <View className="checkbox" onClick={(e) => { e.stopPropagation(); handleSelect(item.id) }}>
                  {selectedItems.includes(item.id) ? <Text>✓</Text> : <View className="checkbox-empty" />}
                </View>
              )}
            </View>
          ))}
        </View>

        {filteredMaterials.length === 0 && (
          <View className="empty-state">
            <Text className="empty-icon">📁</Text>
            <Text className="empty-text">暂无素材</Text>
            <Text className="empty-hint">点击上方导入按钮添加素材</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
