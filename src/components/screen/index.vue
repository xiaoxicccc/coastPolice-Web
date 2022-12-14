<template>

  <div class="screen">

    <app-screen-header>
    </app-screen-header>

    <app-screen-map>
    </app-screen-map>

    <router-view
      name="default">
    </router-view>

    <router-view
      class="layout-sider"
      name="left">
    </router-view>

    <router-view
      class="layout-sider"
      name="right">
    </router-view>

    <screen-dialog
      v-if="monitor.visible"
      :config="monitor.config"
      title="视频监控"
      @close="closeMonitor"
      @dragging="draggingMonitor">

      <!-- 视频监控 -->
      <screen-monitor-dialog
        v-if="monitor.player"
        :code="monitor.code">
      </screen-monitor-dialog>

    </screen-dialog>

  </div>

</template>

<script>
import screenDialog from '@/components/common/dialog-screen'
import screenHeader from './header'
import screenMap from '@/components/map/screen-map'
import screenMonitorDialog from '@/components/screen/port/monitor-dialog'
export default {
  name: 'screen',
  components: {
    'screen-dialog': screenDialog,
    'app-screen-header': screenHeader,
    'app-screen-map': screenMap,
    'screen-monitor-dialog': screenMonitorDialog
  },
  data () {
    return {
      monitor: {
        code: '',
        config: {
          height: 672,
          width: 900
        },
        player: false,
        visible: false
      }
    }
  },
  mounted () {
    this.$EventBus.$on('toggle-monitor-dialog', (e) => {
      this.toggleMonitorDialog(e)
    })
  },
  methods: {
    closeMonitor () {
      this.monitor.visible = false
      this.monitor.player = false
    },
    draggingMonitor (e) {
      switch (e) {
        case 'move':
        case 'end': {
          this.monitor.player = true
          break
        }
        case 'over':
        case 'start': {
          this.monitor.player = false
          break
        }
        default: {
          break
        }
      }
    },
    toggleMonitorDialog (e) {
      if (!e.videoCode) {
        this.$message.warning('该监控视频未接入，请查看其他监控视频！')
        return null
      }
      this.monitor.visible = true
      this.monitor.player = true
      this.monitor.code = e.videoCode
    }
  }
}
</script>

<style scoped>
.screen {
  /*background-color: #04115C;*/
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}
.layout-sider {
  bottom: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 120px;
  z-index: 10;
}
</style>
