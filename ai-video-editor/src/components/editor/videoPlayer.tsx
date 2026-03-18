import { useState, useRef, useEffect } from 'react'
import { View, Text, Video, Image, Canvas } from '@tarojs/components'
import { createSelectorQuery } from '@tarojs/taro'
import './videoPlayer.scss'

interface VideoPlayerProps {
  src?: string
  poster?: string
  initialTime?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onProgress?: (buffered: number) => void
  onReady?: () => void
  onError?: (error: string) => void
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const videoRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showControls && isPlaying) {
      timer = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timer)
  }, [showControls, isPlaying])

  const handlePlay = () => {
    if (!props.src) return
    setIsPlaying(true)
    props.onPlay?.()
  }

  const handlePause = () => {
    setIsPlaying(false)
    props.onPause?.()
  }

  const handleTimeUpdate = (e: any) => {
    const time = e.detail.currentTime
    const dur = e.detail.duration
    setCurrentTime(time)
    setDuration(dur)
    props.onTimeUpdate?.(time, dur)
  }

  const handleProgress = (e: any) => {
    const buffered = e.detail.buffered
    setBuffered(buffered)
    props.onProgress?.(buffered)
  }

  const handleLoadedMetadata = (e: any) => {
    setDuration(e.detail.duration)
    props.onReady?.()
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    props.onEnded?.()
  }

  const handleError = () => {
    setError('视频加载失败')
    props.onError?.('视频加载失败')
  }

  const handleWaiting = () => {
    setIsLoading(true)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seek(time)
      setCurrentTime(time)
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      createSelectorQuery()
        .select('#video-container')
        .boundingClientRect()
        .exec((rect) => {
          if (rect[0]) {
            uni.createVideoContext('main-video').requestFullScreen({
              direction: 0
            })
          }
        })
    } else {
      uni.createVideoContext('main-video').exitFullScreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const handleTouchStart = () => {
    setShowControls(true)
  }

  if (!props.src) {
    return (
      <View className="video-player-empty">
        <View className="empty-content">
          <Text className="empty-icon">🎬</Text>
          <Text className="empty-text">暂无视频</Text>
        </View>
      </View>
    )
  }

  return (
    <View 
      id="video-container"
      className={`video-player ${isFullscreen ? 'fullscreen' : ''}`}
      onTouchStart={handleTouchStart}
    >
      <Video
        ref={videoRef}
        id="main-video"
        className="video-element"
        src={props.src}
        poster={props.poster}
        initialTime={props.initialTime || 0}
        autoplay={props.autoplay}
        loop={props.loop}
        muted={props.muted}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onFullScreenChange={(e: any) => setIsFullscreen(e.detail.fullScreen)}
        enableDanmu={false}
        showCenterPlayBtn={false}
        showPlayBtn={false}
        controls={false}
      />

      {isLoading && (
        <View className="loading-overlay">
          <View className="loading-spinner" />
        </View>
      )}

      {error && (
        <View className="error-overlay">
          <Text className="error-text">{error}</Text>
        </View>
      )}

      <View 
        className={`controls ${showControls ? 'visible' : ''}`}
        onTouchStop={(e) => e.stopPropagation()}
      >
        <View className="controls-top">
          <View className="time-display">
            <Text>{formatTime(currentTime)}</Text>
            <Text className="time-separator">/</Text>
            <Text>{formatTime(duration)}</Text>
          </View>
        </View>

        <View className="controls-center">
          {!isPlaying && (
            <View className="play-button" onClick={handlePlay}>
              <Text className="play-icon">▶️</Text>
            </View>
          )}
        </View>

        <View className="controls-bottom">
          <View 
            className="progress-bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.detail.x - rect.left
              const percentage = x / rect.width
              seekTo(percentage * duration)
            }}
          >
            <View className="progress-buffered" style={{ width: `${(buffered / duration) * 100}%` }} />
            <View className="progress-played" style={{ width: `${(currentTime / duration) * 100}%` }} />
            <View 
              className="progress-thumb" 
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </View>

          <View className="control-buttons">
            <View className="btn" onClick={handlePlay}>
              <Text>{isPlaying ? '⏸️' : '▶️'}</Text>
            </View>
            <View className="btn" onClick={() => seekTo(Math.max(0, currentTime - 10))}>
              <Text>⏪</Text>
            </View>
            <View className="btn" onClick={() => seekTo(Math.min(duration, currentTime + 10))}>
              <Text>⏩</Text>
            </View>
            <View className="btn" onClick={toggleFullscreen}>
              <Text>{isFullscreen ? '⛶' : '⛶'}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
