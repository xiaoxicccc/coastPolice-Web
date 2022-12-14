<template>

  <div
    class="screen-map">

    <img
      class="screen-background"
      alt="BACKGROUND"
      src="/img/screen/icon-background.png">

    <div
      id="screen-map">
    </div>

    <screen-legend
      ref="screen-legend"
      @handle="handlePluginEvent">
    </screen-legend>

    <screen-locate
      v-if="location.visible"
      @close="closeLocate"
      @locate="locateByInput">
    </screen-locate>

    <!-- 鼠标经纬度 -->
    <div
      :class="['position', 'zoom', mouse.class]">

      <div class="item">

        <span class="label">缩放级别</span>

        <span class="value">{{ mouse.zoom }}</span>

      </div>

    </div>

    <div :class="['mouse', 'position', mouse.class]">

      <div class="item">

        <span class="label">经度</span>

        <span class="value">{{ mouse.longitude }}</span>

      </div>

      <div class="item">

        <span class="label">纬度</span>

        <span class="value">{{ mouse.latitude }}</span>

      </div>

    </div>

    <!-- 轨迹回放 -->
    <div class="footer" v-show="track.visible">
      <div class="review-container">
        <!-- 关闭按钮 -->
        <div class="review-close" @click="closeTrack()"></div>
        <div class="review-tool-bar">
          <!-- 回放速度切换 -->
          <div class="bar-left">回放速度：
            <span
              :class="review.slow ? 'primary' : 'text'"
              @click="speedChange(0.5)">慢速
            </span>
            <span
              :class="review.normal ? 'primary' : 'text'"
              @click="speedChange(1)">正常
            </span>
            <span
              :class="review.fast ? 'primary' : 'text'"
              @click="speedChange(3)">3倍速
            </span>
          </div>
          <div class="bar-center">{{ review.current }}</div>
        </div>
        <!-- 轨迹回放进度 -->
        <div>
          <el-slider
            v-model="review.now"
            :disabled="!track.path.length"
            :min="review.min"
            :max="review.max"
            :step="review.step"
            show-stops
            @input="reviewJump">
          </el-slider>
        </div>
        <div class="review-tool-bar">
          <div class="bar-left">{{ review.start }}</div>
          <!-- 开始/暂停按钮 -->
          <div class="bar-center">
            <span
              class="play-control"
              @click="reviewControl"
              :disabled="!track.path.length">
              <i
                v-if="this.review.status === 'start'"
                class="el-icon-video-pause icon-play">
              </i>
              <i
                v-else
                class="el-icon-video-play icon-play">
              </i>
            </span>
          </div>
          <div class="bar-right">{{ review.end }}</div>
        </div>
      </div>
    </div>

    <!-- 调船位 -->
    <screen-adjust-position
      v-if="adjust.visible"
      @close="closePosition"
      @update="updateTrawlerPosition">
    </screen-adjust-position>

    <!-- 渔船筛选 -->
    <screen-sift
      v-if="sift.visible"
      @close="closeSift"
      @query="queryTrawlerByCondition">
    </screen-sift>

    <!-- 报警推送 -->
    <screen-alarm-notice
      :content.sync="websocket.content"
      @handle="handleWebsocket">
    </screen-alarm-notice>

    <!-- 渔港卫士筛选 -->
    <screen-monitor-search
      v-if="video.visible"
      @close="closeMonitorSearch"
      @toggle="toggleMonitorVisible">
    </screen-monitor-search>

  </div>

</template>

<script>
import api from '@/util/api'
import 'maptalks/dist/maptalks.css'
import * as maptalks from 'maptalks'
import * as routeplayer from 'maptalks.routeplayer'
import { ClusterLayer } from 'maptalks.markercluster'

import * as $configs from './configs'
import { list as analysisItems } from '@/components/screen/analysis/configs'
import { mtkTool, ScalarLayer, ScarField, WindLayer } from 'lqlt-lib'
import { colorScale, png360data, velocityScales } from './baseConf'
import * as mapUtil from './util'

import screenAdjustPosition from './adjust-position'
import screenAlarmNotice from '@/components/screen/alarm-notice'
import screenLegend from './screen-legend'
import screenLocate from './screen-locate'
import screenMonitorSearch from './screen-monitor-search'
import screenSift from './screen-sift'

export default {
  name: 'screen-map',
  components: {
    'screen-adjust-position': screenAdjustPosition,
    'screen-alarm-notice': screenAlarmNotice,
    'screen-legend': screenLegend,
    'screen-locate': screenLocate,
    'screen-monitor-search': screenMonitorSearch,
    'screen-sift': screenSift
  },
  data () {
    return {
      adjust: {
        visible: false
      },
      base: 'image',
      catch: {
        data: []
      },
      closed: {
        data: []
      },
      clusterLayer: null, // 渔船聚合图层
      date: '2022-03-18 00:00:00',
      display: {
        grid: {
          borderColor: '#888888',
          density: 3,
          fontSize: 10,
          latitudeColor: '#FFD700',
          longitudeColor: '#FFD700',
          visible: true
        }
      },
      fishing: {
        data: []
      },
      geometries: {
        _trawler_dynamic: []
      },
      grid: {
        data: []
      },
      guard: {
        latitude: [],
        longitude: []
      },
      layers: {},
      location: {
        visible: false
      },
      map: null,
      mouse: {
        center: null,
        class: '',
        latitude: $configs.center[1],
        longitude: $configs.center[0],
        zoom: $configs.zoom
      },
      moveMap: {
        13: 0.07,
        14: 0.01,
        15: 0.006,
        16: 0.003,
        17: 0.003,
        18: 0.002,
        19: 0.001
      },
      player: null, // 轨迹回放播放器
      port: {
        data: []
      },
      radar: $configs.radarCoordinatesPlugins,
      review: { // 轨迹回放进度参数
        start: null, // 时刻
        current: null,
        end: null,
        min: 0, // 进度条
        now: 0,
        max: 1,
        step: 1,
        value: 1,
        slow: false, // 回访速度
        normal: true,
        fast: false,
        status: 'cancel', // 回放状态
        playing: null // 正在回放
      },
      sift: {
        visible: false
      },
      tile: {
        layer: null
      },
      timenumber: null, // 加载数量防抖
      timeout: null, // 加载渔船点位防抖
      timer: null, // 实时点位计时器
      timernumber: null, // 重点关注渔船计时器
      timerlocate: null, // 点击渔船定位延时器
      track: { // 轨迹数据
        config: $configs.getTrawlerTrackOptionsScreen(),
        endTime: '2020-09-29 00:00:00',
        fetching: null,
        geometry: null,
        map: [],
        path: [],
        startTime: '2020-09-28 00:00:00',
        visible: false
      },
      trawler: {
        data: [],
        radarais: {
          websocket: null
        },
        beidouais: {
          websocket: null
        }
      },
      vector: {
        area: null, // 测面积图层
        catch: null, // 制捕区域
        closed: null, // 封闭式围栏图层
        cloud: null, // 彩云图图层
        distance: null, // 测距图层
        fishing: null, // 渔区
        grid: null, // 网格线
        port: null, // 渔港图层
        radar: null, // 雷达图层
        track: null, // 轨迹回放图层
        video: null, // 渔港卫士
        waters: null, // 界定水域
        weather: null // 气象要素气泡图层
      },
      video: {
        data: [],
        visible: false
      },
      visible: {
        point: false // 用于切换瓦片+点位或完全实时点位渲染方式
      },
      waters: {
        data: []
      },
      websocket: {
        content: '', // 报警内容
        list: analysisItems.slice(), // 映射关系
        shipName: '', // 船名
        type: '', // 报警类型
        visible: false, // 显隐控制
        waiting: null // 链接
      },
      weather: {
        current: null, // 海浪
        tempField: null,
        temperature: null, // 气温
        wave: null, // 浪高
        waveField: null,
        wind: null // 风场
      },
      yesterday: '2022-03-17 00:00:00'
    }
  },
  watch: {
    $route: 'initStyle'
  },
  created () {
    this.startWebsocket()
    // setTimeout(() => {
    //   this.websocket.content = '【北斗2H不开机】鲁烟渔养67503发生北斗2H不开机报警!'
    //   this.websocket.type = '北斗2H不开机'
    //   this.websocket.shipName = '鲁烟渔养67503'
    // }, 1000 * 2)
  },
  mounted () {
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.date = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    today.setDate(today.getDate() - 1)
    this.yesterday = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')

    window.$screen = this
    this.initMap()
    this.initStyle()
    // 暂时注释加载矢量渔船点位
    // this.loadTrawlerData()
    this.$nextTick(() => {
      // 加载渔船数据
      this.initData(true)
      // 加载重点关注渔船数据
      this.loadFocusTrawlerData()
      // 开启渔船点位长连接
      this.startWebsocketTrawlerData()
      // 开启雷达点位长连接
      this.startWebsocketRadarTrawlerData()
    })
    // 默认加载雷达扫描区
    this.addRadarToMap()
    // 默认加载渔港
    this.handlePluginEvent('toggle-overlay', 'port', 0)
    // 默认加载封闭式围栏
    this.handlePluginEvent('toggle-overlay', 'closed', 2)
  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.timernumber) {
      clearInterval(this.timernumber)
      this.timernumber = null
    }
    if (this.trawler.radarais.websocket) {
      this.trawler.radarais.websocket.close()
      this.trawler.radarais.websocket = null
    }
  },
  methods: {
    addCatchToMap () {
      this.vector.catch.clear()
      const area = new maptalks.Polygon(this.catch.data, $configs.getAnalysisSymbol('area'))
      const center = area.getCenter()
      const text = new maptalks.Marker(
        center,
        {
          symbol: [
            {
              textName: '越界捕捞制捕区域',
              textSize: 12,
              textFill: 'black',
              textOpacity: 1,
              textDx: 0,
              textDy: 0,
              textHaloFill: 'white',
              textHaloRadius: 2
            }
          ]
        }
      )
      this.vector.catch.addGeometry(area, text)
    },
    addClosedAreaToMap (data) {
      const markerType = {
        // '实点/符号': 'Marker',
        // 折线: 'LineString',
        椭圆: 'Ellipse',
        圆形: 'Circle',
        矩形: 'Polygon',
        多边形: 'Polygon'
      }
      data.forEach(item => {
        const symbol = [
          {
            lineColor: item.lineColor,
            lineWidth: item.lineWidth - 0,
            polygonFill: item.field1 === 'true' ? item.fillColor : '',
            polygonOpacity: item.diaphaneity - 0
          },
          {
            textName: item.nameDisplayState === 'true' ? item.markName : '',
            textSize: 14,
            textDx: 0,
            textDy: 0,
            textHaloFill: '#FFF',
            textHaloRadius: 5
          }
        ]
        if (item.areaType === '实点/符号') {
          symbol[0] = {
            markerType: 'ellipse',
            markerFill: item.fillColor,
            markerFillOpacity: item.field1 === 'true' ? item.diaphaneity - 0 : 0,
            markerLineColor: item.lineColor,
            markerLineWidth: item.lineWidth - 0,
            markerWidth: 5,
            markerHeight: 5
          }
          symbol[1].textDy = 15
        }
        const info = JSON.parse(item.positionInfo)
        const params = []
        if (item.areaType === '圆形' || item.areaType === '椭圆') {
          params.push(...info)
        } else {
          params.push(info)
        }

        params.push({ symbol })
        this.geometry = this.initGeometry({
          className: markerType[item.areaType],
          params
        })
        this.vector.closed.addGeometry(this.geometry)
      })
    },
    addCurrentToMap (target) {
      const data1 = png360data().data1
      const data2 = png360data().data2
      mtkTool.lib.parseUVImage(
        api.weather_rest + '/pngInfo/png?type=wave&source=ecmwf&datetime=' + this.date,
        [0, 255],
        [-100, 100]
      )
        .then(({ r, g, b, a }) => {
          const rnew = r.map((item) => item / 80)
          const gnew = g.map((item) => item / 80)
          data1.data = rnew
          data2.data = gnew
          const vs = velocityScales()
          const wave = new WindLayer('wave', [data1, data2], {
            zIndex: 1,
            windOptions: {
              colorScale: [
                'rgb(255, 255, 255)'
              ],
              velocityScale: () => {
                const zoom = this.map.getZoom()
                return vs[zoom] || 1 / 40
              },
              frameRate: 20,
              maxAge: 20,
              lineWidth: 10,
              globalAlpha: 0.90,
              paths: 3000
            }
          })
          this.weather.current = wave
          wave.addTo(this.map)
          target.active = 'active'
        })
    },
    /**
     * 渔港卫士弹窗可关闭
     */
    closeMonitorSearch () {
      this.video.visible = false
    },
    addPortToMap () {
      this.port.data.forEach(item => {
        const marker = new maptalks.Marker(
          [item.longitude - 0, item.latitude - 0],
          {
            id: item.id,
            properties: item,
            symbol: $configs.getPortSymbol(item.name)
          }
        )
        marker.addTo(this.vector.port)
        marker.on('click', () => {
          marker.flash(200, 4)
          this.$router.push({
            path: '/screen/port-info',
            query: {
              id: item.id
            }
          })
        })
        // 叠加渔港范围
        if (item.positionInfo) {
          const symbol = [
            {
              lineColor: item.lineColor,
              lineWidth: item.lineWidth,
              polygonFill: item.fillColor,
              polygonOpacity: item.diaphaneity
            }
          ]
          const positionInfo = JSON.parse(item.positionInfo)
          const geometry = this.initGeometry({
            className: 'Polygon',
            params: [
              positionInfo,
              { symbol }
            ]
          })
          geometry.addTo(this.vector.port)
        }
      })
    },
    addRadarToMap () {
      this.radar.forEach((item) => {
        const radar = new maptalks.Marker(item.coordinate, {
          interactive: false,
          zIndex: 1,
          symbol: $configs.getRadarEquipmentSymbol()
        }).addTo(this.vector.radar)
        radar.animate({
          symbol: [
            {
              markerRotation: 360
            },
            {
            },
            {
            }
          ]
        }, {
          duration: 2000,
          repeat: true
        })
      })
    },
    addTemperatureToMap (target) {
      const color = {
        temp: [
          [-15, [255, 0, 0, 255]],
          [-7, [255, 80, 0, 255]],
          [0, [255, 0, 0, 255]],
          [7, [255, 255, 0, 255]],
          [14, [7, 193, 59, 255]],
          [21, [2, 239, 204, 255]],
          [28, [0, 155, 255, 255]],
          [35, [0, 0, 255, 255]]
        ]
      }
      const tempInterpolateColor = color.temp.reduce(
        (result, item, key) => result.concat(
          item[0],
          'rgba(' + item[1].join(',') + ')'
        ),
        []
      )
      const image = api.weather_rest + '/pngInfo/png?type=temp&source=ecmwf&datetime=' + this.date
      const tempLayer = new ScalarLayer('气温', {
        type: 'image',
        url: image,
        extent: [
          [-180, 90],
          [-180, -90],
          [180, 90],
          [180, -90]
        ],
        width: 360,
        height: 180,
        min: -40,
        max: 40
      }, {
        zIndex: 1,
        styleSpec: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            ...tempInterpolateColor
          ],
          opacity: [
            'interpolate',
            ['exponential', 0.1],
            ['zoom'],
            5,
            0.5,
            8,
            1
          ]
        },
        renderForm: 'r'
      })

      mtkTool.lib.parseUVImage(image, [1, 255], [1, 255]).then(({ r, g, b, a }) => {
        const field = new ScarField({
          xmin: -180,
          xmax: 180,
          ymin: -90,
          ymax: 90,
          scars: r,
          deltaX: 1,
          deltaY: 1
        })
        this.weather.tempField = field
        this.weather.temperature = tempLayer
        tempLayer.setOpacity(0.5)
        tempLayer.addTo(this.map)
        target.active = 'active'
      })
    },
    addTrackToMap () {
      if (!this.track.path.length) {
        return null
      }

      const collection = []
      let lastPoint = null
      let lastTimeStamp = 0
      const lastIndex = this.track.path.length - 1
      this.track.path.map((item, index) => {
        const currentPoint = item.slice(0, 2)
        // 轨迹线
        if (index) {
          collection.push(new maptalks.LineString([
            lastPoint, [
              (lastPoint[0] + currentPoint[0]) / 2,
              (lastPoint[1] + currentPoint[1]) / 2
            ]
          ], this.track.config.lineStyle[0]), new maptalks.LineString([
            [
              (lastPoint[0] + currentPoint[0]) / 2,
              (lastPoint[1] + currentPoint[1]) / 2
            ], currentPoint
          ], this.track.config.lineStyle[1]))
        }
        // 轨迹点、当前位置
        const showTimeLabel = index ? (item[2] - lastTimeStamp > 1000000) : true
        this.track.config.markerStyle.normal.symbol[0].markerRotation = item[3]
        this.track.config.markerStyle.normal.symbol[1].textName = showTimeLabel ? item[4] : ''
        collection.push(new maptalks.Marker(currentPoint, this.track.config.markerStyle.normal))
        if (index === lastIndex) {
          // const offset = [
          //   currentPoint[0] - lastPoint[0],
          //   currentPoint[1] - lastPoint[1]
          // ]
          this.track.config.markerStyle.current.symbol.markerRotation = item[3]
          collection.push(
            new maptalks.Marker(currentPoint, this.track.config.markerStyle.focus),
            new maptalks.Marker(currentPoint, this.track.config.markerStyle.current)
          )
        }
        lastPoint = currentPoint
        lastTimeStamp = showTimeLabel ? item[2] : lastTimeStamp
      })
      if (this.track.geometry) {
        this.track.geometry.remove()
      }
      this.track.geometry = new maptalks.GeometryCollection(collection).addTo(this.vector.track)
    },
    addTrawlerToMap (info, focus, light, status) {
      let layer = null
      let type = null
      if (focus && !light) {
        layer = this.vector.vector__trawler_focus
        type = 'focus'
      } else if (light && !focus) {
        layer = this.vector.vector__trawler_light
        type = 'light'
      } else if (light && focus) {
        layer = this.vector.vector__trawler_light_focus
        type = 'light_focus'
      } else {
        layer = this.vector.vector__trawler_dynamic
        type = 'ordinary'
      }
      // 渔船实时点位叠加到地图 // 添加船舶实时点
      const marker = new maptalks.Marker({
        x: info.longitude,
        y: info.latitude
      }, {
        id: info.uuid,
        properties: info,
        visible: true,
        zIndex: 5,
        symbol: $configs.getTrawlerSymbol(info)
      })
      if (!status) {
        marker.addTo(layer)
      }

      // 激活图例
      const plugins = this.$refs['screen-legend'].plugins.data
      const lengend = plugins.find(item => item.name === 'legend')
      const legendMap = {}
      lengend.options.forEach(item => {
        legendMap[item.type] = item.active === 'active'
      })

      if (legendMap[info.equipment]) {
        marker.show()
      } else {
        marker.hide()
      }

      // 弹窗设置
      marker.on('click', (evt) => {
        this.locate(null, null, info)
        // 获取船主电话-显示弹窗
        this.handleMarkerEvent(marker, info, evt, type)
      })

      return marker
    },
    addVideoToMap () { // 叠加渔港卫士图层
      this.vector.video.clear()
      const monitorStatus = localStorage.getItem('monitor-state')
      let status = {
      }
      if (monitorStatus) {
        status = JSON.parse(monitorStatus)
      }
      const data = this.video.data.map(item => {
        if (status.normal && !status.abnormal) {
          if (item.runStatus - 0 === 1) {
            if (item.duration === '海防' && status.coast) {
              item.visible = true
            } else if (item.duration === '天网' && status.skynet) {
              item.visible = true
            } else if (item.duration === '渔政' && status.fishery) {
              item.visible = true
            } else if (!item.duration && status.other) {
              item.visible = true
            } else {
              item.visible = false
            }
          } else {
            item.visible = false
          }
          return item
        } else if (!status.normal && status.abnormal) {
          if (item.runStatus - 0 !== 1) {
            if (item.duration === '海防' && status.coast) {
              item.visible = true
            } else if (item.duration === '天网' && status.skynet) {
              item.visible = true
            } else if (item.duration === '渔政' && status.fishery) {
              item.visible = true
            } else if (!item.duration && status.other) {
              item.visible = true
            } else {
              item.visible = false
            }
          } else {
            item.visible = false
          }
          return item
        } else if (status.normal && status.abnormal) {
          if (item.duration === '海防' && status.coast) {
            item.visible = true
          } else if (item.duration === '天网' && status.skynet) {
            item.visible = true
          } else if (item.duration === '渔政' && status.fishery) {
            item.visible = true
          } else if (!item.duration && status.other) {
            item.visible = true
          } else {
            item.visible = false
          }
          return item
        } else if (!status.normal && !status.abnormal) {
          item.visible = false
          return item
        }
      })
      data.forEach(item => {
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

        if (item.visible) {
          pic.show()
          guard.show()
        } else {
          pic.hide()
          guard.hide()
        }
        pic.addTo(this.vector.video)
        guard.addTo(this.vector.video)

        this.guard.latitude.push(item.latitude - 0)
        this.guard.longitude.push(item.longitude - 0)

        guard.on('click', () => {
          guard.flash(200, 4)
          this.$EventBus.$emit('toggle-monitor-dialog', item)
        })
        pic.on('click', () => {
          pic.flash(200, 4)
          this.$EventBus.$emit('toggle-monitor-dialog', item)
        })
      })
    },
    addWaveToMap (target) {
      const color = {
        temp: [
          [0, [8, 24, 64, 0]],
          [0.3, [10, 42, 105, 255]],
          [0.5, [16, 69, 148, 255]],
          [0.8, [39, 107, 176, 255]],
          [1, [49, 119, 181, 255]],
          [1.2, [66, 138, 194, 255]],
          [1.5, [86, 163, 204, 255]],
          [1.8, [122, 191, 214, 255]],
          [2, [149, 207, 222, 255]],
          [2.3, [159, 214, 227, 255]],
          [2.5, [193, 232, 225, 255]],
          [3.0, [252, 230, 106, 255]],
          [3.5, [247, 212, 72, 255]],
          [4.0, [237, 189, 43, 255]],
          [4.5, [219, 112, 11, 255]],
          [5.0, [217, 94, 0, 255]],
          [6.0, [125, 27, 12, 255]]
        ]
      }
      const tempInterpolateColor = color.temp.reduce(
        (result, item, key) => result.concat(
          item[0],
          'rgba(' + item[1].join(',') + ')'
        ),
        []
      )
      const image = api.weather_rest + '/pngInfo/png?type=hwave&source=ecmwf&datetime=' + this.date
      const tempLayer = new ScalarLayer('浪高', {
        type: 'image',
        url: image,
        extent: [
          [-180, 90],
          [-180, -90],
          [180, 90],
          [180, -90]
        ],
        width: 360,
        height: 180,
        min: 0,
        max: 10
      }, {
        zIndex: 1,
        styleSpec: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            ...tempInterpolateColor
          ],
          opacity: [
            'interpolate',
            ['exponential', 0.1],
            ['zoom'],
            5,
            0.5,
            8,
            0.6
          ]
        },
        renderForm: 'r'
      })

      mtkTool.lib.parseUVImage(image, [0, 255], [0, 255])
        .then(({ r, g, b, a }) => {
          this.weather.waveField = new ScarField({
            xmin: -180,
            xmax: 180,
            ymin: -90,
            ymax: 90,
            scars: r,
            deltaX: 1,
            deltaY: 1
          })

          this.weather.wave = tempLayer
          tempLayer.addTo(this.map)
          target.active = 'active'
        })
    },
    addWindToMap (target) {
      const data1 = png360data().data1
      const data2 = png360data().data2
      mtkTool.lib.parseUVImage(
        api.weather_rest + '/pngInfo/png?type=wind&source=ecmwf&datetime=' + this.date,
        [0, 255],
        [-30, 30]
      )
        .then(({ r, g, b, a }) => {
          data1.data = r
          data2.data = g
          const vs = velocityScales()
          const wind = new WindLayer('wind', [data1, data2], {
            zIndex: 1,
            windOptions: {
              colorScale: colorScale(),
              velocityScale: () => {
                const zoom = this.map.getZoom()
                return vs[zoom] || 1 / 40
              },
              frameRate: 20,
              maxAge: 90,
              globalAlpha: 0.94,
              paths: 5000
            }
          })
          this.weather.wind = wind
          wind.addTo(this.map)
          target.active = 'active'
        })
    },
    /**
     * 地图移动时移除视野之外的渔船
     */
    clearOverviewTrawlerPoint () {
      const extent = this.map.getExtent()
      const [xmax, xmin, ymax, ymin] = [extent.xmax, extent.xmin, extent.ymax, extent.ymin]

      const layer = this.vector.vector__trawler_dynamic
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
    /**
     * 清除瓦片或实时点位数据库
     * @param clear 是否清空聚合数据及图层
     */
    clearTrawlerData (clear) {
      if (this.tile.layer) { // 清空瓦片
        this.map.removeLayer(this.tile.layer)
        this.tile.layer = null
      }
      // 清除实时点位数据
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      // 清空地图上的点位
      this.geometries._trawler_dynamic = []
      const plugins = this.$refs['screen-legend'].plugins
      const legend = plugins.data[0].options
      legend.forEach((item, i) => {
        if (i < 4) {
          item.value = ''
        }
      })
      this.vector.vector__trawler_dynamic.clear()
      this.vector.vector__trawler_dynamic.hide()
      // 清空重点关注数据
      this.vector.vector__trawler_focus.clear()
      // 清空高亮渔船数据
      this.vector.vector__trawler_light.clear()
      // 清空重点关注+高亮渔船
      this.vector.vector__trawler_light_focus.clear()
      if (this.timernumber) {
        clearInterval(this.timernumber)
        this.timernumber = null
      }
      if (!clear) {
        plugins.polymerization = ''
        if (this.clusterLayer) {
          this.clusterLayer.remove()
          this.clusterLayer = null
        }
      }
    },
    closeLocate () {
      this.location.visible = false
      this.vector.vector_locate.clear()
    },
    closePosition (uuid) { // 关闭调船位功能
      this.adjust.visible = false
      if (uuid) {
        const layer = this.vector.vector__trawler_dynamic
        const marker = layer.getGeometryById(uuid)
        if (marker) {
          const properties = marker.getProperties()
          const type = properties.type
          const online = properties.online
          if (online) {
            marker.updateSymbol({
              markerFill: $configs.colorConfig.trawler[type]
            })
          } else {
            marker.updateSymbol({
              markerFill: '#939393'
            })
          }
        }
      }
    },
    closeSift () { // 关闭渔船筛选后加载所有渔船点位
      this.sift.visible = false
      // 加载渔船点位
      this.initData(true)
      // 加载重点关注、高亮渔船点位
      this.loadFocusTrawlerData()
    },
    closeTrack () {
      clearInterval(this.review.playing)
      if (this.player) {
        this.player.remove()
      }
      if (this.track.geometry) {
        this.track.geometry.remove()
        this.track.geometry = null
      }
      if (this.vector.track) {
        this.vector.track.clear()
      }
      this.review.status = 'cancel'
      this.review.now = 0
      this.review.current = this.review.start
      this.track.visible = false
    },
    formatTrawlerNumber (list, focus, light) { // 格式化渔船数量
      const legend = this.$refs['screen-legend'].plugins.data[0].options
      if (!focus && !light) {
        const types = ['AIS', 'Beidou', 'Radar-AIS', 'Radar']
        types.forEach((item, i) => {
          const result = list.filter(_item => _item.msgType === item)
          legend[i].value = `${result.filter(_item => _item.online).length} / ${result.filter(_item => !_item.online).length}`
        })
      } else if (focus && !light) {
        legend[4].value = list.length
      } else if (light && !focus) {
        legend[5].value = list.length
      } else {
        legend[6].value = list.length
      }
    },
    handleAnalysisEvent (type, data, path, geojson) { // 报警类型、报警详情数据、报警轨迹数据
      const layer = this.vector.vector_analysis
      layer.clear()

      const position = {
        x: data.lastLongitude - 0,
        y: data.lastLatitude - 0
      }
      let marker = null
      switch (type) {
        case 'beidous': {
          const names = data.shipNameArray.split(',')
          const times = data.locationTimeArray.split(',')
          const info = {
            boatName: names[0],
            lastMsgType: data.lastMsgType,
            lastLocationTime: times[0],
            name2: names[1],
            name3: names[2],
            ownerName: data.ownerName,
            ownerPhone: data.ownerPhone,
            time2: times[1],
            time3: times[2]
          }
          marker = new maptalks.Marker(position, {
            properties: data,
            visible: true,
            zIndex: 5,
            symbol: $configs.getAnalysisSymbol('normal')
          })
          marker.addTo(layer)
          marker.setInfoWindow($configs.getPopupAnalysisBeidou(info, type))
          marker.openInfoWindow(new maptalks.Coordinate(position))
          break
        }
        case 'bad-weather': // 恶劣天气出海
        case 'crossing': // 围栏越界
        case 'fishing': // 越界捕捞
        case 'focus': // 重点关注渔船
        case 'reported': { // 未报备出海
          marker = new maptalks.Marker(position, {
            id: data.id,
            properties: data,
            visible: true,
            zIndex: 5,
            symbol: {
            }
            // symbol: $configs.getAnalysisSymbol('normal')
          })
          const paths = new maptalks.LineString(path, $configs.getAnalysisSymbol('path'))
          const points = new maptalks.MultiPoint(path, $configs.getAnalysisSymbol('point'))
          layer.addGeometry(marker, paths, points)

          if (type === 'reported') {
            // 叠加区域geojson
            const geometries = maptalks.GeoJSON.toGeometry([geojson], geometry => {
              geometry.setSymbol([{
                lineColor: 'red',
                lineWidth: 2,
                lineJoin: 'round',
                lineCap: 'round',
                lineDasharray: [4, 2, 4],
                lineOpacity: 1
              }])
            })
            layer.addGeometry(geometries)
          }
          marker.setInfoWindow($configs.getPopupAnalysis(data, type))
          marker.openInfoWindow(new maptalks.Coordinate(position))
          break
        }
        case 'key':
        case 'satellite': { // 北斗2h不开机
          marker = new maptalks.Marker(position, {
            id: data.id,
            properties: data,
            visible: true,
            zIndex: 5,
            symbol: $configs.getAnalysisSymbol('normal')
          })
          marker.addTo(layer)
          marker.setInfoWindow($configs.getPopupAnalysis(data, type))
          marker.openInfoWindow(new maptalks.Coordinate(position))
          break
        }
        default: {
          break
        }
      }
      this.map.animateTo({
        center: [position.x, position.y]
      })
    },
    handleMarkerEvent (marker, info, evt, type) {
      // 任意点击移除彩云图图层
      // if (this.vector.cloud) {
      //   this.vector.cloud.remove()
      // }
      const params = new FormData()
      params.append('ownerName', info.owner)

      this.axios.post(api.getOwnerPhoneByName, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          info.phone = res.result ? res.result.phone : ''
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        marker.setProperties(info)
        marker.setInfoWindow($configs.getPopup(info))
        marker.openInfoWindow(evt.coordinate)
        // 分组渔船时，为避免频繁跳出所以不展示渔船详情
        if (this.visible.point) {
          return null
        }
        this.$router.push({
          path: '/screen/trawler-info',
          query: {
            id: info.uuid,
            name: info.shipName || info.mmsi,
            type: type
          }
        })
        // 高亮船只唤起彩云图
        // if (type === 'light') {
        //   this.toggleColorCloudMap(marker)
        // }
        if (this.timerlocate) {
          clearTimeout(this.timerlocate)
          this.timerlocate = null
        }
        this.timerlocate = setTimeout(() => {
          marker.closeInfoWindow()
          if (this.layers.vector_locate) {
            this.layers.vector_locate.clear()
          }
        }, 1000 * 40)
      })
    },
    handlePluginEvent (name, params, index) { // 地图右侧图例操作
      const plugins = this.$refs['screen-legend'].plugins
      switch (name) {
        case 'measure-area': { // 测面积
          if (this.vector.distance) {
            this.vector.distance.clear().remove()
            plugins.distance = ''
          }
          if (this.vector.area) {
            this.vector.area.clear().remove()
            this.vector.area = null
            plugins.area = ''
          } else {
            this.vector.area = new maptalks.AreaTool(
              $configs.AreaToolConf
            ).addTo(this.map)
            plugins.area = 'active'
          }
          break
        }
        case 'measure-distance': { // 测距
          // 关闭测面积
          if (this.vector.area) {
            this.vector.area.clear().remove()
            plugins.area = ''
          }
          if (this.vector.distance) {
            this.vector.distance.clear().remove()
            this.vector.distance = null
            plugins.distance = ''
          } else {
            this.vector.distance = new maptalks.DistanceTool(
              $configs.DistanceToolConf
            ).addTo(this.map)
            plugins.distance = 'active'
          }
          break
        }
        case 'toggle-expand': { // 展开
          if (plugins.expand) {
            plugins.expand = ''
            this.$router.back()
          } else {
            plugins.expand = 'active'
            this.$router.push({
              path: '/screen/screen-expend'
            })
          }
          break
        }
        case 'toggle-group': { // 切换渔船分组
          this.adjust.visible = false
          this.sift.visible = false
          // 关闭渔船聚合功能
          const polymerization = plugins.polymerization
          if (polymerization) {
            this.handlePluginEvent('toggle-polymerization', '', -1)
          }
          this.clearTrawlerData()
          this.$router.push({
            path: '/screen/trawler-grouping'
          })
          break
        }
        case 'toggle-layer': { // 切换渔船点位图层
          if (params && index !== -1) {
            const legend = plugins.data.find(
              (item) => item.name === 'legend'
            )
            const target = legend.options[index]
            const layer = this.vector.vector__trawler_dynamic
            if (target.active) {
              target.active = ''
            } else {
              target.active = 'active'
            }
            layer.forEach((geo) => {
              const equipment = geo.getProperties().type
              if (target.type === equipment) {
                target.active ? geo.show() : geo.hide()
              }
            })
          }
          break
        }
        case 'toggle-special': { // 特殊渔船切换显隐
          if (params && index !== -1) {
            const legend = plugins.data.find(
              (item) => item.name === 'legend'
            )
            const target = legend.options[index]
            const layer = this.vector[`vector__trawler_${params}`]
            if (target.active) {
              target.active = ''
              layer.hide()
            } else {
              target.active = 'active'
              layer.show()
            }
          }
          break
        }
        case 'toggle-locate': { // 调船位
          this.location.visible = true
          break
        }
        case 'toggle-overlay': {
          if (params && index !== -1) {
            const geography = plugins.data.find(
              (item) => item.name === 'geography'
            )
            const target = geography.options[index]
            const layer = this.vector[params]
            const data = this[params].data
            if (data.length) {
              if (layer.isVisible()) {
                layer.hide()
                target.active = ''
              } else {
                layer.show()
                target.active = 'active'
              }
            } else {
              const name = params.replace(/^\w/, params[0].toUpperCase())
              const methodName = `init${name}Data`
              this[methodName](target)
            }
            // 渔港卫士图例
            if (params === 'video') {
              this.video.visible = !!target.active
            }
          }
          break
        }
        case 'toggle-polymerization': {
          // 在渔船分组功能下不可用
          const names = this.$route.name
          if (names === 'trawler-grouping') {
            this.$router.push({
              path: '/screen'
            })
          }
          // 渔船聚合功能
          if (plugins.polymerization) { // 关闭渔船聚合
            plugins.polymerization = ''
            if (this.clusterLayer) {
              this.clusterLayer.remove()
              this.clusterLayer = null
            }
            this.geometries._trawler_dynamic = []
            this.initData(true)
            // 加载重点关注等渔船
            this.loadFocusTrawlerData()
          } else {
            plugins.polymerization = 'active'
            // 清空所有图层
            this.clearTrawlerData(true)

            // 开启渔船聚合
            this.initTrawlerDataByRange(0, 0, true)
            // 更新渔船总数
            this.loadTrawlerNumber()
          }
          break
        }
        case 'toggle-satellite': { // 调船位
          // 在渔船分组功能下不可用
          const names = this.$route.name
          if (names === 'trawler-grouping') {
            this.$message.warning('渔船分组下该功能不可用！')
            return null
          }
          this.sift.visible = false
          this.adjust.visible = true
          break
        }
        case 'toggle-sift': { // 渔船筛选
          // 在渔船分组功能下不可用
          const names = this.$route.name
          if (names === 'trawler-grouping') {
            this.$message.warning('渔船分组下该功能不可用！')
            return null
          }
          this.adjust.visible = false
          this.sift.visible = true
          // 清空地图渔船点位
          this.clearTrawlerData()
          break
        }
        case 'toggle-update': {
          this.loadTrawlerData()
          break
        }
        case 'switch-base': { // 底图切换
          if (params && index !== -1) {
            const base = plugins.data.find(
              (item) => item.name === 'base'
            )
            const lastIndex = plugins.base
            const last = base.options[lastIndex]
            const target = base.options[index]
            target.active = target.active ? '' : 'active'
            last.active = ''
            plugins.base = index
            this.setBaseLayer(params)
          }
          break
        }
        case 'toggle-weather': { // 气象要素
          if (params && index !== -1) {
            const weather = plugins.data.find(
              (item) => item.name === 'weather'
            )
            const target = weather.options[index]
            const layer = this.weather[params]
            if (layer) {
              if (layer.isVisible()) {
                layer.hide()
                target.active = ''
              } else {
                layer.show()
                target.active = 'active'
              }
            } else {
              const name = params.replace(/^\w/, params[0].toUpperCase())
              const methodName = `add${name}ToMap`
              this[methodName](target)
            }
            this.vector.weather.hide()
          }
          break
        }
        case 'zoom-in': {
          this.map.zoomIn()
          break
        }
        case 'zoom-out': {
          this.map.zoomOut()
          break
        }
        default: {
          break
        }
      }
    },
    handleWebsocket () {
      const type = this.websocket.list.find(item => item.key === this.websocket.type).prop
      this.$router.push({
        path: '/screen/analysis',
        query: {
          shipName: this.websocket.shipName,
          type
        }
      })
      this.websocket.content = ''
      // this.$router.push({
      //   name: 'trawler-analysis',
      //   params: {
      //     shipName: this.websocket.shipName,
      //     type
      //   }
      // })
    },
    initWeatherPopup ({ data, x, y }) {
      const layer = this.vector.weather.clear()
      const windExisted = data.find((item) => item.label === '风场')
      const width = windExisted ? 370 : 200
      const hetght = data.length * 32

      const popupOptions = {
        symbol: [
          {
            markerType: 'ellipse',
            markerFill: '#015EEA',
            markerFillOpacity: 1,
            markerLineColor: '#015EEA',
            markerLineWidth: 1,
            markerLineOpacity: 1,
            markerWidth: 5,
            markerHeight: 5,
            markerDx: 0,
            markerDy: 0,
            markerOpacity: 1
          },
          {
            markerType: 'path',
            markerPath: {
              fill: 'none',
              path: 'M0 40 L20 0 L40 0',
              stroke: '#015EEA'
            },
            markerPathWidth: 40,
            markerPathHeight: 40,
            markerDy: 0,
            markerDx: 40
          },
          {
            markerDx: 80,
            markerDy: -96,
            markerFill: 'rgb(0, 10, 16)',
            markerFillOpacity: 0.8,
            markerLineWidth: 0,
            markerHeight: hetght,
            markerOpacity: 1,
            markerType: 'rectangle',
            markerWidth: width
          }
        ]
      }
      const textOptions = JSON.stringify([
        {
          markerDx: 90,
          markerDy: -81,
          markerFill: {
            colorStops: [
              [0.00, 'rgba(1, 94, 234, 0)'],
              [0.50, 'rgba(1, 94, 234, 0.3)'],
              [1, 'rgba(1, 94, 234, 0)']
            ],
            type: 'linear'
          },
          markerFillOpacity: 1,
          markerHeight: 22,
          markerLineColor: 'white',
          markerLineWidth: 1,
          markerLineOpacity: 0,
          markerOpacity: 1,
          markerType: 'rectangle',
          markerWidth: width - 20
        },
        {
          textDx: 90,
          textDy: -69,
          textFill: 'white',
          textHorizontalAlignment: 'right',
          textName: '【AIS】鲁青新渔168008',
          textOpacity: 0.8,
          textSize: 14
        }
      ])

      data.forEach((item, index) => {
        const _symbol = JSON.parse(textOptions)
        _symbol[0].markerDy = index * 32 - 91
        _symbol[1].textDy = index * 32 - 79
        _symbol[1].textName = `【${item.label}】${item.content}`
        popupOptions.symbol.push(..._symbol)
      })

      const popup = new maptalks.Marker([x, y], popupOptions)
      layer.addGeometry(popup)
      layer.show()

      setTimeout(() => {
        layer.hide()
      }, 1000 * 5)
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
    initCatchData (target) {
      const params = new FormData()
      params.append('alarmType', '越界制捕区域')

      target.active = 'active'
      this.catch.data = []
      this.axios.post(api.res_catch, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.catch.data = res.result.geometry.coordinates.slice()
          this.addCatchToMap()
        } else {
          this.$message.error(res.msg || '界定水域数据查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    initClosedData (target) {
      const params = new FormData()
      params.append('pageNum', 1)
      params.append('pageSize', -1)
      params.append('markType', '封闭式围栏')

      this.axios.post(api.getKeyAreaPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.vector.closed.clear()
          if (this.vector.closed.isVisible()) {
            this.vector.closed.hide()
            target.active = ''
          } else {
            this.vector.closed.show()
            target.active = 'active'
          }
          this.closed.data = res.result.records.filter(item => item.field5 - 0)
          this.addClosedAreaToMap(this.closed.data)
        } else {
        }
      }).catch(err => {
        console.error(err)
      })
    },
    /**
     * 加载渔船数据-瓦片/点位
     * @param visible 判断是否重新渲染瓦片 地图缩放时需要重新加载，地图移动时不需要重新加载
     */
    initData (visible) {
      // 开启渔船筛选后清空瓦片
      if (this.sift.visible || this.visible.point) {
        return null
      }
      // 根据缩放级别
      if (this.mouse.zoom > 12) {
        // 清空瓦片
        if (this.tile.layer) {
          this.map.removeLayer(this.tile.layer)
          this.tile.layer = null
        }
        // 清空定时器
        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        // 图层显示，清空图层信息及数据信息
        this.vector.vector__trawler_dynamic.show()
        // 暂时注释
        // this.geometries._trawler_dynamic = []
        // this.vector.vector__trawler_dynamic.clear()
        this.timeout = setTimeout(() => {
          this.loadTrawlerData()
        }, 1000)
      } else {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        const legend = this.$refs['screen-legend'].plugins.data[0].options
        legend.forEach((item, i) => {
          if (i < 4) {
            item.value = ''
          }
        })
        // 此时清空地图上的点位
        this.geometries._trawler_dynamic = []
        this.vector.vector__trawler_dynamic.clear()
        this.vector.vector__trawler_dynamic.hide()

        if (visible) {
          this.loadTrawlerTile()
        }
        if (this.timenumber) {
          clearTimeout(this.timenumber)
          this.timenumber = null
        }
        this.timenumber = setTimeout(() => {
          this.loadTrawlerNumber()
        }, 1000 * 3)
      }
    },
    initFishingData (target) {
      this.vector.fishing.clear()
      this.axios.get(api.res_fishingArea).then(response => {
        target.active = 'active'
        this.fishing.data = response.data.slice()
        const hintList = [
          '35', '36', '37', '38', '39', '40', '41', '42',
          '43', '44', '45', '46', '47', '48', '49', '50',
          '51', '52', '53', '54', '55', '56', '57', '58',
          '59', '60', '61', '62', '63', '64', '65', '66',
          '67', '68', '69', '70', '71', '72', '73', '74',
          '75', '76', '77', '78', '79', '80', '81', '82',
          '83', '84', '85', '86', '87', '88', '89', '90',
          '91', '92', '93', '94', '95', '96', '97', '98',
          '99', '100', '101', '102', '103', '104', '105', '106',
          '107', '108', '109', '110', '111', '112', '113', '114',
          '115', '116', '117', '118'
        ]
        this.fishing.data.forEach((item) => {
          item.properties.Hint = false
          const name = item.properties.Name
          if (/-/.test(name)) {
            const belong = item.properties.Name.replace(/-.*/)
            if (hintList.indexOf(belong)) {
              item.properties.Hint = true
            }
          }
          const geo = new maptalks.Polygon(item.coordinates, {
            properties: item.properties,
            symbol: item.symbol
          })
          this.vector.fishing.addGeometry(geo)
        })
      })
    },
    initGeometry ({ className, params }) { // 地图元素构造
      return new maptalks[className](...params)
    },
    initGridData (target) {
      const layer = this.vector.grid
      if (layer) {
        layer.clear()
      } else {
        this.vector.grid = new maptalks.VectorLayer('grid', $configs.layerConfig(4)).addTo(this.map)
      }
      target.active = 'active'
      this.grid.data.push({
      })
      this.refreshGridLine()
    },
    initMap () {
      const mapConfig = localStorage.getItem('map-config')
      const config = mapConfig ? JSON.parse(mapConfig) : null
      this.map = new maptalks.Map('screen-map', {
        attribution: '',
        bearing: 0,
        center: config ? [config.longitude - 0, config.latitude - 0] : $configs.center,
        dragPitch: false,
        dragRotate: false,
        minZoom: 2,
        spatialReference: {
          projection: 'EPSG:3857'
        },
        pitch: 30,
        // zoom: 8
        zoom: config ? config.zoom : $configs.zoom
      })

      // 同步鼠标经纬度
      this.mouse.zoom = config ? config.zoom : $configs.zoom
      this.mouse.longitude = config ? config.longitude - 0 : $configs.center[0]
      this.mouse.latitude = config ? config.latitude - 0 : $configs.center[1]

      // 底图图层
      $configs.getbaseLayerConfig().forEach((item) => {
        this.initBaseLayer(item.name, item)
      })
      this.setBaseLayer(this.base)

      // 注册图层
      this.registerLayerToMap()

      // 地图事件响应：鼠标移动
      this.map.on('mousemove', (e) => {
        const position = $configs.formatPositon(e.coordinate.x.toFixed(6), e.coordinate.y.toFixed(6))
        this.mouse.longitude = position.jd
        this.mouse.latitude = position.wd
        this.mouse.lon = e.coordinate.x.toFixed(6)
        this.mouse.lat = e.coordinate.y.toFixed(6)
      })
      const plugins = this.$refs['screen-legend'].plugins
      // 地图事件响应：鼠标缩放
      this.map.on('zoomend', (e) => {
        this.mouse.zoom = e.to
        if (!this.clusterLayer && !plugins.polymerization) {
          this.initData(true)
        }
      })
      // 地图事件响应：视窗改变
      this.map.on('viewchange', (e) => {
        // 经纬度网格线刷新
        this.refreshGridLine()
      })
      this.map.on('movestart', () => {
        this.mouse.center = this.map.getCenter()
      })
      // 其他地图事件
      this.map.on('moveend', (e) => {
        // 用来控制请求频率
        // 暂时注释，使用更新点位的方式
        // const center = this.map.getCenter()
        // const rangeX = (center.x - this.mouse.center.x).toFixed(6)
        // const rangeY = (center.y - this.mouse.center.y).toFixed(6)
        // const proportion = this.moveMap[this.map.getZoom()] || 0
        // if ((this.mouse.zoom > 12 && (Math.abs(rangeX) > proportion || Math.abs(rangeY) > proportion)) || this.mouse.zoom <= 12) {
        // }
        if (!this.clusterLayer && !plugins.polymerization) {
          this.initData(false)
        }
        // 根据缩放加载渔船点位数据
        // if (!this.clusterLayer) {
        //   this.initData(false)
        // }
      })
      // 地图事件
      this.map.on('click', (e) => {
        this.updateWeatherPopup(e)
      })
    },
    initPlayer () {
      this.review.status = 'cancel'
      this.review.now = 0
      this.review.current = this.review.start
      if (this.player) {
        this.player.remove()
      }
      if (this.track.path.length) {
        const route = [{
          path: this.track.path,
          markerSymbol: this.track.config.routeStyle.marker,
          lineSymbol: this.track.config.routeStyle.line
        }]
        this.player = new routeplayer.RoutePlayer(route, this.map)
      }

      // setStyle('.ivu-slider-wrap', {
      //   'margin-top': '10px',
      //   'margin-bottom': '10px'
      // })
    },
    initPortData (target) { // 获取港口数据
      const params = new FormData()

      this.axios.post(api.getPortList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.vector.port.clear()
          this.port.data = res.result.slice()
          target.active = 'active'
          this.addPortToMap()
          // this.port.data = res.result.forEach(item => {
          //   if (item.longitude && item.latitude) {
          //     this.addPortToMap(item)
          //     target.active = 'active'
          //   }
          // })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    initStyle () { // 缩放区域样式
      const meta = this.$route.meta
      this.mouse.class = meta.name || ''
      // 动态监控样式
      // 展开样式
      const plugins = this.$refs['screen-legend'].plugins
      this.visible.point = meta.point
      switch (this.$route.name) {
        case 'port-info':
        case 'port-monitor':
        case 'trawler-grouping': {
          if (!plugins.expand) {
            plugins.expand = 'active'
          }
          break
        }
        case 'trawler-analysis':
        case 'trawler-info':
        case 'trawler-statistics': {
          if (plugins.expand) {
            plugins.expand = ''
          }
          break
        }
        default: {
          break
        }
      }
    },
    initTrawlerData (type) {
      const params = new FormData()
      params.append('beginDate', this.yesterday)
      params.append('endDate', this.date)
      params.append('bwlx', type)

      this.axios.post(api.getTrawlerPoint, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const list = res.result || []
          const now = new Date()
          const gap = 1000 * 60 * 60 * 2
          const data = []
          list.map(item => {
            // 在离线判断，为了统计数量
            const gpsDate = new Date(item.gpsTime) // 时区校正
            item.online = now - gpsDate < gap
            if (data.findIndex(_item => _item.uuid === item.uuid) === -1) {
              data.push(item)
            }
          })
          // 构造新的分类信息
          data.forEach(item => {
            this.insertTrawler(item, true)
          })
          // 图例更新
          const legend = this.$refs['screen-legend'].plugins.data[0].options
          switch (type) {
            case 'AIS':
              // AIS渔船数量
              legend[0].value = `${list.filter(item => item.online).length} / ${list.filter(item => !item.online).length}`
              break
            case 'Beidou':
              legend[1].value = `${list.filter(item => item.online).length} / ${list.filter(item => !item.online).length}`
              break
            default:
              break
          }
        } else {
          this.$message.error(res.msg || '渔船点位查询失败！')
        }
      }).catch(err => {
        // this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    /**
     * 按可视区域加载渔船
     * @param focus 是否重点关注
     * @param light 是否高亮
     * @param status 是否聚合功能
     */
    initTrawlerDataByRange (focus, light, status) { // 重点关注、高亮、聚合
      // 高亮、重点关注渔船、聚合渔船由于不随视图缩放而重新加载数据，所以默认请求范围
      const ex = focus || light || status ? {
        xmax: 126.12890349399822,
        xmin: 116.66696050600194,
        ymax: 40.43773525131556,
        ymin: 35.62078442923823
      } : this.map.getExtent()
      const [xmax, xmin, ymax, ymin] = [ex.xmax, ex.xmin, ex.ymax, ex.ymin]
      const points = [
        { x: xmin, y: ymax },
        { x: xmax, y: ymax },
        { x: xmax, y: ymin },
        { x: xmin, y: ymin }
      ]
      const today = new Date()
      today.setHours(today.getHours() + 8)
      this.date = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
      today.setDate(today.getDate() - 1)
      this.yesterday = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
      const params = new FormData()
      params.append('beginTime', this.yesterday)
      params.append('endTime', this.date)
      params.append('points', JSON.stringify(points))
      params.append('mainType', focus) // 筛掉重点关注渔船
      params.append('highLightType', light) // 筛掉高亮渔船

      // 聚合功能时开始请求遮罩
      let loading = null
      if (status) {
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }

      this.trawler.data = []
      this.axios.post(api.getTrawlerPointByGeo, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const list = res.result || []
          const now = new Date()
          const gap = 1000 * 60 * 60 * 2
          const data = []
          this.trawler.data = list.map(item => {
            // 在离线判断，为了统计数量
            const gpsDate = new Date(item.gpsTime) // 时区校正
            item.online = now - gpsDate < gap
            if (data.findIndex(_item => _item.uuid === item.uuid) === -1) {
              data.push(item)
            }
            return item
          })
          // 构造新的分类信息
          const markers = []
          data.forEach(item => {
            if (status) {
              markers.push(this.insertTrawler(item, true, focus, light, status))
            } else {
              // 叠加点位-判断是否存在，不存在则新增，存在则更新
              if (this.geometries._trawler_dynamic.findIndex(geo => geo.uuid === item.uuid) === -1) {
                this.insertTrawler(item, true, focus, light, status)
              } else {
                this.insertTrawler(item, false, focus, light, status)
              }
            }
          })

          if (status) {
            this.clusterLayer = new ClusterLayer('cluster', markers, {
              noClusterWithOneMarker: false,
              maxClusterZoom: 13,
              // "count" is an internal variable: marker count in the cluster.
              symbol: {
                markerType: 'ellipse',
                markerFill: { property: 'count', type: 'interval', stops: [[0, '#FFD700'], [9, '#FFA500'], [99, '#FA8072']] },
                markerFillOpacity: 0.7,
                markerLineOpacity: 1,
                markerLineWidth: 8,
                markerLineColor: { property: 'count', type: 'interval', stops: [[0, 'rgba(255, 215, 0, 0.4)'], [9, 'rgba(255, 165, 0, 0.4)'], [99, 'rgba(255, 160, 122, 0.4)']] },
                markerWidth: { property: 'count', type: 'interval', stops: [[0, 40], [9, 40], [99, 40]] },
                markerHeight: { property: 'count', type: 'interval', stops: [[0, 40], [9, 40], [99, 40]] }
              },
              drawClusterText: true,
              geometryEvents: true,
              single: true
            })

            this.map.addLayer(this.clusterLayer)
          }
          // 更新渔船分类数量
          this.formatTrawlerNumber(list, focus, light)
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        if (status && loading) {
          loading.close()
        }
        // 加载普通渔船点位时清空视野范围之外的渔船
        if (!focus && !light && !status) {
          this.clearOverviewTrawlerPoint()
          // 清掉当前区域内未更新数据的渔船
          const layer = this.vector.vector__trawler_dynamic
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
      const layers = this.vector
      const name = `vector_${key}`
      let layer = this.vector[name]
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
    initVideoData (target) { // 获取监控点位配置
      const params = new FormData()
      params.append('pageNum', 1)
      params.append('pageSize', -1)

      target.active = 'active'
      this.axios.post(api.getVideoPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.video.data = res.result.records.slice()
          this.addVideoToMap()
        } else {
          this.$message.error(res.msg || '监控点位查询失败!')
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
      })
    },
    initWatersData (target) { // 获取协定水域
      target.active = 'active'
      this.vector.waters.clear()
      this.axios.get(api.res_agreement_waters).then((response) => {
        const res = response.data
        this.waters.data = [res]
        maptalks.GeoJSON.toGeometry(res, geo => {
          const properties = geo.getProperties()
          const center = properties.Center || geo.getCenter()
          const color = properties.Color
          const name = properties.Name
          geo.setSymbol([
            {
              lineColor: color,
              lineWidth: 1,
              lineDasharray: [2, 1, 2], // 线形
              lineOpacity: 1,
              polygonOpacity: 0.1,
              polygonFill: color
            }
          ])
          const text = new maptalks.Marker(
            center,
            {
              symbol: [
                {
                  textName: name,
                  textSize: 12,
                  textFill: 'black',
                  textOpacity: 1,
                  textDx: 0,
                  textDy: 0,
                  textHaloFill: 'white',
                  textHaloRadius: 2
                }
              ]
            }
          )
          this.vector.waters.addGeometry(geo)
          this.vector.waters.addGeometry(text)
        })
      }).catch(err => {
        console.error(err)
      })
    },
    insertTrawler (data, insert, focus, light, status) {
      const info = $configs.formartTrawlerInfo(data, focus, light)
      if (insert) { // 新增
        const marker = this.addTrawlerToMap(info, focus, light, status)
        this.geometries._trawler_dynamic.push(info)
        return marker
      } else { // 更新
        let layer = null
        if (focus && !light) {
          layer = this.vector.vector__trawler_focus
        } else if (light && !focus) {
          layer = this.vector.vector__trawler_light
        } else if (light && focus) {
          layer = this.vector.vector__trawler_light_focus
        } else {
          layer = this.vector.vector__trawler_dynamic
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
    /**
     * 渔船筛选
     */
    loadFocusTrawlerData () {
      // 开启渔船筛选后清空瓦片
      if (this.sift.visible || this.visible.point) {
        return null
      }
      if (this.timernumber) {
        clearInterval(this.timernumber)
        this.timernumber = null
      }
      const refresh = () => {
        // this.vector.vector__trawler_focus.clear()
        // this.vector.vector__trawler_light.clear()
        // this.vector.vector__trawler_light_focus.clear()
        this.initTrawlerDataByRange(1, 0, false)
        this.initTrawlerDataByRange(0, 1, false)
        this.initTrawlerDataByRange(1, 1, false)
      }

      refresh()
      this.timernumber = setInterval(() => {
        refresh()
      }, 1000 * 60 * 5)
    },
    loadTrawlerData () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      const refresh = () => {
        this.initTrawlerDataByRange(0, 0, false)
      }
      refresh()
      this.timer = setInterval(() => {
        refresh()
      }, 1000 * 60 * 3)
    },
    loadTrawlerNumber () { // 渔船点位瓦片下加载渔船数量
      const params = new FormData()

      this.axios.post(api.getTrawlerNumber, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          // 图例更新
          const data = res.result
          const legend = this.$refs['screen-legend'].plugins.data[0].options
          legend[0].value = `${data.aisOnline || 0}/${data.aisOffline || 0}`
          legend[1].value = `${data.bdOnline || 0}/${data.bdOffline || 0}`
          legend[2].value = `${data.radaraisOnline || 0}/${data.radaraisOffline || 0}`
          legend[3].value = `${data.radarOnline || 0}/${data.radarOffline || 0}`
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
      this.tile.layer = new maptalks.TileLayer('trawler-tile', {
        urlTemplate: api.getTrawlerByPng,
        hitDetect: false,
        detectRetina: true,
        forceRenderOnMoving: true
      })
      this.map.addLayer(this.tile.layer)
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
          .flash(400, 6)
        // 定位逻辑-瓦片状态下无法定位点位，新增渔船定位点位显示
        // 控制样式
        const symbol = $configs.getTrawlerSymbol(data)
        const isRadar = data.type === 'Radar'
        symbol[0].markerWidth = {
          stops: [
            [10, 0],
            [11, isRadar ? 20 : 12]
          ]
        }
        symbol[0].markerHeight = {
          stops: [
            [10, 0],
            [11, isRadar ? 20 : 22]
          ]
        }
        symbol[0].markerOpacity = {
          stops: [
            [13, 1],
            [14, 0]
          ]
        }
        const trawler = new maptalks.Marker({
          x: data.longitude,
          y: data.latitude
        }, {
          id: data.uuid,
          properties: data,
          visible: true,
          zIndex: 5,
          symbol: symbol
          // symbol: $configs.getTrawlerSymbol(data)
        })
        trawler.addTo(layer)
          .flash(400, 6)

        // 弹窗设置
        trawler.on('click', (evt) => {
          this.handleMarkerEvent(trawler, data, evt, 'locate')
        })

        if (x && y) {
          const coordinate = {
            x,
            y
          }
          this.handleMarkerEvent(trawler, data, coordinate, 'locate')
          this.map.setCenter([x, y])
        }
      }
    },
    locateByInput (latitude, longitude) {
      this.vector.vector_locate.clear()
      const marker = new maptalks.Marker(
        [longitude - 0, latitude - 0],
        {
          id: new Date().getTime(),
          visible: true,
          zIndex: 5,
          symbol: [
            {
              markerDx: 0,
              markerDy: 0,
              markerFile: '/img/map/icon-locate.png',
              markerHeight: 20,
              markerLineWidth: 0,
              markerWidth: 20
            }
          ]
        }
      )
      marker.addTo(this.vector.vector_locate)
      this.map.animateTo(
        {
          center: [longitude - 0, latitude - 0],
          zoom: 7
        },
        {
          duration: 1000,
          easing: 'out'
        }
      )
    },
    locateMonitor (e) {
      this.map.animateTo(
        {
          center: [e.longitude - 0, e.latitude - 0],
          zoom: 18
        },
        {
          duration: 1000,
          easing: 'out'
        }
      )
      this.vector.video.forEach(marker => {
        const property = marker.getProperties()
        marker.updateSymbol({
          textHaloFill: $configs.updateMonitorSymbol(property.duration)
        })
        if (marker.getId() === e.id) {
          marker.flash(200, 4)
          marker.updateSymbol({
            textHaloFill: '#FFA500'
          })
        }
      })
    },
    queryTrawlerByCondition (model) {
      const params = new FormData()
      params.append('length', model.length || '')
      params.append('lengthType', model.lengthType || '')
      params.append('power', model.power || '')
      params.append('powerType', model.powerType || '')
      this.vector.vector__trawler_dynamic.clear()
      this.vector.vector__trawler_dynamic.show()

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.axios.post(api.siftTrawlerList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const list = res.result || []
          const now = new Date()
          const gap = 1000 * 60 * 60 * 2
          const data = []
          list.map(item => {
            // 在离线判断，为了统计数量
            const gpsDate = new Date(item.gpsTime) // 时区校正
            item.online = now - gpsDate < gap
            if (data.findIndex(_item => _item.uuid === item.uuid) === -1) {
              data.push(item)
            }
          })
          // 构造新的分类信息
          data.forEach(item => {
            // 计算数量
            this.insertTrawler(item, true, false, false)
          })
          // 图例更新
          const legend = this.$refs['screen-legend'].plugins.data[0].options
          const beidous = list.filter(item => item.msgType === 'Beidou')
          const aiss = list.filter(item => item.msgType === 'AIS')
          legend[0].value = `${aiss.filter(item => item.online).length} / ${aiss.filter(item => !item.online).length}`
          legend[1].value = `${beidous.filter(item => item.online).length} / ${beidous.filter(item => !item.online).length}`
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        loading.close()
      })
    },
    refreshGridLine () { // 刷新经纬度
      const layer = this.vector.grid
      if (layer) {
        layer.clear()
      } else {
        return null
      }
      const grid = this.display.grid
      if (grid.visible) {
        const extent = this.map.getExtent()
        const xscale = (extent.xmax - extent.xmin) / (grid.density + 1)
        const yscale = (extent.ymax - extent.ymin) / (grid.density + 1)

        for (let i = 0; i < grid.density; i++) {
          const x = extent.xmin + xscale * (i + 1)
          const y = extent.ymin + yscale * (i + 1)
          const xDegrees = Math.floor(x)
          const xMinutes = Math.floor((x - xDegrees) * 60)
          const xSeconds = ((x - xDegrees - xMinutes / 60) * 3600).toFixed(3)
          const yDegrees = Math.floor(y)
          const yMinutes = Math.floor((y - yDegrees) * 60)
          const ySeconds = ((y - yDegrees - yMinutes / 60) * 3600).toFixed(3)
          const xText = `${xDegrees}°${xMinutes}′${xSeconds}″`
          const yText = `${yDegrees}°${yMinutes}′${ySeconds}″`

          const latitude = this.initGeometry({
            className: 'LineString',
            params: [
              [
                [extent.xmin - xscale, y],
                [extent.xmax + xscale, y]
              ],
              {
                symbol: {
                  lineColor: grid.borderColor,
                  lineWidth: 1,
                  lineOpacity: 1
                }
              }
            ]
          })
          const latitudeText = this.initGeometry({
            className: 'Marker',
            params: [
              [extent.xmin, y],
              {
                symbol: {
                  textName: yText,
                  textSize: grid.fontSize,
                  textFill: grid.latitudeColor,
                  textOpacity: 1,
                  textDx: 100,
                  textDy: 0
                }
              }
            ]
          })
          const longitude = this.initGeometry({
            className: 'LineString',
            params: [
              [
                [x, extent.ymin - yscale],
                [x, extent.ymax + yscale]
              ],
              {
                symbol: {
                  lineColor: grid.borderColor,
                  lineWidth: 1,
                  lineOpacity: 1
                }
              }
            ]
          })
          const longitudeText = this.initGeometry({
            className: 'Marker',
            params: [
              [x, extent.ymin],
              {
                symbol: {
                  textName: xText,
                  textSize: grid.fontSize,
                  textFill: grid.longitudeColor,
                  textOpacity: 1,
                  textDx: 0,
                  textDy: -50
                }
              }
            ]
          })

          layer.addGeometry(latitude)
          layer.addGeometry(latitudeText)
          layer.addGeometry(longitude)
          layer.addGeometry(longitudeText)
        }
      }
    },
    registerLayerToMap () { // 注册图层
      // 渔港图层
      this.vector.port = new maptalks.VectorLayer('port', $configs.layerConfig()).addTo(this.map)
      // 气象要素气泡图层
      this.vector.weather = new maptalks.VectorLayer('weather', $configs.layerConfig()).addTo(this.map)
      // 监控点位图层
      this.vector.video = new maptalks.VectorLayer('video', $configs.layerConfig()).addTo(this.map)
      this.vector.track = new maptalks.VectorLayer('track', $configs.layerConfig(5)).addTo(this.map)
      // 封闭式围栏图层 -- 因为没有数据所以特殊处理的显隐
      this.vector.closed = new maptalks.VectorLayer('closed', $configs.layerConfig(1)).addTo(this.map).hide()
      // 渔区图层
      this.vector.fishing = new maptalks.VectorLayer('fishing', $configs.layerConfig(1)).addTo(this.map)
      // 制捕区域图层
      this.vector.catch = new maptalks.VectorLayer('catch', $configs.layerConfig(1)).addTo(this.map)
      // 界定水域图层
      this.vector.waters = new maptalks.VectorLayer('waters', $configs.layerConfig(1)).addTo(this.map)
      // 雷达图层
      this.vector.radar = new maptalks.VectorLayer('radar', $configs.layerConfig(1)).addTo(this.map)
      // 手动定位图层
      this.initVectorLayer('locate', 5)
      // 渔船点位图层
      this.initVectorLayer('_trawler_dynamic', 4)
      // 重点关注渔船图层
      this.initVectorLayer('_trawler_focus', 4)
      // 高亮渔船图层
      this.initVectorLayer('_trawler_light', 4)
      // 重点关注+高亮
      this.initVectorLayer('_trawler_light_focus', 4)
      // 智能分析图层
      this.initVectorLayer('analysis', 4)
    },
    reviewControl () {
      if (!this.track.path.length) {
        this.$message.warning('暂无轨迹数据！')
        return null
      }
      // 回放环境初始化
      clearInterval(this.review.playing)
      if (!this.player) {
        this.initPlayer()
      }

      // 根据进度判断当前操作
      if (this.review.status === 'start') {
        this.player.pause()
        this.review.status = 'pause'
      } else if (this.review.status === 'finish') {
        this.player.cancel()
        this.review.status = 'cancel'
        this.review.now = 0
        this.review.current = this.review.start
        this.reviewControl()
      } else {
        this.reviewPlay()
      }
    },
    reviewJump () {
      if (this.review.status !== 'start' && this.player) {
        this.player.setTime(1000000 * this.review.now)
      }
    },
    reviewPlay () {
      this.player.play()
      this.review.status = 'start'
      // 设置计时器，及时更新回放进度
      this.review.playing = setInterval(() => {
        // 计算当前进度
        const current = this.player.getCurrentTime()
        const mapCurrent = this.track.map.filter(item => {
          return item[0] < current && item[1] > current
        })[0]
        this.review.current = mapCurrent ? mapCurrent[2] : this.review.current
        this.review.now = Math.floor(current / 1000000)

        if (this.review.max === this.review.now) { // 回放完成
          this.player.finish()
          this.review.status = 'finish'
          this.review.current = this.review.end
          setTimeout(() => { // 自动将进度归零
            if (!this.review.playing) {
              this.player.cancel()
              this.review.status = 'cancel'
              this.review.now = 0
              this.review.current = this.review.start
            }
          }, 1000)
        }
        if (this.review.status !== 'start') { // 回放结束
          clearInterval(this.review.playing)
          this.review.playing = 0
        }
      }, 10)
    },
    reviewSpeed (times) {
      const unit = 1000
      this.player.setUnitTime(unit * times)
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
    speedChange (speed) {
      this.review.value = speed
      this.review.slow = speed === 0.5
      this.review.normal = speed === 1
      this.review.fast = speed === 3
      this.reviewSpeed(speed)
    },
    startWebsocket () { // 智能分析报警推送
      if (this.websocket.waiting) {
        this.websocket.waiting.close()
        this.websocket.waiting = null
      }

      this.websocket.waiting = new WebSocket(api.getWebsocketData)
      this.websocket.waiting.onmessage = (ev) => {
        const result = JSON.parse(ev.data)
        const data = result.data
        this.websocket.type = data.alarmType
        this.websocket.shipName = data.boatName
        this.websocket.content = `【${data.alarmType}】${data.boatName}发生${data.alarmType}报警!`
      }
    },
    startWebsocketRadarTrawlerData () {
      if (this.trawler.beidouais.websocket) {
        this.trawler.beidouais.websocket.close()
        this.trawler.beidouais.websocket = null
      }

      // 更新渔船点位
      const refresh = (data) => {
        const index = this.geometries._trawler_dynamic.findIndex(item => item.uuid === data.uuid)
        if (index !== -1) {
          this.insertTrawler(data, false, false, false)
        } else {
          // 无点位时新增点位
          this.insertTrawler(data, true, false, false)
        }
      }

      this.trawler.beidouais.websocket = new WebSocket(api.websockerRadarAIS)
      this.trawler.beidouais.websocket.onmessage = (evt) => {
        const data = JSON.parse(evt.data)
        if (this.mouse.zoom > 12) {
          refresh(data.data)
        }
      }
    },
    startWebsocketTrawlerData () { // 渔船点位长连接
      if (this.trawler.radarais.websocket) {
        this.trawler.radarais.websocket.close()
        this.trawler.radarais.websocket = null
      }

      // 更新渔船点位
      const refresh = (data) => {
        const index = this.geometries._trawler_dynamic.findIndex(item => item.uuid === data.uuid)
        if (index !== -1) {
          // 无点位时新增点位
          this.insertTrawler(data, false, false, false)
        } else {
          // 无点位时新增点位
          this.insertTrawler(data, true, false, false)
        }
      }

      this.trawler.radarais.websocket = new WebSocket(api.websockerGpsRadar)
      this.trawler.radarais.websocket.onmessage = (evt) => {
        const data = JSON.parse(evt.data)
        if (this.mouse.zoom > 12) {
          refresh(data.data)
        }
      }
    },
    toggleColorCloudMap (center, distance) { // 高亮渔船伴随彩云图控制
      if (this.vector.cloud) {
        this.vector.cloud.remove()
        this.vector.cloud = null
      }
      this.vector.cloud = new maptalks.VectorLayer('cloud', $configs.layerConfig(1)).addTo(this.map)

      // const distance = 18500 // 10海里
      const colors = ['#DC143C', '#FFAA00', '#FFFF00', '#00FF00',
        '#00FFFF', '#0000FF', '#9932CC']
      const radius = [7, 6, 5, 4, 3, 2, 1]
      const proportions = radius.map(item => {
        return Math.floor((distance / item) * 100) / 100
      })
      radius.forEach((item) => {
        const circle = new maptalks.Circle(center, (proportions[item - 1]) / 2, {
          symbol: [{
            lineColor: colors[item - 1],
            lineWidth: {
              stops: [
                [7, 0.5],
                [14, 2]
              ]
            },
            polygonOpacity: 0.3,
            polygonFill: colors[item - 1]
          }]
        }).addTo(this.vector.cloud)
        new maptalks.Marker(circle.getShell()[0], {
          properties: {
            name: `${Math.floor((proportions[item - 1] / 1852) * 100) / 100}海里范围线`
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
    toggleMonitorVisible (e, status) {
      const prop = e.prop
      const monitorStatus = localStorage.getItem('monitor-state')
      const monitorState = monitorStatus ? JSON.parse(monitorStatus) : {}
      switch (prop) {
        case 'abnormal':
        case 'normal': {
          this.vector.video.forEach(marker => {
            const properties = marker.properties
            const state = properties.runStatus - 0
            if (prop === 'normal' ? state === 1 : state !== 1) {
              if (status) {
                marker.show()
              } else {
                marker.hide()
              }
            }
          })
          break
        }
        case 'coast':
        case 'fishery':
        case 'skynet': { // 渔政
          this.vector.video.forEach(marker => {
            const visible = marker.isVisible()
            const properties = marker.properties
            const state = properties.runStatus - 0
            if (properties.duration === e.label) {
              if (status) {
                if (!visible) {
                  if (monitorState.normal && state === 1) {
                    marker.show()
                  }
                  if (monitorState.abnormal && state !== 1) {
                    marker.show()
                  }
                }
              } else {
                if (visible) {
                  marker.hide()
                }
              }
            }
          })
          break
        }
        case 'other': {
          this.vector.video.forEach(marker => {
            const visible = marker.isVisible()
            const properties = marker.properties
            const state = properties.runStatus - 0
            if (!properties.duration) {
              if (status) {
                if (!visible) {
                  if (monitorState.normal && state === 1) {
                    marker.show()
                  }
                  if (monitorState.abnormal && state !== 1) {
                    marker.show()
                  }
                }
              } else {
                if (visible) {
                  marker.hide()
                }
              }
            }
          })
          break
        }
        default: {
          break
        }
      }
    },
    toggleReview (active, data) { // 获取轨迹数据
      this.track.startTime = data.beginTime
      this.track.endTime = data.endTime
      this.vector.track.clear()

      // 进度数据清缓存
      this.track.path = []
      this.review.start = null
      this.review.end = null
      this.review.min = 0
      this.review.max = 0
      this.review.now = 0

      // 查询轨迹数据
      const params = new FormData()
      params.append('shipName', data.shipName)
      params.append('beginDate', data.beginTime)
      params.append('endDate', data.endTime)
      params.append('bwlx', data.type)

      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.axios.post(api.getTrawlerTrack, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          data = res.result
          if (!data) {
            this.$message.warning('暂无轨迹数据')
            return null
          }

          // 显示播放器
          this.track.visible = true
          this.review.slow = false
          this.review.normal = true
          this.review.fast = false

          data = data.map(item => {
            // 时区校正
            const gpsDate = new Date(item.gpsTime)
            gpsDate.setHours(gpsDate.getHours() + 8)
            item.gpsTime = gpsDate.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1 $2')
            return item
          })
          // 回放进度数据解析
          this.track.map = []
          this.review.start = data[0].gpsTime
          this.review.current = data[0].gpsTime
          this.review.now = 0
          const startWhen = new Date(data[0].gpsTime).getTime()
          let lastTime = 0
          let lastTarget
          this.track.path = data.map((item, index) => {
            // 该段轨迹时长
            const updateDate = new Date(item.gpsTime).getTime()
            const duration = updateDate - startWhen
            this.review.end = item.gpsTime
            if (index) {
              this.track.map.push([
                lastTime, duration, lastTarget
              ])
            }
            lastTime = duration
            lastTarget = item.gpsTime
            return [ // 轨迹点数据: [ 经度, 纬度, 轨迹播放时长, 船只角度, 据上报时间 ]
              Number(item.longitude), Number(item.latitude),
              duration, 360 - (item.zhx ? item.zhx - 0 : 0),
              item.gpsTime
            ]
          })
          this.review.max = Math.floor(this.track.path[this.track.path.length - 1][2] / 1000000)
          this.initPlayer()
          this.addTrackToMap()
        } else {
          this.$message.error(res.msg || '轨迹查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        loading.close()
      })
    },
    updateTrawlerPosition (data) { // 船位更新
      this.vector.vector_locate.clear()
      const layer = this.vector.vector__trawler_dynamic
      const marker = layer.getGeometryById(data.uuid)
      if (marker) {
        marker.setCoordinates([data.longitude - 0, data.latitude - 0])
        this.$message.success(`${data.boatName}船位已更新！`)
        marker.updateSymbol({
          markerFill: '#F00'
        })
        this.map.animateTo({
          center: [data.longitude - 0, data.latitude - 0]
        })
      }
    },
    updateWeatherPopup (e) {
      const current = this.weather.current
      const data = []
      const temperature = this.weather.temperature
      const x = e.coordinate.x
      const y = e.coordinate.y
      const wave = this.weather.wave
      const wind = this.weather.wind

      if (current && current.isVisible()) {
        const pd = this.weather.current.pointData(x, y)
        data.push({
          content: '波向：' + (mapUtil.uv2Direction(pd.u, pd.v, 'wave'))[0],
          label: '海浪'
        })
        this.initWeatherPopup({ data, x, y })
      }
      if (temperature && temperature.isVisible()) {
        data.push({
          content: '温度：' + (this.weather.tempField.pointData(x, y) - 73.15).toFixed(2) + '℃',
          label: '气温'
        })
        this.initWeatherPopup({ data, x, y })
      }
      if (wave && wave.isVisible()) {
        data.push({
          content: '浪高：' + (this.weather.waveField.pointData(x, y) / 25).toFixed(2) + 'm',
          label: '浪高'
        })
        this.initWeatherPopup({ data, x, y })
      }
      if (wind && wind.isVisible()) {
        const pd = this.weather.wind.pointData(x, y)
        data.push({
          content: '风速：' + pd.m.toFixed(2) + 'm/s；' + '风向：' + (mapUtil.uv2Direction(pd.u, pd.v))[0] + `；风力：${$configs.getWindGrade(pd.m.toFixed(2))}级`,
          label: '风场'
        })
        this.initWeatherPopup({ data, x, y })
      }
      if (!data.length) {
        this.vector.weather.hide()
      }
    }
  }
}
</script>

<style scoped>
.screen-map {
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
}
/* BACKGROUND */
.screen-background {
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9;
}
#screen-map {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  /*z-index: 10;*/
}
/* 鼠标经纬度 */
.position {
  align-items: center;
  color: rgba(180, 203, 216, 1);
  display: flex;
  flex-direction: row;
  font-size: 14px;
  height: 26px;
  line-height: 26px;
  justify-content: center;
  position: fixed;
  transform: skew(-30deg);
  z-index: 10;
}
.mouse {
  bottom: 35px;
  left: 400px;
  transition-duration: .3s;
  width: 342px;
}
.zoom {
  bottom: 67px;
  left: 372px;
  transition-duration: .3s;
  width: 107px;
}
/* 定位 */
.zoom.analysis {
  left: 200px !important;
}
.mouse.analysis {
  left: 225px !important;
}
/* 定位 */
.zoom.expend {
  left: 20px !important;
}
.mouse.expend {
  left: 45px !important;
}
.position .item {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
  width: 50%;
}
.position .item .label {
  background-color: rgba(20, 134, 254, 0.17);
  flex-shrink: 0;
  height: 100%;
  padding-left: 10px;
  padding-right: 10px;
}
.position .item .value {
  background-color: rgba(4, 17, 36, 0.68);
  flex-grow: 1;
  height: 100%;
  padding-left: 6px;
  padding-right: 6px;
  text-align: left;
}
/* TRACK */
.footer {
  background-image: url('/img/map/icon-track-review-bg.png');
  background-size: 100% 100%;
  position: absolute;
  bottom: 114px;
  font-family: 'SHSCNR';
  left: 370px;
  right: 450px;
  z-index: 99;
}
.review-container {
  border-radius: 5px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
  height: 130px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 25px;
  position: relative;
  width: 100%;
}
.review-close {
  background-image: url('/img/map/icon-close.png');
  background-size: 100% 100%;
  position: absolute;
  top: 36px;
  right: -36px;
  width: 30px;
  height: 30px;
  text-align: center;
  cursor: pointer;
}
.review-tool-bar {
  width: 100%;
  display: flex;
  justify-items: center;
  align-items: center;
}
.bar-left {
  font-size: 14px;
  text-align: left;
  width: 35%;
}
.bar-left span {
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  padding-bottom: 3px;
  padding-left: 3px;
  padding-right: 3px;
  padding-top: 3px;
}
.bar-left span.primary {
  background-color: #409eff;
  box-sizing: border-box;
  text-align: center;
}
.bar-right {
  font-size: 14px;
  text-align: right;
  width: 30%;
}
.bar-center {
  font-size: 14px;
  text-align: center;
  width: 40%;
}
.play-control {
  cursor: pointer;
}
.play-control i {
  color: rgb(55, 183, 255);
  font-size: 26px;
}
</style>
