import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/taro'
import './digital-human.scss'

type HumanCategory = 'all' | 'business' | 'fashion' | 'cartoon' | 'ip'

interface DigitalHuman {
  id: string
  name: string
  avatar: string
  category: HumanCategory
  isVIP: boolean
  isPopular: boolean
}

export default function DigitalHuman() {
  const [activeCategory, setActiveCategory] = useState<HumanCategory>('all')
  const [selectedHuman, setSelectedHuman] = useState<DigitalHuman | null>(null)
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const categories: { key: HumanCategory; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'business', label: '商务' },
    { key: 'fashion', label: '时尚' },
    { key: 'cartoon', label: '卡通' },
    { key: 'ip', label: 'IP联名' }
  ]

  const digitalHumans: DigitalHuman[] = [
    { id: '1', name: '小智老师', avatar: '👨‍🏫', category: 'business', isVIP: false, isPopular: true },
    { id: '2', name: '小美主播', avatar: '👩‍🎤', category: 'fashion', isVIP: false, isPopular: true },
    { id: '3', name: '小宇助手', avatar: '🤖', category: 'cartoon', isVIP: false, isPopular: false },
    { id: '4', name: '小梦老师', avatar: '👩‍💻', category: 'business', isVIP: true, isPopular: false },
    { id: '5', name: '酷哥', avatar: '🧑‍🎤', category: 'fashion', isVIP: true, isPopular: true },
    { id: '6', name: '小七', avatar: '🧒', category: 'cartoon', isVIP: false, isPopular: false },
    { id: '7', name: '小知', avatar: '📚', category: 'business', isVIP: false, isPopular: false },
    { id: '8', name: '小乔', avatar: '👸', category: 'ip', isVIP: true, isPopular: true }
  ]

  const filteredHumans = activeCategory === 'all' 
    ? digitalHumans 
    : digitalHumans.filter(h => h.category === activeCategory)

  const handleSelect = (human: DigitalHuman) => {
    setSelectedHuman(human)
  }

  const handleGenerate = () => {
    if (!selectedHuman || !inputText) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <View className="digital-human-page">
      <View className="header">
        <Text className="title">数字人</Text>
        <Text className="subtitle">选择数字人，输入文案生成视频</Text>
      </View>

      <ScrollView scrollX className="category-scroll">
        <View className="category-list">
          {categories.map(cat => (
            <View 
              key={cat.key}
              className={`category-item ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <Text className="category-label">{cat.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <ScrollView scrollY className="human-grid">
        <View className="grid">
          {filteredHumans.map(human => (
            <View 
              key={human.id} 
              className={`human-item ${selectedHuman?.id === human.id ? 'selected' : ''}`}
              onClick={() => handleSelect(human)}
            >
              <View className="human-avatar">
                <Text className="avatar-icon">{human.avatar}</Text>
                {human.isVIP && <View className="vip-badge">VIP</View>}
                {human.isPopular && <View className="hot-badge">热</View>}
              </View>
              <Text className="human-name">{human.name}</Text>
              <View className="select-check">
                {selectedHuman?.id === human.id && <Text>✓</Text>}
              </View>
            </View>
          ))}
        </View>

        {selectedHuman && (
          <View className="config-section">
            <View className="section-title">配置数字人</View>
            
            <View className="preview-box">
              <View className="preview-avatar">
                <Text className="avatar-large">{selectedHuman.avatar}</Text>
              </View>
              <View className="preview-info">
                <Text className="preview-name">{selectedHuman.name}</Text>
                <Text className="preview-status">准备生成...</Text>
              </View>
            </View>

            <View className="input-section">
              <Text className="input-label">输入要数字人朗读的文案</Text>
              <textarea 
                className="text-input"
                placeholder="请输入需要数字人朗读的文字..."
                value={inputText}
                onChange={(e: any) => setInputText(e.detail.value)}
              />
              <Text className="char-count">{inputText.length}/500</Text>
            </View>

            <View className="voice-section">
              <Text className="section-subtitle">音色选择</Text>
              <ScrollView scrollX className="voice-scroll">
                <View className="voice-list">
                  <View className="voice-item active">
                    <Text>标准女声</Text>
                  </View>
                  <View className="voice-item">
                    <Text>标准男声</Text>
                  </View>
                  <View className="voice-item">
                    <Text>温柔女声</Text>
                  </View>
                  <View className="voice-item">
                    <Text>活力男声</Text>
                  </View>
                  <View className="voice-item">
                    <Text>儿童声音</Text>
                  </View>
                </View>
              </ScrollView>
            </View>

            <View className="action-section">
              <button 
                className={`generate-btn ${!inputText ? 'disabled' : ''}`}
                onClick={handleGenerate}
                disabled={!inputText || isGenerating}
              >
                {isGenerating ? '生成中...' : '生成视频'}
              </button>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
