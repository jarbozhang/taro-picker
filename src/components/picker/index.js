import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import './index.scss'

class Index extends Component {
  constructor() {
    super(...arguments)
    const now = dayjs()
    const days = ['今天', '明天']
    const thisMonth = [...Array(now.daysInMonth()).keys()].filter(key => key >= now.get('date'))
    thisMonth.map(key => days.push(`${now.get('month') + 1}月${key}日`))
    const nextMonth = [
      ...Array(now.clone().add(1, 'months').daysInMonth()).keys()
    ].filter(key => key < 29 - now.daysInMonth() + now.get('date'))
    nextMonth.map(key => days.push(`${now.clone().add(1, 'months').get('month') + 1}月${key + 1}日`))

    const hours = [...Array(24).keys()]
    const minutes = [...Array(60).keys()].filter(key => key % 10 === 0)
    const initial = {
      day: (now.get('minute') > 50 && now.get('hour') === 23) ? 1 : 0,
      hour: now.get('minute') > 50 ? now.clone().add(1, 'hours').get('hour') : now.get('hour'),
      minute: now.get('minute') > 50 ? 0 : ~~(now.get('minute') / 10) + 1
    }

    this.state = {
      days,
      day: initial.day,
      hours,
      hour: initial.hour,
      minutes,
      minute: initial.minute,
      value: [...Object.values(initial)]
    }
  }

  componentDidMount = () => {
    const { initial } = this.props
    const now = dayjs()
    initial && initial(now.clone().add(10, 'minutes').add(-now.get('minute') % 10, 'minutes').add(-now.get('seconds'), 'seconds'))
  }

  onChange = e => {
    const [day, hour, minute] = e.detail.value
    this.setState({ day, hour, minute })
  }

  onClickConfirm = () => {
    const { onConfirm } = this.props
    const { days, day, hours, hour, minutes, minute } = this.state
    const dateMap = [dayjs().format('M月D日'), dayjs().clone().add(1, 'days').format('M月D日')]
    const selectDate = day < 2 ? dateMap[day] : days[day]
    let selectTime = dayjs(`${selectDate}-${hours[hour]}-${minutes[minute]}`, 'M月D日-HH-mm')
    if (dayjs().get('month') === 11 && dayjs(selectDate, 'M月').get('month') === 0) {
      selectTime = selectTime.add(1, 'years')
    }
    onConfirm && onConfirm(selectTime)
  }

  onClickCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  render() {
    const { datetime = this.state.value } = this.props
    return (
      <View className='picker-page'>
        <PickerView
          indicator-style='height: 50px;'
          value={datetime}
          onChange={this.onChange}>
          <PickerViewColumn>
            {this.state.days.map(item => {
              return <View key={'day:' + item}>{item}</View>
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {this.state.hours.map(item => {
              return <View key={'hour:' + item}>{item}时</View>
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {this.state.minutes.map(item => {
              return <View key={'minute:' + item}>{item}分</View>
            })}
          </PickerViewColumn>
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