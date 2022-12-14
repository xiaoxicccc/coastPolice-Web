<template>

  <div class="account-manage">

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
        :id="dialog.id"
        :roles="roles"
        :status="dialog.status"
        @close="close">
      </app-detail>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import appDetail from './detail'
import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
import {
  account
} from '../configs'

export default {
  name: 'account-manage',
  components: {
    'app-detail': appDetail,
    'app-dialog': appDialog,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      config: {
        type: 'index',
        width: 220
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
          label: '重置密码',
          prop: 'reset',
          type: 'info'
        }
        // {
        //   label: '删除',
        //   prop: 'delete',
        //   type: 'danger'
        // }
      ],
      columns: account.columns.slice(),
      data: [],
      dialog: {
        config: {
          height: 540,
          width: 600
        },
        id: '',
        status: '',
        title: '账号信息',
        visible: false
      },
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
      },
      roles: [
      ]
    }
  },
  mounted () {
    this.initData()
    // 获取角色信息
    this.initRoleData()
  },
  methods: {
    close (visible) {
      this.dialog.visible = false
      if (visible) {
        this.handleCurrentChange(1)
      }
    },
    deleteRow (data) {
      this.$confirm(`您确定删除【${data.username}】账号吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)

        this.axios.post(api.deleteAccount, params, { loading: true }).then(response => {
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
      switch (type) {
        case 'check':
        case 'update':
          this.dialog.visible = true
          this.dialog.id = data.id
          this.dialog.status = type
          break
        case 'delete':
          this.deleteRow(data)
          break
        case 'insert':
          this.dialog.visible = true
          this.dialog.id = ''
          this.dialog.status = type
          break
        case 'query':
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        case 'reset':
          this.resetPassword(data)
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
      params.append('keyword', this.model.keyword || '')
      params.append('curPage', this.pager.current)
      params.append('pageSize', this.pager.size)

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getAccountPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.slice()
          this.pager.total = res.result.total
        } else {
          this.pager.total = 0
          this.$message.error(res.msg || '账号列表查询失败！')
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.$refs['app-table'].empty = !this.pager.total ? '暂无数据' : ''
      })
    },
    initRoleData () {
      const params = new FormData()

      this.axios.post(api.getRolesList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.roles = res.result.map(item => {
            return {
              label: item.roleName,
              value: item.id
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    /**
     * 密码重置功能
     * @param e 当前行信息
     */
    resetPassword (e) {
      console.log(e)
      this.$confirm(`您确定要为用户名【${e.username}】的用户重置密码吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // todo...
        const params = new FormData()
        params.append('id', e.id)

        this.axios.post(api.resetPassword, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$notify({
              duration: 1000 * 5,
              title: '成功',
              message: '密码已重置为123456',
              type: 'success'
            })
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
.account-manage {
  background-color: #f4f5f7;
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
