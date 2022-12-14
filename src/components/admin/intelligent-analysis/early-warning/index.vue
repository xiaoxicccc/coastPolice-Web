<template>

  <div class="early-warning">

    <el-form
      class="early-warning-form form"
      :model="model"
      size="small">

      <el-form-item
        v-for="(item, i) in items"
        class="early-warning-item"
        :key="i"
        :label="item.label">

        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          @change="toggleTimeRange">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

        <el-date-picker
          v-if="item.type === 'daterange'"
          v-model="model[item.prop]"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          @focus="changeDate">
        </el-date-picker>

        <span
          v-if="item.type === 'button'"
          class="button"
          :role="item.style"
          @click="handle(item.prop)">{{ item.name }}
        </span>

      </el-form-item>

    </el-form>

    <div class="early-warning-chart">

      <div class="early-warning-line">

        <div class="early-warning-title">

          <span class="early-warning-circle"></span>

          <span class="early-warning-name">预警趋势变化</span>

        </div>

        <div id="line-chart">
        </div>

      </div>

      <div class="early-warning-bar">

        <div class="early-warning-title">

          <span class="early-warning-circle"></span>

          <span class="early-warning-name">预警数量对比</span>

        </div>

        <div id="bar-chart">
        </div>

      </div>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import * as echarts from 'echarts'
import Highcharts from 'highcharts/highstock'
import NoDataToDisplay from 'highcharts/modules/no-data-to-display'

NoDataToDisplay(Highcharts)
Highcharts.setOptions({
  lang: {
    noData: '暂无数据'
  }
})
export default {
  name: 'early-warning',
  data () {
    return {
      bar: {
        chart: null,
        data: [],
        legend: [],
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
              radius: ['20%', '50%'],
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
              ]
            }
          ]
        }
      },
      dateMap: {
        周: 1000 * 60 * 60 * 24 * 7,
        月: 1000 * 60 * 60 * 24 * 30,
        年: 1000 * 60 * 60 * 24 * 365
      },
      items: [
        {
          label: '时间选择',
          prop: 'quickType',
          type: 'select',
          options: [
            {
              label: '当天时间',
              value: '当天时间'
            },
            {
              label: '近一周',
              value: '周'
            },
            {
              label: '近一个月',
              value: '月'
            },
            {
              label: '近一年',
              value: '年'
            }
          ]
        },
        {
          label: '时间',
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
      line: {
        chart: null,
        data: []
      },
      model: {
        quickType: '周',
        time: ['', '']
      }
    }
  },
  mounted () {
    this.toggleTimeRange('周')
    this.initLineData()
    this.initBarData()

    window.onresize = () => {
      this.initBarChart()
    }
  },
  methods: {
    changeDate () {
      this.model.quickType = ''
    },
    handle (type) {
      switch (type) {
        case 'query':
          this.initLineData()
          this.initBarData()
          break
        default:
          break
      }
    },
    initBarChart () {
      if (this.bar.chart) {
        this.bar.chart.dispose()
        this.bar.chart = null
      }
      const dom = document.querySelector('#bar-chart')
      this.bar.chart = echarts.init(dom)
      this.bar.chart.setOption(this.bar.option)
    },
    initBarData () {
      this.initBarChart()
      const time = this.model.time
      const params = new FormData()
      params.append('beginTime', time ? time[0] : '')
      params.append('endTime', time ? time[1] : '')
      params.append('timeInterval', this.model.quickType === '当天时间' ? '' : this.model.quickType)

      this.axios.post(api.getAnalysisProportionData, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.bar.data = res.result.map(item => {
            this.bar.legend.push(item.alarmType)
            return {
              name: item.alarmType,
              value: item.num
            }
          })
          this.updateBarChart()
        } else {
          this.$message.error(res.msg || '预警数量对比数据查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    initLineChart () {
      if (this.line.chart) {
        this.line.chart.destroy()
        this.line.chart = null
      }
      this.line.chart = Highcharts.chart('line-chart', {
        chart: {
          backgroundColor: 'transparent',
          type: 'spline'
        },
        credits: {
          enabled: false
        },
        legend: {
          verticalAlign: 'top'
        },
        title: {
          text: null
        },
        subtitle: {
          text: null
        },
        tooltip: {
          shared: true,
          dateTimeLabelFormats: {
            hour: '%Y-%m-%e',
            day: '%Y-%m-%e',
            minute: '%Y-%m-%e',
            second: '%Y-%m-%e'
          }
        },
        xAxis: {
          dateTimeLabelFormats: {
            day: '%m-%d',
            month: '%m-%d',
            week: '%m-%d',
            year: '%Y-%m'
          },
          type: 'datetime',
          title: {
            text: null
          }
        },
        colors: ['#6CF', '#39F', '#06C', '#036', '#000', '#f00', '#ff0'],
        yAxis: {
          title: {
            text: null
          },
          min: 0
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: true
            }
          }
        },
        series: this.line.data
      })
    },
    initLineData () {
      const time = this.model.time
      const params = new FormData()
      params.append('beginTime', time ? time[0] : '')
      params.append('endTime', time ? time[1] : '')
      params.append('timeInterval', this.model.quickType === '当天时间' ? '' : this.model.quickType)

      this.axios.post(api.getAnalysisTrendData, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = []
          const legend = []
          const result = res.result || []
          result.forEach((item, i) => {
            legend.push(item.name)
            data.push({
              name: item.alarmType,
              data: []
            })
            if (item.data.length) {
              item.data.forEach((_item) => {
                const time = new Date(_item.alarmTime).getTime()
                data[i].data.push([time, _item.num - 0])
              })
            }
          })
          this.line.data = data
          this.initLineChart()
        } else {
          this.$message.error(res.msg || '预警趋势变化数据查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    toggleTimeRange (e) {
      const value = this.dateMap[e]
      const _today = new Date()
      _today.setHours(_today.getHours() + 8)

      let start = _today.toJSON()
        .replace(/T/, ' ')
        .replace(/\..*/, '')
      let end = _today.toJSON()
        .replace(/T/, ' ')
        .replace(/\..*/, '')

      if (value) {
        const _target = new Date(start)
        _target.setHours(_target.getHours() + 8)
        _target.setTime(_target.getTime() - value)

        end = start
        start = _target.toJSON()
          .replace(/T/, ' ')
          .replace(/\..*/, '')
      } else { // 当天时间
        start = _today.toJSON().replace(/T.+/, ' 00:00:00')
      }
      this.model.time = [start, end]
      this.bar.legend = []
      this.bar.data = []
      this.line.data = []
      this.initLineData()
      this.initBarData()
    },
    updateBarChart () {
      this.bar.option.legend.data = this.bar.legend
      this.bar.option.series[0].data = this.bar.data
      this.bar.chart.setOption(this.bar.option)
    }
  }
}
</script>

<style scoped>
.early-warning {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
/* FORM */
.early-warning-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 0;
}
.early-warning-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px !important;
  margin-right: 20px!important;
}
/* CHART */
.early-warning-chart {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
/* LINE */
.early-warning-line {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding-right: 15px;
  width: 60%;
}
/* BAR */
.early-warning-bar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  width: 40%;
}
/* TITLE */
.early-warning-title {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  margin-bottom: 10px;
}
.early-warning-circle {
  background-color: #409EFF;
  border-radius: 5px;
  height: 10px;
  margin-right: 5px;
  width: 10px;
}
.early-warning-name {
  font-size: 14px;
}
/* CHART */
#line-chart,
#bar-chart {
  flex-grow: 1;
}
</style>
