<template>

  <div class="app-table">

    <div
      v-for="item in nav"
      class="list"
      :key="item.id">

      <div
        class="item">{{ item.label }}
      </div>

      <div
        v-for="(_item, i) in data"
        :class="['item']"
        :key="i">

        <span :class="item.id">{{ _item[item.id] }}
        </span>

      </div>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'app-table',
  data () {
    return {
      data: [
      ],
      nav: [
        {
          id: 'index',
          label: '排名'
        },
        {
          id: 'label',
          label: '船号'
        },
        {
          id: 'speed',
          label: '当前航速(节)'
        }
        // {
        //   id: 'duration',
        //   label: '航行时长(h)'
        // }
      ]
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      const params = new FormData()

      this.axios.post(api.getTrawlerActiveRanking, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = res.result.slice(0, 5)
          this.data = data.map((item, i) => {
            return {
              duration: 10,
              index: i + 1,
              label: item.boatName,
              speed: item.sog
            }
          })
        } else {
          this.$message.error(res.msg || '渔船活跃状态查询失败！')
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
.app-table {
  color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: row;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 29px;
  margin-top: 14px;
  min-height: 150px;
}
.app-table .list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.app-table .item {
  height: 36px;
  line-height: 36px;
}
.app-table .list .item:nth-child(2n) {
  background-color: rgba(8, 131, 199, 0.1);
}
.app-table .index {
  background-color: rgba(8, 131, 199, 0.2);
  border: 1px solid rgba(74, 160, 207, 1);
  border-radius: 50%;
  display: inline-block;
  height: 16px;
  line-height: 16px;
  text-align: center;
  width: 16px;
}
</style>
