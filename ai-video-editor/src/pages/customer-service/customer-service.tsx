import { View, Text, Button, Input } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './customer-service.scss'

interface FAQ {
  id: number
  question: string
  answer: string
}

const faqList: FAQ[] = [
  { id: 1, question: '如何开通VIP会员？', answer: '点击「我的」-「VIP会员」即可选择套餐开通，支持微信支付。' },
  { id: 2, question: '积分有什么用？', answer: '积分可以在积分商城兑换VIP卡、模板、AI次数等商品。' },
  { id: 3, question: '如何导出视频？', answer: '在编辑器中点击右上角「导出」按钮，选择分辨率和画质后即可导出。' },
  { id: 4, question: '视频导出失败怎么办？', answer: '请检查网络连接是否稳定，存储空间是否充足，或尝试重新登录后再次导出。' },
  { id: 5, question: '如何联系人工客服？', answer: '点击下方「联系客服」按钮，工作时间9:00-21:00有人工客服在线。' },
  { id: 6, question: 'VIP可以退款吗？', answer: 'VIP会员购买后7天内可申请退款，超过7天不支持退款。' },
]

export default function CustomerService() {
  const [searchText, setSearchText] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<{id: number, text: string, isSelf: boolean}[]>([
    { id: 1, text: '您好，请问有什么可以帮助您的？', isSelf: false }
  ])
  const [inputText, setInputText] = useState('')

  const filteredFAQ = searchText 
    ? faqList.filter(f => f.question.includes(searchText) || f.answer.includes(searchText))
    : faqList

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const sendMessage = () => {
    if (!inputText.trim()) return
    
    setMessages(prev => [...prev, { id: Date.now(), text: inputText, isSelf: true }])
    setInputText('')
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: '感谢您的留言，我们的工作人员将尽快回复您。', 
        isSelf: false 
      }])
    }, 1000)
  }

  const callService = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-8888',
      fail: () => {
        Taro.showToast({ title: '拨打电话失败', icon: 'none' })
      }
    })
  }

  return (
    <View className='customer-service'>
      <View className='header'>
        <View className='header-title'>客服与帮助</View>
      </View>

      <View className='search-box'>
        <Input 
          className='search-input'
          placeholder='搜索问题...'
          value={searchText}
          onInput={(e) => setSearchText(e.detail.value)}
        />
      </View>

      <View className='contact-bar'>
        <View className='contact-item' onClick={callService}>
          <Text className='contact-icon'>📞</Text>
          <Text className='contact-name'>电话客服</Text>
        </View>
        <View className='contact-item' onClick={() => setShowChat(true)}>
          <Text className='contact-icon'>💬</Text>
          <Text className='contact-name'>在线客服</Text>
        </View>
        <View className='contact-item'>
          <Text className='contact-icon'>📧</Text>
          <Text className='contact-name'>邮件联系</Text>
        </View>
      </View>

      <View className='faq-section'>
        <View className='section-title'>常见问题</View>
        <View className='faq-list'>
          {filteredFAQ.map(item => (
            <View key={item.id} className='faq-item'>
              <View className='faq-question' onClick={() => toggleExpand(item.id)}>
                <Text>Q: {item.question}</Text>
                <Text className='faq-arrow'>{expandedId === item.id ? '▲' : '▼'}</Text>
              </View>
              {expandedId === item.id && (
                <View className='faq-answer'>
                  <Text>A: {item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      <View className='feedback-section'>
        <View className='section-title'>意见反馈</View>
        <View className='feedback-box'>
          <textarea 
            className='feedback-input'
            placeholder='请描述您遇到的问题或建议...'
            maxLength={500}
          />
          <View className='feedback-submit'>提交反馈</View>
        </View>
      </View>

      {showChat && (
        <View className='chat-overlay' onClick={() => setShowChat(false)}>
          <View className='chat-box' onClick={(e) => e.stopPropagation()}>
            <View className='chat-header'>
              <Text>在线客服</Text>
              <Text className='chat-close' onClick={() => setShowChat(false)}>✕</Text>
            </View>
            <View className='chat-messages'>
              {messages.map(msg => (
                <View key={msg.id} className={`chat-message ${msg.isSelf ? 'self' : ''}`}>
                  <Text>{msg.text}</Text>
                </View>
              ))}
            </View>
            <View className='chat-input-box'>
              <input 
                className='chat-input'
                placeholder='请输入...'
                value={inputText}
                onInput={(e) => setInputText(e.detail.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <View className='chat-send' onClick={sendMessage}>发送</View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
