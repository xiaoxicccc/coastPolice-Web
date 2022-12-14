<template>

  <div>

    <app-dialog
      :config="config"
      ref="app-dialog"
      title="港口档案"
      @close="back()"
      @zoom="zoom">

      <div class="port-archives">

        <app-filter
          :filter-items="items"
          :filter-model="model"
          @handle="handle">
        </app-filter>

        <!--<app-table
          :columns="table.columns"
          :config="table.config"
          :controls="table.controls"
          :data="table.data"
          ref="app-table"
          @handle="handle"
          style="height: calc(100% - 160px);">
        </app-table>-->

        <div
          style="height: calc(100% - 160px);">

          <el-table
            :data="table.data"
            :empty-text="empty"
            height="100%"
            ref="app-table"
            size="small"
            stripe>

            <el-table-column
              label="#"
              type="index"
              :width="55">
            </el-table-column>

            <el-table-column
              v-for="(item, i) in table.columns"
              :key="i"
              align="left"
              :label="item.label"
              :prop="item.prop"
              show-overflow-tooltip
              :min-width="item.width">

              <template slot-scope="props">

                <span
                  v-if="item.key"
                  :class="[props.row.color, 'level']">{{ props.row[item.prop] }}
                </span>

                <span v-else>{{ props.row[item.prop] }}
                </span>

              </template>

            </el-table-column>

            <el-table-column
              align="left"
              fixed="right"
              label="操作"
              :width="190">

              <template slot-scope="props">

                <template
                  v-for="(item, i) in table.controls">

                  <span
                    v-if="!item.power || (item.power && item.value === props.row[item.keyname])"
                    class="button"
                    :role="item.type"
                    :key="i"
                    @click="handle(item.prop, props.row)">{{ item.label }}
                  </span>

                </template>

              </template>

            </el-table-column>

          </el-table>

        </div>

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

    <app-detail
      v-if="detail.visible"
      :data="detail.data"
      :id="detail.id"
      :status="detail.status"
      :title="detail.title"
      @close="close">
    </app-detail>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  archives
} from '../configs'
import appDetail from './detail'
import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'
// import appTable from '@/components/common/table'
export default {
  name: 'port-archives',
  components: {
    'app-detail': appDetail,
    'app-dialog': appDialog,
    'app-filter': appFilter
    // 'app-table': appTable
  },
  data () {
    return {
      config: {
        height: 580,
        width: 1140
      },
      detail: {
        data: {},
        id: -1,
        status: '',
        title: '港口档案详情',
        visible: false
      },
      empty: '',
      items: [
        {
          label: '港口名称',
          prop: 'name',
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
          label: '风险等级',
          prop: 'riskGrade',
          type: 'select',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '蓝',
              value: '蓝'
            },
            {
              label: '黄',
              value: '黄'
            },
            {
              label: '橙',
              value: '橙'
            },
            {
              label: '红',
              value: '红'
            }
          ]
        },
        {
          label: '港口类型',
          prop: 'typeName',
          type: 'input'
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
        departName: null,
        name: null,
        riskGrade: '',
        typeName: null
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      },
      table: {
        columns: archives.columns.slice(),
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
            type: 'warning'
          },
          {
            label: '定位',
            prop: 'locate',
            type: 'primary'
          }
        ],
        data: []
      }
    }
  },
  activated () {
    // 每次缓存打开重置表格
    this.$refs['app-table'].doLayout()
  },
  mounted () {
    this.initDepartData()
    this.initData()
  },
  destroyed () {
    if (window.$app.vector.location) {
      window.$app.vector.location.clear()
    }
  },
  methods: {
    back () {
      this.$router.push({
        path: '/admin'
      })
    },
    close (visible) {
      this.detail.visible = false
      this.$refs['app-dialog'].zoom('enlarge')
      if (visible) {
        this.initData()
      }
    },
    handle (type, data) {
      switch (type) {
        case 'check':
        case 'update':
          this.$refs['app-dialog'].zoom('narrow')
          this.detail.visible = true
          this.detail.data = Object.assign({}, data)
          this.detail.id = data.id
          this.detail.status = type
          this.detail.title = type === 'check' ? '港口档案详情' : '港口档案修改'
          break
        case 'locate':
          if (data.longitude && data.latitude) {
            this.$refs['app-dialog'].zoom('narrow')
            window.$app.locatePort(data)
          } else {
            this.$message.warning('暂无定位信息！')
          }
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
      // params.append('name', this.model.name || '')
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })

      this.table.data = []
      // 数据加载中
      this.empty = '数据加载中...'
      this.axios.post(api.getPortArchivesPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          // const colorMap = {
          //   蓝: '#6495ED',
          //   黄: '#FFFF00',
          //   橙: '#FFA500',
          //   红: '#FF6347'
          // }
          const colorMap = {
            蓝: 'blue',
            黄: 'yellow',
            橙: 'orange',
            红: 'red'
          }
          this.table.data = res.result.records.map(item => {
            item.color = item.riskGrade ? colorMap[item.riskGrade] : ''
            return item
          })
          this.pager.total = res.result.total
        } else {
          this.$message.error(res.msg || '查询失败！')
          this.pager.total = 0
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.empty = !this.pager.total ? '暂无数据' : ''
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
    zoom () {
      this.$nextTick(() => {
        this.$refs['app-table'].doLayout()
      })
    }
  }
}
</script>

<style scoped>
.port-archives {
  box-sizing: border-box;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
/* 色块 */
.level {
  color: white;
  display: inline-block;
  height: 100%;
  text-align: center;
  width: 100%;
}
.level.blue {
  background-color: #6495ED;
}
.level.yellow {
  color: black;
  background-color: #FFFF00;
}
.level.orange {
  background-color: #FFA500;
}
.level.red {
  background-color: #FF6347;
}
</style>
