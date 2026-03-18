import { create } from 'zustand'

export interface EditorState {
  clips: any[]
  textOverlays: any[]
  audioTracks: any[]
  filterSettings: {
    filter: string
    brightness: number
    contrast: number
    saturation: number
  }
  currentTime: number
  duration: number
  selectedClipId: string | null
}

interface HistoryState {
  past: EditorState[]
  future: EditorState[]
}

interface HistoryManager extends HistoryState {
  canUndo: () => boolean
  canRedo: () => boolean
  pushState: (state: EditorState) => void
  undo: () => EditorState | null
  redo: () => EditorState | null
  clear: () => void
}

const initialState: EditorState = {
  clips: [],
  textOverlays: [],
  audioTracks: [],
  filterSettings: {
    filter: 'none',
    brightness: 50,
    contrast: 50,
    saturation: 50
  },
  currentTime: 0,
  duration: 0,
  selectedClipId: null
}

export const useHistoryStore = create<HistoryManager>((set, get) => ({
  past: [],
  future: [],

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  pushState: (state: EditorState) => {
    set((prev) => ({
      past: [...prev.past, { ...prev.past[prev.past.length - 1] || initialState, ...state }].slice(-50),
      future: []
    }))
  },

  undo: () => {
    const { past, future } = get()
    if (past.length === 0) return null

    const previous = past[past.length - 1]
    const newPast = past.slice(0, -1)
    const newFuture = [previous, ...future]

    set({ past: newPast, future: newFuture })
    return previous
  },

  redo: () => {
    const { past, future } = get()
    if (future.length === 0) return null

    const next = future[0]
    const newPast = [...past, next]
    const newFuture = future.slice(1)

    set({ past: newPast, future: newFuture })
    return next
  },

  clear: () => set({ past: [], future: [] })
}))

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,

  setClips: (clips) => set({ clips }),
  addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
  removeClip: (clipId) => set((state) => ({ 
    clips: state.clips.filter(c => c.id !== clipId) 
  })),
  updateClip: (clipId, updates) => set((state) => ({
    clips: state.clips.map(c => c.id === clipId ? { ...c, ...updates } : c)
  })),

  setTextOverlays: (textOverlays) => set({ textOverlays }),
  addTextOverlay: (text) => set((state) => ({ 
    textOverlays: [...state.textOverlays, text] 
  })),
  removeTextOverlay: (textId) => set((state) => ({
    textOverlays: state.textOverlays.filter(t => t.id !== textId)
  })),
  updateTextOverlay: (textId, updates) => set((state) => ({
    textOverlays: state.textOverlays.map(t => t.id === textId ? { ...t, ...updates } : t)
  })),

  setAudioTracks: (audioTracks) => set({ audioTracks }),
  addAudioTrack: (audio) => set((state) => ({
    audioTracks: [...state.audioTracks, audio]
  })),
  removeAudioTrack: (audioId) => set((state) => ({
    audioTracks: state.audioTracks.filter(a => a.id !== audioId)
  })),

  setFilterSettings: (filterSettings) => set({ filterSettings }),
  updateFilter: (key, value) => set((state) => ({
    filterSettings: { ...state.filterSettings, [key]: value }
  })),

  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setSelectedClipId: (selectedClipId) => set({ selectedClipId }),

  reset: () => set(initialState)
}))
