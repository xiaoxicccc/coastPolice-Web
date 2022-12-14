<template>

  <!-- 轨迹回放控制器 -->
  <div>

    <app-dialog
      v-if="visible"
      :config="config"
      :level="1"
      ref="review-control-dialog"
      title="回放控制"
      @close="toggleVisible(false)">

      <div class="review-control-slider">

        <el-slider
          v-model="slider.current"
          disabled
          :max="slider.max"
          :min="slider.min"
          :step="slider.step">
        </el-slider>

      </div>

      <div class="review-control-bar">

        <el-button
          v-if="status === '播放'"
          size="mini"
          @click="controlReview('play')">播放
        </el-button>

        <el-button
          v-if="status === '暂停'"
          size="mini"
          @click="controlReview('pause')">暂停
        </el-button>

        <el-button
          size="mini"
          @click="controlReview('replay')">重播
        </el-button>

        <el-button
          v-show="trawlerList.length == 1"
          size="mini"
          @click="controlReview('locate')">船舶居中
        </el-button>

        <el-button
          size="mini"
          @click="controlReview('cancel')">停止
        </el-button>

      </div>

      <div
        class="review-control-bar"
        style="text-align: left;">

        <span style="margin-left: 7px; margin-right: 8px;">播放控制
        </span>

        <el-select
          v-model="speed.current"
          size="mini"
          style="width: 150px;"
          @change="changeSpeed">

          <el-option
            v-for="(item, index) in speed.options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>

        </el-select>

        <el-button
          size="mini"
          style="float: right; width: 125px;"
          @click="toggleTime">{{ timeStamp ? '只显示结束时间' : '显示全部时间' }}
        </el-button>

      </div>

      <div class="review-control-info">

        <el-form
          label-position="left"
          label-width="70px"
          role="slim"
          size="mini">

          <el-form-item label="开始时间">

            <el-input
              class="long"
              disabled
              type="text"
              :value="time.min">
            </el-input>

          </el-form-item>

          <el-form-item label="结束时间">

            <el-input
              class="long"
              disabled
              type="text"
              :value="time.max">
            </el-input>

          </el-form-item>

        </el-form>

        <ul class="review-trawler-list">

          <li
            v-for="(item, index) in trawlerList"
            class="review-trawler-item"
            :key="index">

            <span
              class="review-trawler-legend"
              :style="{ 'background-color': colors[index] }">
            </span>

            <span>{{ item.shipName ? item.shipName : item.mmsi }}
            </span>

          </li>

        </ul>

      </div>

    </app-dialog>

  </div>

</template>

<script>
import appDialog from './dialog-right'

import * as routeplayer from 'maptalks.routeplayer'
import * as $configs from '@/components/map/configs'

export default {
  name: 'review-control',
  components: {
    'app-dialog': appDialog
  },
  data () {
    return {
      colors: $configs.getColorAtlas(),
      config: {
        height: 300,
        width: 425
      },
      check: {
        names: [],
        ids: []
      },
      data: [],
      infoStamp: false,
      layer: null,
      player: null,
      slider: {
        current: 0,
        min: 0,
        max: 100,
        step: 1
      },
      speed: {
        current: 1,
        options: [
          {
            label: '原速',
            value: 1
          },
          {
            label: '五倍速',
            value: 5
          },
          {
            label: '十倍速',
            value: 10
          },
          {
            label: '二十倍速',
            value: 20
          }
        ],
        unit: 1000
      },
      status: '播放',
      timeStamp: false,
      visible: false
    }
  },
  props: {
    time: {
      default () {
        return {}
      },
      required: false,
      type: Object
    },
    'track-list': {
      default () {
        return []
      },
      required: false,
      type: Array
    },
    'trawler-list': {
      default () {
        return []
      },
      required: false,
      type: Array
    }
  },
  mounted () {
    this.layer = window.$app.layers.vector_track
    this.layer.clear()
    this.fetchTrack()
  },
  destroyed () {
    this.layer.clear()
    if (this.player) {
      this.player.cancel()
      this.player.play()
      this.changeSpeed(5000)
      setTimeout(() => {
        this.player.remove()
        this.player = null
      }, 1500)
    }
  },
  watch: {
    trawlerList: 'fetchTrack'
  },
  methods: {
    changeSpeed (speed) {
      const unit = this.speed.unit
      this.player.setUnitTime(unit * speed)
    },
    clear () {
      this.layer.clear()
      if (this.player) {
        this.player.cancel()
        this.player.play()
        this.changeSpeed(5000)
        setTimeout(() => {
          this.player.remove()
          this.player = null
        }, 1500)
      }
    },
    controlReview (key) {
      if (!this.player) {
        return null
      }
      switch (key) {
        case 'cancel': {
          this.player.cancel()
          this.status = '播放'
          break
        }
        case 'locate': {
          if (this.trackList.length === 1) {
            const current = this.trackList[0][0]
            window.$map.setView({
              center: [current[0], current[1]],
              zoom: 11
            })
          }
          break
        }
        case 'pause': {
          this.player.pause()
          this.status = '播放'
          break
        }
        case 'play': {
          this.player.play()
          this.status = '暂停'
          break
        }
        case 'replay': {
          this.player.cancel()
          this.player.play()
          this.status = '暂停'
          break
        }
        default: {
        }
      }
    },
    fetchTrack () {
      if (this.visible) {
        this.speed.current = 1
        this.loadTrack()
      }
    },
    initPlayer (data) {
      const _symbol = $configs.getTrawlerTrackOptions().route
      const route = []
      this.slider.current = 0

      data.forEach((item, index) => {
        route.push({
          path: item,
          lineSymbol: _symbol.line,
          markerSymbol: _symbol.marker,
          zIndex: 5
        })
      })

      const _layer = new routeplayer.RoutePlayer(route, window.$map)
      this.player = _layer
      _layer.on('playing', (param) => {
        const total = param.target.endTime
        const current = param.target.played
        this.slider.current = Math.round(current / total * 100)
        this.status = '暂停'
      })
      _layer.on('playfinish', () => {
        this.slider.current = 100
        this.status = '播放'
      })
      this.layer.bringToBack()
      this.speed.unit = _layer.getUnitTime()
      this.changeSpeed(this.speed.current)
    },
    loadTrack () {
      if (this.trawlerList.length === 1) {
        this.controlReview('locate')
      }
      this.trackList.forEach((item, index) => {
        const color = this.colors[index % 10]
        this.timeStamp = false
        this.infoStamp = false
        window.$app.addTrackToMap(item, color)
      })
      this.controlReview('locate')

      this.initPlayer(this.trackList)
    },
    toggleExpand () {
      this.$refs['review-control-dialog'].zoom('narrow')
    },
    toggleInfo (value) {
      let visible = null
      // 判断是否点击过
      const index = this.check.names.findIndex(item => item === value.shipName)
      if (index !== -1) {
        this.check.names.splice(index, 1)
        this.infoStamp = true
        visible = true
      } else {
        this.check.names.push(value.shipName)
        this.infoStamp = false
        visible = false
      }
      console.log(visible)

      this.layer.forEach((track, layerIndex) => {
        const thisLayerTrack = this.trackList[layerIndex]
        const lastIndex = thisLayerTrack.length - 1
        const lastTrackPoint = thisLayerTrack[lastIndex]
        track.forEach((item, trackIndex) => {
          const properties = item.properties
          const showInfo = this.infoStamp
          if (properties) {
            if (properties.timeControl && value.shipName === lastTrackPoint[5]) {
              item.updateSymbol([
                {},
                {
                  markerOpacity: showInfo ? 1 : 0
                },
                {
                  textFill: 'white',
                  textName: showInfo ? properties.time : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `船舶名称：${lastTrackPoint[5] || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `终端号码：${lastTrackPoint[7] || lastTrackPoint[6] || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `船主姓名：${lastTrackPoint[9] || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `联系方式：${lastTrackPoint[10] || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `经度：${parseFloat(lastTrackPoint[0]).toFixed(2) || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `纬度：${parseFloat(lastTrackPoint[1]).toFixed(2) || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? (lastTrackPoint[8] ? `航速：${lastTrackPoint[8]}节` : '航速：--') : ''
                },
                {}
              ])
            }
          }
        })
      })
      // this.infoStamp = false
    },
    toggleTime () {
      this.trawlerList.forEach((item, index) => {
        this.toggleInfo(item, index)
      })
      const visible = !this.timeStamp
      this.layer.forEach((track, layerIndex) => {
        const thisLayerTrack = this.trackList[layerIndex]
        const lastIndex = thisLayerTrack.length - 1
        const lastTrackPoint = thisLayerTrack[lastIndex]
        track.forEach((item, trackIndex) => {
          const properties = item.properties
          const showInfo = this.timeStamp
          if (properties) {
            if (properties.timeControl) {
              item.updateSymbol([
                {},
                {
                  markerOpacity: showInfo ? 1 : 0
                },
                {},
                {
                  textFill: 'white',
                  textName: showInfo ? `船舶名称：${lastTrackPoint[5] || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `终端号码：${lastTrackPoint[7] || lastTrackPoint[6] || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `船主姓名：${lastTrackPoint[9] || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `联系方式：${lastTrackPoint[10] || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `经度：${parseFloat(lastTrackPoint[0]).toFixed(2) || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? `纬度：${parseFloat(lastTrackPoint[1]).toFixed(2) || '--'}` : ''
                },
                {
                  textFill: 'white',
                  textName: showInfo ? (lastTrackPoint[8] ? `航速：${lastTrackPoint[8]}节` : '航速：--') : ''
                },
                {}
              ])
            } else {
              item.updateSymbol([
                {},
                {},
                {
                  textFill: 'black',
                  textName: visible || properties.timeControl ? properties.time : ''
                }
              ])
            }
          }
        })
      })
      this.timeStamp = visible
    },
    toggleVisible (visible) {
      this.visible = !!visible

      this.clear()
      // if (this.player) {
      //   this.player.remove()
      // }

      if (visible) {
        this.loadTrack()
      } else {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped>
.review-control-slider {
  padding-left: 10px;
  padding-right: 10px;
}

.review-control-bar {
  margin-bottom: 9px;
}

.review-control-info {
  border-color: rgba(127, 127, 127, 0.1);
  border-style: solid;
  border-width: 1px;
  padding-left: 5px;
  padding-top: 5px;
  position: relative;
  text-align: left;
}
.review-control-info .long {
  width: 150px;
}
.review-trawler-list {
  border-color: lightgray;
  border-style: solid;
  border-width: 1px;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 125px;
}
.review-trawler-item {
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  list-style: none;
  padding-left: 5px;
}
.review-trawler-item.hide {
  opacity: 0.5;
}
.review-trawler-legend {
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  margin-right: 5px;
  width: 8px
}
</style>
