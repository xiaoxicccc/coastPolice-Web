<template>

  <div class="weather-wrapper">

    <app-title
      :icon="threshold"
      title="今日天气">
    </app-title>

    <div class="weather">

      <div class="weather-wind">

        <img
          alt="WEATHER"
          class="weather-icon"
          :src="`/img/weather/${icon}.png`">

        <!--<div class="weather-icon-wrapper">

          &lt;!&ndash;<img
            alt="WEATHER"
            class="weather-icon"
            :src="`https://cdn.heweather.com/img/plugin/190516/icon/c/${icon}d.png`">&ndash;&gt;

        </div>

        <span class="wind">{{ wind }}</span>-->

      </div>

      <div class="weather-info">

        <div>

          <span class="wind">{{ wind }}</span>

          <span class="wind">湿度{{ humidity }}%</span>

        </div>

        <div>

          <span class="temperature">{{ temperature }}</span>

          <span class="unit">°C {{ weather }}</span>

        </div>

        <div>

          <span class="wind">能见度{{ vis }}公里</span>

          <span class="wind">风速{{ windSpeed }}公里/小时</span>

        </div>

        <!--<span class="range">{{ min }}~{{ max }}</span>-->

        <!--<span class="weather-detail">{{ weather }}</span>-->

      </div>

    </div>

  </div>

</template>

<script>
import appTitle from '../title'
import api from '@/util/api'
export default {
  name: 'weather',
  components: {
    'app-title': appTitle
  },
  data () {
    return {
      humidity: 50,
      icon: '100',
      max: 3,
      min: -5,
      status: '晴',
      temperature: 26,
      threshold: false, // 风力阈值
      vis: 10,
      weather: '晴转多云',
      wind: '西北风3-4级',
      windSpeed: 4
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      const params = new FormData()

      this.axios.post(api.getWeatherInfo, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = res.result
          if (data) {
            this.status = data.now.text
            this.temperature = data.now.temp
            this.max = data.daily.tempMax
            this.min = data.daily.tempMin
            this.icon = data.now.icon
            this.vis = data.now.vis
            this.windSpeed = data.now.windSpeed
            this.humidity = data.now.humidity
            // 构造当天天气变化情况
            if (data.daily.textDay !== data.daily.textNight) {
              this.weather = `${data.daily.textDay}转${data.daily.textNight}`
            } else {
              this.weather = data.daily.textDay
            }
            this.wind = `${data.now.windDir}${data.daily.windScaleDay}级` // 构造风力等级
            this.threshold = data.now.windScale - 0 > 7
          }
        } else {
          console.error(res.msg || '今日天气查询失败！')
        }
      }).catch(err => {
        // this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
.weather {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 121px;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-left: 15px;
  margin-top: 10px;
  /*width: 252px;*/
}
/* INFO */
.weather-info,
.weather-wind {
  align-items: center;
  display: flex;
  flex-direction: column;
}
.weather .temperature {
  color: rgba(4, 220, 246, 1);
  font-family: 'DINB';
  font-size: 54px;
}
.weather .unit {
  color: rgba(4, 220, 246, 1);
  font-size: 16px;
}
.range,
.weather-detail {
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
}
.weather-icon-wrapper {
  align-items: center;
  background-image: url('/img/screen/index/icon-weather-background.png');
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
  height: 90px;
  justify-content: center;
  margin-bottom: 5px;
  width: 117px;
}
.weather-icon {
  height: 76px;
  width: 76px;
}
.wind {
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
}
.wind:first-child {
  margin-right: 10px;
  padding-right: 10px;
  position: relative;
}
.wind:first-child:after {
  background-color: rgba(255, 255, 255, 0.58);
  content: '';
  display: inline-block;
  height: 14px;
  margin-left: 10px;
  position: absolute;
  top: 3px;
  width: 1px;
}
</style>
