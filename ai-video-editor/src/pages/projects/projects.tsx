import { useState, useEffect } from 'react'
import { View, Text, Image, Button, ScrollView } from '@tarojs/taro'
import { navigateTo } from '@tarojs/taro'
import './projects.scss'

interface Project {
  id: string
  name: string
  cover: string
  duration: number
  updatedAt: number
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: '春日踏青视频',
      cover: '',
      duration: 120,
      updatedAt: Date.now() - 3600000
    },
    {
      id: '2',
      name: '美食探店记录',
      cover: '',
      duration: 90,
      updatedAt: Date.now() - 7200000
    },
    {
      id: '3',
      name: '电商种草文案',
      cover: '',
      duration: 60,
      updatedAt: Date.now() - 86400000
    }
  ])

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return new Date(timestamp).toLocaleDateString()
  }

  const handleProjectClick = (project: Project) => {
    navigateTo({ url: '/pages/editor/editor?projectId=' + project.id })
  }

  const handleNewProject = () => {
    navigateTo({ url: '/pages/editor/editor' })
  }

  const handleDeleteProject = (projectId: string, e: Event) => {
    e.stopPropagation()
    setProjects(projects.filter(p => p.id !== projectId))
  }

  return (
    <View className="projects-page">
      <View className="header">
        <Text className="title">我的项目</Text>
        <Button className="new-btn" onClick={handleNewProject}>
          + 新建项目
        </Button>
      </View>

      <ScrollView scrollY className="project-list">
        {projects.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-icon">📁</Text>
            <Text className="empty-title">暂无项目</Text>
            <Text className="empty-desc">点击上方"新建项目"开始创作</Text>
          </View>
        ) : (
          projects.map(project => (
            <View 
              key={project.id} 
              className="project-item"
              onClick={() => handleProjectClick(project)}
            >
              <View className="project-cover">
                <Text className="cover-icon">🎬</Text>
                <View className="duration-badge">
                  <Text>{formatDuration(project.duration)}</Text>
                </View>
              </View>
              <View className="project-info">
                <Text className="project-name">{project.name}</Text>
                <Text className="project-time">{formatTime(project.updatedAt)}</Text>
              </View>
              <View 
                className="delete-btn"
                onClick={(e: any) => handleDeleteProject(project.id, e)}
              >
                <Text>🗑️</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}
