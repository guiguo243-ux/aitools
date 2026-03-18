import Taro from '@tarojs/taro'
import request from './request'

export interface ExportOptions {
  videoId: number
  quality: '流畅' | '标准' | '高清' | '无损'
  resolution: '720p' | '1080p' | '4k'
  format: 'mp4' | 'mov' | 'gif'
}

export interface ExportTask {
  id: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  url?: string
}

export const createExportTask = async (options: ExportOptions): Promise<ExportTask> => {
  try {
    const res = await request.post('/export/create', {
      videoId: options.videoId,
      quality: options.quality,
      resolution: options.resolution,
      format: options.format
    })
    
    if (res.code === 200) {
      return res.data
    }
    throw new Error(res.message || '创建导出任务失败')
  } catch (error) {
    console.error('Create export error:', error)
    throw error
  }
}

export const getExportProgress = async (taskId: number): Promise<ExportTask> => {
  try {
    const res = await request.get(`/export/${taskId}/progress`)
    if (res.code === 200) {
      return res.data
    }
    throw new Error(res.message || '获取进度失败')
  } catch (error) {
    console.error('Get progress error:', error)
    throw error
  }
}

export const downloadExport = async (taskId: number): Promise<string> => {
  try {
    const res = await request.get(`/export/${taskId}/download`)
    if (res.code === 200) {
      return res.data.url
    }
    throw new Error(res.message || '获取下载链接失败')
  } catch (error) {
    console.error('Download error:', error)
    throw error
  }
}

export const saveToAlbum = async (videoPath: string): Promise<boolean> => {
  try {
    const result = await Taro.saveVideoToPhotosAlbum({
      filePath: videoPath
    })
    
    if (result.errMsg?.includes('ok')) {
      Taro.showToast({ title: '已保存到相册', icon: 'success' })
      return true
    }
    return false
  } catch (error) {
    console.error('Save to album error:', error)
    if ((error as any).errMsg?.includes('auth deny')) {
      await Taro.openSetting()
    }
    return false
  }
}

export const exportVideo = async (options: ExportOptions): Promise<boolean> => {
  try {
    Taro.showLoading({ title: '创建导出任务...' })
    
    const task = await createExportTask(options)
    
    Taro.showLoading({ title: '导出中...', mask: true })
    
    let completed = false
    while (!completed) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const progress = await getExportProgress(task.id)
      
      if (progress.status === 'completed') {
        completed = true
        
        const downloadUrl = await downloadExport(task.id)
        
        Taro.hideLoading()
        
        const saveResult = await Taro.saveVideoToPhotosAlbum({
          filePath: downloadUrl
        })
        
        if (saveResult.errMsg?.includes('ok')) {
          Taro.showToast({ title: '已保存到相册', icon: 'success' })
          return true
        } else {
          Taro.showModal({
            title: '导出完成',
            content: '视频已导出，是否保存到相册？',
            success: async (res) => {
              if (res.confirm) {
                await Taro.openSetting()
              }
            }
          })
          return true
        }
      } else if (progress.status === 'failed') {
        throw new Error('导出失败')
      } else {
        Taro.showLoading({ title: `导出中 ${progress.progress}%...`, mask: true })
      }
    }
    
    return true
  } catch (error) {
    Taro.hideLoading()
    Taro.showToast({ title: '导出失败', icon: 'none' })
    console.error('Export error:', error)
    return false
  }
}

export const cancelExport = async (taskId: number): Promise<void> => {
  try {
    await request.post(`/export/${taskId}/cancel`)
    Taro.showToast({ title: '已取消导出', icon: 'none' })
  } catch (error) {
    console.error('Cancel export error:', error)
  }
}
