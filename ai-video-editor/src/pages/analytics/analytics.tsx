import { View, Text, ScrollView } from '@tarojs/taro'
import './analytics.scss'

export default function Analytics() {
  const stats = {
    views: '12.8万',
    likes: '1.2万',
    comments: '856',
    shares: '320',
    fans: '2.8K',
    income: '¥580'
  }

  const videos = [
    { title: '种草视频1', views: '5.2万', likes: '5200', income: '¥280' },
    { title: '种草视频2', views: '3.8万', likes: '3800', income: '¥180' },
    { title: '种草视频3', views: '2.1万', likes: '2100', income: '¥120' },
  ]

  const trends = [
    { day: '周一', value: 65 },
    { day: '周二', value: 78 },
    { day: '周三', value: 82 },
    { day: '周四', value: 70 },
    { day: '周五', value: 90 },
    { day: '周六', value: 95 },
    { day: '周日', value: 88 },
  ]

  return (
    <View className='analytics'>
      <View className='header'>
        <Text className='header-title'>数据洞察</Text>
      </View>

      <ScrollView scrollY className='content'>
        <View className='overview-grid'>
          <View className='overview-item'>
            <Text className='overview-value'>{stats.views}</Text>
            <Text className='overview-label'>总播放</Text>
          </View>
          <View className='overview-item'>
            <Text className='overview-value'>{stats.likes}</Text>
            <Text className='overview-label'>总点赞</Text>
          </View>
          <View className='overview-item'>
            <Text className='overview-value'>{stats.fans}</Text>
            <Text className='overview-label'>粉丝</Text>
          </View>
          <View className='overview-item'>
            <Text className='overview-value'>{stats.income}</Text>
            <Text className='overview-label'>收入</Text>
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>播放趋势</View>
          <View className='chart'>
            <View className='chart-bars'>
              {trends.map(t => (
                <View key={t.day} className='chart-bar-wrapper'>
                  <View className='chart-bar' style={{ height: `${t.value}%` }}></View>
                  <Text className='chart-label'>{t.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>作品数据</View>
          <View className='video-list'>
            {videos.map((v, i) => (
              <View key={i} className='video-item'>
                <View className='video-rank'>{i + 1}</View>
                <View className='video-info'>
                  <Text className='video-title'>{v.title}</Text>
                  <Text className='video-stats'>{v.views}播放 · {v.likes}赞</Text>
                </View>
                <Text className='video-income'>{v.income}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='section'>
          <View className='section-title'>数据详情</View>
          <View className='detail-list'>
            <View className='detail-item'>
              <Text>播放量</Text>
              <Text className='detail-value'>{stats.views}</Text>
            </View>
            <View className='detail-item'>
              <Text>点赞数</Text>
              <Text className='detail-value'>{stats.likes}</Text>
            </View>
            <View className='detail-item'>
              <Text>评论数</Text>
              <Text className='detail-value'>{stats.comments}</Text>
            </View>
            <View className='detail-item'>
              <Text>分享数</Text>
              <Text className='detail-value'>{stats.shares}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
