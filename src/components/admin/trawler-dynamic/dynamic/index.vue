<template>

  <div>

    <app-dialog
      :config="config"
      title="渔船动态明细"
      ref="app-dialog"
      @close="close"
      @zoom="zoom">

      <div class="trawler-dynamic">

        <el-form
          class="trawler-dynamic-form form"
          :model="model"
          size="small">

          <el-form-item
            v-for="(item, i) in items"
            class="trawler-dynamic-item"
            :key="i"
            :label="item.label">

            <el-select
              v-model="model[item.prop]"
              @change="changeItem">

              <el-option
                v-for="(opt, index) in item.options"
                :key="index"
                :label="opt.label"
                :value="opt.value">
              </el-option>

            </el-select>

          </el-form-item>

          <el-form-item
            class="trawler-dynamic-item">

            <el-input
              v-if="filter.type === 'input'"
              v-model="model.keyWord"
              type="text">
            </el-input>

            <el-select
              v-if="filter.type === 'select'"
              v-model="model.keyWord">

              <el-option
                v-for="(item, i) in filter.options"
                :key="i"
                :label="item.label"
                :value="item.value">
              </el-option>

            </el-select>

          </el-form-item>

          <el-form-item
            class="trawler-dynamic-item">

            <span
              class="button"
              role="primary-form"
              @click="handle('query')">查询
            </span>

          </el-form-item>

        </el-form>

        <app-table
          :columns="table.columns"
          :config="table.config"
          :controls="table.controls"
          :data="table.data"
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

      </div>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import appDialog from '@/components/common/dialog'
import appTable from '@/components/common/table'
export default {
  name: 'trawler-dynamic',
  components: {
    'app-dialog': appDialog,
    'app-table': appTable
  },
  data () {
    const dicts = JSON.parse(localStorage.getItem('dicts'))
    return {
      config: {
        height: 540,
        width: 1160
      },
      filter: {
        items: {
          mmsi: {
            type: 'input'
          },
          terminalStatus: {
            type: 'select',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '在线',
                value: 'online'
              },
              {
                label: '离线',
                value: 'offline'
              }
            ]
          },
          shipName: {
            type: 'input'
          },
          shipType: {
            type: 'select',
            options: [{
              label: '全部',
              value: ''
            }].concat(dicts.boat_type.map(item => {
              return {
                label: item.label,
                value: item.label
              }
            }))
          },
          terminalType: {
            type: 'select',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '北斗',
                value: 'Beidou'
              },
              {
                label: 'AIS',
                value: 'AIS'
              },
              {
                label: '雷达-AIS',
                value: 'Radar-AIS'
              },
              {
                label: '雷达',
                value: 'Radar'
              }
            ]
            // options: [{
            //   label: '全部',
            //   value: ''
            // }].concat(dicts.drive_type.map(item => {
            //   return {
            //     label: item.label,
            //     value: item.label
            //   }
            // }))
          }
        },
        options: [],
        type: 'input'
      },
      items: [
        {
          label: '查询条件',
          prop: 'keyType',
          type: 'select',
          options: [
            {
              label: '船名号',
              value: 'shipName'
            },
            {
              label: 'MMSI/北斗号',
              value: 'mmsi'
            },
            {
              label: '终端类型',
              value: 'terminalType'
            },
            {
              label: '船舶类型',
              value: 'shipType'
            },
            {
              label: '设备状态',
              value: 'terminalStatus'
            }
          ]
        }
      ],
      model: {
        keyType: 'shipName',
        keyWord: ''
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      },
      table: {
        columns: [
          {
            label: '船名号',
            prop: 'boatName',
            width: 150
          },
          {
            label: '船舶类型',
            prop: 'typeName',
            width: 80
          },
          {
            label: '终端类型',
            prop: 'msgType',
            width: 80
          },
          {
            label: '终端号',
            prop: 'mmsi',
            width: 120
          },
          {
            label: '定位经度',
            prop: 'longitude'
          },
          {
            label: '定位纬度',
            prop: 'latitude'
          },
          {
            label: '最后定位时间',
            prop: 'gpsTime',
            width: 140
          },
          {
            label: '功率(kw)',
            prop: 'power'
          }
        ],
        config: {
          type: 'index',
          width: 50
        },
        controls: [
          {
            label: '定位',
            prop: 'locate',
            type: 'info'
          }
        ],
        data: [
        ]
      }
    }
  },
  activated () {
    this.$refs['app-table'].layout()
  },
  mounted () {
    this.initData()
  },
  destroyed () {
  },
  methods: {
    close () {
      const name = 'vector_locate'
      const layer = window.$app.layers[name]
      if (layer) {
        layer.clear()
      }
      this.$router.push({
        path: '/admin'
      })
    },
    changeItem (e) {
      this.filter.type = this.filter.items[e].type
      this.filter.options = this.filter.items[e].options || []
      this.model.keyWord = ''
    },
    handle (type, data) {
      switch (type) {
        case 'locate':
          this.locateTrawler(data)
          break
        case 'query':
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
      params.append('keyType', this.model.keyType)
      params.append('keyWord', this.model.keyWord || '')
      params.append('pageNo', this.pager.current)
      params.append('pageSize', this.pager.size)

      this.table.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getTrawlerDynamicPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const terminal = {
            AIS: 'AIS',
            Beidou: '北斗',
            'Radar-AIS': '雷达-AIS',
            Radar: '雷达'
          }
          this.table.data = res.result.records.map(item => {
            item.gpsTime = item.gpsTime ? item.gpsTime.replace(/T/, ' ').replace(/\..*/, '') : ''
            item.msgType = terminal[item.msgType]
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
    locateTrawler (data) {
      this.$refs['app-dialog'].zoom('narrow')
      // 重定向数据
      const now = new Date()
      const gap = 1000 * 60 * 60 * 2
      const gpsDate = new Date(data.gpsTime) // 时区校正
      const info = {
        angle: data.cog ? data.cog - 0 : 0,
        departName: data.departName, // 海岸管理单位
        equipment: data.msgType, // 在线设备类型
        gpsdwsj: data.gpsTime,
        homePort: data.homePortName,
        id: data.id,
        latitude: data.latitude - 0,
        location: true,
        longitude: data.longitude - 0,
        mmsi: data.mmsi,
        online: now - gpsDate < gap,
        owner: data.boatOwner,
        phone: data.ownerPhone,
        shipName: data.boatName,
        shipType: data.typeName,
        speed: data.sog,
        type: data.msgType // 设备类型
      }
      window.$app.locate(data.longitude, data.latitude, info)
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
.trawler-dynamic {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.trawler-dynamic-form {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.trawler-dynamic-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-right: 10px;
}
</style>
