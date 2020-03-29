const format = (dateTime, dayjs) => {
  let res = { value: [], item: [] }, now = dayjs.clone()
  dateTime.filter(key => key.fields > 1).map(item => {
    now = now.add(item.fields, item.mode)
  })
  dateTime.filter(key => key.selected).map(item => {
    const index = item.selected.findIndex(value => value > now.get(item.mode))
    if (index == -1) {
      now = now.add(getInverval(item.mode) - now.get(item.mode) + item.selected[0], item.mode)
    } else {
      now = now.set(item.mode, item.selected[index])
    }
  })
  dateTime.map(item => {
    const key = item.mode
    if (['hour', 'minute', 'second', 'month'].includes(key)) {
      // 默认值跟随当前时间来设定
      const fields = item.fields || 1
      const number = getInverval(key)
      res.item.push([...Array(number).keys()]
        .filter(index => index % fields === 0)
        .filter(index => item.selected && item.selected.includes(index))
        .map(index => (key === 'month' ? index + 1 : index) + item.unit))
      res.value.push(item.selected
        ? item.selected.findIndex(value => value === now.get(item.mode))
        : ~~(now.get(item.mode) / fields))
    } else if (['year', 'day'].includes(key)) {
      res.item.push(timeFormat(item, dayjs))
      res.value.push(item.default || now.startOf(key).diff(dayjs.startOf(key), key))
    } else {
      res.item.push(item.range)
      res.value.push(item.default || 0)
    }
  })
  console.log(res)
  return res
}

const timeFormat = (time, now) => {
  let { mode, duration = 30, start, unit = '', humanity = false } = time, timeItem
  const times = []
  start = start || now.get(convertDay(mode))
  for (let i = 0; i < duration; i++) {
    const computedTime = now[convertDay(mode)](start).add(i, mode)
    if (humanity && mode === 'day') {
      timeItem = `${computedTime.month() + 1}月${computedTime.date()}日`
      if (i < 3) {
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
  return { day: 'date' }[item] || item
}

const getInverval = item => {
  return { hour: 24, minute: 60, second: 60, month: 12 }[item]
}

export default format