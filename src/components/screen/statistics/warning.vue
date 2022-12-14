<template>

  <div class="early-warning">

    <div class="early-warning-item">

      <span class="index">序号
      </span>

      <span class="name">预警名称
      </span>

      <span class="time">预警时间
      </span>

    </div>

    <div
      v-for="(item, index) in data"
      class="early-warning-item"
      :key="index">

      <span class="index">

       <span class="circle">{{ index + 1 }}
       </span>

      </span>

      <span class="name" :title="item.name">{{ item.name }}
      </span>

      <span class="time">{{ item.time }}
      </span>

    </div>

    <div class="early-warning-page">

      <span class="current">共{{ pager.pages }}页
      </span>

      <span
        :class="['pager-prev', pager.prev]"
        @click="handleChangePager('prev')">上一页
        </span>

      <span class="current">第{{ pager.current }}页
      </span>

      <span
        :class="['pager-next', pager.next]"
        @click="handleChangePager('pren')">下一页
      </span>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'early-warning',
  data () {
    return {
      data: [
      ],
      pager: {
        current: 1,
        next: 'disabled',
        page: 1,
        pages: 1,
        prev: 'disabled',
        total: 0
      }
    }
  },
  props: {
    'warning-data': {
      default () {
        return [
          {
            name: '无线管控预警',
            time: '2022/04/18 19:07:34'
          },
          {
            name: '车辆预警',
            time: '2022/04/05 17:17:36'
          },
          {
            name: '船舶预警',
            time: '2022/03/25 06:50:44'
          },
          {
            name: '人像预警',
            time: '2022/03/23 04:41:43'
          }
        ]
      },
      required: false,
      type: Array
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    changePage (page) {
      this.pager.current = page
      this.initData()
    },
    handleChangePager (type) {
      switch (type) {
        case 'pren': {
          if (this.pager.current < this.pager.pages) {
            this.changePage(this.pager.current + 1)
          }
          break
        }
        case 'prev': {
          if (this.pager.current > 1) {
            this.changePage(this.pager.current - 1)
          }
          break
        }
        default: {
          break
        }
      }
    },
    initData () {
      const params = new FormData()
      params.append('pageNo', this.pager.current)
      params.append('pageSize', 4)
      params.append('acceptState', '')

      this.axios.post(api.getAnalysisPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = res.result.records || []
          this.data = data.map(item => {
            const stamp = new Date(item.alarmTime)
            stamp.setHours(stamp.getHours() + 8)
            return {
              name: `${item.boatName}-${item.alarmType}`,
              time: stamp.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1')
            }
          })
          this.pager.pages = res.result.pages
          this.pager.total = res.result.total
          const current = this.pager.current
          this.pager.next = this.pager.pages === current ? 'disabled' : ''
          this.pager.prev = current === 1 ? 'disabled' : ''
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
.early-warning {
  box-sizing: border-box;
  padding-left: 6px;
  padding-right: 3px;
  padding-top: 20px;
  width: 100%;
}
/* ITEM */
.early-warning-item {
  align-items: center;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 1);
  display: flex;
  flex-shrink: 0;
  font-size: 13px;
  flex-direction: row;
  padding-bottom: 8px;
  padding-top: 8px;
}
.early-warning-item:nth-child(2n) {
  background-color: rgba(8, 131, 199, 0.1);
}
.early-warning-item > span {
  overflow:hidden;
  -o-text-overflow:ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.early-warning-item .index {
  flex-shrink: 0;
  margin-right: 10px;
  width: 50px;
}
.early-warning-item .index .circle {
  background-color: rgba(8, 131, 199, 0.2);
  border: 1px solid rgba(74, 160, 207, 1);
  border-radius: 50%;
  display: inline-block;
  height: 16px;
  line-height: 16px;
  text-align: center;
  width: 16px;
}
.early-warning-item .name {
  flex-shrink: 0;
  margin-right: 10px;
  text-align: left;
  width: 198px;
}
/* TYPHOON_PAGE */
.early-warning-page {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  font-size: 13px;
  justify-content: space-between;
  padding-bottom: 15px;
  padding-left: 29px;
  padding-right: 34px;
  padding-top: 13px;
  pointer-events: all;
}
.early-warning-page > span {
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
.pager-next.disabled,
.pager-prev.disabled {
  color: #CCCCCC;
  cursor: not-allowed;
}
</style>
