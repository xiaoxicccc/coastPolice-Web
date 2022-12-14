<template>

  <div class="marine-elements">

    <el-form
      class="form marine-elements-form"
      :model="model">
      <el-form-item
        v-for="(item, i) in items"
        class="marine-elements-item"
        :key="i"
        :label="item.label">
        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          size="small"
          clearable
          filterable>
          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value"
            >
          </el-option>
        </el-select>
        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          size="small">
        </el-input>
        <span
          v-if="item.type === 'button'"
          class="button"
          :role="item.style"
          @click="handle(item.prop, null)">{{ item.name }}
        </span>
      </el-form-item>
    </el-form>

    <app-table
      :columns="columns"
      :config="config"
      :controls="controls"
      :data="data"
      :imgUrl = "url"
      ref="appTable"
      @handle="handle"
      style="height: calc(100% - 120px);">
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

    <app-dialog
      v-if="dialog.visible"
      :config="dialog.config"
      :title="dialog.title"
      @close="close">

      <app-detail
        v-if="dialog.visible"
        :id="dialog.id"
        :type="dialog.type"
        :detail="dialog.detail"
        :status="dialog.status"
        @close="close">
      </app-detail>

    </app-dialog>
    <el-drawer
      append-to-body
      :direction="drawer.direction"
      :visible.sync="drawer.visible"
      :with-header="false"
      size="800px">
      <app-detail
        v-if="drawer.visible"
        :detail="drawer.detail"
        :id="drawer.id"
        :type="drawer.type"
        :status ="drawer.status"
        @close="close">
      </app-detail>
    </el-drawer>
  </div>

</template>

<script>
import api from '@/util/api'
import {
  seaElement
} from '../configs'
import appDetail from './detail'
import appTable from '@/components/common/table'
import appDialog from '@/components/common/dialog'
export default {
  name: 'marine-elements',
  components: {
    'app-detail': appDetail,
    'app-table': appTable,
    'app-dialog': appDialog
  },
  data () {
    return {
      columns: seaElement.columns.slice(),
      config: {
        type: 'index',
        width: 200
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
          type: 'warning'
        },
        {
          label: '删除',
          prop: 'delete',
          type: 'danger'
        }
      ],
      data: [],
      dialog: {
        config: {
          height: 700,
          width: 1000
        },
        detail: {},
        id: '',
        type: '',
        imgVisible: false,
        status: '',
        title: '新增要素',
        visible: false
      },
      drawer: {
        detail: {},
        direction: 'rtl',
        id: '',
        status: '',
        type: '',
        visible: false
      },
      items: seaElement.items.slice(),
      model: {
        elementName: null,
        elementType: null,
        policeStation: null
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      },
      policeList: [],
      url: ''
    }
  },
  mounted () {
    this.initData()
    this.getSelectedList()
  },
  methods: {
    close (visible) {
      this.dialog.visible = false
      this.dialog.imgVisible = false
      this.drawer.visible = false
      if (visible) {
        this.initData()
      }
    },
    deleteRow (data) {
      this.$confirm(`您确定删除【${data.elementName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)
        this.axios.post(api.deleteSeaElement, params, { loading: true }).then(response => {
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
          this.dialog.id = String(data.id)
          this.dialog.type = data.elementType
          this.dialog.detail = Object.assign({}, data)
          this.dialog.status = 'check'
          this.dialog.title = '查看要素'
          this.dialog.visible = true
          break
        case 'query':
          this.handleCurrentChange(1)
          break
        case 'delete':
          this.deleteRow(data)
          break
        case 'export-data': {
          const url = [
            api.exportSeaElement,
            '?elementName=',
            this.model.elementName || '',
            '&elementType=',
            this.model.elementType || '',
            '&policeStation=',
            this.model.policeStation || ''
          ]
          this.exportTemplate(url.join(''), '涉海要素信息表')
          break
        }
        case 'insert':
          this.dialog.visible = true
          this.dialog.id = ''
          this.dialog.detail = {}
          this.dialog.status = 'insert'
          this.dialog.title = '新增要素'
          break
        case 'update':
          this.dialog.visible = true
          this.dialog.id = String(data.id)
          this.dialog.type = data.elementType
          this.dialog.status = 'update'
          this.dialog.detail = Object.assign({}, data)
          this.dialog.title = '修改要素'
          break
        default:
          break
      }
    },
    getSelectedList () {
      this.axios.post(api.getSelectedList).then(response => {
        const res = response.data
        if (res.code === '200') {
          seaElement.items[2].options = res.result
          seaElement.operation[2].options = res.result
        } else {
          this.$message.error(res.msg || '查询失败！')
        }
      })
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
      params.append('pageIndex', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('elementName', this.model.elementName || '')
      params.append('elementType', this.model.elementType || '')
      params.append('policeStation', this.model.policeStation || '')
      this.data = []
      if (this.model.elementType) {
        const arr = seaElement.columns.slice()
        const filterArr = arr.filter((item) => {
          if (item.filter.indexOf('all') !== -1) {
            return item
          } else {
            return item.filter.includes(this.model.elementType)
          }
        })
        this.columns = filterArr
      } else {
        this.columns = seaElement.columns
      }
      // 数据加载中
      this.$refs.appTable.empty = '数据加载中...'
      this.axios.post(api.getSeaElementPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.slice()
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
        this.$nextTick(() => {
          this.$refs.appTable.layout()
          this.$refs.appTable.empty = !this.pager.total ? '暂无数据' : ''
        })
      })
    }
  }
}
</script>

<style scoped>
.marine-elements {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
/* FORM */
.marine-elements-form {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.marine-elements-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  margin-right: 20px;
}
</style>
