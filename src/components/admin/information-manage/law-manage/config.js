const items = {
  administration: [
    {
      label: '案件名称',
      prop: 'name',
      type: 'input'
    },
    {
      label: '查获日期',
      prop: 'getTime',
      type: 'date'
    },
    {
      label: '办案单位',
      prop: 'dealUnit',
      type: 'input'
    },
    {
      label: '处罚人数',
      prop: 'dealedNum',
      type: 'input'
    },
    {
      label: '处罚情况',
      prop: 'dealInfo',
      rows: 4,
      type: 'textarea'
    },
    {
      label: '处结日期',
      prop: 'dealTime',
      type: 'date'
    }
  ],
  criminal: [
    {
      label: '案件名称',
      prop: 'name',
      type: 'input'
    },
    {
      label: '查获日期',
      prop: 'getTime',
      type: 'date'
    },
    {
      label: '办案单位',
      prop: 'dealUnit',
      type: 'input'
    },
    {
      label: '打击处理人数',
      prop: 'dealedNum',
      type: 'input'
    },
    {
      label: '打击处理情况',
      prop: 'dealInfo',
      rows: 4,
      type: 'textarea'
    },
    {
      label: '涉案价值',
      prop: 'involved',
      type: 'input'
    },
    {
      label: '处结日期',
      prop: 'dealTime',
      type: 'date'
    }
  ]
}

const model = {
  administration: {
    dealInfo: null, // 处罚情况
    dealedNum: null, // 处罚人数
    dealTime: null, // 处结日期
    dealUnit: null, // 办案单位
    getTime: null, // 查获日期
    name: null // 案件名称
  },
  criminal: {
    dealInfo: null, // 打击处理情况
    dealedNum: null, // 打击处理人数
    dealTime: null, // 处结日期
    dealUnit: null, // 办案单位
    getTime: null, // 查获日期
    name: null // 案件名称
  }
}

const rules = {
  administration: {
    dealInfo: [
      { required: true, message: '处罚情况 未填写', trigger: 'blur' }
    ],
    dealedNum: [
      { required: true, message: '处罚人数 未填写', trigger: 'blur' }
    ],
    dealTime: [
      { required: true, message: '处结日期 未选择', trigger: 'change' }
    ],
    dealUnit: [
      { required: true, message: '办案单位 未填写', trigger: 'blur' }
    ],
    getTime: [
      { required: true, message: '查获日期 未选择', trigger: 'change' }
    ],
    name: [
      { required: true, message: '案件名称 未填写', trigger: 'blur' }
    ]
  },
  criminal: {
    dealInfo: [
      { required: true, message: '打击处理情况 未填写', trigger: 'blur' }
    ],
    dealedNum: [
      { required: true, message: '打击处理人数 未填写', trigger: 'blur' }
    ],
    dealTime: [
      { required: true, message: '处结日期 未选择', trigger: 'change' }
    ],
    dealUnit: [
      { required: true, message: '办案单位 未填写', trigger: 'blur' }
    ],
    getTime: [
      { required: true, message: '查获日期 未选择', trigger: 'change' }
    ],
    involved: [
      { required: true, message: '涉案价值 未填写', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '案件名称 未填写', trigger: 'blur' }
    ]
  }
}

export {
  items,
  model,
  rules
}
