// 输出的结果包含item为显示的可选项，value为默认显示值
// res为返回的结果，time为返回的默认时间
// 整个代码流程为：
// 1.如果指定了offset,则根据offset属性将time做偏移作为time(为了实现当前8:30，需要默认选择9点这样的需求)
// 2.如果指定了selected，则根据第一步的结果寻找大于或者等于time的可选时间点作为新的time,
//   如果无法匹配到合适的selected（findIndex返回-1），则设定time为下个周期的开始时间
//   如果同时指定了selectedDefault，则设定time为selected的selectedDefault对应的值
// 3.根据mode来区分开年/日---月/时/分/秒---range，对三种mode分别进行单独的处理

const format = (dateTime, dayjs) => {
  // res为返回的结果，time为返回的默认时间
  let res = { value: [], item: [] },
    time = dayjs.clone()
  // 注释掉这里是因为这里判断fields的同时只做了增加到下一个时间点的操作，完全可以用fields和offset搭配实现select下一个时间点
  // dateTime
  //   .filter((key) => key.fields > 1)
  //   .map((item) => {
  //     time = time.add(item.fields, item.mode)
  //   })

  // offset: 设定time偏移量(常用于设定下一小时或者下一天等)
  dateTime
    .filter((key) => key.offset)
    .map((item) => {
      time = time.add(item.offset, item.mode)
    })

  // selected: 可指定当前模式下只选择有效范围内的哪几个元素，例如24小时内，只选择8点、12点、16点
  // 寻找大于或者等于time的最近的可选择时间点
  dateTime
    .filter((key) => key.selected)
    .map((item) => {
      const { selected, mode, selectedDefault } = item
      const index = selected.findIndex((value) => value >= time.get(mode))
      if (index === -1) {
        // 如果未找到可选时间点，就设定time为下个周期（如第二天）的开始时间
        time = time.add(getInverval(mode) - time.get(mode), mode)
      } else {
        // 如果找到可选时间点，就设定time为这个时间点
        time = time.set(mode, selected[index])
      }
      // 如果设定了selectedDefault，则将time设定为default对应的时间点
      if (selectedDefault !== undefined) {
        time = time.set(mode, selected[selectedDefault])
      }
    })
  // 此处针对offset、selected和selectedDefault属性处理完成

  dateTime.map((item) => {
    const { mode, selected, selectedDefault, unit = '', fields = 1 } = item
    // 此处区分年、天有别于其他周期在于年和天都不是标准周期（每个月不同天，年一直在增长）
    if (['month', 'hour', 'minute', 'second'].includes(mode)) {
      // 设定显示的可选项
      // [...Array(getInverval('hour')).keys()]获取24个小时的数字的数组：[0,1,...,23]
      res.item.push(
        [...Array(getInverval(mode)).keys()]
          // 按照fields来平均分割这些数字
          .filter((i) => i % fields === 0)
          // 如果设置了selected属性，只返回特定的数字
          .filter((i) => {
            if (selected) return selected.includes(i)
            else return true
          })
          // 在所有的数字后面添加单位(unit)；由于月份为0-11，需要转换为1-12
          .map((i) => (mode === 'month' ? i + 1 : i) + unit)
      )
      // 根据time的值和selected的匹配来设定默认值为数组中第几个，当未指定selected或者定位到下个周期时，设定index为-1
      const index = selected && selected.findIndex((value) => value === time.get(mode))
      // 设定显示的默认选择项
      res.value.push(selected ? (index < 0 ? 0 : index) : ~~(time.get(mode) / fields))
    } else if (['year', 'day'].includes(mode)) {
      // 根据
      res.item.push(timeFormat(item, dayjs))
      // 寻找time和dayjs时间点的差值作为默认选择值
      res.value.push(selectedDefault || time.startOf(mode).diff(dayjs.startOf(mode), mode))
    } else {
      return
    }
  })
  return res
}

// 对于年和日，获取显示的可选项
const timeFormat = (time, dayjs) => {
  const { mode, duration = 30, unit = '', humanity = false } = time,
    res = []
  for (let i = 0; i < duration; i++) {
    let timeItem
    // 利用dayjs[convertDay(mode)]来动态实现dayjs.date()或dayjs.year()的方法，用computedTime来实现可选择项的生成
    const computedTime = dayjs.add(i, mode)
    if (humanity && mode === 'day') {
      timeItem = `${computedTime.month() + 1}月${computedTime.date()}日`
      if (i < 3) {
        // 今天明天后天这三天明确显示出来
        timeItem = (i === 0 ? '' : timeItem + ' ') + convertDate(i)
      } else {
        // 在日期后添加星期几，更人性化
        timeItem += ` ${convertWeek(computedTime.day())}`
      }
    } else {
      timeItem = computedTime.get(convertDay(mode)) + unit
    }
    res.push(timeItem)
  }
  return res
}

const convertWeek = (item) => {
  return { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }[item]
}

const convertDate = (item) => {
  return { 0: '今天', 1: '明天', 2: '后天' }[item]
}

// dayjs的get分为day of week和date of month，故需要将day转换为date使用
const convertDay = (item) => {
  return { day: 'date' }[item] || item
}

const getInverval = (item) => {
  return { hour: 24, minute: 60, second: 60, month: 12 }[item]
}

export default format
