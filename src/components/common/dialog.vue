<template>

  <div
    class="dialog-container"
    id="dialog-container">

    <vue-draggable-resizable
      class-name=""
      :h="60"
      ref="draggable-header"
      :resizable="false"
      :x="x"
      :y="y"
      :w="dialogConfig.width"
      @dragging="updatePosition">

      <div
        class="dialog-header">

        <span class="dialog-title">{{ title }}</span>

        <div class="dialog-icon">

          <i
            v-if="!showOperation"
            class="el-icon-minus close-icon"
            @click="zoom('narrow')"></i>

          <i
            v-else
            class="el-icon-full-screen close-icon"
            @click="zoom('enlarge')"></i>

          <i
            class="el-icon-close close-icon"
            @click="() => $emit('close')"></i>

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

      <div v-show="showSlot"
        class="dialog-body">

        <slot>
        </slot>

      </div>

    </vue-draggable-resizable>

  </div>

</template>

<script>
export default {
  name: 'app-dialog-remove',
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
    this.container = document.querySelector('#dialog-container')
    this.getPosition()

    window.addEventListener('resize', this.resize)

    window.onresize = () => {
      this.getPosition()
    }
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
      this.bodyHeight = this.dialogConfig.height - 60

      this.x = (width - this.dialogConfig.width) / 2 + 108
      this.y = (height - this.dialogConfig.height) / 2

      this.$nextTick(() => {
        const header = this.$refs['draggable-header']
        this.offsetX = header.left
        this.offsetY = header.top
      })
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
.dialog-container {
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

.dialog-header {
  align-items: center;
  background-color: #FFF;
  box-shadow: 0 -7px 14px 0 rgba(80, 80, 80, .2);
  box-sizing: border-box;
  cursor: move;
  display: flex;
  flex-direction: row;
  height: 60px;
  justify-content: space-between;
  padding-bottom: 16px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 17px;
  pointer-events: all;
  position: relative;
  z-index: 100;
}
.dialog-header::after {
  background-color: rgba(234, 237, 241, 1);
  bottom: 0px;
  content: ' ';
  height: 2px;
  left: 20px;
  position: absolute;
  width: calc(100% - 40px);
}

.dialog-title {
  color: rgba(61, 61, 61, 1);
  font-size: 16px;
  font-weight: 400;
}

.close-icon {
  color: rgba(174, 174, 174, 1);
  cursor: pointer;
  margin-left: 10px;
}

.dialog-body {
  background-color: #FFF;
  box-shadow: 0 7px 7px 0 rgba(80, 80, 80, .2);
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
