import { defineConfig } from '@tarojs/cli'
import { resolve } from 'path'

export default defineConfig({
  projectName: 'ai-video-editor',
  date: '2026-03-18',
  framework: 'react',
  designWidth: 375,
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-framework-react',
    '@tarojs/plugin-platform-weapp',
    '@tarojs/plugin-platform-h5'
  ],
  mini: {},
  h5: {
    prebundle: {
      enable: false
    },
    router: {
      mode: 'hash'
    }
  }
})
