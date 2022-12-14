<template>

  <div class="port-scribe">

    <el-form
      class="video-choose-form"
      :model="canvas.model"
      size="small">

      <el-form-item
        v-for="(item, i) in canvas.items"
        class="video-choose-item"
        :key="i"
        :label="`${item.label}：`">

        <el-autocomplete
          v-if="item.type === 'autocomplete'"
          v-model="canvas.model[item.prop]"
          :fetch-suggestions="querySearchAsync"
          value-key="label"
          placeholder="请输入内容"
          style="width: 250px;"
          @select="handleChangeCode">
        </el-autocomplete>

        <el-select
          v-if="item.type === 'select'"
          v-model="canvas.model[item.prop]"
          style="width: 250px;"
          @change="handleChange">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

      </el-form-item>

    </el-form>

    <canvas
      :height="height"
      id="canvas"
      :width="width"
      @mousedown="start($event)"
      @mousemove="move($event)"
      @mouseup="end($event)">
    </canvas>

    <el-form
      class="direction-form"
      size="small">

      <el-form-item
        v-for="(_item, index) in direction.items"
        class="direction-item"
        :key="index"
        :label="`${_item.label + (index + 1)}:`">

        <el-select
          v-model="_item['value']"
          style="width: 250px;">

          <el-option
            v-for="(item, i) in direction.options"
            :key="i"
            :label="item.label"
            :value="item.value">
          </el-option>

        </el-select>

      </el-form-item>

    </el-form>

    <div>

      <el-button
        size="small"
        type="primary"
        @click="submit">提交
      </el-button>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'port-scribe',
  data () {
    return {
      bottom: 0,
      canvas: {
        items: [
          {
            label: '监控名称',
            prop: 'videoName',
            type: 'autocomplete'
          },
          {
            label: '划线方式',
            prop: 'line',
            type: 'select',
            options: [
              {
                label: '直线',
                value: 'straight-line'
              },
              {
                label: '折线',
                value: 'broken-line'
              }
            ]
          }
        ],
        model: {
          line: 'straight-line',
          sensorType: '',
          videoCode: '8',
          videoName: '烟台港客运站楼顶'
        }
      },
      ctx: null,
      data: [],
      direction: {
        endPoint: '',
        items: [],
        options: [
          {
            label: 'A-B',
            value: 'L-R'
          },
          {
            label: 'B-A',
            value: 'R-L'
          }
        ],
        startPoint: ''
      },
      flag: null,
      height: 360,
      left: 0,
      mouseX: 0,
      mouseY: 0,
      points: [],
      position: {
        bottom: 100,
        left: 10,
        right: 150,
        top: 40
      },
      right: 0,
      top: 0,
      width: 640
    }
  },
  mounted () {
    this.initDrawLine()
  },
  methods: {
    countDistance (x, y, x1, y1, x2, y2) {
      const A = Math.abs(Math.sqrt(Math.pow((x - x1), 2) + Math.pow((y - y1), 2)))
      const B = Math.abs(Math.sqrt(Math.pow((x - x2), 2) + Math.pow((y - y2), 2)))
      const C = Math.abs(Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)))
      // 利用海伦公式计算三角形面积
      // 周长的一半
      const P = (A + B + C) / 2
      const allArea = Math.abs(Math.sqrt(P * (P - A) * (P - B) * (P - C)))
      // 普通公式计算三角形面积反推点到线的垂直距离
      return (2 * allArea) / C
    },
    draw (x, y) { // 折线绘制方法
      const length = this.points.length
      const left = this.points[length - 4]
      const top = this.points[length - 3]
      const num = (this.points.length) / 4
      this.ctx.beginPath()
      this.ctx.moveTo(left, top)
      this.ctx.lineTo(x, y)
      this.ctx.strokeStyle = '#FF0000'
      this.ctx.lineWidth = 3
      this.ctx.font = '14px Avenir'
      this.ctx.fillStyle = '#FF0000'
      const pointTop = (top + y) / 2
      const pointLeft = (left + x) / 2
      const k = ((y - top) / (x - left))
      if (k > 0) {
        this.ctx.fillText(`B${num}`, pointLeft + 20, pointTop - 20)
        this.ctx.fillText(`A${num}`, pointLeft - 20, pointTop + 20)
      } else {
        this.ctx.fillText(`B${num}`, pointLeft + 20, pointTop + 20)
        this.ctx.fillText(`A${num}`, pointLeft - 20, pointTop - 20)
      }
      this.ctx.stroke()
    },
    drawBrokenLine (x, y) { // 折线
      const length = this.points.length
      if (length === 2) { // 折线的第一个点
        this.ctx.beginPath()
        this.ctx.fillStyle = '#FF0000'
        this.ctx.fillRect(x, y, 4, 4)
        this.ctx.stroke()
      } else {
        this.draw(x, y)
        this.insetItems(1)
      }
    },
    drawStraightLine (left, top, right, bottom, num) { // 直线
      this.ctx.beginPath()
      this.ctx.moveTo(left, top)
      this.ctx.lineTo(right, bottom)
      this.ctx.strokeStyle = '#FF0000'
      this.ctx.lineWidth = 3
      this.ctx.font = '14px Avenir'
      this.ctx.fillStyle = '#FF0000'
      const pointTop = (top + bottom) / 2
      const pointLeft = (left + right) / 2
      const k = ((bottom - top) / (right - left))
      if (k > 0) {
        this.ctx.fillText(`B${num}`, pointLeft + 20, pointTop - 20)
        this.ctx.fillText(`A${num}`, pointLeft - 20, pointTop + 20)
      } else {
        this.ctx.fillText(`B${num}`, pointLeft + 20, pointTop + 20)
        this.ctx.fillText(`A${num}`, pointLeft - 20, pointTop - 20)
      }
      this.ctx.stroke()
    },
    end (e) {
      switch (this.canvas.model.line) {
        case 'straight-line': {
          this.flag = null
          console.log(this.position.left, this.position.top, this.position.right, this.position.bottom)
          break
        }
        case 'broken-line': {
          if (this.points.length > 10) {
            this.$message.warning('折线数量<=3')
          } else {
            // 构造一个线段数组 ex:123, 34, 125, 36, 125, 36, 126, 57
            const x = e.clientX - 240
            const y = e.clientY - 218
            const length = this.points.length

            // 限制线段长度
            let status = true
            if (length >= 2) {
              status = this.pointDistance(this.points[length - 2], this.points[length - 1], x, y)
            }

            if (status) {
              if (length < 4) {
                this.points.push(x, y)
              } else {
                this.points.push(this.points[length - 2], this.points[length - 1])
                this.points.push(x, y)
              }
              this.drawBrokenLine(x, y)
            } else {
              this.$message.warning('线段长度应>=100像素！')
            }
          }
          break
        }
        default:
          break
      }
    },
    handleChange (e) {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, 800, 800)
      }
      this.points = []

      // 处理返回值倍数问题-暂定1
      const count = 1

      this.data = this.data || []
      let points = []
      if (this.data.length) {
        points = this.data.split(',').map(item => {
          item = item - 0
          return item / count
        })
      } else {
        points = []
      }

      if (e === 'broken-line') { // 选中的是折线
        if (points.length > 4) {
          this.initCanvas()
          this.points = points
          const num = this.points.length / 4
          for (let i = 0; i < num; i++) {
            const list = this.points.slice(i * 4, i * 4 + 4)
            this.drawStraightLine(list[0], list[1], list[2], list[3], i + 1)
          }
        } else {
          this.reset()
          this.insetItems(2)
        }
      } else { // 选中的直线
        if (points.length === 4) {
          this.position.left = points[0]
          this.position.top = points[1]
          this.position.right = points[2]
          this.position.bottom = points[3]
          this.initLine()
        } else {
          this.reset()
          this.insetItems(0)
        }
      }
    },
    handleChangeCode (e) {
      this.canvas.model.sensorType = e.type
      this.canvas.model.videoCode = e.code
      this.initDrawLine()
    },
    initCanvas () {
      const canvas = document.querySelector('#canvas')
      this.ctx = canvas.getContext('2d')
    },
    initDrawLine () {
      // 初始化划线信息
      const params = new FormData()
      params.append('code', this.canvas.model.videoCode)

      this.axios.post(api.getVideoScribe, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (this.ctx) {
            this.ctx.clearRect(0, 0, 800, 800)
          }
          const data = this.data = res.result ? res.result[0] : {}
          // 处理返回值倍数问题
          let count = 1
          switch (data.sensorType) {
            case '可见光':
              count = 3
              break
            case '热成像':
              count = 2
              break
            case '球机可见光':
              count = 4
              break
            default:
              count = 1
              break
          }
          // 处理返回点
          data.linePoint = data.linePoint || []
          let points = []
          if (data.linePoint.length) {
            points = data.linePoint.split(',').map(item => {
              item = item - 0
              return item / count
            })
          } else {
            points = []
          }
          console.log(data, count, points)
          if (points.length > 4) { // 复现折线
            this.initCanvas()
            this.canvas.model.line = 'broken-line'
            this.points = points
            const num = this.points.length / 4
            for (let i = 0; i < num; i++) {
              const list = this.points.slice(i * 4, i * 4 + 4)
              this.drawStraightLine(list[0], list[1], list[2], list[3], i + 1)
            }
          } else if (points.length === 4) { // 复现直线
            this.canvas.model.line = 'straight-line'
            this.insetItems(0) // 初始化划线类型
            this.position.left = points[0]
            this.position.top = points[1]
            this.position.right = points[2]
            this.position.bottom = points[3]
            this.initLine()
          } else { // 未画线
            this.canvas.model.line = 'straight-line'
            this.insetItems(0) // 初始化划线类型
            this.position = {
              bottom: 100,
              left: 10,
              right: 150,
              top: 40
            }
            this.initLine()
          }
        } else {
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
      })
    },
    initLine () {
      if (!this.ctx) {
        this.initCanvas()
      }
      this.drawStraightLine(this.position.left, this.position.top, this.position.right, this.position.bottom, 1)
      this.drawStraightLine(this.position.left, this.position.top, this.position.right, this.position.bottom, 1)
    },
    insetItems (status, value) {
      const row = {
        label: '入港方向',
        value: value || 'R-L'
      }
      switch (status) {
        case 0:
          this.direction.items = []
          this.direction.items.push(row)
          break
        case 1:
          this.direction.items.push(row)
          break
        case 2:
          this.direction.items = []
          break
        default:
          break
      }
      this.$forceUpdate()
    },
    move (e) {
      switch (this.canvas.model.line) {
        case 'straight-line': {
          const x = e.clientX - 240
          const y = e.clientY - 218
          switch (this.flag) {
            case 'left':
              this.position.left = x
              this.position.top = y
              break
            case 'right':
              this.position.right = x
              this.position.bottom = y
              break
            case 'middle':
              this.position.left = x - this.mouseX + this.left
              this.position.top = y - this.mouseY + this.top
              this.position.right = x - this.mouseX + this.right
              this.position.bottom = y - this.mouseY + this.bottom
              break
            default:
              break
          }
          this.ctx.clearRect(0, 0, 800, 800)
          this.drawStraightLine(this.position.left, this.position.top, this.position.right, this.position.bottom, 1)
          break
        }
        default:
          break
      }
    },
    pointDistance (x1, y1, x2, y2) {
      const pointX = Math.abs(x2 - x1)
      const pointY = Math.abs(y2 - y1)
      return Math.sqrt(pointX * pointX + pointY * pointY) > 1
    },
    querySearchAsync (val, cb) {
      const params = new FormData()
      params.append('pageSize', -1)
      params.append('pageNum', 1)
      params.append('videoName', val || '')

      let list = []
      this.axios.post(api.getVideoPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          list = res.result.records.map(item => {
            return {
              code: item.videoCode,
              label: item.videoName,
              type: item.sensorType
            }
          })
          cb(list)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    reset () {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, 800, 800)
      }
      switch (this.canvas.model.line) {
        case 'straight-line': {
          this.position = {
            bottom: 100,
            left: 10,
            right: 150,
            top: 40
          }
          this.initLine()
          this.insetItems(0)
          break
        }
        case 'broken-line': {
          this.points = []
          this.insetItems(2)
          break
        }
        default:
          break
      }
    },
    start (e) {
      switch (this.canvas.model.line) {
        case 'straight-line': {
          const x = this.mouseX = e.clientX - 240
          const y = this.mouseY = e.clientY - 218
          this.left = this.position.left
          this.top = this.position.top
          this.right = this.position.right
          this.bottom = this.position.bottom
          const distance = this.countDistance(x, y, this.left, this.top, this.right, this.bottom)
          if ((Math.abs(x - this.left) < 5) && (Math.abs(y - this.top) < 5)) {
            this.flag = 'left'
          } else if ((Math.abs(x - this.right) < 5) && (Math.abs(y - this.bottom) < 5)) {
            this.flag = 'right'
          } else if (distance < 5) {
            this.flag = 'middle'
          } else {
            this.flag = null
          }
          break
        }
        default:
          break
      }
    },
    submit () {
      const position = this.position
      const sensorType = this.canvas.model.sensorType
      const lineType = this.canvas.model.line
      const pointList = this.points
      let points = []
      const entryDir = []
      let firstLine = ''
      let secondLine = ''
      let thirdLine = ''

      // 计算入港方向
      this.direction.items.forEach(item => {
        console.log(item)
        entryDir.push(item.value)
      })

      let count = 1
      // 判断摄像头类型计算比例
      switch (sensorType) {
        case '可见光':
          count = 3
          break
        case '热成像':
          count = 2
          break
        case '球机可见光':
          count = 4
          break
        default:
          count = 1
          break
      }

      if (lineType === 'straight-line') { // 判断划线类型
        if (position.left !== position.right) {
          if ((position.left - position.right) > 0) {
            this.direction.endPoint = [position.left * count, position.top * count]
            this.direction.startPoint = [position.right * count, position.bottom * count]
          } else {
            this.direction.startPoint = [position.left * count, position.top * count]
            this.direction.endPoint = [position.right * count, position.bottom * count]
          }
        } else {
          if ((position.top - position.bottom) > 0) {
            this.direction.startPoint = [position.left * count, position.top * count]
            this.direction.endPoint = [position.right * count, position.bottom * count]
          } else {
            this.direction.endPoint = [position.left * count, position.top * count]
            this.direction.startPoint = [position.right * count, position.bottom * count]
          }
        }
        firstLine = JSON.stringify([this.direction.startPoint, this.direction.endPoint])
        secondLine = []
        thirdLine = []
        points = [...this.direction.startPoint, ...this.direction.endPoint]
      } else {
        pointList.forEach(item => {
          item = item - 0
          points.push(item * count)
        })
        const length = points.length / 4
        switch (length) {
          case 1:
            firstLine = JSON.stringify([[points[0], points[1]], [points[2], points[3]]])
            secondLine = ''
            thirdLine = ''
            break
          case 2:
            firstLine = JSON.stringify([[points[0], points[1]], [points[2], points[3]]])
            secondLine = JSON.stringify([[points[4], points[5]], [points[6], points[7]]])
            thirdLine = ''
            break
          case 3:
            firstLine = JSON.stringify([[points[0], points[1]], [points[2], points[3]]])
            secondLine = JSON.stringify([[points[4], points[5]], [points[6], points[7]]])
            thirdLine = JSON.stringify([[points[8], points[9]], [points[10], points[11]]])
            break
          default:
            break
        }
      }

      if (!this.direction.items.length) {
        this.$message.warning('您还未完成划线！')
        return null
      }

      const params = new FormData()
      params.append('linePoint', points)
      params.append('code', this.canvas.model.videoCode)
      params.append('entryDir', entryDir)
      params.append('firstLine', firstLine)
      params.append('secondLine', secondLine)
      params.append('thirdLine', thirdLine)

      this.axios.post(api.updateVideoScribe, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
.port-scribe {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  position: relative;
  width: 100%;
}
/* FORM */
.video-choose-item {
  align-items: center;
  display: flex;
  flex-direction: row;
}
/* CANVAS */
#canvas {
  background-color: pink;
  position: absolute;
  top: 125px;
  z-index: 3;
}
/* FORM */
.direction-form {
  margin-top: 450px;
}
.direction-item {
  align-items: center;
  display: flex;
  flex-direction: row;
}
</style>
