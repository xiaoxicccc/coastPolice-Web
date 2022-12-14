<template>

  <div :class="['analysis-sidebar', visibility]">

    <div :class="['analysis-sidebar-inner', visible]">

      <img
        alt="BACKGROUND_ICON"
        class="sidebar-background"
        src="/img/screen/analysis/icon-sidebar-background.png">

      <img
        alt="ARROW_ICON"
        class="arrow-icon"
        src="/img/screen/analysis/icon-sidebar-left.png"
        @click="handle('put-away', null)">

      <ul class="list">

        <li
          v-for="(item, i) in list"
          :class="['item', getClass(item)]"
          :key="i"
          :style="getModeStyle(item)"
          @click="handle('change', item.prop)">{{ item.label }}
        </li>

      </ul>

    </div>

    <img
      alt="ARROW_ICON"
      :class="['arrow-right-icon', visible]"
      src="/img/screen/analysis/icon-sidebar-left.png"
      @click="handle('open', null)">

  </div>

</template>

<script>
import {
  list
} from './configs'

export default {
  name: 'analysis-sidebar',
  data () {
    return {
      active: 'fishing',
      list: list.slice(),
      visible: '',
      visibility: ''
    }
  },
  watch: {
    $route: 'initData'
  },
  mounted () {
    this.toggleVisibility(true)
    this.toggleVisible(true)
    this.initData()
  },
  destroyed () {
    this.toggleVisibility(false)
    this.toggleVisible(false)
  },
  methods: {
    getClass (data) {
      return data.prop === this.active ? 'active' : ''
    },
    getModeStyle (data) {
      return {
        'animation-delay': `${data.delay}s`,
        'transition-delay': `${data.delay}s`
      }
    },
    handle (type, data) {
      switch (type) {
        case 'change':
          this.$router.push({
            path: '/screen/analysis',
            query: {
              type: data
            }
          })
          // this.$router.push({
          //   name: 'trawler-analysis',
          //   params: {
          //     type: data
          //   }
          // })
          break
        case 'open':
          this.toggleVisible(true)
          break
        case 'put-away':
          this.toggleVisible(false)
          break
        default:
          break
      }
    },
    initData () {
      const query = this.$route.query
      const params = this.$route.params
      this.active = query.type || params.type || this.list[0].prop
    },
    toggleVisible (visible) {
      this.visible = visible ? 'visible' : ''
    },
    toggleVisibility (visibility) {
      this.visibility = visibility ? 'visible' : ''
    }
  }
}
</script>

<style scoped>
.analysis-sidebar {
  /*height: 825px;*/
  bottom: 90px;
  left: -197px;
  opacity: 0;
  top: 130px;
  transition-duration: .3s;
  visibility: hidden;
  width: 197px;
}
.analysis-sidebar.visible {
  left: 0;
  opacity: 1;
  visibility: visible;
}
.analysis-sidebar-inner {
  box-sizing: border-box;
  height: 100%;
  left: -197px;
  opacity: 0;
  padding-left: 30px;
  position: absolute;
  top: 0;
  transition-duration: .3s;
  visibility: hidden;
  width: 100%;
}
.analysis-sidebar-inner.visible {
  left: 0;
  opacity: 1;
  visibility: visible;
}
/* BACKGROUND */
.sidebar-background {
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  width: 94px;
}
/* ICON */
.arrow-icon {
  cursor: pointer;
  height: 66px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
}
.arrow-right-icon.visible {
  opacity: 0;
  transition-delay: 0s;
  visibility: hidden;
}
.arrow-right-icon {
  cursor: pointer;
  height: 66px;
  left: 0px;
  position: absolute;
  top: 50%;
  transform: rotateY(180deg) translateY(-50%);
  transition-delay: 0.3s;
  transition-duration: .3s;
  width: 28px;
  opacity: 1;
  visibility: visible;
}
/* LIST */
.analysis-sidebar .list {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.analysis-sidebar .item {
  background-image: url('/img/screen/analysis/icon-sidebar-item-background.png');
  background-size: 100% 100%;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: 'YSHTR';
  font-size: 16px;
  height: 31px;
  line-height: 31px;
  width: 116px;
}
.analysis-sidebar .item.active {
  background-image: url('/img/screen/analysis/icon-sidebar-item-active-background.png');
}
.analysis-sidebar .item:not(:last-child) {
  margin-bottom: 30px;
}
</style>
