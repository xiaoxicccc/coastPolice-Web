<template>

  <div class="log-manage">

    <app-filter
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
      :visible="drawer.visible"
      :with-header="false"
      size="700px">

      <app-detail
        v-if="drawer.visible"
        :data="drawer.detail"
        @close="close">
      </app-detail>

    </el-drawer>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  log
} from '../configs'

import appDetail from './detail'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'log-manage',
  components: {
    'app-detail': appDetail,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: log.columns.slice(),
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
      ],
      data: [],
      drawer: {
        detail: {},
        direction: 'rtl',
        visible: false
      },
      items: [
        {
          label: '模块名称',
          prop: 'moduleName',
          type: 'input'
        },
        {
          label: '操作人',
          prop: 'operateMan',
          type: 'input'
        },
        {
          label: '操作时间',
          prop: 'time',
          type: 'timerange'
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
        moduleName: null,
        operateMan: null,
        time: ['', '']
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
  created () {
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.model.time[1] = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    today.setDate(today.getDate() - 1)
    this.model.time[0] = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
  },
  mounted () {
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
          this.drawer.detail = Object.assign({}, data)
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
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('moduleName', this.model.moduleName || '')
      params.append('operateMan', this.model.operateMan || '')
      params.append('beginTime', time[0])
      params.append('endTime', time[1])

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getLogPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.map(item => {
            // const data = new Date(item.operateTime)
            // data.setHours(data.getHours() + 8)
            item.operateTime = item.operateTime.replace(/T/, ' ').replace(/\..*/, '')
            return item
          })
          this.pager.total = res.result.total
        } else {
          this.$message.error(res.msg || '查询失败！')
          this.pager.total = 0
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        this.pager.total = 0
        console.error(err)
      }).finally(() => {
        this.$refs['app-table'].empty = !this.pager.total ? '暂无数据' : ''
      })
    }
  }
}
</script>

<style scoped>
.log-manage {
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
