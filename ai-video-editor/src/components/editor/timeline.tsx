import { useState, useRef, useEffect } from 'react'
import { View, Text, ScrollView, GestureResponderEvent } from '@tarojs/taro'
import { generateId } from '../../utils/helpers'
import './timeline.scss'

export interface TimelineClip {
  id: string
  source: string
  thumbnail?: string
  startTime: number
  endTime: number
  duration: number
  trimStart?: number
  trimEnd?: number
  speed?: number
  volume?: number
  name?: string
}

interface TimelineProps {
  duration: number
  currentTime: number
  clips: TimelineClip[]
  onSeek: (time: number) => void
  onClipClick?: (clip: TimelineClip) => void
  onClipDelete?: (clipId: string) => void
  onAddClip?: () => void
}

export default function Timeline(props: TimelineProps) {
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const timelineRef = useRef<any>(null)

  const minZoom = 0.5
  const maxZoom = 3
  const pixelsPerSecond = 20 * zoom

  const handleZoomIn = () => {
    setZoom(Math.min(maxZoom, zoom + 0.25))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(minZoom, zoom - 0.25))
  }

  const handleTimelineClick = (e: any) => {
    if (isDragging) return
    const rect = e.currentTarget.getBoundingClientRect?.() || { left: 0, width: 0 }
    const x = e.detail?.x - rect.left || e.touches?.[0]?.clientX - rect.left || 0
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const time = percentage * props.duration
    props.onSeek(time)
  }

  const handlePlayheadDragStart = (e: GestureResponderEvent) => {
    setIsDragging(true)
    e.stopPropagation()
  }

  const handlePlayheadDrag = (e: GestureResponderEvent) => {
    if (!isDragging) return
    const rect = timelineRef.current?.getBoundingClientRect?.() || { left: 0, width: 0 }
    const x = e.touches[0].clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const time = percentage * props.duration
    props.onSeek(time)
  }

  const handlePlayheadDragEnd = () => {
    setIsDragging(false)
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const renderRuler = () => {
    const marks = []
    const interval = zoom < 1 ? 10 : zoom < 2 ? 5 : 2
    
    for (let i = 0; i <= props.duration; i += interval) {
      const left = (i / props.duration) * 100 * zoom
      marks.push(
        <View 
          key={i} 
          className="ruler-mark"
          style={{ left: `${left}%` }}
        >
          <View className="mark-line" />
          <Text className="mark-text">{formatTime(i)}</Text>
        </View>
      )
    }
    return marks
  }

  const renderClips = () => {
    return props.clips.map((clip, index) => {
      const left = (clip.startTime / props.duration) * 100 * zoom
      const width = ((clip.endTime - clip.startTime) / props.duration) * 100 * zoom
      
      return (
        <View
          key={clip.id}
          className="timeline-clip"
          style={{ left: `${left}%`, width: `${width}%` }}
          onClick={() => props.onClipClick?.(clip)}
        >
          <View className="clip-content">
            <Text className="clip-name">{clip.name || `片段 ${index + 1}`}</Text>
          </View>
          <View 
            className="clip-delete"
            onClick={(e) => {
              e.stopPropagation()
              props.onClipDelete?.(clip.id)
            }}
          >
            <Text>×</Text>
          </View>
          <View className="clip-handle left" />
          <View className="clip-handle right" />
        </View>
      )
    })
  }

  const playheadPosition = (props.currentTime / props.duration) * 100

  return (
    <View className="timeline-container">
      <View className="timeline-header">
        <Text className="timeline-label">时间轴</Text>
        <View className="zoom-controls">
          <View className="zoom-btn" onClick={handleZoomOut}>
            <Text>−</Text>
          </View>
          <Text className="zoom-level">{Math.round(zoom * 100)}%</Text>
          <View className="zoom-btn" onClick={handleZoomIn}>
            <Text>+</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="timeline-scroll"
        scrollX
        scrollY={false}
        enhanced
        showScrollbar={false}
      >
        <View 
          ref={timelineRef}
          className="timeline-track"
          style={{ width: `${100 * zoom}%` }}
          onClick={handleTimelineClick}
        >
          <View className="timeline-ruler">
            {renderRuler()}
          </View>
          
          <View className="timeline-clips">
            {renderClips()}
          </View>

          <View 
            className="playhead"
            style={{ left: `${playheadPosition * zoom}%` }}
            onTouchStart={handlePlayheadDragStart}
            onTouchMove={handlePlayheadDrag}
            onTouchEnd={handlePlayheadDragEnd}
          >
            <View className="playhead-line" />
            <View className="playhead-handle" />
          </View>
        </View>
      </ScrollView>

      <View className="timeline-actions">
        <View className="add-clip-btn" onClick={props.onAddClip}>
          <Text>+ 添加素材</Text>
        </View>
      </View>
    </View>
  )
}
