<template>

  <div class="equipment-disconnection">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <div class="chart-wrapper">

      <div class="trend-mode">

        <div class="title">掉线趋势
        </div>

        <div id="trend-chart">
        </div>

      </div>

      <div class="reason-mode">

        <div class="title">掉线原因占比
        </div>

        <div id="reason-chart">
        </div>

      </div>

    </div>

  </div>

</template>

<script>
import appFilter from '@/components/common/filter'
import * as echarts from 'echarts'
export default {
  name: 'equipment-disconnection',
  components: {
    'app-filter': appFilter
  },
  data () {
    return {
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
      reason: {
        chart: null,
        option: {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: null,
              type: 'pie',
              radius: ['20%', '60%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                position: 'outside',
                show: true
              },
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
                {
                  name: '设备拆卸',
                  value: 20
                },
                {
                  name: '设备断电',
                  value: 16
                },
                {
                  name: '设备落水',
                  value: 7
                },
                {
                  name: '未安装',
                  value: 30
                }
              ]
            }
          ]
        }
      },
      trend: {
        chart: null,
        data: [],
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
                ['2022-05', 19],
                ['2022-06', 24],
                ['2022-07', 30],
                ['2022-08', 16],
                ['2022-09', 20]
              ]
            }
          ]
        }
      }
    }
  },
  mounted () {
    this.initTrendChart()
    this.initReasonChart()
    window.onresize = () => {
      this.initTrendChart()
      this.initReasonChart()
    }
  },
  methods: {
    handle (type, data) {
      switch (type) {
        case 'query':
          this.initTrendChart()
          this.initReasonChart()
          break
        default:
          break
      }
    },
    initReasonChart () {
      if (this.reason.chart) {
        this.reason.chart.dispose()
        this.reason.chart = null
      }
      const dom = document.querySelector('#reason-chart')
      this.reason.chart = echarts.init(dom)
      this.reason.chart.setOption(this.reason.option)
    },
    initTrendChart () {
      if (this.trend.chart) {
        this.trend.chart.dispose()
        this.trend.chart = null
      }
      const dom = document.querySelector('#trend-chart')
      this.trend.chart = echarts.init(dom)
      this.trend.chart.setOption(this.trend.option)
    }
  }
}
</script>

<style scoped>
.equipment-disconnection {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
/* WRAPPER */
.chart-wrapper {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
.chart-wrapper > div {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 50%;
}
.chart-wrapper > div .title {
  border-left: 3px solid #167fff;
  box-sizing: border-box;
  padding-left: 10px;
  text-align: left;
}
/* CHART */
#trend-chart,
#reason-chart {
  height: 100%;
  width: 100%;
}
</style>
