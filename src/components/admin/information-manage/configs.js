
const seaElement = {
  columns: [
    {
      label: '涉海要素类型',
      prop: 'elementType',
      filter: ['all'],
      width: '130'
    },
    {
      label: '涉海要素名称',
      prop: 'elementName',
      filter: ['all'],
      width: '150'
    },
    {
      label: '所属派出所',
      prop: 'policeStation',
      filter: ['all'],
      width: '150'
    },
    {
      label: '负责人',
      prop: 'personLiable',
      filter: ['all'],
      width: '100'
    },
    {
      label: '电话',
      prop: 'tel',
      filter: ['all'],
      width: '110'
    },
    {
      label: '工厂地址',
      prop: 'plantAddress',
      filter: ['all'],
      width: '130'
    },
    {
      label: '经度',
      prop: 'longitude',
      filter: ['all'],
      width: '110'
    },
    {
      label: '纬度',
      prop: 'latitude',
      filter: ['all'],
      width: '110'
    },
    {
      label: '面积（平方）',
      prop: 'area',
      filter: ['养殖场', '加油站', '海洋牧场'],
      width: '110'
    },
    {
      label: '养殖加工产品名称',
      prop: 'productName',
      filter: ['养殖场'],
      width: '130'
    },
    {
      label: '招工人数区间',
      prop: 'recruitsNumber',
      filter: ['养殖场'],
      width: '130'
    },
    {
      label: '厂区是否直通海域',
      prop: 'directSea',
      filter: ['养殖场'],
      width: '130'
    },
    {
      label: '销售油品种类',
      prop: 'oilType',
      filter: ['加油站', '流动加油车辆'],
      width: '130'
    },
    {
      label: '工作人数',
      prop: 'workerNumber',
      filter: ['all'],
      width: '100'
    },
    {
      label: '手续是否齐全',
      prop: 'procedureComplete',
      filter: ['加油站', '流动加油车辆', '修造船厂'],
      width: '110'
    },
    {
      label: '经营性质',
      prop: 'operationNature',
      filter: ['加油站', '流动加油车辆'],
      width: '110'
    },
    {
      label: '加油车辆数',
      prop: 'oilVehicleNum',
      filter: ['加油站'],
      width: '110'
    },
    {
      label: '车牌号',
      prop: 'carNumber',
      filter: ['流动加油车辆'],
      width: '110'
    },
    {
      label: '驾驶员',
      prop: 'driver',
      filter: ['流动加油车辆'],
      width: '100'
    },
    {
      label: '所属企业',
      prop: 'enterprise',
      filter: ['流动加油车辆'],
      width: '110'
    },
    {
      label: '企业负责人电话',
      prop: 'enterpriseTel',
      filter: ['流动加油车辆'],
      width: '110'
    },
    {
      label: '业务范围',
      prop: 'businessScope',
      filter: ['修造船厂'],
      width: '100'
    },
    {
      label: '本地船舶数量',
      prop: 'localShipNum',
      filter: ['渔业协会'],
      width: '110'
    },
    {
      label: '外来船舶数量',
      prop: 'foreignShipNum',
      filter: ['渔业协会'],
      width: '110'
    },
    {
      label: '使用海域',
      prop: 'seaArea',
      filter: ['海洋牧场'],
      width: '100'
    },
    {
      label: '产品种类',
      prop: 'productType',
      filter: ['海洋牧场'],
      width: '100'
    },
    {
      label: '是否封闭式管理',
      prop: 'closedManagement',
      filter: ['游艇俱乐部'],
      width: '110'
    },
    {
      label: '船舶数量',
      prop: 'shipNum',
      filter: ['游艇俱乐部'],
      width: '100'
    },
    // {
    //   label: '概貌照片',
    //   prop: 'profilePhotos',
    //   filter: ['all']
    // },
    {
      label: '创建人',
      prop: 'createBy',
      filter: ['all'],
      width: '100'
    },
    {
      label: '创建时间',
      prop: 'createAt',
      filter: ['all'],
      width: '140'
    },
    {
      label: '更新人',
      prop: 'updateBy',
      filter: ['all'],
      width: '100'
    },
    {
      label: '更新时间',
      prop: 'updateAt',
      filter: ['all'],
      width: '140'
    }
  ],
  items: [
    {
      label: '涉海要素类型',
      prop: 'elementType',
      type: 'select',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '养殖场',
          value: '养殖场'
        },
        {
          label: '加油站',
          value: '加油站'
        },
        {
          label: '流动加油车辆',
          value: '流动加油车辆'
        },
        {
          label: '修造船厂',
          value: '修造船厂'
        },
        {
          label: '渔业协会',
          value: '渔业协会'
        },
        {
          label: '游艇俱乐部',
          value: '游艇俱乐部'
        },
        {
          label: '海洋牧场',
          value: '海洋牧场'
        }
      ]
    },
    {
      label: '涉海要素名称',
      prop: 'elementName',
      type: 'input'
    },
    {
      label: '所属派出所',
      prop: 'policeStation',
      type: 'select',
      options: [

      ]
    },
    {
      label: '',
      name: '查询',
      prop: 'query',
      style: 'primary-form',
      type: 'button'
    },
    {
      label: '',
      name: '新增',
      prop: 'insert',
      style: 'success-form',
      type: 'button'
    },
    {
      label: '',
      name: '导出',
      prop: 'export-data',
      style: 'primary-form',
      type: 'button'
    }
  ],
  operation: [
    {
      label: '涉海要素类型',
      prop: 'elementType',
      type: 'select',
      filter: ['all'],
      options: [
        // {
        //   label: '全部',
        //   value: ''
        // },
        {
          label: '养殖场',
          value: '养殖场'
        },
        {
          label: '加油站',
          value: '加油站'
        },
        {
          label: '流动加油车辆',
          value: '流动加油车辆'
        },
        {
          label: '修造船厂',
          value: '修造船厂'
        },
        {
          label: '渔业协会',
          value: '渔业协会'
        },
        {
          label: '游艇俱乐部',
          value: '游艇俱乐部'
        },
        {
          label: '海洋牧场',
          value: '海洋牧场'
        }
      ]
    },
    {
      label: '涉海要素名称',
      prop: 'elementName',
      type: 'input',
      filter: ['all']
    },
    {
      label: '所属派出所',
      prop: 'policeStation',
      type: 'select',
      filter: ['all'],
      options: [

      ]
    },
    {
      label: '负责人',
      prop: 'personLiable',
      type: 'input',
      filter: ['all']
    },
    {
      label: '电话',
      prop: 'tel',
      type: 'input',
      filter: ['all']
    },
    {
      label: '工厂地址',
      prop: 'plantAddress',
      type: 'input',
      filter: ['all']
    },
    {
      label: '经度',
      placeholder: '请精准的录入经度',
      prop: 'longitude',
      type: 'pickup',
      max: 180,
      filter: ['all']
    },
    {
      label: '纬度',
      placeholder: '请精准的录入纬度',
      prop: 'latitude',
      type: 'pickup',
      max: 90,
      filter: ['all']
    },
    // {
    //   label: '经度',
    //   prop: 'longitude',
    //   type: 'input',
    //   filter: ['all']
    // },
    // {
    //   label: '纬度',
    //   prop: 'latitude',
    //   type: 'input',
    //   filter: ['all']
    // },
    {
      label: '面积（平方）',
      prop: 'area',
      type: 'input',
      filter: ['养殖场', '加油站', '海洋牧场']
    },
    {
      label: '养殖加工产品名称',
      prop: 'productName',
      type: 'input',
      filter: ['养殖场']
    },
    {
      label: '招工人数区间',
      prop: 'recruitsNumber',
      type: 'input',
      filter: ['养殖场']
    },
    {
      label: '厂区是否直通海域',
      prop: 'directSea',
      type: 'select',
      filter: ['养殖场'],
      options: [
        {
          label: '是',
          value: '是'
        },
        {
          label: '否',
          value: '否'
        }
      ]
    },
    {
      label: '销售油品种类',
      prop: 'oilType',
      type: 'input',
      filter: ['加油站', '流动加油车辆']
    },
    {
      label: '工作人数',
      prop: 'workerNumber',
      type: 'input',
      filter: ['all']
    },
    {
      label: '手续是否齐全',
      prop: 'procedureComplete',
      type: 'select',
      filter: ['加油站', '流动加油车辆', '修造船厂'],
      options: [
        {
          label: '是',
          value: '是'
        },
        {
          label: '否',
          value: '否'
        }
      ]
    },
    {
      label: '经营性质',
      prop: 'operationNature',
      type: 'select',
      filter: ['加油站', '流动加油车辆'],
      options: [
        {
          label: '个人',
          value: '个人'
        },
        {
          label: '村集体',
          value: '村集体'
        }
      ]
    },
    {
      label: '加油车辆数',
      prop: 'oilVehicleNum',
      type: 'input',
      filter: ['加油站']
    },
    {
      label: '车牌号',
      prop: 'carNumber',
      type: 'input',
      filter: ['流动加油车辆']
    },
    {
      label: '驾驶员',
      prop: 'driver',
      type: 'input',
      filter: ['流动加油车辆']
    },
    {
      label: '所属企业',
      prop: 'enterprise',
      type: 'input',
      filter: ['流动加油车辆']
    },
    {
      label: '企业负责人电话',
      prop: 'enterpriseTel',
      type: 'input',
      filter: ['流动加油车辆']
    },
    {
      label: '业务范围',
      prop: 'businessScope',
      type: 'input',
      filter: ['修造船厂']
    },
    {
      label: '本地船舶数量',
      prop: 'localShipNum',
      type: 'input',
      filter: ['渔业协会']
    },
    {
      label: '外来船舶数量',
      prop: 'foreignShipNum',
      type: 'input',
      filter: ['渔业协会']
    },
    {
      label: '使用海域',
      prop: 'seaArea',
      type: 'input',
      filter: ['海洋牧场']
    },
    {
      label: '产品种类',
      prop: 'productType',
      type: 'input',
      filter: ['海洋牧场']
    },
    {
      label: '是否封闭式管理',
      prop: 'closedManagement',
      type: 'select',
      filter: ['游艇俱乐部'],
      options: [
        {
          label: '是',
          value: '是'
        },
        {
          label: '否',
          value: '否'
        }
      ]
    },
    {
      label: '船舶数量',
      prop: 'shipNum',
      type: 'input',
      filter: ['游艇俱乐部']
    },
    {
      label: '所属渔船',
      prop: 'boatIds',
      type: 'select',
      filter: ['all'],
      options: [

      ]
    },
    {
      label: '概貌照片',
      prop: 'profilePhotos',
      type: 'upload',
      filter: ['all']
    }
    // {
    //   label: '备注',
    //   prop: 'remark',
    //   type: 'textarea',
    //   filter: ['all']
    // }
  ],
  operationModel: {
    boatIds: null,
    elementType: null,
    elementName: null,
    policeStation: null,
    personLiable: null,
    tel: null,
    plantAddress: null,
    latitude: null,
    longitude: null,
    area: null,
    productName: null,
    recruitsNumber: null,
    directSea: null,
    oilType: null,
    workerNumber: null,
    procedureComplete: null,
    operationNature: null,
    oilVehicleNum: null,
    carNumber: null,
    driver: null,
    enterprise: null,
    enterpriseTel: null,
    businessScope: null,
    localShipNum: null,
    foreignShipNum: null,
    profilePhotos: null,
    seaArea: null,
    productType: null,
    closedManagement: null,
    shipNum: null,
    createBy: null,
    createAt: null,
    updateBy: null,
    updateAt: null
  },
  model: {
    elementType: null,
    elementName: null,
    policeStation: null,
    personLiable: null,
    tel: null,
    plantAddress: null,
    latitude: null,
    longitude: null,
    area: null,
    productName: null,
    recruitsNumber: null,
    directSea: null,
    oilType: null,
    workerNumber: null,
    procedureComplete: null,
    operationNature: null,
    oilVehicleNum: null,
    carNumber: null,
    driver: null,
    enterprise: null,
    enterpriseTel: null,
    businessScope: null,
    localShipNum: null,
    foreignShipNum: null,
    profilePhotos: null,
    seaArea: null,
    productType: null,
    closedManagement: null,
    shipNum: null,
    createBy: null,
    createAt: null,
    updateBy: null,
    updateAt: null,
    photoPath: null
  },
  allRules: {
    elementType: [
      { required: true, message: '涉海要素类型  未填写', trigger: 'change' }
    ],
    elementName: [
      { required: true, message: '涉海要素名称 未填写', trigger: 'blur' }
    ],
    policeStation: [
      { required: true, message: '所属派出所 未填写', trigger: 'change' }
    ],
    personLiable: [
      { required: true, message: '负责人 未填写', trigger: 'blur' }
    ],
    tel: [
      { required: true, message: '电话 未填写', trigger: 'blur' }
    ],
    plantAddress: [
      { required: true, message: '地址 未填写', trigger: 'blur' }
    ],
    longitude: [
      { required: true, message: '经度 未填写', trigger: 'blur' }
    ],
    latitude: [
      { required: true, message: '纬度 未填写', trigger: 'blur' }
    ],
    workerNumber: [
      { required: true, message: '工作人数 未填写', trigger: 'blur' }
    ],
    profilePhotos: [
      { required: true, message: '概貌照片 未上传', trigger: 'blur' }
    ]
  },
  completeRules: {
    elementType: [
      { required: true, message: '涉海要素类型  未填写', trigger: 'change' }
    ],
    elementName: [
      { required: true, message: '涉海要素名称 未填写', trigger: 'blur' }
    ],
    policeStation: [
      { required: true, message: '所属派出所 未填写', trigger: 'blur' }
    ],
    personLiable: [
      { required: true, message: '负责人 未填写', trigger: 'blur' }
    ],
    tel: [
      { required: true, message: '电话 未填写', trigger: 'blur' }
    ],
    plantAddress: [
      { required: true, message: '地址 未填写', trigger: 'blur' }
    ],
    longitude: [
      { required: true, message: '经度 未填写', trigger: 'blur' }
    ],
    latitude: [
      { required: true, message: '纬度 未填写', trigger: 'blur' }
    ],
    workerNumber: [
      { required: true, message: '工作人数 未填写', trigger: 'blur' }
    ],
    area: [
      { required: true, message: '面积 未填写', trigger: 'blur' }
    ],
    productName: [
      { required: true, message: '养殖加工产品名称 未填写', trigger: 'blur' }
    ],
    recruitsNumber: [
      { required: true, message: '招工人数区间 未填写', trigger: 'blur' }
    ],
    directSea: [
      { required: true, message: '厂区是否直通海域 未填写', trigger: 'blur' }
    ],
    oilType: [
      { required: true, message: '销售油品种类 未填写', trigger: 'blur' }
    ],
    procedureComplete: [
      { required: true, message: '手续是否齐全 未填写', trigger: 'blur' }
    ],
    businessScope: [
      { required: true, message: '业务范围 未填写', trigger: 'blur' }
    ],
    closedManagement: [
      { required: true, message: '是否封闭式管理 未填写', trigger: 'blur' }
    ],
    shipNum: [
      { required: true, message: '船舶数量 未填写', trigger: 'blur' }
    ],
    seaArea: [
      { required: true, message: '使用海域 未填写', trigger: 'blur' }
    ],
    productType: [
      { required: true, message: '产品种类 未填写', trigger: 'blur' }
    ],
    operationNature: [
      { required: true, message: '经营性质 未填写', trigger: 'change' }
    ],
    oilVehicleNum: [
      { required: true, message: '加油车辆 未填写', trigger: 'blur' }
    ],
    carNumber: [
      { required: true, message: '车牌号 未填写', trigger: 'blur' }
    ],
    driver: [
      { required: true, message: '驾驶员 未填写', trigger: 'blur' }
    ],
    enterprise: [
      { required: true, message: '所属企业 未填写', trigger: 'blur' }
    ],
    enterpriseTel: [
      { required: true, message: '企业负责人电话 未填写', trigger: 'blur' }
    ],
    localShipNum: [
      { required: true, message: '本地船舶数量 未填写', trigger: 'blur' }
    ],
    foreignShipNum: [
      { required: true, message: '外来船舶数量 未填写', trigger: 'blur' }
    ],
    profilePhotos: [
      { required: true, message: '概貌照片 未上传', trigger: 'blur' }
    ]
  },
  养殖场: {
    area: [
      { required: true, message: '面积 未填写', trigger: 'blur' }
    ],
    productName: [
      { required: true, message: '养殖加工产品名称 未填写', trigger: 'blur' }
    ],
    recruitsNumber: [
      { required: true, message: '招工人数区间 未填写', trigger: 'blur' }
    ],
    directSea: [
      { required: true, message: '厂区是否直通海域 未填写', trigger: 'blur' }
    ]
  },
  加油站: {
    area: [
      { required: true, message: '面积 未填写', trigger: 'blur' }
    ],
    oilType: [
      { required: true, message: '销售油品种类 未填写', trigger: 'blur' }
    ],
    procedureComplete: [
      { required: true, message: '手续是否齐全 未填写', trigger: 'blur' }
    ],
    operationNature: [
      { required: true, message: '经营性质 未填写', trigger: 'change' }
    ],
    oilVehicleNum: [
      { required: true, message: '加油车辆 未填写', trigger: 'blur' }
    ]
  },
  流动加油车辆: {
    oilType: [
      { required: true, message: '销售油品种类 未填写', trigger: 'blur' }
    ],
    procedureComplete: [
      { required: true, message: '手续是否齐全 未填写', trigger: 'blur' }
    ],
    operationNature: [
      { required: true, message: '经营性质 未填写', trigger: 'blur' }
    ],
    carNumber: [
      { required: true, message: '车牌号 未填写', trigger: 'blur' }
    ],
    driver: [
      { required: true, message: '驾驶员 未填写', trigger: 'blur' }
    ],
    enterprise: [
      { required: true, message: '所属企业 未填写', trigger: 'blur' }
    ],
    enterpriseTel: [
      { required: true, message: '企业负责人电话 未填写', trigger: 'blur' }
    ]
  },
  修造船厂: {
    procedureComplete: [
      { required: true, message: '手续是否齐全 未填写', trigger: 'blur' }
    ],
    businessScope: [
      { required: true, message: '业务范围 未填写', trigger: 'blur' }
    ]
  },
  渔业协会: {
    localShipNum: [
      { required: true, message: '本地船舶数量 未填写', trigger: 'blur' }
    ],
    foreignShipNum: [
      { required: true, message: '外来船舶数量 未填写', trigger: 'blur' }
    ]
  },
  游艇俱乐部: {
    closedManagement: [
      { required: true, message: '是否封闭式管理 未填写', trigger: 'blur' }
    ],
    shipNum: [
      { required: true, message: '船舶数量 未填写', trigger: 'blur' }
    ]
  },
  海洋牧场: {
    seaArea: [
      { required: true, message: '使用海域 未填写', trigger: 'blur' }
    ],
    productType: [
      { required: true, message: '产品种类 未填写', trigger: 'blur' }
    ]
  }
}

const interaction = {
  items: [
    {
      label: '问题类型',
      prop: 'type',
      type: 'input'
      // options: [
      //   {
      //     value: '样式问题',
      //     label: '样式问题'
      //   },
      //   {
      //     value: '数据问题',
      //     label: '数据问题'
      //   }
      // ]
    },
    {
      label: '问题描述',
      prop: 'description',
      type: 'input'
    },
    {
      label: '',
      name: '查询',
      prop: 'query',
      style: 'primary-form',
      type: 'button'
    }
  ],
  columns: [
    {
      label: '问题类型',
      prop: 'type',
      width: 200
    },
    {
      label: '问题描述',
      prop: 'description',
      width: 300
    },
    {
      label: '联系人',
      prop: 'linkMan',
      width: 300
    },
    {
      label: '联系方式',
      prop: 'linkPhone',
      width: 300
    },
    {
      label: '创建时间',
      prop: 'createAt',
      width: 300
    }
  ],
  operation: [
    {
      label: '问题类型',
      prop: 'type',
      type: 'input'
    },
    {
      label: '问题描述',
      prop: 'description',
      type: 'textarea'
    },
    {
      label: '联系人',
      prop: 'linkMan',
      type: 'input'
    },
    {
      label: '联系方式',
      prop: 'linkPhone',
      type: 'input'
    },
    {
      label: '问题照片',
      prop: 'picture',
      type: 'img'
    },
    {
      label: '创建时间',
      prop: 'createAt',
      type: 'input'
    }
  ],
  model: {
    createAt: '',
    createBy: '',
    departId: '',
    departName: '',
    description: '',
    linkMan: '',
    id: '',
    linkPhone: '',
    picture: '',
    type: '',
    updateAt: '',
    updateBy: ''
  }
}
const noteTaking = {
  items: [
    {
      label: '重要程度',
      prop: 'importantGrade',
      type: 'select',
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '一般',
          label: '一般'
        },
        {
          value: '重要',
          label: '重要'
        },
        {
          value: '紧急',
          label: '紧急'
        }
      ]
    },
    {
      label: '办理情况',
      prop: 'manageStatus',
      type: 'select',
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '录入渔船管控系统',
          label: '录入渔船管控系统'
        },
        {
          value: '无用的数据',
          label: '无用的数据'
        }
      ]
    },
    {
      label: '录入时间',
      prop: 'inputDate',
      type: 'dataTime'
    },
    {
      label: '标题',
      prop: 'title',
      type: 'input'
    },
    {
      label: '内容',
      prop: 'content',
      type: 'input'
    },
    {
      label: '',
      name: '查询',
      prop: 'query',
      style: 'primary-form',
      type: 'button'
    }
  ],
  operation: [
    {
      label: '标题',
      prop: 'title',
      type: 'input'
    },
    {
      label: '内容',
      prop: 'content',
      type: 'v-html'
    },
    {
      label: '自定义标签',
      prop: 'tags',
      type: 'tags'
    },
    {
      label: '办理情况',
      prop: 'manageStatus',
      type: 'input'
    },
    {
      label: '重要程度',
      prop: 'importantGrade',
      type: 'input'
    },
    {
      label: '创建人',
      prop: 'createBy',
      type: 'input'
    },
    {
      label: '创建时间',
      prop: 'createAt',
      type: 'input'
    },
    {
      label: '更新人',
      prop: 'updateBy',
      type: 'input'
    },
    {
      label: '更新时间',
      prop: 'updateAt',
      type: 'input'
    }
  ],
  model: {
    userId: '',
    tagIds: '',
    tags: '',
    title: '',
    content: '',
    createBy: '',
    createAt: '',
    updateBy: '',
    updateAt: '',
    manageStatus: '',
    importantGrade: '',
    inputDate: null
  }
}
export {
  seaElement,
  interaction,
  noteTaking
}
