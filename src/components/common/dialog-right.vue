<template>

  <div
    class="right-dialog-container"
    id="right-dialog-container">

    <vue-draggable-resizable
      class-name=""
      :h="60"
      ref="draggable-right-header"
      :resizable="false"
      :x="x"
      :y="y"
      :w="dialogConfig.width"
      @dragging="updatePosition">

      <div class="right-dialog-header">

        <span class="right-dialog-title">{{ title }}</span>

        <div class="right-dialog-icon">

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
        class="right-dialog-body">

        <slot>
        </slot>

      </div>

    </vue-draggable-resizable>

  </div>

</template>

<script>
export default {
  name: 'app-right-dialog',
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
    config: {
      default () {
        return {
          height: 500,
          width: 700
        }
      },
      required: false
    },
    level: {
      default () {
        return 0
      },
      required: false
    },
    title: {
      type: String
    }
  },
  activated () {
    // 此处是防止数据缓存时导致页面错位
    this.getPosition()
  },
  mounted () {
    this.container = document.querySelector('#right-dialog-container')
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
      this.bodyHeight = this.dialogConfig.height - 60

      this.x = width - this.dialogConfig.width - 10
      this.y = (height - this.dialogConfig.height) / 2

      this.$nextTick(() => {
        const header = this.$refs['draggable-right-header']
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
        this.$emit('enlarge')

        this.showOperation = false
        this.showSlot = true
        this.getPosition()
      }
    }
  }
}
</script>

<style scoped>
.right-dialog-container {
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
.right-dialog-header {
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
.right-dialog-header::after {
  background-color: rgba(234, 237, 241, 1);
  bottom: 0px;
  content: ' ';
  height: 2px;
  left: 20px;
  position: absolute;
  width: calc(100% - 40px);
}

.right-dialog-title {
  color: rgba(61, 61, 61, 1);
  font-size: 16px;
  font-weight: 400;
}

.close-icon {
  color: rgba(174, 174, 174, 1);
  cursor: pointer;
  margin-left: 10px;
}

.right-dialog-body {
  background-color: #FFF;
  box-shadow: 0 7px 7px 0 rgba(80, 80, 80, .2);
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
