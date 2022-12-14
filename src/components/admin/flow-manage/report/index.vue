<template>

  <div class="report-manage">

    <app-filter
      ref="app-filter"
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <app-table
      :columns="columns"
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
      append-to-body
      :direction="drawer.direction"
      :visible.sync="drawer.visible"
      :with-header="false"
      size="1000px">

      <app-detail
        v-if="drawer.visible"
        :data="drawer.data"
        :id="drawer.id"
        @close="close">
      </app-detail>

    </el-drawer>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  report
} from '../configs'
import appDetail from './detail'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'report-manage',
  components: {
    'app-detail': appDetail,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: report.columns.slice(),
      controls: [
        {
          label: '查看',
          prop: 'check',
          type: 'info'
        }
      ],
      data: [],
      drawer: {
        data: {},
        id: -1,
        direction: 'rtl',
        visible: false
      },
      items: [
        {
          label: '船名号',
          prop: 'boatName',
          type: 'input'
        },
        {
          label: '船主姓名',
          prop: 'ownerName',
          type: 'input'
        },
        {
          label: '进出港状态',
          prop: 'type',
          type: 'select',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '进港',
              value: '进港'
            },
            {
              label: '出港',
              value: '出港'
            }
          ]
        },
        {
          label: '单位名称',
          prop: 'departName',
          type: 'autocomplete',
          options: [
          ]
        },
        {
          label: '出发港',
          prop: 'departureName',
          type: 'input'
        },
        {
          label: '目的地',
          prop: 'destinationName',
          type: 'input'
        },
        {
          label: '报备日期',
          clear: true, // 取反
          // picker: {
          //   disabledDate: time => {
          //     // 只能选择当前 6 月的时间
          //     const month = 30 * 24 * 3600 * 1000 * 6
          //     const start = this.$refs['app-filter'].model.time[0]
          //     const end = this.$refs['app-filter'].model.time[1]
          //     return time.getTime() > new Date(end).getTime() || time.getTime() < (new Date(start).getTime()) - month
          //   }
          // },
          prop: 'time',
          type: 'daterange'
        },
        {
          label: '',
          name: '查询',
          prop: 'query',
          style: 'primary-form',
          type: 'button'
        }
      ],
      model: {
        boatName: null,
        departName: null,
        departureName: null,
        destinationName: null,
        ownerName: null,
        time: ['', ''],
        type: ''
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
    this.initDepartData()
    // 默认开始时间
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.model.time[1] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1')
    today.setDate(today.getDate() - 1)
    this.model.time[0] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1')
    this.initData()
  },
  methods: {
    close () {
      this.drawer.visible = false
    },
    handle (type, data) {
      switch (type) {
        case 'check':
          this.drawer.visible = true
          this.drawer.data = Object.assign({}, data)
          this.drawer.id = data.id
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
      const time = this.model.time ? this.model.time : ['', '']
      if (!time[0] || !time[1]) {
        this.$message.warning('请选择报备日期！')
        return null
      }
      params.append('boatName', this.model.boatName || '')
      params.append('ownerName', this.model.ownerName || '')
      params.append('type', this.model.type || '')
      params.append('departName', this.model.departName || '')
      params.append('departureName', this.model.departureName || '')
      params.append('destinationName', this.model.destinationName || '')
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('beginTime', time[0])
      params.append('endTime', time[1])

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getReportPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.slice()
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
      })
    },
    initDepartData () {
      const params = new FormData()
      this.axios.post(api.getDepartList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const index = this.items.findIndex(item => item.prop === 'departName')
          this.items[index].options = res.result.map(item => {
            return {
              label: item.label,
              value: item.label
            }
          })
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
.report-manage {
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
