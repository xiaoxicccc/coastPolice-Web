<template>

  <div class="menu-manage">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <el-table
      :data="data"
      :empty-text="empty"
      height="calc(100% - 120px)"
      row-key="id"
      size="small"
      stripe
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

      <el-table-column
        v-for="(item, i) in columns"
        :key="i"
        :label="item.label"
        :prop="item.prop"
        show-overflow-tooltip
        :width="item.width">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        :width="190">

        <template slot-scope="props">

          <template
            v-for="(item, i) in controls">

            <span
              v-if="!item.power || (item.power && props.row[item.key] === item.value)"
              class="button"
              :role="item.type"
              :key="i"
              @click="handle(item.prop, props.row)">{{ item.label }}
            </span>

          </template>

        </template>

      </el-table-column>

    </el-table>

    <app-dialog
      v-if="dialog.visible"
      :config="dialog.config"
      :title="dialog.title"
      @close="close">

      <app-detail
        v-if="dialog.visible"
        :data="dialog.data"
        :detail="dialog.detail"
        :id="dialog.id"
        :status="dialog.status"
        @close="close">
      </app-detail>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'

import appDialog from '@/components/common/dialog'
import appDetail from './detail'
import appFilter from '@/components/common/filter'
import {
  menu
} from '../configs'

export default {
  name: 'menu-manage',
  components: {
    'app-detail': appDetail,
    'app-dialog': appDialog,
    'app-filter': appFilter
  },
  data () {
    return {
      columns: menu.columns.slice(),
      controls: [
        {
          label: '查看',
          prop: 'check',
          type: 'info'
        },
        {
          label: '修改',
          prop: 'update',
          type: 'warning'
        },
        {
          label: '删除',
          prop: 'delete',
          type: 'danger'
        }
      ],
      data: [],
      dialog: {
        config: {
          height: 540,
          width: 450
        },
        data: [],
        detail: {},
        id: '',
        status: '',
        title: '菜单新增',
        visible: false
      },
      empty: '暂无数据',
      items: [
        {
          label: '关键词',
          prop: 'keyword',
          type: 'input'
        },
        {
          label: '',
          name: '查询',
          prop: 'query',
          style: 'primary-form',
          type: 'button'
        },
        {
          label: '',
          name: '新增',
          prop: 'insert',
          style: 'success-form',
          type: 'button'
        }
      ],
      model: {
        keyword: null
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close (visible) {
      this.dialog.visible = false
      if (visible) {
        this.initData()
      }
    },
    deleteRow (data) {
      // eslint-disable-next-line
      if (data.children && data.children.length) {
        this.$message.warning('该节点存在下级子节点，请勿删除！')
        return null
      }
      this.$confirm('您确定删除该子节点吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)
        this.axios.post(api.deleteMenu, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('删除成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '删除失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      }).catch(() => {
      })
    },
    handle (type, data) {
      this.dialog.status = type
      switch (type) {
        case 'check':
          this.dialog.visible = true
          this.dialog.id = data.id
          this.dialog.detail = Object.assign({}, data.item)
          this.dialog.title = '菜单查看'
          break
        case 'delete':
          this.deleteRow(data)
          break
        case 'insert':
          this.dialog.visible = true
          this.dialog.id = ''
          this.dialog.detail = {}
          this.dialog.title = '菜单新增'
          break
        case 'query':
          this.model = Object.assign({}, data)
          this.initData()
          break
        case 'update':
          this.dialog.visible = true
          this.dialog.id = data.id
          this.dialog.detail = Object.assign({}, data.item)
          this.dialog.title = '菜单修改'
          break
        default:
          break
      }
    },
    initData () {
      const params = new FormData()
      params.append('keyword', this.model.keyword || '')

      this.data = []
      // 数据加载中
      this.empty = '数据加载中...'
      this.axios.post(api.getMenuList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.map(item => {
            const status = ['模块', '页面', '操作']
            return {
              category: status[item.powerType - 0 - 1],
              children: item.children.map(_item => {
                return {
                  category: status[_item.powerType - 0 - 1],
                  children: _item.children.map(point => {
                    return {
                      category: status[point.powerType - 0 - 1],
                      code: point.powerCode,
                      compUrl: point.compUrl,
                      id: point.id,
                      icon: point.powerIcon,
                      index: point.sort,
                      item: point,
                      name: point.powerName,
                      parentId: point.parentId,
                      route: point.powerUrl,
                      type: point.powerType
                    }
                  }),
                  code: _item.powerCode,
                  compUrl: _item.compUrl,
                  id: _item.id,
                  icon: _item.powerIcon,
                  index: _item.sort,
                  item: _item,
                  name: _item.powerName,
                  parentId: _item.parentId,
                  route: _item.powerUrl,
                  type: _item.powerType
                }
              }),
              code: item.powerCode,
              compUrl: item.compUrl,
              id: item.id,
              icon: item.powerIcon,
              index: item.sort,
              item: item,
              name: item.powerName,
              parentId: item.parentId,
              route: item.powerUrl,
              type: item.powerType
            }
          })
          this.dialog.data = res.result.map(item => {
            return {
              children: item.children.map(_item => {
                return {
                  label: _item.powerName,
                  value: _item.id
                }
              }),
              label: item.powerName,
              value: item.id
            }
          })
        } else {
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.empty = !this.data.length ? '暂无数据' : ''
      })
    }
  }
}
</script>

<style scoped>
.menu-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
</style>
