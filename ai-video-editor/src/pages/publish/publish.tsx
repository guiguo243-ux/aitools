import { useState } from 'react'
import { View, Text, Button, Input, Textarea } from '@tarojs/taro'
import { navigateBack, showToast } from '@tarojs/taro'
import './publish.scss'

type Platform = 'wechat' | 'moments' | 'douyin' | 'kuaishou'

export default function Publish() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['wechat'])
  const [isPublishing, setIsPublishing] = useState(false)

  const platforms = [
    { 
      key: 'wechat', 
      name: '微信', 
      icon: '💬',
      desc: '分享给好友'
    },
    { 
      key: 'moments', 
      name: '朋友圈', 
      icon: '📱',
      desc: '分享到朋友圈'
    },
    { 
      key: 'douyin', 
      name: '抖音', 
      icon: '🎵',
      desc: '发布到抖音'
    },
    { 
      key: 'kuaishou', 
      name: '快手', 
      icon: '⚡',
      desc: '发布到快手'
    }
  ]

  const hashtags = [
    '#智剪AI', '#视频创作', '#AI剪辑', '#短视频', 
    '#创意视频', '#剪辑神器', '#自动剪辑', '#AI视频'
  ]

  const togglePlatform = (key: Platform) => {
    if (selectedPlatforms.includes(key)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== key))
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, key])
    }
  }

  const addHashtag = (tag: string) => {
    if (!description.includes(tag)) {
      setDescription(description + ' ' + tag)
    }
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      showToast({ title: '请输入标题', icon: 'none' })
      return
    }
    if (selectedPlatforms.length === 0) {
      showToast({ title: '请选择发布平台', icon: 'none' })
      return
    }

    setIsPublishing(true)

    setTimeout(() => {
      setIsPublishing(false)
      showToast({ title: '发布成功！', icon: 'success' })
      setTimeout(() => navigateBack(), 1500)
    }, 2000)
  }

  const handleSaveDraft = () => {
    showToast({ title: '已保存到草稿', icon: 'success' })
    setTimeout(() => navigateBack(), 1000)
  }

  return (
    <View className="publish-page">
      <View className="header">
        <Button className="cancel-btn" onClick={() => navigateBack()}>取消</Button>
        <Text className="title">发布作品</Text>
        <Button 
          className="publish-btn" 
          onClick={handlePublish}
          loading={isPublishing}
        >
          {isPublishing ? '发布中' : '发布'}
        </Button>
      </View>

      <View className="content">
        <View className="preview-section">
          <View className="video-preview">
            <Text className="preview-icon">🎬</Text>
            <Text className="preview-text">视频预览</Text>
          </View>
        </View>

        <View className="form-section">
          <View className="form-item">
            <Text className="form-label">标题</Text>
            <Input 
              className="form-input"
              placeholder="请输入视频标题"
              value={title}
              onInput={(e: any) => setTitle(e.detail.value)}
              maxLength={50}
            />
            <Text className="form-count">{title.length}/50</Text>
          </View>

          <View className="form-item">
            <Text className="form-label">描述</Text>
            <Textarea 
              className="form-textarea"
              placeholder="说点什么..."
              value={description}
              onInput={(e: any) => setDescription(e.detail.value)}
              maxLength={500}
            />
            <Text className="form-count">{description.length}/500</Text>
          </View>

          <View className="hashtags-section">
            <Text className="form-label">添加话题</Text>
            <View className="hashtags-list">
              {hashtags.map(tag => (
                <View 
                  key={tag}
                  className={`hashtag ${description.includes(tag) ? 'active' : ''}`}
                  onClick={() => addHashtag(tag)}
                >
                  <Text>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="platforms-section">
            <Text className="form-label">发布平台</Text>
            <View className="platforms-grid">
              {platforms.map(platform => (
                <View 
                  key={platform.key}
                  className={`platform-item ${selectedPlatforms.includes(platform.key as Platform) ? 'selected' : ''}`}
                  onClick={() => togglePlatform(platform.key as Platform)}
                >
                  <Text className="platform-icon">{platform.icon}</Text>
                  <View className="platform-info">
                    <Text className="platform-name">{platform.name}</Text>
                    <Text className="platform-desc">{platform.desc}</Text>
                  </View>
                  <View className="platform-check">
                    {selectedPlatforms.includes(platform.key as Platform) && <Text>✓</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className="footer">
        <Button className="draft-btn" onClick={handleSaveDraft}>
          保存到草稿
        </Button>
      </View>
    </View>
  )
}
