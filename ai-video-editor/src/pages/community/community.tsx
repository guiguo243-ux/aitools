import { View, Text, ScrollView } from '@tarojs/taro'
import { useState } from 'react'
import './community.scss'

const posts = [
  { id: 1, author: '视频达人', avatar: '🎬', title: '分享一个超火的模板', content: '这个模板真的太好用了...', likes: 1280, comments: 56 },
  { id: 2, author: '创作新手', avatar: '📱', title: '新人报道', content: '刚入门短视频创作...', likes: 89, comments: 12 },
  { id: 3, author: '运营老王', avatar: '💼', title: '变现心得', content: '做短视频半年收入破万...', likes: 2560, comments: 128 },
]

export default function Community() {
  return (
    <View className='community'>
      <View className='header'>
        <Text className='header-title'>创作者社区</Text>
      </View>

      <View className='tabs'>
        <View className='tab active'>推荐</View>
        <View className='tab'>关注</View>
        <View className='tab'>热门</View>
      </View>

      <ScrollView scrollY className='feed'>
        {posts.map(post => (
          <View key={post.id} className='post-card'>
            <View className='post-header'>
              <View className='post-avatar'>{post.avatar}</View>
              <View className='post-info'>
                <View className='post-author'>{post.author}</View>
                <View className='post-time'>2小时前</View>
              </View>
              <View className='follow-btn'>+ 关注</View>
            </View>
            <View className='post-title'>{post.title}</View>
            <View className='post-content'>{post.content}</View>
            <View className='post-media'>
              <View className='media-placeholder'>📹</View>
            </View>
            <View className='post-actions'>
              <View className='action-item'>
                <Text>❤️ {post.likes}</Text>
              </View>
              <View className='action-item'>
                <Text>💬 {post.comments}</Text>
              </View>
              <View className='action-item'>
                <Text>🔗 分享</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className='fab'>+</View>
    </View>
  )
}
