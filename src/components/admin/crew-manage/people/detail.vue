<template>

  <div class="people-detail">

    <div class="people-detail-info">

      <div class="people-archives-card">

        <div class="label">基本信息
        </div>

        <el-form
          class="people-detail-form"
          :model="model"
          size="small">

          <el-form-item
            v-for="(item, i) in items"
            class="people-detail-item"
            :key="i"
            :label="`${item.label}:`"
            :style="`width: ${item.width};`">

            <el-input
              v-if="item.type === 'input'"
              v-model="model[item.prop]"
              readonly
              size="small"
              type="text">
            </el-input>

            <el-input
              v-if="item.type === 'textarea'"
              v-model="model[item.prop]"
              readonly
              resize="none"
              :rows="item.rows"
              size="small"
              type="textarea">
            </el-input>

            <el-select
              v-if="item.type === 'select'"
              v-model="model[item.prop]"
              size="small"
              style="width: 100%;">

              <el-option
                v-for="(opt, index) in item.options"
                disabled
                :key="index"
                :label="opt.label"
                :value="opt.value">
              </el-option>

            </el-select>

          </el-form-item>

        </el-form>

      </div>

      <!-- 照片信息 -->
      <div
        v-for="(item, i) in files.items"
        class="people-archives-card"
        :key="i">

        <div class="label">{{ item.label }}
        </div>

        <div class="people-archives-files">

          <template v-if="files.data[item.prop].length">

            <div
              v-for="(_item, index) in files.data[item.prop]"
              class="people-archives-files-item"
              :key="index">

              <el-image
                v-if="_item"
                class="detail-image"
                :src="`${_item}`"
                :preview-src-list="[`${_item}`]">
              </el-image>

            </div>

          </template>

          <span v-else>暂无</span>

        </div>

      </div>

      <div class="people-archives-card">

        <div class="label">服务渔船信息
        </div>

        <!--<app-table
          :columns="report.columns"
          :data="report.data"
          style="height: 300px;">
        </app-table>-->

        <el-form
          class="people-detail-form"
          :model="trawler.model"
          size="small">

          <el-form-item
            v-for="(item, index) in trawler.items"
            class="people-detail-item"
            :key="index"
            :label="`${item.label}:`"
            :style="`width: ${item.width};`">

            <el-input
              v-if="item.type === 'input'"
              v-model="trawler.model[item.prop]"
              readonly
              size="small"
              type="text">
            </el-input>

          </el-form-item>

        </el-form>

      </div>

    </div>

    <div class="form control people-detail-control">

      <span
        class="button"
        role="info-form"
        @click="close()">取消
      </span>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  people,
  trawler
} from '../configs'
import {
  report
} from '@/components/admin/flow-manage/configs'
// import appTable from '@/components/common/table'

export default {
  name: 'people-detail',
  components: {
    // 'app-table': appTable
  },
  data () {
    return {
      files: {
        data: {
          idCardPic: [],
          photo: []
        },
        items: people.files.slice()
      },
      items: people.items.slice(),
      model: Object.assign({}, people.model),
      report: {
        columns: report.columns.slice(),
        data: [
        ]
      },
      trawler: {
        items: trawler.items.slice(),
        model: Object.assign({}, trawler.model)
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
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    initData () {
      Object.keys(this.model).forEach(key => {
        this.model[key] = this.data[key]
      })
      Object.keys(this.files.data).forEach(key => {
        if (this.model[key]) {
          const files = this.model[key].split(',')
          files.forEach(item => {
            this.files.data[key].push(item)
          })
        }
      })
      // this.initReportData()
      this.initTrawlerData()
    },
    initReportData () {
      const params = new FormData()
      params.append('crewName', this.model.name)
      this.axios.post(api.getCrewReportList, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = res.result || []
          this.report.data = data.slice()
        } else {
          this.$message.error(res.msg || '报备信息查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    initTrawlerData () {
      const params = new FormData()
      params.append('boatName', this.model.boatName)

      this.axios.post(api.getTrawlerDetailByName, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = res.result
          data.region = data.province && data.city && data.county ? `${data.province}${data.city}${data.county}` : ''
          Object.keys(this.trawler.model).forEach(key => {
            this.trawler.model[key] = data[key] || ''
          })
        } else {
          this.$message.error(res.msg || '服务渔船信息查询失败！')
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
      })
    }
  }
}
</script>

<style scoped>
.people-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  justify-content: space-between;
  width: 100%;
}
/* WRAPPER */
.people-detail-info {
  flex-grow: 1;
  overflow-y: auto;
}
/* FORM */
.people-detail-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.people-detail-item {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding-right: 10px;
}
/* CONTROL */
.people-detail-control {
  box-sizing: border-box;
  flex-shrink: 0;
  padding-bottom: 10px;
  padding-top: 10px;
}
/* CARD */
.people-archives-card {
  margin-bottom: 10px;
}
.people-archives-card .label {
  border-left: 3px solid rgba(22, 127, 255, 1);
  margin-bottom: 10px;
  padding-left: 10px;
}
/* FILES */
.people-archives-files {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
.people-archives-files-item {
  box-sizing: border-box;
  padding-bottom: 10px;
  padding-right: 10px;
  width: 33.33%;
}
.people-archives-files-item .detail-image {
  height: 150px;
  width: 100%;
}
</style>
<style>
.people-detail-item label {
  flex-shrink: 0;
  text-align: right;
  width: 100px !important;
}
.people-detail-item .el-form-item__content {
  flex-grow: 1;
}
</style>
