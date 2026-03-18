import { useState } from 'react'
import { View, Text, Image, Button, ScrollView } from '@tarojs/taro'
import { navigateTo } from '@tarojs/taro'
import './index.scss'

interface QuickAction {
  id: string
  title: string
  icon: string
  color: string
}

interface AITemplate {
  id: string
  title: string
  cover: string
  type: string
}

export default function Index() {
  const [quickActions] = useState<QuickAction[]>([
    { id: '1', title: 'AI成片', icon: '🤖', color: '#2563EB' },
    { id: '2', title: '图文成片', icon: '📝', color: '#7C3AED' },
    { id: '3', title: '照片成片', icon: '🖼️', color: '#059669' },
    { id: '4', title: '快速剪辑', icon: '✂️', color: '#DC2626' }
  ])

  const [templates] = useState<AITemplate[]>([
    { id: '1', title: '春日踏青', cover: '', type: '节日' },
    { id: '2', title: '美食探店', cover: '', type: '生活' },
    { id: '3', title: '电商种草', cover: '', type: '营销' },
    { id: '4', title: '知识分享', cover: '', type: '教程' },
    { id: '5', title: '生日祝福', cover: '', type: '节日' },
    { id: '6', title: '时尚穿搭', cover: '', type: '生活' }
  ])

  const handleActionClick = (action: QuickAction) => {
    if (action.id === '1' || action.id === '2' || action.id === '3') {
      navigateTo({ url: '/pages/editor/editor?mode=' + action.id })
    } else {
      navigateTo({ url: '/pages/editor/editor' })
    }
  }

  const handleTemplateClick = (template: AITemplate) => {
    navigateTo({ url: '/pages/editor/editor?templateId=' + template.id })
  }

  return (
    <View className="index-page">
      <ScrollView scrollY className="content">
        <View className="header">
          <View className="logo-section">
            <Text className="app-title">智剪AI</Text>
            <Text className="app-subtitle">智能视频创作平台</Text>
          </View>
        </View>

        <View className="hero-section">
          <View className="hero-card" onClick={() => navigateTo({ url: '/pages/editor/editor?mode=ai' })}>
            <View className="hero-content">
              <Text className="hero-title">AI智能成片</Text>
              <Text className="hero-desc">输入文案，AI自动生成视频</Text>
            </View>
            <View className="hero-icon">
              <Text>🚀</Text>
            </View>
          </View>
        </View>

        <View className="section">
          <View className="section-header">
            <Text className="section-title">快捷功能</Text>
          </View>
          <View className="quick-actions">
            {quickActions.map(action => (
              <View 
                key={action.id} 
                className="action-item"
                onClick={() => handleActionClick(action)}
              >
                <View className="action-icon" style={{ backgroundColor: action.color }}>
                  <Text>{action.icon}</Text>
                </View>
                <Text className="action-title">{action.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="section">
          <View className="section-header">
            <Text className="section-title">热门模板</Text>
            <Text className="section-more" onClick={() => navigateTo({ url: '/pages/templates/templates' })}>
              更多 →
            </Text>
          </View>
          <ScrollView scrollX className="template-scroll">
            <View className="template-list">
              {templates.map(template => (
                <View 
                  key={template.id} 
                  className="template-item"
                  onClick={() => handleTemplateClick(template)}
                >
                  <View className="template-cover">
                    <Text className="template-icon">🎬</Text>
                  </View>
                  <Text className="template-title">{template.title}</Text>
                  <Text className="template-type">{template.type}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="section">
          <View className="section-header">
            <Text className="section-title">使用教程</Text>
          </View>
          <View className="tutorial-list">
            <View className="tutorial-item">
              <View className="tutorial-number">1</View>
              <View className="tutorial-content">
                <Text className="tutorial-title">选择功能</Text>
                <Text className="tutorial-desc">选择AI成片或模板创作</Text>
              </View>
            </View>
            <View className="tutorial-item">
              <View className="tutorial-number">2</View>
              <View className="tutorial-content">
                <Text className="tutorial-title">添加内容</Text>
                <Text className="tutorial-desc">上传图片或输入文案</Text>
              </View>
            </View>
            <View className="tutorial-item">
              <View className="tutorial-number">3</View>
              <View className="tutorial-content">
                <Text className="tutorial-title">智能生成</Text>
                <Text className="tutorial-desc">AI自动剪辑配乐</Text>
              </View>
            </View>
            <View className="tutorial-item">
              <View className="tutorial-number">4</View>
              <View className="tutorial-content">
                <Text className="tutorial-title">导出分享</Text>
                <Text className="tutorial-desc">保存到相册或分享好友</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
