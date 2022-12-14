const owner = {
  columns: [
    {
      label: '姓名',
      prop: 'name',
      width: 120
    },
    {
      label: '联系方式',
      prop: 'phone',
      width: 150
    },
    {
      label: '身份证号',
      prop: 'idCardNo',
      width: 150
    },
    {
      label: '单位名称',
      prop: 'departName',
      width: 120
    },
    {
      label: '户籍所在地',
      prop: 'residence',
      width: 150
    },
    {
      label: '现住址',
      prop: 'address',
      width: 150
    },
    {
      label: '是否随船出海',
      prop: 'isToseaEscape',
      width: 100
    }
  ],
  items: [
    {
      label: '姓名',
      prop: 'name',
      type: 'input',
      width: '50%'
    },
    {
      label: '联系方式',
      prop: 'phone',
      type: 'input',
      width: '50%'
    },
    {
      label: '文化程度',
      prop: 'education',
      type: 'input',
      width: '50%'
    },
    {
      label: '身份证号',
      prop: 'idCardNo',
      type: 'input',
      width: '50%'
    },
    {
      label: '民族',
      prop: 'nation',
      type: 'input',
      width: '50%'
    },
    {
      label: '单位名称',
      prop: 'departName',
      type: 'input',
      width: '50%'
    },
    {
      label: '户籍所在地',
      prop: 'residence',
      type: 'input',
      width: '50%'
    },
    {
      label: '现住址',
      prop: 'address',
      type: 'input',
      width: '50%'
    },
    {
      label: '是否随船出海',
      prop: 'isTosea',
      type: 'select',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      width: '50%'
    },
    {
      label: '紧急联系人',
      prop: 'urgentMan',
      type: 'input',
      width: '50%'
    },
    {
      label: '紧急联系电话',
      prop: 'urgentPhone',
      type: 'input',
      width: '50%'
    },
    {
      label: '备注',
      prop: 'remarks',
      rows: 3,
      type: 'textarea',
      width: '100%'
    },
    {
      label: '身份证照片',
      prop: 'idCardPic',
      type: 'image',
      width: '100%'
    }
  ],
  model: {
    address: null,
    departName: null,
    education: null,
    idCardNo: null,
    idCardPic: null,
    isTosea: null,
    name: null,
    nation: null,
    phone: null,
    remarks: null,
    residence: null,
    urgentMan: null,
    urgentPhone: null
  }
}

const people = {
  columns: [
    {
      label: '姓名',
      prop: 'name',
      width: 120
    },
    {
      label: '联系方式',
      prop: 'phone',
      width: 140
    },
    {
      label: '身份证号',
      prop: 'idCardNo',
      width: 140
    },
    {
      label: '是否嫌疑人员',
      prop: 'suspicion',
      width: 100
    },
    {
      label: '是否重点人员',
      prop: 'main',
      width: 100
    },
    {
      label: '重点人员类型',
      prop: 'mainType',
      width: 100
    },
    {
      label: '服务渔船名称',
      prop: 'boatName',
      width: 120
    },
    {
      label: '船上职务',
      prop: 'boatDutyName',
      width: 80
    },
    {
      label: '船主姓名',
      prop: 'boatOwnerName',
      width: 100
    },
    {
      label: '单位名称',
      prop: 'departName',
      width: 100
    },
    {
      label: '现住址',
      prop: 'residence',
      width: 160
    }
  ],
  files: [
    {
      label: '身份证照片',
      prop: 'idCardPic'
    },
    {
      label: '照片',
      prop: 'photo'
    }
  ],
  items: [
    {
      label: '姓名',
      prop: 'name',
      type: 'input',
      width: '50%'
    },
    {
      label: '性别',
      prop: 'sex',
      type: 'input',
      width: '50%'
    },
    {
      label: '联系方式',
      prop: 'phone',
      type: 'input',
      width: '50%'
    },
    {
      label: '文化程度',
      prop: 'education',
      type: 'input',
      width: '50%'
    },
    {
      label: '身份证号',
      prop: 'idCardNo',
      type: 'input',
      width: '50%'
    },
    {
      label: '民族',
      prop: 'nation',
      type: 'input',
      width: '50%'
    },
    {
      label: '户籍所在地',
      prop: 'residence',
      type: 'input',
      width: '50%'
    },
    {
      label: '现住址',
      prop: 'address',
      type: 'input',
      width: '50%'
    },
    {
      label: '劳务公司名称',
      prop: 'laborCompany',
      type: 'input',
      width: '50%'
    },
    {
      label: '服务渔船名称',
      prop: 'boatName',
      type: 'input',
      width: '50%'
    },
    {
      label: '船上职务',
      prop: 'boatDutyName',
      type: 'input',
      width: '50%'
    },
    {
      label: '船主姓名',
      prop: 'boatOwnerName',
      type: 'input',
      width: '50%'
    },
    {
      label: '单位名称',
      prop: 'departName',
      type: 'input',
      width: '50%'
    },
    {
      label: '是否布控人员',
      prop: 'isControl',
      type: 'select',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      width: '50%'
    },
    {
      label: '是否嫌疑人员',
      prop: 'isSuspicion',
      type: 'select',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      width: '50%'
    },
    {
      label: '是否重点人员',
      prop: 'isMain',
      type: 'select',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      width: '50%'
    },
    {
      label: '重点人员类型',
      prop: 'mainType',
      type: 'select',
      options: [
        {
          label: '涉恐人员',
          value: '涉恐人员'
        },
        {
          label: '涉稳人员',
          value: '涉稳人员'
        },
        {
          label: '涉毒人员',
          value: '涉毒人员'
        },
        {
          label: '刑事犯罪前科人员',
          value: '刑事犯罪前科人员'
        },
        {
          label: '肇事肇祸精神病人',
          value: '肇事肇祸精神病人'
        },
        {
          label: '重点上访人员',
          value: '重点上访人员'
        },
        {
          label: '全国在逃人员',
          value: '全国在逃人员'
        }
      ],
      width: '50%'
    },
    {
      label: '走访情况',
      prop: 'remarks',
      rows: 3,
      type: 'textarea',
      width: '100%'
    },
    {
      label: '紧急联系人',
      prop: 'urgentMan',
      type: 'input',
      width: '50%'
    },
    {
      label: '紧急联系电话',
      prop: 'urgentPhone',
      type: 'input',
      width: '50%'
    }
    // {
    //   label: '身份证照片',
    //   prop: 'idCardPic',
    //   type: 'image',
    //   width: '100%'
    // },
    // {
    //   label: '照片',
    //   prop: 'photo',
    //   type: 'image',
    //   width: '100%'
    // }
  ],
  model: {
    address: null,
    boatDutyName: null,
    boatName: null,
    boatOwnerName: null,
    departName: null,
    education: null,
    idCardNo: null,
    idCardPic: null,
    isControl: null,
    isMain: null,
    isSuspicion: null,
    laborCompany: null,
    name: null,
    nation: null,
    phone: null,
    photo: null,
    remarks: null,
    residence: null,
    sex: null,
    urgentMan: null,
    urgentPhone: null
  }
}

const trawler = {
  items: [
    {
      label: '船名号',
      prop: 'name',
      type: 'input',
      width: '50%'
    },
    {
      label: '船籍港',
      prop: 'homePortName',
      type: 'input',
      width: '50%'
    },
    {
      label: '管理单位',
      prop: 'departName',
      type: 'input',
      width: '50%'
    },
    {
      label: '行政区域',
      prop: 'region',
      type: 'input',
      width: '50%'
    },
    {
      label: '船主姓名',
      prop: 'ownerName',
      type: 'input',
      width: '50%'
    },
    {
      label: '联系方式',
      prop: 'ownerPhone',
      type: 'input',
      width: '50%'
    },
    {
      label: '船舶类型',
      prop: 'typeName',
      type: 'input',
      width: '50%'
    },
    {
      label: '作业类型',
      prop: 'jobRegionName',
      type: 'input',
      width: '50%'
    }
  ],
  model: {
    departName: null,
    homePortName: null,
    jobRegionName: null,
    name: null,
    ownerName: null,
    ownerPhone: null,
    region: null,
    typeName: null
  }
}

export {
  owner,
  people,
  trawler
}
