const archives = {
  columns: [
    {
      label: '港口名称',
      prop: 'name',
      width: 130
    },
    {
      label: '单位名称',
      prop: 'departName',
      width: 130
    },
    {
      label: '港口类型',
      prop: 'typeName',
      width: 70
    },
    {
      key: 'color',
      label: '风险等级',
      prop: 'riskGrade',
      width: 60
    },
    {
      label: '经度',
      prop: 'longitude',
      width: 90
    },
    {
      label: '纬度',
      prop: 'latitude',
      width: 90
    },
    {
      label: '具体位置',
      prop: 'address',
      width: 130
    }
  ],
  items: [
    {
      label: '渔港信息',
      children: [
        {
          label: '港口名称',
          prop: 'name',
          readonly: true,
          type: 'input',
          width: '100%'
        },
        {
          label: '单位名称',
          prop: 'departName',
          readonly: true,
          type: 'input',
          width: '50%'
        },
        {
          label: '港口类型',
          prop: 'typeName',
          readonly: true,
          type: 'input',
          width: '50%'
        },
        {
          label: '经度',
          placeholder: '请点击地图选取或手动录入经度',
          prop: 'longitude',
          readonly: false,
          type: 'pickup',
          width: '50%'
        },
        {
          label: '纬度',
          placeholder: '请点击地图选取或手动录入纬度',
          prop: 'latitude',
          readonly: false,
          type: 'pickup',
          width: '50%'
        },
        {
          label: '具体位置',
          prop: 'address',
          readonly: true,
          type: 'input',
          width: '100%'
        },
        {
          label: '经营单位',
          prop: 'operatingUnit',
          readonly: false,
          type: 'input',
          width: '50%'
        },
        {
          label: '安保力量(人)',
          prop: 'securityNum',
          readonly: false,
          type: 'number',
          width: '50%'
        },
        {
          label: '简介',
          prop: 'shortDesc',
          readonly: true,
          rows: 2,
          type: 'textarea',
          width: '100%'
        },
        {
          label: '备注',
          prop: 'remarks',
          readonly: true,
          rows: 2,
          type: 'textarea',
          width: '100%'
        }
        // {
        //   label: '图片',
        //   readonly: true,
        //   prop: '',
        //   width: '100%'
        // }
      ]
    },
    {
      label: '停靠船舶数量',
      children: [
        { // 自己算
          label: '总数',
          prop: 'boatTotal',
          readonly: true,
          type: 'number',
          width: '50%'
        },
        {
          label: '本地船舶',
          prop: 'localBoatNum',
          readonly: false,
          type: 'number',
          width: '50%'
        },
        {
          label: '外地船舶',
          prop: 'nonLocalBoatNum',
          readonly: false,
          type: 'number',
          width: '50%'
        }
      ]
    },
    {
      label: '分类分级统计',
      children: [
        {
          label: '总数',
          prop: 'gradeTotal',
          readonly: true,
          type: 'number',
          width: '50%'
        },
        {
          label: '高危船舶',
          prop: 'highRiskNum',
          readonly: false,
          type: 'number',
          width: '50%'
        },
        {
          label: '关注船舶',
          prop: 'attentionBoatNum',
          readonly: false,
          type: 'number',
          width: '50%'
        },
        {
          label: '可控船舶',
          prop: 'controlBoatNum',
          readonly: false,
          type: 'number',
          width: '50%'
        }
      ]
    },
    {
      label: '治安防范',
      children: [
        {
          label: '是否封闭环境',
          prop: 'isClosed',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        },
        {
          label: '监控数量',
          prop: 'monitorNum',
          readonly: false,
          type: 'number',
          width: '50%'
        },
        {
          label: '出入口是否监控覆盖',
          prop: 'entranceExitMonitor',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        },
        {
          label: '重点部位是否视频全覆盖',
          prop: 'mainMonitor',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        },
        {
          label: '是否可实现视频全覆盖',
          prop: 'globalMonitor',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        },
        {
          label: '是否建有海岸雷达',
          prop: 'haveShoreRadar',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        },
        {
          label: '是否建有交通卡口',
          prop: 'haveTrafficQuay',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        },
        {
          label: '是否建有电子围栏',
          prop: 'haveElectronicFence',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        },
        {
          label: '警务室数量',
          prop: 'policeRoomNum',
          readonly: false,
          type: 'number',
          width: '50%'
        },
        {
          label: '船管站数量',
          prop: 'shipManageNum',
          readonly: false,
          type: 'number',
          width: '50%'
        }
      ]
    },
    {
      label: '是否发生(包括既遂和未遂)',
      children: [
        {
          label: '走私',
          prop: 'haveSmuggle',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        },
        {
          label: '偷渡',
          prop: 'haveStowaway',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          width: '50%'
        }
      ]
    },
    {
      label: '其他',
      children: [
        {
          label: '自评得分',
          prop: 'selfScore',
          readonly: false,
          type: 'number',
          width: '50%'
        },
        {
          label: '风险等级',
          prop: 'riskGrade',
          readonly: false,
          type: 'select',
          options: [
            {
              label: '蓝',
              value: '蓝'
            },
            {
              label: '黄',
              value: '黄'
            },
            {
              label: '橙',
              value: '橙'
            },
            {
              label: '红',
              value: '红'
            }
          ],
          width: '50%'
        }
      ]
    }
  ],
  model: {
    address: null,
    attentionBoatNum: 0, // 关注船舶
    boatTotal: 0, // 停靠船舶数量总数
    controlBoatNum: 0, // 可控船舶
    departName: null,
    entranceExitMonitor: '否', // 出入口是否监控覆盖
    globalMonitor: '否', // 是否可实现视频全覆盖
    gradeTotal: 0, // 分级分类总数
    haveElectronicFence: '否', // 是否建有电子围栏
    haveShoreRadar: '否', // 是否建有海岸雷达
    haveSmuggle: '否', // 走私
    haveStowaway: '否', // 偷渡
    haveTrafficQuay: '否', // 是否建有交通卡口
    highRiskNum: 0, // 高危船舶
    isClosed: '否', // 是否封闭环境
    latitude: null,
    localBoatNum: 0, // 本地船舶
    longitude: null,
    mainMonitor: '否', // 重点部位是否视频全覆盖
    monitorNum: 0, // 监控数量
    name: null,
    nonLocalBoatNum: 0, // 外地船舶
    number: 0, // 自评得分
    operatingUnit: null, // 经营单位
    policeRoomNum: 0, // 警务室数量
    portArea: null,
    remarks: null,
    riskGrade: '蓝', // 风险等级
    securityNum: 0, // 安保力量(人)
    shipManageNum: 0, // 船管站数量
    shortDesc: null,
    typeName: null
  },
  rules: {
    latitude: [
      { required: true, message: '纬度 未填写', trigger: 'blur' }
    ],
    longitude: [
      { required: true, message: '经度 未填写', trigger: 'blur' }
    ]
  }
}

export {
  archives
}
