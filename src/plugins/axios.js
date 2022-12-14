'use strict'

import Vue from 'vue'
import axios from 'axios'
import { Loading, Message } from 'element-ui'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || ''
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ''
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

let showLoad = null
// 401
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (config.loading) {
      showLoad = Loading.service({
        lock: false,
        text: '',
        background: 'rgba(255, 255, 255, 0.7)'
      })
    }
    const token = window.localStorage.getItem('token')
    // 有无token
    if (token) {
      config.headers.common.Auth = token
    }
    return config
  },
  function (error) {
    if (showLoad) {
      showLoad.close()
    }
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.all = axios.all
_axios.spread = axios.spread
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    const code = response.data.code
    const unauthorized = ['401', 408]
    if (unauthorized.includes(code)) {
      Message.closeAll()
      Message.warning('身份认证已失效，请重新登录！')

      localStorage.removeItem('user')
      localStorage.removeItem('dicts')
      localStorage.removeItem('token')
      // localStorage.clear()
      location.href = '/#/login'
    }
    if (showLoad) {
      showLoad.close()
    }
    return response
  },
  function (error) {
    // Do something with response error
    if (showLoad) {
      showLoad.close()
    }
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
