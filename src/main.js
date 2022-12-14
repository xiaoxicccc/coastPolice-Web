/* eslint-disable */
import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import '/public/iconfont/iconfont.css'
import ElementUI from 'element-ui'
import './styles.scss'
import router from './router'
import store from './store'

Vue.use(ElementUI)
// 定义事件总线
Vue.prototype.$EventBus = new Vue()

import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable)

Vue.config.productionTip = false

Vue.directive('loadMore', {
  bind(el, binding) {
    // 获取element，定义scroll
    let select_dom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
    select_dom.addEventListener('scroll', function () {
      let height = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (height) {
        binding.value()
      }
    })
  }
})

router.beforeEach((to, from, next) => {
  // 判断系统是否有当前页面
  if (to.meta.auth) {
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
