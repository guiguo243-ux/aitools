import { create } from 'zustand'

export interface VideoClip {
  id: string
  source: string
  thumbnail: string
  startTime: number
  endTime: number
  duration: number
  trimStart: number
  trimEnd: number
  speed: number
  effects: string[]
  filters: string[]
}

export interface Track {
  id: string
  type: 'video' | 'audio' | 'text'
  clips: VideoClip[]
  muted?: boolean
  volume?: number
}

export interface Project {
  id: string
  name: string
  cover: string
  duration: number
  createdAt: number
  updatedAt: number
  tracks: Track[]
}

interface EditorState {
  currentProject: Project | null
  currentTime: number
  isPlaying: boolean
  zoom: number
  selectedClipId: string | null
  activeTab: string
  
  setCurrentProject: (project: Project | null) => void
  setCurrentTime: (time: number) => void
  setIsPlaying: (playing: boolean) => void
  setZoom: (zoom: number) => void
  setSelectedClipId: (id: string | null) => void
  setActiveTab: (tab: string) => void
  addClip: (trackId: string, clip: VideoClip) => void
  removeClip: (trackId: string, clipId: string) => void
  updateClip: (trackId: string, clipId: string, updates: Partial<VideoClip>) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  currentProject: null,
  currentTime: 0,
  isPlaying: false,
  zoom: 1,
  selectedClipId: null,
  activeTab: 'media',
  
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedClipId: (id) => set({ selectedClipId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  addClip: (trackId, clip) => set((state) => {
    if (!state.currentProject) return state
    const tracks = state.currentProject.tracks.map(track => {
      if (track.id === trackId) {
        return { ...track, clips: [...track.clips, clip] }
      }
      return track
    })
    return { currentProject: { ...state.currentProject, tracks } }
  }),
  
  removeClip: (trackId, clipId) => set((state) => {
    if (!state.currentProject) return state
    const tracks = state.currentProject.tracks.map(track => {
      if (track.id === trackId) {
        return { ...track, clips: track.clips.filter(c => c.id !== clipId) }
      }
      return track
    })
    return { currentProject: { ...state.currentProject, tracks } }
  }),
  
  updateClip: (trackId, clipId, updates) => set((state) => {
    if (!state.currentProject) return state
    const tracks = state.currentProject.tracks.map(track => {
      if (track.id === trackId) {
        return {
          ...track,
          clips: track.clips.map(clip =>
            clip.id === clipId ? { ...clip, ...updates } : clip
          )
        }
      }
      return track
    })
    return { currentProject: { ...state.currentProject, tracks } }
  })
}))
