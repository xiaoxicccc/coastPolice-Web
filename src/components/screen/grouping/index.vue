<template>

  <!-- 渔船分组页面 -->
  <div :class="['trawler-grouping', visibility]">

    <app-title
      title="渔船分组信息">
    </app-title>

    <div class="trawler-grouping-data">

      <div class="trawler-grouping-tabs">

        <div
          v-for="(item, index) in tabs"
          class="trawler-grouping-tab"
          :class="{'active': active === item.value}"
          :key="index"
          @click="toggleTab(item.value)">{{ item.label }}
        </div>

      </div>

      <div class="trawler-grouping-tree-wrapper">

        <el-tree
          v-if="tree.visible"
          class="trawler-grouping-tree"
          :data="tree.data"
          :default-checked-keys="checked.keys"
          highlight-current
          node-key="id"
          :props="defaultProps"
          ref="app-tree"
          show-checkbox
          @check-change="checkChange">
        </el-tree>

      </div>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import appTitle from '@/components/screen/title'
export default {
  name: 'trawler-grouping',
  components: {
    'app-title': appTitle
  },
  data () {
    return {
      active: 'Region',
      checked: {
        keys: []
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tabs: [
        {
          label: '全部渔船',
          value: 'Region'
        },
        {
          label: '分组渔船',
          value: 'Group'
        }
      ],
      trawler: {
        data: [],
        focus: [],
        uuids: []
      },
      tree: {
        data: [],
        visible: false
      },
      visibility: ''
    }
  },
  mounted () {
    this.toggleVisible(true)
    this.toggleTab(this.active)
  },
  destroyed () {
    const types = ['dynamic', 'focus', 'light_focus', 'light']
    types.forEach(type => {
      window.$screen.vector[`vector__trawler_${type}`].clear()
    })
    window.$screen.visible.point = false
    window.$screen.initData(true)
    window.$screen.loadFocusTrawlerData()
    // 清空定位信息
    const layer = window.$screen.vector.vector_locate
    if (layer) {
      layer.clear()
    }
    this.toggleVisible(false)
  },
  methods: {
    checkChange (data, status, children) {
      if (!data.children) {
        this.toggleTrawler(data, status)
      } else {
        if (!children) {
          const format = (info) => {
            if (info.children) {
              info.children.forEach(item => {
                if (!item.children) {
                  this.toggleTrawler(item, status)
                } else {
                  format(item)
                }
              })
            }
          }
          format(data)
        }
      }
    },
    formatData (data, label) {
      const type = typeof data
      const focus = this.active === 'Region' ? false : label === '重点关注'
      if (type === 'object') {
        const children = []
        data.forEach(item => {
          if (!item.uuid) { // 按省市区分组
            Object.keys(item).forEach(key => {
              this.checked.keys.push(key)
              const childtype = typeof item[key]
              if (childtype === 'object' && item[key]) {
                children.push({
                  children: item.uuid ? [] : this.formatData(item[key]),
                  id: key,
                  label: key
                })
              }
            })
          } else { // 按照种类分组-例如重点关注，高亮渔船
            const index = this.trawler.uuids.findIndex(_item => _item === item.uuid)
            if (index === -1) {
              this.trawler.uuids.push(item.uuid)
              if (focus) {
                this.trawler.focus.push(item)
              } else {
                this.trawler.data.push(item)
              }
              children.push({
                data: item,
                focus: focus,
                id: item.uuid,
                label: item.boatName
              })
              this.checked.keys.push(item.uuid)
              window.$screen.insertTrawler(item, true, focus)
            }
          }
        })
        return children
      }
    },
    initData (e) { // 根据type请求不同分组数据
      this.checked.keys = []
      this.tree.data = []
      this.trawler.data = []
      this.trawler.uuids = []
      this.trawler.focus = []
      const params = new FormData()
      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const url = `getTrawlerGroupBy${e}`
      this.axios.post(api[url], params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (res.result) {
            const data = res.result
            Object.keys(data).forEach(key => {
              this.checked.keys.push(key)
              this.tree.data.push({
                children: this.formatData(data[key], key),
                id: key,
                label: key
              })
            })
            this.tree.visible = true
            // 更新渔船分类数量
            window.$screen.formatTrawlerNumber(this.trawler.data, false)
            window.$screen.formatTrawlerNumber(this.trawler.focus, true)
          }
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        loading.close()
      })
    },
    toggleTab (e) {
      this.tree.visible = false
      const types = ['dynamic', 'focus', 'light_focus', 'light']
      types.forEach(type => {
        window.$screen.vector[`vector__trawler_${type}`].clear()
        window.$screen.vector[`vector__trawler_${type}`].show()
      })
      // 重点关注等渔船定时请求关闭
      if (window.$screen.timernumber) {
        clearInterval(window.$screen.timernumber)
        window.$screen.timernumber = null
      }
      // 矢量渔船定时请求关闭
      if (window.$screen.timer) {
        clearInterval(window.$screen.timer)
        window.$screen.timer = null
      }
      this.active = e
      this.initData(e)
    },
    toggleTrawler (data, status) {
      const layer = data.focus ? window.$screen.vector.vector__trawler_focus : window.$screen.vector.vector__trawler_dynamic
      const marker = layer.getGeometryById(data.id)
      if (marker) {
        if (!status) {
          marker.hide()
        } else {
          marker.show()
        }
      }
    },
    toggleVisible (visibility) {
      this.visibility = visibility ? 'visible' : ''
    }
  }
}
</script>

<style scoped>
.trawler-grouping {
  background: linear-gradient(180deg, rgba(25, 48, 128, 0.16) 1%, rgba(25, 48, 128, 0.8) 48%, rgba(25, 48, 128, 0) 100%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  left: -350px;
  opacity: 0;
  /*overflow-y: hidden;*/
  padding-top: 19px;
  transition-duration: .3s;
  visibility: hidden;
  width: 320px;
}
.trawler-grouping.visible {
  left: 30px;
  opacity: 1;
  /*overflow-y: hidden;*/
  visibility: visible;
}
/* DATA */
.trawler-grouping-data {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 10px;
  padding-right: 10px;
}
/* TABS */
.trawler-grouping-tabs {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  margin-top: 15px;
  width: 100%;
}
.trawler-grouping-tab {
  background-color: rgba(19, 77, 165, 0.4);
  border: 1px solid rgba(56, 156, 236, 0.6);
  color: white;
  cursor: pointer;
  font-family: 'PuHuiTi-Regular';
  font-size: 14px;
  height: 33px;
  line-height: 33px;
  text-align: center;
  width: 50%;
}
.trawler-grouping-tab:first-child {
  margin-right: 15px;
}
.trawler-grouping-tab.active {
  border-color: rgba(136, 199, 250, 1);
}
/* TREE */
.trawler-grouping-tree-wrapper {
  flex-grow: 1;
  overflow-y: auto;
}
.trawler-grouping-tree {
  background-color: transparent;
  color: white;
  height: 100%;
}
</style>
<style>
.trawler-grouping-tree.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: rgba(19, 77, 165, 0.4);
}
.trawler-grouping-tree .el-tree-node__content:hover {
  background-color: rgba(19, 77, 165, 0.4);
}
.trawler-grouping-tree .el-tree-node:focus > .el-tree-node__content {
  background-color: transparent;
}
</style>
