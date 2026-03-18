import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { useAuth } from '@/services/useAuth'
import './points-mall.scss'

interface Goods {
  id: number
  name: string
  image: string
  price: number
  originalPrice: number
  stock: number
  category: string
}

const mockGoods: Goods[] = [
  { id: 1, name: 'VIP月卡', image: '', price: 900, originalPrice: 1900, stock: 999, category: 'vip' },
  { id: 2, name: 'VIP季卡', image: '', price: 2500, originalPrice: 4900, stock: 999, category: 'vip' },
  { id: 3, name: 'VIP年卡', image: '', price: 8000, originalPrice: 19900, stock: 999, category: 'vip' },
  { id: 4, name: '100积分', image: '', price: 100, originalPrice: 100, stock: 9999, category: 'points' },
  { id: 5, name: '500积分', image: '', price: 450, originalPrice: 500, stock: 9999, category: 'points' },
  { id: 6, name: '1000积分', image: '', price: 800, originalPrice: 1000, stock: 9999, category: 'points' },
  { id: 7, name: '定制模板', image: '', price: 5000, originalPrice: 10000, stock: 50, category: 'template' },
  { id: 8, name: 'AI次数包', image: '', price: 300, originalPrice: 600, stock: 999, category: 'ai' },
]

export default function PointsMall() {
  const [user] = useAuth()
  const [goods, setGoods] = useState<Goods[]>(mockGoods)
  const [activeTab, setActiveTab] = useState('all')
  const [points, setPoints] = useState(user?.points || 0)

  const tabs = [
    { key: 'all', name: '全部' },
    { key: 'vip', name: 'VIP卡' },
    { key: 'points', name: '积分' },
    { key: 'template', name: '模板' },
    { key: 'ai', name: 'AI次数' },
  ]

  const filteredGoods = activeTab === 'all' 
    ? goods 
    : goods.filter(g => g.category === activeTab)

  const handleBuy = async (item: Goods) => {
    if (points < item.price) {
      Taro.showToast({ title: '积分不足', icon: 'none' })
      return
    }

    Taro.showModal({
      title: '确认兑换',
      content: `确定要花费 ${item.price} 积分兑换 "${item.name}" 吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            Taro.showLoading({ title: '兑换中...' })
            await new Promise(resolve => setTimeout(resolve, 1000))
            setPoints(prev => prev - item.price)
            Taro.hideLoading()
            Taro.showToast({ title: '兑换成功', icon: 'success' })
          } catch (err) {
            Taro.hideLoading()
            Taro.showToast({ title: '兑换失败', icon: 'none' })
          }
        }
      }
    })
  }

  return (
    <View className='points-mall'>
      <View className='header'>
        <View className='header-title'>积分商城</View>
        <View className='points-display'>
          <Text className='points-value'>{points}</Text>
          <Text className='points-label'>当前积分</Text>
        </View>
      </View>

      <View className='earn-points'>
        <View className='earn-title'>赚积分</View>
        <View className='earn-list'>
          <View className='earn-item' onClick={() => Taro.navigateTo({ url: '/pages/invite/invite' })}>
            <Text className='earn-icon'>👥</Text>
            <Text className='earn-name'>邀请好友</Text>
            <Text className='earn-reward'>+100积分</Text>
          </View>
          <View className='earn-item' onClick={() => Taro.switchTab({ url: '/pages/projects/projects' })}>
            <Text className='earn-icon'>🎬</Text>
            <Text className='earn-name'>发布作品</Text>
            <Text className='earn-reward'>+50积分</Text>
          </View>
          <View className='earn-item'>
            <Text className='earn-icon'>📅</Text>
            <Text className='earn-name'>每日签到</Text>
            <Text className='earn-reward'>+10积分</Text>
          </View>
        </View>
      </View>

      <View className='tabs'>
        {tabs.map(tab => (
          <View 
            key={tab.key} 
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.name}
          </View>
        ))}
      </View>

      <ScrollView scrollY className='goods-list'>
        <View className='goods-grid'>
          {filteredGoods.map(item => (
            <View key={item.id} className='goods-item'>
              <View className='goods-image'>
                <Text className='goods-emoji'>
                  {item.category === 'vip' ? '👑' : 
                   item.category === 'points' ? '💎' : 
                   item.category === 'template' ? '🎨' : '🤖'}
                </Text>
              </View>
              <View className='goods-info'>
                <Text className='goods-name'>{item.name}</Text>
                <View className='goods-price'>
                  <Text className='price-value'>{item.price}</Text>
                  <Text className='price-unit'>积分</Text>
                  <Text className='price-original'>{item.originalPrice}</Text>
                </View>
                <Text className='goods-stock'>库存{item.stock}</Text>
              </View>
              <View 
                className={`goods-btn ${points < item.price ? 'disabled' : ''}`}
                onClick={() => handleBuy(item)}
              >
                兑换
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
