import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import './app.scss'

class App extends Component<PropsWithChildren<any>> {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  onLaunch () {}

  render () {
    return (
      <View className="app-container">
        {this.props.children}
      </View>
    )
  }
}

export default App
