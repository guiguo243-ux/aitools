import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './smart-copy.scss'

const copyTypes = [
  { id: 1, name: '种草文案', icon: '🛍️' },
  { id: 2, name: '短视频脚本', icon: '🎬' },
  { id: 3, name: '朋友圈文案', icon: '📱' },
  { id: 4, name: '直播话术', icon: '📢' },
  { id: 5, name: '商品描述', icon: '🎁' },
  { id: 6, name: '品牌故事', icon: '📖' },
]

const tones = [
  { id: 'humor', name: '幽默风趣' },
  { id: 'warm', name: '温暖走心' },
  { id: 'professional', name: '专业正式' },
  { id: 'casual', name: '轻松随意' },
]

export default function SmartCopy() {
  const [copyType, setCopyType] = useState(1)
  const [tone, setTone] = useState('warm')
  const [product, setProduct] = useState('')
  const [features, setFeatures] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')

  const handleGenerate = () => {
    if (!product) {
      Taro.showToast({ title: '请输入产品名称', icon: 'none' })
      return
    }

    setGenerating(true)

    setTimeout(() => {
      setGenerating(false)
      setResult(`【${copyTypes.find(t => t.id === copyType)?.name}】

🎯 产品：${product}

✨ 亮点：
${features || '• 超高性价比\n• 品质保证\n• 限时优惠'}

📝 推荐文案：

${copyType === 1 ? `姐妹们！今天必须给你们安利这个${product}！👍

说实话我之前也用过不少同款，但是这款真的绝了！✨

最让我惊喜的是它的${features ? features.split('，')[0] : '使用效果'}，用了半个多月感觉整个人都提升了幸福感🥰

而且现在还有活动价，真的太划算了！错过等一年！💕

#${product} #好物分享 #真实测评` : 
copyType === 2 ? `[开场]
嘿，朋友们！今天来聊聊${product}！

[产品介绍]
这个产品真的太绝了，特别是它的${features ? features.split('，')[0] : '核心功能'}，完全颠覆我的认知！

[使用感受]
说实话刚开始我也没抱太大希望，但是用了之后...

[结尾]
好了今天的分享就到这里，喜欢的话记得点赞关注！

#${product} #好物推荐 #测评` :
copyType === 3 ? `${product}YYDS！👍

用了一段时间真的爱了，尤其是${features ? features.split('，')[0] : '这一点'}，太戳我了😭

姐妹们可以冲了，真的不踩雷！💕

#${product} #我的自用好物 #真实分享` :
      `【${product}】

${features || '高品质、更专业、更贴心'}
让我们一起遇见更好的自己！✨`}`)
    }, 2000)
  }

  return (
    <View className='smart-copy'>
      <View className='header'>
        <Text className='header-title'>智能文案</Text>
      </View>

      <ScrollView scrollY className='content'>
        <View className='section'>
          <View className='section-title'>选择文案类型</View>
          <View className='type-grid'>
            {copyTypes.map(item => (
              <View 
                key={item.id} 
                className={`type-item ${copyType === item.id ? 'active' : ''}`}
                onClick={() => setCopyType(item.id)}
              >
                <View className='type-icon'>{item.icon}</View>
                <View className='type-name'>{item.name}</View>
              </View>
            ))}
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>选择风格</View>
          <View className='tone-list'>
            {tones.map(item => (
              <View 
                key={item.id} 
                className={`tone-item ${tone === item.id ? 'active' : ''}`}
                onClick={() => setTone(item.id)}
              >
                {item.name}
              </View>
            ))}
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>产品/主题名称</View>
          <View className='input-box'>
            <Input 
              placeholder='输入产品名称或视频主题'
              value={product}
              onInput={(e) => setProduct(e.detail.value)}
            />
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>产品特点（可选）</View>
          <View className='input-box'>
            <Textarea 
              placeholder='输入产品的主要特点和优势，用逗号分隔'
              value={features}
              onInput={(e) => setFeatures(e.detail.value)}
              autoHeight
            />
          </View>
        </View>

        <View className='generate-btn' onClick={handleGenerate}>
          一键生成文案
        </View>

        {result && (
          <View className='result-box'>
            <View className='result-header'>
              <Text className='result-title'>生成结果</Text>
              <Text className='copy-btn' onClick={() => {
                Taro.setClipboardData({ data: result })
                Taro.showToast({ title: '已复制', icon: 'success' })
              }}>复制</Text>
            </View>
            <Text className='result-content'>{result}</Text>
          </View>
        )}
      </ScrollView>

      {generating && (
        <View className='loading-overlay'>
          <View className='loading-box'>
            <View className='loading-icon'>✨</View>
            <Text className='loading-text'>AI正在生成中...</Text>
          </View>
        </View>
      )}
    </View>
  )
}
