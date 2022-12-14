<template>

  <div class="data-growth">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <div id="growth-chart">
    </div>

  </div>

</template>

<script>
import appFilter from '@/components/common/filter'
import * as echarts from 'echarts'
export default {
  name: 'data-growth',
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
      option: {
        tooltip: {
          trigger: 'item'
        },
        xAxis: {
          type: 'time'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: null,
            type: 'line',
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              ['2022-01', 120],
              ['2022-02', 78],
              ['2022-03', 189],
              ['2022-04', 200],
              ['2022-05', 190],
              ['2022-06', 240],
              ['2022-07', 300],
              ['2022-08', 160],
              ['2022-09', 200]
            ]
          }
        ]
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
      const dom = document.querySelector('#growth-chart')
      this.chart = echarts.init(dom)
      this.chart.setOption(this.option)
    }
  }
}
</script>

<style scoped>
.data-growth {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
#growth-chart {
  flex-grow: 1;
}
</style>
