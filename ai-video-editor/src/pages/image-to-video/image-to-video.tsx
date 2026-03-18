import { View, Text, Textarea, Input, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './image-to-video.scss'

export default function ImageToVideo() {
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [converting, setConverting] = useState(false)

  const handleConvert = () => {
    if (images.length === 0 && !content) {
      Taro.showToast({ title: '请输入内容或上传图片', icon: 'none' })
      return
    }

    setConverting(true)
    setTimeout(() => {
      setConverting(false)
      Taro.showToast({ title: '转换成功', icon: 'success' })
    }, 3000)
  }

  return (
    <View className='image-to-video'>
      <View className='header'>
        <Text className='header-title'>图文转视频</Text>
      </View>

      <ScrollView scrollY className='content'>
        <View className='upload-section'>
          <View className='upload-icon'>🖼️</View>
          <Text className='upload-text'>上传图片素材</Text>
          <Text className='upload-hint'>支持JPG、PNG格式，最多20张</Text>
        </View>

        <View className='section'>
          <View className='section-title'>视频标题</View>
          <View className='input-box'>
            <Input 
              placeholder='输入视频标题'
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>文案内容</View>
          <View className='textarea-box'>
            <Textarea 
              placeholder='输入文案内容，AI会自动匹配字幕和配音'
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              autoHeight
            />
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>配音</View>
          <View className='voice-list'>
            <View className='voice-item active'>🎤 女声-温柔</View>
            <View className='voice-item'>🎤 男声-成熟</View>
            <View className='voice-item'>🔇 静音</View>
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>背景音乐</View>
          <View className='music-list'>
            <View className='music-item active'>🎵 热门推荐</View>
            <View className='music-item'>🎵 舒缓</View>
            <View className='music-item'>🎵 动感</View>
          </View>
        </View>

        <View className='convert-btn' onClick={handleConvert}>
          一键转换
        </View>
      </ScrollView>

      {converting && (
        <View className='converting-overlay'>
          <View className='converting-box'>
            <View className='converting-icon'>⚡</View>
            <Text className='converting-text'>AI正在转换中...</Text>
          </View>
        </View>
      )}
    </View>
  )
}
