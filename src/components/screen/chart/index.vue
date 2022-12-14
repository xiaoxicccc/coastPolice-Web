<template>

  <div class="chart-title-wrapper">

    <div class="chart-title">

      <span class="title">{{ title }}
      </span>

      <ul class="category-list">

        <li
          v-for="(item, i) in chartList"
          :class="['category-item', active === i ? 'active' : '']"
          :key="i"
          @click="changeType(item.value, i)">{{ item.label }}
        </li>

      </ul>

    </div>

    <div
      class="trawler-chart"
      :id="chartId">
    </div>

  </div>

</template>

<script>import Highcharts from 'highcharts/highstock'
import NoDataToDisplay from 'highcharts/modules/no-data-to-display'

NoDataToDisplay(Highcharts)
Highcharts.setOptions({
  lang: {
    noData: '暂无数据'
  }
})
export default {
  name: 'chart-title',
  data () {
    return {
      active: 2,
      chart: null
    }
  },
  props: {
    'chart-color': {
      default () {
        return [
          [0, 'rgba(24, 144, 255, .9)'],
          [1, 'rgba(30, 231, 231, .9)']
        ]
      },
      required: false,
      type: Array
    },
    'chart-data': {
      default () {
        return [
          ['01-12', 45],
          ['01-13', 4],
          ['01-14', 62],
          ['01-15', 59],
          ['01-16', 26],
          ['01-17', 37],
          ['01-18', 66],
          ['01-19', 5]
        ]
      },
      required: false,
      type: Array
    },
    'chart-id': {
      default: 'count',
      required: false,
      type: String
    },
    'chart-list': {
      default () {
        return [
          {
            label: '年',
            value: '年'
          },
          {
            label: '月',
            value: '月'
          },
          {
            label: '周',
            value: '周'
          }
        ]
      },
      required: false,
      type: Array
    },
    'chart-size': {
      default () {
        return {
          height: 205,
          width: 344
        }
      },
      required: false,
      type: Object
    },
    'chart-type': {
      default: 'column',
      required: false,
      type: String
    },
    title: {
      default: '船舶出入港数量变化趋势',
      required: false,
      type: String
    }
  },
  watch: {
    chartData: 'initChart'
  },
  created () {
    this.changeType('周', 2)
  },
  mounted () {
    this.initChart()
  },
  methods: {
    changeType (data, index) {
      this.active = index
      this.$emit('change-type', data)
    },
    initChart () {
      if (this.chart) {
        this.chart.destroy()
      }
      this.chart = Highcharts.chart(this.chartId, {
        chart: {
          backgroundColor: 'rgba(255, 255, 255, 0)',
          height: this.chartSize.height,
          spacingBottom: 0,
          spacingTop: 5,
          type: this.chartType,
          width: this.chartSize.width
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        noData: {
          style: {
            color: 'white',
            fontSize: '15px'
          }
        },
        plotOptions: {
          area: {
            marker: {
              enabled: false
            }
          }
        },
        series: [
          {
            borderColor: 'rgba(0, 0, 0, 0)',
            color: {
              linearGradient: { x1: 1, x2: 0, y1: 0, y2: 0 },
              stops: this.chartColor
            },
            data: this.chartData,
            name: '数量',
            pointWidth: 8
          }
        ],
        title: {
          text: null
        },
        tooltip: {
          enabled: true,
          pointFormat: '渔船数量: <b>{point.y}</b>'
        },
        xAxis: {
          labels: {
            // rotation: -45, // 设置轴标签旋转角度
            style: {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '10px'
            }
          },
          lineColor: '#0F4B6D',
          lineWidth: 1,
          type: 'category'
        },
        yAxis: {
          allowDecimals: false,
          labels: {
            // rotation: -45, // 设置轴标签旋转角度
            style: {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '10px'
            }
            // formatter: (point) => {
            //   return point.value.toFixed(0)
            // }
          },
          gridLineColor: '#0F4B6D',
          gridLineDashStyle: 'dash',
          min: 0,
          tickAmount: 3,
          title: {
            text: null
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.chart-title {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 14px;
}
.chart-title .title {
  color: rgba(230, 247, 255, 1);
  font-size: 16px;
}
/* LIST */
.category-list {
  align-items: center;
  color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: row;
}
.category-item {
  background-color: rgba(6, 55, 128, 1);
  border: 1px solid rgba(6, 55, 128, 1);
  cursor: pointer;
  height: 18px;
  line-height: 18px;
  text-align: center;
  width: 26px;
}
.category-item.active {
  border-color: rgba(56, 156, 236, 1);
}
/* Chart */
.trawler-chart {
}
</style>
