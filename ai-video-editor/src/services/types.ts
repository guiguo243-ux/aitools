export interface User {
  id: string
  nickname: string
  avatar: string
  phone: string
  vip: boolean
  vipExpireTime?: number
  points: number
  level: number
  createdAt: number
}

export interface LoginResponse {
  token: string
  user: User
}

export interface DigitalHuman {
  id: string
  name: string
  avatar: string
  category: 'business' | 'fashion' | 'cartoon' | 'ip'
  isVIP: boolean
  isPopular: boolean
  previewUrl?: string
}

export interface GenerateVideoRequest {
  humanId: string
  text: string
  voiceId: string
}

export interface GenerateVideoResponse {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface VideoTemplate {
  id: string
  title: string
  cover: string
  author: string
  authorAvatar: string
  plays: number
  uses: number
  tags: string[]
  category: string
  templateData: string
}

export interface Material {
  id: string
  type: 'video' | 'image' | 'audio'
  url: string
  thumbnail?: string
  duration?: number
  name: string
  size: number
  createdAt: number
}

export interface Project {
  id: string
  name: string
  cover: string
  duration: number
  status: 'draft' | 'processing' | 'completed'
  createdAt: number
  updatedAt: number
}

export interface InviteRecord {
  id: string
  invitedUser: {
    nickname: string
    avatar: string
  }
  status: 'pending' | 'completed'
  reward: number
  createdAt: number
}

export interface PointsRecord {
  id: string
  type: 'signin' | 'invite' | 'share' | 'create' | 'consume'
  points: number
  description: string
  createdAt: number
}
