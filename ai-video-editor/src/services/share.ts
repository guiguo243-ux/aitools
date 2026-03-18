import Taro from '@tarojs/taro'

export interface ShareOptions {
  title: string
  desc?: string
  imageUrl?: string
  path: string
  success?: () => void
}

export const onShareAppMessage = (options: ShareOptions) => {
  return {
    title: options.title,
    path: options.path,
    imageUrl: options.imageUrl,
    desc: options.desc,
    success: options.success
  }
}

export const onShareTimeline = (options: { title: string; query?: string }) => {
  return {
    title: options.title,
    query: options.query || '',
    success: () => {
      Taro.showToast({ title: '分享成功', icon: 'success' })
    }
  }
}

export const shareToFriend = async (options: ShareOptions) => {
  try {
    await Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    
    return true
  } catch (error) {
    console.error('Share menu error:', error)
    return false
  }
}

export const generateSharePoster = async (options: {
  title: string
  cover: string
  qrcode: string
}): Promise<string> => {
  try {
    const res = await Taro.createCanvasNode('share-canvas')
    const ctx = res.getContext('2d')
    
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 375, 600)
    
    ctx.fillStyle = '#1C1C1E'
    ctx.fillRect(20, 20, 335, 560)
    
    const cover = await Taro.getImageInfo({ src: options.cover })
    ctx.drawImage(cover.path, 30, 40, 315, 400)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText(options.title, 30, 480)
    
    const qrcode = await Taro.getImageInfo({ src: options.qrcode })
    ctx.drawImage(qrcode.path, 137, 500, 100, 100)
    
    const result = await Taro.canvasToTempFilePath({
      canvas: res,
      width: 375,
      height: 600,
      destWidth: 750,
      destHeight: 1200
    })
    
    return result.tempFilePath
  } catch (error) {
    console.error('Generate poster error:', error)
    throw error
  }
}

export const savePosterToAlbum = async (posterPath: string) => {
  try {
    const saveResult = await Taro.saveImageToPhotosAlbum({
      filePath: posterPath
    })
    
    if (saveResult.errMsg.includes('ok')) {
      Taro.showToast({ title: '已保存到相册', icon: 'success' })
      return true
    }
    return false
  } catch (error) {
    if ((error as any).errMsg?.includes('auth deny')) {
      await Taro.openSetting()
    }
    console.error('Save poster error:', error)
    return false
  }
}

export const shareVideo = async (videoId: number, title: string, cover: string) => {
  return shareToFriend({
    title,
    desc: '快来看看这个精彩视频',
    imageUrl: cover,
    path: `/pages/video/video?id=${videoId}`
  })
}

export const shareTemplate = async (templateId: number, title: string) => {
  return shareToFriend({
    title: `模板推荐：${title}`,
    desc: '用这个模板也能做出同款视频',
    path: `/pages/template/template?id=${templateId}`
  })
}

export const shareInvite = async (inviteCode: string) => {
  return shareToFriend({
    title: '邀请你一起用智剪AI',
    desc: '注册即送VIP，限时优惠',
    path: `/pages/login/login?inviteCode=${inviteCode}`
  })
}
