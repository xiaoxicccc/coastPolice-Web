<template>

  <div class="breadcrumb">

    <div class="breadcrumb-inner">

      <router-link
        :class="['admin-breadcrump', !newRouteName ? 'active' : '']"
        to="/admin">

        <i class="el-icon-s-home">
        </i>

        <span>首页</span>

        <span class="line">
      </span>

      </router-link>

      <template
        v-if="breadcrumb && breadcrumb.length">

        <span
          v-for="(item, index) in breadcrumb"
          class="admin-breadcrump normal-breadcrump"
          :class="{'active': name === item.name}"
          :key="index">

          <span
            class="label"
            @click="togglePage(item)">{{ item.title }}
          </span>

          <i
            class="icon-breadcrumb-close"
            @click="close(item)">
          </i>

          <span class="line">
          </span>

        </span>

      </template>

    </div>
    <!--<span
      v-if="newRouteName"
      class="admin-breadcrump normal-breadcrump active">{{ newRouteName }}

      <i
        class="icon-breadcrumb-close"
        @click="close">
      </i>

      <span class="line">
      </span>

    </span>-->

    <i
      class="el-icon-refresh-left icon-update"
      @click="updateTrawler">
    </i>

  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'app-breadcrumb',
  data () {
    return {
      name: '',
      newRoute: '',
      newRouteName: ''
    }
  },
  computed: mapState({
    breadcrumb: (state) => state.breadcrumb
  }),
  created () {
    this.activeIcon()
  },
  watch: {
    $route: 'activeIcon'
  },
  methods: {
    activeIcon () {
      const meta = this.$route.meta
      this.newRouteName = meta.title
      this.newRoute = this.$route.path
      this.name = this.$route.name
      const data = {
        name: this.name,
        path: this.newRoute,
        title: this.newRouteName
      }
      this.$store.dispatch('loadBreadcrumb', { data, type: 'insert' })
    },
    close (data) {
      // 更新vuex中的面包屑数组
      // 回到当前路由的下一页面，如果下一页面暂无，则返回上一页面
      let index = this.breadcrumb.findIndex(item => item.name === data.name)
      const length = this.breadcrumb.length ? this.breadcrumb.length - 1 : -1
      if (index === length && index) { // 当前关闭页面为最后一个
        index = length - 1
      } else if (!length && !index) { // 如果当前页面仅有一个且关闭
        index = -1
      }
      this.$store.dispatch('loadBreadcrumb', { data, type: 'delete' })
      this.$router.push({
        path: index !== -1 ? this.breadcrumb[index].path : '/admin'
      })
    },
    togglePage (e) {
      this.$router.push(e.path)
    },
    updateTrawler () {
      window.$app.loadTrawlerData()
    }
  }
}
</script>

<style scoped lang="sass">
.breadcrumb
  align-items: center
  box-sizing: border-box
  display: flex
  flex-direction: row
  height: 40px
  line-height: 40px
  overflow: hidden
  padding-left: 24px
  position: relative
  text-align: left
  width: 100%
  .breadcrumb-inner
    align-items: center
    display: flex
    flex-direction: row
    flex-grow: 1
    height: 100%
    overflow-x: auto
    overflow-y: hidden

/* ADMIN */
.admin-breadcrump
  background-color: rgba(244, 245, 247, 1)
  border-radius: 12px
  color: rgba(37, 43, 58, 1)
  cursor: pointer
  display: inline-block
  flex-shrink: 0
  font-size: 14px
  height: 24px
  line-height: 24px
  margin-right: 16px
  padding-left: 16px
  padding-right: 16px
  position: relative
  text-decoration: none
  .label
    display: inline-block
  &.active
    background-color: rgba(22, 127, 255, 1)
    color: white
    .line
      background-color: rgba(22, 127, 255, 1)
      bottom: -8px
      display: inline-block
      height: 2px
      left: 50%
      position: absolute
      transform: translateX(-50%)
      width: 30px

  i
    font-size: 14px

.icon-breadcrumb-close
  background-image: url('/img/icon-breadcrumb-close.png')
  background-size: 100% 100%
  display: none
  height: 12px
  position: absolute
  right: -3px
  top: -3px
  width: 12px

.admin-breadcrump.normal-breadcrump
  //color: white
  //background-color: rgba(22, 127, 255, 1)

.normal-breadcrump:hover
  .icon-breadcrumb-close
    display: block

.icon-update
  cursor: pointer
  flex-shrink: 0
  font-size: 20px
  margin-right: 30px
  //position: absolute
  //right: 30px
  //top: 10px
</style>
