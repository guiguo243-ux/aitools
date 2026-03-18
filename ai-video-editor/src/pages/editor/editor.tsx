import { useState, useRef, useCallback } from 'react'
import { View, Text, ScrollView, Button, Input, Slider } from '@tarojs/taro'
import { navigateBack } from '@tarojs/taro'
import VideoPlayer from '../../components/editor/videoPlayer'
import Timeline, { TimelineClip } from '../../components/editor/timeline'
import './editor.scss'

type EditorTab = 'media' | 'cut' | 'text' | 'filter' | 'audio' | 'effect'

interface VideoClip extends TimelineClip {
  filter?: string
  brightness?: number
  contrast?: number
  saturation?: number
}

export default function Editor() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180)
  const [videoSrc, setVideoSrc] = useState('')
  const [activeTab, setActiveTab] = useState<EditorTab>('media')
  const [clips, setClips] = useState<VideoClip[]>([])
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [textOverlays, setTextOverlays] = useState<any[]>([])
  const [audioTracks, setAudioTracks] = useState<any[]>([])
  const [filterSettings, setFilterSettings] = useState({
    filter: 'none',
    brightness: 50,
    contrast: 50,
    saturation: 50
  })
  const playerRef = useRef<any>(null)

  const tabs: { key: EditorTab; label: string; icon: string }[] = [
    { key: 'media', label: '素材', icon: '📁' },
    { key: 'cut', label: '剪辑', icon: '✂️' },
    { key: 'text', label: '文字', icon: '🔤' },
    { key: 'filter', label: '滤镜', icon: '🎨' },
    { key: 'audio', label: '音频', icon: '🎵' },
    { key: 'effect', label: '特效', icon: '✨' }
  ]

  const filters = [
    { id: 'none', name: '原声' },
    { id: 'warm', name: '暖阳' },
    { id: 'cool', name: '清爽' },
    { id: 'retro', name: '复古' },
    { id: 'movie', name: '电影' },
    { id: 'vintage', name: '怀旧' },
    { id: 'forest', name: '森林' },
    { id: 'ocean', name: '海洋' }
  ]

  const textStyles = [
    { id: 'title', name: '标题', fontSize: 32, fontWeight: 'bold' },
    { id: 'subtitle', name: '副标题', fontSize: 24, fontWeight: '500' },
    { id: 'caption', name: '说明', fontSize: 18 },
    { id: 'subtitle2', name: '字幕', fontSize: 16 }
  ]

  const effects = [
    { id: '1', name: '雪花', icon: '❄️' },
    { id: '2', name: '光效', icon: '✨' },
    { id: '3', name: '粒子', icon: '💫' },
    { id: '4', name: '边框', icon: '🖼️' },
    { id: '5', name: '模糊', icon: '🌫️' },
    { id: '6', name: '抖动', icon: '📳' }
  ]

  const handleImportVideo = () => {
    uni.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      success: (res) => {
        setVideoSrc(res.tempFilePath)
        setDuration(Math.ceil(res.duration))
        const newClip: VideoClip = {
          id: Date.now().toString(),
          source: res.tempFilePath,
          startTime: 0,
          endTime: res.duration,
          duration: res.duration,
          name: '视频1'
        }
        setClips([...clips, newClip])
      }
    })
  }

  const handleImportImage = () => {
    uni.chooseImage({
      count: 9,
      success: (res) => {
        res.tempFilePaths.forEach((path, index) => {
          const newClip: VideoClip = {
            id: (Date.now() + index).toString(),
            source: path,
            startTime: duration,
            endTime: duration + 5,
            duration: 5,
            name: `图片${index + 1}`
          }
          setClips(prev => [...prev, newClip])
        })
        setDuration(duration + 5 * res.tempFilePaths.length)
      }
    })
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (time: number) => {
    setCurrentTime(time)
  }

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
    if (time >= duration) {
      setIsPlaying(false)
    }
  }

  const handleClipClick = (clip: TimelineClip) => {
    setSelectedClipId(clip.id)
    setCurrentTime(clip.startTime)
  }

  const handleClipDelete = (clipId: string) => {
    setClips(clips.filter(c => c.id !== clipId))
    if (selectedClipId === clipId) {
      setSelectedClipId(null)
    }
  }

  const handleAddText = () => {
    const newText = {
      id: Date.now().toString(),
      content: '双击编辑文字',
      style: 'title',
      startTime: currentTime,
      endTime: currentTime + 5,
      x: 50,
      y: 50
    }
    setTextOverlays([...textOverlays, newText])
  }

  const handleFilterChange = (filterId: string) => {
    setFilterSettings({ ...filterSettings, filter: filterId })
  }

  const handleAdjustmentChange = (key: string, value: number) => {
    setFilterSettings({ ...filterSettings, [key]: value })
  }

  const handleSpeedChange = (speed: number) => {
    if (selectedClipId) {
      setClips(clips.map(c => {
        if (c.id === selectedClipId) {
          return { ...c, speed }
        }
        return c
      }))
    }
  }

  const handleTrimStart = (time: number) => {
    if (selectedClipId) {
      setClips(clips.map(c => {
        if (c.id === selectedClipId) {
          return { ...c, trimStart: time, startTime: time }
        }
        return c
      }))
    }
  }

  const handleTrimEnd = (time: number) => {
    if (selectedClipId) {
      setClips(clips.map(c => {
        if (c.id === selectedClipId) {
          return { ...c, trimEnd: time, endTime: time }
        }
        return c
      }))
    }
  }

  const handleExport = () => {
    uni.navigateTo({ url: '/pages/export/export' })
  }

  const selectedClip = clips.find(c => c.id === selectedClipId)

  return (
    <View className="editor-page">
      <View className="editor-header">
        <Button className="back-btn" onClick={() => navigateBack()}>←</Button>
        <Text className="title">视频编辑</Text>
        <Button className="export-btn" onClick={handleExport}>导出</Button>
      </View>

      <View className="preview-area">
        <VideoPlayer
          src={videoSrc}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {textOverlays.map(text => (
          <View 
            key={text.id}
            className="text-overlay"
            style={{ left: `${text.x}%`, top: `${text.y}%` }}
          >
            <Text>{text.content}</Text>
          </View>
        ))}

        <View className="playback-controls">
          <View className="time-display">
            <Text>{formatTime(currentTime)}</Text>
            <Text className="time-separator">/</Text>
            <Text>{formatTime(duration)}</Text>
          </View>
          <View className="control-btns">
            <Button className="control-btn" onClick={() => handleSeek(Math.max(0, currentTime - 10))}>−</Button>
            <Button className="play-btn" onClick={handlePlayPause}>
              {isPlaying ? '⏸️' : '▶️'}
            </Button>
            <Button className="control-btn" onClick={() => handleSeek(Math.min(duration, currentTime + 10))}>+</Button>
          </View>
        </View>
      </View>

      <Timeline
        duration={duration}
        currentTime={currentTime}
        clips={clips}
        onSeek={handleSeek}
        onClipClick={handleClipClick}
        onClipDelete={handleClipDelete}
        onAddClip={handleImportVideo}
      />

      <View className="tab-bar">
        {tabs.map(tab => (
          <View 
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className="tab-icon">{tab.icon}</Text>
            <Text className="tab-label">{tab.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className="tool-panel">
        {activeTab === 'media' && (
          <View className="media-panel">
            <View className="media-import-grid">
              <View className="media-import-item" onClick={handleImportVideo}>
                <Text className="media-icon">🎬</Text>
                <Text className="media-label">导入视频</Text>
              </View>
              <View className="media-import-item" onClick={handleImportImage}>
                <Text className="media-icon">🖼️</Text>
                <Text className="media-label">导入图片</Text>
              </View>
              <View className="media-import-item">
                <Text className="media-icon">📷</Text>
                <Text className="media-label">拍摄</Text>
              </View>
            </View>

            {clips.length > 0 && (
              <View className="clips-section">
                <Text className="section-title">已添加片段 ({clips.length})</Text>
                <ScrollView scrollX className="clips-scroll">
                  <View className="clips-list">
                    {clips.map((clip, index) => (
                      <View 
                        key={clip.id} 
                        className={`clip-item ${selectedClipId === clip.id ? 'selected' : ''}`}
                        onClick={() => handleClipClick(clip)}
                      >
                        <View className="clip-thumbnail">
                          <Text>🎬</Text>
                        </View>
                        <Text className="clip-name">{clip.name}</Text>
                        <Text className="clip-duration">{formatTime(clip.duration)}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {activeTab === 'cut' && (
          <View className="cut-panel">
            {selectedClip ? (
              <>
                <View className="cut-section">
                  <Text className="section-title">分割</Text>
                  <View className="cut-buttons">
                    <Button className="cut-btn" onClick={() => handleTrimStart(currentTime)}>
                      设为起点
                    </Button>
                    <Button className="cut-btn" onClick={() => handleTrimEnd(currentTime)}>
                      设为终点
                    </Button>
                  </View>
                </View>

                <View className="speed-section">
                  <Text className="section-title">变速 ({selectedClip.speed || 1}x)</Text>
                  <View className="speed-slider">
                    <Text>0.5x</Text>
                    <Slider 
                      min={0.5} 
                      max={2} 
                      step={0.1} 
                      value={selectedClip.speed || 1}
                      onChange={(e: any) => handleSpeedChange(e.detail.value)}
                    />
                    <Text>2x</Text>
                  </View>
                </View>

                <View className="trim-section">
                  <Text className="section-title">裁剪范围</Text>
                  <View className="trim-info">
                    <Text>起点: {formatTime(selectedClip.startTime)}</Text>
                    <Text>终点: {formatTime(selectedClip.endTime)}</Text>
                    <Text>时长: {formatTime(selectedClip.endTime - selectedClip.startTime)}</Text>
                  </View>
                </View>
              </>
            ) : (
              <View className="empty-tip">
                <Text>请先选择一个视频片段</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'text' && (
          <View className="text-panel">
            <View className="add-text-btn" onClick={handleAddText}>
              <Text>+ 添加文字</Text>
            </View>
            
            <View className="text-styles">
              <Text className="section-title">文字样式</Text>
              <View className="style-grid">
                {textStyles.map(style => (
                  <View key={style.id} className="style-item">
                    <Text 
                      className="style-preview"
                      style={{ fontSize: style.fontSize + 'px', fontWeight: style.fontWeight as any }}
                    >
                      {style.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {textOverlays.length > 0 && (
              <View className="text-list-section">
                <Text className="section-title">已添加文字 ({textOverlays.length})</Text>
                {textOverlays.map(text => (
                  <View key={text.id} className="text-item">
                    <Text>{text.content}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'filter' && (
          <View className="filter-panel">
            <Text className="section-title">视频滤镜</Text>
            <ScrollView scrollX className="filter-scroll">
              <View className="filter-list">
                {filters.map(filter => (
                  <View 
                    key={filter.id} 
                    className={`filter-item ${filterSettings.filter === filter.id ? 'active' : ''}`}
                    onClick={() => handleFilterChange(filter.id)}
                  >
                    <View className="filter-preview">
                      <Text className="filter-icon">🎨</Text>
                    </View>
                    <Text className="filter-name">{filter.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View className="adjust-section">
              <Text className="section-title">画面调节</Text>
              <View className="adjust-item">
                <Text className="adjust-label">亮度</Text>
                <Slider 
                  min={0} 
                  max={100} 
                  value={filterSettings.brightness}
                  onChange={(e: any) => handleAdjustmentChange('brightness', e.detail.value)}
                />
              </View>
              <View className="adjust-item">
                <Text className="adjust-label">对比度</Text>
                <Slider 
                  min={0} 
                  max={100} 
                  value={filterSettings.contrast}
                  onChange={(e: any) => handleAdjustmentChange('contrast', e.detail.value)}
                />
              </View>
              <View className="adjust-item">
                <Text className="adjust-label">饱和度</Text>
                <Slider 
                  min={0} 
                  max={100} 
                  value={filterSettings.saturation}
                  onChange={(e: any) => handleAdjustmentChange('saturation', e.detail.value)}
                />
              </View>
            </View>
          </View>
        )}

        {activeTab === 'audio' && (
          <View className="audio-panel">
            <View className="audio-category" onClick={() => uni.chooseMessageFile({ type: 'audio' })}>
              <Text className="audio-icon">🎵</Text>
              <View className="audio-category-info">
                <Text className="audio-name">背景音乐</Text>
                <Text className="audio-desc">从本地添加</Text>
              </View>
            </View>
            <View className="audio-category">
              <Text className="audio-icon">🎤</Text>
              <View className="audio-category-info">
                <Text className="audio-name">配音录制</Text>
                <Text className="audio-desc">录制配音</Text>
              </View>
            </View>
            <View className="audio-category">
              <Text className="audio-icon">🔊</Text>
              <View className="audio-category-info">
                <Text className="audio-name">音效素材</Text>
                <Text className="audio-desc">添加音效</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'effect' && (
          <View className="effect-panel">
            <Text className="section-title">特效素材</Text>
            <View className="effect-grid">
              {effects.map(effect => (
                <View key={effect.id} className="effect-item">
                  <Text className="effect-icon">{effect.icon}</Text>
                  <Text className="effect-name">{effect.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}
