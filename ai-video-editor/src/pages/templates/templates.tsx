import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/taro'
import { navigateTo } from '@tarojs/taro'
import './templates.scss'

type TemplateCategory = 'all' | 'festival' | 'life' | 'marketing' | 'tutorial'

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all')

  const categories: { key: TemplateCategory; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'festival', label: '节日' },
    { key: 'life', label: '生活' },
    { key: 'marketing', label: '营销' },
    { key: 'tutorial', label: '教程' }
  ]

  const templates = [
    { id: '1', title: '春节祝福', category: 'festival', cover: '', uses: 10000 },
    { id: '2', title: '中秋团圆', category: 'festival', cover: '', uses: 8000 },
    { id: '3', title: '生日派对', category: 'life', cover: '', uses: 15000 },
    { id: '4', title: '美食探店', category: 'life', cover: '', uses: 12000 },
    { id: '5', title: '电商种草', category: 'marketing', cover: '', uses: 20000 },
    { id: '6', title: '活动促销', category: 'marketing', cover: '', uses: 18000 },
    { id: '7', title: '知识分享', category: 'tutorial', cover: '', uses: 5000 },
    { id: '8', title: '技能教学', category: 'tutorial', cover: '', uses: 7000 }
  ]

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory)

  const formatUses = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`
    }
    return String(count)
  }

  const handleTemplateClick = (template: typeof templates[0]) => {
    navigateTo({ url: '/pages/editor/editor?templateId=' + template.id })
  }

  return (
    <View className="templates-page">
      <View className="header">
        <Text className="title">模板中心</Text>
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

      <ScrollView scrollY className="template-grid">
        <View className="grid">
          {filteredTemplates.map(template => (
            <View 
              key={template.id} 
              className="template-item"
              onClick={() => handleTemplateClick(template)}
            >
              <View className="template-cover">
                <Text className="cover-icon">🎬</Text>
                <View className="use-badge">
                  <Text>{formatUses(template.uses)} 使用</Text>
                </View>
              </View>
              <View className="template-info">
                <Text className="template-title">{template.title}</Text>
                <View className="template-tags">
                  <Text className="tag">{categories.find(c => c.key === template.category)?.label}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
