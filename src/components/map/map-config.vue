<template>

  <app-dialog
    :config="config"
    title="地图默认配置"
    @close="close">

    <div class="map-config">

      <el-form
        class="map-config-form"
        :model="model"
        ref="map-config-form"
        :rules="rules"
        :show-message="false"
        size="small">

        <el-form-item
          v-for="(item, i) in items"
          class="map-config-item"
          :key="i"
          :label="`${item.label}:`"
          :prop="item.prop">

          <el-input
            v-if="item.type === 'input'"
            v-model="model[item.prop]"
            type="text"
            style="width: 230px;">
          </el-input>

          <span
            v-if="item.placeholder"
            class="placeholder">注：{{ item.placeholder }}
          </span>

          <el-select
            v-if="item.type === 'select'"
            v-model="model[item.prop]"
            style="width: 230px;">

            <el-option
              v-for="(opt, index) in item.options"
              :key="index"
              :label="opt.label"
              :value="opt.value">
            </el-option>

          </el-select>

        </el-form-item>

      </el-form>

      <div class="form control map-config-control">

        <span
          class="button"
          role="primary-form"
          @click="submit()">确定
        </span>

      </div>

    </div>

  </app-dialog>

</template>

<script>
import appDialog from '@/components/common/dialog'
import * as $config from './configs'
export default {
  name: 'map-config',
  components: {
    'app-dialog': appDialog
  },
  data () {
    const list = []
    for (let i = 1; i < 18; i++) {
      list.push({
        label: i,
        value: i
      })
    }
    return {
      config: {
        height: 320,
        width: 400
      },
      items: [
        {
          label: '中心点经度',
          placeholder: '请点击地图选取或手动录入经度',
          prop: 'longitude',
          type: 'input'
        },
        {
          label: '中心点纬度',
          placeholder: '请点击地图选取或手动录入纬度',
          prop: 'latitude',
          type: 'input'
        },
        {
          label: '缩放等级',
          prop: 'zoom',
          type: 'select',
          options: list.slice()
        }
      ],
      layer: null,
      model: {
        latitude: 37.6038,
        longitude: 121.397932,
        zoom: 12
      },
      rules: {
        latitude: [
          { required: true }
        ],
        longitude: [
          { required: true }
        ],
        zoom: [
          { required: true }
        ]
      }
    }
  },
  props: {
    'map-center': {
      default () {
        return $config.center
      },
      required: false,
      type: Array
    },
    'map-zoom': {
      default: 12,
      required: false,
      type: Number
    }
  },
  watch: {
    mapCenter: 'updateData',
    mapZoom: 'updateData'
  },
  mounted () {
    // const mapConfig = localStorage.getItem('map-config')
    // const config = mapConfig ? JSON.parse(mapConfig) : null
    // this.model = {
    //   latitude: config ? config.latitude - 0 : this.mapCenter[1],
    //   longitude: config ? config.longitude - 0 : this.mapCenter[0],
    //   zoom: config ? config.zoom : this.mapZoom
    // }
    this.model = {
      latitude: this.mapCenter[1],
      longitude: this.mapCenter[0],
      zoom: this.mapZoom
    }
    this.$nextTick(() => {
      this.layer = window.$app.initVectorLayer('increase-config', 2)
      this.draw()
    })
  },
  destroyed () {
    this.layer.remove()
    const tool = window.$app.layers.tool_draw_Point
    if (tool) {
      tool.remove()
      delete window.$app.layers.tool_draw_Point
    }
  },
  methods: {
    close () {
      this.$emit('close', false)
    },
    draw () {
      const symbol = {
        markerType: 'pin',
        markerFill: 'rgb(135,196,240)',
        markerFillOpacity: 1,
        markerLineColor: '#34495e',
        markerLineWidth: 3,
        markerLineOpacity: 1,
        markerLineDasharray: [],
        markerWidth: 40,
        markerHeight: 40,
        markerDx: 0,
        markerDy: 0,
        markerOpacity: 1
      }

      window.$app.toggleDraw({
        drawend: (e) => {
          const extent = e.geometry.getCenter()

          this.model.longitude = extent.x.toFixed(6)
          this.model.latitude = extent.y.toFixed(6)

          const geo = (this.geometry = e.geometry.copy())
          this.layer.clear().addGeometry(geo)
        },
        mode: 'Point',
        once: false,
        symbol
      })
    },
    submit () {
      this.$refs['map-config-form'].validate(valid => {
        if (valid) {
          localStorage.setItem('map-config', JSON.stringify(this.model))
          this.$message.success('默认视野修改成功！')
          this.$emit('close', true, this.model)
        }
      })
    },
    updateData () {
      this.model.zoom = this.mapZoom
      this.model.longitude = this.mapCenter[0]
      this.model.latitude = this.mapCenter[1]
    }
  }
}
</script>

<style scoped>
.map-config {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.map-config-form {
  flex-grow: 1;
}
.map-config-item {
  /*align-items: center;*/
  display: flex;
  flex-direction: row;
  margin-bottom: 10px !important;
}
/* CONTROL */
.map-config-control {
  flex-shrink: 0;
}
</style>
<style>
.map-config-item label {
  flex-shrink: 0;
  text-align: right !important;
  width: 100px !important;
}
.map-config-item .el-form-item__content {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
