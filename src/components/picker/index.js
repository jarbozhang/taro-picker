import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import format from './format'
import './index.scss'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: [],
      source: { value: [], item: [] },
      dateTime: [],
    }
  }

  componentWillMount = () => {
    const { dateTime } = this.props
    const source = dateTime && format(dateTime, dayjs()) || { value: [], item: [] }
    this.setState({ source, dateTime })
  }

  onChange = e => {
    this.setState({ value: e.detail.value })
  }

  onClickConfirm = () => {
    const { onConfirm } = this.props
    let { value, source, dateTime } = this.state
    console.log(value, source, dateTime)
    if (value.length === 0) value = [...source.value]
    let time = '', token = ''
    for (let i = 0; i < dateTime.length; i++) {
      const select = source.item[i][value[i]]
      time += (select === '今天' ? dayjs().format('M月D日') : select) + '-'
      token += (dateTime[i].format || this.getToken(dateTime[i].mode)) + '-'
    }
    console.log(time, token)
    console.log(dayjs(time, token).format())
    onConfirm && onConfirm(dayjs(time, token))
  }

  onClickCancel = () => {
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
          onChange={this.onChange}>
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
          <Button className='cancel' type='default' size='default' onClick={this.onClickCancel}>取消</Button>
          <Button className='confirm' type='primary' size='default' onClick={this.onClickConfirm}>确定</Button>
        </View>
      </View>
    )
  }
}

export default Index