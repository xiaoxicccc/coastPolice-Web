const items = [
  {
    label: '告警时间',
    prop: 'startTime',
    type: 'datetime'
  },
  {
    label: '结束时间',
    prop: 'endTime',
    type: 'datetime'
  },
  {
    label: '船舶名称',
    prop: 'shipName',
    type: 'input'
  },
  {
    label: '报警来源',
    prop: 'source',
    type: 'select',
    options: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '北斗',
        value: 'Beidou'
      },
      {
        label: 'AIS',
        value: 'AIS'
      },
      {
        label: '雷达',
        value: 'Radar'
      },
      {
        label: '外地船舶',
        value: '外地船舶'
      }
    ]
  }
]

const list = [
  {
    delay: 0,
    edit: false,
    key: '越界捕捞',
    label: '越界捕捞',
    prop: 'fishing'
  },
  {
    delay: 0.05,
    edit: false,
    key: '设备异常',
    label: '设备异常',
    prop: 'key'
  },
  {
    delay: 0.1,
    edit: true,
    key: '围栏越界',
    label: '围栏越界',
    prop: 'crossing'
  },
  {
    delay: 0.15,
    edit: false,
    key: '一船多斗',
    label: '一船多斗',
    prop: 'beidous'
  },
  {
    delay: 0.2,
    edit: false,
    key: '碍航物标定',
    label: '碍航物标定',
    prop: 'obstacle'
  },
  {
    delay: 0.25,
    edit: false,
    key: '未报备出海',
    label: '未报备出海',
    prop: 'reported'
  },
  {
    delay: 0.3,
    edit: true,
    key: '北斗2H不开机',
    label: '北斗2H离线',
    prop: 'satellite'
  },
  {
    delay: 0.35,
    edit: false,
    key: '重点关注渔船',
    label: '重点关注渔船',
    prop: 'focus'
  },
  {
    delay: 0.4,
    edit: false,
    key: '恶劣天气出海',
    label: '恶劣天气出海',
    prop: 'bad-weather'
  }
]

const model = {
  endTime: null,
  shipName: null,
  source: '',
  startTime: null,
  type: null
}

export {
  items,
  list,
  model
}
