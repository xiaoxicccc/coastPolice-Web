<template>

  <div class="role-manage">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <app-table
      :columns="columns"
      :config="config"
      :controls="controls"
      :data="data"
      ref="app-table"
      @handle="handle"
      style="height: calc(100% - 120px);">
    </app-table>

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
      :title="dialog.title"
      @close="close">

      <app-detail
        v-if="dialog.visible"
        :id="dialog.id"
        :detail="dialog.detail"
        :status="dialog.status"
        @close="close">
      </app-detail>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  role
} from '../configs'
import appDetail from './detail'
import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'role-manage',
  components: {
    'app-detail': appDetail,
    'app-dialog': appDialog,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: role.columns.slice(),
      config: {
        type: 'index',
        width: 190
      },
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
          height: 450,
          width: 450
        },
        detail: {},
        id: '',
        status: '',
        title: '角色新增',
        visible: false
      },
      items: [
        {
          label: '关键词',
          prop: 'roleName',
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
        roleName: null
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
        this.initData()
      }
    },
    deleteRow (data) {
      this.$confirm(`您确定删除【${data.roleName}】角色吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)

        this.axios.post(api.deleteRole, params, { loading: true }).then(response => {
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
          this.dialog.detail = Object.assign({}, data)
          this.dialog.title = '角色查看'
          break
        case 'delete':
          this.deleteRow(data)
          break
        case 'insert':
          this.dialog.visible = true
          this.dialog.id = ''
          this.dialog.detail = {}
          this.dialog.title = '角色新增'
          break
        case 'query':
          this.model = Object.assign({}, data)
          this.initData()
          break
        case 'update':
          this.dialog.visible = true
          this.dialog.id = data.id
          this.dialog.detail = Object.assign({}, data)
          this.dialog.title = '角色修改'
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
      params.append('roleName', this.model.roleName || '')
      params.append('curPage', this.pager.current)
      params.append('pageSize', this.pager.size)

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getRolesPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.slice()
          this.pager.total = res.result.total
        } else {
          this.pager.total = 0
          this.$message.error(res.msg || '角色列表查询失败！')
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.$refs['app-table'].empty = !this.pager.total ? '暂无数据' : ''
      })
    }
  }
}
</script>

<style scoped>
.role-manage {
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
