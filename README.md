# 基于 Taro 实现的时间选择器

本项目基于 pickerView、pickerViewColumn 来自定义了一个选择器用于日期和时间在用一个组件中选择完成。项目使用 taro 框架，也可实现类似微信提醒的时间选择器

<img src="https://user-images.githubusercontent.com/2065312/77916205-4a60b200-72cb-11ea-91ed-cc7eccacfaf9.jpg">
<img src="https://user-images.githubusercontent.com/2065312/77916216-4df43900-72cb-11ea-8389-c0cf842a4abd.png" />

## 简介

本项目所实现的组件拥有灵活的配置项可轻松实现如下的时间选择功能：

- 年月日时分秒全部支持
- 类似微信提醒中的今天、x 月 x 日 明天、x 月 x 日 后天、x 月 x 日 周一...等时间选择
- 一个周期内的某几个时间点选择 (如一天内的 8 点、12 点、16 点)
- 一个周期内的固定间隔时间 (如 10 分、20 分、30 分、40 分)等
- 配合时间偏移属性(offset)支持默认时间选取下个整点或整十分等
- 模仿了微信默认的确认取消按钮，和微信的选择器保持体验一致，并通过 props 和父组件交互

最新的版本组件利用了[day.js](https://day.js.org/zh-CN/)来代替 moment-mini，得益于 day.js，将原来的 75KB 大小的日期处理库降为了 2KB 的大小。
~~组件利用了[moment](http://momentjs.cn/)这个日期处理类库的部分特性来让代码更加简洁和稳定，为了保持小程序包的体积尽量小，组件 import 了 moment-mini 这个 npm 包，~~
当你调用 onInitial 和 onConfirm 时，可通过指定 mode 来获得返回时间的数据格式

## 如何使用

可参考 src/pages/index/index.jsx 的使用方法

#### dateTime 的使用：

dataTime 参数是多个对象元素的数组，每个对象可支持如下参数选择：

- mode: ['year', 'month', 'day', 'hour', 'minute', 'second']
- unit: 界面中的日期标记，例如年，月，日，时，分，秒或小时的:00
- duration: 显示当前模式的最大数量，例如 10 年或 30 天(只可用于年和日)
- fields: 可指定当前模式中间隔固定时间间断进行显示，例如只显示 10 秒、20 秒、30 秒(只可用于月、小时、分钟、秒钟)，不能和 selected 同时指定
- humanity：可显示类似微信提醒的时间选择列表，如今天，XX 月 XX 日 明天，XX 月 XX 日 周 X。需搭配 format: 'M 月 D 日'使用，目前仅适用于 mode 为 day 时
- format: 用于解决组合时间的格式化问题，正常情况不需要指定，只有当遇到组合（如 X 月 X 日）或者指定 unit(例如:00)时使用
- selected: 可指定当前模式下只选择有效范围内的哪几个元素，例如 24 小时内，只选择 8 点、12 点、16 点,，不能和 fields 同时指定
- selectedDefault: 指定 selected 的默认值(而不用当前时间去匹配)
- offset: 设定当前时间点偏移量(常用于设定下一小时或者下一天等)

dateTime 举例：

- {mode: 'year', unit: '年' },
- {mode: 'month', unit: '月'},
- { mode: 'day', duration: 90, unit: '日', humanity: true, format: 'M月D日' },
- { mode: 'hour', unit: ':00', format: 'H:s', selected: [8, 12, 16] },
- { mode: 'hour', unit: '时' },
- {mode: 'minute', fields: 10, unit: '分'},
- {mode: 'second', fields: 30, unit: '秒'},

## 新版更新（2020-12-08）：

将 master branch 升级到 taro3，之前的版本在 taro2 的 branch
支持了多列选择，可以轻松实现请假开始日期和请假结束日期在一个组件里面选择
修复了已有的一些 bug，同时将代码的注释完全写清楚（尤其核心 format.js）

## 新版更新（2020-03-30）：

将组件和 format 逻辑分开，同时支持更多的参数选择。

## 组件的使用

#### dateTime

传入需要显示的时间模式，具体请参考 dateTime 的使用

#### onConfirm()

点击确认时触发，传递参数为选择器当前选择的时间(dayjs 格式)

#### onCancel()

点击取消时触发，可被父组件用于触发弹框隐藏之类的操作

#### onInitial()

组件加载时触发，通知父组件初始化时本组件的时间选择结果(由于初始化为当前时间可能为下一个时间周期例如使用 fields、selected 等参数，故本操作可把初始化时间直接传给父组件用于展示)

#### mode

指定 onInitial 和 onConfirm 时返回的日期格式，支持[format](https://day.js.org/docs/zh-CN/display/format)、[unix](https://day.js.org/docs/zh-CN/display/unix-timestamp)、[toString](https://day.js.org/docs/zh-CN/display/as-string)、[fromNow](https://day.js.org/docs/zh-CN/display/from-now)等等，具体请参考 dayjs 文档。
