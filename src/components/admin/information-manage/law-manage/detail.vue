<template>

  <div class="law-detail">

    <el-form
      class="law-detail-form"
      :model="model"
      ref="law-detail-form"
      :rules="rules"
      size="small">

      <el-form-item
        v-for="(item, index) in items"
        class="law-detail-item"
        :key="index"
        :label="`${item.label}:`"
        :prop="item.prop">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          :readonly="readonly"
          type="text"
          style="width: 100%;">
        </el-input>

        <el-input
          v-if="item.type === 'textarea'"
          v-model="model[item.prop]"
          :readonly="readonly"
          resize="none"
          :rows="item.rows"
          type="textarea">
        </el-input>

        <el-date-picker
          v-if="item.type === 'date'"
          v-model="model[item.prop]"
          :readonly="readonly"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 100%;">
        </el-date-picker>

      </el-form-item>

    </el-form>

    <div class="form control law-detail-control">

      <span
        class="button"
        role="info-form"
        @click="close()">取消
      </span>

      <span
        v-if="!readonly"
        class="button"
        role="primary-form"
        @click="validate">提交
      </span>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  items,
  model,
  rules
} from './config'
export default {
  name: 'law-detail',
  data () {
    return {
      items: [
      ],
      model: {
      },
      readonly: false,
      rules: {
      }
    }
  },
  props: {
    detail: {
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
      default: 'insert',
      required: false,
      type: String
    },
    type: {
      default: 'administration',
      required: false,
      type: String
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$emit('close', this.status)
    },
    initData () {
      this.items = items[this.type].slice()
      this.model = Object.assign({}, model[this.type])
      this.rules = Object.assign({}, rules[this.type])
      this.readonly = this.status === 'check'
      if (this.id) {
        Object.keys(this.model).forEach(key => {
          this.model[key] = this.detail[key]
        })
      }
    },
    submit () {
      const params = new FormData()
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })
      let url = api.insertLawDetail
      if (this.id) {
        params.append('id', this.id)
        url = api.updateLawDetail
      } else {
        url = api.insertLawDetail
      }
      params.append('type', this.type === 'administration' ? 1 : 2)

      this.axios.post(url, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功')
          this.close()
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    validate () {
      this.$refs['law-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.law-detail {
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
/* FORM */
.law-detail-form {
  flex-grow: 1;
  overflow-y: auto;
}
.law-detail-item {
  /*align-items: center;*/
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
.law-detail-item >>> label {
  flex-shrink: 0;
  text-align: right;
  width: 115px !important;
}
.law-detail-item >>> .el-form-item__content {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
/* CONTROL */
.law-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
