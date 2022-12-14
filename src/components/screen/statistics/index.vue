<template>

  <div :class="['trawler-statistics', visibility]">

    <app-title
      title="海上船舶态势">
    </app-title>

    <!-- 数量统计 -->
    <!-- <app-quantity>
    </app-quantity> -->
    <div class="trawler-statistics-list">

      <div
        v-for="(item, index) in number.items"
        class="trawler-statistics-item"
        :key="index"
        @click="togglePage(item)">

        <img
          alt="NUMBER_ICON"
          class="trawler-statistics-icon"
          src="/img/screen/index/icon-number-background.png">

        <span class="value">{{ number.model[item.prop] }}
        </span>

        <div class="trawler-statistics-info">

          <span class="label">{{ item.label }}
          </span>

          <span class="unit">{{ item.unit }}
          </span>

        </div>

      </div>

    </div>

    <!-- 图表 -->
    <!--<app-chart
      chart-id="change-trend"
      :chart-list="trawler.list"
      title="船舶出入港数量变化趋势"
      @change-type="initTrawlerToMapTrend"
      style="margin-bottom: 29px;">
    </app-chart>-->

    <app-columns-chart
      :categories="trawler.categories"
      :chart-data="trawler.data"
      chart-id="change-trend"
      :chart-list="trawler.list"
      :date="new Date().getTime()"
      ref="app-columns-chart"
      title="船舶出入港数量变化趋势"
      @change-type="initTrawlerToMapTrend"
      style="margin-bottom: 29px;">
    </app-columns-chart>

    <!-- 全景数据分析 -->
    <app-title
      title="全景数据分析">
    </app-title>

    <app-panorama>
    </app-panorama>

    <!-- 预警信息 -->
    <app-title
      title="预警信息">
    </app-title>

    <app-early-warning>
    </app-early-warning>

    <!-- 图表 -->
    <!--<app-chart
      chart-id="flow-trend"
      :chart-size="flow.size"
      title="船员流动趋势">
    </app-chart>-->

  </div>

</template>

<script>
import api from '@/util/api'

// import appChart from '../chart/index'
import appColumnsChart from '../chart/columns-chart'
import appEarlyWarning from './warning'
import appPanorama from './panorama'
// import appQuantity from './quantity'
import appTitle from '../title'
export default {
  name: 'trawler-statistics',
  components: {
    'app-columns-chart': appColumnsChart,
    'app-early-warning': appEarlyWarning,
    'app-panorama': appPanorama,
    // 'app-chart': appChart,
    // 'app-quantity': appQuantity,
    'app-title': appTitle
  },
  data () {
    return {
      change: {
        size: {
          height: 160,
          width: 344
        }
      },
      flow: {
        size: {
          height: 160,
          width: 344
        }
      },
      number: {
        items: [
          {
            label: '渔船在线总数',
            path: '/admin/trawler-dynamic',
            prop: 'trawler',
            unit: '/艘'
          },
          {
            label: '渔船民数量',
            path: '/admin/people-manage',
            prop: 'people',
            unit: '/人'
          }
        ],
        model: {
          people: 0,
          trawler: 0
        }
      },
      trawler: {
        categories: [
        ],
        data: [
          {
            name: '进港',
            data: []
          },
          {
            name: '出港',
            data: []
          }
        ],
        list: [
          {
            label: '队',
            value: '大队'
          },
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
      visibility: ''
    }
  },
  mounted () {
    this.toggleVisible(true)
    this.initNumberData()
  },
  destroyed () {
    this.toggleVisible(false)
  },
  methods: {
    initNumberData () {
      this.initTrawlerOnlineData()
      this.initPeopleData()
    },
    initPeopleData () {
      const params = new FormData()

      this.axios.post(api.getPeopleNumber, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.number.model.people = res.result
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    initTrawlerOnlineData () {
      const params = new FormData()

      this.axios.post(api.getTrawlerTotalOnline, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.number.model.trawler = res.result
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    initTrawlerToMapTrend (e) {
      const params = new FormData()
      params.append('timeInterval', e)
      // 打开遮罩
      this.$refs['app-columns-chart'].loading = true
      // this.$refs['app-columns-chart'].initChartEnd(true)

      this.trawler.data[0].data = []
      this.trawler.data[1].data = []
      this.trawler.categories = []
      let visible = false
      this.axios.post(api.getTrawlerToPortTrend, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (res.result) {
            res.result.forEach(item => {
              this.trawler.categories.push(item.date || item.name)
              this.trawler.data[0].data.push(item.arrivalCount - 0)
              this.trawler.data[1].data.push(item.leaveCount - 0)
            })
            visible = !!res.result.length
          }
        } else {
          visible = false
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
        visible = false
      }).finally(() => {
        this.$refs['app-columns-chart'].loading = false
        this.$refs['app-columns-chart'].initChartEnd(visible)
      })
    },
    togglePage (e) {
      this.$router.push({
        path: e.path
      })
    },
    toggleVisible (visibility) {
      this.visibility = visibility ? 'visible' : ''
    }
  }
}
</script>

<style scoped>
.trawler-statistics {
  left: -384px;
  opacity: 0;
  transition-duration: .3s;
  visibility: hidden;
  width: 354px;
}
.trawler-statistics.visible {
  left: 30px;
  opacity: 1;
  visibility: visible;
}
/* NUMBER_LIST */
.trawler-statistics-list {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 40px;
}
.trawler-statistics-item {
  cursor: pointer;
  position: relative;
}
.trawler-statistics-item .value {
  color: rgba(2, 222, 255, 1);
  font-family: 'DINB';
  font-size: 34px;
  left: 50%;
  position: absolute;
  top: -10px;
  transform: translateX(-50%);
}
.trawler-statistics-info .label {
  color: rgba(246, 252, 255, 1);
  font-size: 14px;
}
.trawler-statistics-info .unit {
  color: rgba(135, 139, 152, 1);
  font-size: 12px;
}
</style>
