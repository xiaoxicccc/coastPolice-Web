<template>

  <div class="owner-manage">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <app-table
      :columns="columns"
      :controls="controls"
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

    <el-drawer
      append-to-body
      :direction="drawer.direction"
      :visible.sync="drawer.visible"
      :with-header="false"
      size="1000px">

      <app-detail
        v-if="drawer.visible"
        :data="drawer.detail"
        @close="close">
      </app-detail>

    </el-drawer>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  owner
} from '../configs'
import appDetail from './detail'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'owner-manage',
  components: {
    'app-detail': appDetail,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: owner.columns.slice(),
      controls: [
        {
          label: '查看',
          prop: 'check',
          type: 'info'
        }
      ],
      data: [],
      drawer: {
        detail: {},
        direction: 'rtl',
        visible: false
      },
      items: [
        {
          label: '姓名',
          prop: 'name',
          type: 'input'
        },
        {
          label: '联系方式',
          prop: 'phone',
          type: 'input'
        },
        {
          label: '身份证号',
          prop: 'idCardNo',
          type: 'input'
        },
        {
          label: '单位名称',
          prop: 'departName',
          type: 'autocomplete',
          options: [
          ]
        },
        {
          label: '',
          name: '查询',
          prop: 'query',
          style: 'primary-form',
          type: 'button'
        }
      ],
      model: {
        boatName: null,
        name: null
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
    this.initDepartData()
    this.initData()
  },
  methods: {
    close () {
      this.drawer.visible = false
    },
    handle (type, data) {
      switch (type) {
        case 'check':
          this.drawer.visible = true
          this.drawer.detail = Object.assign({}, data)
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

      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.data = []
      this.axios.post(api.getBoatOwnerPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (res.result.records) {
            this.data = res.result.records.map(item => {
              item.isToseaEscape = item.isTosea ? '是' : '否'
              return item
            })
          }
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
    }
  }
}
</script>

<style scoped>
.owner-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
</style>
