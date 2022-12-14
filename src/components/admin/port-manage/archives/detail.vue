<template>

  <app-dialog
    :config="config"
    :level="1"
    ref="app-dialog"
    :title="title"
    @close="close">

    <div class="port-detail">

      <el-form
        :model="model"
        ref="port-detail-form"
        :rules="rules"
        size="small">

      <template
        v-for="(_item, _index) in items">

        <div :key="_index">

          <div class="title">{{ _item.label }}
          </div>

          <div class="port-detail-form">

            <el-form-item
              v-for="(item, i) in _item.children"
              class="port-detail-item"
              :key="i"
              :label="`${item.label}:`"
              :prop="item.prop"
              :style="`width: ${ item.width };`">

              <el-input
                v-if="item.type === 'input'"
                v-model="model[item.prop]"
                :disabled="item.readonly"
                size="small"
                type="text"
                style="width: 100%;">
              </el-input>

              <el-input
                v-if="item.type === 'pickup'"
                v-model="model[item.prop]"
                :disabled="status === 'check'"
                size="small"
                type="text"
                style="width: 100%;">
              </el-input>

              <span
                v-if="item.placeholder && status !== 'check'"
                class="placeholder">注：{{ item.placeholder }}
              </span>

              <el-input
                v-if="item.type === 'textarea'"
                v-model="model[item.prop]"
                disabled
                resize="none"
                :rows="item.rows"
                size="small"
                type="textarea"
                style="width: 100%;">
              </el-input>

              <el-input-number
                v-if="item.type === 'number'"
                v-model="model[item.prop]"
                :disabled="status === 'check' || item.readonly"
                :min="0"
                style="width: 100%;"
                @change="changeNumber(item.prop)">
              </el-input-number>

              <el-select
                v-if="item.type === 'select'"
                v-model="model[item.prop]"
                style="width: 100%;">

                <el-option
                  v-for="(opt, i) in item.options"
                  :disabled="status === 'check'"
                  :key="i"
                  :label="opt.label"
                  :value="opt.value">
                </el-option>

              </el-select>

            </el-form-item>

          </div>

        </div>

      </template>

      </el-form>

      <div class="title">渔港区域
      </div>

      <el-form
        class="port-marker-form"
        :model="port.model">

        <el-form-item
          class="port-marker-item inline"
          label="渔港名称:">

          <el-input
            v-model="model.name"
            disabled
            size="small"
            type="text">
          </el-input>

        </el-form-item>

        <el-form-item
          class="port-marker-item inline"
          label="渔港面积(㎡):">

          <el-input
            v-model="model.portArea"
            disabled
            size="small"
            type="text">
          </el-input>

        </el-form-item>

        <el-form-item
          class="port-marker-item"
          label="渔港范围:">

          <template v-if="status !== 'check'">

            <el-button
              size="small"
              type="primary"
              @click="drawRange">多边形选取
            </el-button>

            <span
              v-if="!port.model.positionInfo"
              class="unit">注：在地图用多边形选取渔港覆盖范围
            </span>

            <span
              v-else
              class="success-flag">

              <i class="el-icon-success success-icon">
              </i>

              <span>渔港范围已选择
              </span>

            </span>

          </template>

          <template v-else>

            <el-button
              v-if="port.model.positionInfo"
              size="small"
              type="primary"
              @click="locatePortRange()">查看渔港范围
            </el-button>

            <span
              v-else>暂无渔港范围数据
            </span>

          </template>

        </el-form-item>

        <el-form-item
          v-if="status !== 'check'"
          class="port-marker-item"
          label="    ">

          <el-button
            size="small"
            type="primary"
            @click="toggleEnter">多边形录入
          </el-button>

          <span
            v-if="!port.model.positionInfo"
            class="unit">注：输入渔港经纬度坐标选取渔港覆盖范围
          </span>

          <span
            v-else
            class="success-flag">

            <i class="el-icon-success success-icon">
            </i>

            <span>渔港范围已录入
            </span>

          </span>

        </el-form-item>

        <!-- 多边形录入信息 -->
        <el-form-item
          v-if="port.enter"
          class="port-marker-item"
          label="    ">

          <el-form
            class="enter-form"
            :model="port">

            <el-form-item
              v-for="(item, i) in port.items"
              class="enter-form-item"
              :key="i"
              :label="`${item.label}${ i + 1}:`">

              <el-form-item
                v-for="(_item, index) in item.options"
                class="enter-form-block-item"
                :key="index"
                :label="_item.label">

                <el-form-item
                  class="enter-form-inline-item"
                  v-for="(opt, id) in _item.options"
                  :key="id">

                  <el-input
                    v-model="port.coordinate[i][index][opt.prop]"
                    size="mini"
                    @blur="textModel(port.coordinate[i][index][opt.prop], i, index, opt.prop)">

                    <template slot="append">{{ opt.unit }}
                    </template>

                  </el-input>

                </el-form-item>

                <div
                  v-if="index % 2 && i > 2"
                  class="enter-control-delete"
                  @click="deleteRow(i)">

                  <img
                    alt="ICON_DELETE"
                    src="/img/admin/port/icon-delete.png">

                    <span>删除
                    </span>

                </div>

              </el-form-item>

            </el-form-item>

          </el-form>

          <div class="enter-control">

            <div class="enter-control-insert">

              <img
                alt="ICON_INSERT"
                src="/img/admin/port/icon-insert.png">

              <span @click="addRow">添加一组坐标点
              </span>

            </div>

            <el-button
              plain
              size="mini"
              type="primary"
              @click="submitRange">确定
            </el-button>

          </div>

        </el-form-item>

        <div class="port-marker-item-wrapper">

          <el-form-item
            class="port-marker-item"
            label="填充色:"
            prop="fillColor">

            <el-color-picker
              v-model="port.model.fillColor"
              :disabled="status === 'check'"
              size="mini"
              @change="updateSymbol">
            </el-color-picker>

          </el-form-item>

          <el-form-item
            class="port-marker-item cell"
            label="透明度:">

            <el-slider
              v-model="port.model.diaphaneity"
              class="medium"
              :disabled="status === 'check'"
              :min="0"
              :max="1"
              show-stops
              show-tooltip
              :step="0.1"
              @change="updateSymbol">
            </el-slider>

          </el-form-item>

        </div>

        <div class="port-marker-item-wrapper">

          <el-form-item
            class="port-marker-item"
            label="线条颜色:"
            prop="lineColor">

            <el-color-picker
              v-model="port.model.lineColor"
              :disabled="status === 'check'"
              size="mini"
              @change="updateSymbol">
            </el-color-picker>

          </el-form-item>

          <el-form-item
            class="port-marker-item cell"
            label="边框线宽:">

            <el-slider
              v-model="port.model.lineWidth"
              class="medium"
              :disabled="status === 'check'"
              :min="0"
              :max="5"
              show-stops
              show-tooltip
              :step="0.5"
              @change="updateSymbol">
            </el-slider>

          </el-form-item>

        </div>

      </el-form>

      <div class="form control log-detail-control">

        <span
          v-if="status === 'update'"
          class="button"
          role="primary-form"
          @click="validate()">提交
        </span>

      </div>

    </div>

  </app-dialog>

</template>

<script>
import api from '@/util/api'
import {
  archives
} from '../configs'
import appDialog from '@/components/common/dialog'
export default {
  name: 'port-detail',
  components: {
    'app-dialog': appDialog
  },
  data () {
    return {
      config: {
        height: 540,
        width: 800
      },
      items: archives.items.slice(),
      layer: null,
      model: Object.assign({}, archives.model),
      port: {
        coordinate: [
          [
            {
              deg: '',
              min: '',
              sec: ''
            },
            {
              deg: '',
              min: '',
              sec: ''
            }
          ],
          [
            {
              deg: '',
              min: '',
              sec: ''
            },
            {
              deg: '',
              min: '',
              sec: ''
            }
          ],
          [
            {
              deg: '',
              min: '',
              sec: ''
            },
            {
              deg: '',
              min: '',
              sec: ''
            }
          ]
        ],
        coordinates: null,
        enter: false,
        geometry: null,
        items: [
          {
            class: 'item-inline',
            label: '坐标点',
            options: [
              {
                children: true,
                label: '经度',
                options: [
                  {
                    prop: 'deg',
                    unit: '°'
                  },
                  {
                    prop: 'min',
                    unit: '′'
                  },
                  {
                    prop: 'sec',
                    unit: '″'
                  }
                ]
              },
              {
                children: true,
                label: '纬度',
                options: [
                  {
                    prop: 'deg',
                    unit: '°'
                  },
                  {
                    prop: 'min',
                    unit: '′'
                  },
                  {
                    prop: 'sec',
                    unit: '″'
                  }
                ]
              }
            ]
          },
          {
            class: 'item-inline',
            label: '坐标点',
            options: [
              {
                children: true,
                label: '经度',
                options: [
                  {
                    prop: 'deg',
                    unit: '°'
                  },
                  {
                    prop: 'min',
                    unit: '′'
                  },
                  {
                    prop: 'sec',
                    unit: '″'
                  }
                ]
              },
              {
                children: true,
                label: '纬度',
                options: [
                  {
                    prop: 'deg',
                    unit: '°'
                  },
                  {
                    prop: 'min',
                    unit: '′'
                  },
                  {
                    prop: 'sec',
                    unit: '″'
                  }
                ]
              }
            ]
          },
          {
            class: 'item-inline',
            label: '坐标点',
            options: [
              {
                children: true,
                label: '经度',
                options: [
                  {
                    prop: 'deg',
                    unit: '°'
                  },
                  {
                    prop: 'min',
                    unit: '′'
                  },
                  {
                    prop: 'sec',
                    unit: '″'
                  }
                ]
              },
              {
                children: true,
                label: '纬度',
                options: [
                  {
                    prop: 'deg',
                    unit: '°'
                  },
                  {
                    prop: 'min',
                    unit: '′'
                  },
                  {
                    prop: 'sec',
                    unit: '″'
                  }
                ]
              }
            ]
          }
        ],
        layer: null,
        model: {
          nameDisplayState: false,
          fillColor: '#FF0000',
          diaphaneity: 0.3,
          lineColor: '#FF0000',
          lineWidth: 1,
          positionInfo: null
        }
      },
      rules: Object.assign({}, archives.rules)
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
      default: -1,
      required: false,
      type: Number
    },
    status: {
      default: 'check',
      required: false,
      type: String
    },
    title: {
      default: '港口档案详情',
      required: false,
      type: String
    }
  },
  watch: {
    id: 'initData'
  },
  mounted () {
    this.layer = window.$app.initVectorLayer('increase', 2)
    this.port.layer = window.$app.initVectorLayer('port-marker', 2)
    this.initData()
  },
  destroyed () {
    this.clearPoint()
    this.port.layer.remove()
  },
  methods: {
    addRow () {
      const model = [
        {
          deg: '',
          min: '',
          sec: ''
        },
        {
          deg: '',
          min: '',
          sec: ''
        }
      ]
      const item = {
        class: 'item-inline',
        label: '坐标点',
        options: [
          {
            children: true,
            label: '经度',
            options: [
              {
                prop: 'deg',
                unit: '°'
              },
              {
                prop: 'min',
                unit: '′'
              },
              {
                prop: 'sec',
                unit: '″'
              }
            ]
          },
          {
            children: true,
            label: '纬度',
            options: [
              {
                prop: 'deg',
                unit: '°'
              },
              {
                prop: 'min',
                unit: '′'
              },
              {
                prop: 'sec',
                unit: '″'
              }
            ]
          }
        ]
      }
      this.port.coordinate.push(model)
      this.port.items.push(item)
    },
    changeNumber (e) {
      switch (e) {
        case 'attentionBoatNum':
        case 'controlBoatNum':
        case 'highRiskNum': {
          // 分类分级渔船总数
          this.model.gradeTotal = this.model.highRiskNum + this.model.attentionBoatNum + this.model.controlBoatNum
          break
        }
        case 'localBoatNum':
        case 'nonLocalBoatNum': {
          // 停靠船舶数量
          this.model.boatTotal = this.model.localBoatNum + this.model.nonLocalBoatNum
          break
        }
        default: {
          break
        }
      }
    },
    clearPoint () {
      this.layer.remove()
      const tool = window.$app.layers.tool_draw_Point
      if (tool) {
        tool.remove()
        delete window.$app.layers.tool_draw_Point
      }
    },
    close (visible) {
      this.$emit('close', visible)
    },
    deleteRow (index) {
      console.log(index)
      this.port.items.splice(index, 1)
      this.port.coordinate.splice(index, 1)
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
    drawRange () {
      this.clearPoint()
      this.port.enter = false
      this.$refs['app-dialog'].zoom('narrow')

      if (this.port.geometry) {
        this.port.geometry.remove()
        this.port.geometry = null
      }
      this.port.layer.clear()

      const symbol = [
        {
          lineColor: this.port.model.lineColor,
          lineWidth: this.port.model.lineWidth - 0,
          polygonFill: this.port.model.fillColor,
          polygonOpacity: this.port.model.diaphaneity - 0
        },
        {
          textName: this.port.model.nameDisplayState ? this.model.name : '',
          textSize: 14,
          textDx: 0,
          textDy: 0,
          textHaloFill: '#FFF',
          textHaloRadius: 5
        }
      ]

      const callback = (e) => {
        this.port.coordinates = e.geometry.getCoordinates()
        this.port.model.positionInfo = JSON.stringify(this.port.coordinates)
        this.port.geometry = window.$app.initGeometry({
          className: 'Polygon',
          params: [
            this.port.coordinates,
            { symbol }
          ]
        })
        this.port.layer.clear().addGeometry(this.port.geometry)
        this.model.portArea = Math.floor((this.port.geometry.getArea() || 0) * 1000) / 1000
        this.$forceUpdate()
        console.log(`渔港坐标点: ${this.port.model.positionInfo}`)
        this.$refs['app-dialog'].zoom('enlarge')
        // 恢复渔港点位选取
        this.layer = window.$app.initVectorLayer('increase', 2)
        this.draw()
      }

      window.$app.toggleDraw({
        drawend: callback,
        mode: 'Polygon',
        once: true,
        symbol: {
          lineColor: this.port.model.lineColor,
          lineOpacity: 1,
          lineWidth: this.port.model.lineWidth - 0,
          polygonFill: this.port.model.fillColor,
          polygonOpacity: this.port.model.diaphaneity - 0
        }
      })
    },
    formatPositon (deg, min, sec) {
      return (deg - 0) + (min - 0) / 60 + (sec - 0) / 3600
    },
    initData () {
      this.model = Object.assign({}, archives.model)
      if (this.id) {
        this.items.forEach(item => {
          item.children.forEach(_item => {
            if (_item.type === 'number' || _item.type === 'pickup') {
              this.model[_item.prop] = this.data[_item.prop] ? this.data[_item.prop] - 0 : 0
            } else {
              this.model[_item.prop] = this.data[_item.prop] || ''
            }
          })
        })
        // Object.keys(this.model).forEach(key => {
        //   this.model[key] = this.data[key] || ''
        // })
        Object.keys(this.port.model).forEach(key => {
          if (this.data[key]) {
            this.port.model[key] = this.data[key]
          }
        })
        this.port.model.diaphaneity = this.port.model.diaphaneity - 0
        this.port.model.lineWidth = this.port.model.lineWidth - 0
        // 计算数量
        // 停靠船舶数量
        this.model.boatTotal = this.model.localBoatNum + this.model.nonLocalBoatNum
        // 分类分级渔船总数
        this.model.gradeTotal = this.model.highRiskNum + this.model.attentionBoatNum + this.model.controlBoatNum
        if (this.status === 'update') {
          this.draw()
        }
      }
    },
    locatePortRange () {
      if (this.port.model.positionInfo) {
        const model = JSON.parse(this.port.model.positionInfo)
        this.locateRange(model)
      }
    },
    locateRange (model) {
      if (this.port.geometry) {
        this.port.geometry.remove()
        this.port.geometry = null
      }
      this.port.layer.clear()

      const params = []
      const symbol = [
        {
          lineColor: this.port.model.lineColor,
          lineWidth: this.port.model.lineWidth - 0,
          polygonFill: this.port.model.fillColor,
          polygonOpacity: this.port.model.diaphaneity - 0
        },
        {
          textName: this.port.model.nameDisplayState ? this.model.name : '',
          textSize: 14,
          textDx: 0,
          textDy: 0,
          textColor: 'black',
          textHaloFill: '#FFF',
          textHaloRadius: 5
        }
      ]
      this.port.coordinates = model
      params.push(model)
      this.port.model.positionInfo = JSON.stringify(this.port.coordinates)
      params.push({ symbol })
      this.port.geometry = window.$app.initGeometry({
        className: 'Polygon',
        params
      })
      this.model.portArea = Math.floor((this.port.geometry.getArea() || 0) * 1000) / 1000
      this.port.layer.clear().addGeometry(this.port.geometry)
      window.$app.locate(this.port.geometry)
    },
    submit () {
      const params = new FormData()
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })
      Object.keys(this.port.model).forEach(key => {
        params.append(key, this.port.model[key] || '')
      })
      params.append('id', this.id)

      this.axios.post(api.updatePortDetail, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
          this.close(true)
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员')
      })
    },
    submitRange () {
      const model = []
      const length = this.port.coordinate.length
      this.port.coordinate.push(this.port.coordinate[length - 1])
      this.port.coordinate.forEach((item, i) => {
        model[i] = {
          x: this.formatPositon(item[0].deg, item[0].min, item[0].sec) - 0,
          y: this.formatPositon(item[1].deg, item[1].min, item[1].sec) - 0
        }
      })
      let message = null
      model.forEach(item => {
        if (!item.x || !item.y) {
          message = '您还未填写完毕！'
        }
      })
      if (message) {
        this.$message.warning(message)
        return null
      }
      this.locateRange(model)
    },
    textModel (e, i, index, prop) {
      if (e) {
        const value = e - 0
        if (typeof value !== 'number' || isNaN(value)) {
          this.port.coordinate[i][index][prop] = ''
          this.$message.warning('请输入数字格式！')
        }
      }
    },
    toggleEnter () {
      this.port.enter = true
    },
    updateSymbol () {
      if (this.port.geometry) {
        const symbol = [
          {
            lineColor: this.port.model.lineColor,
            lineWidth: this.port.model.lineWidth - 0,
            polygonFill: this.port.model.fillColor,
            polygonOpacity: this.port.model.diaphaneity - 0
          },
          {
            textName: this.port.model.nameDisplayState ? this.model.name : '',
            textHaloFill: '#FFF',
            textHaloRadius: 5
          }
        ]
        this.port.geometry.updateSymbol(symbol)
      }
    },
    validate () {
      this.$refs['port-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.port-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  /*justify-content: space-between;*/
  overflow-y: auto;
  padding-right: 5px;
  padding-top: 10px;
  width: 100%;
}
/* TITLE */
.title {
  font-font: 'SHSCNM';
  font-size: 16px;
  margin-bottom: 15px;
  text-align: left;
}
.title::before {
  background-color: rgba(22, 127, 255, 1);
  border-radius: 3px;
  content: '';
  display: inline-block;
  height: 18px;
  margin-right: 5px;
  transform: translateY(3px);
  width: 6px;
}
/* FORM */
.port-detail-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /*flex-grow: 1;*/
  /*overflow-y: auto;*/
}
.port-detail-item {
  /*align-items: center;*/
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
.port-detail-item .placeholder {
  font-size: 12px;
  text-align: left;
  width: 100%;
}
/* MARKER_FORM */
.port-marker-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
.port-marker-form > .port-marker-item {
  width: 100%;
}
.port-marker-item {
  /*align-items: center;*/
  display: flex;
  flex-direction: row;
}
.port-marker-item.inline {
  width: 50%;
}
.port-marker-item.inline >>> .el-form-item__content {
  flex-grow: 1;
}
.unit {
  color: rgba(255, 68, 68, 1);
  font-family: 'SHSCNN';
  font-size: 14px;
  margin-left: 24px;
}
.port-marker-item-wrapper {
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
}
.port-marker-item-wrapper .medium {
  width: 250px;
}
.port-marker-item.cell {
  margin-left: 10px;
}
.success-flag {
  font-family: 'SHSCNN';
  font-size: 14px;
  margin-left: 24px;
}
.success-icon {
  color: green;
  font-size: 16px;
}
/* ENTER_FORM */
.enter-form-item {
  background-color: rgba(242, 244, 248, .5);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin-bottom: 1px;
  padding-bottom: 20px;
  padding-left: 14px;
  padding-right: 30px;
  padding-top: 20px;
}
.enter-form-item:first-child {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
/*.enter-form-item:last-child {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}*/
.enter-form-block-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  position: relative;
}
.enter-form-inline-item {
  margin-right: 22px;
}
/* DELETE_CONTROL */
.enter-control-delete {
  align-items: center;
  background-color: rgba(255, 68, 68, .1);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  height: 18px;
  left: -115px;
  padding-left: 5px;
  padding-right: 7px;
  position: absolute;
  top: 6px;
}
.enter-control-delete span {
  color: rgba(255, 68, 68, 1);
  font-size: 12px;
  margin-left: 3px;
}
/* INSERT_CONTROL */
.enter-control {
  align-items: center;
  background-color: rgba(242, 244, 248, .5);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 15px;
  padding-left: 128px;
  padding-right: 30px;
  padding-top: 15px;
}
.enter-control-insert {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
}
.enter-control-insert span {
  color: rgba(22, 119, 255, 1);
  font-size: 14px;
  margin-left: 6px;
}
</style>
<style>
.port-detail-item label,
.port-marker-item label {
  flex-shrink: 0;
  text-align: right;
  width: 100px;
}
.port-marker-item.cell .el-form-item__content,
.port-detail-item .el-form-item__content {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.enter-form-block-item .el-form-item__content {
  display: flex;
  flex-direction: row;
}
.enter-form-block-item label {
  width: 50px;
}
</style>
