<template>

  <div class="timing-tasks-detail">

    <el-form
      class="timing-tasks-detail-form"
      :model="model"
      ref="timing-tasks-detail-form"
      :rules="rules"
      size="small">

      <el-form-item
        v-for="(item, i) in items"
        class="timing-tasks-detail-item"
        :key="i"
        :label="`${item.label}:`"
        :prop="item.prop">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          :readonly="status === 'check'"
          type="text"
          style="width: 100%;">
        </el-input>

        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          style="width: 100%;">

          <el-option
            v-for="(opt, index) in item.options"
            :disabled="status === 'check'"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

        <el-input
          v-if="item.type === 'textarea'"
          v-model="model[item.prop]"
          :readonly="status === 'check'"
          resize="none"
          :rows="item.rows"
          type="textarea"
          style="width: 100%;">
        </el-input>

        <el-radio-group
          v-if="item.type === 'radio'"
          v-model="model[item.prop]">

          <el-radio
            v-for="(opt, index) in item.options"
            :disabled="status === 'check'"
            :key="index"
            :label="opt.value">{{ opt.label }}
          </el-radio>

        </el-radio-group>

      </el-form-item>

    </el-form>

    <div class="form control timing-tasks-detail-control">

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
  tasks
} from '../configs'

export default {
  name: 'timing-tasks-detail',
  data () {
    return {
      items: tasks.items.slice(),
      model: Object.assign({}, tasks.model),
      rules: Object.assign({}, tasks.rules)
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
      default: 0,
      required: false,
      type: Number
    },
    status: {
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
      this.model = Object.assign({}, tasks.model)
      if (this.id) {
        console.log(this.data)
        Object.keys(this.model).forEach(key => {
          this.model[key] = this.data[key]
        })
      }
    },
    submit () {
      const params = new FormData()
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })
      let url = ''
      if (this.id) {
        params.append('id', this.id)
        url = api.updateTimingTasks
      } else {
        url = api.insertTimingTasks
      }

      this.axios.post(url, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
          this.close(this.status)
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    validate () {
      this.$refs['timing-tasks-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.timing-tasks-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  width: 100%;
}
/* FORM */
.timing-tasks-detail-form {
  display: flex;
  flex-direction: column;
}
.timing-tasks-detail-item {
  display: flex;
  flex-direction: row;
}
/* CONTROL */
.timing-tasks-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.timing-tasks-detail-item > label {
  flex-shrink: 0;
  text-align: right;
  width: 130px;
}
.timing-tasks-detail-item > .el-form-item__content {
  flex-grow: 1;
  text-align: left;
}
</style>
