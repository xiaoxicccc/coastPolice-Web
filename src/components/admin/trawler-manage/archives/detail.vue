<template>

  <div class="trawler-archives-detail">

    <div
      class="trawler-archives-info">

      <el-form
        class="trawler-archives-detail-form"
        :model="model"
        ref="trawler-archives-detail-form"
        :rules="rules">

        <div
          v-for="(item, i) in items"
          class="trawler-archives-detail-list"
          :key="i">

          <div class="label">

            <span class="text">{{ item.label }}
            </span>

          </div>

          <div class="trawler-archives-detail-children">

            <el-form-item
              v-for="(_item, index) in item.children"
              class="trawler-archives-detail-item"
              :key="index"
              :label="`${_item.label}:`"
              :prop="_item.prop"
              :style="`width: ${item.width};`">

              <el-input
                v-if="_item.type === 'input'"
                v-model="model[_item.prop]"
                :readonly="status === 'check'"
                size="small"
                type="text"
                style="width: 330px;">
              </el-input>

              <el-input
                v-if="_item.type === 'number'"
                v-model="model[_item.prop]"
                :readonly="status === 'check'"
                size="small"
                type="text"
                style="width: 330px;">
              </el-input>

              <!--<el-input-number
                v-if="_item.type === 'number'"
                v-model="model[_item.prop]"
                :disabled="status === 'check'"
                :min="0"
                size="small"
                style="width: 330px;">
              </el-input-number>-->

              <el-date-picker
                v-if="_item.type === 'date'"
                v-model="model[_item.prop]"
                :readonly="status === 'check'"
                size="small"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 330px;">
              </el-date-picker>

              <el-date-picker
                v-if="_item.type === 'datetime'"
                v-model="model[_item.prop]"
                :readonly="status === 'check'"
                size="small"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 330px;">
              </el-date-picker>

              <el-select
                v-if="_item.type === 'select'"
                v-model="model[_item.prop]"
                size="small"
                style="width: 330px;">

                <el-option
                  v-for="(opt, id) in _item.options"
                  :disabled="status === 'check'"
                  :key="id"
                  :label="opt.label"
                  :value="opt.label">
                </el-option>

              </el-select>

              <el-select
                v-if="_item.type === 'selects'"
                v-model="model[_item.prop]"
                :multiple="_item.multiple"
                :disabled="_item.multiple && status === 'check'"
                size="small"
                style="width: 330px;">

                <el-option
                  v-for="(opt, id) in _item.options"
                  :disabled="status === 'check'"
                  :key="id"
                  :label="opt.label"
                  :value="opt.value">
                </el-option>

              </el-select>

              <div
                class="form"
                v-if="_item.type === 'file'">

                <span
                  v-if="status !== 'check'"
                  class="button"
                  role="primary-form"
                  @click="addRow(_item.prop)">添加文件
                </span>

                <div
                  v-for="(file, index) in files[_item.prop]"
                  :key="index"
                  class="report-file">

                  <template v-if="status === 'check'">

                    <el-image
                      v-if="file.path"
                      class="detail-image"
                      :src="`${file.path}`"
                      :preview-src-list="[`${file.path}`]">
                    </el-image>

                    <span v-else>暂无</span>

                  </template>

                  <template v-if="status === 'insert'">

                    <el-input
                      v-model="file.value"
                      readonly
                      size="small"
                      style="width: 300px;">
                    </el-input>

                    <el-button
                      v-if="!file.value"
                      plain
                      size="small"
                      type="success"
                      style="margin-left: 10px;"
                      @click="uploadFile(_item.prop, index)">上传文件
                    </el-button>

                    <input
                      hidden
                      :id="`upload_${_item.prop}_${index}`"
                      :name="`${_item.prop}_${index}`"
                      type="file"
                      @change="readFile">

                    <el-button
                      plain
                      size="small"
                      type="danger"
                      style="margin-left: 10px;"
                      @click="deleteRow(_item.prop, index)">删除文件
                    </el-button>

                  </template>

                </div>

              </div>

            </el-form-item>

          </div>

        </div>

      </el-form>

      <!-- 船上人员 -->
      <div class="trawler-archives-card">

        <div class="label">

          <span class="text">船上人员
          </span>

          <el-button
            size="mini"
            type="primary"
            @click="exportCrew">导出
          </el-button>

        </div>

        <app-table
          :columns="crew.columns"
          :data="crew.data"
          style="height: 300px;">
        </app-table>

        <el-pagination
          @size-change="handleCrewSizeChange"
          @current-change="handleCrewCurrentChange"
          :current-page="crew.pager.current"
          :page-sizes="crew.pager.sizes"
          :page-size="crew.pager.size"
          :layout="crew.pager.layout"
          :total="crew.pager.total"
          style="margin-top: 20px; text-align: center">
        </el-pagination>

      </div>

      <!-- 报备信息 -->
      <div class="trawler-archives-card">

        <div class="label">

          <span class="text">报备信息
          </span>

        </div>

        <app-table
          :columns="report.columns"
          :data="report.data"
          style="height: 300px;">
        </app-table>

        <el-pagination
          @size-change="handleReportSizeChange"
          @current-change="handleReportCurrentChange"
          :current-page="report.pager.current"
          :page-sizes="report.pager.sizes"
          :page-size="report.pager.size"
          :layout="report.pager.layout"
          :total="report.pager.total"
          style="margin-top: 20px; text-align: center">
        </el-pagination>

      </div>

      <!-- 自动进出港信息 -->
      <div class="trawler-archives-card">

        <div class="label">

          <span class="text">自动进出港信息
          </span>

        </div>

        <app-table
          :columns="distinguish.columns"
          :data="distinguish.data"
          style="height: 300px;">
        </app-table>

        <el-pagination
          @size-change="handleDistinguishSizeChange"
          @current-change="handleDistinguishCurrentChange"
          :current-page="distinguish.pager.current"
          :page-sizes="distinguish.pager.sizes"
          :page-size="distinguish.pager.size"
          :layout="distinguish.pager.layout"
          :total="distinguish.pager.total"
          style="margin-top: 20px; text-align: center">
        </el-pagination>

      </div>

      <!-- 近一周轨迹 -->
      <div class="trawler-archives-card">

        <div class="label">

          <span class="text">近一周轨迹
          </span>

        </div>

        <app-trawler-map
          v-if="track.visible"
          :equipment-type="track.type"
          :ship-name="track.name">
        </app-trawler-map>

      </div>

    </div>

    <div class="form control trawler-archives-detail-control">

      <span
        class="button"
        role="info-form"
        @click="close(false)">取消
      </span>

      <span
        v-if="status !== 'check'"
        class="button"
        role="primary-form"
        @click="validate()">提交
      </span>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  crew,
  distinguish,
  insert
} from '../configs'
import {
  report
} from '@/components/admin/flow-manage/configs'
import appTable from '@/components/common/table'
import appTrawlerMap from './map'
export default {
  name: 'trawler-archives-detail',
  components: {
    'app-table': appTable,
    'app-trawler-map': appTrawlerMap
  },
  data () {
    return {
      api: api,
      crew: {
        columns: crew.columns.slice(),
        data: [],
        pager: {
          current: 1,
          layout: 'total, sizes, prev, pager, next, jumper',
          size: 10,
          sizes: [10, 15, 20, 50],
          total: 0
        }
      },
      distinguish: {
        columns: distinguish.columns.slice(),
        data: [],
        pager: {
          current: 1,
          layout: 'total, sizes, prev, pager, next, jumper',
          size: 10,
          sizes: [10, 15, 20, 50],
          total: 0
        }
      },
      files: {
        credential: [],
        picture: []
      },
      items: insert.items.slice(),
      model: Object.assign({}, insert.model),
      report: {
        columns: report.columns.slice(),
        data: [],
        pager: {
          current: 1,
          layout: 'total, sizes, prev, pager, next, jumper',
          size: 10,
          sizes: [10, 15, 20, 50],
          total: 0
        }
      },
      rules: Object.assign({}, insert.rules),
      time: ['', ''],
      track: {
        name: null,
        type: null,
        visible: false
      }
    }
  },
  props: {
    data: {
      default () {
        return {
        }
      },
      required: false,
      type: Object
    },
    id: {
      default: -1,
      required: false,
      type: Number
    },
    status: {
      default: 'insert',
      required: false,
      type: String
    }
  },
  mounted () {
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.time[1] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1')
    today.setDate(today.getDate() - 7)
    this.time[0] = today.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1')
    this.initData()
  },
  methods: {
    addRow (type) {
      this.files[type].push({
        id: null,
        path: null,
        value: null
      })
    },
    close (visible) {
      this.$emit('close', visible)
    },
    deleteRow (type, index) {
      const params = new FormData()
      params.append('id', this.files[type][index].id)

      this.axios.post(api.deleteFile, params, { loading: true }).then(() => {
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        this.files[type].splice(index, 1)
        this.model[type] = ''
      })
    },
    exportCrew () {
      const token = localStorage.getItem('token')
      fetch(`${api.exportCrewPage}?boatName=${this.model.name}`, {
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
          alink.download = `${this.model.name}船上人员信息.xlsx`
          alink.target = '_blank'
          alink.click()
          alink.remove()
        })
    },
    handleCrewCurrentChange (e) {
      this.crew.pager.current = e
      this.initCrewData()
    },
    handleCrewSizeChange (e) {
      this.crew.pager.size = e
      this.initCrewData()
    },
    handleDistinguishCurrentChange (e) {
      this.distinguish.pager.current = e
      this.initDistinguishData()
    },
    handleDistinguishSizeChange (e) {
      this.distinguish.pager.size = e
      this.handleDistinguishCurrentChange(1)
    },
    handleReportCurrentChange (e) {
      this.report.pager.current = e
      this.initReportData()
    },
    handleReportSizeChange (e) {
      this.report.pager.size = e
      this.initReportData()
    },
    initCrewData () { // 获取船上人员信息
      const params = new FormData()
      params.append('boatName', this.model.name || '')
      params.append('pageNum', this.crew.pager.current)
      params.append('pageSize', this.crew.pager.size)

      this.axios.post(api.getCrewArchivesPage, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.crew.data = res.result.records.slice()
          this.crew.pager.total = res.result.total
        } else {
          this.$message.error(res.msg || '查询失败！')
          this.crew.pager.total = 0
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
        this.crew.pager.total = 0
      })
    },
    initData () {
      if (this.id) {
        Object.keys(this.model).forEach(key => {
          this.model[key] = this.data[key]
        })
        this.track.name = this.model.name
        // 获取船上人员
        this.initCrewData()
        // 获取报备信息
        this.initReportData()
        // 获取终端数据
        this.initTerminalData()
        // 获取进出港信息
        this.initDistinguishData()
        // 回显文件
        Object.keys(this.files).forEach(key => {
          if (this.model[key]) {
            const files = this.model[key].split(',')
            files.forEach(item => {
              if (item) {
                this.files[key].push({
                  path: item
                })
              }
            })
          }
        })
      } else {
        this.model = Object.assign({}, insert.model)
      }
    },
    initDistinguishData () {
      const params = new FormData()
      params.append('pageNum', this.distinguish.pager.current)
      params.append('pageSize', this.distinguish.pager.size)
      params.append('boatName', this.model.name || '')
      params.append('beginTime', this.time[0])
      params.append('endTime', this.time[1])

      this.distinguish.data = []
      this.axios.post(api.getDistinguishPage, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.distinguish.data = res.result.records.slice()
          this.distinguish.pager.total = res.result.total
        }
      }).catch(err => {
        console.error(err)
      })
    },
    initReportData () {
      const params = new FormData()
      params.append('boatName', this.model.name || '')
      params.append('pageNum', this.report.pager.current)
      params.append('pageSize', this.report.pager.size)
      params.append('beginTime', this.time[0])
      params.append('endTime', this.time[1])

      this.axios.post(api.getReportPage, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.report.data = res.result.records.slice()
          this.report.pager.total = res.result.total
        } else {
          this.report.pager.total = 0
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.report.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    initTerminalData () {
      const params = new FormData()
      params.append('key', this.data.name)

      this.axios.post(api.getTrawlerTerminalDetail, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          const items = this.items.find(item => item.name === 'terminal')
          items.children.forEach(item => {
            this.model[item.prop] = []
            res.result.forEach(_item => {
              if (_item[item.prop]) {
                this.model[item.prop].push(_item[item.prop])
              }
            })
          })
          items.children.forEach(item => {
            if (item.prop !== 'msgType') {
              this.model[item.prop] = this.model[item.prop].join('/')
            }
          })
          this.track.type = this.model.msgType
        } else {
          this.$message.error(res.msg || '渔船终端信息查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.track.visible = true
      })
    },
    readFile (e) {
      const index = e.target.name.replace(/\w+_/, '') - 0
      const type = e.target.name.replace(/_\w+/, '')
      const file = e.target.files[0]
      if (file) {
        const params = new FormData()
        params.append('file', file)

        this.axios.post(api.insertFile, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.files[type][index].value = res.result.name
            this.files[type][index].path = res.result.path
            this.files[type][index].id = res.result.id
            this.model[type] = res.result.name
          } else {
            this.$message.error(res.msg || '操作失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      }
    },
    submit () {
      const params = new FormData()
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })
      params.delete('credential')
      this.files.credential.forEach((item, i) => {
        if (item.path) {
          params.append(`credential${i}`, item.path)
        }
      })

      this.axios.post(api.insertTrawlerDetail, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
          this.$emit('close', true)
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    uploadFile (type, index) {
      const selector = `input#upload_${type}_${index}`
      const input = document.querySelector(selector)
      if (input) {
        input.click()
      }
    },
    validate () {
      this.$refs['trawler-archives-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        } else {
          this.$message.warning('您还有必填项未完成！')
        }
      })
    }
  }
}
</script>

<style scoped>
.trawler-archives-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  width: 100%;
}
/* INFO */
.trawler-archives-info {
  flex-grow: 1;
  overflow-y: auto;
}
/* FORM */
.trawler-archives-detail-form {
  display: flex;
  flex-direction: column;
}
.trawler-archives-card {
  margin-bottom: 10px;
}
.trawler-archives-card .label {
  margin-bottom: 10px;
}
.trawler-archives-detail-list .label,
.trawler-archives-card .label {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 30px;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 20px;
  position: relative;
}
.trawler-archives-detail-list .label:before,
.trawler-archives-card .label:before {
  background-color: rgba(22, 127, 255, 1);
  border-radius: 2px;
  content: '';
  display: inline-block;
  height: 16px;
  left: 0;
  position: absolute;
  top: 8px;
  width: 3px;
}
.trawler-archives-detail-list .label .text {
}
.trawler-archives-detail-children {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.trawler-archives-detail-item {
  /*align-items: center;*/
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  margin-bottom: 18px;
}
/* CONTROL */
.trawler-archives-detail-control {
  margin-top: 10px;
}
/* IMAGE */
.trawler-archives-detail-item .form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.report-file {
  box-sizing: border-box;
  padding-bottom: 10px;
  padding-right: 10px;
  width: 33.33%;
}
.detail-image {
  height: auto;
  width: 100%;
}
</style>
<style>
.trawler-archives-detail-item label {
  flex-shrink: 0;
  text-align: right;
  width: 138px;
}
.trawler-archives-detail-item .el-form-item__content {
  flex-grow: 1;
}
</style>
