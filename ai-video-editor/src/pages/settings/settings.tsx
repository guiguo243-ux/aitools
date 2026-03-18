import { View, Text, Switch } from '@tarojs/taro'
import './settings.scss'

export default function Settings() {
  return (
    <View className="settings-page">
      <View className="header">
        <Text className="title">设置</Text>
      </View>

      <View className="content">
        <View className="section">
          <Text className="section-title">通用设置</Text>
          <View className="setting-item">
            <View className="setting-content">
              <Text className="setting-label">自动保存</Text>
              <Text className="setting-desc">自动保存编辑进度</Text>
            </View>
            <Switch checked={true} color="#2563EB" />
          </View>
          <View className="setting-item">
            <View className="setting-content">
              <Text className="setting-label">WiFi下自动下载</Text>
              <Text className="setting-desc">在WiFi环境下自动下载模板素材</Text>
            </View>
            <Switch checked={true} color="#2563EB" />
          </View>
          <View className="setting-item">
            <View className="setting-content">
              <Text className="setting-label">高清预览</Text>
              <Text className="setting-desc">编辑时显示高清预览</Text>
            </View>
            <Switch checked={false} color="#2563EB" />
          </View>
        </View>

        <View className="section">
          <Text className="section-title">导出设置</Text>
          <View className="setting-item">
            <View className="setting-content">
              <Text className="setting-label">默认分辨率</Text>
              <Text className="setting-desc">1080P</Text>
            </View>
            <Text className="setting-arrow">→</Text>
          </View>
          <View className="setting-item">
            <View className="setting-content">
              <Text className="setting-label">默认画质</Text>
              <Text className="setting-desc">高清</Text>
            </View>
            <Text className="setting-arrow">→</Text>
          </View>
        </View>

        <View className="section">
          <Text className="section-title">关于</Text>
          <View className="setting-item">
            <View className="setting-content">
              <Text className="setting-label">版本号</Text>
              <Text className="setting-desc">v1.0.0</Text>
            </View>
          </View>
          <View className="setting-item">
            <View className="setting-content">
              <Text className="setting-label">用户协议</Text>
            </View>
            <Text className="setting-arrow">→</Text>
          </View>
          <View className="setting-item">
            <View className="setting-content">
              <Text className="setting-label">隐私政策</Text>
            </View>
            <Text className="setting-arrow">→</Text>
          </View>
        </View>

        <View className="logout-section">
          <Text className="logout-btn">退出登录</Text>
        </View>
      </View>
    </View>
  )
}
