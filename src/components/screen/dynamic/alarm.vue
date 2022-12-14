<template>

  <div class="dynamic-alarm">

    <div
      v-for="(item, i) in data"
      class="dynamic-alarm-item"
      :key="i"
      @click="togglePage(item)">

      <div class="info">

        <img
          alt="ALARM_ICON"
          class="alarm-icon"
          :src="`/img/screen/index/icon-alarm-${item.icon}.png`">

        <span class="label">{{ item.label }}</span>

        <img
          alt="NARROW_ICON"
          class="alarm-narrow"
          src="/img/screen/index/icon-alarm-yellow-right.png">

      </div>

      <div class="total">{{ item.total }}
      </div>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'dynamic-alarm',
  data () {
    return {
      data: [
        {
          icon: 'over',
          label: '已处置',
          total: 0
        },
        {
          icon: 'never',
          label: '今日告警',
          total: 0
        }
      ]
    }
  },
  mounted () {
    this.initData()
    this.$EventBus.$on('update-number', () => {
      this.initData()
    })
  },
  methods: {
    initData () {
      const params = new FormData()

      this.axios.post(api.getNewAlarmTotal, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data[0].total = res.result.dealedNum
          this.data[1].total = res.result.todayNum
        } else {
          this.$message.error(res.msg || '最新告警信息查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    togglePage (e) {
      this.$router.push({
        path: '/admin/analysis-manage',
        query: {
          flag: e.icon
        }
      })
    }
  }
}
</script>

<style scoped>
.dynamic-alarm {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 13px;
  margin-top: 20px;
  width: 100%;
}
.dynamic-alarm-item {
  align-items: center;
  background-image: url('/img/screen/index/icon-alarm-new-background.png');
  background-size: 100% 100%;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 74px;
  justify-content: center;
  padding-left: 21px;
  padding-right: 26px;
  width: 50%;
}
.dynamic-alarm-item:first-child {
  margin-right: 14px;
}
.dynamic-alarm-item .info {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}
.dynamic-alarm-item .info .label {
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  margin-left: 4px;
  margin-right: 4px;
}
.dynamic-alarm-item .total {
  color: rgba(2, 222, 255, 1);
  font-family: 'DINB';
  font-size: 24px;
  text-align: right;
  width: 100%;
}
</style>
