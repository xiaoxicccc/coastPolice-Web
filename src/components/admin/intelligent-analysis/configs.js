const analysis = {
  columns: [
    {
      label: '船舶名称',
      prop: 'boatName',
      width: 120
    },
    {
      label: '报警类型',
      prop: 'alarmType',
      width: 150
    },
    // {
    //   label: '船主',
    //   prop: ''
    // },
    // {
    //   label: '联系方式',
    //   prop: ''
    // },
    {
      label: '报警状态',
      prop: 'status',
      width: 120
    },
    {
      label: '报警时间',
      prop: 'alarmTime',
      width: 160
    },
    {
      label: '最后定位经度',
      prop: 'lastLongitude',
      width: 130
    },
    {
      label: '最后定位纬度',
      prop: 'lastLatitude',
      width: 130
    },
    {
      label: '最后定位时间',
      prop: 'lastLocationTime',
      width: 160
    }
  ],
  items: [
    {
      event: 'alarm-type',
      label: '报警类型',
      prop: 'alarmType',
      type: 'select',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '越界捕捞',
          value: '越界捕捞'
        },
        {
          label: '设备异常',
          value: '设备异常'
        },
        {
          label: '围栏越界',
          value: '围栏越界'
        },
        {
          label: '一船多斗',
          value: '一船多斗'
        },
        {
          label: '碍航物标定',
          value: '碍航物标定'
        },
        {
          label: '未报备出海',
          value: '未报备出海'
        },
        {
          label: '北斗2H离线',
          value: '北斗2H不开机'
        },
        {
          label: '重点关注渔船',
          value: '重点关注渔船'
        },
        {
          label: '恶劣天气出海',
          value: '恶劣天气出海'
        }
      ]
    },
    {
      label: '报警时间',
      prop: 'time',
      type: 'timerange'
    },
    {
      label: '船舶名称',
      prop: 'shipName',
      type: 'input'
    },
    // {
    //   label: '设备号',
    //   prop: 'equipmentCode',
    //   type: 'input'
    // },
    // {
    //   label: '监控点',
    //   prop: 'video',
    //   type: 'autocomplete'
    // },
    {
      label: '报警来源',
      prop: 'msgType',
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
        }
      ]
    },
    {
      label: '报警状态',
      prop: 'acceptState',
      type: 'select',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待受理',
          value: '0'
        },
        {
          label: '处理中',
          value: '1'
        },
        {
          label: '已处理',
          value: '2'
        }
      ]
    },
    {
      label: '',
      name: '查询',
      prop: 'query',
      style: 'primary-form',
      type: 'button'
    }
  ],
  model: {
    acceptState: '',
    alarmType: '',
    equipmentCode: null,
    msgType: '',
    shipName: null,
    time: ['', ''],
    video: null
  }
}

export {
  analysis
}
