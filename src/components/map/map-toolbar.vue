<template>

  <div class="map-toolbar">

    <div
      v-for="(item, i) in tools"
      :class="['map-toolbar-item', item.active]"
      :key="i"
      @click="handle(item, i)">

      <i :class="['iconfont', 'icon', item.icon]">
      </i>

      <span>{{ item.label }}
      </span>

      <div
        v-if="i"
        class="line">
      </div>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'map-toolbar',
  data () {
    return {
      geometry: null,
      layer: null, // 绘制图层
      select: '',
      tools: [
        {
          active: '',
          icon: 'icon-sousuo1',
          label: '圆搜',
          path: '/admin?type=Circle',
          prop: 'circle',
          type: 'Circle'
        },
        {
          active: '',
          icon: 'icon-sousuo',
          label: '方搜',
          path: '/admin?type=Rectangle',
          prop: 'rectangle',
          type: 'Rectangle'
        },
        {
          active: '',
          icon: 'icon-shiye',
          label: '默认视野',
          path: '/admin',
          prop: 'config'
        },
        {
          active: '',
          icon: 'icon-fuwei',
          label: '复位',
          path: '/admin',
          prop: 'reset'
        }
      ]
    }
  },
  watch: {
    $route: 'fetchStatus'
  },
  mounted () {
    this.$nextTick(() => {
      this.layer = window.$app.initVectorLayer('select', 2)
      this.fetchStatus()
    })
  },
  destroyed () {
    if (this.layer) {
      this.layer.remove()
    }
  },
  methods: {
    fetchStatus () {
      const query = this.$route.query

      if (this.geometry) {
        this.geometry.remove()
      }
      if (this.layer) {
        this.layer.clear()
      }
      if (this.select) {
        this.toggleDraw(this.select)
        // this.updateTrawlerSymbol()
        this.select = null
      }

      this.tools.forEach((item, index) => {
        if (item.type && query.type === item.type) {
          this.tools[index].active = 'active'
          // this.current = index
          if (item.type === 'Circle') {
            this.toggleCircle()
          } else {
            this.toggleDraw(item.type)
          }
          this.select = item.type
          window.$app.config.visible = false
        } else {
          this.tools[index].active = ''
          window.$app.area.visible = false
          if (item.prop === 'reset') {
            window.$app.config.visible = false
          }
        }
      })
    },
    handle (data, index) {
      if (data.type) {
        const active = data.active ? '' : 'active'
        const path = active ? data.path : '/admin'
        if (!active) { // 关闭圆搜方搜后同步关闭搜索结果弹窗
          this.$emit('close-area-search')
        }

        this.$router.push(path)
        this.tools[index].active = active
      } else {
        this.$router.push(data.path)
        this.$emit('handle', data)
      }

      if (data.prop === 'reset') {
        window.$app.config.visible = false
      }

      if (this.select) {
        this.toggleDraw(this.select)
        this.select = null
      }
    },
    toggleCircle () {
      let center = null
      const start = (e) => {
        center = e.viewPoint
      }
      const callback = (e) => {
        const coordinate = e.geometry.getCoordinates()
        const _radius = e.geometry.getRadius()
        const radius = (_radius / 1852).toFixed(3)
        const current = e.viewPoint
        const _angle = Math.atan2(
          current.y - center.y,
          current.x - center.x
        )
        const angle = (((_angle * 360 / 2 / Math.PI) + 450) % 360).toFixed(1)
        const symbol = [
          {
            lineColor: 'red',
            lineWidth: 2,
            polygonFill: 'white',
            polygonOpacity: 0.3
          },
          {
            textName: `方位${angle}°，距离${radius}海里`,
            textSize: 18
          }
        ]
        const circle = window.$app.initGeometry({
          className: 'Circle',
          params: [
            coordinate,
            _radius,
            { symbol }
          ]
        })
        const point = window.$map.viewPointToCoord(current)
        const line = window.$app.initGeometry({
          className: 'LineString',
          params: [
            [
              coordinate, point
            ],
            {
              symbol: {
                lineColor: 'red',
                lineWidth: 2
              }
            }
          ]
        })
        this.geometry = window.$app.initGeometry({
          className: 'GeometryCollection',
          params: [
            [
              circle, line
            ]
          ]
        })
        this.layer.clear().addGeometry(this.geometry)
        if (e.type === 'drawend') {
          const points = [{ x: coordinate.x, y: coordinate.y, r: _radius }]
          this.updateTrawlerSymbol(points, '圆形')
        }
      }
      this.layer.clear()
      window.$app.toggleDraw({
        drawend: callback,
        drawstart: start,
        mode: 'Circle',
        mousemove: callback,
        once: false,
        symbol: [
          {
            lineColor: 'red',
            lineWidth: 2,
            polygonFill: 'white',
            polygonOpacity: 0.3
          },
          {
            textName: '',
            textSize: 18
          }
        ]
      })
    },
    toggleDraw (mode) {
      const symbol = {
        lineColor: 'red',
        lineOpacity: 1,
        lineWidth: 2,
        polygonFill: 'white',
        polygonOpacity: 0.3
      }
      window.$app.toggleDraw({
        drawend: (e) => {
          const geo = (this.geometry = e.geometry.copy())
          this.layer.clear().addGeometry(geo)
          const points = geo._coordinates.map(item => {
            return {
              x: item.x,
              y: item.y
            }
          })
          this.updateTrawlerSymbol(points, '矩形')
        },
        mode,
        once: false,
        symbol
      })
    },
    updateTrawlerSymbol (points, type) {
      const params = new FormData()
      params.append('points', JSON.stringify(points))
      params.append('areaType', type)

      this.axios.post(api.pullBoxSearch, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (!res.result) {
            this.$message.warning('该区域内暂无渔船！')
          }
          this.$emit('update', res.result || [])
        } else {
          this.$message.error(res.msg || '区域搜索失败!')
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
.map-toolbar {
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  font-family: 'SHSCNN';
  height: 80px;
  left: 20px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  position: absolute;
  top: 20px;
  width: 430px;
}
/* ITEM */
.map-toolbar-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: relative;
  width: 100px;
}
.map-toolbar-item.active {
  color: #0061d7;
}
.icon {
  font-size: 24px;
  margin-bottom: 5px;
}
.line {
  background-color: #ccc;
  height: 30px;
  left: 0;
  position: absolute;
  top: 15px;
  width: 1px;
}
/*  */
</style>
