<template>

  <div class="task-type">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <div id="task-chart">
    </div>

  </div>

</template>

<script>
import appFilter from '@/components/common/filter'
import api from '@/util/api'
import * as echarts from 'echarts'
export default {
  name: 'task-type',
  components: {
    'app-filter': appFilter
  },
  data () {
    return {
      chart: null,
      items: [
        // {
        //   label: '在线时长',
        //   prop: 'time',
        //   type: 'select',
        //   options: [
        //     {
        //       label: '2h在线',
        //       value: '2'
        //     },
        //     {
        //       label: '6h在线',
        //       value: '6'
        //     },
        //     {
        //       label: '12h在线',
        //       value: '12'
        //     },
        //     {
        //       label: '24h在线',
        //       value: '24'
        //     }
        //   ]
        // },
        {
          label: '',
          name: '刷新',
          prop: 'query',
          style: 'primary-form',
          type: 'button'
        }
      ],
      model: {
        time: '2'
      },
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
                name: '捕捞船',
                value: 20
              },
              {
                name: '养殖船',
                value: 16
              },
              {
                name: '国际邮轮',
                value: 7
              },
              {
                name: '其他',
                value: 30
              }
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
      switch (type) {
        case 'query':
          this.initData()
          break
        default:
          break
      }
    },
    initChart () {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      const dom = document.querySelector('#task-chart')
      this.chart = echarts.init(dom)
      this.chart.setOption(this.option)
      this.initData()
    },
    initData () {
      const params = new FormData()

      this.axios.post(api.getTrawlerTaskType, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (res.result) {
            const list = res.result.map(item => {
              return {
                name: item.usageName,
                value: item.num
              }
            })
            this.updateChart(list)
          }
        } else {
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    updateChart (data) {
      this.option.series[0].data = data
      this.chart.setOption(this.option)
    }
  }
}
</script>

<style scoped>
.task-type {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
#task-chart {
  flex-grow: 1;
}
</style>
