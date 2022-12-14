<template>

  <div
    class="trawler-map"
    id="trawler-map">
  </div>

</template>

<script>
import api from '@/util/api'
import * as maptalks from 'maptalks'
import * as $configs from '@/components/map/configs'
export default {
  name: 'trawler-map',
  data () {
    return {
      layer: null,
      map: null
    }
  },
  props: {
    'equipment-type': {
      default () {
        return []
      },
      required: false,
      type: Array
    },
    'ship-name': {
      default: '',
      required: false,
      type: String
    }
  },
  mounted () {
    this.initMap()
    this.initData()
  },
  watch: {
    shipName: 'initData'
  },
  methods: {
    initData () {
      if (!this.shipName) {
        return null
      }
      const today = new Date()
      today.setHours(today.getHours() + 8)
      const endTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
      today.setDate(today.getDate() - 7)
      const startTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')

      const params = new FormData()
      const type = this.equipmentType ? this.equipmentType[0] : ''
      params.append('shipName', this.shipName)
      params.append('beginDate', startTime)
      params.append('endDate', endTime)
      params.append('bwlx', type || 'Beidou')

      this.axios.post(api.getTrawlerTrack, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (res.result) {
            const path = res.result.map(item => {
              return [item.longitude - 0, item.latitude - 0]
            })
            const paths = new maptalks.LineString(path, $configs.getAnalysisSymbol('path'))
            const points = new maptalks.MultiPoint(path, $configs.getAnalysisSymbol('point'))
            this.layer.addGeometry(paths, points)
            this.map.setCenter(path[path.length - 1])
            this.map.setZoom(11)
          }
        } else {
          this.$message.error(res.msg || '近一周渔船轨迹查询失败！')
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
      })
    },
    initMap () {
      const mapConfig = localStorage.getItem('map-config')
      const config = mapConfig ? JSON.parse(mapConfig) : null
      this.map = new maptalks.Map('trawler-map', {
        attribution: '',
        bearing: 0,
        center: config ? [config.longitude - 0, config.latitude - 0] : $configs.center,
        dragPitch: false,
        dragRotate: false,
        minZoom: 2,
        pitch: 0,
        zoom: config ? config.zoom : $configs.zoom
      })
      const options = $configs.getbaseLayerConfig()[1]
      const base = new maptalks.TileLayer('base', {
        subdomains: options.subdomains,
        urlTemplate: options.url,
        zIndex: 1
      })
      this.map.setBaseLayer(base)
      this.layer = new maptalks.VectorLayer('trawler-path', $configs.layerConfig(1)).addTo(this.map)
    }
  }
}
</script>

<style scoped>
.trawler-map {
  height: 500px;
  position: relative;
  width: 100%;
}
</style>
