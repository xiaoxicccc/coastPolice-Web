<template>

  <div class="phone-fence-control">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <app-table
      :columns="columns"
      :config="config"
      :controls="control"
      :data="data"
      ref="app-table"
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

      <div class="dialog-form-wrapper">

        <el-form
          class="dialog-form"
          :model="dialog.model"
          ref="dialog-form"
          :rules="dialog.rules"
          size="small">

          <el-form-item
            class="dialog-item"
            label="imsi:"
            prop="imsi">

            <el-input
              v-model="dialog.model.imsi"
              :readonly="dialog.readonly"
              type="text">
            </el-input>

          </el-form-item>

        </el-form>

        <div>

          <el-button
            v-if="!dialog.readonly"
            type="primary"
            size="small"
            @click="validate">提交
          </el-button>

        </div>

      </div>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'phone-fence-control',
  components: {
    'app-dialog': appDialog,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: [
        {
          label: 'imsi',
          prop: 'imsi'
        }
      ],
      config: {
        type: 'index',
        width: 250
      },
      control: [
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
      data: [
        {
          id: 1,
          imsi: '130283294r67238'
        }
      ],
      dialog: {
        config: {
          height: 250,
          width: 300
        },
        model: {
          id: 0,
          imsi: null
        },
        readonly: false,
        rules: {
          imsi: [
            { required: true, message: 'imsi 未填写', trigger: 'blur' }
          ]
        },
        title: null,
        visible: false
      },
      items: [
        {
          label: 'imsi',
          prop: 'imsi',
          type: 'input'
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
          name: '新增',
          prop: 'insert',
          style: 'primary-form',
          type: 'button'
        }
      ],
      model: {
        imsi: null
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
    close () {
      this.dialog.visible = false
    },
    deleteRow (e) {
      this.$confirm(`您确定删除imsi【${e.imsi}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('ids', e.id)

        this.axios.post(api.deleteImsi, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('操作成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '操作失败！')
          }
        }).catch(err => {
          console.error(err)
          this.$message.error('系统问题，请联系管理员！')
        })
      }).catch(() => {
      })
    },
    handleCurrentChange (e) {
      this.pager.current = e
      this.initData()
    },
    handleSizeChange (e) {
      this.pager.size = e
      this.handleCurrentChange(1)
    },
    handle (type, data) {
      const titleMap = {
        check: '查看',
        insert: '新增',
        update: '修改'
      }
      switch (type) {
        case 'check':
        case 'insert':
        case 'update': {
          this.dialog.visible = true
          this.dialog.title = `手机电子围栏布控${titleMap[type]}`
          this.dialog.readonly = type === 'check'
          this.dialog.model = Object.assign({}, data)
          break
        }
        case 'delete': {
          this.deleteRow(data)
          break
        }
        case 'query': {
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        }
        default: {
          break
        }
      }
    },
    initData () {
      const params = new FormData()
      params.append('pageSize', this.pager.size)
      params.append('pageNum', this.pager.current)
      params.append('imsi', this.model.imsi || '')

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getImsiPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records
          this.pager.total = res.result.total
          this.close()
        } else {
          this.$message.error(res.msg || '查询失败！')
          this.pager.total = 0
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
        this.pager.total = 0
      }).finally(() => {
        this.$refs['app-table'].empty = !this.pager.total ? '暂无数据' : ''
      })
    },
    submit () {
      const params = new FormData()
      let url = ''
      if (this.dialog.model.id) {
        params.append('id', this.dialog.model.id)
        url = api.updateImsi
      } else {
        url = api.insertImsi
      }
      params.append('imsi', this.dialog.model.imsi)

      this.axios.post(url, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
          if (this.dialog.model.id) {
            this.initData()
          } else {
            this.handleCurrentChange(1)
          }
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
      })
    },
    validate () {
      this.$refs['dialog-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.phone-fence-control {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
/* DIALOG */
.dialog-form-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding-top: 15px;
}
.dialog-form {
  display: flex;
  flex-direction: column;
}
.dialog-item {
  align-items: center;
  display: flex;
  flex-direction: row;
}
</style>
