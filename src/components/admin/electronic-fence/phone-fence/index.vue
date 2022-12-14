<template>

  <div class="phone-fence">

    <app-filter
      :filter-items="items"
      :filter-model="model"
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
  name: 'phone-fence',
  components: {
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: [
        {
          label: '手机号',
          prop: 'phone'
        },
        {
          label: '设备编码',
          prop: 'equipmentCode'
        },
        {
          label: 'imsi码',
          prop: 'imsi'
        },
        {
          label: '经度',
          prop: 'longitude'
        },
        {
          label: '纬度',
          prop: 'latitude'
        },
        {
          label: '采集时间',
          prop: 'acquisitionTime'
        }
      ],
      data: [
      ],
      items: [
        {
          label: '手机号',
          prop: 'phone',
          type: 'input'
        },
        {
          label: '设备编码',
          prop: 'equipmentCode',
          type: 'input'
        },
        {
          label: 'imsi码',
          prop: 'imsi',
          type: 'input'
        },
        {
          clear: true, // 对该字段取反限制不可清空
          label: '采集时间',
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
        equipmentCode: null,
        imsi: null,
        phone: null,
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
  mounted () {
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
      this.model.time[1] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1 $2')
      today.setDate(today.getDate() - 1)
      this.model.time[0] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1 $2')
    },
    initData () {
      const params = new FormData()
      const time = this.model.time ? this.model.time : ['', '']
      params.append('beginTime', time[0])
      params.append('endTime', time[1])
      params.append('phone', this.model.phone || '')
      params.append('imsi', this.model.imsi || '')
      params.append('equipmentCode', this.model.equipmentCode || '')
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getPhoneFencePage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records
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
.phone-fence {
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
