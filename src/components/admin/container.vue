<template>

  <div class="admin">

    <div class="app-menu">

      <app-menu>
      </app-menu>

    </div>

    <div class="app-wrapper">

      <app-header>
      </app-header>

      <app-breadcrumb>
      </app-breadcrumb>

      <app-map>
      </app-map>

      <div class="app-container">

        <keep-alive :include="views">

          <router-view class="container" />

        </keep-alive>

      </div>

    </div>

  </div>

</template>

<script>
import appBreadcrumb from './breadcrumb'
import appHeader from './header'
import appMap from '@/components/map/map'
import appMenu from './menu'
import { mapState } from 'vuex'
export default {
  name: 'container',
  components: {
    'app-breadcrumb': appBreadcrumb,
    'app-header': appHeader,
    'app-map': appMap,
    'app-menu': appMenu
  },
  computed: mapState({
    views: (state) => state.views // 动态页面数据缓存
  })
}
</script>

<style scoped lang="sass">
.admin
  box-sizing: border-box
  display: flex
  flex-direction: row
  height: 100vh
  position: relative

/* MENU */
.app-menu
  background-color: rgba(0, 97, 215, 1)
  background-image: url('/img/icon-menu-background.png')
  background-position-x: left
  background-position-y: bottom
  background-repeat: no-repeat
  background-size: 216px 751px
  height: 100%
  flex-shrink: 0
  width: 216px

/* WRAPPER */
.app-wrapper
  display: flex
  flex-direction: column
  flex-grow: 1
  height: 100%
  overflow: hidden
  position: relative
  width: calc(100% - 216px)

.app-container
  bottom: 0
  box-sizing: border-box
  flex-grow: 1
  left: 0
  pointer-events: none
  position: absolute
  right: 0
  top: 96px

.container
  background-color: rgba(244, 245, 247, 1)
  box-sizing: border-box
  pointer-events: all
</style>
