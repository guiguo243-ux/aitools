import { useState } from 'react'
import { View, Text, Button, Slider } from '@tarojs/taro'
import { navigateBack, showToast } from '@tarojs/taro'
import './export.scss'

type Resolution = '720p' | '1080p' | '4k'
type Quality = 'low' | 'medium' | 'high'

interface ExportProgress {
  stage: 'preparing' | 'processing' | 'encoding' | 'finalizing' | 'completed'
  progress: number
  message: string
}

export default function Export() {
  const [resolution, setResolution] = useState<Resolution>('1080p')
  const [quality, setQuality] = useState<Quality>('high')
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState<ExportProgress>({
    stage: 'preparing',
    progress: 0,
    message: '准备中...'
  })

  const resolutionOptions = [
    { key: '720p', label: '720P', desc: '适合分享到社交平台', size: '15MB/分钟' },
    { key: '1080p', label: '1080P', desc: '高清画质，推荐使用', size: '35MB/分钟' },
    { key: '4k', label: '4K', desc: '超高清画质，文件较大', size: '100MB/分钟' }
  ]

  const qualityOptions = [
    { key: 'low', label: '省流', desc: '文件更小', discount: 50 },
    { key: 'medium', label: '标准', desc: '平衡画质', discount: 0 },
    { key: 'high', label: '高清', desc: '最佳画质', extra: true }
  ]

  const stages = [
    { key: 'preparing', label: '准备中', icon: '📋' },
    { key: 'processing', label: '处理中', icon: '⚙️' },
    { key: 'encoding', label: '编码中', icon: '🔄' },
    { key: 'finalizing', label: '完成中', icon: '✨' },
    { key: 'completed', label: '完成', icon: '✅' }
  ]

  const getResolutionSize = () => {
    switch (resolution) {
      case '720p': return '1280 x 720'
      case '1080p': return '1920 x 1080'
      case '4k': return '3840 x 2160'
    }
  }

  const getFileSize = () => {
    const baseSize = resolution === '720p' ? 15 : resolution === '1080p' ? 35 : 100
    const qualityMultiplier = quality === 'low' ? 0.5 : quality === 'medium' ? 1 : 1.5
    return Math.round(baseSize * qualityMultiplier)
  }

  const startExport = async () => {
    setIsExporting(true)
    setProgress({ stage: 'preparing', progress: 0, message: '准备导出...' })

    const stageProgress = {
      preparing: { start: 0, end: 10, duration: 500 },
      processing: { start: 10, end: 40, duration: 1500 },
      encoding: { start: 40, end: 80, duration: 2000 },
      finalizing: { start: 80, end: 100, duration: 1000 }
    }

    const stages = ['preparing', 'processing', 'encoding', 'finalizing'] as const

    for (const stage of stages) {
      const { start, end, duration } = stageProgress[stage]
      const stepDuration = duration / ((end - start) / 5)

      for (let i = start; i <= end; i += 5) {
        await new Promise(resolve => setTimeout(resolve, stepDuration))
        setProgress({
          stage,
          progress: i,
          message: `正在${stages.find(s => s === stage) === 'preparing' ? '准备' : stages.find(s => s === stage) === 'processing' ? '处理' : stages.find(s => s === stage) === 'encoding' ? '编码' : '完成'}...`
        })
      }
    }

    setProgress({
      stage: 'completed',
      progress: 100,
      message: '导出完成！'
    })

    setTimeout(() => {
      showToast({
        title: '视频已保存到相册',
        icon: 'success'
      })
      setTimeout(() => navigateBack(), 1500)
    }, 500)
  }

  const cancelExport = () => {
    setIsExporting(false)
    setProgress({ stage: 'preparing', progress: 0, message: '准备中...' })
  }

  return (
    <View className="export-page">
      <View className="header">
        <Button className="back-btn" onClick={() => isExporting ? cancelExport() : navigateBack()}>
          {isExporting ? '取消' : '←'}
        </Button>
        <Text className="title">{isExporting ? '导出中' : '导出设置'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {!isExporting ? (
        <>
          <View className="content">
            <View className="section">
              <Text className="section-title">分辨率</Text>
              <View className="option-list">
                {resolutionOptions.map(opt => (
                  <View 
                    key={opt.key}
                    className={`option-item ${resolution === opt.key ? 'active' : ''}`}
                    onClick={() => setResolution(opt.key as Resolution)}
                  >
                    <View className="option-content">
                      <Text className="option-label">{opt.label}</Text>
                      <Text className="option-desc">{opt.desc}</Text>
                      <Text className="option-size">{opt.size}</Text>
                    </View>
                    <View className="option-check">
                      {resolution === opt.key && <Text>✓</Text>}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className="section">
              <Text className="section-title">画质</Text>
              <View className="option-list">
                {qualityOptions.map(opt => (
                  <View 
                    key={opt.key}
                    className={`option-item ${quality === opt.key ? 'active' : ''}`}
                    onClick={() => setQuality(opt.key as Quality)}
                  >
                    <View className="option-content">
                      <Text className="option-label">{opt.label}</Text>
                      <Text className="option-desc">
                        {opt.desc}
                        {opt.discount ? ` (省${opt.discount}%)` : ''}
                        {opt.extra ? ' (推荐)' : ''}
                      </Text>
                    </View>
                    <View className="option-check">
                      {quality === opt.key && <Text>✓</Text>}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className="info-section">
              <View className="info-item">
                <Text className="info-label">输出尺寸</Text>
                <Text className="info-value">{getResolutionSize()}</Text>
              </View>
              <View className="info-item">
                <Text className="info-label">帧率</Text>
                <Text className="info-value">30fps</Text>
              </View>
              <View className="info-item">
                <Text className="info-label">格式</Text>
                <Text className="info-value">MP4 (H.264)</Text>
              </View>
              <View className="info-item">
                <Text className="info-label">预计大小</Text>
                <Text className="info-value">约 {getFileSize()}MB</Text>
              </View>
            </View>
          </View>

          <View className="footer">
            <Button className="export-btn" onClick={startExport}>
              开始导出
            </Button>
          </View>
        </>
      ) : (
        <View className="exporting-content">
          <View className="progress-card">
            <View className="stages">
              {stages.map((stage, index) => {
                const stageIndex = stages.findIndex(s => s.key === progress.stage)
                const isActive = index === stageIndex
                const isCompleted = index < stageIndex
                return (
                  <View 
                    key={stage.key} 
                    className={`stage-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  >
                    <View className="stage-icon">
                      {isCompleted ? '✓' : stage.icon}
                    </View>
                    <Text className="stage-label">{stage.label}</Text>
                  </View>
                )
              })}
            </View>

            <View className="progress-info">
              <Text className="progress-message">{progress.message}</Text>
              <Text className="progress-percent">{progress.progress}%</Text>
            </View>

            <View className="progress-bar">
              <View className="progress-fill" style={{ width: `${progress.progress}%` }} />
            </View>

            <View className="progress-tips">
              <Text>💡 导出完成后将自动保存到相册</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
