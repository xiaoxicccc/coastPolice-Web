<template>

  <div
    class="dialog-screen-container"
    id="dialog-screen-container">

    <vue-draggable-resizable
      class-name=""
      :h="36"
      ref="draggable-header"
      :resizable="false"
      :x="x"
      :y="y"
      :w="dialogConfig.width"
      @dragging="updatePosition">

      <div
        class="dialog-screen-header"
        @mousedown="moveing('start')"
        @mouseup="moveing('end')">

        <div class="dialog-screen-header-inner">

          <span class="label">{{ title }}</span>

          <span
            class="close"
            @click="() => $emit('close')">✖
          </span>

        </div>

      </div>

    </vue-draggable-resizable>

    <vue-draggable-resizable
      :draggable="false"
      class-name=""
      :h="bodyHeight"
      :resizable="false"
      :x="offsetX"
      :y="offsetY"
      :w="dialogConfig.width">

      <div
        v-show="showSlot"
        class="dialog-screen-body">

        <slot>
        </slot>

      </div>

    </vue-draggable-resizable>

  </div>

</template>

<script>
export default {
  name: 'dialog-screen',
  data () {
    return {
      bodyHeight: 400,
      container: null,
      dialogConfig: {
        height: 500,
        width: 700
      },
      showOperation: false,
      showSlot: true,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0
    }
  },
  props: {
    config: { // 弹窗大小
      default () {
        return {
          height: 500,
          width: 700
        }
      },
      required: false
    },
    level: { // 当一个页面中存在多个弹窗时，设置不同层级的level可避免弹窗收起时叠到一起
      default () {
        return 0
      },
      required: false,
      type: Number
    },
    title: { // 弹窗标题
      default: '标题',
      required: false,
      type: String
    }
  },
  activated () {
    // 此处是防止数据缓存时导致页面错位
    this.getPosition()
  },
  mounted () {
    this.container = document.querySelector('#dialog-screen-container')
    this.getPosition()

    window.addEventListener('resize', this.resize)
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
  },
  watch: {
    config: 'getPosition'
  },
  methods: {
    getPosition () {
      this.dialogConfig = Object.assign({}, this.config)
      const height = this.container.clientHeight
      const width = this.container.clientWidth
      this.bodyHeight = this.dialogConfig.height - 30

      this.x = (width - this.dialogConfig.width) / 2 + 108
      this.y = (height - this.dialogConfig.height) / 2

      this.$nextTick(() => {
        const header = this.$refs['draggable-header']
        this.offsetX = header.left
        this.offsetY = header.top
      })
    },
    moveing (e) {
      this.$emit('dragging', e)
    },
    resize () {
      this.getPosition()
      this.zoom('enlarge')
    },
    updatePosition (x, y) {
      this.offsetX = x
      this.offsetY = y
    },
    zoom (bool) {
      if (bool === 'narrow') {
        this.showOperation = true
        this.dialogConfig.height = 60
        this.dialogConfig.width = 240
        this.showSlot = false
        this.x = this.container.clientWidth - 252
        this.y = 100 + 65 * (this.level || 0)
      }

      if (bool === 'enlarge') {
        this.showOperation = false
        this.showSlot = true
        this.getPosition()
      }
      this.$emit('zoom', bool)
    }
  }
}
</script>

<style scoped>
.dialog-screen-container {
  background-color: transparent;
  left: 0px;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 100;
}

/* .dialog-wrapper {
  background-color: #FFF;
  border: 1px solid #F2F4F8;
  box-shadow: 0 0 14px 0 rgba(80, 80, 80, .5);
  box-sizing: border-box;
  height: 100%;
  max-height: calc(100vh - 100px);
  padding: 17px 20px;
  pointer-events: all;
  position: absolute;
  width: 100%;
  z-index: 100;
} */

.dialog-screen-header {
  background-color: rgba(0, 10, 45, 0.8);
  /*box-shadow: 0 -7px 14px 0 rgba(80, 80, 80, .2);*/
  box-sizing: border-box;
  cursor: move;
  height: 36px;
  justify-content: space-between;
  /*padding-bottom: 16px;*/
  /*padding-left: 20px;*/
  /*padding-right: 20px;*/
  /*padding-top: 17px;*/
  pointer-events: all;
  position: relative;
  z-index: 100;
}
.dialog-screen-header-inner {
  align-items: center;
  background: linear-gradient(180deg, rgba(2, 31, 75, 0.1) 0%, rgba(4, 42, 117, 0.7) 97%);
  border-left: 2px solid rgba(2, 222, 255, 0.6);
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
  width: 100%;
}

.dialog-screen-header-inner .label {
  color: rgba(2, 222, 255, 1);
  font-family: 'PHTM';
  font-size: 16px;
  margin-left: 10px;
}

.dialog-screen-header-inner .close {
  color: rgba(74, 160, 207, 1);
  cursor: pointer;
  font-size: 16px;
  margin-right: 20px;
}

.dialog-screen-body {
  background-color: rgba(0, 10, 45, 0.8);
  /*box-shadow: 0 7px 7px 0 rgba(80, 80, 80, .2);*/
  box-sizing: border-box;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 17px;
  padding-left: 20px;
  padding-right: 20px;
  pointer-events: all;
  position: relative;
  z-index: 100;
}
.slot-wrapper {
  background-color: #FFF;
  width: 100%;
}
</style>
