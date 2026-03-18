export interface ApiConfig {
  baseUrl: string
  appId: string
  envVersion: 'develop' | 'trial' | 'release'
}

export const apiConfig: ApiConfig = {
  baseUrl: 'https://api.zhijianai.com',
  appId: 'wx21eeb4d62aeaebf7',
  envVersion: 'release'
}

export const wechatConfig = {
  appId: apiConfig.appId,
  scope: {
    userInfo: 'scope.userInfo',
    userLocation: 'scope.userLocation',
    writePhotosAlbum: 'scope.writePhotosAlbum',
    camera: 'scope.camera',
    record: 'scope.record'
  }
}
