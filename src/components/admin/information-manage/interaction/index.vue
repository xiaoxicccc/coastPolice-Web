<template>

  <div class="interaction">

    <el-form
      class="form interaction-form"
      :model="model">
      <el-form-item
        v-for="(item, i) in items"
        class="interaction-item"
        :key="i"
        :label="item.label">
        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          size="small">
        </el-input>
        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          size="small">
          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>
        </el-select>
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
      @handle="handle"
      ref="appTable"
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
    <el-drawer
      append-to-body
      :direction="drawer.direction"
      :visible.sync="drawer.visible"
      :with-header="false"
      size="700px">
      <app-detail
        v-if="drawer.visible"
        :detail="drawer.detail"
        :id="drawer.id"
        :type="drawer.type"
        :status ="drawer.status"
        @close="close">
      </app-detail>
    </el-drawer>
<!--    <el-drawer
      v-if="dialog.visible"
      :config="dialog.config"
      :title="dialog.title"
      @close="close">

      <app-detail
        v-if="dialog.visible"
        :id="dialog.id"
        :detail="dialog.detail"
        :status="dialog.status"
        @close="close">
      </app-detail>

    </el-drawer>
 -->
  </div>

</template>

<script>
import api from '@/util/api'
import {
  interaction
} from '../configs'
import appDetail from './detail'
// import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
// import appDialog from '@/components/common/dialog'
export default {
  name: 'interaction',
  components: {
    'app-detail': appDetail,
    // 'app-filter': appFilter,
    'app-table': appTable
    // 'app-dialog': appDialog
  },
  data () {
    return {
      columns: interaction.columns.slice(),
      config: {
        type: 'index',
        width: 200
      },
      controls: [
        {
          label: '查看',
          prop: 'check',
          type: 'warning'
        },
        {
          label: '删除',
          prop: 'delete',
          type: 'danger'
        }
      ],
      data: [],
      drawer: {
        detail: {},
        direction: 'rtl',
        id: '',
        status: '',
        type: '',
        visible: false
      },
      items: interaction.items.slice(),
      model: {
        type: ''
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close (visible) {
      this.drawer.visible = false
    },
    deleteRow (data) {
      this.$confirm('您确定删除该问题吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('ids', data.id)
        this.axios.post(api.communicateDelete, params, { loading: true }).then(response => {
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
        case 'query':
          this.handleCurrentChange(1)
          break
        case 'delete':
          this.deleteRow(data)
          break
        case 'check':
          this.drawer.id = String(data.id)
          this.drawer.detail = Object.assign({}, data)
          this.drawer.status = 'check'
          this.drawer.title = '问题详情'
          this.drawer.visible = true
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
      this.initData()
    },
    initData () {
      const params = new FormData()
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('type', this.model.type || '')
      params.append('description', this.model.description || '')
      // params.append('policeStation', this.model.policeStation || '')
      this.data = []
      // 数据加载中
      this.$refs.appTable.empty = '数据加载中...'
      this.axios.post(api.getCommunicateList, params).then(response => {
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
        this.$refs.appTable.empty = !this.pager.total ? '暂无数据' : ''
      })
    }
  }
}
</script>

<style scoped>
.interaction {
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
.interaction-form {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.interaction-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  margin-right: 20px;
}
</style>
