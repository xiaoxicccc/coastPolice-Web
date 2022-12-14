<template>

  <div>

    <app-dialog-right
      :config="config"
      :title="type"
      @close="close">

      <div class="insert-marker">

        <!-- 样式信息 -->
        <el-form
          class="insert-marker-style-form"
          inline
          label-position="left"
          :model="style"
          ref="insert-marker-style-form"
          :rules="rules"
          :show-message="false"
          size="mini">

          <el-form-item
            class="insert-marker-style-item"
            label="标注名称："
            prop="markName">

            <el-input
              v-model="style.markName"
              type="text"
              style="width: 160px;"
              @change="updateSymbol">
            </el-input>

          </el-form-item>

          <el-form-item
            class="insert-marker-style-item"
            label="显示名称："
            prop="nameDisplayState">

            <el-switch
              v-model="style.nameDisplayState"
              @change="updateSymbol">
            </el-switch>

          </el-form-item>

          <el-form-item
            class="insert-marker-style-item"
            label="填充色："
            prop="field1">

            <el-switch
              v-model="style.field1"
              @change="updateSymbol">
            </el-switch>

          </el-form-item>

          <el-form-item
            class="insert-marker-style-item"
            label=""
            prop="fillColor">

            <el-color-picker
              v-model="style.fillColor"
              @change="updateSymbol">
            </el-color-picker>

          </el-form-item>

          <el-form-item
            class="insert-marker-style-item"
            label="透明度："
            prop="diaphaneity">

            <el-slider
              v-model="style.diaphaneity"
              class="medium"
              :min="0"
              :max="1"
              show-stops
              show-tooltip
              :step="0.1"
              @change="updateSymbol">
            </el-slider>

          </el-form-item>

          <el-form-item
            class="insert-marker-style-item"
            label="线条颜色："
            prop="lineColor">

            <el-color-picker
              v-model="style.lineColor"
              @change="updateSymbol">
            </el-color-picker>

          </el-form-item>

          <el-form-item
            class="insert-marker-style-item"
            label="边框线宽："
            prop="lineWidth">

            <el-slider
              v-model="style.lineWidth"
              class="medium"
              :min="0"
              :max="5"
              show-stops
              show-tooltip
              :step="0.5"
              @change="updateSymbol">
            </el-slider>

          </el-form-item>

          <el-form-item
            class="insert-marker-style-item"
            label="单位名称："
            prop="departName">

            <el-autocomplete
              v-model="style.departName"
              :fetch-suggestions="querySearchAsyncDepart"
              value-key="label"
              placeholder="请输入内容"
              size="small"
              style="width: 300px;">
            </el-autocomplete>

          </el-form-item>

          <el-form-item
            class="insert-marker-style-item"
            label="备注信息："
            prop="remark">

            <el-input
              v-model="style.remark"
              :rows="2"
              type="textarea"
              style="width: 300px;"
              @change="updateSymbol">
            </el-input>

          </el-form-item>

        </el-form>

        <!-- 坐标点信息 -->
        <el-form
          class="insert-marker-params-form"
          :model="params"
          ref="insert-marker-params-form"
          :rules="rules"
          :show-message="false"
          size="mini">

          <template
            v-for="(item, i) in items">

            <el-form-item
              v-if="item.prop && item.show"
              class="insert-marker-params-item"
              :key="i"
              :label="`${item.label}:`"
              :prop="item.prop">

              <el-input
                v-model="params[item.prop]"
                class="medium"
                readonly
                :rows="item.rows"
                :type="item.type">
              </el-input>

              <span v-if="item.suffix">{{ item.suffix }}
              </span>

            </el-form-item>

            <template v-else-if="item.prop && !item.show">

              <el-form-item
                v-if="!params[item.prop]"
                class="insert-marker-choose"
                :key="i"
                :label="`${item.label}:`"
                :prop="item.prop">

                <span class="app-insert-marker-icon app-insert-marker-red">!</span>

                <span>{{ item.label }}为必选项</span>

              </el-form-item>

              <el-form-item
                v-else
                class="insert-marker-choose"
                :key="i"
                :label="`${item.label}:`"
                :prop="item.prop">

                <i class="app-insert-marker-icon el-icon-check"></i>

                <span>{{ item.label }}已选择</span>

              </el-form-item>

            </template>

          </template>

          <el-form-item class="insert-marker-params-control">

            <el-button
              type="primary"
              @click="handleEvent()">坐标选取
            </el-button>

          </el-form-item>

        </el-form>

        <!-- CONTROL -->
        <div class="insert-marker-control">

          <el-button
            size="mini"
            type="primary"
            @click="validate">保存
          </el-button>

        </div>

      </div>

    </app-dialog-right>

  </div>

</template>

<script>
import api from '@/util/api'
import appDialogRight from '@/components/common/dialog-right'
export default {
  name: 'insert-marker',
  components: {
    'app-dialog-right': appDialogRight
  },
  data () {
    return {
      areaType: {
        Circle: '圆形',
        Ellipse: '椭圆',
        LineString: '折线',
        Rectangle: '矩形',
        Point: '实点/符号',
        Polygon: '多边形'
      },
      coordinates: null,
      geometry: null,
      layer: null, // 绘制图层
      params: {
        center: null,
        height: null,
        leftTop: null,
        position: null,
        radius: null,
        rightBottom: null,
        width: null
      },
      style: {
        departName: null, // 单位名称
        diaphaneity: 0.5, // 透明度
        field1: true, // 是否显示填充色
        fillColor: '#ff0000', // 填充色
        lineColor: '#ff0000', // 线条颜色
        lineWidth: 0.5, // 边框线宽
        markName: null, // 标注名称
        nameDisplayState: true, // 名称显示状态
        remark: null // 备注
      },
      rules: {
        center: [
          { required: true }
        ],
        height: [
          { required: true }
        ],
        leftTop: [
          { required: true }
        ],
        markName: [
          { required: true }
        ],
        radius: [
          { required: true }
        ],
        rightBottom: [
          { required: true }
        ],
        width: [
          { required: true }
        ]
      }
    }
  },
  props: {
    config: {
      default () {
        return {
          height: 490,
          width: 470
        }
      },
      required: false,
      type: Object
    },
    event: {
      default: '',
      required: false,
      type: String
    },
    items: {
      default () {
        return [
          {
            label: '左上点',
            prop: 'leftTop',
            show: true
          },
          {
            label: '右下点',
            prop: 'rightBottom',
            show: true
          }
        ]
      },
      required: false,
      type: Array
    },
    mode: {
      default () {
        return 'Rectangle'
      },
      type: String
    },
    type: {
      default: '重点区域',
      required: false,
      type: String
    }
  },
  mounted () {
    this.layer = window.$app.initVectorLayer('insert', 3)
  },
  destroyed () {
    this.layer.remove()
    // 销毁绘制工具
    const tool = window.$app.layers[`tool_draw_${this.mode}`]
    if (tool) {
      tool.remove()
    }
  },
  methods: {
    close (visible) {
      this.$emit('close', visible)
    },
    fomartPosition (data) {
      const result = []
      const list = {}
      data.forEach((item) => {
        const jdDeg = parseInt(item.x)
        const jdMin = Math.floor((item.x - jdDeg) * 60)
        const jdSec = (((item.x - jdDeg) * 60 - jdMin) * 60).toFixed(2)
        list.jd = `${jdDeg}°${jdMin}′${jdSec}″`
        const wdDeg = parseInt(item.y)
        const wdMin = Math.floor((item.y - wdDeg) * 60)
        const wdSec = (((item.y - wdDeg) * 60 - wdMin) * 60).toFixed(2)
        list.wd = `${wdDeg}°${wdMin}′${wdSec}″`
        result.push({
          x: list.jd,
          y: list.wd
        })
      })
      return result
    },
    handleEvent () {
      if (this.geometry) {
        this.geometry.remove()
        this.geometry = null
      }
      this.layer.clear()
      const symbol = [
        {
          lineColor: this.style.lineColor,
          lineWidth: this.style.lineWidth,
          polygonFill: this.style.fillColor,
          polygonOpacity: this.style.field1 ? this.style.diaphaneity : 0
        },
        {
          textName: this.style.nameDisplayState ? this.style.markName : '',
          textSize: 20,
          textDx: 0,
          textDy: 0,
          textHaloFill: '#FFF',
          textHaloRadius: 5
        }
      ]
      let callback = () => {}
      switch (this.event) {
        case 'select-circle': {
          callback = (e) => {
            const center = e.geometry.getCenter()
            const radius = e.geometry.getRadius()
            this.coordinates = [center, radius]
            this.params.radius = radius.toFixed(6)
            // const format = this.fomartPosition([center])
            // this.params.center = `${format[0].x},${format[0].y}`
            this.params.center = `${center.x.toFixed(6)},${center.y.toFixed(6)}`
            this.geometry = window.$app.initGeometry({
              className: 'Circle',
              params: [
                center,
                radius,
                { symbol }
              ]
            })
            this.layer.clear().addGeometry(this.geometry)
            console.log(`圆心: ${this.params.center}, 半径: ${this.params.radius}`)
          }
          break
        }
        case 'select-ellipse': {
          callback = (e) => {
            const center = e.geometry.getCenter()
            const height = e.geometry.getHeight()
            const width = e.geometry.getWidth()
            this.coordinates = [center, width, height]
            // const format = this.fomartPosition([center])
            // this.params.center = `${format[0].x},${format[0].y}`
            this.params.center = `${center.x.toFixed(6)},${center.y.toFixed(6)}`
            this.params.width = width
            this.params.height = height
            this.geometry = window.$app.initGeometry({
              className: 'Ellipse',
              params: [
                center,
                width,
                height,
                { symbol }
              ]
            })
            this.layer.clear().addGeometry(this.geometry)
            console.log(`圆心: ${this.params.center} 长轴: ${this.params.width} 短轴: ${this.params.height} }`)
          }
          break
        }
        case 'select-line-string': {
          callback = (e) => {
            this.coordinates = e.geometry.getCoordinates()
            this.params.position = JSON.stringify(this.coordinates)
            this.geometry = window.$app.initGeometry({
              className: 'LineString',
              params: [
                this.coordinates,
                { symbol }
              ]
            })
            this.layer.clear().addGeometry(this.geometry)
            console.log(`坐标点: ${this.params.position}`)
          }
          break
        }
        case 'select-point': {
          symbol[0] = {
            markerType: 'ellipse',
            markerFill: this.style.fillColor,
            markerFillOpacity: this.style.field1 ? this.style.diaphaneity : 0,
            markerLineColor: this.style.lineColor,
            markerLineWidth: this.style.lineWidth,
            markerWidth: 5,
            markerHeight: 5
          }
          symbol[1].textDy = 15
          callback = (e) => {
            this.coordinates = e.geometry.getCoordinates()
            this.params.position = JSON.stringify(this.coordinates)
            this.geometry = window.$app.initGeometry({
              className: 'Marker',
              params: [
                this.coordinates,
                { symbol }
              ]
            })
            this.layer.clear().addGeometry(this.geometry)
            console.log(`坐标点: ${this.params.position}`)
          }
          break
        }
        case 'select-polygon': {
          callback = (e) => {
            this.coordinates = e.geometry.getCoordinates()
            this.params.position = JSON.stringify(this.coordinates)
            this.geometry = window.$app.initGeometry({
              className: 'Polygon',
              params: [
                this.coordinates,
                { symbol }
              ]
            })
            this.layer.clear().addGeometry(this.geometry)
            console.log(`坐标点: ${this.params.position}`)
          }
          break
        }
        case 'select-rectangle': {
          callback = (e) => {
            this.coordinates = e.geometry.getCoordinates()
            const extent = e.geometry.getExtent()
            const leftTop = {
              x: extent.xmin - 0,
              y: extent.ymax - 0
            }
            const rightBottom = {
              x: extent.xmax - 0,
              y: extent.ymin - 0
            }
            // const formatX = this.fomartPosition([leftTop])
            // const formatY = this.fomartPosition([rightBottom])
            // this.params.leftTop = `${formatX[0].x}, ${formatX[0].y}`
            // this.params.rightBottom = `${formatY[0].x}, ${formatY[0].y}`
            this.params.leftTop = `${leftTop.x.toFixed(6)}, ${leftTop.y.toFixed(6)}`
            this.params.rightBottom = `${rightBottom.x.toFixed(6)}, ${rightBottom.y.toFixed(6)}`

            this.geometry = window.$app.initGeometry({
              className: 'Polygon',
              params: [
                this.coordinates,
                { symbol }
              ]
            })
            this.layer.clear().addGeometry(this.geometry)
          }
          break
        }
        default: {
          break
        }
      }
      window.$app.toggleDraw({
        drawend: callback,
        mode: this.mode,
        once: true,
        symbol: {
          lineColor: this.style.lineColor,
          lineOpacity: 1,
          lineWidth: this.style.lineWidth,
          polygonFill: this.style.fillColor,
          polygonOpacity: this.style.field1 ? this.style.diaphaneity : 0
        }
      })
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
      if (!this.coordinates) {
        this.$message.error('您还未选择区域！')
        return null
      }
      const params = new FormData()
      Object.keys(this.style).forEach(key => {
        params.append(key, this.style[key] || '')
      })
      params.append('areaType', this.areaType[this.mode])
      params.append('markType', this.type)
      params.append('positionInfo', JSON.stringify(this.coordinates))
      params.append('field5', '1')

      this.axios.post(api.insertArea, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
          this.$emit('close', true)
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    updateSymbol () {
      if (this.geometry) {
        const type = this.geometry.getType
        const symbol = [
          {
            lineColor: this.style.lineColor,
            lineWidth: this.style.lineWidth,
            polygonFill: this.style.fillColor,
            polygonOpacity: this.style.field1 ? this.style.diaphaneity : 0
          },
          {
            textName: this.style.nameDisplayState ? this.style.markName : '',
            textHaloFill: '#FFF',
            textHaloRadius: 5
          }
        ]
        if (type === 'Point') {
          symbol[0] = {
            markerFill: this.style.fillColor,
            markerFillOpacity: this.style.field1 ? this.style.diaphaneity : 0,
            markerLineColor: this.style.lineColor,
            markerLineWidth: this.style.lineWidth
          }
        }
        this.geometry.updateSymbol(symbol)
      }
    },
    validate () {
      this.$refs['insert-marker-style-form'].validate(valid => {
        if (valid) {
          this.$refs['insert-marker-params-form'].validate(result => {
            if (result) {
              this.submit()
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.insert-marker {
  box-sizing: border-box;
  height: 100%;
  padding-top: 10px;
  text-align: left;
  width: 100%;
}
/* STYLE_FORM */
.insert-marker-style-item {
  margin-bottom: 5px !important;
  margin-right: 10px !important;
}
.insert-marker-style-item .medium {
  width: 175px;
}
/* PARAMS_FORM */
.insert-marker-params-form {
  margin-top: 20px;
}
.insert-marker-params-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 5px !important;
}
.insert-marker-params-item .medium {
  width: 275px;
}
.insert-marker-params-control {
  margin-top: 10px;
  text-align: right;
}
/* SINGLE */
.app-insert-marker-icon {
  background-color: green;
  border-radius: 18px;
  color: #FFF;
  display: inline-block;
  height: 18px;
  line-height: 18px;
  margin-right: 5px;
  text-align: center;
  width: 18px !important;
}
.app-insert-marker-icon.app-insert-marker-red {
  background-color: red;
}
/* CONTROL */
.insert-marker-control {
  margin-top: 10px;
  text-align: center;
}
</style>
<style>
.insert-marker-choose .el-form-item__content {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.insert-marker-params-item label {
  text-align: right;
  width: 80px !important;
}
</style>
