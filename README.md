# 基于Taro实现的时间选择器

由于小程序中的picker只支持date/time等类型的通用选择，而像“今天 10点 30分”这样的更加方便选择的格式需要自行定义，故本项目基于pickerView、pickerViewColumn来自定义了一个选择器用于日期和时间在用一个组件中选择完成。项目使用taro框架，也可实现类似微信提醒的时间选择器

<img src="https://user-images.githubusercontent.com/2065312/77916205-4a60b200-72cb-11ea-91ed-cc7eccacfaf9.jpg">
<img src="https://user-images.githubusercontent.com/2065312/77916216-4df43900-72cb-11ea-8389-c0cf842a4abd.png" />

## 简介

大多数的时间选择不需要精确到分钟数的个位数字（例如23分），本项目可对当前的时间取到下一个十分（例如20分、30分），同时还支持从一个时间列表中选取某几个时间点：例如6点、12点、18点。

大多数的其他选择器没有调整好类似微信的确认和取消按钮，为了达到基本和微信的选择器体验一致，本项目也实现了确认和取消的按钮，并通过props和父组件交互

最新的版本组件利用了[day.js](https://day.js.org/zh-CN/)来代替moment-mini，得益于day.js，将原来的75KB大小的日期处理库降为了2KB的大小。
~~组件利用了[moment](http://momentjs.cn/)这个日期处理类库的部分特性来让代码更加简洁和稳定，为了保持小程序包的体积尽量小，组件import了moment-mini这个npm包，~~
当你调用onInitial和onConfirm时，可通过指定mode来获得返回时间的数据格式

## 如何使用
可参考src/pages/index/index.jsx的使用方法

#### dateTime的使用：
dataTime参数是多个对象元素的数组，每个对象可支持如下参数选择：
* mode: ['year', 'month', 'day', 'hour', 'minute', 'second']
* unit: 界面中的日期标记，例如年，月，日，时，分，秒
* start: 用于mode为year和day，可以指定过去的某一年/天，也可以指定将来的某一年/天
* duration: 显示当前模式的最大数量，例如10年或30天
* fields: 可指定当前模式中间隔固定时间间断进行显示，例如只显示10秒、20秒、30秒
* format: 用于解决组合时间的格式化问题，例如X月X日，或者8:00
* selected: 可指定当前模式下只选择有效范围内的哪几个元素，例如24小时内，只选择8点、12点、16点
* humanity：目前只支持mode为day，可显示类似微信提醒的时间选择列表，如今天，明天 XX月XX日， XX月XX日 周X, 需搭配format: 'M月D日'使用。

dateTime举例：
* {mode: 'year', unit: '年', start: '2020'},
* {mode: 'month', unit: '月'},
* { mode: 'day', duration: 30, unit: '日', humanity: true, format: 'M月D日' },
* {mode: 'day', start: '21', duration: 30, unit: '日' },
* { mode: 'hour', unit: ':00', format: 'H:s', selected: [8, 12, 16] },
* { mode: 'hour', unit: '时' },
* {mode: 'minute', fields: 10, unit: '分'},
* {mode: 'second', fields: 30, unit: '秒'},

## 新版更新（2020-03-30）：
将组件和format逻辑分开，同时支持更多的参数选择。

## 组件的使用

#### dateTime

传入需要显示的时间模式，具体请参考dateTime的使用

#### onConfirm()

点击确认时触发，传递参数为选择器当前选择的时间(dayjs格式)

#### onCancel()

点击取消时触发，可被父组件用于触发弹框隐藏之类的操作

#### onInitial()

组件加载时触发，通知父组件初始化时本组件的时间选择结果(由于初始化为当前时间可能为下一个时间周期例如使用fields、selected等参数，故本操作可把初始化时间直接传给父组件用于展示)

#### mode

指定onInitial和onConfirm时返回的日期格式，支持[format](https://day.js.org/docs/zh-CN/display/format)、[unix](https://day.js.org/docs/zh-CN/display/unix-timestamp)、[toString](https://day.js.org/docs/zh-CN/display/as-string)、[fromNow](https://day.js.org/docs/zh-CN/display/from-now)等等，具体请参考dayjs文档。
