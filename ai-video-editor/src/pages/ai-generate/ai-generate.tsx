import { View, Text, Input, ScrollView, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './ai-generate.scss'

const templates = [
  { id: 1, name: '种草推荐', category: '电商', cover: '', style: '🛍️' },
  { id: 2, name: '知识分享', category: '教育', cover: '', style: '📚' },
  { id: 3, name: '美食探店', category: '美食', cover: '', style: '🍜' },
  { id: 4, name: '日常vlog', category: '生活', cover: '', style: '📷' },
  { id: 5, name: '产品展示', category: '电商', cover: '', style: '🎁' },
  { id: 6, name: '剧情反转', category: '娱乐', cover: '', style: '🎭' },
  { id: 7, name: '情感语录', category: '情感', cover: '', style: '💕' },
  { id: 8, name: '教程步骤', category: '教育', cover: '', style: '📖' },
]

const categories = ['全部', '电商', '教育', '美食', '生活', '娱乐', '情感']

export default function AIGenerate() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('全部')
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [duration, setDuration] = useState('60')
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)

  const handleGenerate = () => {
    if (!topic || !selectedTemplate) {
      Taro.showToast({ title: '请填写内容和选择模板', icon: 'none' })
      return
    }

    setGenerating(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setGenerating(false)
          setResult({
            title: 'AI生成的视频标题',
            cover: '',
            duration: parseInt(duration)
          })
          return 100
        }
        return p + 10
      })
    }, 500)
  }

  const filteredTemplates = category === '全部' 
    ? templates 
    : templates.filter(t => t.category === category)

  return (
    <View className='ai-generate'>
      <View className='header'>
        <Text className='header-title'>AI一键成片</Text>
      </View>

      {step === 1 && (
        <ScrollView scrollY className='content'>
          <View className='section'>
            <View className='section-title'>选择模板类型</View>
            <View className='category-list'>
              {categories.map(cat => (
                <View 
                  key={cat} 
                  className={`category-item ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </View>
              ))}
            </View>
          </View>

          <View className='section'>
            <View className='section-title'>选择模板</View>
            <View className='template-grid'>
              {filteredTemplates.map(item => (
                <View 
                  key={item.id} 
                  className={`template-item ${selectedTemplate === item.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(item.id)}
                >
                  <View className='template-cover'>{item.style}</View>
                  <View className='template-name'>{item.name}</View>
                  <View className='template-category'>{item.category}</View>
                </View>
              ))}
            </View>
          </View>

          <View className='section'>
            <View className='section-title'>输入视频主题</View>
            <View className='input-box'>
              <Input 
                className='topic-input'
                placeholder='例如：推荐一款超好用的护肤品'
                value={topic}
                onInput={(e) => setTopic(e.detail.value)}
                maxlength={100}
              />
              <Text className='input-hint'>{topic.length}/100</Text>
            </View>
          </View>

          <View className='section'>
            <View className='section-title'>关键词（可选）</View>
            <View className='input-box'>
              <Input 
                className='keywords-input'
                placeholder='添加关键词，让视频更精准'
                value={keywords}
                onInput={(e) => setKeywords(e.detail.value)}
              />
            </View>
          </View>

          <View className='section'>
            <View className='section-title'>视频时长</View>
            <View className='duration-list'>
              {['30', '60', '90', '120'].map(d => (
                <View 
                  key={d} 
                  className={`duration-item ${duration === d ? 'active' : ''}`}
                  onClick={() => setDuration(d)}
                >
                  {d}秒
                </View>
              ))}
            </View>
          </View>

          <View className='generate-btn' onClick={handleGenerate}>
            一键生成视频
          </View>
        </ScrollView>
      )}

      {generating && (
        <View className='generating-overlay'>
          <View className='generating-box'>
            <View className='generating-icon'>🤖</View>
            <View className='generating-title'>AI正在生成中...</View>
            <View className='generating-progress'>
              <View className='progress-bar'>
                <View className='progress-fill' style={{ width: `${progress}%` }}></View>
              </View>
              <Text className='progress-text'>{progress}%</Text>
            </View>
            <View className='generating-tips'>
              <Text>• 智能匹配素材</Text>
              <Text>• 生成字幕文案</Text>
              <Text>• 合成背景音乐</Text>
            </View>
          </View>
        </View>
      )}

      {result && (
        <View className='result-overlay'>
          <View className='result-box'>
            <View className='result-title'>生成完成！</View>
            <View className='result-preview'>
              <View className='preview-cover'>🎬</View>
            </View>
            <View className='result-actions'>
              <View className='action-btn primary' onClick={() => Taro.navigateTo({ url: '/pages/editor/editor' }}>
                预览编辑
              </View>
              <View className='action-btn' onClick={() => setResult(null)}>
                重新生成
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
