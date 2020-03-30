import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CustomPicker from '../../components/picker'
import './index.scss'

class Index extends Component {

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount() { }
  componentDidShow() { }
  componentDidHide() { }

  config = {
    navigationBarTitleText: '首页'
  }

  handleInitial = value => {
    console.log('initial value: ', value)
  }

  handleConfirm = value => {
    console.log('confirm value: ', value)
  }

  handleCancel = () => {
    console.log('cancel action')
  }

  render() {
    /*支持参数：
    mode: ['year', 'month', 'day', 'hour', 'minute', 'second']
    unit: 界面中的日期标记，例如年，月，日，时，分，秒
    start: 用于mode为year和day，可以指定过去的某一年/天，也可以指定将来的某一年/天
    duration: 显示当前模式的最大数量，例如10年或30天
    fields: 可指定当前模式中间隔固定时间间断进行显示，例如只显示10秒、20秒、30秒
    format: 用于解决组合时间的格式化问题，例如X月X日，或者8:00
    selected: 可指定当前模式下只选择有效范围内的哪几个元素，例如24小时内，只选择8点、12点、16点
    humanity：目前只支持mode为day，可显示类似微信提醒的时间选择列表，如今天，明天 XX月XX日， XX月XX日 周X, 需搭配format: 'M月D日'使用
    */
    const dateTime = [
      // {mode: 'year', unit: '年', start: '2020'},
      // {mode: 'month', unit: '月'},
      { mode: 'day', duration: 30, unit: '日', humanity: true, format: 'M月D日' },
      // {mode: 'day', start: '21', duration: 30, unit: '日' },
      // { mode: 'hour', unit: ':00', format: 'H:s', selected: [8, 12, 16] },
      { mode: 'hour', unit: '时' },
      {mode: 'minute', fields: 10, unit: '分'},
      // {mode: 'second', fields: 30, unit: '秒'},
    ]
    return (
      <View className='index'>
        <CustomPicker
          dateTime={dateTime}
          onInitial={this.handleInitial}
          mode='format'
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
        />
      </View>
    )
  }
}

export default Index
