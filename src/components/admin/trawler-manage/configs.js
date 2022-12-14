const dicts = JSON.parse(localStorage.getItem('dicts'))
const archives = {
  columns: [
    {
      label: '船名号',
      prop: 'shipName',
      width: 120
    },
    // {
    //   label: '北斗设备号',
    //   prop: 'bdId',
    //   width: 120
    // },
    // {
    //   label: 'mmsi',
    //   prop: 'mmsi'
    // },
    {
      label: '管理单位',
      prop: 'company',
      width: 150
    },
    {
      label: '行政区域',
      prop: 'region',
      width: 130
    },
    {
      label: '船主姓名',
      prop: 'shipOwner'
    },
    {
      label: '联系方式',
      prop: 'ownerPhone',
      width: 130
    },
    {
      label: '船籍港',
      prop: 'homePort',
      width: 100
    },
    {
      label: '船舶功率(KW)',
      prop: 'power',
      width: 110
    },
    {
      label: '作业区域',
      prop: 'work'
    },
    {
      label: '是否重点关注',
      prop: 'focus',
      width: 100
    },
    {
      label: '是否高亮船只',
      prop: 'highlight',
      width: 100
    }
    // {
    //   label: '审核状态',
    //   prop: 'status'
    // },
    // {
    //   label: '审核时间',
    //   prop: 'time',
    //   width: 150
    // }
    // {
    //   label: '创建时间',
    //   prop: 'creatTime',
    //   width: 150
    // }
  ],
  items: [
    {
      label: '船名号',
      prop: 'name',
      type: 'input'
    },
    {
      label: '船舶类型',
      prop: 'typeName',
      type: 'select',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '本地船舶',
          value: '本地船舶'
        },
        {
          label: '外地船舶',
          value: '外地船舶'
        }
      ]
    },
    {
      label: '船主姓名',
      prop: 'ownerName',
      type: 'input'
    },
    {
      label: '联系方式',
      prop: 'ownerPhone',
      type: 'input'
    },
    {
      label: '管理单位',
      prop: 'departName',
      type: 'autocomplete',
      options: [
      ]
    },
    {
      label: '船籍港',
      prop: 'homePortName',
      type: 'input'
    },
    {
      label: '常泊港',
      prop: 'oftenBerthName',
      type: 'input'
    },
    //  {
    //   label: '审核状态',
    //   prop: 'approveStatus',
    //   type: 'select',
    //   options: [
    //     {
    //       label: '全部',
    //       value: ''
    //     },
    //     {
    //       label: '未审核',
    //       value: '0'
    //     },
    //     {
    //       label: '已通过',
    //       value: '1'
    //     },
    //     {
    //       label: '已拒绝',
    //       value: '2'
    //     }
    //   ]
    // },
    {
      label: '',
      name: '查询',
      prop: 'query',
      style: 'primary-form',
      type: 'button'
    }
    // {
    //   label: '',
    //   name: '新增',
    //   prop: 'insert',
    //   style: 'success-form',
    //   type: 'button'
    // },
    // {
    //   label: '',
    //   name: '删除',
    //   prop: 'delete',
    //   style: 'danger-form',
    //   type: 'button'
    // }
  ],
  model: {
    approveStatus: '',
    frontDepart: null,
    homePortName: null,
    name: null,
    oftenBerthName: null,
    ownerName: null,
    ownerPhone: null,
    typeName: ''
  }
}

const collection = {
  columns: [
    {
      label: '船名号',
      prop: 'shipName'
    },
    {
      label: '船主姓名',
      prop: 'shipOwner'
    },
    {
      label: '联系方式',
      prop: 'phone'
    },
    {
      label: '海岸管理单位',
      prop: 'department'
    },
    {
      label: '船籍港',
      prop: 'port'
    }
  ]
}

const crew = {
  columns: [
    {
      label: '姓名',
      prop: 'name'
    },
    {
      label: '船舶名称',
      prop: 'boatName'
    },
    {
      label: '联系方式',
      prop: 'phone'
    },
    {
      label: '身份证号',
      prop: 'idCardNo'
    },
    // {
    //   label: '船民证号',
    //   prop: 'crewCode'
    // },
    // {
    //   label: '船主名称',
    //   prop: ''
    // },
    // {
    //   label: '单位名称',
    //   prop: ''
    // },
    {
      label: '船上职务',
      prop: 'boatDutyName'
    }
    // {
    //   label: '登船时间',
    //   prop: 'aboardDate'
    // },
    // {
    //   label: '离船时间',
    //   prop: 'leaveDate'
    // }
    // {
    //   label: '现地址',
    //   prop: ''
    // }
  ]
}

// 进出港信息
const distinguish = {
  columns: [
    {
      label: '船名号',
      prop: 'boatName'
    },
    {
      label: '船主姓名',
      prop: 'ownerName'
    },
    {
      label: '单位名称',
      prop: 'departName'
    },
    {
      label: '进出港状态',
      prop: 'type'
    },
    {
      label: '进出港时间',
      prop: 'recordTimes'
    }
  ]
}

const insert = {
  items: [
    {
      label: '渔船基本信息',
      name: 'base',
      children: [
        {
          label: '船名号',
          prop: 'name',
          type: 'input'
        },
        {
          label: '船舶属地',
          prop: 'typeName',
          type: 'select',
          options: dicts.boat_type.slice()
        },
        {
          label: '船主姓名',
          prop: 'ownerName',
          type: 'input'
        },
        {
          label: '联系方式',
          prop: 'ownerPhone',
          type: 'input'
        },
        {
          label: '船舶用途',
          prop: 'usageName',
          type: 'select',
          options: dicts.boat_usage.slice()
        },
        {
          label: '船舶性质',
          prop: 'natureName',
          type: 'select',
          options: dicts.boat_nature.slice()
        },
        {
          label: '船主住址',
          prop: 'ownerAddress',
          type: 'input'
        },
        // {
        //   label: '北斗设备号',
        //   prop: 'beiDouId',
        //   type: 'input'
        // },
        // {
        //   label: 'mmsi',
        //   prop: 'mmsi',
        //   type: 'input'
        // },
        {
          label: '管理单位',
          prop: 'departName',
          type: 'input'
        },
        {
          label: '船籍港',
          prop: 'homePortName',
          type: 'input'
        },
        {
          label: '省市区',
          prop: 'region',
          type: 'input'
        },
        {
          label: '船务公司',
          prop: 'shipCompany',
          type: 'input'
        },
        {
          label: '建造厂家',
          prop: 'buildFactory',
          type: 'input'
        },
        {
          label: '建造日期',
          prop: 'buildDate',
          type: 'date'
        }
      ],
      width: '50%'
    },
    {
      label: '渔船终端信息',
      name: 'terminal',
      children: [
        {
          label: '终端设备',
          multiple: true,
          prop: 'msgType',
          type: 'selects',
          options: [
            {
              label: '北斗',
              value: 'Beidou'
            },
            {
              label: 'AIS',
              value: 'AIS'
            }
          ]
        },
        {
          label: '设备号',
          prop: 'mmsi',
          type: 'input'
        },
        {
          label: '服务厂家',
          prop: 'serviceType',
          type: 'input'
        },
        {
          label: '最后定位时间',
          prop: 'gpsTime',
          type: 'input'
        },
        {
          label: '定位经度',
          prop: 'longitude',
          type: 'input'
        },
        {
          label: '定位纬度',
          prop: 'latitude',
          type: 'input'
        }
      ],
      width: '50%'
    },
    {
      label: '渔船作业信息',
      name: 'work',
      children: [
        {
          label: '作业区',
          prop: 'jobRegionName',
          type: 'select',
          options: dicts.boat_area.slice()
        },
        {
          label: '航行区域',
          prop: 'sailRegion',
          type: 'input'
        },
        {
          label: '常泊港名称',
          prop: 'oftenBerthName',
          type: 'input'
        }
        // {
        //   label: '目前停靠地',
        //   prop: '',
        //   type: 'input'
        // },
        // {
        //   label: '目前停靠地分类',
        //   prop: '',
        //   type: 'select',
        //   options: [
        //   ]
        // }
      ],
      width: '50%'
    },
    {
      label: '渔船建造信息',
      name: 'build',
      children: [
        {
          label: '船高(m)',
          prop: 'high',
          type: 'number'
        },
        {
          label: '船长(m)',
          prop: 'length',
          type: 'number'
        },
        {
          label: '船宽(m)',
          prop: 'width',
          type: 'number'
        },
        {
          label: '船体材料',
          prop: 'materialName',
          type: 'select',
          options: dicts.boat_material.slice()
        },
        {
          label: '船舶功率(kw)',
          prop: 'power',
          type: 'number'
        },
        {
          label: '船舶功率(马力)',
          prop: 'powerML',
          type: 'number'
        },
        {
          label: '主机功率(kw)',
          prop: 'mainPower',
          type: 'number'
        },
        {
          label: '主机实际功率(马力)',
          prop: 'mainPowerML',
          type: 'number'
        },
        {
          label: '船舶吨位(吨)',
          prop: 'tonnage',
          type: 'number'
        },
        {
          label: '净吨位(吨)',
          prop: 'netTonnage',
          type: 'number'
        }
      ],
      width: '50%'
    },
    {
      label: '渔船审核信息',
      name: 'input',
      children: [
        {
          label: '是否重点',
          prop: 'isMain',
          type: 'selects',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          label: '是否布控',
          prop: 'isControl',
          type: 'selects',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          label: '是否流入流出',
          prop: 'isInoutFlow',
          type: 'selects',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          label: '是否免打扰',
          prop: 'isDisturb',
          type: 'selects',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          label: '免打扰开始时间',
          prop: 'disturbStart',
          type: 'datetime'
        },
        {
          label: '免打扰结束时间',
          prop: 'disturbEnd',
          type: 'datetime'
        },
        {
          label: '录入民警姓名',
          prop: 'approveMan',
          type: 'input'
        },
        {
          label: '审核状态',
          prop: 'approveStatus',
          type: 'selects',
          options: [
            {
              label: '未审核',
              value: 0
            },
            {
              label: '已通过',
              value: 1
            },
            {
              label: '已拒绝',
              value: 2
            }
          ]
        },
        {
          label: '审核情况',
          prop: 'approveDesc',
          type: 'input'
        },
        {
          label: '审核时间',
          prop: 'approveDate',
          type: 'datetime'
        }
        // {
        //   label: '备注',
        //   prop: '',
        //   type: 'input'
        // }
      ],
      width: '50%'
    },
    {
      label: '渔船证书信息',
      name: 'certificate',
      children: [
        {
          label: '船舶证书',
          limit: 3,
          prop: 'credential',
          type: 'file'
        }
      ],
      width: '100%'
    },
    {
      label: '渔船照片',
      name: 'picture',
      children: [
        {
          label: '渔船照片',
          limit: 3,
          prop: 'picture',
          type: 'file'
        }
      ],
      width: '100%'
    }
  ],
  model: {
    approveDate: null,
    approveDesc: null,
    approveMan: null,
    approveStatus: null,
    beiDouId: null,
    buildDate: null,
    buildFactory: null,
    createDepart: null,
    credential: null,
    departName: null,
    disturbEnd: null,
    disturbStart: null,
    gpsTime: null,
    high: null,
    homePortName: null,
    isControl: null,
    isDisturb: null,
    isInoutFlow: null,
    isMain: null,
    jobRegionName: null,
    latitude: null,
    length: null,
    longitude: null,
    mainPower: null,
    mainPowerML: null,
    materialName: null,
    msgType: null,
    mmsi: null,
    name: null,
    natureName: null,
    netTonnage: null,
    oftenBerthName: null,
    ownerAddress: null,
    ownerName: null,
    ownerPhone: null,
    picture: null,
    power: null,
    powerML: null,
    region: null,
    sailRegion: null,
    serviceType: null,
    shipCompany: null,
    tonnage: null,
    typeName: null,
    usageName: null,
    width: null
  },
  rules: {
    beiDouId: [
      { required: false, message: '北斗设备号 未填写', trigger: 'blur' }
    ],
    buildDate: [
      { required: true, message: '建造日期 未选择', trigger: 'change' }
    ],
    buildFactory: [
      { required: true, message: '建造厂家 未填写', trigger: 'blur' }
    ],
    createDepart: [
      { required: true, message: '海岸管理单位 未填写', trigger: 'blur' }
    ],
    high: [
      { required: true, message: '船高(m) 未填写', trigger: 'blur' }
    ],
    homePortName: [
      { required: true, message: '船籍港 未填写', trigger: 'blur' }
    ],
    length: [
      { required: true, message: '船长(m) 未填写', trigger: 'blur' }
    ],
    materialName: [
      { required: false, message: '船体材料 未填写', trigger: 'blur' }
    ],
    mmsi: [
      { required: false, message: 'mmsi 未填写', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '船名 未填写', trigger: 'blur' }
    ],
    ownerAddress: [
      { required: false, message: '船主住址 未填写', trigger: 'blur' }
    ],
    ownerName: [
      { required: true, message: '船主姓名 未填写', trigger: 'blur' }
    ],
    power: [
      { required: true, message: '船舶功率(kw) 未填写', trigger: 'blur' }
    ],
    tonnage: [
      { required: true, message: '船舶吨位(吨) 未填写', trigger: 'blur' }
    ],
    width: [
      { required: true, message: '船宽(m) 未填写', trigger: 'blur' }
    ]
  }
}

export {
  archives,
  collection,
  crew,
  distinguish,
  insert
}
