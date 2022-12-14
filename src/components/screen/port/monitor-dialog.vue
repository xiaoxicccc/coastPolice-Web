<template>

  <div class="monitor-dialog">

    <div
      v-if="visibility"
      :class="['monitor-port-video']">

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

</template>

<script>
import appVideoPlayer from '@/components/common/video-comp'
export default {
  name: 'monitor-dialog',
  components: {
    'app-video-player': appVideoPlayer
  },
  data () {
    return {
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
  props: {
    code: {
      default: '',
      required: false,
      type: String
    }
  },
  watch: {
    code: 'initData'
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    initData () {
      this.visibility = false
      this.model.codes = [this.code]
      setTimeout(() => {
        this.visibility = true
        this.$nextTick(() => {
          this.$refs['video-preview'].ready().then(() => {
            this.$refs['video-preview'].setLayout(this.model.layout)
          })
        })
      }, 500)
    }
  }
}
</script>

<style scoped>
.monitor-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
/* VIDEO */
.monitor-port-video {
  height: 100%;
  width: 100%;
}
.video-window {
  height: 100%;
  width: 100%;
}
</style>
