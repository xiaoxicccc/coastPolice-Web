<template>

  <div class="screen-header">

    <img
      class="screen-header-title"
      alt=""
      src="/img/screen/header/icon-title.png">

    <ul class="screen-header-list">

      <li
        v-for="(item, i) in nav"
        :class="['screen-header-item', active === i ? 'active' : '']"
        :key="i"
        @click="handle(item)">{{ item.label }}
      </li>

    </ul>

    <div class="screen-header-time">{{ date }}
    </div>

    <div class="header-user">

      <span class="user-control">

        <span class="user-status">
        </span>

        <span>{{ user.name }}, 欢迎您！
        </span>

      </span>

      <span
        class="user-control"
        @click="logout()">

        <i class="el-icon-right"></i>

        <span>退出</span>

      </span>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'screen-header',
  data () {
    return {
      active: 0,
      date: '',
      nav: [
        {
          label: '首页',
          name: 'trawler-statistics',
          path: '/screen'
        },
        {
          label: '视频监控',
          name: 'port-monitor',
          path: '/screen/port-monitor'
        },
        {
          label: '智能分析',
          name: 'trawler-analysis',
          params: {
            type: 'fishing'
          },
          path: '/screen/analysis?type=fishing'
        },
        {
          label: '业务管理',
          path: '/admin'
        }
      ],
      time: '',
      timer: null,
      user: {
        name: ''
      }
    }
  },
  mounted () {
    this.initData()
    this.initDate()
    this.timer = setInterval(() => {
      this.initDate()
    }, 1000)
    this.initUser()
  },
  watch: {
    $route: 'initData'
  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    handle (data) {
      this.$router.push({
        path: data.path
      })
      // this.$router.push({
      //   name: data.name,
      //   params: data.params
      // })
      this.initData()
    },
    initData () {
      const meta = this.$route.meta
      this.active = meta.id
    },
    initDate () {
      this.time = new Date()

      // 年份
      const year = this.time.getFullYear() + '.'
      const monthTemp = this.time.getMonth() + 1
      const month = (monthTemp < 10 ? '0' + monthTemp : monthTemp) + '.'
      const date = (this.time.getDate() < 10 ? '0' + this.time.getDate() : this.time.getDate()) + '.'

      // 时间
      const hours = (this.time.getHours() < 10 ? '0' + this.time.getHours() : this.time.getHours()) + ':'
      const minutes = (this.time.getMinutes() < 10 ? '0' + this.time.getMinutes() : this.time.getMinutes()) + ':'
      const seconds = this.time.getSeconds() < 10 ? '0' + this.time.getSeconds() : this.time.getSeconds()
      this.date = year + month + date + ' ' + hours + minutes + seconds
    },
    initUser () {
      this.user.name = JSON.parse(localStorage.getItem('user')).userName
    },
    logout () {
      this.$confirm('您确定要退出本系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        this.axios.post(api.logout, params, { loading: true }).then(() => {
        }).catch(err => {
          console.error(err)
        }).finally(() => {
          // 逐个清除，保留海图设置
          localStorage.removeItem('user')
          localStorage.removeItem('dicts')
          localStorage.removeItem('token')
          localStorage.removeItem('state')
          // localStorage.clear()
          this.$message.success('退出成功！')
          this.$router.push({
            path: '/login'
          })
        })
        // const params = new FormData()
        // params.append('token', localStorage.getItem('token'))
        // this.axios.post(api.logout, params).then(response => {
        //   const res = response.data
        //   if (res.code !== 200) {
        //     this.$message.error(res.message)
        //   }
        // })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.screen-header {
  background-image: url('/img/screen/header/icon-background.png');
  background-size: 100% 100%;
  height: 82px;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 11;
}
.screen-header-title {
  height: 49px;
  left: 21px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 663px;
}
.screen-header-list {
  align-items: center;
  color: rgba(190, 217, 238, 1);
  display: flex;
  flex-direction: row;
  font-family: 'YSHTR';
  font-size: 16px;
  left: 816px;
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 16px;
}
.screen-header-item {
  background-image: url('/img/screen/header/icon-nav.png');
  background-size: 100% 100%;
  cursor: pointer;
  height: 34px;
  line-height: 34px;
  margin-right: 20px;
  text-align: center;
  width: 96px;
}
.screen-header-item.active {
  background-image: url('/img/screen/header/icon-nav-active.png');
}
.screen-header-time {
  color: rgba(56, 156, 236, 1);
  display: inline-block;
  font-family: 'DINM';
  position: absolute;
  right: 275px;
  top: 23px;
}
.header-user {
  font-size: 12px;
  padding-right: 30px;
  position: absolute;
  right: 0px;
  text-align: right;
  top: 25px;
  /*width: 275px;*/
}
.user-control {
  color: rgba(245, 245, 245, 1);
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  margin-left: 15px;
  pointer-events: all;
}
.user-control:first-child {
  margin-left: 0;
  cursor: text;
}
.user-status {
  background-color: chartreuse;
  border-radius: 4px;
  display: inline-block;
  height: 8px;
  margin-right: 5px;
  padding-left: 4px;
  padding-right: 4px;
  /*width: 8px;*/
}
@media screen and (max-width:1600px) {
  .screen-header-list {
    left: 705px;
  }
  .screen-header-time {
    display: none;
  }
}
</style>
