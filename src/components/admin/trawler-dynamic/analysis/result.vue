<template>

  <div>

    <app-dialog
      :config="config"
      title="区域分析"
      @close="close">

      <div class="analysis-result">

        <el-form
          class="analysis-result-form"
          :model="model"
          ref="analysis-result-form"
          :rules="rules"
          size="small">

          <el-form-item
            v-for="(item, i) in items"
            class="analysis-result-item"
            :key="i"
            :label="item.label"
            :prop="item.prop">

            <el-input
              v-if="item.type === 'input'"
              v-model="model[item.prop]"
              :readonly="item.readonly"
              type="text"
              style="width: 190px;">
            </el-input>

            <el-date-picker
              v-if="item.type === 'datetime'"
              v-model="model[item.prop]"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 190px;">
            </el-date-picker>

          </el-form-item>

          <div class="form control analysis-result-control">

            <span
              class="button"
              role="primary-form"
              @click="validate">查询
            </span>

          </div>

        </el-form>

        <div class="chart-container">

          <div class="chart-item">

            <div>流量分析
            </div>

            <div id="flow-chart">
            </div>

          </div>

          <div class="chart-item">

            <div>作业分析
            </div>

            <div id="work-chart">
            </div>

          </div>

        </div>

        <div style="height: 500px;">

          <app-table
            :columns="columns"
            :data="datas">
          </app-table>

        </div>

      </div>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import appDialog from '@/components/common/dialog'
import appTable from '@/components/common/table'
import * as echarts from 'echarts'
export default {
  name: 'analysis-result',
  components: {
    'app-dialog': appDialog,
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
          label: '设备类型',
          prop: 'msgType'
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
          label: '定位时间',
          prop: 'gpsTime'
        },
        {
          label: '船舶用途',
          prop: 'usageName'
        }
      ],
      config: {
        height: 580,
        width: 1000
      },
      datas: [
      ],
      flow: {
        chart: null,
        option: {
          legend: {
            data: ['流量']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [],
              name: '流量',
              type: 'bar'
            }
          ]
        }
      },
      items: [
        {
          label: '标注名称',
          prop: 'markName',
          readonly: true,
          type: 'input'
        },
        {
          label: '标注类别',
          prop: 'areaType',
          readonly: true,
          type: 'input'
        },
        {
          label: '开始时间',
          prop: 'startData',
          readonly: false,
          type: 'datetime'
        },
        {
          label: '结束时间',
          prop: 'endData',
          readonly: false,
          type: 'datetime'
        }
      ],
      model: {
        areaType: null,
        endData: null,
        markName: null,
        points: null,
        startData: null
      },
      rules: {
        endData: [
          { required: true, message: '结束时间 未选择', trigger: 'change' }
        ],
        startData: [
          { required: true, message: '开始时间 未选择', trigger: 'change' }
        ]
      },
      work: {
        chart: null,
        option: {
          color: ['#FFFF00', '#91cc75', '#fac858', '#ee6666',
            '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
            '#ea7ccc', '#00FF7F', '#F08080', '#5470c6'],
          grid: {
            top: 90
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: [],
            // type: 'scroll',
            top: 0
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
          ]
        },
        map: {
          gyNum: {
            data: [],
            label: '供应数量'
          },
          hyNum: {
            data: [],
            label: '货运数量'
          },
          kyNum: {
            data: [],
            label: '客运数量'
          },
          lcjgNum: {
            data: [],
            label: '冷藏加工数量'
          },
          lyNum: {
            data: [],
            label: '旅游数量'
          },
          qsNum: {
            data: [],
            label: '取沙数量'
          },
          qtNum: {
            data: [],
            label: '其他数量'
          },
          scyxNum: {
            data: [],
            label: '水产运销数量'
          },
          scyzNum: {
            data: [],
            label: '水产养殖数量'
          },
          wxNum: {
            data: [],
            label: '维修数量'
          },
          yggcNum: {
            data: [],
            label: '渔港工程数量'
          },
          yyblNum: {
            data: [],
            label: '渔业捕捞数量'
          }
        }
      }
    }
  },
  props: {
    data: {
      default () {
        return {
        }
      },
      required: false,
      type: Object
    },
    id: {
      default: 0,
      required: false,
      type: Number
    }
  },
  watch: {
    id: 'initData'
  },
  mounted () {
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.model.endData = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    today.setDate(today.getDate() - 1)
    this.model.startData = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    this.initData()
    // 加载柱状图
    // this.initChart()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    formatData (data) {
      // 数据清空
      this.work.option.xAxis[0].data = []
      Object.keys(this.work.map).forEach(key => {
        this.work.map[key].data = []
      })
      this.work.option.legend.data = []
      this.work.option.series = []

      data.forEach(item => {
        this.work.option.xAxis[0].data.push(item.dateTime)
        Object.keys(this.work.map).forEach(key => {
          this.work.map[key].data.push(item[key] - 0)
        })
      })

      Object.keys(this.work.map).forEach(key => {
        this.work.option.legend.data.push(this.work.map[key].label)
        this.work.option.series.push(
          {
            name: this.work.map[key].label,
            type: 'bar',
            barGap: 0,
            emphasis: {
              focus: 'series'
            },
            data: this.work.map[key].data
          })
      })
    },
    initChart (flows, works) {
      // 加载流量数据
      if (this.flow.chart) {
        this.flow.chart.dispose()
        this.flow.chart = null
      }
      this.flow.option.xAxis.data = []
      this.flow.option.series[0].data = []
      flows.forEach(item => {
        this.flow.option.xAxis.data.push(item.dateTime)
        this.flow.option.series[0].data.push(item.num - 0)
      })
      const flow = document.querySelector('#flow-chart')
      this.flow.chart = echarts.init(flow)
      this.flow.chart.setOption(this.flow.option)
      // 加载作业类型数据
      if (this.work.chart) {
        this.work.chart.dispose()
        this.work.chart = null
      }
      this.formatData(works)
      const work = document.querySelector('#work-chart')
      this.work.chart = echarts.init(work)
      this.work.chart.setOption(this.work.option)
    },
    initData () {
      if (this.id) {
        this.model.areaType = this.data.areaType
        this.model.markName = this.data.markName
        const position = JSON.parse(this.data.positionInfo)
        switch (this.model.areaType) {
          case '圆形': {
            const points = {
              x: position[0].x,
              y: position[0].y,
              r: position[1]
            }
            this.model.points = JSON.stringify([points])
            break
          }
          case '多边形':
          case '矩形': {
            this.model.points = JSON.stringify(position[0])
            break
          }
          default:
            break
        }
        this.query()
      }
    },
    query () {
      const params = new FormData()
      params.append('points', this.model.points)
      params.append('areaType', this.model.areaType)
      params.append('startData', this.model.startData)
      params.append('endData', this.model.endData)

      this.axios.post(api.analyseAreaSituation, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.initChart(res.result.dateChart, res.result.usagesChart)
          this.datas = res.result.list
        } else {
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        console.error(err)
      })
    },
    validate () {
      this.$refs['analysis-result-form'].validate(valid => {
        if (valid) {
          this.query()
        }
      })
    }
  }
}
</script>

<style scoped>
.analysis-result {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.analysis-result-form {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.analysis-result-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-right: 20px;
}
/* CHART */
.chart-container {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
.chart-item {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
}
#flow-chart,
#work-chart {
  height: 380px;
  width: 480px;
}
</style>
<style>
.analysis-result-item label {
  text-align: right;
  width: 90px !important;
}
</style>
