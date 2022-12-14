const menus = [
  {
    icon: 'el-icon-bangzhu',
    label: '渔港管理',
    name: 'port-manage',
    children: [
      {
        label: '渔港档案',
        name: 'port-archives',
        path: '/admin/port-archives'
      },
      {
        label: '渔港划线',
        name: 'port-scribe',
        path: '/admin/port-scribe'
      }
    ]
  },
  {
    icon: 'el-icon-bangzhu',
    label: '渔船管理',
    name: 'trawler-manage',
    children: [
      {
        label: '渔船档案',
        name: 'trawler-archives',
        path: '/admin/trawler-archives'
      },
      {
        label: '船舶收藏',
        name: 'trawler-collection',
        path: '/admin/trawler-collection'
      },
      {
        label: '重点关注渔船',
        name: 'trawler-focus',
        path: '/admin/trawler-focus'
      },
      {
        label: '渔船作业类型分析',
        name: 'task-type',
        path: '/admin/task-type'
      }
    ]
  },
  {
    icon: 'el-icon-bangzhu',
    label: '人员管理',
    name: 'crew-manage',
    children: [
      {
        label: '报备用户管理',
        name: 'owner-manage',
        path: '/admin/owner-manage'
      },
      {
        label: '渔船民管理',
        name: 'people-manage',
        path: '/admin/people-manage'
      }
    ]
  },
  {
    icon: 'el-icon-bangzhu',
    label: '船舶布控',
    name: 'trawler-monitoring',
    children: [
      {
        label: '重点区域', // 时空分析
        name: 'area-analysis',
        path: '/admin/area-analysis'
      },
      {
        label: '轨迹回放',
        name: 'track-review',
        path: '/admin/track-review'
      },
      {
        label: '渔船动态明细',
        name: 'trawler-dynamic',
        path: '/admin/trawler-dynamic'
      }
    ]
  },
  {
    icon: 'el-icon-bangzhu',
    label: '电子围栏管理',
    name: 'electronic-fence',
    children: [
      {
        label: '封闭式电子围栏',
        name: 'closed-fence',
        path: '/admin/closed-fence'
      }
    ]
  },
  {
    icon: 'el-icon-bangzhu',
    label: '智能分析',
    name: 'intelligent-analysis',
    children: [
      {
        label: '报警记录',
        name: 'analysis-manage',
        path: '/admin/analysis-manage'
      },
      {
        label: '预警统计',
        name: 'early-warning',
        path: '/admin/early-warning'
      }
    ]
  },
  {
    icon: 'el-icon-bangzhu',
    label: '电子海图',
    name: 'sea-map',
    children: [
      {
        label: '海图标注',
        name: 'sea-map-mark',
        path: '/admin/sea-map-mark'
      }
    ]
  },
  {
    icon: 'el-icon-bangzhu',
    label: '信息管理',
    name: 'information-manage',
    children: [
      {
        label: '涉海要素管理',
        name: 'marine-elements',
        path: '/admin/marine-elements'
      },
      {
        label: '互动交流管理',
        name: 'interaction',
        path: '/admin/interaction'
      },
      {
        label: '随手记管理',
        name: 'note-taking-manage',
        path: '/admin/note-taking-manage'
      }
    ]
  },
  // {
  //   icon: 'el-icon-bangzhu',
  //   label: '数据运维仪表盘',
  //   name: 'data-dashboard',
  //   children: [
  //     {
  //       label: '北斗设备掉线原因统计',
  //       name: 'equipment-disconnection',
  //       path: '/admin/equipment-disconnection'
  //     },
  //     {
  //       label: '日志信息统计',
  //       name: 'log-statistics',
  //       path: '/admin/log-statistics'
  //     },
  //     {
  //       label: '数据增长情况统计',
  //       name: 'data-growth',
  //       path: '/admin/data-growth'
  //     }
  //   ]
  // },
  // 不需要
  // {
  //   icon: 'el-icon-bangzhu',
  //   label: '进出港管理',
  //   name: 'flow-manage',
  //   children: [
  //     {
  //       label: '报备信息',
  //       name: 'report-manage',
  //       path: '/admin/report-manage'
  //     }
  //   ]
  // },
  {
    icon: 'el-icon-bangzhu',
    label: '视频监控管理',
    name: 'monitor-manage',
    children: [
      {
        label: '视频监控管理',
        name: 'video-manage',
        path: '/admin/video-manage'
      },
      {
        label: '视频方案配置',
        name: 'video-scheme',
        path: '/admin/video-scheme'
      }
      // {
      //   label: '点位抓拍',
      //   name: 'snap-manage',
      //   path: '/admin/snap-manage'
      // }
    ]
  },
  {
    icon: 'el-icon-bangzhu',
    label: '系统管理',
    name: 'system-manage',
    children: [
      {
        label: '单位分类',
        name: 'organization-manage',
        path: '/admin/organization-manage'
      },
      {
        label: '账号管理',
        name: 'account-manage',
        path: '/admin/account-manage'
      },
      {
        label: '角色管理',
        name: 'role-manage',
        path: '/admin/role-manage'
      },
      {
        label: '菜单管理',
        name: 'menu-manage',
        path: '/admin/menu-manage'
      },
      {
        label: '字典管理',
        name: 'dicts-manage',
        path: '/admin/dictionary-manage'
      },
      {
        label: '日志管理',
        name: 'log-manage',
        path: '/admin/log-manage'
      },
      {
        label: '定时任务',
        name: 'timing-tasks',
        path: '/admin/timing-tasks'
      }
    ]
  }
]

export default menus
