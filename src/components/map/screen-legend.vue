<template>

  <div
    :class="['screen-legend', expend]">

    <ul
      class="screen-legend-item">

      <li
        v-for="(_item, index) in plugins.data"
        :class="['screen-legend-card', _item.active ? plugins[_item.active] : '']"
        :key="index"
        @click="handlePluginEvent(_item.event, '', -1)">

        <img
          alt="ICON_LEGEND"
          class="map-plugin-icon"
          :src="`/img/screen/legend/icon-legend-${_item.icon}.png`">

        <span
          v-if="_item.popup"
          class="map-plugin-popup">{{ _item.popup }}
        </span>

        <ul
          v-if="_item.options"
          class="map-plugin-sublist"
          :style="{ width: _item.width }">

          <li
            v-for="(option, optId) in _item.options"
            :class="['map-plugin-subitem', option.active]"
            :key="optId"
            @click="handlePluginEvent(option.event, option.name, optId)">

              <span
                v-if="option.icon"
                :class="['map-plugin-subicon', option.icon]">
              </span>

              <span class="label">{{ option.label }}
              </span>

              <span v-if="option.value">({{ option.value }})
              </span>

          </li>

        </ul>

      </li>

    </ul>

  </div>

</template>

<script>
export default {
  name: 'screen-legend',
  data () {
    return {
      expend: '',
      plugins: {
        area: '',
        base: 1,
        circle: '',
        data: [
          {
            event: 'toggle-trawler',
            icon: 'trawler',
            name: 'legend',
            options: [
              {
                active: 'active',
                event: 'toggle-layer',
                icon: 'ais',
                label: 'AIS(在线/离线)',
                name: 'AIS',
                type: 'AIS',
                value: 0
              },
              {
                active: 'active',
                event: 'toggle-layer',
                icon: 'beidou',
                label: '北斗(在线/离线)',
                name: 'Beidou',
                type: 'Beidou',
                value: 0
              },
              {
                active: 'active',
                event: 'toggle-layer',
                icon: 'radar-ais',
                label: '雷达-AIS(在线/离线)',
                name: 'Radar-AIS',
                type: 'Radar-AIS',
                value: 0
              },
              {
                active: 'active',
                event: 'toggle-layer',
                icon: 'radar',
                label: '雷达(在线/离线)',
                name: 'Radar',
                type: 'Radar',
                value: 0
              },
              {
                active: 'active',
                event: 'toggle-special',
                icon: 'focus',
                label: '重点关注渔船',
                name: 'focus',
                type: 'Focus',
                value: 0
              },
              {
                active: 'active',
                event: 'toggle-special',
                icon: 'light',
                label: '高亮渔船',
                name: 'light',
                type: 'Light',
                value: 0
              },
              {
                active: 'active',
                event: 'toggle-special',
                icon: 'light_focus',
                label: '重点关注高亮渔船',
                name: 'light_focus',
                type: 'Light_Focus',
                value: 0
              }
            ],
            width: '270px'
          },
          {
            active: 'polymerization',
            event: 'toggle-polymerization',
            icon: 'polymerization',
            popup: '渔船聚合'
          },
          {
            event: 'toggle-group',
            icon: 'group',
            popup: '渔船分组'
          },
          {
            event: 'toggle-sift',
            icon: 'sift',
            popup: '渔船筛选'
          },
          {
            event: 'toggle-satellite',
            icon: 'satellite',
            popup: '调船位'
          },
          {
            event: '',
            icon: 'geography',
            name: 'geography',
            options: [
              {
                active: 'active',
                event: 'toggle-overlay',
                label: '渔港',
                name: 'port'
              },
              {
                active: '',
                event: 'toggle-overlay',
                label: '渔港卫士',
                name: 'video'
              },
              {
                active: 'active',
                event: 'toggle-overlay',
                label: '封闭式围栏',
                name: 'closed'
              },
              {
                active: '',
                event: 'toggle-overlay',
                label: '渔区',
                name: 'fishing'
              },
              {
                active: '',
                event: 'toggle-overlay',
                label: '经纬度网格',
                name: 'grid'
              },
              {
                active: '',
                event: 'toggle-overlay',
                label: '制捕区域',
                name: 'catch'
              },
              {
                active: '',
                event: 'toggle-overlay',
                label: '界定水域',
                name: 'waters'
              }
            ],
            popup: '地理要素',
            width: '100px'
          },
          {
            event: '',
            icon: 'meteorology',
            name: 'weather',
            options: [
              {
                active: '',
                event: 'toggle-weather',
                label: '海浪',
                name: 'current'
              },
              {
                active: '',
                event: 'toggle-weather',
                label: '气温',
                name: 'temperature'
              },
              {
                active: '',
                event: 'toggle-weather',
                label: '浪高',
                name: 'wave'
              },
              {
                active: '',
                event: 'toggle-weather',
                label: '风场',
                name: 'wind'
              }
            ],
            popup: '气象要素',
            width: '60px'
          },
          {
            event: 'zoom-in',
            icon: 'enlarge',
            popup: '地图放大'
          },
          {
            event: 'zoom-out',
            icon: 'narrow',
            popup: '地图缩小'
          },
          {
            event: 'toggle-locate',
            icon: 'location',
            popup: '定位'
          },
          {
            active: 'distance',
            event: 'measure-distance',
            icon: 'distance',
            popup: '路径测量'
          },
          {
            active: 'area',
            event: 'measure-area',
            icon: 'area',
            popup: '面积测量'
          },
          {
            active: 'expand',
            event: 'toggle-expand',
            icon: 'expand',
            popup: '侧边栏'
          },
          {
            event: '',
            icon: 'layers',
            name: 'base',
            options: [
              // {
              //   active: '',
              //   event: 'switch-base',
              //   label: '地图',
              //   name: 'vector'
              // },
              {
                active: 'active',
                event: 'switch-base',
                label: '遥感',
                name: 'image'
              },
              {
                active: '',
                event: 'switch-base',
                label: 'ARCGIS',
                name: 'image-arcgis'
              },
              {
                active: '',
                event: 'switch-base',
                label: '海图',
                name: 'sea'
              },
              {
                active: '',
                event: 'switch-base',
                label: '深色',
                name: 'dark'
              }
            ],
            popup: '底图切换',
            width: '75px'
          },
          {
            event: 'toggle-update',
            icon: 'update',
            popup: '刷新'
          }
        ],
        distance: '',
        expand: '',
        polymerization: '',
        offset: ''
      }
    }
  },
  watch: {
    $route: 'initPage'
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      this.expend = this.$route.meta.class // 路由配置当前页面是否展开
    },
    handlePluginEvent (name, params, index) {
      const whiteList = ['toggle-focus', 'toggle-light', 'toggle-layer']
      if (whiteList.includes(name) && this.plugins.polymerization) {
        return null
      }
      this.$emit('handle', name, params, index)
    }
  }
}
</script>

<style scoped>
.screen-legend {
  bottom: 104px;
  font-family: 'SHSCNN';
  position: absolute;
  right: 374px;
  transition-duration: .3s;
  z-index: 10;
}
.screen-legend.expend {
  right: 30px !important;
}
.screen-legend-item:first-child {
  margin-bottom: 12px;
}
.screen-legend-card {
  background-color: rgba(19, 77, 165, 1);
  border: 1px solid rgba(19, 77, 165, 1);
  border-radius: 4px;
  cursor: pointer;
  height: 26px;
  margin-bottom: 4px;
  position: relative;
  width: 26px;
}
.screen-legend-card.active {
  background-color: rgba(19, 77, 165, .2);
}
/* ICON */
.map-plugin-icon {
  left: 6px;
  position: absolute;
  top: 6px;
}
.map-plugin-icon:hover + .map-plugin-popup {
  height: auto;
  opacity: 1;
  transition-delay: .7s;
  transition-duration: .3s;
  visibility: visible;
}
/* POPUP */
.map-plugin-popup {
  background-color: white;
  border-color: black;
  border-style: solid;
  border-width: 1px;
  color: black;
  font-size: 14px;
  font-weight: 300;
  height: 0;
  line-height: 20px;
  opacity: 0;
  overflow: auto;
  padding-left: 5px;
  padding-right: 5px;
  position: absolute;
  right: 0;
  text-overflow: unset;
  top: 100%;
  transition-delay: 0s;
  transition-duration: 0s;
  visibility: hidden;
  white-space: unset;
  z-index: 99;
  width: 75px;
}
.screen-legend-card:nth-child(7) {
  margin-bottom: 12px;
}
.screen-legend-card:hover .map-plugin-popup {
  /*height: auto;*/
  /*opacity: 1;*/
  /*transition-delay: .7s;*/
  /*transition-duration: .3s;*/
  /*visibility: visible;*/
}
/* SUBLIST */
.map-plugin-sublist {
  display: block;
  opacity: 0;
  padding-left: 0px;
  position: absolute;
  right: 34px;
  top: 0px;
  transition-duration: .3s;
  visibility: hidden;
}
.screen-legend-card:hover .map-plugin-sublist {
  opacity: 1;
  visibility: visible;
}
.screen-legend-card:hover .map-plugin-popup {
  /*height: auto;*/
  /*opacity: 1;*/
  /*transition-delay: .7s;*/
  /*transition-duration: .3s;*/
  /*visibility: visible;*/
}
.map-plugin-subitem {
  background-color: rgba(63, 111, 192, .6);
  border-radius: 5px;
  color: darkgrey;
  cursor: pointer;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  list-style: none;
  margin-bottom: 1px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: left;
}
.map-plugin-subitem.active {
  color: white;
}
.map-plugin-subitem:last-child {
  margin-bottom: 0px;
}
.map-plugin-subitem .label {
  margin-left: 5px;
}
.map-plugin-subicon {
  border-radius: 4px;
  display: inline-block;
  height: 8px;
  margin-right: 10px;
  position: relative;
  transform: translateY(-1px);
  width: 8px;
}
.map-plugin-subicon::after {
  border-radius: 4px;
  box-sizing: border-box;
  content: ' ';
  display: inline-block;
  height: 8px;
  left: 10px;
  position: absolute;
  width: 8px;
}
/* AIS渔船类型 */
.map-plugin-subicon.ais {
  background-color: #00CC00;
}
.map-plugin-subicon.ais::after {
  border: 1px solid #00CC00;
  background-color: #939393;
}
/* Beidou */
.map-plugin-subicon.beidou {
  background-color: #3366CC;
}
.map-plugin-subicon.beidou::after {
  border: 1px solid #3366CC;
  background-color: #939393;
}
/* Radar-AIS */
.map-plugin-subicon.radar-ais {
  background-color: #CD60BA;
}
.map-plugin-subicon.radar-ais::after {
  border: 1px solid #CD60BA;
  background-color: #939393;
}
/* Radar */
.map-plugin-subicon.radar {
  background-color: #9370DB;
}
.map-plugin-subicon.radar::after {
  border: 1px solid #9370DB;
  background-color: #939393;
}
/* Light */
.map-plugin-subicon.light {
  background-color: #FFFF00;
}
/* Focus */
.map-plugin-subicon.focus {
  border: 2px solid rgba(255, 165, 0, 1);
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  margin-right: 10px;
  position: relative;
  transform: translateY(2px);
  width: 8px;
}
/* FOCUS_LIGHT */
.map-plugin-subicon.light_focus {
  border: 2px solid rgba(255, 165, 0, 1);
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  margin-right: 10px;
  position: relative;
  transform: translateY(2px);
  width: 8px;
}
.map-plugin-subicon.light_focus:after {
  background-color: #FFFF00;
  border-radius: 50%;
  height: 4px;
  left: 2px;
  position: absolute;
  top: 2px;
  width: 4px;
}

@media screen and (max-width:1600px) {
  .screen-legend {
    bottom: 20px;
  }
}
</style>
