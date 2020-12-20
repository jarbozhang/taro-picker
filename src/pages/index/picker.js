import React, { Component } from 'react'
import { View, PickerView, PickerViewColumn, Button } from '@tarojs/components'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import format from './format'
import './picker.scss'

dayjs.extend(customParseFormat)
export default class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: [],
      source: [],
      markMultiDateTime: false,
    }
  }
  componentWillMount() {
    const { dateTime, start, value: _value } = this.props
    let markMultiDateTime = false
    if (dateTime && Array.isArray(dateTime)) {
      dateTime.map((dateTimeItem) => {
        //判断一维数组还是二维数组，分别对应单组选择和两组选择
        if (Array.isArray(dateTimeItem)) {
          markMultiDateTime = true
          // 取得格式化计算之后的结果
          const source = dateTimeItem && format(dateTimeItem, dayjs(start))
          // 后续需要source而不需要item的原因是source可能是多纬数组，每个纬度里面包含自己的item和value
          this.setState((state) => ({
            ...state,
            source: [...state.source, source],
            value: [...state.value, source.value],
          }))
          // this.setState((state) => ({ ...state, value: [...state.value, source.value] }))
        }
      })
      if (!markMultiDateTime) {
        const source = dateTime && format(dateTime, dayjs(start))
        this.setState((state) => ({
          ...state,
          source: [...state.source, source],
          value: [...state.value, source.value],
        }))
        // this.setState((state) => ({ ...state, source: [...state.source, source] }))
        // this.setState((state) => ({ ...state, value: [...state.value, source.value] }))
      }
      this.setState((state) => ({ ...state, markMultiDateTime }))
    }
    _value && this.setState((state) => ({ ...state, ...{ value: markMultiDateTime ? _value : [_value] } }))
  }

  componentDidMount() {
    this.onInitial()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onChange = (e, index) => {
    const _value = [...this.state.value]
    _value[index] = e.detail.value
    this.setState({ value: _value })
  }

  onInitial = () => {
    const { value, markMultiDateTime } = this.state
    const { onInitial, mode } = this.props
    // 根据返回格式(mode)来格式化选中的时间
    onInitial && onInitial(this.getDayjs(mode), markMultiDateTime ? value : value[0])
  }

  onConfirm = () => {
    const { value, markMultiDateTime } = this.state
    const { onConfirm, mode } = this.props
    onConfirm && onConfirm(this.getDayjs(mode), markMultiDateTime ? value : value[0])
  }

  // 根据可选项和当前选择索引返回已选中的时间
  getDayjs = (mode = 'unix') => {
    let { source, value, markMultiDateTime } = this.state
    const { dateTime } = this.props
    const res = []
    // 此处遍历dateTime和遍历source的区别在于一维数组还是二维数组
    for (let i = 0; i < source.length; i++) {
      let time = '',
        token = ''
      // source[i].item.length为可选项的列数
      for (let j = 0; j < source[i].item.length; j++) {
        // source[i].item[j]为每一列的数据组成的数组,value[i][j]为对应这列数组的选中值
        const select = source[i].item[j][value[i][j]]
        // 对'今天'这个值进行特殊处理，其他直接返回当前的选择字符串
        time += (select === '今天' ? dayjs().format('M月D日') : select) + '-'
        // 对于二维数组取i、j；对于一维数组取j
        const item = markMultiDateTime ? dateTime[i][j] : dateTime[j]
        token += (item.format || this.getToken(item.mode)) + '-'
      }
      res.push(dayjs(time, token)[mode]())
    }
    return markMultiDateTime ? res : res[0]
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  // 标准格式化选择器
  getToken = (mode) => {
    return {
      year: 'YYYY年',
      month: 'M月',
      day: 'D日',
      hour: 'H时',
      minute: 'm分',
      second: 's秒',
    }[mode]
  }

  render() {
    const { source, value } = this.state
    const { dateTime = [] } = this.props
    return (
      <View
        className='index'
        style={{ width: dateTime.reduce((acc, val) => acc.concat(val), []).length < 4 ? '80%' : '100%' }}
      >
        <View className='section'>
          {source.map((element, index) => (
            <PickerView
              key={'element' + index}
              indicator-style='height: 50px;'
              value={value[index]}
              onChange={(e) => this.onChange(e, index)}
              // 使用acc.concat将多维数组打平成一维数组再求数组长度
            >
              {element.item.map((item, elementIndex) => (
                <PickerViewColumn key={elementIndex}>
                  {item.map((time) => (
                    <View key={time}>{time}</View>
                  ))}
                </PickerViewColumn>
              ))}
            </PickerView>
          ))}
        </View>
        <View className='handle'>
          <Button className='cancel' type='default' size='default' onClick={this.onCancel}>
            取消
          </Button>
          <Button className='confirm' type='primary' size='default' onClick={this.onConfirm}>
            确定
          </Button>
        </View>
      </View>
    )
  }
}
