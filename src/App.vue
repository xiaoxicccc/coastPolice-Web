<template>

  <div id="app">

    <router-view/>

  </div>

</template>

<script>

export default {
  name: 'app',
  created () {
    this.loadUser()
  },
  methods: {
    loadUser () {
      const meta = this.$route.meta
      const name = this.$route.name
      const token = localStorage.getItem('token')

      if ((!name || meta.auth) && token) {
        this.$store.dispatch('updateUserInfo').then(() => {
          if (token) {
            this.$router.addRoutes(this.$store.state.syncRoutes)
          } else {
            this.$router.push('/login')
          }
        })
      }
    }
  }
}

</script>

<style lang="sass">
html,
body
  box-sizing: border-box
  height: 100%
  margin: 0
  padding: 0
  width: 100%

ul
  list-style-type: none
  margin: 0
  padding: 0

// 优设黑体
@font-face
  font-family: 'YSHTR'
  src: url('/font/YouSheRegular.TTF')

// DIN-M
@font-face
  font-family: 'DINM'
  src: url('/font/DINPro-Medium.otf')

// DIN-B
@font-face
  font-family: 'DINB'
  src: url('/font/DINPro-Bold.otf')

// 普惠体-R
//@font-face
//  font-family: 'PHTR'
//  src: url('/font/PuHuiTi-Regular.ttf')

// 普惠体-B
@font-face
  font-family: 'PHTB'
  src: url('/font/PuHuiTi-Bold.ttf')

// 普惠体-M
@font-face
  font-family: 'PHTM'
  src: url('/font/PuHuiTi-Medium.ttf')

/* 思源黑体-标准 */
@font-face
  font-family: 'SHSCNN'
  src: url('/font/SourceHanSansCN-Normal.otf')

// 思源黑体-中等
@font-face
  font-family: 'SHSCNM'
  src: url('/font/SourceHanSansCN-Medium.otf')

/* 庞门正道-标准 */
@font-face
  font-family: 'PMZDR'
  src: url('/font/PangMenZhengDaoRegular.TTF')

#app
  box-sizing: border-box
  color: #2c3e50
  font-family: 'PuHuiTi-Regular', Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  height: 100%
  text-align: center
  width: 100%

/*业务版滚动条样式*/
html ::-webkit-scrollbar
  /*滚动条整体样式*/
  width: 5px
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px

html ::-webkit-scrollbar-thumb
  /*滚动条里面小方块*/
  border-radius: 1px !important
  -webkit-box-shadow: inset 0 0 2px rgba(82, 156, 255, 1) !important
  background: rgba(82, 156, 255, 1) !important

html ::-webkit-scrollbar-track
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 2px rgba(135, 186, 255, .3) !important
  border-radius: 1px !important
  background: rgba(135, 186, 255, .3) !important

/* 大屏版滚动条样式 */
.screen ::-webkit-scrollbar
  /*滚动条整体样式*/
  width: 2px
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 2px

.screen  ::-webkit-scrollbar-thumb
  /*滚动条里面小方块*/
  border-radius: 1px !important
  -webkit-box-shadow: inset 0 0 2px rgba(95, 128, 183, 1) !important
  background: rgba(95, 128, 183, 1) !important

.screen ::-webkit-scrollbar-track
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 2px rgba(46, 68, 104, 1) !important
  border-radius: 1px !important
  background: rgba(46, 68, 104, 1) !important

/* 表格 按钮样式 */
[role="danger"]
  color: rgba(255, 68, 68, 1)

[role="primary"]
  color: rgba(22, 127, 255, 1)

[role="info"]
 color: rgba(22, 127, 255, 1)

[role="warning"]
  color: rgba(255, 168, 64, 1)

[role="success"]
  color: rgba(19, 196, 119, 1)

.cell .button
  border-right: 1px solid rgba(233, 233, 233, 1)
  cursor: pointer
  font-family: 'SHSCNN'
  padding-left: 20px
  padding-right: 20px

.cell .button:first-child
  padding-left: 0

.cell .button:last-child
  border-right: 1px solid transparent
  padding-right: 0

// 查询表单按钮样式
.form .button
  border-radius: 3px
  border: 1px solid transparent
  box-sizing: border-box
  color: white
  cursor: pointer
  display: inline-block
  font-size: 14px
  height: 32px
  line-height: 30px
  min-width: 88px
  padding-left: 18px
  padding-right: 18px
  text-align: center

.form .button.disabled
  opacity: 0.5
  cursor: not-allowed

[role="primary-form"]
  background-color: rgba(22, 127, 255, 1)
  border-color: rgba(22, 127, 255, 1)

[role="danger-form"]
  background-color: rgba(255, 68, 68, 1)
  border-color: rgba(255, 68, 68, 1)

[role="success-form"]
  background-color: rgba(19, 196, 119, 1)
  border-color: rgba(19, 196, 119, 1)

[role="info-form"]
  background-color: rgba(255, 255, 255, 1)
  border-color: rgba(208, 209, 216, 1) !important
  color: rgba(37, 43, 58, 1) !important

// 控制按钮间距
.control
  display: flex
  flex-direction: row
  justify-content: center

.control .button
  margin-right: 10px

.control .button:last-child
  margin-right: 0

// 大屏表单控件
.screen .el-input__inner
  background-color: rgba(19, 77, 165, 0.4) !important
  border-color: rgba(56, 156, 236, 0.6) !important
  border-radius: 0 !important
  color: rgba(255, 255, 255, 1) !important
  font-size: 14px !important

.el-table--small
  font-size: 13px !important
</style>
