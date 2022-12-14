<template>

  <div>

    <app-dialog
      :config="config"
      ref="area-analysis-dialog"
      title="重点区域"
      @close="back"
      @zoom="zoom">

      <div class="area-analysis">

        <app-filter
          :filter-items="items"
          :filter-model="model"
          @handle="handle">
        </app-filter>

        <app-table
          :columns="columns"
          :config="table.config"
          :controls="table.controls"
          :data="data"
          ref="app-table"
          style="height: calc(100% - 120px);"
          @handle="handle">
        </app-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pager.current"
          :page-sizes="pager.sizes"
          :page-size="pager.size"
          :layout="pager.layout"
          :total="pager.total"
          style="margin-top: 20px;">
        </el-pagination>

      </div>

    </app-dialog>

    <app-insert-marker
      v-if="marker.visible"
      :event="marker.event"
      :mode="marker.mode"
      :items="marker.items"
      @close="close">
    </app-insert-marker>

    <!-- 区域分析 -->
    <app-analysis-result
      v-if="analysis.visible"
      :data="analysis.data"
      :id="analysis.id"
      @close="closeResult">
    </app-analysis-result>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  key
} from '../configs'
import appAnalysisResult from './result'
import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'
import appInsertMarker from '@/components/common/insert-marker'
import appTable from '@/components/common/table'
export default {
  name: 'area-analysis',
  components: {
    'app-analysis-result': appAnalysisResult,
    'app-dialog': appDialog,
    'app-filter': appFilter,
    'app-insert-marker': appInsertMarker,
    'app-table': appTable
  },
  data () {
    return {
      analysis: {
        data: {},
        id: 0,
        visible: false
      },
      columns: key.columns.slice(),
      config: {
        height: 540,
        width: 1000
      },
      data: [],
      items: [
        {
          label: '区域名称',
          prop: 'markName',
          type: 'input'
        },
        {
          label: '标注类别',
          prop: 'areaType',
          type: 'select',
          options: [
            {
              label: '全部',
              value: ''
            },
            // {
            //   label: '椭圆',
            //   value: '椭圆'
            // },
            {
              label: '圆形',
              value: '圆形'
            },
            {
              label: '矩形',
              value: '矩形'
            },
            {
              label: '多边形',
              value: '多边形'
            }
          ]
        },
        {
          label: '',
          name: '查询',
          prop: 'query',
          type: 'button',
          style: 'primary-form'
        },
        {
          label: '',
          name: '新增',
          prop: 'insert',
          type: 'dropdown',
          options: [
            // {
            //   label: '椭圆',
            //   value: 'Ellipse'
            // },
            {
              label: '圆形',
              value: 'Circle'
            },
            {
              label: '矩形',
              value: 'Rectangle'
            },
            {
              label: '多边形',
              value: 'Polygon'
            }
          ]
        }
      ],
      layer: null,
      marker: {
        event: '',
        mode: '',
        items: [],
        visible: false
      },
      markerType: {
        '实点/符号': 'Marker',
        折线: 'LineString',
        椭圆: 'Ellipse',
        圆形: 'Circle',
        矩形: 'Polygon',
        多边形: 'Polygon'
      },
      model: {
        areaType: '',
        markName: null,
        markType: '重点区域'
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      },
      table: {
        config: {
          type: 'index',
          width: 140
        },
        controls: [
          {
            label: '定位',
            prop: 'locate',
            type: 'primary'
          },
          {
            label: '删除',
            prop: 'delete',
            type: 'danger'
          }
        ]
      }
    }
  },
  mounted () {
    this.layer = window.$app.initVectorLayer('locate', 3)
    this.initData()
  },
  destroyed () {
    this.layer.remove()
  },
  methods: {
    back () {
      this.$router.push({
        path: '/admin'
      })
    },
    close (visible) {
      this.$refs['area-analysis-dialog'].zoom('enlarge')
      this.marker.visible = false
      if (visible) {
        this.handleCurrentChange(1)
      }
    },
    closeResult () {
      this.analysis.visible = false
      this.$refs['area-analysis-dialog'].zoom('enlarge')
    },
    deleteDetail (data) {
      this.$confirm(`您确定删除重点区域【${data.markName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)

        this.axios.post(api.deleteArea, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('删除成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '删除成功！')
          }
        }).catch(err => {
          console.error(err)
          this.$message.error('系统问题，请联系管理员！')
        })
      }).catch(() => {
      })
    },
    handle (type, data) {
      switch (type) {
        case 'command': // 开始绘制
          this.insertMarker(data)
          break
        case 'delete':
          this.deleteDetail(data)
          break
        case 'locate':
          this.locate(data)
          break
        case 'query':
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        default:
          break
      }
    },
    handleCurrentChange (e) {
      this.pager.current = e
      this.initData()
    },
    handleSizeChange (e) {
      this.pager.size = e
      this.handleCurrentChange(1)
    },
    initData () {
      const params = new FormData()
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getKeyAreaPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = res.result.records || []
          this.data = data.slice()
          this.pager.total = res.result.total
        } else {
          this.pager.total = 0
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.$refs['app-table'].empty = !this.pager.total ? '暂无数据' : ''
      })
    },
    insertMarker (data) {
      this.marker.mode = data
      this.marker.visible = true
      this.$refs['area-analysis-dialog'].zoom('narrow')
      switch (data) {
        case 'Circle':
          this.marker.event = 'select-circle'
          this.marker.items = [
            {
              label: '圆心',
              prop: 'center',
              show: true
            },
            {
              label: '半径(米)',
              prop: 'radius',
              show: true
            }
          ]
          break
        case 'Ellipse':
          this.marker.event = 'select-ellipse'
          this.marker.items = [
            {
              label: '圆心',
              prop: 'center',
              show: true
            },
            {
              label: '长轴(米)',
              prop: 'width',
              show: true
            },
            {
              label: '短轴(米)',
              prop: 'height',
              show: true
            }
          ]
          break
        case 'Polygon':
          this.marker.event = 'select-polygon'
          this.marker.items = [
            {
              label: '坐标点',
              prop: 'position',
              rows: 5,
              type: 'textarea',
              show: false
            }
          ]
          break
        case 'Rectangle':
          this.marker.event = 'select-rectangle'
          this.marker.items = [
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
          break
        default:
          break
      }
    },
    locate (data) {
      // 开启区域分析
      this.analysis.visible = true
      this.analysis.data = Object.assign({}, data)
      this.analysis.id = data.id
      this.$refs['area-analysis-dialog'].zoom('narrow')
      const symbol = [
        {
          lineColor: data.lineColor,
          lineWidth: data.lineWidth - 0,
          polygonFill: data.field1 === 'true' ? data.fillColor : '',
          polygonOpacity: data.diaphaneity - 0
        },
        {
          textName: data.nameDisplayState === 'true' ? data.markName : '',
          textSize: 14,
          textDx: 0,
          textDy: 0,
          textHaloFill: '#FFF',
          textHaloRadius: 5
        }
      ]
      if (data.areaType === '实点/符号') {
        symbol[0] = {
          markerType: 'ellipse',
          markerFill: data.fillColor,
          markerFillOpacity: data.field1 === 'true' ? data.diaphaneity - 0 : 0,
          markerLineColor: data.lineColor,
          markerLineWidth: data.lineWidth - 0,
          markerWidth: 5,
          markerHeight: 5
        }
        symbol[1].textDy = 15
      }
      const info = JSON.parse(data.positionInfo)
      const params = []
      if (data.areaType === '圆形' || data.areaType === '椭圆') {
        params.push(...info)
      } else {
        params.push(info)
      }

      params.push({ symbol })
      this.geometry = window.$app.initGeometry({
        className: this.markerType[data.areaType],
        params
      })
      this.layer.clear().addGeometry(this.geometry)
      window.$app.locate(this.geometry)
    },
    zoom () {
      this.layer.clear()
      this.$nextTick(() => {
        this.$refs['app-table'].layout()
      })
    }
  }
}
</script>

<style scoped>
.area-analysis {
  box-sizing: border-box;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
</style>
