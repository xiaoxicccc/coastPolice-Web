import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  // 登录页
  {
    path: '/login',
    name: 'app-login',
    component: () => import('@/components/admin/login/index'),
    meta: {
      auth: false,
      title: '登录'
    }
  },
  // 业务系统
  // {
  //   path: '/admin',
  //   name: 'container',
  //   component: () => import('@/components/admin/container'),
  //   meta: {
  //     auth: true
  //   },
  //   children: [
  //     // 渔港管理
  //     {
  //       path: 'port-archives',
  //       name: 'port-archives',
  //       component: () => import('@/components/admin/port-manage/archives/index'),
  //       meta: {
  //         auth: true,
  //         title: '渔港档案'
  //       }
  //     },
  //     {
  //       path: 'port-scribe',
  //       name: 'port-scribe',
  //       component: () => import('@/components/admin/port-manage/scribe/index'),
  //       meta: {
  //         auth: true,
  //         title: '渔港划线'
  //       }
  //     },
  //     // 渔船管理
  //     {
  //       path: 'trawler-archives',
  //       name: 'trawler-archives',
  //       component: () => import('@/components/admin/trawler-manage/archives/index'),
  //       meta: {
  //         auth: true,
  //         title: '渔船档案'
  //       }
  //     },
  //     {
  //       path: 'trawler-collection',
  //       name: 'trawler-collection',
  //       component: () => import('@/components/admin/trawler-manage/collection/index'),
  //       meta: {
  //         auth: true,
  //         name: 'collection',
  //         title: '船舶收藏'
  //       }
  //     },
  //     {
  //       path: 'trawler-focus',
  //       name: 'trawler-focus',
  //       component: () => import('@/components/admin/trawler-manage/collection/index'),
  //       meta: {
  //         auth: true,
  //         name: 'focus',
  //         title: '重点关注渔船'
  //       }
  //     },
  //     // 渔船作业类型分析
  //     {
  //       path: 'task-type',
  //       name: 'task-type',
  //       component: () => import('@/components/admin/trawler-manage/task-type/index'),
  //       meta: {
  //         auth: true,
  //         title: '渔船作业类型分析'
  //       }
  //     },
  //     // 人员管理
  //     // 船主管理
  //     {
  //       path: 'owner-manage',
  //       name: 'owner-manage',
  //       component: () => import('@/components/admin/crew-manage/owner/index'),
  //       meta: {
  //         auth: true,
  //         title: '报备用户管理'
  //       }
  //     },
  //     // 船民管理
  //     {
  //       path: 'people-manage',
  //       name: 'people-manage',
  //       component: () => import('@/components/admin/crew-manage/people/index'),
  //       meta: {
  //         auth: true,
  //         title: '渔船民管理'
  //       }
  //     },
  //     // 船舶布控
  //     {
  //       path: 'area-analysis',
  //       name: 'area-analysis',
  //       component: () => import('@/components/admin/trawler-dynamic/analysis/index'),
  //       meta: {
  //         auth: true,
  //         title: '重点区域'
  //       }
  //     },
  //     {
  //       path: 'track-review',
  //       name: 'track-review',
  //       component: () => import('@/components/admin/trawler-dynamic/track-review'),
  //       meta: {
  //         auth: true,
  //         title: '轨迹回放'
  //       }
  //     },
  //     {
  //       path: 'trawler-dynamic',
  //       name: 'trawler-dynamic',
  //       component: () => import('@/components/admin/trawler-dynamic/dynamic/index'),
  //       meta: {
  //         auth: true,
  //         title: '渔船动态明细'
  //       }
  //     },
  //     // 电子围栏管理
  //     // 封闭式电子围栏
  //     {
  //       path: 'closed-fence',
  //       name: 'closed-fence',
  //       component: () => import('@/components/admin/electronic-fence/closed-fence/index'),
  //       meta: {
  //         auth: true,
  //         title: '封闭式电子围栏'
  //       }
  //     },
  //     // 智能分析-列表
  //     {
  //       path: 'analysis-manage',
  //       name: 'analysis-manage',
  //       component: () => import('@/components/admin/intelligent-analysis/analysis/index'),
  //       meta: {
  //         auth: true,
  //         title: '报警记录'
  //       }
  //     },
  //     // 预警统计
  //     {
  //       path: 'early-warning',
  //       name: 'early-warning',
  //       component: () => import('@/components/admin/intelligent-analysis/early-warning/index'),
  //       meta: {
  //         auth: true,
  //         title: '预警统计'
  //       }
  //     },
  //     // 电子海图
  //     {
  //       path: 'sea-map-mark',
  //       name: 'sea-map-mark',
  //       component: () => import('@/components/admin/sea-map/map-mark/index'),
  //       meta: {
  //         auth: true,
  //         title: '海图标注'
  //       }
  //     },
  //     // 北斗掉线仪表盘
  //     {
  //       path: 'equipment-disconnection',
  //       name: 'equipment-disconnection',
  //       component: () => import('@/components/admin/data-dashboard/equipment-disconnection/index'),
  //       meta: {
  //         auth: true,
  //         title: '北斗设备掉线原因统计'
  //       }
  //     },
  //     // 日志信息统计
  //     {
  //       path: 'log-statistics',
  //       name: 'log-statistics',
  //       component: () => import('@/components/admin/data-dashboard/log-statistics/index'),
  //       meta: {
  //         auth: true,
  //         title: '日志信息统计'
  //       }
  //     },
  //     // 数据增长情况统计
  //     {
  //       path: 'data-growth',
  //       name: 'data-growth',
  //       component: () => import('@/components/admin/data-dashboard/data-growth/index'),
  //       meta: {
  //         auth: true,
  //         title: '数据增长情况统计'
  //       }
  //     },
  //     // 进出港管理-报备信息
  //     {
  //       path: 'report-manage',
  //       name: 'report-manage',
  //       component: () => import('@/components/admin/flow-manage/report/index'),
  //       meta: {
  //         auth: true,
  //         title: '报备信息'
  //       }
  //     },
  //     // 信息管理
  //     {
  //       path: 'marine-elements',
  //       name: 'marine-elements',
  //       component: () => import('@/components/admin/information-manage/marine-elements/index'),
  //       meta: {
  //         auth: true,
  //         title: '涉海要素管理'
  //       }
  //     },
  //     {
  //       path: 'note-taking-manage',
  //       name: 'note-taking-manage',
  //       component: () => import('@/components/admin/information-manage/note-taking-manage/index'),
  //       meta: {
  //         auth: true,
  //         title: '随手记管理'
  //       }
  //     },
  //     {
  //       path: 'interaction',
  //       name: 'interaction',
  //       component: () => import('@/components/admin/information-manage/interaction/index'),
  //       meta: {
  //         auth: true,
  //         title: '互动交流管理'
  //       }
  //     },
  //     // 视频监控管理
  //     {
  //       path: 'video-manage',
  //       name: 'video-manage',
  //       component: () => import('@/components/admin/monitor-manage/video/index'),
  //       meta: {
  //         auth: true,
  //         title: '视频监控管理'
  //       }
  //     },
  //     {
  //       path: 'video-scheme',
  //       name: 'video-scheme',
  //       component: () => import('@/components/admin/monitor-manage/scheme/index'),
  //       meta: {
  //         auth: true,
  //         title: '视频方案配置'
  //       }
  //     },
  //     {
  //       path: 'snap-manage',
  //       name: 'snap-manage',
  //       component: () => import('@/components/admin/monitor-manage/snap/index'),
  //       meta: {
  //         auth: true,
  //         title: '点位抓拍'
  //       }
  //     },
  //     // 系统管理
  //     {
  //       path: 'organization-manage',
  //       name: 'organization-manage',
  //       component: () => import('@/components/admin/system/organization/index'),
  //       meta: {
  //         auth: true,
  //         title: '单位分类'
  //       }
  //     },
  //     {
  //       path: 'account-manage',
  //       name: 'account-manage',
  //       component: () => import('@/components/admin/system/account/index'),
  //       meta: {
  //         auth: true,
  //         title: '账号管理'
  //       }
  //     },
  //     {
  //       path: 'role-manage',
  //       name: 'role-manage',
  //       component: () => import('@/components/admin/system/role/index'),
  //       meta: {
  //         auth: true,
  //         title: '角色管理'
  //       }
  //     },
  //     {
  //       path: 'menu-manage',
  //       name: 'menu-manage',
  //       component: () => import('@/components/admin/system/menu/index'),
  //       meta: {
  //         auth: true,
  //         title: '菜单管理'
  //       }
  //     },
  //     {
  //       path: 'dictionary-manage',
  //       name: 'dictionary-manage',
  //       component: () => import('@/components/admin/system/dictionary/index'),
  //       meta: {
  //         auth: true,
  //         title: '字典管理'
  //       }
  //     },
  //     {
  //       path: 'log-manage',
  //       name: 'log-manage',
  //       component: () => import('@/components/admin/system/log/index'),
  //       meta: {
  //         auth: true,
  //         title: '日志管理'
  //       }
  //     },
  //     {
  //       path: 'timing-tasks',
  //       name: 'timing-tasks',
  //       component: () => import('@/components/admin/system/timing-tasks/index'),
  //       meta: {
  //         auth: true,
  //         title: '定时任务'
  //       }
  //     }
  //   ]
  // },
  // 可视化系统
  {
    path: '/screen',
    name: 'screen',
    component: () => import('@/components/screen/index'),
    children: [
      {
        path: '',
        name: 'trawler-statistics',
        components: {
          default: (resolve) => require(['@/components/screen/search.vue'], resolve),
          left: (resolve) => require(['@/components/screen/statistics/index'], resolve),
          right: (resolve) => require(['@/components/screen/dynamic/index'], resolve)
        },
        meta: {
          auth: true,
          class: '', // 控制右侧操作列位置
          id: 0,
          name: '', // 控制左下角经纬度位置
          point: false, // 控制地图点位样式
          title: '首页'
        }
      },
      {
        path: 'analysis',
        name: 'trawler-analysis',
        components: {
          // default: (resolve) => require(['@/components/screen/search.vue'], resolve),
          left: (resolve) => require(['@/components/screen/analysis/sidebar'], resolve),
          right: (resolve) => require(['@/components/screen/analysis/index'], resolve)
        },
        meta: {
          auth: true,
          class: '',
          id: 2,
          name: 'analysis',
          point: false,
          title: '智能分析'
        }
      },
      {
        path: 'port-info',
        name: 'port-info',
        components: {
          left: (resolve) => require(['@/components/screen/port/info.vue'], resolve)
        },
        meta: {
          auth: true,
          class: 'expend',
          id: 0,
          name: '',
          point: false,
          title: '渔港详情'
        }
      },
      {
        path: 'trawler-info',
        name: 'trawler-info',
        components: {
          default: (resolve) => require(['@/components/screen/search.vue'], resolve),
          left: (resolve) => require(['@/components/screen/trawler/info'], resolve),
          right: (resolve) => require(['@/components/screen/trawler/dynamic'], resolve)
        },
        meta: {
          auth: true,
          class: '',
          id: 0,
          name: '',
          point: false,
          title: '渔船详情'
        }
      },
      {
        path: 'port-monitor',
        name: 'port-monitor',
        components: {
          default: (resolve) => require(['@/components/screen/port/monitor.vue'], resolve)
        },
        meta: {
          auth: true,
          class: 'expend',
          id: 1,
          name: '',
          point: false,
          title: '全景监控'
        }
      },
      {
        path: 'screen-expend',
        name: 'screen-expend',
        components: {
          default: (resolve) => require(['@/components/screen/expend.vue'], resolve)
        },
        meta: {
          auth: true,
          class: 'expend',
          name: 'expend',
          point: false,
          title: '空白页'
        }
      },
      {
        path: 'trawler-grouping',
        name: 'trawler-grouping',
        components: {
          left: (resolve) => require(['@/components/screen/grouping/index'], resolve)
        },
        meta: {
          auth: true,
          class: 'expend',
          name: '',
          point: true, // 开启实时点位功能-去掉瓦片及点位切换功能
          title: '渔船分组功能'
        }
      }
    ]
  }
  // {
  //   path: '*',
  //   redirect: '/login'
  // }
]

const router = new VueRouter({
  routes
})

export default router
