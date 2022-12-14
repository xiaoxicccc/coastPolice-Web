<template>

  <div class="port-monitor">

    <div class="port-monitor-panel">

      <div class="port-monitor-info">

        <app-title
          title="预设方案列表">
        </app-title>

        <el-form
          class="port-monitor-form-filter"
          :model="model">

          <el-form-item
            class="port-monitor-item-filter"
            label="预设方案名称">

            <el-input
              v-model="model.name"
              class="plan-name"
              size="small"
              type="text">
            </el-input>

          </el-form-item>

          <el-form-item
            class="port-monitor-item-control">

            <div
              class="control"
              @click="initData">查询
            </div>

          </el-form-item>

        </el-form>

        <!--<el-form
          class="port-config-form-filter"
          :model="model">

          <el-form-item
            class="port-monitor-item-filter"
            label="视频code">

            <el-input
              v-model="model.code"
              class="plan-name"
              size="small"
              type="text">
            </el-input>

          </el-form-item>

          <el-form-item
            class="port-monitor-item-filter"
            label="appkey">

            <el-input
              v-model="model.appkey"
              class="plan-name"
              size="small"
              type="text">
            </el-input>

          </el-form-item>

          <el-form-item
            class="port-monitor-item-filter"
            label="ip">

            <el-input
              v-model="model.ip"
              class="plan-name"
              size="small"
              type="text">
            </el-input>

          </el-form-item>

          <el-form-item
            class="port-monitor-item-filter"
            label="port">

            <el-input
              v-model="model.port"
              class="plan-name"
              size="small"
              type="text">
            </el-input>

          </el-form-item>

          <el-form-item
            class="port-monitor-item-filter"
            label="secret">

            <el-input
              v-model="model.secret"
              class="plan-name"
              size="small"
              type="text">
            </el-input>

          </el-form-item>

          <el-form-item
            class="port-monitor-item-filter"
            label="配置方案">

            <el-input
              v-model="model.layout"
              class="plan-name"
              size="small"
              type="text">
            </el-input>

          </el-form-item>

          <el-form-item
            class="port-monitor-item-filter">

            <el-button
              plain
              size="small"
              type="primary"
              @click="player">确定
            </el-button>

          </el-form-item>

        </el-form>-->

        <!-- 暂时注释 -->
        <ul class="port-monitor-list">

          <li
            v-for="(item, i) in data"
            :class="['port-monitor-item', 'label', active === i ? 'active' : '']"
            :key="i"
            @click="handleChangePlan(item, i)">{{ `${item.label}(${item.number})` }}
          </li>

        </ul>

      </div>

      <div class="port-monitor-info">

        <app-title
          title="视频监控点">
        </app-title>

        <ul class="port-monitor-list">

          <li
            v-for="(item, i) in data.length ? data[active].children : []"
            :class="['port-monitor-item']"
            :key="i">

            <img
              alt="ICON_VIDEO"
              class="icon-video"
              src="/img/screen/monitor/icon-video.png">

            <span>{{ item.label }}</span>

          </li>

        </ul>

      </div>

    </div>

    <div class="port-monitor-player">

      <div class="port-monitor-header">

        <span class="label">全景监控
        </span>

        <span
          class="close"
          @click="close()">✖
        </span>

      </div>

      <div
        v-if="visibility"
        :class="['port-video']">

        <div class="video-window">

          <app-video-player
            ref="video-preview"
            :appkey="model.appkey"
            :cameraIndexCode="model.codes"
            :ip="model.ip"
            :layout="model.layout"
            :port="model.port"
            :secret="model.secret">
          </app-video-player>

        </div>

      </div>

    </div>

  </div>

</template>

<script>
/* eslint-disable */
import api from '@/util/api'
import appTitle from '@/components/screen/title'
import appVideoPlayer from '@/components/common/video-comp'
export default {
  name: 'port-monitor',
  components: {
    'app-title': appTitle,
    'app-video-player': appVideoPlayer
  },
  data () {
    return {
      active: 0,
      data: [
      ],
      model: {
        appkey: '27774540',
        code: '370601191001310000585',
        codes: ['370601191001310000585'],
        ip: '56.80.192.31',
        layout: '1x1',
        name: null,
        port: 443,
        secret: 'LpuLABtP46al0bNXXGrr'
      },
      visibility: false
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$router.push({
        path: '/screen'
      })
    },
    handleChangePlan (data, index) {
      this.active = index
      this.player(data)
    },
    initData () {
      // 暂时使用
      // this.player()

      const params = new FormData()
      params.append('pageNo', 1)
      params.append('pageSize', -1)
      params.append('key', this.model.name || '')

      this.data = []
      this.axios.post(api.getVideoSchemePage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = res.result.records || []
          this.data = data.map(item => {
            return {
              label: item.name,
              layout: item.layout,
              number: JSON.parse(item.videos).length,
              children: JSON.parse(item.videos)
            }
          })
          // 默认加载第一项
          if (this.data.length) {
            this.player(this.data[0])
          }
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    player (data) {
      this.visibility = false
      // 默认加载
      // this.model.codes = this.model.code.split(',')
      this.model.codes = data.children.map(item => {
        return item.code
      })
      switch (data.number) {
        case 1: {
          this.model.layout = '1x1'
          break
        }
        case 2: {
          this.model.layout = '1x2'
          break
        }
        case 4: {
          this.model.layout = '2x2'
          break
        }
        case 9: {
          this.model.layout = '3x3'
          break
        }
        default: {
          break
        }
      }
      setTimeout(() => {
        this.visibility = true
        this.$nextTick(() => {
          this.$refs['video-preview'].ready().then(() => {
            // this.$refs['video-preview'].handlePreview(this.codes)
            this.$refs['video-preview'].setLayout(this.model.layout)
          })
        })
      }, 500)
    }
  }
}
</script>

<style scoped>
.port-monitor {
  position: relative;
  z-index: 10;
}
/* PANEL */
.port-monitor-panel {
  background: linear-gradient(180deg, rgba(25, 48, 128, 0.16) 1%, rgba(25, 48, 128, 0.8) 48%, rgba(25, 48, 128, 0) 100%);
  bottom: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  left: 30px;
  padding-top: 20px;
  position: fixed;
  top: 120px;
  width: 320px;
}
/* INFO */
.port-monitor-info {
  display: flex;
  flex-direction: column;
  height: 50%;
}
/* FORM */
.port-monitor-form-filter {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}
.port-monitor-item-filter {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 0;
}
.port-monitor-item-control {
  flex-shrink: 0;
  margin-bottom: 0;
  margin-left: 10px;
}
.port-monitor-item-control .control {
  border: 1px solid rgba(56, 156, 236, 0.6);
  color: white;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  padding-left: 8px;
  padding-right: 8px;
}
.port-monitor-item-control .control:hover {
  background-color: rgba(56, 156, 236, 0.6);
}
/* CONFIG */
.port-config-form-filter {
  display: flex;
  flex-direction: column;
}
/* LIST */
.port-monitor-list {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}
.port-monitor-item {
  align-items: center;
  background-color: rgba(19, 77, 165, 0.4);
  border: 1px solid rgba(56, 156, 236, 0.6);
  box-sizing: border-box;
  color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: row;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  padding-left: 8px;
  text-align: left;
  width: 100%;
}
.port-monitor-item:not(:last-child) {
  margin-bottom: 20px;
}
.port-monitor-item.active {
  border-color: rgba(136, 199, 250, 1);
}
.port-monitor-item.label {
  cursor: pointer;
}
/* ICON */
.icon-video {
  height: 24px;
  margin-right: 6px;
  width: 24px;
}
/* PLAYER */
.port-monitor-player {
  background-color: rgba(0, 10, 45, 0.8);
  bottom: 110px;
  display: flex;
  flex-direction: column;
  left: 432px;
  position: fixed;
  right: 206px;
  top: 179px;
  z-index: 10;
}
.port-monitor-header {
  align-items: center;
  background: linear-gradient(180deg, rgba(2, 31, 75, 0.1) 0%, rgba(4, 42, 117, 0.7) 97%);
  border-left: 2px solid rgba(2, 222, 255, 0.6);
  display: flex;
  flex-direction: row;
  height: 36px;
  justify-content: space-between;
  width: 100%;
}
.port-monitor-header .label {
  color: rgba(2, 222, 255, 1);
  font-family: 'PHTM';
  font-size: 16px;
  margin-left: 10px;
}
.port-monitor-header .close {
  color: rgba(74, 160, 207, 1);
  cursor: pointer;
  font-size: 16px;
  margin-right: 20px;
}
/* VIDEO */
.port-video {
  flex-grow: 1;
}
.video-window {
  height: 100%;
  width: 100%;
}
</style>
<style>
.port-monitor-item-filter label {
  color: white;
  flex-shrink: 0;
}
</style>
