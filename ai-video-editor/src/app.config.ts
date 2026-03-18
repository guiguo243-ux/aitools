export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/projects/projects',
    'pages/editor/editor',
    'pages/material/material',
    'pages/templates/templates',
    'pages/export/export',
    'pages/settings/settings',
    'pages/digital-human/digital-human',
    'pages/cut-same/cut-same',
    'pages/login/login',
    'pages/invite/invite',
    'pages/profile/profile',
    'pages/vip/vip',
    'pages/publish/publish',
    'pages/points-mall/points-mall',
    'pages/customer-service/customer-service',
    'pages/help/help',
    'pages/ai-generate/ai-generate',
    'pages/smart-copy/smart-copy',
    'pages/material-mall/material-mall',
    'pages/batch-generate/batch-generate',
    'pages/image-to-video/image-to-video',
    'pages/publish-platform/publish-platform',
    'pages/community/community',
    'pages/analytics/analytics'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#000000',
    navigationBarTitleText: '智剪AI',
    navigationBarTextStyle: 'white',
    backgroundColor: '#000000'
  },
  tabBar: {
    color: '#A3A3A3',
    selectedColor: '#2563EB',
    backgroundColor: '#1A1A1A',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'src/assets/icons/home.png',
        selectedIconPath: 'src/assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/projects/projects',
        text: '项目',
        iconPath: 'src/assets/icons/project.png',
        selectedIconPath: 'src/assets/icons/project-active.png'
      },
      {
        pagePath: 'pages/templates/templates',
        text: '模板',
        iconPath: 'src/assets/icons/template.png',
        selectedIconPath: 'src/assets/icons/template-active.png'
      },
      {
        pagePath: 'pages/profile/profile',
        text: '我的',
        iconPath: 'src/assets/icons/profile.png',
        selectedIconPath: 'src/assets/icons/profile-active.png'
      }
    ]
  },
  permission: {
    'scope.writePhotosAlbum': {
      desc: '保存视频到相册需要此权限'
    },
    'scope.camera': {
      desc: '拍摄视频需要使用相机'
    },
    'scope.record': {
      desc: '录制音频需要使用麦克风'
    },
    'scope.userLocation': {
      desc: '获取位置信息用于推荐本地化内容'
    }
  },
  requiredPrivateInfos: [
    'chooseVideo',
    'chooseImage',
    'chooseMedia',
    'saveVideoToPhotosAlbum',
    'getLocation'
  ],
  usingComponents: {},
  lazyCodeLoading: "requiredComponents"
})
