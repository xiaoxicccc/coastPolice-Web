<template>

  <div :class="['port-info', visibility]">

    <app-title
      title="渔港基本信息">
    </app-title>

    <ul class="port-info-list">

      <li
        v-for="(item, i) in items"
        class="port-info-item"
        :key="i">

        <span class="label">{{ item.label }}:
        </span>

        <span class="value">{{ data[item.prop] }}
        </span>

      </li>

    </ul>

    <app-title
      sub-title="渔港监控">
    </app-title>

  </div>

</template>

<script>
import appTitle from '@/components/screen/title'
export default {
  name: 'port-info',
  components: {
    'app-title': appTitle
  },
  data () {
    return {
      data: {},
      items: [
        {
          label: '码头名称',
          prop: 'name'
        },
        {
          label: '经度',
          prop: 'longitude'
        },
        {
          label: '纬度',
          prop: 'latitude'
        },
        {
          label: '港口类型',
          prop: 'typeName'
        },
        {
          label: '单位名称',
          prop: 'departName'
        },
        {
          label: '具体位置',
          prop: 'address'
        }
      ],
      visibility: ''
    }
  },
  watch: {
    $route: 'initData'
  },
  mounted () {
    this.toggleVisible(true)
    this.initData()
  },
  destroyed () {
    this.toggleVisible(false)
  },
  methods: {
    initData () {
      this.data = {}
      const id = this.$route.query.id - 0
      const layer = window.$screen.vector.port
      layer.forEach(item => {
        if (item.getId() === id) {
          this.data = item.getProperties()
        }
      })
    },
    toggleVisible (visibility) {
      this.visibility = visibility ? 'visible' : ''
    }
  }
}
</script>

<style scoped>
.port-info {
  background: linear-gradient(180deg, rgba(25, 48, 128, 0.16) 1%, rgba(25, 48, 128, 0.8) 48%, rgba(25, 48, 128, 0) 100%);
  box-sizing: border-box;
  left: -384px;
  opacity: 0;
  padding-top: 20px;
  transition-duration: .3s;
  visibility: hidden;
  width: 320px;
}
.port-info.visible {
  left: 30px;
  opacity: 1;
  visibility: visible;
}
/* LIST */
.port-info-list {
  box-sizing: border-box;
  margin-bottom: 20px;
  padding-left: 20px;
  width: 100%;
}
.port-info-item {
  /*align-items: center;*/
  display: flex;
  flex-direction: row;
  font-family: 'PuHuiTi-Regular';
  font-size: 15px;
  margin-top: 20px;
}
.label {
  color: rgba(171, 177, 200, 1);
  flex-shrink: 0;
  margin-right: 5px;
}
.value {
  color: rgba(255, 255, 255, 1);
}
</style>
