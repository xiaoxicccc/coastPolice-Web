<template>

  <div class="distinguish">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      ref="app-filter"
      @handle="handle">
    </app-filter>

    <app-table
      :columns="columns"
      :data="data"
      ref="app-table"
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

  </div>

</template>

<script>
import api from '@/util/api'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'distinguish',
  components: {
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: [
        {
          label: '船名号',
          prop: 'boatName'
        },
        {
          label: '船主姓名',
          prop: 'ownerName'
        },
        {
          label: '单位名称',
          prop: 'departName'
        },
        {
          label: '进出港状态',
          prop: 'type'
        },
        {
          label: '进出港时间',
          prop: 'recordTimes'
        }
      ],
      data: [],
      items: [
        {
          label: '船名号',
          prop: 'boatName',
          type: 'input'
        },
        {
          label: '单位名称',
          prop: 'departName',
          type: 'autocomplete',
          options: [
          ]
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
          label: '进出港日期',
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
    this.handleTime()
    this.initData()
  },
  methods: {
    handle (type, data) {
      switch (type) {
        case 'query': {
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        }
        default: {
          break
        }
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
    handleTime () {
      const today = new Date()
      today.setHours(today.getHours() + 8)
      this.model.time[1] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1')
      today.setDate(today.getDate() - 1)
      this.model.time[0] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1')
    },
    initData () {
      const params = new FormData()
      const time = this.model.time ? this.model.time : ['', '']
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('beginTime', time[0])
      params.append('endTime', time[1])
      params.append('boatName', this.model.boatName || '')
      params.append('departName', this.model.departName || '')
      params.append('type', this.model.type)

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getDistinguishPage, params).then(response => {
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
.distinguish {
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
