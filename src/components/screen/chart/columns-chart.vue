<template>

  <div
    class="chart-title-wrapper">

    <!-- LOADING -->
    <div
      v-show="loading"
      class="chart-loading">

      <i class="el-icon-loading icon-loading">
      </i>

    </div>

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
export default {
  name: 'columns',
  data () {
    return {
      active: 3,
      chart: null,
      loading: true
    }
  },
  props: {
    categories: {
      default () {
        return ['05-12', '05-13', '05-14', '05-15', '05-166', '05-17']
      },
      required: false,
      type: Array
    },
    'chart-color': {
      default () {
        return [
          [
            [0, 'rgba(24, 144, 255, .9)'],
            [1, 'rgba(30, 231, 231, .9)']
          ],
          [
            [0, 'rgba(144, 238, 144, .9)'],
            [1, 'rgba(255, 215, 0, .9)']
          ]
        ]
      },
      required: false,
      type: Array
    },
    'chart-data': {
      default () {
        return [
          {
            name: '进港',
            data: [45, 6, 3, 2, 34, 12]
          },
          {
            name: '出港',
            data: [34, 16, 13, 22, 4, 2]
          }
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
    date: {
      default: 0,
      required: true,
      type: Number
    },
    title: {
      default: '船舶出入港数量变化趋势',
      required: false,
      type: String
    }
  },
  watch: {
    // date: 'initChart'
  },
  created () {
  },
  mounted () {
    this.changeType('周', 3)
    // this.initChart()
  },
  methods: {
    changeType (data, index) {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
      this.active = index
      this.$emit('change-type', data)
    },
    initChart () {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
      // 处理图表数据
      const series = []
      this.chartData.forEach((item, i) => {
        series.push({
          borderColor: 'rgba(0, 0, 0, 0)',
          color: {
            linearGradient: { x1: 1, x2: 0, y1: 0, y2: 0 },
            stops: this.chartColor[i]
          },
          data: item.data,
          name: item.name,
          pointWidth: 8
        })
      })

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
        series: series,
        title: {
          text: null
        },
        tooltip: {
          enabled: true,
          pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        xAxis: {
          categories: this.categories,
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
    },
    initChartEnd (visible) {
      if (!visible) {
        NoDataToDisplay(Highcharts)
        Highcharts.setOptions({
          lang: {
            noData: '暂无数据'
          }
        })
      }
      this.initChart()
    }
  }
}
</script>

<style scoped>
.chart-title-wrapper {
  height: 240px;
  position: relative;
}
/* LOADING */
.chart-loading {
  background-color: rgba(0, 0, 0, 0);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
.icon-loading {
  color: #409eff;
  font-size: 32px;
  left: 45%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
/* CHART_TITLE */
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
