<template>

  <div class="app-map-wrapper">

    <div
      class="app-map"
      id="app-map">
    </div>

    <!-- 渔船点位图例 -->
    <app-map-legend
      ref="app-map-legend"
      :offline="trawler.offline"
      :total="trawler.total"
      @toggle="toggleTrawler">
    </app-map-legend>

    <!-- 底图切换 -->
    <app-map-server
      @toggle="toggleBase">
    </app-map-server>

    <!-- 设置默认视野 -->
    <app-map-config
      v-if="config.visible"
      :map-center="position.center"
      :map-zoom="position.zoom"
      @close="closeMapConfig">
    </app-map-config>

    <!-- 工具栏 -->
    <app-map-toolbar
      @close-area-search="closeAreaSearch"
      @handle="handleToolbar"
      @update="updateAreaSearch">
    </app-map-toolbar>

    <!-- 拉框搜索 -->
    <app-area-search
      v-if="area.visible"
      :data="area.data"
      :time="area.time"
      @close="updateAreaSearch">
    </app-area-search>

    <!-- 开关控制 -->
    <app-map-switch
      ref="app-map-switch"
      @handle="handleSwitch">
    </app-map-switch>

    <div class="map-mouse-zoom">缩放级别：{{ position.zoom }}
    </div>

    <div class="map-mouse-position">坐标：[ {{ position.longitude}}，{{ position.latitude }} ]
    </div>

    <app-monitor-detail
      v-if="video.visible"
      :data="video.detail"
      :id="video.id"
      :port-data="video.ports"
      ref="app-monitor-detail"
      status="update"
      @close="closeMonitorDetail">
    </app-monitor-detail>

  </div>

</template>

<script>
import api from '@/util/api'
import 'maptalks/dist/maptalks.css'
import * as maptalks from 'maptalks'
import * as $configs from './configs'

import appAreaSearch from '@/components/common/area-search'
import appMapConfig from './map-config'
import appMapLegend from './map-legend'
import appMapServer from './map-server'
import appMapSwitch from './map-switch'
import appMapToolbar from './map-toolbar'
import appMonitorDetail from '@/components/admin/monitor-manage/video/detail'
export default {
  name: 'app-map',
  components: {
    'app-area-search': appAreaSearch,
    'app-map-config': appMapConfig,
    'app-map-legend': appMapLegend,
    'app-map-server': appMapServer,
    'app-map-switch': appMapSwitch,
    'app-map-toolbar': appMapToolbar,
    'app-monitor-detail': appMonitorDetail
  },
  data () {
    return {
      area: { // 区域搜索
        data: [],
        time: 0,
        visible: false
      },
      base: 'sea',
      config: {
        visible: false
      },
      date: {
        endTime: '',
        startTime: ''
      },
      geometries: { // 缓存所有渔船数据
        _trawler_dynamic: []
      },
      guard: {
        latitude: [],
        longitude: []
      },
      layers: { // 存储所有矢量图层
      },
      map: null,
      mouse: {
        center: null
      },
      moveMap: {
        13: 0.1,
        14: 0.02,
        15: 0.01,
        16: 0.005,
        17: 0.005,
        18: 0.004,
        19: 0.002
      },
      position: {
        center: $configs.center,
        latitude: $configs.center[1],
        longitude: $configs.center[0],
        zoom: $configs.zoom
      },
      tile: { // 瓦片信息
        layer: null
      },
      timenumber: null, // 渔船数量防抖
      timeout: null, // 防抖参数
      timer: null, // 定时器渔船
      timerfocus: null, // 重点关注渔船定时器
      timerlight: null,
      timerlocate: null, // 点击定位渔船延时器
      trawler: {
        data: [], // range接口渔船LIST
        offline: { // 离线船只数量
          AIS: 0,
          Beidou: 0,
          Radar: 0,
          'Radar-AIS': ''
        },
        total: { // 在线船只数量
          AIS: 0,
          Beidou: 0,
          Focus: 0,
          Light: 0,
          LightFocus: 0,
          Radar: 0,
          'Radar-AIS': 0
        }
      },
      vector: {
        location: null, // 定位图层
        port: null // 渔港图层
      },
      video: {
        colors: {
          枪机: '#055BFF',
          球机: '#FF8C00',
          人车识别: '#DB7093'
        },
        data: [], // 监控数据
        detail: {
        },
        id: 0,
        ports: [],
        visible: false
      }
    }
  },
  mounted () {
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.date.endTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    today.setDate(today.getDate() - 1)
    this.date.startTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')

    window.$app = this
    this.initMap()
    this.initPortData()
    // 加载渔船点位
    this.$nextTick(() => {
      this.initData(true)
    })
    // 加载重点渔船数据
    this.loadFocusTrawlerData()
    // 加载高亮渔船数据
    this.loadLightTrawlerData()
    // this.loadTrawlerData()
    // this.loadTrawlerTile()
  },
  destroyed () {
    this.clearTimer() // 清除所有定时器
  },
  methods: {
    addMonitorToMap () {
      this.vector.video.clear()
      // const data = this.video.data.filter(item => item.runStatus - 0 === 1)
      this.video.data.forEach(item => {
        if (!item.latitude - 0 && !item.longitude - 0) {
          return null
        }
        const latitude = item.latitude - 0
        const longitude = item.longitude - 0
        const lat = this.guard.latitude.filter(item => item === latitude)
        const lon = this.guard.longitude.filter(item => item === longitude)
        let textDy = 0
        if (lat.length && lon.length) {
          textDy = -25 * lat.length
        } else {
          textDy = 0
        }
        const guard = new maptalks.Marker(
          [longitude, latitude],
          {
            id: item.id,
            properties: item,
            symbol: $configs.getGuardSymbol(item, textDy)[1]
          }
        )
        const pic = new maptalks.Marker(
          [longitude, latitude],
          {
            properties: item,
            symbol: $configs.getGuardSymbol(item, textDy)[0]
          }
        )
        pic.addTo(this.vector.video)
        guard.addTo(this.vector.video)

        this.guard.latitude.push(item.latitude - 0)
        this.guard.longitude.push(item.longitude - 0)

        // 点击跳转详情修改
        guard.on('click', () => {
          this.vector.video.forEach(marker => {
            const properties = marker.getProperties()
            marker.updateSymbol({
              textHaloFill: $configs.updateMonitorSymbol(properties.duration)
            })
          })
          // 显示详情弹窗
          this.video.id = item.id
          this.video.detail = Object.assign({}, item)
          this.video.visible = true
          guard.flash(200, 4)
          guard.updateSymbol({
            textHaloFill: '#FFA500'
          })
        })
      })
    },
    addPortToMap (item) {
      const marker = new maptalks.Marker(
        [item.longitude - 0, item.latitude - 0],
        {
          id: item.id,
          properties: item,
          symbol: $configs.getPortSymbol(item.name)
        }
      )
      marker.addTo(this.vector.port)
    },
    addTrackToMap (list, color) { // 渔船轨迹叠加到地图
      if (!list.length) {
        return null
      }

      const collection = []
      const _options = $configs.getTrawlerTrackOptions(color)
      let lastPoint = null
      const lastIndex = list.length - 1
      list.map((item, index) => {
        const currentPoint = item.slice(0, 2)
        // 轨迹线
        if (index) {
          collection.push(new maptalks.LineString([
            lastPoint, [
              (lastPoint[0] + currentPoint[0]) / 2,
              (lastPoint[1] + currentPoint[1]) / 2
            ]
          ], _options.line[0]), new maptalks.LineString([
            [
              (lastPoint[0] + currentPoint[0]) / 2,
              (lastPoint[1] + currentPoint[1]) / 2
            ], currentPoint
          ], _options.line[1]))
        }
        // 轨迹点、当前位置
        const lastOne = lastIndex === index
        const showTimeLabel = index === lastIndex
        const _normal = JSON.parse(JSON.stringify(_options.marker.normal))
        _normal.properties = {
          time: item[4],
          timeControl: showTimeLabel
        }
        _normal.symbol[0].markerRotation = item[3]
        _normal.symbol[2].textName = showTimeLabel ? item[4] : ''
        if (lastOne) {
          // const position = $configs.formatPositon(item[0], item[1])

          _normal.symbol[1].markerOpacity = 1
          _normal.symbol[3].textName = `船舶名称：${item[5] || '--'}`
          // _normal.symbol[4].textName = `北斗编号：${item[6] || '--'}`
          _normal.symbol[4].textName = `终端号码：${item[7] || item[6] || '--'}`
          _normal.symbol[5].textName = `船主姓名：${item[9] || '--'}`
          _normal.symbol[6].textName = `联系方式：${item[10] || '--'}`
          _normal.symbol[7].textName = `经度：${item[0] - 0 || '--'}`
          _normal.symbol[8].textName = `纬度：${item[1] - 0 || '--'}`
          _normal.symbol[9].textName = item[8] ? `航速：${item[8]}节` : '航速：--'
        }
        collection.push(new maptalks.Marker(currentPoint, _normal))
        lastPoint = currentPoint
      })
      // eslint-disable-next-line no-unused-vars
      const track = new maptalks.GeometryCollection(collection)
      track.addTo(this.layers.vector_track)
      this.$nextTick(() => {
        this.layers.vector_track.setZIndex(5)
      })
      return collection
    },
    addTrawlerToMap (info, focus, light) {
      // 渔船实时点位叠加到地图 // 添加船舶实时点
      let layer = null
      let type = null
      if (focus && !light) {
        layer = this.layers.vector__trawler_focus
        type = 'focus'
      } else if (light && !focus) {
        layer = this.layers.vector__trawler_light
        type = 'light'
      } else if (light && focus) {
        layer = this.layers.vector__trawler_light_focus
        type = 'light_focus'
      } else {
        layer = this.layers.vector__trawler_dynamic
        type = 'ordinary'
      }
      const marker = new maptalks.Marker({
        x: info.longitude,
        y: info.latitude
      }, {
        id: info.uuid,
        properties: info,
        visible: true,
        zIndex: 5,
        symbol: $configs.getTrawlerSymbol(info)
      }).addTo(layer)

      // 渔船渲染显隐控制
      const legend = this.$refs['app-map-legend'].list.slice()
      const legendMap = {}
      legend.forEach(item => {
        legendMap[item.prop] = item.active === 'active'
      })
      if (legendMap[info.equipment]) {
        marker.show()
      } else {
        marker.hide()
      }

      // 弹窗设置
      // marker.setInfoWindow($configs.getPopup(info))
      marker.on('click', (evt) => {
        // marker.openInfoWindow(evt.coordinate)
        this.locate(null, null, info)
        this.handleMarkerEvent(marker, info, evt, type)
        if (this.timerlocate) {
          clearTimeout(this.timerlocate)
          this.timerlocate = null
        }
        this.timerlocate = setTimeout(() => {
          marker.closeInfoWindow()
          if (this.layers.vector_locate) {
            this.layers.vector_locate.clear()
          }
        }, 1000 * 20)
      })

      return marker
    },
    /**
     * 地图移动时移除视野之外的渔船
     */
    clearOverviewTrawlerPoint () {
      const extent = this.map.getExtent()
      const [xmax, xmin, ymax, ymin] = [extent.xmax, extent.xmin, extent.ymax, extent.ymin]

      const layer = this.layers.vector__trawler_dynamic
      layer.forEach(marker => {
        const center = marker.getCenter()
        if (center.x < xmin || center.x > xmax || center.y < ymin || center.y > ymax) {
          const properties = marker.properties
          const index = this.geometries._trawler_dynamic.findIndex(item => item.uuid === properties.uuid)
          if (index !== -1) {
            this.geometries._trawler_dynamic.splice(index, 1)
          }
          marker.remove()
        }
      })
    },
    clearTimer () { // 清除页面上所有的定时器
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.timerfocus) {
        clearInterval(this.timerfocus)
        this.timerfocus = null
      }
      if (this.timenumber) {
        clearInterval(this.timenumber)
        this.timenumber = null
      }
      if (this.timeout) {
        clearInterval(this.timeout)
        this.timeout = null
      }
      if (this.timerlight) {
        clearInterval(this.timerlight)
        this.timerlight = null
      }
    },
    clearTrawlerData () {
      // 清空瓦片
      if (this.tile.layer) {
        this.map.removeLayer(this.tile.layer)
        this.tile.layer = null
      }
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      // 清空地图上的点位
      // this.layers.vector__trawler_dynamic.clear()
      this.layers.vector__trawler_dynamic.hide()
      // 渔船数量清除
      this.geometries._trawler_dynamic = []
      // 清空高亮
      this.layers.vector__trawler_light.hide()
      // 清空重点关注
      this.layers.vector__trawler_focus.hide()
      // 清空高亮+重点关注
      this.layers.vector__trawler_light_focus.hide()
    },
    clearTrawlerNumber () { // 避开重点关注数量 // 离线船只数量
      const types = ['AIS', 'Beidou', 'Radar', 'Radar-AIS']
      types.forEach(item => {
        this.trawler.offline[item] = 0
        this.trawler.total[item] = 0
      })
    },
    closeAreaSearch () { // 关闭圆搜方搜后同步关闭搜索结果弹窗
      this.area.data = []
      this.area.visible = false
    },
    closeMapConfig (visible, data) {
      this.config.visible = false
      if (visible) {
        this.map.setZoom(data.zoom - 0)
        this.map.setCenter([data.longitude - 0, data.latitude - 0])
      }
    },
    closeMonitorDetail (visible) {
      // const model = this.$refs['app-monitor-detail'].model
      // 更新点位信息-重新加载
      this.video.visible = false
      if (visible) {
        this.initMonitorData()
      } else {
        this.vector.video.forEach(marker => {
          if (marker.getId() === this.video.id) {
            marker.updateSymbol({
              textHaloFill: $configs.updateMonitorSymbol(this.video.detail.duration)
            })
          }
        })
      }
    },
    handleMarkerEvent (marker, info, evt, type) {
      // 任意点击移除彩云图图层
      if (this.vector.cloud) {
        this.vector.cloud.remove()
      }
      const params = new FormData()
      params.append('ownerName', info.owner)

      this.axios.post(api.getOwnerPhoneByName, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          info.phone = res.result.phone || ''
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        marker.setProperties(info)
        marker.setInfoWindow($configs.getPopup(info))
        marker.openInfoWindow(evt.coordinate)
        // 高亮船只唤起彩云图
        if (type === 'light') {
          this.toggleColorCloudMap(marker)
        }
      })
    },
    handleSwitch (e, value) {
      switch (e) {
        case 'monitor': {
          if (value) {
            // 关闭渔船点位
            this.clearTrawlerData()
            this.$refs['app-map-switch'].model.trawler = false
            this.$refs['app-map-switch'].model.port = false
            this.initMonitorData()
            this.vector.port.hide()
          } else {
            this.$refs['app-map-switch'].model.trawler = true
            this.$refs['app-map-switch'].model.port = true
            this.vector.video.clear()
            this.vector.port.show()
            this.initData(true)
            this.layers.vector__trawler_light.show()
            this.layers.vector__trawler_focus.show()
            this.layers.vector__trawler_light_focus.show()
          }
          break
        }
        case 'port': {
          if (!value) {
            this.vector.port.hide()
          } else {
            this.vector.port.show()
          }
          break
        }
        case 'trawler': {
          if (!value) {
            this.clearTrawlerData()
          } else {
            this.initData(true)
          }
          break
        }
        default: {
          break
        }
      }
    },
    handleToolbar (data) {
      switch (data.prop) {
        case 'config':
          this.config.visible = true
          break
        case 'reset': {
          const mapConfig = localStorage.getItem('map-config')
          const config = mapConfig ? JSON.parse(mapConfig) : null
          this.map.animateTo({
            zoom: config ? config.zoom : $configs.zoom,
            center: config ? config.center : $configs.center
          })
          break
        }
        default:
          break
      }
    },
    initBaseLayer (key, options) { // 底图图层初始化
      const layers = this.layers
      const name = `base_${key}`
      let layer = layers[name]
      if (layer) {
        layer.remove()
      }
      layer = new maptalks.TileLayer(name, {
        subdomains: options.subdomains,
        urlTemplate: options.url,
        zIndex: 1
      })
      layers[name] = layer
      return layer
    },
    initData (visible) {
      if (this.position.zoom > 12) {
        // 清空瓦片
        if (this.tile.layer) {
          this.map.removeLayer(this.tile.layer)
          this.tile.layer = null
        }
        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        // 加载显示实时矢量点位数据
        this.layers.vector__trawler_dynamic.show()
        this.timeout = setTimeout(() => {
          this.loadTrawlerData()
        }, 1000)
      } else {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        // 清空地图上的点位
        this.layers.vector__trawler_dynamic.clear()
        this.layers.vector__trawler_dynamic.hide()
        // 渔船数量清除
        this.clearTrawlerNumber()
        this.geometries._trawler_dynamic = []
        // 加载渔船点位瓦片数据
        if (visible) {
          this.loadTrawlerTile()
        }
        if (this.timenumber) {
          clearTimeout(this.timenumber)
          this.timenumber = null
        }
        this.timenumber = setTimeout(() => {
          this.loadTrawlerNumber()
        }, 800)
      }
    },
    initFocusTrawlerData () {
      // 此时请求重点关注数据
      this.initTrawlerDataByRange(1, 0)
    },
    initGeometry ({ className, params }) { // 地图元素构造
      return new maptalks[className](...params)
    },
    initMap () {
      const mapConfig = localStorage.getItem('map-config')
      const config = mapConfig ? JSON.parse(mapConfig) : null
      this.map = new maptalks.Map('app-map', {
        attribution: '',
        bearing: 0,
        center: config ? [config.longitude - 0, config.latitude - 0] : $configs.center,
        dragPitch: false,
        dragRotate: false,
        minZoom: 2,
        pitch: 0,
        zoom: config ? config.zoom : $configs.zoom
      })
      // 全局对象绑定
      window.$map = this.map

      // 同步中心点位置
      this.position.zoom = config ? config.zoom : $configs.zoom
      this.position.latitude = config ? config.latitude - 0 : $configs.center[1]
      this.position.longitude = config ? config.longitude - 0 : $configs.center[0]

      // 底图图层
      $configs.getbaseLayerConfig().forEach((item) => {
        this.initBaseLayer(item.name, item)
      })
      this.setBaseLayer(this.base)

      // 鼠标监听-缩放
      this.map.on('zoomend', (e) => {
        this.position.zoom = e.to
        // 获取地图点位开关状态
        const trawlerVisible = this.$refs['app-map-switch'].model.trawler
        if (trawlerVisible) {
          this.initData(true)
        }
        if (this.config.visible) {
          this.position.center = [this.map.getCenter().x.toFixed(6), this.map.getCenter().y.toFixed(6)]
        }
      })
      // 地图-视窗改变
      // this.map.on('viewchange', (e) => {
      //   this.initData()
      // })
      // 地图事件响应：鼠标移动
      this.map.on('mousemove', (e) => {
        this.position.longitude = e.coordinate.x.toFixed(6)
        this.position.latitude = e.coordinate.y.toFixed(6)
      })
      // 地图事件响应：鼠标右键
      this.map.on('contextmenu', () => {
        this.config.visible = true
        this.position.center = [this.map.getCenter().x.toFixed(6), this.map.getCenter().y.toFixed(6)]
      })
      this.map.on('movestart', () => {
        this.mouse.center = this.map.getCenter()
      })
      // // 其他地图事件
      this.map.on('moveend pitchend resize', () => {
        // 用来控制请求频率
        // const center = this.map.getCenter()
        // const rangeX = (center.x - this.mouse.center.x).toFixed(6)
        // const rangeY = (center.y - this.mouse.center.y).toFixed(6)
        // const proportion = this.moveMap[this.map.getZoom()] || 0
        // console.log(rangeX, rangeY)
        // if ((this.position.zoom > 12 && (Math.abs(rangeX) > proportion || Math.abs(rangeY) > proportion)) || this.position.zoom <= 12) {
        // }
        // 获取地图点位开关状态
        const trawlerVisible = this.$refs['app-map-switch'].model.trawler
        if (trawlerVisible) {
          this.initData(false)
        }

        if (this.config.visible) {
          this.position.center = [this.map.getCenter().x.toFixed(6), this.map.getCenter().y.toFixed(6)]
        }
      })

      // 轨迹回放图层
      this.initVectorLayer('track', 5)
      // this.layers.vector_track = new maptalks.VectorLayer('track', $configs.layerConfig(5)).addTo(this.map)
      // 渔港图层
      this.vector.port = new maptalks.VectorLayer('port', $configs.layerConfig()).addTo(this.map)
      // 定位图层
      this.vector.location = new maptalks.VectorLayer('location', $configs.layerConfig(4)).addTo(this.map)
      // 渔船点位图层
      this.initVectorLayer('_trawler_dynamic', 4)
      // 重点关注渔船图层
      this.initVectorLayer('_trawler_focus', 4)
      // 高亮渔船图层
      this.initVectorLayer('_trawler_light', 4)
      // 重点关注+高亮
      this.initVectorLayer('_trawler_light_focus', 4)
      // 渔港卫士图层
      this.vector.video = new maptalks.VectorLayer('video', $configs.layerConfig()).addTo(this.map)
    },
    initMonitorData () {
      const params = new FormData()
      params.append('pageNum', 1)
      params.append('pageSize', -1)

      this.guard.latitude = []
      this.guard.longitude = []
      this.axios.post(api.getVideoPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.video.data = res.result.records.slice()
          this.addMonitorToMap()
        } else {
          this.$message.error(res.msg || '监控点位查询失败!')
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
      })
    },
    initPortData () { // 获取港口数据
      const params = new FormData()

      this.axios.post(api.getPortList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.vector.port.clear()
          this.video.ports = []
          res.result.forEach(item => {
            this.video.ports.push({
              label: item.name,
              value: item.name
            })
            if (item.longitude && item.latitude) {
              this.addPortToMap(item)
            }
          })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    initTrawlerData (type) {
      const params = new FormData()
      params.append('beginDate', this.date.startTime)
      params.append('endDate', this.date.endTime)
      params.append('bwlx', type)

      this.axios.post(api.getTrawlerPoint, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const list = res.result || []
          const now = new Date()
          const gap = 1000 * 60 * 60 * 2 // 自定义离线时间
          const data = []
          list.map((item) => {
            // 在离线判断，为了统计数量
            const gpsDate = new Date(item.gpsTime) // 时区校正
            item.online = now - gpsDate < gap
            if (data.findIndex(_item => _item.uuid === item.uuid) === -1) {
              data.push(item)
            }
          })
          data.forEach(item => {
            // 构造新的分类信息
            this.insertTrawler(item, true)
          })
        } else {
          this.$message.error(res.msg || '渔船点位查询失败！')
        }
      }).catch(err => {
        // this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    /**
     * 根据可视范围请求渔船点位数据
     * @param focus 是否重点关注
     * @param light 是否高亮
     */
    initTrawlerDataByRange (focus, light) {
      // 当请求重点关注、高亮渔船时，默认大范围全部请求
      const ex = !focus && !light ? this.map.getExtent() : {
        xmax: 126.12890349399822,
        xmin: 116.66696050600194,
        ymax: 40.43773525131556,
        ymin: 35.62078442923823
      }
      const [xmax, xmin, ymax, ymin] = [ex.xmax, ex.xmin, ex.ymax, ex.ymin]
      const points = [
        { x: xmin, y: ymax },
        { x: xmax, y: ymax },
        { x: xmax, y: ymin },
        { x: xmin, y: ymin }
      ]
      const params = new FormData()
      const today = new Date()
      today.setHours(today.getHours() + 8)
      this.date.endTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
      today.setDate(today.getDate() - 1)
      this.date.startTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
      params.append('beginTime', this.date.startTime)
      params.append('endTime', this.date.endTime)
      params.append('points', JSON.stringify(points))
      params.append('mainType', focus) // 筛掉重点关注渔船
      params.append('highLightType', light) // 筛掉高亮渔船

      this.trawler.data = []
      this.axios.post(api.getTrawlerPointByGeo, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const list = res.result || []
          const now = new Date()
          const gap = 1000 * 60 * 60 * 2
          const data = []
          this.trawler.data = list.map((item) => {
            // 在离线判断，为了统计数量
            const gpsDate = new Date(item.gpsTime) // 时区校正
            item.online = now - gpsDate < gap
            if (data.findIndex(_item => _item.uuid === item.uuid) === -1) {
              data.push(item)
            }
            return item
          })
          data.forEach(item => {
            // 构造新的分类信息
            // 判断点位是否存在，如果存在则更新，不存在则新增
            if (this.geometries._trawler_dynamic.findIndex(geo => geo.uuid === item.uuid) === -1) {
              this.insertTrawler(item, true, focus, light)
            } else {
              this.insertTrawler(item, false, focus, light)
            }
          })
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        // 加载普通渔船点位时清空视野范围之外的渔船
        if (!focus && !light) {
          this.clearOverviewTrawlerPoint()
          // 清掉当前区域内未更新数据的渔船
          const layer = this.layers.vector__trawler_dynamic
          layer.forEach(marker => {
            const index = this.trawler.data.findIndex(item => item.uuid === marker.getId())
            if (index === -1) {
              // 从映射数组中删掉该条渔船信息
              const _index = this.geometries._trawler_dynamic.findIndex(item => item.uuid === marker.getId())
              if (_index !== -1) {
                this.geometries._trawler_dynamic.splice(_index, 1)
              }
              // 移除marker
              marker.remove()
            }
          })
        }
      })
    },
    initVectorLayer (key, zIndex) { // 矢量图层初始化
      const layers = this.layers
      const name = `vector_${key}`
      let layer = this.layers[name]
      if (layer) {
        layer.remove()
      }
      layer = new maptalks.VectorLayer(name, {
        drawAltitude: false,
        enableAltitude: false,
        zIndex: zIndex || 1
      }).addTo(this.map)
      layers[name] = layer
      return layer
    },
    /**
     * 新增渔船数据
     * @param data 渔船数据
     * @param insert 新增/更新
     * @param focus 是否重点关注
     * @param light 是否高亮
     */
    insertTrawler (data, insert, focus, light) {
      const info = $configs.formartTrawlerInfo(data, focus, light)

      // 计算渔船数量
      if (focus && !light) {
        this.trawler.total.Focus += 1
      } else if (light && !focus) {
        this.trawler.total.Light += 1
      } else if (focus && light) {
        this.trawler.total.LightFocus += 1
      } else {
        if (info.online) {
          this.trawler.total[info.equipment] += 1
        } else {
          this.trawler.offline[info.equipment] += 1
        }
      }

      if (insert) {
        this.addTrawlerToMap(info, focus, light)
        this.geometries._trawler_dynamic.push(info)
      } else {
        let layer = null
        if (focus && !light) {
          layer = this.layers.vector__trawler_focus
        } else if (light && !focus) {
          layer = this.layers.vector__trawler_light
        } else if (light && focus) {
          layer = this.layers.vector__trawler_light_focus
        } else {
          layer = this.layers.vector__trawler_dynamic
        }
        const marker = layer.getGeometryById(info.uuid)
        if (marker) {
          marker.setCoordinates([info.longitude, info.latitude])
          const symbol = $configs.getTrawlerSymbol(info)
          marker.setSymbol(symbol)
          marker.setProperties(info)
        }
      }
    },
    loadFocusTrawlerData () { // 重点关注渔船点位加载前数据处理
      if (this.timerfocus) {
        clearInterval(this.timerfocus)
        this.timerfocus = null
      }
      const refresh = () => {
        this.layers.vector__trawler_focus.clear()
        this.trawler.total.Focus = 0
        this.initFocusTrawlerData()
      }

      refresh()
      this.timerfocus = setInterval(() => {
        refresh()
      }, 1000 * 60 * 5)
    },
    loadLightTrawlerData () { // 高亮渔船点位加载前数据处理
      if (this.timerlight) {
        clearInterval(this.timerlight)
        this.timerlight = null
      }
      const refresh = () => {
        this.layers.vector__trawler_light.clear()
        this.layers.vector__trawler_light_focus.clear()
        this.trawler.total.Light = 0
        this.trawler.total.LightFocus = 0
        this.initTrawlerDataByRange(0, 1)
        this.initTrawlerDataByRange(1, 1)
      }

      refresh()
      this.timerlight = setInterval(() => {
        refresh()
      }, 1000 * 60 * 5)
    },
    loadTrawlerNumber () { // 渔船点位瓦片下加载渔船数量
      const params = new FormData()

      this.axios.post(api.getTrawlerNumber, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          // 图例更新
          const data = res.result
          this.trawler.total.Beidou = data.bdOnline || 0
          this.trawler.total.AIS = data.aisOnline || 0
          this.trawler.total.Radar = data.radarOnline || 0
          this.trawler.total['Radar-AIS'] = data.radaraisOnline || 0

          this.trawler.offline.Beidou = data.bdOffline || 0
          this.trawler.offline.AIS = data.aisOffline || 0
          this.trawler.offline.Radar = data.radarOffline || 0
          this.trawler.offline['Radar-AIS'] = data.radaraisOffline || 0
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    loadTrawlerTile () { // 加载渔船瓦片数据
      if (this.tile.layer) {
        this.map.removeLayer(this.tile.layer)
        this.tile.layer = null
      }
      this.tile.layer = new maptalks.TileLayer('trawler-tile-map', {
        urlTemplate: api.getTrawlerByPng,
        hitDetect: false,
        detectRetina: true,
        forceRenderOnMoving: true,
        zIndex: 2
      })
      this.map.addLayer(this.tile.layer)
    },
    loadTrawlerData () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      const refresh = () => {
        this.clearTrawlerNumber()

        // 暂时注释
        // this.layers.vector__trawler_dynamic.clear()
        // this.geometries._trawler_dynamic = []
        this.initTrawlerDataByRange(0, 0)
        // this.initTrawlerDataByRange('Beidou')
        // this.initTrawlerDataByRange('AIS')
        // this.initTrawlerDataByRange('Radar')
        // this.initTrawlerDataByRange('Radar-AIS')
        // this.initTrawlerData('Beidou')
        // this.initTrawlerData('AIS')
      }
      refresh()
      this.timer = setInterval(() => {
        refresh()
      }, 1000 * 60 * 3)
    },
    locate (x, y, data) { // 要素/渔船定位
      if (x && typeof x === 'object') {
        const center = x.getCenter()
        this.map.setCenter(center)
      } else {
        const name = 'vector_locate'
        let layer = this.layers[name]
        if (!layer) {
          layer = this.initVectorLayer('locate', 5)
          this.layers[name] = layer
        } else {
          layer.clear()
        }
        const focus = new maptalks.Marker([data.longitude, data.latitude], {
          symbol: $configs.getLocationSymbol()
        })
        focus.addTo(layer)
          .flash(400, 4)
        // 定位逻辑-瓦片状态下无法定位点位，新增渔船定位点位显示
        const trawler = new maptalks.Marker({
          x: data.longitude,
          y: data.latitude
        }, {
          id: data.uuid,
          properties: data,
          visible: true,
          zIndex: 5,
          symbol: {
          }
          // symbol: $configs.getTrawlerSymbol(data)
        })
        trawler.addTo(layer)
          .flash(400, 6)

        // 弹窗设置
        trawler.on('click', (evt) => {
          this.handleMarkerEvent(trawler, data, evt)

          if (this.timerlocate) {
            clearTimeout(this.timerlocate)
            this.timerlocate = null
          }
          this.timerlocate = setTimeout(() => {
            trawler.closeInfoWindow()
            if (this.layers.vector_locate) {
              this.layers.vector_locate.clear()
            }
          }, 1000 * 20)
        })
        if (x && y) {
          this.map.setCenter([x, y])
        }
      }
    },
    locatePort (data) { // 渔港点击效果
      const point = [data.longitude - 0, data.latitude - 0]
      this.vector.location.clear()
      this.map.animateTo({
        center: point
      })
      const marker = new maptalks.Marker(
        point,
        {
          symbol: $configs.getLocationSymbol()
        }
      )
      this.vector.port.forEach(item => {
        if (item.getId() === data.id) {
          item.flash(200, 4)
        }
      })
      marker.flash(200, 4)
      marker.addTo(this.vector.location)
    },
    setBaseLayer (key) { // 设置底图图层
      const layers = this.layers
      const name = `base_${key}`
      const layer = layers[name]
      if (layer) {
        this.map.setBaseLayer(layer)
        this.base = key
      }
    },
    toggleBase (value) { // 底图切换，后续有其他功能，暂时嵌套方法
      this.setBaseLayer(value.key)
    },
    toggleColorCloudMap (marker) { // 高亮渔船彩云图
      this.vector.cloud = new maptalks.VectorLayer('cloud', $configs.layerConfig(1)).addTo(this.map)
      const center = marker.getCoordinates()
      const distance = 18500 // 10海里
      const range = [
        {
          count: 10,
          color: '#FFFF00',
          proportion: 1
        },
        {
          count: 5,
          color: '#FFAA00',
          proportion: 2
        },
        {
          count: 2,
          color: '#DC143C',
          proportion: 5
        }
      ]
      range.forEach(item => {
        const circle = new maptalks.Circle(center, distance / item.proportion, {
          symbol: [{
            lineColor: item.color,
            lineWidth: {
              stops: [
                [7, 0.5],
                [14, 2]
              ]
            },
            polygonOpacity: 0.3,
            polygonFill: item.color
          }]
        }).addTo(this.vector.cloud)
        new maptalks.Marker(circle.getShell()[0], {
          properties: {
            name: `${item.count}海里范围线`
          },
          symbol: [
            {
              textName: '{name}',
              textPlacement: 'vertex',
              textSize: {
                stops: [
                  [8, 0],
                  [11, 13]
                ]
              },
              textHaloFill: '#113d63',
              textHaloRadius: 2,
              textFill: '#fff',
              textDy: 20,
              textAlign: 'center'
            }
          ]
        }).addTo(this.vector.cloud)
      })
    },
    toggleDraw (configs) { // 绘制工具开关
      const { drawend, drawstart, mode, mousemove, once, symbol } = configs
      const layers = this.layers
      const name = `tool_draw_${mode}`
      let tool = layers[name]
      if (tool) {
        tool.remove()
        layers[name] = null
      } else {
        tool = new maptalks.DrawTool({ mode, once, symbol })
          .addTo(this.map)
        if (drawstart) {
          tool.on('drawstart', (param) => {
            drawstart(param)
          })
        }
        if (drawend) {
          tool.on('drawend', (param) => {
            drawend(param)
            if (once) {
              setTimeout(() => {
                this.toggleDraw({
                  drawend: () => {},
                  mode,
                  once,
                  symbol
                })
              }, 500)
            }
          })
        }
        if (mousemove) {
          tool.on('mousemove', (param) => {
            mousemove(param)
          })
        }
        layers[name] = tool
      }
    },
    toggleTrawler (type, visible) { // 切换各类渔船显示状态
      if (type === 'Focus') {
        if (visible) {
          this.layers.vector__trawler_focus.show()
        } else {
          this.layers.vector__trawler_focus.hide()
        }
      } else if (type === 'LightFocus') {
        if (visible) {
          this.layers.vector__trawler_light_focus.show()
        } else {
          this.layers.vector__trawler_light_focus.hide()
        }
      } else if (type === 'Light') {
        if (visible) {
          this.layers.vector__trawler_light.show()
          if (this.vector.cloud) {
            this.vector.cloud.show()
          }
        } else {
          this.layers.vector__trawler_light.hide()
          if (this.vector.cloud) {
            this.vector.cloud.hide()
          }
        }
      } else {
        this.layers.vector__trawler_dynamic.forEach((geo) => {
          const equipment = geo.getProperties().equipment
          if (type === equipment) {
            if (visible) {
              geo.show()
            } else {
              geo.hide()
            }
          }
        })
      }
    },
    updateAreaSearch (data) {
      this.area.data = data.slice()
      this.area.time = new Date().getTime()
      this.area.visible = !!data.length
    }
  }
}
</script>

<style scoped>
.app-map-wrapper {
  left: 0;
  height: calc(100% - 96px);
  position: absolute;
  top: 96px;
  width: 100%;
  z-index: 0;
}
/* MAP */
.app-map {
  left: 0;
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
}
.map-mouse-position {
  background-color: #FFFFFF;
  bottom: 10px;
  left: 10px;
  padding-left: 10px;
  padding-right: 10px;
  position: absolute;
}
.map-mouse-zoom {
  background-color: #FFFFFF;
  bottom: 35px;
  left: 10px;
  padding-left: 10px;
  padding-right: 10px;
  position: absolute;
}
</style>
