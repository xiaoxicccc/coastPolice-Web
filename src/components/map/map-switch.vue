<template>

  <ul class="map-switch map-switch-list">

    <li
      v-for="(item, index) in list"
      class="map-switch-item"
      :key="index"
      @click="handle(item)">

      <img
        alt="ICON_SWITCH"
        class="icon-switch"
        :src="`/img/map/icon-${item.prop}.png`">

      <el-switch
        v-model="model[item.prop]"
        size="small">
      </el-switch>

    </li>

  </ul>

</template>

<script>
export default {
  name: 'map-switch',
  data () {
    return {
      list: [
        {
          label: '渔船点位',
          prop: 'trawler'
        },
        {
          label: '渔港卫士',
          prop: 'monitor'
        },
        {
          label: '渔港',
          prop: 'port'
        }
      ],
      model: {
        monitor: false,
        port: true,
        trawler: true
      }
    }
  },
  methods: {
    handle (e) {
      this.$emit('handle', e.prop, this.model[e.prop])
    }
  }
}
</script>

<style scoped>
.map-switch {
  bottom: 60px;
  left: 10px;
  position: absolute;
}
/* LIST */
.map-switch-list {
  display: flex;
  flex-direction: column;
}
.map-switch-item {
  align-items: center;
  background-color: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
}
.map-switch-item:not(:last-child) {
  margin-bottom: 5px;
}
.icon-switch {
  height: 20px;
  margin-right: 10px;
  width: 20px;
}
</style>
