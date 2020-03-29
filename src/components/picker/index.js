import Taro, { Component } from '@tarojs/taro'
import { View, PickerView, PickerViewColumn, Button } from '@tarojs/components'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import format from './format'
import './index.scss'

dayjs.extend(customParseFormat)

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: [],
      source: { value: [], item: [] },
      selected: [],
    }
  }

  componentWillMount = () => {
    const { dateTime } = this.props
    const source = dateTime && format(dateTime, dayjs()) || { value: [], item: [] }
    this.setState({ source, selected: dateTime })
  }

  componentDidMount = () => {
    this.onInitial()
  }

  onChange = e => {
    this.setState({ value: e.detail.value })
  }

  onInitial = () => {
    const { onInitial, mode } = this.props
    onInitial && onInitial(this.getDayjs(mode))
  }

  onConfirm = () => {
    const { onConfirm, mode } = this.props
    onConfirm && onConfirm(this.getDayjs(mode))
  }

  getDayjs = (mode = 'unix') => {
    let { value, source, selected: dateTime } = this.state
    if (value.length === 0) value = [...source.value]
    let time = '', token = ''
    for (let i = 0; i < dateTime.length; i++) {
      const select = source.item[i][value[i]]
      time += (select === '今天' ? dayjs().format('M月D日') : select) + '-'
      token += (dateTime[i].format || this.getToken(dateTime[i].mode)) + '-'
    }
    return dayjs(time, token)[mode]()
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  getToken = mode => {
    return {
      'year': 'YYYY年',
      'month': 'M月',
      'day': 'D日',
      'hour': 'H时',
      'minute': 'm分',
      'second': 's秒',
    }[mode]
  }

  render() {
    const { source } = this.state
    return (
      <View className='picker-page'>
        <PickerView
          indicator-style='height: 50px;'
          value={source.value}
          onChange={this.onChange}
        >
          {source.item.map((item, index) => {
            return (
              <PickerViewColumn key={index}>
                {item.map(time => {
                  return <View key={time}>{time}</View>
                })}
              </PickerViewColumn>
            )
          })}
        </PickerView>
        <View className='handle'>
          <Button className='cancel' type='default' size='default' onClick={this.onCancel}>取消</Button>
          <Button className='confirm' type='primary' size='default' onClick={this.onConfirm}>确定</Button>
        </View>
      </View>
    )
  }
}

export default Index