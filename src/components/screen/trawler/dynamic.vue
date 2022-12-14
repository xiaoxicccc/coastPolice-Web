<template>

  <!-- 渔船动态信息 -->
  <div :class="['trawler-dynamic', visibility]">

    <app-title
      title="渔船动态信息">
    </app-title>

    <ul class="trawler-dynamic-list">

      <li
        v-for="(item, i) in items"
        class="trawler-dynamic-item"
        :key="i">

        <span class="label">{{ item.label }}:
        </span>

        <span
          v-if="item.prop === 'gpsdwsj' && data['gpsdwsjs'].length > 1"
          class="value">

          <span>{{ data['gpsdwsjs'][0] }}
          </span>

          <span>{{ data['gpsdwsjs'][1] }}
          </span>

        </span>

        <span
          v-else
          class="value">{{ data[item.prop] }}
        </span>

      </li>

    </ul>

    <app-title
      sub-title="船迹向">
    </app-title>

    <ul class="trawler-tracks-list">

      <li
        v-for="(item, i) in tracks"
        class="trawler-tracks-item"
        :key="i">

        <img
          alt="ICON_LABEL"
          class="icon-label"
          :src="`/img/screen/trawler/icon-trawler-${item.icon}.png`">

        <img
          alt="ICON_BACKGROUND"
          class="icon-background"
          :src="`/img/screen/trawler/icon-trawler-${item.icon}-background.png`">

        <span class="label">{{ item.label }}
        </span>

        <div
          class="result"
          :style="`color: ${item.color};`">

          <span class="value">{{ item.value }}
          </span>

          <span class="unit">{{ item.unit }}
          </span>

        </div>

      </li>

    </ul>

    <app-title
      sub-title="渔船轨迹回放">
    </app-title>

    <el-form
      class="search-form"
      :model="playback.model">

      <el-form-item
        v-for="(item , i) in playback.items"
        class="search-item"
        :key="i"
        :label="item.label">

        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="playback.model[item.prop]"
          size="small"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 208px;">
        </el-date-picker>

        <el-select
          v-if="item.type === 'select'"
          v-model="playback.model[item.prop]"
          size="small"
          style="width: 208px;">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

      </el-form-item>

    </el-form>

    <div
      class="search-control"
      style="margin-bottom: 0;">

      <span
        class="search-control-item"
        style="margin-right: 10px; width: 120px;"
        @click="toggleReview(true)">开始回放
      </span>

      <span
        class="search-control-item"
        style="margin-right: 0; width: 120px;"
        @click="exportTrack">导出轨迹
      </span>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import appTitle from '@/components/screen/title'
export default {
  name: 'trawler-dynamic',
  components: {
    'app-title': appTitle
  },
  data () {
    return {
      data: {
        gpsdwsj: null,
        gpsdwsjs: [],
        latitude: null,
        longitude: null,
        mmsi: null,
        msgType: null,
        type: null
      },
      items: [
        {
          label: '终端类型',
          prop: 'msgType'
        },
        {
          label: '终端号码',
          prop: 'mmsi'
        },
        {
          label: '经度',
          prop: 'longitude'
        },
        {
          label: '纬度',
          prop: 'latitude'
        },
        // {
        //   label: '船东',
        //   prop: 'owner'
        // },
        {
          label: '最新报位时间',
          prop: 'gpsdwsj'
        }
      ],
      playback: {
        items: [
          {
            label: '开始时间',
            prop: 'startTime',
            type: 'datetime'
          },
          {
            label: '结束时间',
            prop: 'endTime',
            type: 'datetime'
          },
          {
            label: '终端类型',
            prop: 'type',
            type: 'select',
            options: [
              {
                label: '北斗',
                value: 'Beidou'
              },
              {
                label: 'AIS',
                value: 'AIS'
              },
              {
                label: '雷达',
                value: 'Radar'
              }
            ]
          }
        ],
        model: {
          endTime: '2022-03-18 00:00:00',
          startTime: '2022-03-17 00:00:00',
          type: 'Beidou'
        }
      },
      tracks: [
        {
          color: 'rgba(55, 183, 255, 1)',
          icon: 'speed',
          label: '航速',
          unit: '节',
          value: '0'
        },
        {
          color: 'rgba(4, 207, 201, 1)',
          icon: 'direction',
          label: '航首向',
          unit: '°',
          value: '0'
        }
      ],
      visibility: ''
    }
  },
  watch: {
    $route: 'initData'
  },
  mounted () {
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.playback.model.endTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    today.setDate(today.getDate() - 1)
    this.playback.model.startTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')

    this.toggleVisible(true)
    this.initData()
  },
  destroyed () {
    window.$screen.closeTrack()
    this.toggleVisible(false)
    // 移除彩云图图层
    if (window.$screen.vector.cloud) {
      window.$screen.vector.cloud.remove()
    }
  },
  methods: {
    exportTrack () {
      const url = [
        api.exportTrawlerTrack,
        '?shipName=',
        this.data.shipName || '',
        '&type=',
        this.playback.model.type || '',
        '&beginDate=',
        this.playback.model.startTime || '',
        '&endDate=',
        this.playback.model.endTime
      ]
      // 加载loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const token = localStorage.getItem('token')
      fetch(url.join(''), {
        headers: new Headers({
          Auth: token
        }),
        responseType: 'blob'
      })
        .then(res => {
          return res.blob()
        })
        .then(res => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const href = URL.createObjectURL(blob)
          const alink = document.createElement('a')
          alink.href = href
          alink.download = `${this.data.shipName}渔船轨迹数据.xlsx`
          alink.target = '_blank'
          alink.click()
          alink.remove()
        }).finally(() => {
          loading.close()
        })
    },
    formatOptions (type) {
      const index = this.playback.items.findIndex(_item => _item.prop === 'type')
      const typeMap = {
        AIS: 'AIS',
        Beidou: '北斗',
        Radar: '雷达'
      }
      this.playback.items[index].options = []
      type.forEach(item => {
        this.playback.items[index].options.push({
          label: typeMap[item],
          value: item
        })
      })
    },
    initData () {
      const name = this.$route.query.name
      const params = new FormData()
      params.append('key', name)

      this.axios.post(api.getTrawlerDynamicByKey, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (res.result && res.result.length) {
            const gpsdwsj = []
            const latitude = []
            const longitude = []
            const mmsi = []
            const type = []
            res.result.forEach(item => {
              gpsdwsj.push(item.gpsTime)
              latitude.push(item.latitude)
              longitude.push(item.longitude)
              mmsi.push(item.mmsi)
              type.push(item.msgType)
            })
            this.data = {
              gpsdwsj: gpsdwsj.join('/'),
              gpsdwsjs: gpsdwsj,
              latitude: latitude.join('/'),
              longitude: longitude.join('/'),
              mmsi: mmsi.join('/'),
              msgType: type.join('/'),
              shipName: name,
              type: type[0]
            }
            // const info = {
            //   gpsdwsj: gpsdwsj[0],
            //   gpsdwsjs: gpsdwsj[0],
            //   latitude: latitude[0],
            //   longitude: longitude[0],
            //   mmsi: mmsi[0],
            //   msgType: type[0],
            //   shipName: name,
            //   type: type[0]
            // }
            this.$EventBus.$emit('update-trawler-locate', [longitude[0], latitude[0]])
            this.tracks[0].value = Math.floor((res.result[0].sog || 0) * 100) / 100
            this.tracks[1].value = res.result[0].cog || 0
            this.playback.model.type = this.data.type
            this.formatOptions(type)
            // 暂时注释
            // window.$screen.locate(null, null, info)
          } else {
            const uuid = this.$route.query.id
            const type = this.$route.query.type
            const layer = type === 'focus' ? window.$screen.vector.vector__trawler_focus : window.$screen.vector.vector__trawler_dynamic
            layer.forEach(item => {
              if (item.getId() === uuid) {
                const properties = item.getProperties()
                this.data = properties
                this.data.msgType = properties.type
                this.playback.model.type = properties.type
                this.tracks[0].value = Math.floor((properties.speed || 0) * 100) / 100
                this.tracks[1].value = properties.angle || 0
                this.formatOptions([properties.type])
                this.$EventBus.$emit('update-trawler-locate', [this.data.longitude, this.data.latitude])
              }
            })
          }
          // if (res.result) {
          //   this.data = {
          //     gpsdwsj: res.result.gpsTime,
          //     gpsdwsjs: res.result.gpsTime,
          //     latitude: res.result.latitude,
          //     longitude: res.result.longitude,
          //     mmsi: res.result.mmsi,
          //     msgType: res.result.msgType,
          //     shipName: res.result.boatName,
          //     type: res.result.msgType
          //   }
          //   this.tracks[0].value = Math.floor((res.result.sog || 0) * 100) / 100
          //   this.tracks[1].value = res.result.cog || 0
          //   this.playback.model.type = this.data.type
          //   this.formatOptions([res.result.msgType])
          // }
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    toggleReview (active) {
      if (!this.data.shipName) {
        return null
      }
      const form = {
        beginTime: this.playback.model.startTime,
        endTime: this.playback.model.endTime,
        shipName: this.data.shipName || '',
        type: this.data.type || 'Beidou'
      }
      window.$screen.toggleReview(active, form)
    },
    toggleVisible (visibility) {
      this.visibility = visibility ? 'visible' : ''
    }
  }
}
</script>

<style scoped>
.trawler-dynamic {
  background: linear-gradient(180deg, rgba(25, 48, 128, 0.16) 1%, rgba(25, 48, 128, 0.8) 48%, rgba(25, 48, 128, 0) 100%);
  box-sizing: border-box;
  opacity: 0;
  padding-top: 19px;
  right: -350px;
  transition-duration: .3s;
  visibility: hidden;
  width: 320px;
}
.trawler-dynamic.visible {
  opacity: 1;
  right: 30px;
  visibility: visible;
}
/* LIST */
.trawler-dynamic-list {
  box-sizing: border-box;
  margin-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
}
.trawler-dynamic-item {
  /*align-items: center;*/
  display: flex;
  flex-direction: row;
  font-family: 'PuHuiTi-Regular';
  font-size: 15px;
  margin-top: 20px;
}
.trawler-dynamic-item .label {
  color: rgba(171, 177, 200, 1);
  flex-shrink: 0;
  margin-right: 5px;
}
.trawler-dynamic-item .value {
  color: rgba(255, 255, 255, 1);
}
/* TRACKS */
.trawler-tracks-list {
  box-sizing: border-box;
  margin-bottom: 50px;
  padding-left: 27px;
  padding-right: 47px;
  width: 100%;
}
.trawler-tracks-item {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 60px;
  justify-content: space-between;
  margin-top: 20px;
  padding-left: 78px;
  padding-right: 24px;
  position: relative;
  width: 252px;
}
.trawler-tracks-item .icon-label {
  height: 60px;
  left: 0;
  position: absolute;
  top: 0;
  width: 60px;
}
.trawler-tracks-item .icon-background {
  height: 60px;
  position: absolute;
  right: 0;
  top: 0;
  width: 222px;
}
.trawler-tracks-item .label {
  color: rgba(255, 255, 255, 1);
  flex-shrink: 0;
  font-family: 'PuHuiTi-Regular';
  font-size: 15px;
}
.trawler-tracks-item .result {
  align-items: center;
  display: flex;
  flex-direction: row;
  font-family: 'DINB';
}
.trawler-tracks-item .value {
  font-size: 24px;
}
.trawler-tracks-item .unit {
  font-size: 16px;
}
/* FORM */
.search-form {
  box-sizing: border-box;
  margin-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
}
.search-item {
  margin-bottom: 14px;
}
/* CONTROL */
.search-control {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: center;
  margin-bottom: 20px;
}
.search-control-item {
  background-image: linear-gradient(180deg, #29CCFF 0%, #2989FF 61%);
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: 'DINM';
  font-size: 15px;
  height: 36px;
  line-height: 36px;
  width: 88px;
}
.search-control-item:hover {
  background-image: linear-gradient(180deg, #2989FF 0%, #29CCFF 61%);
}
.search-control-item:first-child {
  margin-right: 20px;
}
</style>
<style>
.search-item label {
  color: rgba(171, 177, 200, 1);
  flex-shrink: 0;
  font-size: 15px;
}
</style>
