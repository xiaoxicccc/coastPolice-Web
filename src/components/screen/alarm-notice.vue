<template>

  <!-- 报警通知弹窗 -->
  <div
    class="alarm-notice"
    :class="{'active': content}"
    @click="handle">

    <audio
      controls="controls"
      hidden
      id="audio"
      loop
      src="/file/warn.mp3">
    </audio>

    <img
      alt="ICON_ALARM"
      src="/img/screen/icon-alarm.png">

    <span>{{ content }}
    </span>

  </div>

</template>

<script>
export default {
  name: 'alarm-notice',
  data () {
    return {
      audio: null
    }
  },
  props: {
    content: {
      default: '',
      required: false,
      type: String
    }
  },
  watch: {
    content: 'initData'
  },
  mounted () {
    this.audio = document.querySelector('#audio')
  },
  methods: {
    handle () {
      this.$emit('handle')
    },
    initData () {
      if (this.content) {
        this.audio.play()
        setTimeout(() => {
          this.$emit('update:content', '')
          this.audio.pause()
        }, 1000 * 10)
      } else {
        this.audio.pause()
      }
    }
  }
}
</script>

<style scoped>
.alarm-notice {
  align-items: center;
  color: red;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  opacity: 0;
  position: fixed;
  right: -800px;
  top: 84px;
  transition-duration: .3s;
  visibility: hidden;
  z-index: 10;
}
.alarm-notice.active {
  opacity: 1;
  right: 30px;
  visibility: visible;
}
</style>
