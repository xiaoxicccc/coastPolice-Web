<template>

  <div class="analysis-detail">

    <div class="title">

      <span>报警详情-{{ detail.boatName }}
      </span>

      <i
        class="el-icon-close icon-close"
        @click="close">
      </i>

    </div>

    <div style="flex-grow: 1; overflow-y: auto;">

      <div
        v-for="(item, i) in data"
        class="flow-item"
        :key="i">

        <div :class="['flow-status', getColorClass(item.flag, item.status)]">

          <span class="status-text">{{ formatStatus(item.status) }}
          </span>

          <i class="iconfont iconxiajiantou flow-icon">
          </i>

        </div>
        <!-- 详情流程线 -->
        <div class="status-icon">

          <span
            class="status-line active"
            :class="[i === 0 ? 'hidden' : '']">
          </span>

          <img class="icon" :src="item.src" alt="SPOT_ICON">

          <span
            :class="[(data.length > 1 && i === data.length - 1) ? 'hidden' : '']"
            class="status-line active">
          </span>

        </div>

        <!-- 详情内容 -->
        <ul class="flow-content">

          <template v-for="(spot, idx) in items">

            <li
              v-if="item[spot.key]"
              class="content-item"
              :key="idx">

              <span class="item-label">{{ spot.label }}：</span>

              <el-image
                v-if="spot.type === 'image'"
                style="width: 100px; height: 100px"
                :src="item[spot.key]"
                :preview-src-list="[item[spot.key]]">
              </el-image>

              <span
                v-else
                class="app-item-content">{{ item[spot.key] }}</span>

            </li>

          </template>

        </ul>

      </div>

    </div>

    <!-- 填写标记 -->
    <div class="flow-fill" v-if="data.length > 1 && !model.status && model.mark">

      <span class="fill-label">标记结束</span>

      <el-input
        v-model="model.value"
        placeholder="请输入标记结束描述"
        size="small">
      </el-input>

      <span
        class="button"
        @click="throttle(1000)">提 交
      </span>

    </div>

    <template v-if="data.length > 1 && model.status && model.mark">

      <div class="flow-fill">

        <span class="fill-label">标记结束</span>

        <el-input
          v-model="model.value"
          readonly
          size="small">
        </el-input>

      </div>

      <div class="flow-fill-readonly">

        <span class="fill-label">结束时间</span>

        <el-input
          v-model="model.endTime"
          readonly
          size="small">>
        </el-input>

      </div>

    </template>

  </div>

</template>

<script>
import api from '@/util/api'
import blue from '../../../../public/img/screen/analysis/icon-grey-blue-icon.png'
import yellow from '../../../../public/img/screen/analysis/icon-yellow-icon.png'
export default {
  name: 'analysis-detail',
  data () {
    return {
      data: [],
      items: [
        {
          label: '船名号',
          key: 'shipName'
        },
        {
          label: '母港',
          key: 'homePorts'
        },
        {
          label: '时间',
          key: 'time'
        },
        {
          label: '通知时间',
          key: 'noticeTime'
        },
        {
          label: '地点',
          key: 'address'
        },
        {
          label: '类型',
          key: 'type'
        },
        {
          label: '电量',
          key: 'power'
        },
        {
          label: '渔船经营人',
          key: 'ownerName'
        },
        {
          label: '联系方式',
          key: 'ownerTel'
        },
        {
          label: '描述',
          key: 'describe'
        },
        {
          label: '姓名',
          key: 'name'
        },
        {
          label: '状态',
          key: 'state'
        },
        {
          label: '情况',
          key: 'situation'
        },
        {
          label: '结果',
          key: 'result'
        },
        {
          label: '凭证',
          key: 'img',
          type: 'image'
        }
      ],
      model: {
        endTime: '',
        mark: true,
        status: false,
        value: ''
      }
    }
  },
  props: {
    detail: {
      default () {
        return {
        }
      },
      required: false,
      type: Object
    },
    id: {
      default: 0,
      required: false,
      type: Number
    },
    time: {
      default: 0,
      required: false,
      type: Number
    }
  },
  watch: {
    time: 'initData'
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    formatStatus (data) {
      let status = '处 置'
      switch (data - 0) {
        case 0:
          status = '发 布'
          break
        case 1:
          status = '受 理'
          break
        case 2:
          status = '处 置'
          break
        default:
          status = '处 置'
          break
      }
      return status
    },
    getColorClass (flag, status) {
      flag = flag - 0
      status = status - 0
      return (flag === 1 && status === 2) || (flag === 0 && status === 1) ? 'yellow-text' : ''
    },
    initData () { // 根据现有数据构造流程格式
      this.model.value = ''
      const state = this.detail.acceptState - 0
      let status = ''
      switch (state) {
        case -1:
          status = '待通知'
          break
        case 0:
          status = '待受理'
          break
        case 1:
          status = '处理中'
          break
        case 2:
          status = '已处理'
          break
        case 3:
          status = '标记结束'
          break
        default:
          break
      }
      this.data = []
      switch (state) {
        case -1: {
          this.model.status = false
          this.model.mark = true
          this.data = [
            {
              status: 0,
              shipName: this.detail.boatName,
              time: this.detail.alarmTime,
              noticeTime: this.noticeTime,
              src: blue,
              // address: res.layoutArea,
              type: this.detail.alarmType + `${this.detail.markName || ''}`,
              homePorts: this.detail.homePortName,
              ownerName: this.detail.ownerName,
              ownerTel: this.detail.ownerPhone,
              state: '待通知',
              flag: state
            }
          ]
          break
        }
        case 0: {
          this.model.status = false
          this.model.mark = true
          this.data = [
            {
              status: 0,
              shipName: this.detail.boatName,
              time: this.detail.alarmTime,
              noticeTime: this.noticeTime,
              src: blue,
              // address: res.layoutArea,
              type: this.detail.alarmType + `${this.detail.markName || ''}`,
              homePorts: this.detail.homePortName,
              ownerName: this.detail.ownerName,
              ownerTel: this.detail.ownerPhone,
              flag: state
            },
            {
              status: 1,
              src: yellow,
              state: '待受理',
              flag: state
            }
          ]
          break
        }
        case 1: {
          this.model.status = false
          this.model.mark = true
          this.data = [
            {
              status: 0,
              shipName: this.detail.boatName,
              time: this.detail.alarmTime,
              noticeTime: this.noticeTime,
              src: blue,
              // address: res.layoutArea,
              type: this.detail.alarmType + `${this.detail.markName || ''}`,
              homePorts: this.detail.homePortName,
              ownerName: this.detail.ownerName,
              ownerTel: this.detail.ownerPhone,
              flag: state
            },
            {
              status: state,
              time: this.detail.acceptTime,
              src: blue,
              name: this.detail.acceptPerson,
              state: '受理了处置任务',
              flag: state
            },
            {
              status: 2,
              src: yellow,
              state: '处理中',
              flag: state
            }
          ]
          break
        }
        case 2:
        case 3:
          if (state === 2) {
            this.model.mark = false
          } else if (state === 3) {
            this.model.mark = true
            this.model.status = true
            this.endTime = this.detail.markEndTime
            this.value = this.detail.markEndReason
          }
          this.data = [
            {
              status: 0,
              shipName: this.detail.boatName,
              noticeTime: this.noticeTime,
              time: this.detail.alarmTime,
              src: blue,
              // address: res.layoutArea,
              type: this.detail.alarmType + `${this.detail.markName || ''}`,
              homePorts: this.detail.homePortName,
              ownerName: this.detail.ownerName,
              ownerTel: this.detail.ownerPhone,
              flag: state
            },
            {
              status: 1,
              time: this.detail.acceptTime,
              src: blue,
              name: this.detail.acceptPerson,
              state: status,
              flag: state
            },
            {
              img: this.detail.disposeImage && this.detail.disposeImage !== 'undefined' ? `${api.getImgUrl}${this.detail.disposeImage}` : '',
              status: state,
              time: this.detail.disposeTime,
              src: blue,
              name: this.detail.acceptPerson,
              state: status,
              situation: this.detail.situationInfo,
              result: this.detail.resultInfo,
              flag: state
            }
          ]
          break
        default:
          break
      }
    },
    submit () {
      if (!this.model.value) {
        this.$message.warning('请先填写结束描述后再提交！')
        return null
      }
      const params = new FormData()
      params.append('id', this.id)
      params.append('markEndReason', this.model.value)

      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.axios.post(api.markEndAnalysis, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$emit('update', true)
          this.$EventBus.$emit('update-number')
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        loading.close()
      })
    },
    throttle (delay) {
      // last为上一次触发回调的时间, timer是定时器
      let last = 0
      let timer = null
      // 将throttle处理结果当作函数返回
      const run = () => {
        // 保留调用时的this上下文
        // 保留调用时传入的参数
        // 记录本次触发回调的时间
        const now = +new Date()
        // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
        if (now - last < delay) {
          // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
          clearTimeout(timer)
          timer = setTimeout(() => {
            last = now
            this.submit()
          }, delay)
        } else {
          // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
          last = now
          this.submit()
        }
      }
      return run()
    }
  }
}
</script>

<style scoped>
.analysis-detail {
  background-color: rgba(0, 10, 45, 0.8);
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  height: 400px;
  left: 50%;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 560px;
  z-index: 10;
}
/* TITLE */
.analysis-detail .title {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
}
.analysis-detail .icon-close {
  cursor: pointer;
}
/* LIST */
.flow-item {
  display: flex;
  flex-direction: row;
}
.flow-status {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.status-text {
  padding: 5px 18px;
  border-radius: 3px;
  background-color: rgba(22, 127, 255, 0.5);
  color: #FFF;
  font-size: 14px;
  font-weight: 300;
  transform: translateX(.3px);
}
.flow-icon {
  font-size: 12px;
  color: rgba(2, 255, 255, .3);
  transform: translateX(-2px) rotate(-90deg);
}
.yellow-text > .status-text {
  background-color: rgba(255, 217, 103, .5);
}
.yellow-text > .flow-icon {
  color: rgba(255, 217, 103, .25);
}
.status-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 6px;
  margin-right: 15px;
}
.icon {
  flex-shrink: 0;
}
.status-line {
  width: 3px;
  height: 100%;
  background-color: rgba(2, 255, 255, .3);
}
.status-line.active {
  background-color: #167FFF;
}
.flow-content {
  background-color: rgba(11, 201, 237, 0.1);
  border: 1px solid #167FFF;
  margin-bottom: 20px;
  padding: 11px 13px 17px 13px;
  text-align: left;
  width: 370px;
}
.hidden {
  opacity: 0;
}
.flow-path .flow-item:not(:last-child) .flow-content {
  margin-bottom: 24px;
}
.content-item {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  margin-bottom: 4px;
}
.item-label {
  font-size: 14px;
  color: #999;
}
.app-item-content {
  font-size: 14px;
}
.item-content {
  font-size: 14px;
  color: #FFF;
}
.flow-fill {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  padding-top: 20px;
  padding-left: 38px;
  padding-right: 20px;
  border-top: 1px solid rgba(11, 201, 237, .3);
}
.flow-fill-readonly {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 10px;
  padding-left: 38px;
  padding-right: 20px;
}
.fill-label {
  flex-shrink: 0;
  color: #FFF;
  font-size: 14px;
  font-weight: 300;
  margin-right: 35px;
}
.flow-fill .button {
  cursor: pointer;
  display: inline-block;
  width: 74px;
  height: 30px;
  line-height: 30px;
  color: #FFF;
  background: linear-gradient(0deg, rgba(11, 243, 237, .5) 0%, rgba(0, 113, 255, .5) 100%);
  border-radius: 3px;
  border: 0;
  margin-left: 17px;
}
</style>
