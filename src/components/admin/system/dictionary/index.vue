<template>

  <div class="dictionary-manage">

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
        :width="150">

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

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pager.current"
      :page-sizes="pager.sizes"
      :page-size="pager.size"
      :layout="pager.layout"
      :total="pager.total"
      style="margin-top: 20px;">
    </el-pagination>

    <app-dialog
      v-if="dialog.visible"
      :config="dialog.config"
      title="字典新增"
      @close="close">

      <app-detail
        v-if="dialog.visible"
        :parent-id="dialog.parentId"
        @close="close">
      </app-detail>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  dictionary
} from '../configs'

import appDetail from './detail'
import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'

export default {
  name: 'dictionary-manage',
  components: {
    'app-detail': appDetail,
    'app-dialog': appDialog,
    'app-filter': appFilter
  },
  data () {
    return {
      columns: dictionary.columns.slice(),
      controls: [
        {
          key: 'root',
          label: '新增',
          power: true,
          prop: 'insert',
          value: true,
          type: 'success'
        },
        // {
        //   label: '修改',
        //   prop: 'update',
        //   type: 'warning'
        // },
        {
          label: '删除',
          prop: 'delete',
          type: 'danger'
        }
      ],
      data: [],
      dialog: {
        config: {
          height: 450,
          width: 400
        },
        parentId: '',
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
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
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
        this.handleCurrentChange(1)
      }
    },
    deleteRow (data) {
      // eslint-disable-next-line
      if (data.children && data.children.length) {
        this.$message.warning('该字典存在子节点，请勿删除！')
        return
      }
      this.$confirm('您确定删除该子节点吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)

        this.axios.post(api.deleteDictionary, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('删除成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '删除失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.log(err)
        })
      }).catch(() => {
      })
    },
    handle (type, data) {
      switch (type) {
        case 'delete':
          this.deleteRow(data)
          break
        case 'insert':
          this.dialog.visible = true
          if (data) {
            this.dialog.parentId = data.id
          } else {
            this.dialog.parentId = '1'
          }
          break
        case 'query':
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        default:
          break
      }
    },
    handleCurrentChange (e) {
      this.pager.current = e
      this.initData()
    },
    handleSizeChange (e) {
      this.pager.size = e
      this.handleCurrentChange(1)
    },
    initData () {
      const params = new FormData()
      params.append('curPage', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('keyword', this.model.keyword || '')

      this.data = []
      // 数据加载中
      this.empty = '数据加载中...'
      this.axios.post(api.getDictionaryPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.map(item => {
            return {
              children: item.children.map(_item => {
                return {
                  id: _item.id,
                  name: _item.dictName,
                  parentId: _item.parentId,
                  remark: _item.remark,
                  root: false,
                  sort: _item.sort,
                  value: _item.dictValue
                }
              }),
              id: item.id,
              name: item.dictName,
              parentId: item.parentId,
              remark: item.remark,
              root: true,
              sort: item.sort,
              value: item.dictValue
            }
          })
          this.pager.total = res.result.total
        } else {
          this.pager.total = 0
          this.$message.error(res.msg || '字典查询失败！')
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.empty = !this.pager.total ? '暂无数据' : ''
      })
    }
  }
}
</script>

<style scoped>
.dictionary-manage {
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
