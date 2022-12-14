<template>

  <!-- 渔船基本信息 -->
  <div :class="['trawler-info', visibility]">

    <app-title
      title="渔船基本信息">
    </app-title>

    <ul class="trawler-info-list">

      <li
        v-for="(item, i) in items"
        class="trawler-info-item"
        :key="i">

        <span class="label">{{ item.label }}:
        </span>

        <span class="value">{{ data[item.prop] }}
        </span>

      </li>

    </ul>

    <!--<ul class="trawler-examination-list">

      <li
        v-for="(item, i) in examinations"
        class="trawler-examination-item"
        :key="i">

        <div class="value">{{ item.value }}
        </div>

        <span class="label">{{ item.label }}
        </span>

      </li>

    </ul>-->

    <app-title
      sub-title="渔船图片">
    </app-title>

    <div
      class="trawler-image">

      <el-image
        class="detail-image"
        :src="`${data.pic}`"
        :preview-src-list="[`${data.pic}`]">
      </el-image>

    </div>

    <app-title
      sub-title="周边船只">
    </app-title>

    <div class="search-around-trawler">

      <span class="label">检索距离(海里)
      </span>

      <el-input
        v-model="model.distance"
        size="small"
        type="text">
      </el-input>

      <span
        class="control"
        @click="searchAroundTrawler()">检索
      </span>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import appTitle from '@/components/screen/title'
export default {
  name: 'trawler-info',
  components: {
    'app-title': appTitle
  },
  data () {
    return {
      data: {},
      examinations: [
        {
          label: '船检记录',
          value: '0'
        },
        {
          label: '违法情况',
          value: '0'
        }
      ],
      items: [
        {
          label: '船名号',
          prop: 'shipName'
        },
        {
          label: '船舶类型',
          prop: 'shipType'
        },
        {
          label: '船籍港',
          prop: 'homePort'
        },
        {
          label: '船主姓名',
          prop: 'owner'
        },
        {
          label: '联系方式',
          prop: 'phone'
        },
        {
          label: '海岸管理单位',
          prop: 'departName'
        }
      ],
      marker: null,
      model: {
        distance: null
      },
      position: [],
      visibility: ''
    }
  },
  watch: {
    $route: 'initData'
  },
  mounted () {
    this.toggleVisible(true)
    this.initData()
    this.$EventBus.$on('update-trawler-locate', (e) => {
      this.position = e
    })
  },
  destroyed () {
    this.toggleVisible(false)
    const layer = window.$screen.vector.vector_locate
    if (layer) {
      layer.clear()
    }
    const cloud = window.$screen.vector.cloud
    if (cloud) {
      cloud.remove()
    }
  },
  methods: {
    initData () {
      const cloud = window.$screen.vector.cloud
      if (cloud) {
        cloud.remove()
      }
      const uuid = this.$route.query.id
      const type = this.$route.query.type
      const name = this.$route.query.name
      let layer = null
      switch (type) { // 根据类型从不同的图层中查询渔船的静态信息
        case 'focus':
          layer = window.$screen.vector.vector__trawler_focus
          this.marker = layer.getGeometryById(uuid)
          break
        case 'light':
          layer = window.$screen.vector.vector__trawler_light
          this.marker = layer.getGeometryById(uuid)
          break
        case 'light_focus':
          layer = window.$screen.vector.vector__trawler_light_focus
          this.marker = layer.getGeometryById(uuid)
          break
        case 'locate':
          layer = window.$screen.vector.vector_locate
          this.marker = layer.getLastGeometry()
          break
        default:
          layer = window.$screen.vector.vector__trawler_dynamic
          this.marker = layer.getGeometryById(uuid)
          break
      }
      let data = {}
      if (this.marker) {
        data = this.marker.getProperties()
        // this.data = marker.getProperties()
      } else {
      }
      // 走接口请求数据
      const params = new FormData()
      params.append('boatName', name)

      this.axios.post(api.getTrawlerDetailByName, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = {
            departName: res.result.departName,
            homePort: res.result.homePortName,
            owner: res.result.ownerName,
            phone: res.result.ownerPhone,
            pic: res.result.picture,
            shipName: res.result.name,
            shipType: data.shipType || res.result.typeName || '--'
          }
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    searchAroundTrawler () {
      if (!this.model.distance) {
        const cloud = window.$screen.vector.cloud
        if (cloud) {
          cloud.remove()
        }
        return null
      }
      const center = this.marker ? this.marker.getCoordinates() : this.position.length ? { x: this.position[0], y: this.position[1] } : { x: 0, y: 0 }
      window.$screen.toggleColorCloudMap(center, (this.model.distance - 0) * 1852)
    },
    toggleVisible (visibility) {
      this.visibility = visibility ? 'visible' : ''
    }
  }
}
</script>

<style scoped>
.trawler-info {
  background: linear-gradient(180deg, rgba(25, 48, 128, 0.16) 1%, rgba(25, 48, 128, 0.8) 48%, rgba(25, 48, 128, 0) 100%);
  box-sizing: border-box;
  left: -350px;
  opacity: 0;
  padding-top: 19px;
  transition-duration: .3s;
  visibility: hidden;
  width: 320px;
}
.trawler-info.visible {
  left: 30px;
  opacity: 1;
  visibility: visible;
}
/* LIST */
.trawler-info-list {
  box-sizing: border-box;
  margin-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
}
.trawler-info-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  font-family: 'PuHuiTi-Regular';
  font-size: 15px;
  margin-top: 20px;
}
.trawler-info-item .label {
  color: rgba(171, 177, 200, 1);
  margin-right: 5px;
}
.trawler-info-item .value {
  color: rgba(255, 255, 255, 1);
}
/* JIANCHAXINXI */
.trawler-examination-list {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 30px;
  margin-top: 50px;
}
.trawler-examination-item {
  align-items: center;
  display: flex;
  flex-direction: column;
}
.trawler-examination-item:first-child {
  margin-right: 65px;
}
.trawler-examination-item .value {
  background-image: url('/img/screen/trawler/icon-trawler-info-background.png');
  background-size: 100%;
  color: rgba(254, 194, 48, 1);
  font-family: 'DINB';
  font-size: 28px;
  height: 90px;
  line-height: 90px;
  text-align: center;
  width: 90px;
}
.trawler-examination-item .label {
  color: rgba(255, 255, 255, 1);
  font-family: 'PuHuiTi-Regular';
  font-size: 15px;
  margin-top: 7px;
}
/* IMAGE */
.trawler-image {
  background: linear-gradient(#FFD967, #FFD967) left top,
  linear-gradient(#FFD967, #FFD967) left top,
  linear-gradient(#FFD967, #FFD967) right top,
  linear-gradient(#FFD967, #FFD967) right top,
  linear-gradient(#FFD967, #FFD967) left bottom,
  linear-gradient(#FFD967, #FFD967) left bottom,
  linear-gradient(#FFD967, #FFD967) right bottom,
  linear-gradient(#FFD967, #FFD967) right bottom;
  background-repeat: no-repeat;
  background-size: 3px 3px, 3px 3px;
  border: 1px solid rgba(1, 255, 255, .2);
  height: 166px;
  margin-bottom: 10px;
  margin-left: 24px;
  margin-top: 8px;
  padding: 5px;
  width: 272px;
}
.trawler-image .detail-image {
  height: 100%;
  width: 100%;
}
/* SEARCH */
.search-around-trawler {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.search-around-trawler .label {
  color: #FFFFFF;
  flex-shrink: 0;
  font-size: 14px;
  margin-right: 8px;
}
.search-around-trawler .control {
  flex-shrink: 0;
  background-image: linear-gradient(180deg, #29CCFF 0%, #2989FF 61%);
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: 'DINM';
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  margin-left: 8px;
  width: 50px;
}
.search-around-trawler .control:hover {
  background-image: linear-gradient(180deg, #2989FF 0%, #29CCFF 61%);
}
</style>
