import React, { Component } from 'react'
import { View } from '@tarojs/components'
// import dayjs from 'dayjs'
import Picker from './picker'
import './index.scss'

export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleInitial = (value, index) => {
    console.log('initial value: ', value, ', selected index: ', index)
  }

  handleConfirm = (value, index) => {
    console.log('confirm value: ', value, ', selected index: ', index)
  }

  handleCancel = () => {
    console.log('cancel action')
  }

  render() {
    /*支持参数：
    mode: ['year', 'month', 'day', 'hour', 'minute', 'second']
    unit: 界面中的单位标记，例如年，月，日，时，分，秒或小时的:00
    duration: 显示当前模式的最大数量，例如10年或30天(只可用于年和日)
    fields: 可指定当前模式中间隔固定时间间断进行显示，例如只显示10秒、20秒、30秒(只可用于月、小时、分钟、秒钟)，不能和selected同时指定
    humanity：可显示类似微信提醒的时间选择列表，如今天，XX月XX日 明天，XX月XX日 周X。需搭配format: 'M月D日'使用，目前仅适用于mode为day时
    format: 用于解决组合时间的格式化问题，正常情况不需要指定，只有当遇到组合（如X月X日）或者指定unit(例如:00)时使用
    selected: 可指定当前模式下只选择有效范围内的哪几个元素，例如24小时内，只选择8点、12点、16点,，不能和fields同时指定
    selectedDefault: 指定selected的默认值(而不用当前时间去匹配)
    offset: 设定当前时间点偏移量(常用于设定下一小时或者下一天等)
    */
    const dateTime = [
      { mode: 'year', unit: '年' },
      { mode: 'month', unit: '月' },
      { mode: 'day', duration: 30, unit: '日' },

      // { mode: 'hour', unit: ':00', format: 'H:s', selected: [9, 12] },
      // { mode: 'hour', unit: '时' },
      // {mode: 'year', unit: '年' },
      // {mode: 'month', unit: '月'},
      // { mode: 'day', duration: 30, unit: '日', humanity: true, format: 'M月D日' },
      // {mode: 'day', duration: 30, unit: '日' },
      // { mode: 'hour', unit: ':00', format: 'H:s', selected: [8, 12, 16] },
      // { mode: 'minute', fields: 10, unit: '分' },
      // {mode: 'second', fields: 30, unit: '秒'},
    ]

    // const dayModel = { mode: 'day', duration: 30, unit: '日', humanity: true, format: 'M月D日', offset: 0 }
    // const hourModel = { mode: 'hour', unit: ':00', format: 'H:s', selected: [8, 9, 10, 11, 12, 13, 14, 15, 16] }
    // const nowHour = dayjs().hour()
    // const dividePoint = [0, 8, 12]
    // const dateIndex = dividePoint.reduce((result, current, index, arr) => {
    //   if (nowHour < current) {
    //     arr.splice(1)
    //     return index - 1
    //   } else {
    //     return dividePoint.length - 1
    //   }
    // }, 0)
    // const dateTime = [
    //   [
    //     [dayModel, { ...hourModel, ...{ selectedDefault: 0 } }],
    //     [dayModel, { ...hourModel, ...{ selectedDefault: 1 } }],
    //   ],
    //   [
    //     [dayModel, { ...hourModel, ...{ selectedDefault: 4 } }],
    //     [dayModel, { ...hourModel, ...{ selectedDefault: 5 } }],
    //   ],
    //   [
    //     [dayModel, { ...hourModel, ...{ selectedDefault: 0 } }],
    //     [dayModel, { ...hourModel, ...{ selectedDefault: 1 } }],
    //   ],
    // ][dateIndex]

    return (
      <View className='index'>
        <Picker
          dateTime={dateTime}
          onInitial={this.handleInitial}
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          //mode支持dayjs中的所有显示方法如：unix, format, valueof, toDate, toArray, toJSON等，
          // 详情参考: https://dayjs.gitee.io/docs/zh-CN/display/display
          mode='format'
          // start可以指定过去的某一时间点，也可以指定将来的某一时间点，不指定时为当前时间点，可使用字符串、Date对象、数组等
          // 注意如果使用unix时间戳，仅支持传带毫秒的时间戳，同时需要传Number类型，需要使用{}，例如{1318781876406}
          // 可传值参考：https://dayjs.gitee.io/docs/zh-CN/parse/parse
          // start={1318781876406}
          // value用于指定该组件初始化时默认为第n个数值，支持一纬数组或者二维数组
          value={[0, 0, 0]}
        />
      </View>
    )
  }
}
