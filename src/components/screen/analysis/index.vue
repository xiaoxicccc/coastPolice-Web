<template>

  <div :class="['trawler-analysis', visibility]">

    <app-title
      ref="app-title"
      :edit="rule.edit"
      show-switch
      :title="title"
      @change="changeSwitch"
      @handle="handle">
    </app-title>

    <!-- 查询部分 -->
    <el-form
      class="search-form"
      :model="model">

      <el-form-item
        v-for="(item, i) in items"
        class="search-item"
        :key="i"
        :label="item.label">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          size="small"
          type="text"
          style="width: 208px;">
        </el-input>

        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="model[item.prop]"
          size="small"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 208px;">
        </el-date-picker>

        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          size="small"
          style="width: 208px;">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

      </el-form-item>

    </el-form>

    <div class="search-control">

      <span
        v-for="(item, i) in controls"
        class="search-control-item"
        :key="i"
        @click="handle(item)">{{ item.label }}
      </span>

    </div>

    <app-title
      sub-title="告警列表">
    </app-title>

    <div class="analysis-status-type">

      <div
        v-for="(item, i) in status"
        :class="['analysis-status-type-item', active === i ? 'active' : '']"
        :key="i"
        @click="changeType(i)">{{ item.label }}
      </div>

    </div>

    <ul class="analysis-list">

      <li
        v-for="(item, i) in data"
        class="analysis-item"
        :key="i">

        <img
          alt="ARROW_ICON"
          class="arrow-blue"
          src="/img/screen/analysis/icon-analysis-arrow-blue.png"
          @click="getDetail(item)">

        <div
          :class="['status', item.color]"
          @click="getDetail(item)">{{ item.status }}
        </div>

        <div
          v-for="(_item, index) in labels"
          class="analysis-cell"
          :key="index"
          @click="selectTrawler(item)">

          <span
            class="label">{{ _item.label }}:
          </span>

          <span
            class="value">{{ item[_item.prop] }}
          </span>

        </div>

      </li>

    </ul>

    <div class="trawler-pager">

      <span
        :class="['pager-prev', pager.prev]"
        @click="changePagePrev()">上一页
      </span>

      <span class="pager-current">第{{ pager.current }}页
      </span>

      <span class="pager-total">共{{ pager.total }}页
      </span>

      <span
        :class="['pager-next', pager.next]"
        @click="changePageNext()">下一页
      </span>

    </div>

    <app-title
      sub-title="渔船轨迹回放">
    </app-title>

    <el-form
      class="search-form"
      :model="playback.model">

      <el-form-item
        v-for="(item , i) in playback.items"
        class="search-item"
        :key="i"
        :label="item.label">

        <el-select
          v-if="item.type === 'select'"
          v-model="playback.model[item.prop]"
          size="small"
          style="width: 208px;">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="playback.model[item.prop]"
          size="small"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 208px;">
        </el-date-picker>

      </el-form-item>

    </el-form>

    <div
      class="search-control"
      style="margin-bottom: 0;">

      <span
        class="search-control-item"
        style="width: 120px;"
        @click="toggleReview(true)">开始回放
      </span>

      <span
        class="search-control-item"
        style="width: 120px;"
        @click="exportTrack">导出轨迹
      </span>

    </div>

    <app-detail
      v-if="dialog.visible"
      :detail="detail"
      :id="id"
      :time="time"
      @close="closeDialog"
      @update="updateData">
    </app-detail>

    <app-rule-config
      v-if="rule.visible"
      :type="type"
      @close="closeRuleConfig">
    </app-rule-config>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  items,
  list,
  model
} from './configs'
import appDetail from './detail'
import appRuleConfig from './rule-config'
import appTitle from '../title'
export default {
  name: 'trawler-analysis',
  components: {
    'app-detail': appDetail,
    'app-rule-config': appRuleConfig,
    'app-title': appTitle
  },
  data () {
    return {
      active: 0,
      controls: [
        {
          label: '查询',
          prop: 'query'
        },
        {
          label: '导出',
          prop: 'export'
        }
      ],
      data: [
      ],
      detail: {},
      dialog: {
        visible: false
      },
      id: 0,
      items: [],
      labels: [
        {
          label: '船名号',
          prop: 'name'
        },
        {
          label: '报警时间',
          prop: 'time'
        }
      ],
      model: Object.assign({}, model),
      pager: {
        current: 1,
        next: 'disabled',
        prev: 'disabled',
        size: 10,
        total: 1
      },
      playback: {
        items: [
          {
            label: '设备类型',
            prop: 'type',
            type: 'select',
            options: [
              {
                label: '北斗',
                value: 'Beidou'
              },
              {
                label: 'AIS',
                value: 'AIS'
              }
            ]
          },
          {
            label: '开始时间',
            prop: 'beginTime',
            type: 'datetime'
          },
          {
            label: '结束时间',
            prop: 'endTime',
            type: 'datetime'
          }
        ],
        model: {
          beginTime: null,
          endTime: null,
          shipName: null,
          type: 'Beidou'
        }
      },
      rule: {
        edit: false,
        visible: false
      },
      sidebar: list.slice(),
      status: [
        {
          label: '待受理',
          prop: '0'
        },
        {
          label: '受理中',
          prop: '1'
        },
        {
          label: '已办结',
          value: '2'
        }
      ],
      time: new Date().getTime(),
      title: '',
      type: '',
      visibility: ''
    }
  },
  watch: {
    $route: 'initPage'
  },
  mounted () {
    this.toggleVisible(true)

    const today = new Date()
    today.setHours(today.getHours() + 8)
    // this.model.endTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    today.setDate(today.getDate() - 7)
    this.model.startTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')

    this.initPage()
  },
  destroyed () {
    this.toggleVisible(false)
    if (window.$screen.vector.vector_analysis) {
      window.$screen.vector.vector_analysis.clear()
    }
    this.closePlayBack()
  },
  methods: {
    changePage (page, flag) {
      this.pager.current = page
      this.initData(flag)
    },
    changePageNext () {
      if (this.pager.current < this.pager.total) {
        this.changePage(this.pager.current + 1)
      }
    },
    changePagePrev () {
      if (this.pager.current > 1) {
        this.changePage(this.pager.current - 1)
      }
    },
    changeSwitch (e) {
      const params = new FormData()
      params.append('type', this.model.type)
      params.append('value', e ? 1 : 0)

      this.axios.post(api.changeAnalysisSwitchStatus, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
        } else {
          this.$message.error('操作失败！')
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.initState()
      })
    },
    changeType (index, flag) {
      this.active = index
      this.changePage(1, flag)
    },
    closeDialog () {
      this.dialog.visible = false
    },
    closePlayBack () {
      if (window.$screen.track.visible) {
        window.$screen.closeTrack()
      }
    },
    closeRuleConfig () {
      this.rule.visible = false
    },
    exportAnalysisList () {
      const url = [
        api.exportAnalysisList,
        '?alarmType=',
        this.model.type,
        '&boatName=',
        this.model.shipName || '',
        '&msgType=',
        this.model.source || '',
        '&beginAlarmTime=',
        this.model.startTime || '',
        '&endAlarmTime=',
        this.model.endTime || '',
        '&acceptState=',
        this.active
      ]
      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const token = localStorage.getItem('token')
      fetch(url.join(''), {
        headers: new Headers({
          Auth: token
        }),
        responseType: 'blob'
      })
        .then(res => {
          return res.blob()
        })
        .then(res => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const href = URL.createObjectURL(blob)
          const alink = document.createElement('a')
          alink.href = href
          alink.download = `${this.model.type}报警数据.xlsx`
          alink.target = '_blank'
          alink.click()
          alink.remove()
        }).finally(() => {
          loading.close()
        })
    },
    exportTrack () {
      if (!this.playback.model.shipName) {
        return null
      }
      const url = [
        api.exportTrawlerTrack,
        '?shipName=',
        this.playback.model.shipName || '',
        '&type=',
        this.playback.model.type || '',
        '&beginDate=',
        this.playback.model.beginTime || '',
        '&endDate=',
        this.playback.model.endTime || ''
      ]
      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const token = localStorage.getItem('token')
      fetch(url.join(''), {
        headers: new Headers({
          Auth: token
        }),
        responseType: 'blob'
      })
        .then(res => {
          return res.blob()
        })
        .then(res => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const href = URL.createObjectURL(blob)
          const alink = document.createElement('a')
          alink.href = href
          alink.download = `${this.playback.model.shipName}渔船轨迹数据.xlsx`
          alink.target = '_blank'
          alink.click()
          alink.remove()
        }).finally(() => {
          loading.close()
        })
    },
    getDetail (item) {
      this.selectTrawler(item, true)
    },
    handle (data) {
      switch (data.prop) {
        case 'edit': { // 规则配置
          this.rule.visible = true
          break
        }
        case 'export': {
          this.exportAnalysisList()
          break
        }
        case 'query': {
          this.changePage(1)
          break
        }
        default:
          break
      }
    },
    initData (flag) {
      // 清空地图报警图层
      const layer = window.$screen.vector.vector_analysis
      if (layer) {
        layer.clear()
      }
      const params = new FormData()
      params.append('alarmType', this.model.type)
      params.append('boatName', this.model.shipName || '')
      params.append('msgType', this.model.source || '')
      params.append('beginAlarmTime', this.model.startTime || '')
      params.append('endAlarmTime', this.model.endTime || '')
      params.append('acceptState', this.active)
      params.append('pageNo', this.pager.current)
      params.append('pageSize', this.pager.size)

      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.data = []
      this.axios.post(api.getAnalysisPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const status = [
            {
              color: 'wait',
              status: '待受理'
            },
            {
              color: 'pass',
              status: '已受理'
            },
            {
              color: 'over',
              status: '已办结'
            }
          ]
          this.data = res.result.records.map(item => {
            const state = item.acceptState - 0
            return {
              color: status[state].color,
              id: item.id,
              name: item.boatName,
              source: item.lastMsgType,
              status: status[state].status,
              time: item.alarmTime
            }
          })
          const total = res.result.pages
          const current = res.result.current
          this.pager.total = total
          this.pager.next = total === current ? 'disabled' : ''
          this.pager.prev = current === 1 ? 'disabled' : ''
        } else {
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        loading.close()
        // 默认查询第一个
        if (this.data.length) {
          this.selectTrawler(this.data[0], flag)
        }
      })
    },
    initPage () {
      const query = this.$route.query
      const params = this.$route.params
      this.type = query.type || params.type || this.sidebar[0].prop
      const data = this.sidebar.find(item => item.prop === this.type)
      this.title = data.label
      this.rule.edit = data.edit
      this.playback.model.shipName = ''
      // 查询项配置
      this.items = JSON.parse(JSON.stringify(items)).slice()
      // 围栏越界查询项单独修改
      const index = this.items.findIndex(item => item.prop === 'source')
      if (this.type === 'crossing') {
        this.items[index].options = items[index].options.slice()
      } else {
        this.items[index].options = items[index].options.slice(0, 3)
      }
      // this.model = Object.assign({}, model)
      this.model.type = data.key
      if (query.shipName) {
        this.model.shipName = query.shipName || params.shipName || ''
        this.$router.push({
          path: '/screen/analysis',
          query: {
            type: this.type
          }
        })
      }
      // 切换时关闭轨迹回放等
      this.closePlayBack()

      // 初始化时间
      const today = new Date()
      today.setHours(today.getHours() + 8)
      this.playback.model.endTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
      today.setDate(today.getDate() - 5)
      this.playback.model.beginTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
      // 关闭规则配置
      this.closeRuleConfig()
      // 获取报警开关状态
      this.initState()
      // 初始化数据
      this.initData()
    },
    initState () {
      const params = new FormData()
      params.append('type', this.model.type)

      this.axios.post(api.getAnalysisSwitchStatus, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const result = res.result
          this.$refs['app-title'].model.switch = !!(result[0].value - 0)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    loadPath (source, data) {
      const params = new FormData()
      params.append('shipName', data.boatName)
      params.append('bwlx', source)
      params.append('beginDate', this.playback.model.beginTime)
      params.append('endDate', this.playback.model.endTime)

      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.axios.post(api.getTrawlerTrack, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const result = res.result || []
          // 处理轨迹数据
          const path = result.map(item => {
            return [item.longitude - 0, item.latitude - 0]
          })
          path.push([data.lastLongitude - 0, data.lastLatitude - 0])
          if (this.type === 'reported') {
            this.loadRegion(data, path)
          } else {
            window.$screen.handleAnalysisEvent(this.type, data, path, null)
          }
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        loading.close()
      })
    },
    loadRegion (data) {
      this.axios.get(api.getRegion).then(response => {
        const res = response.data
        window.$screen.handleAnalysisEvent(this.type, data, null, res)
      }).catch(err => {
        console.error(err)
      })
    },
    selectTrawler (data, flag) {
      this.closePlayBack()

      const params = new FormData()
      params.append('id', data.id)
      // 保存当前船名及设备类型
      this.playback.model.shipName = data.name
      this.playback.model.type = data.source

      this.detail = {}
      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.axios.post(api.getAnalysisDetail, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (flag) {
            this.id = data.id
            this.time = new Date().getTime()
            this.detail = Object.assign({}, res.result)
            this.dialog.visible = true
          }
          // 判断是否要叠加渔船轨迹
          if (['crossing', 'fishing', 'reported', 'focus', 'bad-weather'].includes(this.type) && ['Beidou', 'AIS'].includes(data.source)) {
            this.loadPath(data.source, res.result)
          } else {
            // this.loadRegion(res.result)
            // 暂时注释
            window.$screen.handleAnalysisEvent(this.type, res.result, null, null)
          }
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        loading.close()
      })
    },
    toggleReview (active) {
      if (!this.playback.model.shipName) {
        return null
      }
      window.$screen.toggleReview(active, this.playback.model)
    },
    toggleVisible (visibility) {
      this.visibility = visibility ? 'visible' : ''
    },
    updateData () {
      this.changeType(2, true)
    }
  }
}
</script>

<style scoped>
.trawler-analysis {
  background-image: linear-gradient(180deg, rgba(25, 48, 128, 0.16) 1%, rgba(25, 48, 128, 0.8) 48%, rgba(25, 48, 128, 0) 100%);
  bottom: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  opacity: 0;
  padding-top: 20px;
  right: -350px;
  top: 63px !important;
  transition-duration: .3s;
  visibility: hidden;
  width: 320px;
}
.trawler-analysis.visible {
  opacity: 1;
  right: 30px;
  visibility: visible;
}
/* FORM */
.search-form {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-top: 12px;
  padding-left: 20px;
  padding-right: 20px;
}
.search-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 8px !important;
}
/* CONTROL */
.search-control {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: center;
  margin-bottom: 20px;
}
.search-control-item {
  background-image: linear-gradient(180deg, #29CCFF 0%, #2989FF 61%);
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: 'DINM';
  font-size: 15px;
  height: 36px;
  line-height: 36px;
  width: 88px;
}
.search-control-item:hover {
  background-image: linear-gradient(180deg, #2989FF 0%, #29CCFF 61%);
}
.search-control-item:first-child {
  margin-right: 20px;
}
/* STATUS */
.analysis-status-type {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  margin-bottom: 15px;
  margin-top: 12px;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
}
.analysis-status-type-item {
  border: 1px solid rgba(23, 74, 152, 1);
  background-color: rgba(23, 74, 152, 0.62);
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: 'YSHTR';
  font-size: 15px;
  height: 28px;
  line-height: 28px;
  width: 33.33%;
}
.analysis-status-type-item:not(:last-child) {
  margin-right: 19px;
}
.analysis-status-type-item.active {
  background-image: url('/img/screen/analysis/icon-analysis-type-active.png');
  background-size: 100% 100%;
  border: none;
  color: #ffd200;
  height: 30px;
  line-height: 30px;
}
/* LIST */
.analysis-list {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 15px;
  overflow-y: auto;
}
.analysis-item {
  background-image: linear-gradient(180deg, #134DA5 0%, rgba(19, 77, 165, 0.26) 98%);
  border-image: linear-gradient(180deg, rgba(56, 156, 236, 1), rgba(56, 156, 236, 0)) 1 1;
  border-style: solid;
  border-width: 1px;
  border-bottom: none;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  font-size: 14px;
  height: 76px;
  margin-bottom: 12px;
  position: relative;
  width: 280px;
}
.analysis-cell {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding-left: 14px;
  text-align: left;
  width: 100%;
}
.analysis-cell:not(:last-child) {
  margin-bottom: 10px;
}
.analysis-cell .label {
  margin-right: 5px;
}
.analysis-item .status {
  box-shadow: 0px 2px 4px 1px rgba(10, 46, 137, 0.91);
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  position: absolute;
  right: -3px;
  top: 7px;
  width: 42px;
}
.analysis-item .status.wait {
  background-image: linear-gradient(360deg, #084ACC 6%, #2DAFF8 100%);
}
.analysis-item .status.pass {
  background-image: linear-gradient(180deg, #00E7F7 0%, #67E07C 0%, #23B13B 100%);
}
.analysis-item .status.over {
  background-image: linear-gradient(142deg, #72A9D6 0%, #0E4FB0 97%);
}
/* ARROW */
.arrow-blue {
  bottom: 17px;
  height: 20px;
  pointer-events: all;
  position: absolute;
  right: 12px;
  width: 20px;
}
/* PAGER */
.trawler-pager {
  color: #FFFFFF;
  cursor: pointer;
  margin-bottom: 20px;
}
.pager-next,
.pager-prev {
  color: #FFFFFF;
  cursor: pointer;
}
.pager-next.disabled,
.pager-prev.disabled {
  color: rgba(171, 177, 200, 1);
  cursor: not-allowed;
}
</style>
<style>
.search-item label {
  color: rgba(171, 177, 200, 1);
  flex-shrink: 0;
  font-size: 15px;
}
</style>
