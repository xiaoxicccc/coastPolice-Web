const dicts = JSON.parse(localStorage.getItem('dicts'))
const video = {
  columns: [
    {
      label: '摄像头名称',
      prop: 'videoName',
      width: 250
    },
    {
      label: '摄像头类型',
      prop: 'videoType',
      width: 90
    },
    {
      label: '类型',
      prop: 'duration',
      width: 50
    },
    {
      label: '运行状态',
      prop: 'status',
      width: 80
    },
    {
      label: '录入单位名称',
      prop: 'departName',
      width: 150
    },
    // {
    //   label: '经度',
    //   prop: 'longitude'
    // },
    // {
    //   label: '纬度',
    //   prop: 'latitude'
    // },,
    {
      label: '港口码头名称',
      prop: 'layoutArea',
      width: 140
    },
    {
      label: '创建时间',
      prop: 'createAt',
      width: 150
    }
  ],
  items: [
    {
      label: '摄像头名称',
      prop: 'videoName',
      type: 'input',
      width: '50%'
    },
    {
      label: '摄像头类型',
      prop: 'videoType',
      type: 'select',
      options: [
        {
          label: '枪机',
          value: '枪机'
        },
        {
          label: '球机',
          value: '球机'
        },
        {
          label: '人车识别',
          value: '人车识别'
        }
      ],
      width: '50%'
    },
    {
      label: '经度',
      max: 180,
      min: -180,
      placeholder: '请点击地图选取或手动录入经度',
      prop: 'longitude',
      type: 'pickup',
      width: '50%'
    },
    {
      label: '纬度',
      max: 90,
      min: -90,
      placeholder: '请点击地图选取或手动录入纬度',
      prop: 'latitude',
      type: 'pickup',
      width: '50%'
    },
    {
      label: '摄像头编号',
      prop: 'videoCode',
      type: 'input',
      width: '50%'
    },
    {
      label: '视频预览链接',
      prop: 'previewUrl',
      type: 'input',
      width: '50%'
    },
    {
      label: '运行状态',
      prop: 'runStatus',
      type: 'select',
      options: dicts.run_state.slice(),
      width: '50%'
    },
    {
      label: '港口码头名称',
      prop: 'layoutArea',
      type: 'autocomplete',
      options: [],
      width: '50%'
    },
    {
      label: '录入单位名称',
      prop: 'departName',
      type: 'filterable',
      options: [],
      width: '50%'
    },
    {
      label: '摄像头所属单位',
      prop: 'videoBelong',
      type: 'input',
      width: '50%'
    },
    {
      label: '类型',
      prop: 'duration',
      type: 'select',
      options: [
        {
          label: '天网',
          value: '天网'
        },
        {
          label: '海防',
          value: '海防'
        },
        {
          label: '渔政',
          value: '渔政'
        },
        {
          label: '村队',
          value: '村队'
        },
        {
          label: '个人',
          value: '个人'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      width: '50%'
    },
    {
      label: '是否全景',
      prop: 'isAr',
      type: 'select',
      options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ],
      width: '50%'
    },
    {
      label: '联网类型',
      prop: 'innetType',
      type: 'select',
      options: [
        {
          label: '公安网',
          value: '公安网'
        },
        {
          label: '渔政网',
          value: '渔政网'
        },
        {
          label: '局域网',
          value: '局域网'
        },
        {
          label: '未联网',
          value: '未联网'
        }
      ],
      width: '50%'
    },
    {
      label: '传感器类型',
      prop: 'sensorType',
      type: 'select',
      options: [
        {
          label: '可见光',
          value: '可见光'
        },
        {
          label: '热成像',
          value: '热成像'
        }
      ],
      width: '50%'
    },
    {
      label: '是否常用摄像头',
      prop: 'commonUse',
      type: 'select',
      options: [
        {
          label: '常用',
          value: '1'
        },
        {
          label: '不常用',
          value: '0'
        }
      ],
      width: '50%'
    },
    {
      label: '备注',
      prop: 'remark',
      rows: 4,
      type: 'textarea',
      width: '100%'
    }
  ],
  model: {
    commonUse: '1', // 是否常用摄像头
    departName: null, // 录入单位
    duration: null, // 类型
    innetType: null, // 联网类型
    isAr: null, // 是否全景
    latitude: 0, // 纬度
    layoutArea: null, // 港口码头名称
    longitude: 0, // 经度
    previewUrl: null, // 视频预览链接
    remark: null, // 备注
    runStatus: null, // 运行状态
    sensorType: null, // 传感器类型
    videoBelong: null, // 摄像头所属单位
    videoCode: null, // 摄像头编码
    videoName: null, // 摄像头名称
    videoType: null // 摄像头类型
  },
  rules: {
    commonUse: [
      { required: false, message: '是否常用摄像头 未选择', trigger: 'change' }
    ],
    duration: [
      { required: true, message: '类型 未选择', trigger: 'change' }
    ],
    innetType: [
      { required: false, message: '联网类型 未选择', trigger: 'change' }
    ],
    isAr: [
      { required: false, message: '是否全景 未选择', trigger: 'change' }
    ],
    latitude: [
      { required: true, message: '纬度 未填写', trigger: 'blur' }
    ],
    layoutArea: [
      { required: false, message: '港口码头名称 未填写', trigger: 'blur' }
    ],
    longitude: [
      { required: true, message: '经度 未填写', trigger: 'blur' }
    ],
    previewUrl: [
      { required: false, message: '视频预览链接 未填写', trigger: 'blur' }
    ],
    runStatus: [
      { required: false, message: '运行状态 未填写', trigger: 'blur' }
    ],
    sensorType: [
      { required: false, message: '传感器类型 未选择', trigger: 'change' }
    ],
    videoBelong: [
      { required: false, message: '摄像头所属单位 未填写', trigger: 'blur' }
    ],
    videoName: [
      { required: true, message: '摄像头名称 未填写', trigger: 'blur' }
    ],
    videoType: [
      { required: true, message: '摄像头类型 未选择', trigger: 'change' }
    ]
  }
}

export {
  video
}
