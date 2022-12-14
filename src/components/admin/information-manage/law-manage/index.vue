<template>

  <div class="law-manage">

    <el-tabs
      v-model="tabs.active"
      @tab-click="handleClick">

      <el-tab-pane
        v-for="(item, index) in tabs.list"
        :key="index"
        :label="item.label"
        :name="item.prop">
      </el-tab-pane>

    </el-tabs>

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <app-table
      :columns="columns"
      :config="config"
      :controls="controls"
      :data="data"
      ref="app-table"
      @handle="handle"
      style="height: calc(100% - 160px);">
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
      :visible="drawer.visible"
      :with-header="false"
      size="700px">

      <app-detail
        v-if="drawer.visible"
        :detail="drawer.detail"
        :id="drawer.id"
        :status="drawer.status"
        :type="tabs.active"
        @close="close">
      </app-detail>

    </el-drawer>

  </div>

</template>

<script>
import api from '@/util/api'
import appDetail from './detail'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'law-manage',
  components: {
    'app-detail': appDetail,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      columns: [
      ],
      columnsMap: {
        administration: [
          {
            label: '案件名称',
            prop: 'name',
            width: 280
          },
          {
            label: '查获日期',
            prop: 'getTime',
            width: 140
          },
          {
            label: '处结日期',
            prop: 'dealTime',
            width: 140
          },
          {
            label: '办案单位',
            prop: 'dealUnit',
            width: 180
          },
          {
            label: '处罚人数',
            prop: 'dealedNum',
            width: 120
          },
          {
            label: '处罚情况',
            prop: 'dealInfo',
            width: 280
          }
        ],
        criminal: [
          {
            label: '案件名称',
            prop: 'name',
            width: 280
          },
          {
            label: '查获日期',
            prop: 'getTime',
            width: 140
          },
          {
            label: '处结日期',
            prop: 'dealTime',
            width: 140
          },
          {
            label: '办案单位',
            prop: 'dealUnit',
            width: 180
          },
          {
            label: '打击处理人数',
            prop: 'dealedNum',
            width: 120
          },
          {
            label: '打击处理情况',
            prop: 'dealInfo',
            width: 280
          },
          {
            label: '涉案价值',
            prop: 'involved'
          }
        ]
      },
      config: {
        type: 'index',
        width: 220
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
      drawer: {
        detail: {},
        direction: 'rtl',
        id: 0,
        status: 'insert',
        visible: false
      },
      items: [
        {
          label: '案件名称',
          prop: 'name',
          type: 'input'
        },
        {
          label: '办案单位',
          prop: 'dealUnit',
          type: 'input'
        },
        {
          label: '查获日期',
          prop: 'getTime',
          type: 'daterange'
        },
        {
          label: '处结日期',
          prop: 'dealTime',
          type: 'daterange'
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
        dealTime: ['', ''],
        dealUnit: null,
        name: null,
        getTime: ['', '']
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      },
      tabs: {
        active: 'administration',
        list: [
          {
            label: '行政案件',
            prop: 'administration'
          },
          {
            label: '刑事案件',
            prop: 'criminal'
          }
        ]
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close (status) {
      this.drawer.visible = false
      if (status === 'insert') {
        this.handleCurrentChange(1)
      } else if (status === 'update') {
        this.initData()
      }
    },
    deleteRow (e) {
      this.$confirm(`您确定删除案件【${e.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('ids', e.id)

        this.axios.post(api.deleteLawDetail, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('删除成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '删除失败!')
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
        case 'check':
        case 'insert':
        case 'update': {
          this.drawer.detail = data ? Object.assign({}, data) : {}
          this.drawer.id = data ? data.id : 0
          this.drawer.visible = true
          this.drawer.status = type
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
    handleClick () {
      this.columns = this.columnsMap[this.tabs.active].slice()
      this.handleCurrentChange(1)
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
      // 列表列切换
      this.columns = this.columnsMap[this.tabs.active].slice()
      const params = new FormData()
      const dealTime = this.model.dealTime ? this.model.dealTime : ['', '']
      const getTime = this.model.getTime ? this.model.getTime : ['', '']

      params.append('dealTimeStart', dealTime[0])
      params.append('dealTimeEnd', dealTime[1])
      params.append('getTimeStart', getTime[0])
      params.append('getTimeEnd', getTime[1])
      params.append('pageSize', this.pager.size)
      params.append('pageNum', this.pager.current)
      params.append('name', this.model.name || '')
      params.append('dealUnit', this.model.dealUnit || '')
      // 切换类型
      params.append('type', this.tabs.active === 'administration' ? 1 : 2)

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getLawMangePage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records
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
        this.$refs['app-table'].layout()
      })
    }
  }
}
</script>

<style scoped>
.law-manage {
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
