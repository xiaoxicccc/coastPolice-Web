<template>

  <div class="menu-detail">

    <el-form
      class="menu-detail-form"
      :model="model"
      ref="menu-detail-form"
      :rules="rules">

      <el-form-item
        v-for="(item, i) in items"
        class="menu-detail-item"
        :key="i"
        :label="`${item.label}:`"
        :prop="item.prop">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          :readonly="status === 'check'"
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
            :disabled="status === 'check'"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

        <el-cascader
          v-if="item.type === 'cascader'"
          v-model="model[item.prop]"
          :disabled="status === 'check'"
          :options="item.options"
          :props="{ checkStrictly: true, emitPath: false, expandTrigger: 'hover' }"
          :show-all-levels="false"
          size="small"
          style="width: 250px;">
        </el-cascader>

      </el-form-item>

    </el-form>

    <div class="form control menu-detail-control">

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
  menu
} from '../configs'

export default {
  name: 'menu-detail',
  data () {
    return {
      items: menu.items.slice(),
      model: Object.assign({}, menu.model),
      rules: Object.assign({}, menu.rules)
    }
  },
  props: {
    data: {
      default () {
        return []
      },
      required: false,
      type: Array
    },
    detail: {
      default () {
        return {
        }
      },
      required: false,
      type: Object
    },
    id: {
      default: '',
      required: false,
      type: String
    },
    status: {
      default: 'insert',
      required: false,
      type: String
    }
  },
  mounted () {
    this.initData()
  },
  watch: {
    id: 'initData'
  },
  methods: {
    close (visible) {
      this.$emit('close', visible)
    },
    initData () {
      // 父节点下拉值匹配
      this.items[2].options = [
        {
          label: '根节点',
          value: '0'
        }
      ]
      this.items[2].options = this.items[2].options.concat(this.data)
      this.model = Object.assign({}, menu.model)
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
      params.append('level', this.model.powerType || '')

      let url = api.insertMenu
      if (this.id) {
        url = api.updateMenu
        params.append('id', this.id)
      } else {
        url = api.insertMenu
      }

      this.axios.post(url, params, { loading: true }).then(response => {
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
      this.$refs['menu-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.menu-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
  padding-top: 20px;
  width: 100%;
}
/* FORM */
.menu-detail-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
}
.menu-detail-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
/* CONTROL */
.menu-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.menu-detail-item label {
  text-align: right;
  width: 100px !important;
}
</style>
