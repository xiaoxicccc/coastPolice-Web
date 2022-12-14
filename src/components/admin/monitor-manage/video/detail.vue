<template>

  <app-dialog
    :config="config"
    :title="title"
    @close="close(false)">

    <div class="video-detail">

      <el-form
        class="video-detail-form"
        :model="model"
        ref="video-detail-form"
        :rules="rules">

        <el-form-item
          v-for="(item, i) in items"
          class="video-detail-item"
          :key="i"
          :label="`${item.label}:`"
          :prop="item.prop"
          :style="`width: ${item.width};`">

          <el-input
            v-if="item.type === 'input'"
            v-model="model[item.prop]"
            :placeholder="`请输入${item.label}`"
            :readonly="status === 'check'"
            size="small"
            type="text"
            style="width: 290px;">
          </el-input>

          <template
            v-if="item.type === 'pickup'">

            <el-input-number
              v-model="model[item.prop]"
              :max="item.max"
              :min="item.min"
              :placeholder="item.placeholder"
              :disabled="status === 'check'"
              size="small"
              type="text"
              style="width: 290px;">
            </el-input-number>

            <span
              class="placeholder">注：{{ item.placeholder }}
            </span>

          </template>

          <el-input
            v-if="item.type === 'textarea'"
            v-model="model[item.prop]"
            :placeholder="`请输入${item.label}`"
            :disabled="status === 'check'"
            resize="none"
            :rows="item.rows"
            type="textarea"
            style="width: 700px;">
          </el-input>

          <el-autocomplete
            v-if="item.type === 'autocomplete'"
            v-model="model[item.prop]"
            :debounce="100"
            :fetch-suggestions="querySearchAsync"
            value-key="label"
            placeholder="请输入内容"
            :readonly="status === 'check'"
            size="small"
            style="width: 290px;">
          </el-autocomplete>

          <el-autocomplete
            v-if="item.type === 'filterable'"
            v-model="model[item.prop]"
            :fetch-suggestions="querySearchAsyncDepart"
            value-key="label"
            placeholder="请输入内容"
            :readonly="status === 'check'"
            size="small"
            style="width: 290px;">
          </el-autocomplete>

          <el-select
            v-if="item.type === 'select'"
            v-model="model[item.prop]"
            :placeholder="`请选择${item.label}`"
            size="small"
            style="width: 290px;">

            <el-option
              v-for="(opt, index) in item.options"
              :disabled="status === 'check'"
              :key="index"
              :label="opt.label"
              :value="opt.value">
            </el-option>

          </el-select>

        </el-form-item>

      </el-form>

      <div class="form control video-detail-control">

        <span
          class="button"
          role="info-form"
          @click="close(false)">取消
        </span>

        <span
          v-if="status !== 'check'"
          class="button"
          role="primary-form"
          @click="validate()">提交
        </span>

        <span
          v-if="status !== 'check'"
          class="button"
          role="primary-form"
          @click="draw()">{{ drawSwitch ? '关闭坐标选取' : '坐标选取' }}
        </span>

      </div>

    </div>

  </app-dialog>

</template>

<script>
import api from '@/util/api'
import {
  video
} from '../configs'
import appDialog from '@/components/common/dialog'
export default {
  name: 'video-detail',
  components: {
    'app-dialog': appDialog
  },
  data () {
    return {
      config: {
        height: 625,
        width: 900
      },
      drawSwitch: false,
      items: video.items.slice(),
      layer: null,
      model: Object.assign({}, video.model),
      port: {
        data: []
      },
      rules: Object.assign({}, video.rules),
      title: '视频监控详情'
    }
  },
  props: {
    data: {
      default () {
        return {
        }
      },
      required: false,
      type: Object
    },
    id: {
      default: 0,
      required: false,
      type: Number
    },
    'port-data': {
      default () {
        return [
        ]
      },
      required: false,
      type: Array
    },
    status: {
      default: 'insert',
      required: false,
      type: String
    }
  },
  watch: {
    id: 'initData'
  },
  mounted () {
    this.initData()
    this.layer = window.$app.initVectorLayer('increase', 2)
    // this.draw()
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
    close (visible) {
      this.$emit('close', visible)
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
      }
    },
    draw () {
      this.drawSwitch = !this.drawSwitch
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
    initData () {
      const index = this.items.findIndex(item => item.prop === 'layoutArea')
      this.items[index].options = this.port.data = this.portData.slice()
      this.model = Object.assign({}, video.model)
      if (this.id) {
        Object.keys(this.model).forEach(key => {
          this.model[key] = this.data[key]
        })
      }
      this.title = this.status === 'check' ? '视频监控详情' : this.status === 'update' ? '视频监控修改' : '视频监控新增'
      this.$nextTick(() => {
        this.$refs['video-detail-form'].clearValidate()
      })
    },
    querySearchAsync (queryString, cb) {
      const restaurants = this.port.data
      const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      cb(results)
    },
    querySearchAsyncDepart (value, cb) {
      const params = new FormData()
      params.append('orgName', value || '')
      let list = []
      this.axios.post(api.getDepartList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          list = res.result.map(item => {
            return {
              label: item.label,
              value: item.label
            }
          })
          cb(list)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    submit () {
      const params = new FormData()
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })
      if (this.id) {
        params.append('id', this.id)
      }
      if (!this.model.latitude || !this.model.longitude) {
        this.$message.warning('请填写正确的经纬度信息！')
        return null
      }

      this.axios.post(api.saveVideoDetail, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$emit('close', true, this.status)
          this.$message.success('操作成功！')
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    validate () {
      this.$refs['video-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.video-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.video-detail-form {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-wrap: wrap;
  overflow-y: auto;
}
.video-detail-item {
  /*align-items: center;*/
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  /*width: 50%;*/
}
/* CONTROL */
.video-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.video-detail-item label {
  flex-shrink: 0;
  text-align: right;
  width: 130px !important;
}
.video-detail-item .el-form-item__content {
  display: flex;
  flex-direction: column;
}
</style>
