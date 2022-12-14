const dicts = JSON.parse(localStorage.getItem('dicts'))
const account = {
  columns: [
    {
      label: '用户名',
      prop: 'username'
    },
    {
      label: '姓名',
      prop: 'displayName'
    },
    {
      label: '联系方式',
      prop: 'phone'
    },
    {
      label: '组织名称',
      prop: 'departName'
    },
    {
      label: '邮箱',
      prop: 'email'
    }
  ],
  items: [
    {
      label: '用户名',
      prop: 'username',
      readonly: true,
      type: 'input',
      width: '50%'
    },
    {
      label: '密码',
      prop: 'password',
      readonly: true,
      type: 'password',
      width: '50%'
    },
    {
      label: '真实姓名',
      prop: 'displayName',
      readonly: true,
      type: 'input',
      width: '50%'
    },
    {
      label: '联系方式',
      prop: 'phone',
      readonly: true,
      type: 'input',
      width: '50%'
    },
    {
      label: '邮箱',
      prop: 'email',
      readonly: true,
      type: 'input',
      width: '50%'
    },
    {
      label: '组织名称',
      prop: 'departName',
      readonly: true,
      type: 'autocomplete',
      options: [
      ],
      width: '50%'
    },
    {
      label: '角色',
      multiple: true,
      prop: 'roleIds',
      readonly: false,
      type: 'select',
      options: [
      ],
      width: '100%'
    },
    {
      label: '数据范围',
      prop: 'dataScope',
      readonly: false,
      type: 'select',
      options: dicts.data_scope.slice(),
      width: '100%'
    }
    // {
    //   label: '数据权限',
    //   multiple: true,
    //   prop: 'orgIds',
    //   type: 'select',
    //   options: [
    //   ]
    // }
  ],
  model: {
    departName: null,
    dataScope: null,
    displayName: null,
    email: null,
    orgIds: null,
    password: null,
    phone: null,
    roleIds: [],
    username: null
  },
  rules: {
    departName: [
      { required: true, message: '组织名称 未填写', trigger: 'change' }
    ],
    dataScope: [
      { required: true, message: '数据范围 未选择', trigger: 'change' }
    ],
    displayName: [
      { required: true, message: '真实姓名 未填写', trigger: 'blur' }
    ],
    email: [
      { required: false, message: '邮箱 未填写', trigger: 'blur' }
    ],
    orgIds: [
      { required: true, message: '数据权限 未选择', trigger: 'change' }
    ],
    password: [
      { required: true, message: '密码 未填写', trigger: 'blur' }
    ],
    phone: [
      { required: false, message: '联系方式 未填写', trigger: 'blur' }
    ],
    roleIds: [
      { required: true, message: '账号角色 未选择', trigger: 'change' }
    ],
    username: [
      { required: true, message: '用户名 未填写', trigger: 'blur' }
    ]
  }
}

const dictionary = {
  columns: [
    {
      label: '字典名称',
      prop: 'name'
    },
    {
      label: '字典值',
      prop: 'value'
    },
    {
      label: '备注',
      prop: 'remark'
    }
  ],
  items: [
    {
      label: '父节点',
      prop: 'parentId',
      type: 'select',
      options: [
      ]
    },
    {
      label: '字典名称',
      prop: 'dictName',
      type: 'input'
    },
    {
      label: '字典值',
      prop: 'dictValue',
      type: 'input'
    },
    {
      label: '排序',
      prop: 'sort',
      type: 'number'
    },
    {
      label: '备注',
      prop: 'remark',
      type: 'input'
    }
  ],
  model: {
    dictName: null,
    dictValue: null,
    parentId: null,
    remark: null,
    sort: 1
  },
  rules: {
    dictName: [
      { required: true, message: '字典名称 未填写', trigger: 'blur' }
    ],
    dictValue: [
      { required: true, message: '字典值 未填写', trigger: 'blur' }
    ],
    parentId: [
      { required: true, message: '父节点 未选择', trigger: 'change' }
    ],
    remark: [
      { required: false, message: '备注 未填写', trigger: 'blur' }
    ],
    sort: [
      { required: false, message: '排序 未填写', trigger: 'blur' }
    ]
  }
}

const log = {
  columns: [
    {
      label: '模块名称',
      prop: 'moduleName',
      width: 140
    },
    {
      label: '操作人',
      prop: 'operateMan',
      width: 120
    },
    {
      label: '操作',
      prop: 'operation',
      width: 210
    },
    {
      label: '接口地址',
      prop: 'url',
      width: 430
    },
    {
      label: 'ip地址',
      prop: 'ipAddress',
      width: 120
    },
    {
      label: '真实地址',
      prop: 'realAddress',
      width: 180
    },
    {
      label: '操作时间',
      prop: 'operateTime',
      width: 150
    }
  ],
  items: [
    {
      label: '模块名称',
      prop: 'moduleName',
      type: 'input'
    },
    {
      label: '操作人',
      prop: 'operateMan',
      type: 'input'
    },
    {
      label: '操作',
      prop: 'operation',
      type: 'input'
    },
    {
      label: '接口地址',
      prop: 'url',
      type: 'input'
    },
    {
      label: 'ip地址',
      prop: 'ipAddress',
      type: 'input'
    },
    {
      label: '真实地址',
      prop: 'realAddress',
      type: 'input'
    },
    {
      label: '操作时间',
      prop: 'operateTime',
      type: 'datetime'
    },
    {
      label: '传参',
      prop: 'param',
      rows: 4,
      type: 'textarea'
    },
    {
      label: '返回值',
      prop: 'result',
      rows: 10,
      type: 'textarea'
    }
  ],
  model: {
    ipAddress: null,
    moduleName: null,
    operateMan: null,
    operateTime: null,
    operation: null,
    param: null,
    realAddress: null,
    result: null,
    url: null
  }
}

const menu = {
  columns: [
    {
      label: '排序',
      prop: 'index'
    },
    {
      label: '名称',
      prop: 'name'
    },
    {
      label: '编码',
      prop: 'code',
      width: 250
    },
    {
      label: '类型',
      prop: 'category',
      width: 80
    },
    {
      label: '图标',
      prop: 'icon'
    },
    {
      label: '路由',
      prop: 'route',
      width: 250
    }
  ],
  items: [
    {
      label: '菜单名称',
      prop: 'powerName',
      type: 'input'
    },
    {
      label: '菜单编码',
      prop: 'powerCode',
      type: 'input'
    },
    {
      label: '父节点',
      prop: 'parentId',
      type: 'cascader',
      options: [
        {
          label: '根节点',
          value: '0'
        }
      ]
    },
    {
      label: '菜单类型',
      prop: 'powerType',
      type: 'select',
      options: [
        {
          label: '模块',
          value: '1'
        },
        {
          label: '页面',
          value: '2'
        },
        {
          label: '操作',
          value: '3'
        }
      ]
    },
    {
      label: '组件路径',
      prop: 'compUrl',
      type: 'input'
    },
    {
      label: '菜单路由',
      prop: 'powerUrl',
      type: 'input'
    },
    {
      label: '菜单图标',
      prop: 'powerIcon',
      type: 'input'
    },
    {
      label: '排序',
      prop: 'sort',
      type: 'input'
    },
    {
      label: '备注',
      prop: 'remark',
      type: 'input'
    }
  ],
  model: {
    compUrl: '', // 组件路径
    parentId: '', // 父节点
    powerCode: '', // 菜单编码
    powerIcon: '', // 菜单图标
    powerName: '', // 菜单名称
    powerType: '', // 菜单类型
    powerUrl: '', // 菜单路由
    remark: '', // 备注
    sort: '' // 排序
  },
  rules: {
    compUrl: [
      { required: false, message: '组件路径 未填写', trigger: 'blur' }
    ], // 组件路径
    parentId: [
      { required: true, message: '父节点 未填写', trigger: 'blur' }
    ], // 父节点
    powerCode: [
      { required: true, message: '菜单编码 未填写', trigger: 'blur' }
    ], // 菜单编码
    powerIcon: [
      { required: false, message: '菜单图标 未填写', trigger: 'blur' }
    ], // 菜单图标
    powerName: [
      { required: true, message: '菜单名称 未填写', trigger: 'blur' }
    ], // 菜单名称
    powerType: [
      { required: true, message: '菜单类型 未填写', trigger: 'blur' }
    ], // 菜单类型
    powerUrl: [
      { required: false, message: '菜单路由 未填写', trigger: 'blur' }
    ], // 菜单路由
    remark: [
      { required: false, message: '备注 未填写', trigger: 'blur' }
    ], // 备注
    sort: [
      { required: false, message: '排序 未填写', trigger: 'blur' }
    ] // 排序
  }
}

const organization = {
  columns: [
    {
      label: '单位名称',
      prop: 'name'
    },
    {
      label: '昵称',
      prop: 'label'
    },
    {
      label: '类型',
      prop: 'type'
    },
    {
      label: '权重',
      prop: 'weight'
    }
  ]
}

const role = {
  columns: [
    {
      label: '角色名',
      prop: 'roleName',
      width: 170
    },
    {
      label: '角色编码',
      prop: 'roleCode',
      width: 170
    },
    {
      label: '备注',
      prop: 'remark'
    }
  ],
  items: [
    {
      label: '角色名称',
      prop: 'roleName',
      type: 'input'
    },
    {
      label: '角色编码',
      prop: 'roleCode',
      type: 'input'
    },
    {
      label: '角色权限',
      prop: 'powers',
      type: 'cascader',
      options: [],
      props: {
        checkStrictly: true,
        children: 'children',
        emitPath: false,
        label: 'label',
        multiple: true,
        value: 'value'
      }
    },
    {
      label: '备注',
      prop: 'remark',
      type: 'textarea'
    }
  ],
  model: {
    powers: [],
    remark: null,
    roleCode: null,
    roleName: null
  },
  rules: {
    powers: [
      { required: true, message: '角色权限 未选择', trigger: 'change' }
    ],
    remark: [
      { required: false, message: '备注 未填写', trigger: 'blur' }
    ],
    roleCode: [
      { required: true, message: '角色编码 未填写', trigger: 'blur' }
    ],
    roleName: [
      { required: true, message: '角色名称 未填写', trigger: 'blur' }
    ]
  }
}

const tasks = {
  columns: [
    {
      label: '任务名称',
      prop: 'jobName'
    },
    {
      label: '任务组名',
      prop: 'group'
    },
    {
      label: '任务状态',
      prop: 'state'
    },
    {
      label: '计划策略',
      prop: 'strategy'
    }
  ],
  items: [
    {
      label: '任务名称',
      prop: 'jobName',
      type: 'input'
    },
    {
      label: '任务组名',
      prop: 'jobGroup',
      type: 'select',
      options: [
        {
          label: '系统',
          value: 'SYSTEM'
        },
        {
          label: '默认',
          value: 'DEFAULT'
        }
      ]
    },
    {
      label: '调用目标字符串',
      prop: 'invokeTarget',
      type: 'input'
    },
    {
      label: '执行表达式',
      prop: 'cronExpression',
      type: 'input'
    },
    {
      label: '计划策略',
      prop: 'misfirePolicy',
      type: 'radio',
      options: [
        {
          label: '默认',
          value: '0'
        },
        {
          label: '立即触发执行',
          value: '1'
        },
        {
          label: '触发一次执行',
          value: '2'
        },
        {
          label: '不触发立即执行',
          value: '3'
        }
      ]
    },
    {
      label: '并发执行',
      prop: 'concurrent',
      type: 'radio',
      options: [
        {
          label: '允许',
          value: '0'
        },
        {
          label: '禁止',
          value: '1'
        }
      ]
    },
    {
      label: '状态',
      prop: 'status',
      type: 'radio',
      options: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '暂停',
          value: '1'
        }
      ]
    },
    {
      label: '备注',
      prop: 'remark',
      rows: 4,
      type: 'textarea'
    }
  ],
  model: {
    concurrent: '1',
    cronExpression: null,
    invokeTarget: null,
    jobGroup: 'DEFAULT',
    jobName: null,
    misfirePolicy: '3',
    remark: null,
    status: '1'
  },
  rules: {
    concurrent: [
      { required: false, message: '并发执行 未选择', trigger: 'change' }
    ],
    cronExpression: [
      { required: true, message: '执行表达式 未填写', trigger: 'blur' }
    ],
    invokeTarget: [
      { required: true, message: '调用目标字符串 未填写', trigger: 'blur' }
    ],
    jobGroup: [
      { required: false, message: '任务组名 未选择', trigger: 'change' }
    ],
    jobName: [
      { required: true, message: '任务名称 未填写', trigger: 'blur' }
    ],
    misfirePolicy: [
      { required: false, message: '计划策略 未选择', trigger: 'change' }
    ],
    remark: [
      { required: false, message: '备注 未填写', trigger: 'blur' }
    ],
    status: [
      { required: false, message: '状态 未选择', trigger: 'change' }
    ]
  }
}

export {
  account,
  dictionary,
  log,
  menu,
  organization,
  role,
  tasks
}
