import { View, Text, Input, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './batch-generate.scss'

export default function BatchGenerate() {
  const [count, setCount] = useState('10')
  const [template, setTemplate] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any[]>([])

  const handleGenerate = () => {
    if (!template) {
      Taro.showToast({ title: '请选择模板', icon: 'none' })
      return
    }

    setGenerating(true)
    setProgress(0)
    setResults([])

    let current = 0
    const interval = setInterval(() => {
      current += 10
      setProgress(current)

      if (current >= 100) {
        clearInterval(interval)
        setGenerating(false)
        setResults([
          { id: 1, status: 'success', title: '视频1' },
          { id: 2, status: 'success', title: '视频2' },
          { id: 3, status: 'success', title: '视频3' },
        ])
      }
    }, 300)
  }

  return (
    <View className='batch-generate'>
      <View className='header'>
        <Text className='header-title'>批量生成</Text>
      </View>

      <ScrollView scrollY className='content'>
        <View className='intro-card'>
          <View className='intro-icon'>📦</View>
          <View className='intro-title'>批量生成视频</View>
          <View className='intro-desc'>一次性生成多个视频，提高效率</View>
        </View>

        <View className='section'>
          <View className='section-title'>选择模板</View>
          <View className='template-select' onClick={() => setTemplate('selected')}>
            {template ? '✓ 已选择模板' : '+ 点击选择模板'}
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>生成数量</View>
          <View className='count-input'>
            <View className='count-btn' onClick={() => setCount(String(Math.max(1, parseInt(count) - 1))}>−</View>
            <Input 
              className='count-value'
              type='number'
              value={count}
              onInput={(e) => setCount(e.detail.value)}
            />
            <View className='count-btn' onClick={() => setCount(String(parseInt(count) + 1))}>+</View>
          </View>
          <View className='count-hint'>每次最多生成100个视频</View>
        </View>

        <View className='section'>
          <View className='section-title'>生成内容</View>
          <View className='content-list'>
            <View className='content-item'>
              <Text>📝 自动生成不同标题</Text>
            </View>
            <View className='content-item'>
              <Text>🏷️ 自动分配不同标签</Text>
            </View>
            <View className='content-item'>
              <Text>🎵 随机匹配背景音乐</Text>
            </View>
          </View>
        </View>

        <View className='generate-btn' onClick={handleGenerate}>
          开始批量生成
        </View>

        {results.length > 0 && (
          <View className='results-section'>
            <View className='results-title'>生成结果</View>
            {results.map(item => (
              <View key={item.id} className='result-item'>
                <View className='result-icon'>✅</View>
                <View className='result-name'>{item.title}</View>
                <View className='result-action'>编辑</View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {generating && (
        <View className='progress-overlay'>
          <View className='progress-box'>
            <Text className='progress-title'>批量生成中</Text>
            <View className='progress-bar'>
              <View className='progress-fill' style={{ width: `${progress}%` }}></View>
            </View>
            <Text className='progress-text'>{progress}%</Text>
          </View>
        </View>
      )}
    </View>
  )
}
