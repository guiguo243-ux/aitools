import Taro from '@tarojs/taro'
import request from './request'

export interface UploadResponse {
  url: string
  path: string
}

export const uploadFile = async (filePath: string, type: 'video' | 'image' | 'audio'): Promise<UploadResponse> => {
  try {
    const token = Taro.getStorageSync('token')
    
    const uploadTask = Taro.uploadFile({
      url: `${process.env.API_BASE}/upload`,
      filePath,
      name: 'file',
      header: {
        'Authorization': `Bearer ${token}`
      },
      formData: {
        type
      }
    })

    return new Promise((resolve, reject) => {
      uploadTask.then(res => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          resolve(data.data)
        } else {
          reject(new Error('上传失败'))
        }
      }).catch(reject)
    })
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export const uploadMedia = async (type: 'video' | 'image' | 'camera') => {
  try {
    const res = await Taro.chooseMedia({
      count: 1,
      mediaType: [type === 'camera' ? 'video' : type],
      sourceType: type === 'camera' ? ['camera'] : ['album', 'camera']
    })

    if (res.tempFiles && res.tempFiles[0]) {
      const file = res.tempFiles[0]
      return await uploadFile(file.tempFilePath, type === 'camera' ? 'video' : type as 'video' | 'image')
    }
    throw new Error('未选择文件')
  } catch (error) {
    console.error('Choose media error:', error)
    throw error
  }
}

export const uploadVideo = async () => {
  try {
    const res = await Taro.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 300,
      camera: 'back',
      compressed: true
    })

    if (res.tempFilePath) {
      return await uploadFile(res.tempFilePath, 'video')
    }
    throw new Error('未选择视频')
  } catch (error) {
    console.error('Choose video error:', error)
    throw error
  }
}

export const uploadImage = async (count = 9) => {
  try {
    const res = await Taro.chooseImage({
      count,
      sourceType: ['album', 'camera'],
      sizeType: ['compressed', 'original']
    })

    const results: UploadResponse[] = []
    for (const path of res.tempFilePaths) {
      const result = await uploadFile(path, 'image')
      results.push(result)
    }
    return results
  } catch (error) {
    console.error('Choose image error:', error)
    throw error
  }
}

export const uploadAudio = async () => {
  try {
    const res = await Taro.chooseMessage({
      type: 'file',
      extension: ['mp3', 'wav', 'aac', 'm4a']
    })

    if (res.tempFiles && res.tempFiles[0]) {
      const file = res.tempFiles[0]
      return await uploadFile(file.path, 'audio')
    }
    throw new Error('未选择音频')
  } catch (error) {
    console.error('Choose audio error:', error)
    throw error
  }
}
