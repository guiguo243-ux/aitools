export const wechatLogin = {
  getLoginCode: (): Promise<string> => {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: (res) => {
          if (res.code) {
            resolve(res.code)
          } else {
            reject(new Error('获取登录凭证失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  getUserProfile: (): Promise<{ userInfo: any; rawData: string; signature: string }> => {
    return new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          const { userInfo, rawData, signature } = res
          resolve({ userInfo, rawData, signature })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  chooseVideo: (options?: {
    sourceType?: ('album' | 'camera')[]
    maxDuration?: number
    compressed?: boolean
  }): Promise<{ tempFilePath: string; duration: number; size: number; height: number; width: number }> => {
    return new Promise((resolve, reject) => {
      uni.chooseVideo({
        sourceType: options?.sourceType || ['album', 'camera'],
        maxDuration: options?.maxDuration || 60,
        compressed: options?.compressed !== false,
        success: (res) => {
          resolve({
            tempFilePath: res.tempFilePath,
            duration: res.duration,
            size: res.size,
            height: res.height,
            width: res.width
          })
        },
        fail: reject
      })
    })
  },

  chooseImage: (options?: {
    sourceType?: ('album' | 'camera')[]
    count?: number
    sizeType?: ('original' | 'compressed')[]
  }): Promise<{ tempFilePaths: string[]; tempFiles: any[] }> => {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        sourceType: options?.sourceType || ['album', 'camera'],
        count: options?.count || 9,
        sizeType: options?.sizeType || ['original', 'compressed'],
        success: (res) => {
          resolve({
            tempFilePaths: res.tempFilePaths,
            tempFiles: res.tempFiles
          })
        },
        fail: reject
      })
    })
  },

  saveVideoToPhotosAlbum: (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      uni.saveVideoToPhotosAlbum({
        filePath,
        success: () => resolve(),
        fail: (err) => {
          if (err.errMsg.includes('auth deny')) {
            uni.showModal({
              title: '提示',
              content: '需要授权保存到相册',
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting()
                }
              }
            })
          }
          reject(err)
        }
      })
    })
  },

  onShareAppMessage: (options?: {
    title?: string
    path?: string
    imageUrl?: string
  }) => {
    return (res: any) => {
      return {
        title: options?.title || '智剪AI - 智能视频创作平台',
        path: options?.path || '/pages/index/index',
        imageUrl: options?.imageUrl || ''
      }
    }
  },

  onShareTimeline: (options?: {
    title?: string
    query?: string
    imageUrl?: string
  }) => {
    return () => {
      return {
        title: options?.title || '智剪AI - 智能视频创作平台',
        query: options?.query || '',
        imageUrl: options?.imageUrl || ''
      }
    }
  },

  getLocation: (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'wgs84',
        success: (res) => {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude
          })
        },
        fail: reject
      })
    })
  },

  showAuthModal: (message: string) => {
    uni.showModal({
      title: '授权提示',
      content: message,
      confirmText: '去授权',
      success: (res) => {
        if (res.confirm) {
          uni.openSetting()
        }
      }
    })
  }
}
