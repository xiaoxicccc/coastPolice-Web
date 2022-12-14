import Vue from 'vue'
import Vuex from 'vuex'
import api from '../util/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
  },
  state: {
    auth: [],
    breadcrumb: [ // 面包屑数据缓存数组
      // {
      //   name: 'admin',
      //   path: '/admin',
      //   title: '首页'
      // }
    ],
    dictionary: {},
    menu: [],
    syncRoutes: [
      {
        path: '/admin',
        name: 'admin',
        component: (resolve) => require(['@/components/admin/container'], resolve),
        meta: {
          auth: true,
          name: '首页'
        },
        children: [
        ]
      },
      {
        path: '*',
        redirect: '/screen'
      }
    ],
    token: '',
    user: {},
    views: [] // 动态页面数据缓存数组
  },
  getters: { // 实时监听state值的变化(最新状态)
  },
  mutations: {
    clearUser (state) {
      state.auth = []
      state.dictionary = {}
      state.menu = []
      state.token = ''
      state.user = {}

      localStorage.removeItem('user')
      localStorage.removeItem('dicts')
      localStorage.removeItem('token')
      localStorage.removeItem('state')
    },
    updateBreadcrumb (state, { data, type }) {
      // 查询当前页面是否打开过，如果打开过则添加到最后
      const index = state.breadcrumb.findIndex(item => item.name === data.name)

      if (index !== -1 && type === 'delete') {
        state.breadcrumb.splice(index, 1)
        state.views.splice(index, 1)
      }
      if (index === -1 && type === 'insert') {
        state.breadcrumb.push(data)
        state.views.push(data.name)
      }
    },
    updateRoutes (state, { menu }) {
      const routes = []
      state.auth = []
      menu.forEach((item) => {
        item.children.forEach((subitem) => {
          if (subitem.compUrl) {
            // 重新分配组件路径
            routes.push({
              path: (subitem.powerUrl).replace(/\/admin\//, ''),
              name: subitem.powerCode,
              component: (resolve) => require([`@/components${subitem.compUrl}`], resolve),
              meta: {
                auth: true,
                name: subitem.remark,
                title: subitem.powerName,
                keepAlive: true
              }
            })
          }
        })
      })
      state.syncRoutes[0].children = state.syncRoutes[0].children.concat(routes)
    },
    updateUser (state, { dictionary, menu, token, user }) {
      // state.auth = user.powers.slice()
      state.dictionary = Object.assign({}, dictionary)
      state.menu = menu.slice()
      state.token = token
      state.user = Object.assign({}, user)

      localStorage.setItem('token', state.token)
      localStorage.setItem('dicts', JSON.stringify(state.dictionary))
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  actions: {
    loadUser ({ commit }, { data }) {
      return new Promise((resolve, reject) => {
        Vue.axios.post(api.login, data, { loading: true }).then(response => {
          const res = response.data
          if (res.success) {
            commit('updateRoutes', { menu: res.result.menus })
            commit('updateUser', {
              dictionary: res.result.dicts,
              menu: res.result.menus,
              token: res.result.token,
              user: res.result.user
            })
            resolve(response)
          } else {
            commit('clearUser')
            reject(response)
          }
        }).catch(err => {
          commit('clearUser')
          reject(err)
        })
      })
    },
    loadBreadcrumb ({ commit }, { data, type }) {
      if (data.name !== 'admin') {
        commit('updateBreadcrumb', { data, type })
      }
    },
    updateUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const buffer = localStorage.getItem('state')
        if (buffer) {
          const data = JSON.parse(buffer)
          commit('updateRoutes', data)
          commit('updateUser', data)
          resolve()
        }
      })
    }
  }
})

export default store
