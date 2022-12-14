<template>

  <!-- 区域搜索 -->
  <app-dialog
    :config="config"
    ref="app-dialog"
    title="区域搜索结果"
    @close="close">

    <div class="area-search">

      <app-table
        :columns="columns"
        :controls="control"
        :data="data"
        @handle="handle"
        style="height: 100%;">
      </app-table>

    </div>

  </app-dialog>

</template>

<script>
import appDialog from './dialog-right'
import appTable from './table'
export default {
  name: 'area-search',
  components: {
    'app-dialog': appDialog,
    'app-table': appTable
  },
  data () {
    return {
      columns: [
        {
          label: '船名号',
          prop: 'boatName',
          width: 130
        },
        {
          label: '船舶类型',
          prop: 'typeName',
          width: 80
        },
        {
          label: '终端类型',
          prop: 'msgType',
          width: 80
        },
        {
          label: '终端号',
          prop: 'mmsi',
          width: 100
        },
        {
          label: '定位经度',
          prop: 'longitude'
        },
        {
          label: '定位纬度',
          prop: 'latitude'
        },
        {
          label: '最后定位时间',
          prop: 'gpsTime',
          width: 140
        },
        {
          label: '功率(kw)',
          prop: 'power'
        }
      ],
      config: {
        height: 540,
        width: 1000
      },
      control: [
        {
          label: '定位',
          prop: 'locate',
          type: 'primary'
        }
      ]
    }
  },
  props: {
    data: {
      default () {
        return [
        ]
      },
      required: false,
      type: Array
    },
    time: {
      default: 0,
      required: false,
      type: Number
    }
  },
  destroyed () {
    const name = 'vector_locate'
    const layer = window.$app.layers[name]
    if (layer) {
      layer.clear()
    }
  },
  methods: {
    close () {
      this.$emit('close', [])
    },
    handle (type, data) {
      switch (type) {
        case 'locate': {
          this.locateTrawler(data)
          break
        }
        default: {
          break
        }
      }
    },
    locateTrawler (data) {
      this.$refs['app-dialog'].zoom('narrow')
      // 重定向数据
      const now = new Date()
      const gap = 1000 * 60 * 60 * 2
      const gpsDate = new Date(data.gpsTime) // 时区校正
      const info = {
        angle: data.cog ? data.cog - 0 : 0,
        departName: data.departName, // 海岸管理单位
        equipment: data.msgType, // 在线设备类型
        gpsdwsj: data.gpsTime,
        homePort: data.homePortName,
        id: data.id,
        latitude: data.latitude - 0,
        location: true,
        longitude: data.longitude - 0,
        mmsi: data.mmsi,
        online: now - gpsDate < gap,
        owner: data.boatOwner,
        phone: data.ownerPhone,
        shipName: data.boatName,
        shipType: data.typeName,
        speed: data.sog,
        type: data.msgType // 设备类型
      }
      window.$app.locate(data.longitude, data.latitude, info)
    }
  }
}
</script>

<style scoped>
.area-search {
  box-sizing: border-box;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
</style>
