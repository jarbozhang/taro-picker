const format = (dateTime, dayjs) => {
  let res = { value: [], item: [] }, now = dayjs.clone()
  dateTime.filter(key => key.fields > 1).map(item => {
    now = now.add(item.fields, item.mode)
  })
  dateTime.map(item => {
    const key = item.mode
    if (['hour', 'minute', 'second', 'month'].includes(key)) {
      // 默认值跟随当前时间来设定
      const fields = item.fields || 1
      const number = { hour: 24, minute: 60, second: 60, month: 12 }[key]
      res.item.push([...Array(number).keys()]
        .filter(key => key % fields === 0)
        .filter(key => item.selected && item.selected.includes(key))
        .map(index => (key === 'month' ? index + 1 : index) + item.unit))
      res.value.push(item.selected ? 0 : ~~(now.get(item.mode) / fields))
    } else if (['year', 'day'].includes(key)) {
      res.item.push(timeFormat(item, now))
      res.value.push(item.default || now.diff(dayjs, convertDay(key)))
    } else {
      res.item.push(item.range)
      res.value.push(item.default || 0)
    }
  })
  console.log(res)
  return res
}

const timeFormat = (time, now) => {
  let {mode, duration = 30, start, unit='', humanity=false} = time, timeItem
  const times = []
  start = start || now.get(convertDay(mode))
  for (let i = 0; i < duration; i++) {
    const computedTime = now[convertDay(mode)](start).add(i, mode)
    if(humanity && mode === 'day') {
      timeItem = `${computedTime.month() + 1}月${computedTime.date()}日`
      if(i < 3) {
        timeItem = (i === 0 ? '' : timeItem + ' ') + convertDate(i)
      } else {
        timeItem += ` ${convertWeek(computedTime.day())}`
      }
    } else {
      timeItem = computedTime.get(convertDay(mode)) + unit
    }
    times.push(timeItem)
  }
  return times
}

const convertWeek = item => {
  return { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }[item]
}

const convertDate = item => {
  return { 0: '今天', 1: '明天', 2: '后天' }[item]
}

const convertDay = item => {
  return { 'day': 'date' }[item] || item
}

export default format