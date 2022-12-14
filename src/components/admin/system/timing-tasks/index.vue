<template>

  <div class="timing-tasks">

    <app-filter
      :filter-model="model"
      :filter-items="items"
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

    <el-drawer
      :direction="drawer.direction"
      :size="700"
      :visible.sync="drawer.visible"
      :with-header="false">

      <app-detail
        v-if="drawer.visible"
        :data="detail.data"
        :id="detail.id"
        :status="detail.status"
        @close="close">
      </app-detail>

    </el-drawer>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  tasks
} from '../configs'
import appDetail from './detail'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'timing-tasks',
  components: {
    'app-detail': appDetail,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: tasks.columns.slice(),
      config: {
        type: 'index',
        width: 260
      },
      controls: [
        {
          keyname: 'status',
          label: '暂停',
          power: true,
          prop: 'suspend',
          type: 'warning',
          value: '0'
        },
        {
          keyname: 'status',
          label: '启动',
          power: true,
          prop: 'start-up',
          type: 'success',
          value: '1'
        },
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
      data: [
      ],
      detail: {
        data: {
        },
        id: 0,
        status: 'insert'
      },
      drawer: {
        direction: 'rtl',
        visible: false
      },
      items: [
        {
          label: '任务名称',
          prop: 'jobName',
          type: 'input'
        },
        {
          label: '任务组名',
          prop: 'jobGroup',
          type: 'select',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '系统',
              value: 'SYSTEM'
            },
            {
              label: '默认',
              value: 'DEFAULT'
            }
          ]
        },
        {
          label: '任务状态',
          prop: 'status',
          type: 'select',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '正常',
              value: '0'
            },
            {
              label: '暂停',
              value: '1'
            }
          ]
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
        jobGroup: '',
        jobName: null,
        status: ''
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
      this.drawer.visible = false
      switch (visible) {
        case 'insert':
          this.handleCurrentChange(1)
          break
        case 'update':
          this.initData()
          break
        default:
          break
      }
    },
    deleteRow (data) {
      this.$confirm(`您确定要删除定时任务【${data.jobName}】吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)

        this.axios.post(api.deleteTimingTasks, params, { loading: true }).then(response => {
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
          this.detail.data = Object.assign({}, data)
          this.detail.id = data.id
          this.drawer.visible = true
          this.detail.status = type
          break
        case 'delete':
          this.deleteRow(data)
          break
        case 'insert':
          this.detail.data = {}
          this.detail.id = 0
          this.drawer.visible = true
          this.detail.status = type
          break
        case 'query':
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        case 'start-up':
        case 'suspend':
          this.toggleStatus(type, data)
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
      params.append('pageIndex', this.pager.current)
      params.append('pageSize', this.pager.size)
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getTimingTasksPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const groupMap = {
            DEFAULT: '默认',
            SYSTEM: '系统'
          }
          const strategyMap = ['默认', '立即触发执行', '触发一次执行', '不触发立即执行']
          this.data = res.result.records.map(item => {
            item.state = item.status - 0 ? '暂停' : '正常'
            item.group = groupMap[item.jobGroup]
            item.strategy = strategyMap[item.misfirePolicy - 0]
            return item
          })
          this.pager.total = res.result.total
        } else {
          this.pager.total = 0
          this.$message.error(res.msg || '定时任务列表数据查询失败！')
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.$refs['app-table'].empty = !this.pager.total ? '暂无数据' : ''
      })
    },
    toggleStatus (type, data) {
      let message = ''
      if (type === 'suspend') {
        message = '暂停'
      } else {
        message = '启动'
      }
      this.$confirm(`您确定要${message}定时任务【${data.jobName}】吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)
        params.append('status', data.status - 0 ? 0 : 1)

        this.axios.post(api.toggleTimingTasksStatus, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.initData()
            this.$message.success('操作成功！')
          } else {
            this.$message.error(res.msg || '操作失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
.timing-tasks {
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
