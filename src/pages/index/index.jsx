import { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CustomPicker from '../../components/picker'
import './index.scss'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const dateTime = [
      {mode: 'year', unit: '年', start: '2000'},
      // {mode: 'month', unit: '月'},
      {mode: 'day', start: '21', duration: 30, unit: '日', humanity: true, format: 'M月D日'},
      // {mode: 'day', start: '21', duration: 30, unit: '日' },
      {mode: 'hour', unit: ':00', format: 'H:s', selected: [8, 12, 16]},
      // {mode: 'minute', fields: 10, unit: '分'},
      // {mode: 'selector', range: ['08:00', '12:00', '16:00']},
      // {mode: 'second', fields: 30, unit: '秒'},
    ]
    return (
      <View className='index'>
        <CustomPicker dateTime={dateTime} />
      </View>
    )
  }
}

export default Index
