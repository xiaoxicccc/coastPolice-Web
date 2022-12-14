<template>

  <div class="map-legend">

    <div
      v-for="(item, i) in list"
      :class="['map-legend-list', item.active]"
      :key="i"
      @click="toggleTrawler(item.prop, i)">

      <span :class="['map-online-icon', item.online]">
      </span>

      <span
        v-if="item.offline"
        :class="['map-offline-icon', item.online]">
      </span>

      <span
        v-for="(_marker, _index) in item.marker"
        :class="_marker.type"
        :key="_index">{{ _marker.content }}
      </span>

      <span
        :style="`margin-left: ${item.left}px;`">{{ item.label }}
      </span>

      <span v-if="item.show">({{ total[item.prop] }} / {{ offline[item.prop] }})
      </span>

      <span v-else>({{ total[item.prop] }})
      </span>

    </div>

  </div>

</template>

<script>
export default {
  name: 'map-legend',
  data () {
    return {
      list: [
        {
          active: 'active',
          label: 'AIS[在线/离线]',
          offline: true,
          online: 'ais',
          prop: 'AIS',
          show: true, // 显示数量样式区分
          type: 'AIS'
        },
        {
          active: 'active',
          label: '北斗[在线/离线]',
          offline: true,
          online: 'beidou',
          prop: 'Beidou',
          show: true,
          type: 'Beidou'
        },
        {
          active: 'active',
          label: '雷达-AIS[在线/离线]',
          offline: true,
          online: 'radar-ais',
          prop: 'Radar-AIS',
          show: true,
          type: 'Radar-AIS'
        },
        {
          active: 'active',
          label: '雷达[在线/离线]',
          offline: true,
          online: 'radar',
          prop: 'Radar',
          show: true,
          type: 'Radar'
        },
        {
          active: 'active',
          label: '重点关注渔船',
          left: 9,
          offline: false,
          online: 'focus',
          prop: 'Focus',
          show: false,
          type: 'Focus'
        },
        {
          active: 'active',
          label: '高亮渔船',
          left: 16,
          offline: false,
          online: 'light',
          prop: 'Light',
          show: false,
          type: 'Light'
        },
        {
          active: 'active',
          label: '重点关注高亮渔船',
          left: 10,
          offline: true,
          online: 'light_focus',
          prop: 'LightFocus',
          show: false,
          type: 'LightFocus'
        }
      ]
    }
  },
  props: {
    offline: {
      default () {
        return {
          AIS: 0,
          Beidou: 0,
          Radar: 0,
          'Radar-AIS': 0
        }
      },
      required: false,
      type: Object
    },
    total: {
      default () {
        return {
          AIS: 0,
          Beidou: 0,
          Light: 0,
          Focus: 0,
          Radar: 0,
          'Radar-AIS': 0
        }
      },
      required: false,
      type: Object
    }
  },
  methods: {
    toggleTrawler (type, index) {
      const current = this.list[index]

      current.active = current.active ? '' : 'active'
      this.$emit('toggle', type, current.active)
    }
  }
}
</script>

<style scoped>
.map-legend {
  background-color: rgba(255, 255, 255, .3);
  border-radius: 6px;
  bottom: 20px;
  box-sizing: border-box;
  /*height: 182px;*/
  padding-bottom: 14px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 14px;
  position: fixed;
  right: 24px;
  /*top: 126px;*/
  /*width: 190px;*/
}
/* LIST */
.map-legend-list {
  align-items: center;
  color: rgba(37, 43, 58, 1);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-family: 'SHSCNN';
  font-size: 12px;
  /*font-weight: 600;*/
  line-height: 22px;
  list-style: none;
  opacity: 0.5;
  padding-left: 0;
  position: relative;
  text-align: left;
}
.map-legend-list.active {
  opacity: 1;
}
.map-online-icon,
.map-offline-icon {
  display: inline-block;
  height: 4px;
  margin-right: 6px;
  transform: rotate(45deg);
  width: 4px;
}
.map-offline-icon {
  margin-right: 10px !important;
}
/* AIS */
.map-online-icon.ais {
  border: 1px solid transparent;
  background-color: #00CC00;
}
.map-offline-icon.ais {
  border: 1px solid #00CC00;
  background-color: #939393;
}
/* Beidou */
.map-online-icon.beidou {
  border: 1px solid transparent;
  background-color: #2989FF;
}
.map-offline-icon.beidou {
  /*background-color: #2459C2;*/
  border: 1px solid #2989FF;
  background-color: #939393;
}
/* Radar */
.map-online-icon.radar {
  border: 1px solid transparent;
  background-color: #9370DB;
}
.map-offline-icon.radar {
  border: 1px solid #9370DB;
  background-color: #939393;
}
/* Radar-AIS */
.map-online-icon.radar-ais {
  border: 1px solid transparent;
  background-color: #CD60BA;
}
.map-offline-icon.radar-ais {
  /*background-color: #2459C2;*/
  border: 1px solid #CD60BA;
  background-color: #939393;
}
/* FOCUS */
.map-online-icon.focus {
  border: 2px solid rgba(255, 165, 0, 1);
  border-radius: 8px;
  height: 8px;
  width: 8px;
}
/* LIGHT */
.map-online-icon.light {
  border: 1px solid #FFFF00;
  background-color: #FFFF00;
}
/* LIGHT_FOCUS */
.map-online-icon.light_focus {
  border: 2px solid rgba(255, 165, 0, 1);
  border-radius: 8px;
  height: 8px;
  width: 8px;
}
.map-offline-icon.light_focus {
  background-color: #FFFF00;
  border-radius: 50%;
  height: 4px;
  left: 4px;
  position: absolute;
  top: 9px;
  width: 4px;
}
</style>
