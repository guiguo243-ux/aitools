import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './help.scss'

interface Guide {
  id: number
  title: string
  icon: string
  content: string
}

const guides: Guide[] = [
  { 
    id: 1, 
    title: '新手教程', 
    icon: '📖',
    content: '智剪AI是一款智能视频编辑工具，帮助您快速制作精美视频。\n\n1. 首页点击"剪同款"选择模板\n2. 上传您的照片或视频素材\n3. 选择音乐和滤镜\n4. 添加文字和贴纸\n5. 导出分享到社交平台'
  },
  { 
    id: 2, 
    title: '数字人教程', 
    icon: '🧑‍💻',
    content: '数字人功能可以生成AI数字人播报视频。\n\n1. 进入"数字人"页面\n2. 选择喜欢的数字人形象\n3. 输入要播报的文案\n4. 选择音色和语速\n5. 生成视频'
  },
  { 
    id: 3, 
    title: '剪同款教程', 
    icon: '✂️',
    content: '使用热门模板快速制作同款视频。\n\n1. 进入"剪同款"页面\n2. 浏览或搜索喜欢的模板\n3. 点击"剪同款"进入编辑\n4. 上传自己的素材\n5. 一键生成同款视频'
  },
  { 
    id: 4, 
    title: 'VIP特权', 
    icon: '👑',
    content: 'VIP会员享有以下特权：\n\n• 无限次导出高清视频\n• AI数字人无限使用\n• 专属模板素材\n• 极速渲染导出\n• 专属客服支持\n• 会员专属折扣'
  },
  { 
    id: 5, 
    title: '积分攻略', 
    icon: '💎',
    content: '获取积分的方式：\n\n• 每日签到 +10积分\n• 邀请好友 +100积分\n• 发布作品 +50积分\n• 完善个人资料 +20积分\n• 分享作品 +30积分\n\n积分用途：\n• 兑换VIP会员\n• 兑换精美模板\n• 兑换AI次数包'
  },
  { 
    id: 6, 
    title: '账号安全', 
    icon: '🔒',
    content: '保护账号安全建议：\n\n• 不要将账号密码透露给他人\n• 定期更换密码\n• 开启微信登录保护\n• 不要在非官方渠道购买VIP\n• 遇到问题联系官方客服'
  },
]

export default function Help() {
  return (
    <ScrollView scrollY className='help'>
      <View className='header'>
        <View className='header-title'>使用帮助</View>
      </View>

      <View className='version-info'>
        <Text className='version-text'>智剪AI v1.0.0</Text>
      </View>

      <View className='guide-list'>
        {guides.map(guide => (
          <View key={guide.id} className='guide-item'>
            <View className='guide-header'>
              <Text className='guide-icon'>{guide.icon}</Text>
              <Text className='guide-title'>{guide.title}</Text>
            </View>
            <View className='guide-content'>
              <Text>{guide.content}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className='footer'>
        <Text className='footer-text'>© 2024 智剪AI 保留所有权利</Text>
        <Text className='footer-link'>服务协议 · 隐私政策</Text>
      </View>
    </ScrollView>
  )
}
