<template>

  <div class="trawler-archives">

    <el-form
      class="form trawler-archives-form"
      :model="model">

      <el-form-item
        v-for="(item, i) in items"
        class="trawler-archives-item"
        :key="i"
        :label="item.label">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          size="small"
          style="width: 200px;">
        </el-input>

        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          size="small"
          style="width: 200px;">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

        <el-autocomplete
          v-if="item.type === 'autocomplete'"
          v-model="model[item.prop]"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          size="small"
          @focus="querySearch(item.options, item.prop)"
          @input="querySearch(item.options, item.prop)">
        </el-autocomplete>

        <span
          v-if="item.type === 'button'"
          class="button"
          :role="item.style"
          @click="handle(item.prop, null)">{{ item.name }}
        </span>

      </el-form-item>

    </el-form>

    <app-table
      :config="config"
      :columns="columns"
      :controls="controls"
      :data="data"
      ref="app-table"
      @handle="handle"
      style="height: calc(100% - 200px);">
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
      size="1000px"
      :visible.sync="drawer.visible"
      :withHeader="false">

      <app-detail
        v-if="drawer.visible"
        :data="drawer.data"
        :id="drawer.id"
        :status="drawer.status"
        @close="close">
      </app-detail>

    </el-drawer>

    <app-disturb
      v-if="disturb.visible"
      :end-time="disturb.endTime"
      :id="disturb.id"
      :name="disturb.name"
      :start-time="disturb.startTime"
      @close="closeDisturb">
    </app-disturb>

    <app-trawler-crew
      v-if="crew.visible"
      :trawler-name="crew.shipName"
      @close="closeCrew">
    </app-trawler-crew>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  archives
} from '../configs'

import appDetail from './detail'
import appDisturb from './disturb'
import appTable from '@/components/common/table'
import appTrawlerCrew from './crew'

export default {
  name: 'trawler-archives',
  components: {
    'app-detail': appDetail,
    'app-disturb': appDisturb,
    'app-table': appTable,
    'app-trawler-crew': appTrawlerCrew
  },
  data () {
    return {
      columns: archives.columns.slice(),
      config: {
        type: 'index',
        width: 260
      },
      controls: [
        {
          label: '查看',
          prop: 'check',
          type: 'info'
        },
        // {
        //   label: '船上人员',
        //   prop: 'crew',
        //   type: 'primary'
        // },
        {
          label: '设置免打扰',
          prop: 'disturb',
          type: 'success'
        },
        {
          keyname: 'isHighlight',
          label: '标记高亮',
          power: true,
          prop: 'light',
          type: 'primary',
          value: false
        },
        {
          keyname: 'isHighlight',
          label: '取消高亮',
          power: true,
          prop: 'cancel-light',
          type: 'warning',
          value: true
        }
        // {
        //   keyname: 'isMain',
        //   label: '添加重点关注',
        //   power: true,
        //   prop: 'focus',
        //   type: 'primary',
        //   value: false
        // },
        // {
        //   keyname: 'isMain',
        //   label: '取消重点关注',
        //   power: true,
        //   prop: 'focus-cancel',
        //   type: 'warning',
        //   value: true
        // }
        // {
        //   label: '修改',
        //   prop: 'update',
        //   type: 'warning'
        // },
        // {
        //   label: '删除',
        //   prop: 'delete',
        //   type: 'danger'
        // }
      ],
      crew: {
        shipName: null,
        visible: false
      },
      data: [],
      disturb: {
        endTime: '',
        id: -1,
        name: '',
        startTime: false,
        visible: false
      },
      drawer: {
        data: {},
        direction: 'rtl',
        id: -1,
        status: '',
        visible: false
      },
      items: archives.items.slice(),
      model: Object.assign({}, archives.model),
      options: [
      ],
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
    close (visible) {
      this.drawer.visible = false
      if (visible) {
        this.handleCurrentChange(1)
      }
    },
    closeCrew () {
      this.crew.visible = false
    },
    closeDisturb (visible) {
      this.disturb.visible = false
      if (visible) {
        this.initData()
      }
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
      }
    },
    deleteRow (data) {
      this.$confirm(`您确定删除【${data.shipName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('ids', data.id)

        this.axios.post(api.deleteTrawlerDetail, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('操作成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '操作失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      }).catch(() => {
      })
    },
    focusTrawler (data, type) {
      let message = ''
      let operation = ''
      if (type === 'focus-cancel') {
        message = '取消'
        operation = '0'
      } else {
        operation = '1'
      }
      this.$confirm(`您确定${message}重点关注【${data.shipName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('ids', data.id)
        params.append('oper', operation)

        this.axios.post(api.handleFocusTrawler, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('操作成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '操作失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      }).catch(() => {
      })
    },
    handle (type, data) {
      switch (type) {
        case 'check':
        case 'update':
          this.drawer.visible = true
          this.drawer.data = Object.assign({}, data.item)
          this.drawer.id = data.id
          this.drawer.status = type
          break
        case 'crew':
          this.crew.visible = true
          this.crew.shipName = data.shipName
          break
        case 'delete':
          this.deleteRow(data)
          break
        case 'disturb':
          this.disturb.visible = true
          this.disturb.id = data.id
          this.disturb.name = data.shipName
          this.disturb.startTime = data.startTime
          this.disturb.endTime = data.endTime
          break
        case 'focus':
        case 'focus-cancel':
          this.focusTrawler(data, type)
          break
        case 'insert':
          this.drawer.visible = true
          this.drawer.id = ''
          this.drawer.status = type
          break
        case 'light':
        case 'cancel-light':
          this.toggleHighLightTrawler(data, type)
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
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)

      // 数据加载
      this.$refs['app-table'].empty = '数据加载中...'
      this.data = []
      this.axios.post(api.getTrawlerArchivesPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const auditState = ['未审核', '已通过', '已拒绝']
          this.data = res.result.records.map(item => {
            item.region = `${item.province || ''}${item.city || ''}${item.county || ''}`
            item.credential = `${item.credential1 || ''},${item.credential2 || ''},${item.credential3 || ''}`
            item.mainPower = item.mainPower || 0
            item.mainPowerML = Math.floor((item.mainPower * 1.36) * 1000) / 1000
            item.power = item.power || 0
            item.powerML = Math.floor((item.power * 1.36) * 1000) / 1000
            return {
              credential: item.credential,
              bdId: item.beiDouId,
              company: item.departName,
              creatTime: item.createAt,
              endTime: item.disturbEnd,
              focus: item.isMain ? '是' : '否',
              homePort: item.homePortName,
              highlight: item.isHighlight ? '是' : '否',
              id: item.id,
              isHighlight: !!item.isHighlight,
              isMain: !!item.isMain,
              item: item,
              mmsi: item.mmsi,
              ownerPhone: item.ownerPhone,
              picture: item.picture,
              power: item.power,
              region: `${item.province || ''}${item.city || ''}${item.county || ''}`,
              shipName: item.name,
              shipOwner: item.ownerName,
              startTime: item.disturbStart,
              status: auditState[item.approveStatus - 0],
              time: item.approveDate,
              work: item.jobRegionName
            }
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
          this.$forceUpdate()
        }
      }).catch(err => {
        console.error(err)
      })
    },
    querySearch (data, prop) {
      this.options = data.slice()
    },
    querySearchAsync (queryString, cb) {
      const restaurants = this.options
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    toggleHighLightTrawler (data, type) {
      let message = ''
      if (type === 'cancel-light') {
        message = '取消'
      }
      this.$confirm(`您确定${message}标记【${data.shipName}】为高亮船只吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('id', data.id)
        params.append('highlight', data.isHighlight ? 0 : 1)

        this.axios.post(api.handleHighLightTrawler, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('操作成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '操作失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
.trawler-archives {
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
.trawler-archives-form {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.trawler-archives-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  margin-right: 20px;
}
</style>
