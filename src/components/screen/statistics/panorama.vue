<template>

  <div class="panorama-analysis">

    <ul class="list">

      <li
        v-for="(item, i) in list"
        class="item"
        :key="i"
        @click="togglePage(item)">

        <img
          alt="ICON"
          class="alarm-icon"
          :src="`/img/screen/index/icon-alarm-${item.icon}.png`">

        <div class="content">

          <span class="label">{{ item.label }}</span>

          <span class="count">{{ data[item.prop] }}</span>

        </div>

        <img
          alt="ARROW"
          class="arrow"
          src="/img/screen/index/icon-alarm-right.png">

      </li>

    </ul>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'panorama-analysis',
  data () {
    return {
      data: {
        car: 0,
        other: 0,
        people: 0,
        trawler: 0
      },
      list: [
        {
          icon: 'trawler',
          label: '船舶报警',
          path: '/admin/analysis-manage',
          prop: 'trawler'
        },
        {
          icon: 'car',
          label: '车辆报警',
          path: '/admin/car-analysis',
          prop: 'car'
        },
        {
          icon: 'people',
          label: '人像报警',
          path: '/admin/people-analysis',
          prop: 'people'
        },
        {
          icon: 'other',
          label: 'IMSI围栏报警',
          path: '/admin/phone-fence',
          prop: 'other'
        }
      ]
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    formatData (e) {
      return e.data.result
    },
    initCarAlarmNumber () {
      const params = new FormData()

      return this.axios.post(api.getCarAlarmNumber, params)
    },
    initData () {
      this.axios.all([this.initCarAlarmNumber(), this.initPeopleAlarmNumber(), this.initTrawlerAlarmNumber(), this.initImsiAlarmNumber()]).then(
        this.axios.spread((car, people, trawler, other) => {
          this.data.car = this.formatData(car)
          this.data.people = this.formatData(people)
          this.data.trawler = this.formatData(trawler)
          this.data.other = this.formatData(other)
        })
      )
    },
    initImsiAlarmNumber () {
      const params = new FormData()

      return this.axios.post(api.getImsiAlarmNumber, params)
    },
    initPeopleAlarmNumber () {
      const params = new FormData()

      return this.axios.post(api.getPeopleAlarmNumber, params)
    },
    initTrawlerAlarmNumber () {
      const params = new FormData()

      return this.axios.post(api.getTrawlerAlarmNumber, params)
    },
    togglePage (e) {
      this.$router.push({
        path: e.path
      })
    }
  }
}
</script>

<style scoped lang="sass">
.panorama-analysis
  .list
    display: flex
    flex-direction: row
    flex-wrap: wrap
    margin-top: 20px
    .item
      align-items: center
      background-image: url("/img/screen/index/icon-alarm-background.png")
      box-sizing: border-box
      cursor: pointer
      display: flex
      flex-direction: row
      height: 76px
      margin-bottom: 18px
      margin-left: 10px
      margin-right: 10px
      padding-left: 14px
      padding-right: 10px
      width: 144px
      .alarm-icon
        flex-shrink: 0
        height: 30px
        width: 30px
      .content
        display: flex
        flex-direction: column
        flex-grow: 1
        padding-left: 12px
        text-align: left
        .label
          color: rgba(195, 211, 243, 1)
          font-size: 14px
        .count
          color: rgba(2, 222, 255, 1)
          font-family: 'DINB'
          font-size: 20px
</style>
