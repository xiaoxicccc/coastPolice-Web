<template>

  <div
    class="screen-map-server"
    :class="{'expend': expend}"
    @mouseenter="moveEnter"
    @mouseleave="moveLeave">

    <div
      v-for="(item, index) in list"
      class="screen-map-server-item"
      :key="index"
      :style="getStyle(item, index)"
      @click="toggle(item, index)">

      <img
        v-if="(!expend && !index) || expend"
        alt="ICON_MAP"
        class="icon-map"
        :src="`/img/map/icon-${item.key}${active === index ? '-active' : ''}.png`">

    </div>

  </div>

</template>

<script>
export default {
  name: 'screen-map-server',
  data () {
    return {
      active: 0,
      expend: false,
      list: [
        // {
        //   active: '',
        //   event: 'switch-base',
        //   index: 4, // 为保证当前为首页图层，提高优先级
        //   label: '地图',
        //   name: 'vector'
        // },
        {
          active: '',
          event: 'switch-base',
          index: 3,
          key: 'sea',
          label: '海图'
        },
        {
          active: 'active',
          color: 'rgba(0, 187, 255, .4)',
          event: 'switch-base',
          index: 2,
          key: 'image',
          label: '遥感'
        },
        {
          active: '',
          color: 'rgba(22, 127, 255, .4)',
          event: 'switch-base',
          index: 1,
          key: 'dark',
          label: '深色'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 动态改变当前图例的定位
     * @param e 当前图例信息
     * @param index 当前图例下标
    */
    getStyle (e, index) {
      return {
        'background-color': !this.expend && e.color ? e.color : 'transparent', // 未展开样式
        'border-radius': this.expend ? '0px' : '5px', // 未展开样式
        right: this.expend ? `${(index * 40) + (index + 1) * 4}px` : `${(index + 1) * 4}px`,
        'transition-duration': this.expend ? `${index * 0.2}s` : '0s',
        'z-index': e.index
      }
    },
    moveEnter () {
      this.expend = true
    },
    moveLeave () {
      this.expend = false
    },
    /**
     * 底图切换
     * @param e 当前图例信息
     * @param index 当前图例下标
     */
    toggle (e, index) {
      this.active = index
      this.$emit('toggle', e)
    }
  }
}
</script>

<style scoped>
.screen-map-server {
  background-color: transparent;
  cursor: pointer;
  border-radius: 5px;
  bottom: 220px;
  box-sizing: border-box;
  height: 48px;
  padding-bottom: 4px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 4px;
  position: fixed;
  right: 25px;
  transition-duration: .4s;
  width: 48px;
  z-index: 11;
}
.screen-map-server.expend {
  height: 48px;
  width: 138px;
}
.screen-map-server:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
/* ITEM */
.screen-map-server-item {
  border-radius: 0;
  height: 40px;
  position: absolute;
  /*right: 4px;*/
  top: 4px;
  width: 40px;
}
.screen-map-server-item .icon-map {
  height: 100%;
  width: 100%;
}
</style>
