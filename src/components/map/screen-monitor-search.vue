<template>

  <!-- 渔港卫士定位 -->
  <div class="screen-monitor-search">

    <div class="title">

      <span>渔港卫士筛选
      </span>

      <i
        class="el-icon-close icon-close"
        @click="close">
      </i>

    </div>

    <div class="monitor-search-form">

      <span class="label">名称
      </span>

      <el-input
        v-model="model.name"
        size="small"
        @input="debounce">
      </el-input>

      <ul :class="['monitor-search-list', autocomplete]">

        <li
          v-for="(item, i) in data"
          class="monitor-search-item"
          :key="i"
          @click="locate(item)">{{ item.videoName }}
        </li>

      </ul>

    </div>

    <span class="legend-title">图例
    </span>

    <ul class="monitor-legend-list">

      <li
        v-for="(item, index) in legend"
        class="monitor-legend-item"
        :key="index">

        <i
          class="icon-legend"
          :style="`background-color: ${item.color};`">
        </i>

        <span
          v-if="!item.check"
          class="label">{{ item.label }}
        </span>

        <el-checkbox
          v-else
          class="legend-status-item"
          v-model="status.active[item.prop]"
          @change="toggleMonitorStatus(item)">{{ item.label }}
        </el-checkbox>

      </li>

    </ul>

    <span class="legend-title">运行状态
    </span>

    <ul class="legend-status">

      <!--<li
        v-for="(item, index) in status.list"
        :key="index"
        class="legend-status-item"
        :class="{'active': status.active[item.prop]}"
        @click="toggleMonitorStatus(item)">{{ item.label }}
      </li>-->

      <el-checkbox
        v-for="(item, index) in status.list"
        :key="index"
        class="legend-status-item"
        v-model="status.active[item.prop]"
        @change="toggleMonitorStatus(item)">{{ item.label }}
      </el-checkbox>

    </ul>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'screen-monitor-search',
  data () {
    return {
      autocomplete: '',
      data: [
      ],
      legend: [
        {
          color: '#FFA500',
          check: false,
          label: '当前定位'
        },
        {
          color: 'green',
          check: true,
          label: '渔政',
          prop: 'fishery'
        },
        {
          color: 'blue',
          check: true,
          label: '天网',
          prop: 'skynet'
        },
        {
          color: 'red',
          check: true,
          label: '海防',
          prop: 'coast'
        },
        {
          color: 'blue',
          check: true,
          label: '其他',
          prop: 'other'
        }
      ],
      model: {
        name: null
      },
      options: [
      ],
      status: {
        active: {
          abnormal: false, // 默认不显示不正常的监控
          coast: true, // 海防
          fishery: true, // 渔政
          normal: true, // 默认显示正常的监控
          other: true, // 其他
          skynet: true // 天网
        },
        list: [
          {
            label: '正常',
            prop: 'normal'
          },
          {
            label: '不正常',
            prop: 'abnormal'
          }
        ]
      }
    }
  },
  watch: {
    // 'model.name': 'debounce'
  },
  mounted () {
    const monitorStatus = localStorage.getItem('monitor-state')
    if (monitorStatus) {
      this.status.active = JSON.parse(monitorStatus)
    } else {
      localStorage.setItem('monitor-state', JSON.stringify(this.status.active))
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    debounce () { // 函数防抖
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.timeout = setTimeout(() => {
        this.initData()
      }, 1000)
    },
    initData () {
      this.data = []
      this.autocomplete = this.data.length ? 'active' : ''
      if (!this.model.name) {
        return null
      }
      const params = new FormData()
      params.append('pageSize', 30)
      params.append('pageNum', 1)
      params.append('videoName', this.model.name || '')

      this.axios.post(api.getVideoPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.filter(item => item.runStatus - 0 === 1)
          this.autocomplete = this.data.length ? 'active' : ''
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    locate (e) {
      this.model.name = e.videoName
      this.data = []
      this.autocomplete = this.data.length ? 'active' : ''
      window.$screen.locateMonitor(e)
    },
    /**
     * 切换摄像头显示
     * @param e 配置信息
     */
    toggleMonitorStatus (e) {
      localStorage.setItem('monitor-state', JSON.stringify(this.status.active))
      this.$emit('toggle', e, this.status.active[e.prop])
    }
  }
}
</script>

<style scoped>
.screen-monitor-search {
  background-color: rgba(25, 48, 128, .8);
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  font-family: 'SHSCNN';
  height: 260px;
  left: 400px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  position: fixed;
  top: 180px;
  width: 300px;
  z-index: 10;
}
/* TITLE */
.screen-monitor-search .title {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.screen-monitor-search .icon-close {
  cursor: pointer;
}
/* FORM */
.monitor-search-form {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  position: relative;
}
.monitor-search-form .label {
  flex-shrink: 0;
  font-size: 14px;
  margin-right: 10px;
}
/* SEARCH_LIST */
.monitor-search-list {
  background-color: rgba(19, 77, 165, 1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  left: 38px;
  max-height: 0;
  opacity: 0;
  overflow-y: auto;
  position: absolute;
  top: 26px;
  visibility: hidden;
}
.monitor-search-list.active {
  margin-top: 10px;
  max-height: 150px;
  opacity: 1;
  padding-bottom: 10px;
  padding-top: 10px;
  visibility: visible;
  width: 242px;
}
.monitor-search-item {
  cursor: pointer;
  box-sizing: border-box;
  flex-shrink: 0;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  text-align: left;
}
.monitor-search-item:hover {
  background-color: rgba(255, 255, 255, .3);
}
/* LEGEND_TITLE */
.legend-title {
  margin-top: 10px;
  text-align: left;
}
/* LIST */
.monitor-legend-list {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
}
.monitor-legend-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  margin-bottom: 5px;
  width: 33.33%;
}
.monitor-legend-item .icon-legend {
  border-radius: 50%;
  height: 10px;
  margin-right: 5px;
  width: 10px;
}
/* STATUS */
.legend-status {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
.legend-status-item {
  box-sizing: border-box;
  cursor: pointer;
  font-size: 14px;
  padding-left: 5px;
  padding-right: 5px;
}
.legend-status-item:not(:last-child) {
  margin-right: 5px;
}
.legend-status-item >>> .el-checkbox__label {
  color: white;
}
.legend-status-item >>> .el-checkbox__inner {
  background-color: transparent;
}
.legend-status >>> .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #409EFF;
}
</style>
