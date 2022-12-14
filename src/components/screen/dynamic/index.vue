<template>

  <div :class="['trawler-dynamic', visibility]">

    <app-weather>
    </app-weather>

    <app-title
      title="船舶活跃状态">
    </app-title>

    <!-- 船舶活跃状态列表 -->
    <app-table>
    </app-table>

    <app-title
      title="最新告警">
    </app-title>

    <!-- 报警模块 -->
    <app-alarm>
    </app-alarm>

    <!-- 抓拍模块 -->
    <app-snap>
    </app-snap>

    <!--<app-chart
      :chart-data="chart.data"
      chart-id="alarm"
      :chart-size="alarm.size"
      title="告警类型排名"
      @change-type="initChartData">
    </app-chart>-->

  </div>

</template>

<script>
import api from '@/util/api'
import appAlarm from './alarm'
// import appChart from '../chart/index'
import appSnap from './snap'
import appTable from './table'
import appTitle from '../title'
import appWeather from './weather'
export default {
  name: 'trawler-dynamic',
  components: {
    'app-alarm': appAlarm,
    'app-snap': appSnap,
    // 'app-chart': appChart,
    'app-table': appTable,
    'app-title': appTitle,
    'app-weather': appWeather
  },
  data () {
    return {
      alarm: {
        size: {
          height: 180,
          width: 344
        }
      },
      chart: {
        data: []
      },
      visibility: ''
    }
  },
  mounted () {
    this.toggleVisible(true)
  },
  destroyed () {
    this.toggleVisible(false)
  },
  methods: {
    initChartData (data) {
      const params = new FormData()
      params.append('timeInterval', data)

      this.axios.post(api.getAlarmRanking, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.chart.data = res.result.map(item => {
            return [
              item.alarmType,
              item.num - 0
            ]
          })
        } else {
          this.$message.error(res.msg || '告警排名查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员!')
        console.error(err)
      })
    },
    toggleVisible (visibility) {
      this.visibility = visibility ? 'visible' : ''
    }
  }
}
</script>

<style scoped>
.trawler-dynamic {
  right: -353px;
  opacity: 0;
  transition-duration: .3s;
  visibility: hidden;
  width: 323px;
}
.trawler-dynamic.visible {
  right: 30px;
  opacity: 1;
  visibility: visible;
}
</style>
