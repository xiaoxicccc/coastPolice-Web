<template>

  <div class="dictionary-detail">

    <el-form
      class="dictionary-detail-form"
      :model="model"
      ref="dictionary-detail-form"
      :rules="rules">

      <el-form-item
        v-for="(item, i) in items"
        class="dictionary-detail-item"
        :key="i"
        :label="`${item.label}:`"
        :prop="item.prop">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          size="small"
          type="text"
          style="width: 250px;">
        </el-input>

        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          size="small"
          style="width: 250px;">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

        <el-input-number
          v-if="item.type === 'number'"
          v-model="model[item.prop]"
          :min="1"
          size="small"
          style="width: 250px;">
        </el-input-number>

      </el-form-item>

    </el-form>

    <div class="form control dictionary-detail-control">

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

</template>

<script>
import api from '@/util/api'
import {
  dictionary
} from '../configs'

export default {
  name: 'dictionary-detail',
  data () {
    return {
      items: dictionary.items.slice(),
      model: Object.assign({}, dictionary.model),
      rules: Object.assign({}, dictionary.rules)
    }
  },
  props: {
    'parent-id': {
      default: '1',
      required: false,
      type: String
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close (visible) {
      this.$emit('close', visible)
    },
    initData () {
      const params = new FormData()

      this.axios.post(api.getDictionaryList, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.items[0].options = [
            {
              label: '根节点',
              value: '1'
            }
          ]
          res.result[0].children.map(item => {
            this.items[0].options.push({
              label: item.label,
              value: item.id
            })
          })
          this.model.parentId = this.parentId
        } else {
          this.$message.error(res.msg || '字典父节点查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.log(err)
      })
    },
    submit () {
      const params = new FormData()
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })

      this.axios.post(api.insertDictionary, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
          this.close(true)
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    validate () {
      this.$refs['dictionary-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.dictionary-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 20px;
  width: 100%;
}
/* FORM */
.dictionary-detail-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.dictionary-detail-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
/* CONTORL */
.dictionary-detail-control {
  flex-shrink: 0;
}
</style>
<style>
.dictionary-detail-item label {
  text-align: right;
  width: 90px !important;
}
</style>
