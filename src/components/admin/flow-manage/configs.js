const report = {
  columns: [
    {
      label: '船名号',
      prop: 'boatName',
      width: 130
    },
    {
      label: '船主姓名',
      prop: 'ownerName',
      width: 80
    },
    {
      label: '单位名称',
      prop: 'departName'
    },
    {
      label: '出发港',
      prop: 'departureName'
    },
    {
      label: '目的地',
      prop: 'destinationName',
      width: 100
    },
    {
      label: '进出港状态',
      prop: 'type',
      width: 90
    },
    {
      label: '出发时间',
      prop: 'departureDate',
      width: 120
    },
    {
      label: '出入港事由',
      prop: 'reason'
    }
  ],
  items: [
    {
      label: '船名号',
      prop: 'boatName',
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
      label: '单位名称',
      prop: 'departName',
      type: 'input',
      width: '50%'
    },
    {
      label: '出发港',
      prop: 'departureName',
      type: 'input',
      width: '50%'
    },
    {
      label: '目的地',
      prop: 'destinationName',
      type: 'input',
      width: '50%'
    },
    {
      label: '船上人员',
      prop: '',
      type: 'input',
      width: '50%'
    },
    {
      label: '进出港状态',
      prop: 'type',
      type: 'input',
      width: '50%'
    },
    {
      label: '出发时间',
      prop: 'departureDate',
      type: 'datetime',
      width: '50%'
    },
    {
      label: '出入港事由',
      prop: 'reason',
      type: 'input',
      width: '50%'
    },
    {
      label: '录入民警姓名',
      prop: '',
      type: 'input',
      width: '50%'
    },
    {
      label: '备注',
      prop: 'remarks',
      rows: 4,
      type: 'textarea',
      width: '100%'
    }
  ],
  model: {
    boatName: null,
    ownerName: null,
    departName: null,
    departureDate: null,
    departureName: null,
    destinationName: null,
    reason: null,
    remarks: null,
    type: null
  }
}

export {
  report
}
