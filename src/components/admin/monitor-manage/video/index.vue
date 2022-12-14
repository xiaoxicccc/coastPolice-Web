<template>

  <div>

    <app-dialog
      :config="dialog.config"
      ref="video-manage"
      title="视频监控管理"
      @close="back()"
      @zoom="zoom">

      <div class="video-manage">

        <app-filter
          :filter-items="items"
          :filter-model="model"
          ref="app-filter"
          @handle="handle">
        </app-filter>

        <app-table
          :columns="columns"
          :config="config"
          :controls="controls"
          :data="data"
          ref="app-table"
          style="height: calc(100% - 150px);"
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

        <input
          hidden
          id="file"
          type="file"
          @change="readFile">

      </div>

    </app-dialog>

    <app-detail
      v-if="detail.visible"
      :data="detail.data"
      :id="detail.id"
      :port-data="ports"
      :status="detail.status"
      @close="close">
    </app-detail>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  video
} from '../configs'
import appDetail from './detail'
import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'video-manage',
  components: {
    'app-detail': appDetail,
    'app-dialog': appDialog,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    const dicts = JSON.parse(localStorage.getItem('dicts'))
    return {
      columns: video.columns.slice(),
      config: {
        type: 'index',
        width: 190
      },
      controls: [
        {
          label: '查看',
          prop: 'check',
          type: 'info'
        },
        {
          label: '修改',
          prop: 'update',
          type: 'success'
        },
        {
          label: '删除',
          prop: 'delete',
          type: 'danger'
        }
      ],
      data: [],
      detail: {
        data: {},
        id: 0,
        status: 'insert',
        visible: false
      },
      dialog: {
        config: {
          height: 580,
          width: 1200
        }
      },
      filter: [ // 第二行
      ],
      items: [
        {
          label: '摄像头名称',
          prop: 'videoName',
          type: 'input'
        },
        {
          label: '摄像头类型',
          prop: 'videoType',
          type: 'select',
          options: [
            {
              label: '枪机',
              value: '枪机'
            },
            {
              label: '球机',
              value: '球机'
            },
            {
              label: '人车识别',
              value: '人车识别'
            }
          ]
        },
        {
          label: '类型',
          prop: 'duration',
          type: 'select',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '天网',
              value: '天网'
            },
            {
              label: '海防',
              value: '海防'
            },
            {
              label: '渔政',
              value: '渔政'
            },
            {
              label: '村队',
              value: '村队'
            },
            {
              label: '个人',
              value: '个人'
            },
            {
              label: '其他',
              value: '其他'
            }
          ]
        },
        {
          label: '渔港名称',
          prop: 'portName',
          type: 'autocomplete',
          options: [
          ]
        },
        {
          label: '录入单位',
          prop: 'departName',
          type: 'autocomplete',
          options: [
          ]
        },
        {
          label: '状态',
          prop: 'runStatus',
          type: 'select',
          options: [
            {
              label: '全部',
              value: ''
            }
          ].concat(dicts.run_state.slice())
        },
        {
          label: '',
          name: '查询',
          prop: 'query',
          style: 'primary-form',
          type: 'button'
        },
        {
          label: '',
          name: '导出',
          prop: 'export-data',
          style: 'primary-form',
          type: 'button'
        },
        {
          label: '',
          name: '新增',
          prop: 'insert',
          style: 'success-form',
          type: 'button'
        },
        {
          label: '',
          name: '模板下载',
          prop: 'export-template',
          style: 'primary-form',
          type: 'button'
        },
        {
          label: '',
          name: '数据导入',
          prop: 'import-template',
          style: 'success-form',
          type: 'button'
        }
      ],
      model: {
        departName: null,
        duration: '',
        id: null,
        portName: null,
        runStatus: '',
        videoName: null,
        videoType: null
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      },
      ports: []
    }
  },
  activated () {
    this.$refs['app-table'].layout()
  },
  created () {
    this.initPortData()
    this.initDepartData()
  },
  watch: {
    $route: 'initData'
  },
  mounted () {
    this.initData()
  },
  methods: {
    back () {
      this.$router.push({
        path: '/admin'
      })
    },
    close (visible, type) {
      this.$refs['video-manage'].zoom('enlarge')
      this.detail.visible = false
      if (visible) {
        if (type === 'insert') {
          this.handleCurrentChange(1)
        } else {
          this.initData()
        }
      }
    },
    deleteDetail (data) {
      this.$confirm(`您确定删除摄像头【${data.videoName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)

        this.axios.post(api.deleteVideoDetail, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('删除成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '删除失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      }).catch(() => {
      })
    },
    exportTemplate (url, download) {
      const token = localStorage.getItem('token')
      fetch(url, {
        headers: new Headers({
          Auth: token
        }),
        responseType: 'blob'
      })
        .then(res => {
          return res.blob()
        })
        .then((res) => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const href = URL.createObjectURL(blob)
          const alink = document.createElement('a')
          alink.href = href
          alink.download = `${download}.xlsx`
          alink.target = '_blank'
          alink.click()
          alink.remove()
        })
    },
    handle (type, data) {
      switch (type) {
        case 'check':
        case 'update':
          this.$refs['video-manage'].zoom('narrow')
          this.detail.visible = true
          this.detail.id = data.id
          this.detail.data = Object.assign({}, data)
          this.detail.status = type
          break
        case 'delete':
          this.deleteDetail(data)
          break
        case 'export-data': {
          this.model = Object.assign({}, data)
          const url = [
            api.exportVideoData,
            '?videoName=',
            this.model.videoName || '',
            '&layoutArea=',
            this.model.portName || '',
            '&departName=',
            this.model.departName || '',
            '&videoType=',
            this.model.videoType || '',
            '&runStatus=',
            this.model.runStatus || '',
            '&duration=',
            this.model.duration || ''
          ]
          this.exportTemplate(url.join(''), '视频监控列表EXCEL')
          break
        }
        case 'export-template':
          this.exportTemplate(api.exportVideoTemplate, '视频监控EXCEL模板')
          break
        case 'import-template': {
          const input = document.querySelector('input#file')
          if (input) {
            input.click()
          }
          break
        }
        case 'insert':
          this.$refs['video-manage'].zoom('narrow')
          this.detail.visible = true
          this.detail.id = 0
          this.detail.status = 'insert'
          this.detail.data = {}
          break
        case 'query': {
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        }
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
      this.initData()
    },
    initData () {
      const params = new FormData()
      params.append('videoName', this.model.videoName || '')
      params.append('layoutArea', this.model.portName || '')
      params.append('pageSize', this.pager.size)
      params.append('pageNum', this.pager.current)
      params.append('videoType', this.model.videoType || '')
      params.append('departName', this.model.departName || '')
      params.append('duration', this.model.duration || '')
      params.append('runStatus', this.model.runStatus || '')

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getVideoPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const dicts = JSON.parse(localStorage.getItem('dicts'))
          this.data = res.result.records.map(item => {
            const state = dicts.run_state.find(_item => _item.value === item.runStatus)
            item.status = state ? state.label : item.runStatus
            item.latitude = item.latitude - 0
            item.longitude = item.longitude - 0
            return item
          })
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
    initDepartData () {
      const params = new FormData()
      this.axios.post(api.getDepartList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const index = this.items.findIndex(item => item.prop === 'departName')
          this.items[index].options = res.result.map(item => {
            return {
              label: item.label,
              value: item.label
            }
          })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    initPortData () {
      const params = new FormData()

      this.axios.post(api.getPortList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const index = this.items.findIndex(item => item.prop === 'portName')
          this.items[index].options = this.ports = res.result.map(item => {
            return {
              label: item.name,
              value: item.name
            }
          })
        } else {
          this.$message.error(res.msg || '港口码头查询失败！')
        }
      }).catch(err => {
        console.error(err)
      })
    },
    readFile (e) {
      const file = e.target.files[0]
      const params = new FormData()
      params.append('file', file)

      this.axios.post(api.importVideoTemplate, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('导入成功！')
          this.handleCurrentChange(1)
        } else {
          this.$message.error(res.msg || '导入失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    zoom () {
      this.$nextTick(() => {
        this.$refs['app-table'].layout()
      })
    }
  }
}
</script>

<style scoped>
.video-manage {
  box-sizing: border-box;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
</style>
