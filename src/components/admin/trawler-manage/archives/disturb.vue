<template>

  <div>

    <app-dialog
      :config="config"
      title="免打扰设置"
      @close="close(false)">

      <div class="trawler-disturb">

        <el-form
          class="trawler-disturb-form"
          :model="model"
          ref="trawler-disturb-form"
          :rules="rules">

          <el-form-item
            class="trawler-disturb-item"
            label="船名号:">

            <el-input
              v-model="model.shipName"
              size="small"
              type="text"
              style="width: 220px;">
            </el-input>

          </el-form-item>

          <el-form-item
            class="trawler-disturb-item"
            label="免打扰开始时间:"
            prop="disturbStart">

            <el-date-picker
              v-model="model.disturbStart"
              :picker-options="picker.start"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;">
            </el-date-picker>

          </el-form-item>

          <el-form-item
            class="trawler-disturb-item"
            label="免打扰结束时间:"
            prop="disturbEnd">

            <el-date-picker
              v-model="model.disturbEnd"
              :picker-options="picker.end"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;">
            </el-date-picker>

          </el-form-item>

        </el-form>

        <div class="form control trawler-disturb-control">

          <span
            class="button"
            role="info-form"
            @click="close(false)">取消
          </span>

          <span
            class="button"
            role="primary-form"
            @click="validate()">提交
          </span>

        </div>

      </div>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import appDialog from '@/components/common/dialog'
export default {
  name: 'trawler-disturb',
  components: {
    'app-dialog': appDialog
  },
  data () {
    return {
      config: {
        height: 400,
        width: 400
      },
      model: {
        disturbEnd: null,
        disturbStart: null,
        shipName: null
      },
      picker: {
        end: {
          disabledDate: (time) => {
            const start = this.model.disturbStart || ''
            return time.getTime() < new Date(start)
          }
        },
        start: {
          disabledDate: (time) => {
            const end = this.model.disturbEnd || ''
            return time.getTime() > new Date(end)
          }
        }
      },
      rules: {
        disturbEnd: [
          { required: true, message: '免打扰结束时间 未选择', trigger: 'change' }
        ],
        disturbStart: [
          { required: true, message: '免打扰开始时间 未选择', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    'end-time': {
      default: '',
      required: false,
      type: String
    },
    id: {
      default: -1,
      required: false,
      type: Number
    },
    name: {
      default: '',
      required: false,
      type: String
    },
    'start-time': {
      default: '',
      required: false,
      type: String
    }
  },
  watch: {
    id: 'initData'
  },
  mounted () {
    this.initData()
  },
  methods: {
    close (visible) {
      this.$emit('close', visible)
    },
    initData () {
      this.model = {
        disturbEnd: this.endTime,
        disturbStart: this.startTime,
        shipName: this.name
      }
    },
    submit () {
      const params = new FormData()
      params.append('id', this.id)
      params.append('disturbStart', this.model.disturbStart)
      params.append('disturbEnd', this.model.disturbEnd)
      // handleDisturbTime
      this.axios.post(api.handleDisturbTime, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('设置免打扰时间成功！')
          this.close(true)
        } else {
          this.$message.error(res.msg || '设置免打扰时间失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    validate () {
      this.$refs['trawler-disturb-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.trawler-disturb {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.trawler-disturb-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
}
.trawler-disturb-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
/* CONTROL */
.trawler-disturb-control {
  flex-shrink: 0;
}
</style>
<style>
.trawler-disturb-item label {
  text-align: right;
  width: 125px !important;
}
</style>
