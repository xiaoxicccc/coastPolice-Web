<template>

  <div class="exchange-tasks">

    <app-filter
      :filter-items="items"
      :filter-model="model">
    </app-filter>

    <app-table
      :columns="columns"
      :data="data"
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
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'exchange-tasks',
  components: {
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: [
        {
          label: '任务名称',
          prop: 'name'
        },
        {
          label: '数据量(MB)',
          prop: 'size'
        },
        {
          label: '交换方式',
          prop: 'type'
        },
        {
          label: '交换时间',
          prop: 'time'
        },
        {
          label: '交换频率',
          prop: 'frequency'
        }
      ],
      data: [],
      items: [
        {
          label: '时间',
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
    this.initData()
  },
  methods: {
    handleCurrentChange () {
    },
    handleSizeChange () {
    },
    initData () {
      this.data = [
        {
          frequency: '一小时/次',
          name: 'AIS数据同步',
          size: 564,
          time: '2022-09-27 15:50:13',
          type: '接口同步'
        },
        {
          frequency: '一小时/次',
          name: '北斗数据同步',
          size: 1231,
          time: '2022-09-27 15:50:13',
          type: '接口同步'
        },
        {
          frequency: '一小时/次',
          name: '雷达数据同步',
          size: 982,
          time: '2022-09-27 15:50:13',
          type: '接口同步'
        },
        {
          frequency: '一小时/次',
          name: '雷达-AIS数据同步',
          size: 132,
          time: '2022-09-27 15:50:13',
          type: '接口同步'
        },
        {
          frequency: '一月/次',
          name: '监控信息数据同步',
          size: 19,
          time: '2022-09-01 10:00:00',
          type: '接口同步'
        },
        {
          frequency: '一月/次',
          name: '渔港信息数据同步',
          size: 23,
          time: '2022-08-01 10:00:00',
          type: '手动导入'
        },
        {
          frequency: '一月/次',
          name: '渔船档案信息数据同步',
          size: 477,
          time: '2022-08-01 10:00:00',
          type: '手动导入'
        }
      ]
      this.pager.total = this.data.length
    }
  }
}
</script>

<style scoped>
.exchange-tasks {
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
