<template>

  <div class="analysis-manage">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      ref="app-filter"
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

    <app-detail
      v-if="detail.visible"
      :detail="detail.data"
      :id="detail.id"
      :time="detail.time"
      @close="closeDetail"
      @update="initData">
    </app-detail>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  analysis
} from '../configs'
import appDetail from './detail'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'analysis-manage',
  components: {
    'app-detail': appDetail,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: analysis.columns.slice(),
      config: {
        type: 'index',
        width: 90
      },
      controls: [
        {
          label: '查看',
          prop: 'check',
          type: 'info'
        }
        // {
        //   keyname: 'status',
        //   label: '通知',
        //   power: true,
        //   prop: 'notice',
        //   type: 'primary',
        //   value: '待受理'
        // }
      ],
      data: [
      ],
      detail: {
        data: {},
        id: 0,
        time: new Date().getTime(),
        visible: false
      },
      items: analysis.items.slice(),
      model: Object.assign({}, analysis.model),
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      }
    }
  },
  created () {
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.model.time[1] = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    today.setDate(today.getDate() - 7)
    this.model.time[0] = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
  },
  mounted () {
    this.toggleItem()
    this.initData()
  },
  methods: {
    closeDetail () {
      this.detail.visible = false
    },
    handle (type, data) {
      switch (type) {
        case 'alarm-type':
          this.toggleItem(data.alarmType)
          break
        case 'check':
          this.detail.data = Object.assign({}, data)
          this.detail.id = data.id
          this.detail.time = new Date().getTime()
          this.detail.visible = true
          break
        case 'notice':
          this.toggleNoticeToApp(data)
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
      const query = this.$route.query
      switch (query.flag) {
        case 'never': {
          const today = new Date()
          today.setHours(today.getHours() + 8)
          this.$refs['app-filter'].model.time[0] = this.model.time[0] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1 00:00:00')
          break
        }
        case 'over': {
          this.$refs['app-filter'].model.time = this.model.time = ['', '']
          this.$refs['app-filter'].model.acceptState = this.model.acceptState = '2'
          break
        }
        default: {
          break
        }
      }
      const time = this.model.time || ['', '']
      // 设置跳转查询条件
      const params = new FormData()
      params.append('pageNo', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('beginAlarmTime', time[0])
      params.append('endAlarmTime', time[1])
      params.append('alarmType', this.model.alarmType)
      params.append('boatName', this.model.shipName || '')
      params.append('acceptState', this.model.acceptState)
      params.append('msgType', this.model.msgType)

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getAnalysisPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.map(item => {
            let status = ''
            switch (item.acceptState - 0) {
              case -1:
                status = '待通知'
                break
              case 0:
                status = '待受理'
                break
              case 1:
                status = '处理中'
                break
              case 2:
                status = '已处理'
                break
              case 3:
                status = '标记结束'
                break
              default:
                break
            }
            item.status = status
            return item
          })
          this.pager.total = res.result.total
        } else {
          this.pager.total = 0
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.$refs['app-table'].empty = !this.pager.total ? '暂无数据' : ''
        this.$router.push({
          path: '/admin/analysis-manage'
        })
      })
    },
    toggleItem (value) {
      // 置空查询条件
      this.model.msgType = ''
      let items = []
      switch (value) {
        case '围栏越界':
        case '越界捕捞':
        case '未报备出海':
          break
        default:
          items = ['报警来源']
          break
      }
      this.items = analysis.items.slice()
      items.forEach(item => {
        const index = this.items.findIndex(_item => _item.label === item)
        this.items.splice(index, 1)
      })
    },
    toggleNoticeToApp (data) {
      this.$confirm(`您确定将【${data.boatName}】发生的【${data.alarmType}】报警通知移动端处理吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)

        this.axios.post('', params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('操作成功！')
            this.initData()
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
.analysis-manage {
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
