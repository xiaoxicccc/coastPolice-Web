<template>

  <!-- 暂时不用 -->
  <div class="trawler-quantity">

    <div class="title">渔船总数
    </div>

    <div class="count">

      <ul class="list">

        <li
          v-for="(item, i) in count"
          class="item"
          :key="i">{{ item }}
        </li>

      </ul>

      <span class="unit">艘</span>

    </div>

    <ul class="total-list">

      <li
        v-for="(item, i) in total"
        class="total-item"
        :key="i">

        <img
          alt="BORDER"
          class="border"
          src="/img/screen/index/icon-online-border.png">

        <div class="content">

          <span class="label">{{ item.label }}</span>

          <div class="text">

            <span class="number">{{ item.online }}/{{ item.total }}
            </span>

            <span class="unit">艘
            </span>

          </div>

        </div>

        <img
          alt="BORDER"
          class="border"
          src="/img/screen/index/icon-online-border.png">

      </li>

    </ul>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'trawler-quantity',
  data () {
    return {
      count: [0, 0, 0, 0, 0],
      total: [
        {
          label: 'AIS在线/总数',
          online: 0,
          prop: 'AIS',
          total: 0
        },
        {
          label: '北斗在线/总数',
          online: 0,
          prop: 'Beidou',
          total: 0
        }
      ]
    }
  },
  mounted () {
    this.initTotal()
    this.initData()
  },
  methods: {
    initData () {
      const params = new FormData()

      this.axios.post(api.getTrawlerTypeOnline, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.total.forEach(item => {
            item.online = res.result.find(_item => _item.msgType === item.prop).onlineNum
            item.total = res.result.find(_item => _item.msgType === item.prop).totalNum
          })
        } else {
          this.$message.error(res.msg || '设备在线数/总数查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    initTotal () {
      this.axios.get(api.getTrawlerTotal).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (res.result) {
            const data = res.result - 0
            const wan = parseInt(data / 10000)
            const thousands = parseInt((data - (wan * 10000)) / 1000)
            const hundred = parseInt((data - wan * 10000 - thousands * 1000) / 100)
            const ten = parseInt((data - wan * 10000 - thousands * 1000 - hundred * 100) / 10)
            const bit = parseInt(data - wan * 10000 - thousands * 1000 - hundred * 100 - ten * 10)

            this.count = [wan, thousands, hundred, ten, bit]
          } else {
            this.count = [0, 0, 0, 0, 0]
          }
        } else {
          this.$message.error(res.msg || '船舶总数查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
.trawler-quantity {
  margin-left: 10px;
  margin-top: 20px;
  text-align: left;
}
.trawler-quantity .title {
  color: rgba(255, 255, 255, 1);
  font-family: 'PMZDR';
  font-size: 16px;
  margin-bottom: 10px;
}
.count {
  align-items: baseline;
  display: flex;
  flex-direction: row;
}
.count .list {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.count .item {
  background-image: url('/img/screen/index/icon-count-background.png');
  background-size: 100% 100%;
  color: rgba(254, 194, 48, 1);
  font-family: 'DINM';
  font-size: 40px;
  height: 68px;
  line-height: 68px;
  margin-right: 14px;
  text-align: center;
  width: 50px;
}
.count .unit {
  color: rgba(255, 255, 255, 1);
  font-family: 'PMZDR';
  font-size: 20px;
}
/* 在线数 */
.total-list {
  display: flex;
  flex-direction: row;
  margin-bottom: 29px;
  margin-top: 18px;
}
.total-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 52px;
  width: 280px;
}
.total-item:first-child {
  margin-right: 30px;
}
.total-list .border {
  flex-shrink: 0;
  height: 100%;
  width: 2px;
}
.total-list .content {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
}
.total-list .label {
  color: rgba(255, 255, 255, 1);
  font-family: 'PMZDR';
  font-size: 16px;
}
.total-list .number {
  color: rgba(2, 222, 255, 1);
  font-family: 'DINB';
  font-size: 24px;
}
.total-list .unit {
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
}
</style>
