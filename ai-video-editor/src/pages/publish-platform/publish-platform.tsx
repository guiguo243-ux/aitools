import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './publish-platform.scss'

const platforms = [
  { id: 'douyin', name: '抖音', icon: '🎵', connected: true },
  { id: 'kuaishou', name: '快手', icon: '🎯', connected: true },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', connected: false },
  { id: 'bilibili', name: 'B站', icon: '📺', connected: false },
  { id: 'weixin', name: '视频号', icon: '💬', connected: true },
  { id: 'youtube', icon: '📹', name: 'YouTube', connected: false },
]

export default function PublishPlatform() {
  const [selected, setSelected] = useState<string[]>(['douyin'])
  const [title, setTitle] = useState('测试视频')

  const togglePlatform = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(p => p !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const handlePublish = () => {
    if (selected.length === 0) {
      Taro.showToast({ title: '请选择发布平台', icon: 'none' })
      return
    }
    Taro.showToast({ title: '发布中...', icon: 'none' })
    setTimeout(() => {
      Taro.showToast({ title: '发布成功', icon: 'success' })
    }, 2000)
  }

  return (
    <View className='publish-platform'>
      <View className='header'>
        <Text className='header-title'>多平台发布</Text>
      <Text className='header-sub'>一键分发到多个平台</Text>
      </View>

      <ScrollView scrollY className='content'>
        <View className='section'>
          <View className='section-title'>选择平台</View>
          <View className='platform-grid'>
            {platforms.map(p => (
              <View 
                key={p.id} 
                className={`platform-item ${selected.includes(p.id) ? 'selected' : ''} ${!p.connected ? 'disabled' : ''}`}
                onClick={() => p.connected && togglePlatform(p.id)}
              >
                <View className='platform-icon'>{p.icon}</View>
                <View className='platform-name'>{p.name}</View>
                {!p.connected && <View className='platform-tip'>未绑定</View>}
              </View>
            ))}
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>视频标题</View>
          <View className='input-box'>
            <input 
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>发布设置</View>
          <View className='settings-list'>
            <View className='setting-item'>
              <Text>同步到主页</Text>
              <View className='switch on'></View>
            </View>
            <View className='setting-item'>
              <Text>开启评论</Text>
              <View className='switch on'></View>
            </View>
            <View className='setting-item'>
              <Text>仅自己可见</Text>
              <View className='switch'></View>
            </View>
          </View>
        </View>

        <View className='publish-btn' onClick={handlePublish}>
          立即发布 ({selected.length}个平台)
        </View>
      </ScrollView>
    </View>
  )
}
