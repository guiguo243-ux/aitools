import { useState } from 'react'
import { View, Text, Button, ScrollView } from '@tarojs/taro'
import { navigateBack } from '@tarojs/taro'
import './vip.scss'

type VIPDuration = 'month' | 'quarter' | 'year' | 'lifetime'

export default function VIP() {
  const [selectedDuration, setSelectedDuration] = useState<VIPDuration>('year')
  const [isPurchasing, setIsPurchasing] = useState(false)

  const vipPlans = [
    {
      key: 'month',
      label: '月卡',
      originalPrice: 30,
      price: 19,
      badge: null,
      features: ['高清导出', 'AI功能无限用', '专属素材']
    },
    {
      key: 'quarter',
      label: '季卡',
      originalPrice: 80,
      price: 49,
      badge: '省31元',
      features: ['高清导出', 'AI功能无限用', '专属素材', '优先处理']
    },
    {
      key: 'year',
      label: '年卡',
      originalPrice: 298,
      price: 128,
      badge: '省170元',
      popular: true,
      features: ['高清导出', 'AI功能无限用', '专属素材', '优先处理', '专属客服']
    },
    {
      key: 'lifetime',
      label: '终身卡',
      originalPrice: 998,
      price: 398,
      badge: '省600元',
      features: ['高清导出', 'AI功能无限用', '专属素材', '优先处理', '专属客服', '终身免费更新']
    }
  ]

  const vipFeatures = [
    { icon: '⬆️', title: '高清导出', desc: '4K超清画质导出' },
    { icon: '🤖', title: 'AI无限用', desc: '所有AI功能无限次使用' },
    { icon: '🎨', title: '专属素材', desc: 'VIP专属素材库' },
    { icon: '⚡', title: '优先处理', desc: '导出排队优先' },
    { icon: '🎁', title: '专属客服', desc: '1v1专属客服' },
    { icon: '🔄', title: '免费更新', desc: '终身免费更新' }
  ]

  const handlePurchase = async () => {
    setIsPurchasing(true)
    
    setTimeout(() => {
      setIsPurchasing(false)
      uni.showToast({
        title: '购买成功！',
        icon: 'success'
      })
      setTimeout(() => navigateBack(), 1500)
    }, 2000)
  }

  return (
    <View className="vip-page">
      <View className="header">
        <Button className="back-btn" onClick={() => navigateBack()}>←</Button>
        <Text className="title">VIP会员</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView scrollY className="vip-content">
        <View className="vip-banner">
          <View className="banner-content">
            <View className="vip-badge">
              <Text>VIP</Text>
            </View>
            <Text className="banner-title">开通会员</Text>
            <Text className="banner-desc">享全站特权，创作无忧</Text>
          </View>
        </View>

        <View className="plans-section">
          <Text className="section-title">选择套餐</Text>
          <View className="plans-grid">
            {vipPlans.map(plan => (
              <View 
                key={plan.key}
                className={`plan-card ${selectedDuration === plan.key ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                onClick={() => setSelectedDuration(plan.key as VIPDuration)}
              >
                {plan.badge && (
                  <View className="plan-badge">
                    <Text>{plan.badge}</Text>
                  </View>
                )}
                {plan.popular && (
                  <View className="popular-badge">
                    <Text>超值</Text>
                  </View>
                )}
                <Text className="plan-label">{plan.label}</Text>
                <View className="plan-prices">
                  <Text className="plan-price">¥{plan.price}</Text>
                  <Text className="plan-original">¥{plan.originalPrice}</Text>
                </View>
                {selectedDuration === plan.key && (
                  <View className="plan-check">
                    <Text>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View className="features-section">
          <Text className="section-title">会员权益</Text>
          <View className="features-grid">
            {vipFeatures.map((feature, index) => (
              <View key={index} className="feature-item">
                <Text className="feature-icon">{feature.icon}</Text>
                <View className="feature-info">
                  <Text className="feature-title">{feature.title}</Text>
                  <Text className="feature-desc">{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="tips-section">
          <Text className="tips-title">温馨提示</Text>
          <Text className="tips-text">
            • 会员有效期从购买成功后开始计算
          </Text>
          <Text className="tips-text">
            • 会员期间可随时取消续费
          </Text>
          <Text className="tips-text">
            • 虚拟商品，购买后不支持退款
          </Text>
        </View>
      </ScrollView>

      <View className="footer">
        <View className="price-info">
          <Text className="price-label">应付:</Text>
          <Text className="price-value">
            ¥{vipPlans.find(p => p.key === selectedDuration)?.price}
          </Text>
        </View>
        <Button 
          className="purchase-btn" 
          onClick={handlePurchase}
          loading={isPurchasing}
        >
          {isPurchasing ? '处理中...' : '立即开通'}
        </Button>
      </View>
    </View>
  )
}
