<template>

  <div class="menu">

    <div class="title">

      <img
        alt="MENU_LOGO"
        src="/img/admin/icon-menu-logo.png">

    </div>

    <ul class="menu-list">

      <li
        v-for="(item, i) in menus"
        :class="[ getItemActive(item.name), getSubmenuOpened(item.name) ]"
        :key="i">

        <p @click="toggleSubmenuOpened(item.name)">

          <i :class="['iconfont', 'menu-icon', item.icon]"></i>

          <span class="label">{{ item.label }}</span>

          <i class="el-icon-caret-right right-icon">
          </i>

        </p>

        <ul
          v-if="item.children"
          class="child-menu">

          <li
            v-for="(subitem, index) in item.children"
            :class="[ getItemActive(subitem.name) ]"
            :key="index">

            <router-link :to="subitem.path">{{ subitem.label }}
            </router-link>

          </li>

        </ul>

      </li>

    </ul>

  </div>

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app-menu',
  data () {
    return {
      active: '',
      menus: [],
      opened: []
    }
  },
  computed: mapState([
    'menu'
  ]),
  mounted () {
    this.fetchData()
  },
  watch: {
    $route: 'updateMenu'
  },
  methods: {
    fetchData () {
      const path = this.$route.path

      this.active = ''
      this.opened = []

      this.menus = []

      // 重构动态菜单数据
      this.menus = this.menu.map(item => {
        return {
          icon: 'el-icon-bangzhu',
          label: item.powerName,
          name: item.powerCode,
          children: item.children.map(_item => {
            return {
              label: _item.powerName,
              name: _item.powerCode,
              path: `${_item.powerUrl}`
            }
          })
        }
      })

      this.menus.forEach((item) => {
        if (item.path === path) {
          this.toggleItemActive(item.name)
        }
        if (item.children) {
          item.children.forEach(subitem => {
            if (subitem.path === path) {
              this.toggleItemActive(subitem.name)
              this.toggleSubmenuOpened(item.name)
            }
          })
        }
      })
    },
    getItemActive (key) {
      return this.active === key ? 'active' : ''
    },
    getSubmenuOpened (key) {
      return this.opened.some(item => item === key) ? 'opened' : ''
    },
    toggleItemActive (key) {
      this.active = key
    },
    toggleSubmenuOpened (key) {
      const index = this.opened.indexOf(key)

      if (~index) {
        this.opened.splice(index, 1)
      } else {
        this.opened.push(key)
      }
    },
    updateMenu () {
      const path = this.$route.path

      this.active = ''
      this.menus.forEach((item) => {
        if (item.path === path) {
          this.toggleItemActive(item.name)
        }
        if (item.children) {
          item.children.forEach(subitem => {
            if (subitem.path === path) {
              const index = this.opened.length - 1
              this.toggleItemActive(subitem.name)
              if (index > 0) {
                this.opened = [this.opened[index]]
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="sass">
.menu
  display: flex
  color: white
  flex-direction: column
  height: 100%
  overflow-y: hidden
  width: 100%

/* TITLE */
.title
  align-items: center
  background-color: rgba(8, 103, 235, 1)
  display: flex
  flex-direction: row
  //color: white
  //font-family: 'PMZDR'
  //font-size: 24px
  height: 95px
  justify-content: center
  //line-height: 56px

// LIST
ul
  list-style-type: none
  margin: 0
  padding: 0

  p
    align-items: center
    box-sizing: border-box
    display: flex
    flex-direction: row
    justify-content: space-between
    margin: 0
    padding-left: 20px
    padding-right: 20px
    width: 100%
    .menu-icon
      flex-shrink: 0
    .label
      flex-grow: 1
      margin-left: 10px
      text-align: left
  a
    text-decoration: none

.right-icon
  flex-shrink: 0
  transition-duration: .3s

.opened
  .right-icon
    transform: rotate(90deg)

.menu-list
  background-color: transparent
  box-sizing: border-box
  flex-grow: 1
  overflow-y: auto
  width: 100%

  li
    cursor: pointer
    display: block
    line-height: 50px
    list-style: none
    width: 100%

.child-menu
  display: none
  transition-duration: .3s
  li
    display: flex
    flex-direction: row
    height: 40px
    line-height: 40px
    &::before
      background-color: transparent
      content: ''
      display: inline
      height: 100%
      width: 2px
    &.active
      background-color: rgba(255, 255, 255, .14)
    &.active::before
      background-color: rgba(255, 238, 6, 1)
    a
      color: #fff
      font-size: 14px
      height: 40px
      line-height: 40px
      padding-left: 36px
      text-align: left
      width: 100%
      &::before
        background-color: #FFF
        border-radius: 6px
        content: ''
        display: inline-block
        height: 6px
        margin-right: 10px
        width: 6px

.closed
  .child-menu
    pointer-events: none

.opened
  .child-menu
    display: block
</style>
