<template>

  <div class="log-statistics">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <div id="log-chart">
    </div>

  </div>

</template>

<script>
import * as echarts from 'echarts'
import appFilter from '@/components/common/filter'
export default {
  name: 'log-statistics',
  components: {
    'app-filter': appFilter
  },
  data () {
    return {
      chart: null,
      items: [
        {
          label: '统计时间',
          prop: 'time',
          type: 'timerange'
        },
        {
          label: '统计类型',
          prop: 'type',
          type: 'select',
          options: [
            {
              label: '数据交换方式占比',
              value: '数据交换方式占比'
            },
            {
              label: '应用软件数据处理情况',
              value: '应用软件数据处理情况'
            },
            {
              label: '近七日数据处理情况',
              value: '近七日数据处理情况'
            },
            {
              label: '近七日数据类型',
              value: '近七日数据类型'
            },
            {
              label: '近七日数据交换情况',
              value: '近七日数据交换情况'
            }
          ]
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
        time: ['', ''],
        type: '近七日数据处理情况'
      },
      option: {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '已处理', '未处理', '暂不处理'],
            ['2022-03', 23.3, 65.8, 53.7],
            ['2022-04', 55.1, 78.4, 33.6],
            ['2022-05', 34.4, 44.2, 82.5],
            ['2022-06', 43.3, 85.8, 93.7],
            ['2022-07', 83.1, 73.4, 55.1],
            ['2022-08', 86.4, 65.2, 82.5],
            ['2022-09', 72.4, 53.9, 39.1]
          ]
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      }
    }
  },
  mounted () {
    this.initChart()
    window.onresize = () => {
      this.initChart()
    }
  },
  methods: {
    handle (type, data) {
    },
    initChart () {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      const dom = document.querySelector('#log-chart')
      this.chart = echarts.init(dom)
      this.chart.setOption(this.option)
    }
  }
}
</script>

<style scoped>
.log-statistics {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
#log-chart {
  flex-grow: 1;
}
</style>
