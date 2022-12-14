<template>

  <div class="role-detail">

    <el-form
      class="role-detail-form"
      :model="model"
      ref="role-detail-form"
      :rules="rules">

      <el-form-item
        v-for="(item, i) in items"
        class="role-detail-item"
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

        <el-input
          v-if="item.type === 'textarea'"
          v-model="model[item.prop]"
          :readonly="status === 'check'"
          resize="none"
          :rows="3"
          size="small"
          type="textarea"
          style="width: 250px;">
        </el-input>

        <el-cascader
          v-if="item.type === 'cascader'"
          v-model="model[item.prop]"
          :collapse-tags="true"
          :disabled="status === 'check'"
          :options="item.options"
          :props="item.props"
          :show-all-levels="false"
          size="small"
          style="width: 250px;">
        </el-cascader>

      </el-form-item>

    </el-form>

    <div class="form control role-detail-control">

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
  role
} from '../configs'
export default {
  name: 'role-detail',
  data () {
    return {
      items: role.items.slice(),
      model: Object.assign({}, role.model),
      rules: Object.assign({}, role.rules)
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
      default: '',
      required: false,
      type: String
    },
    status: {
      default: '',
      required: false,
      type: String
    }
  },
  mounted () {
    this.initData()
    this.initMenuData()
  },
  methods: {
    close (visible) {
      this.$emit('close', visible)
    },
    initData () {
      this.model = Object.assign({}, role.model)
      if (this.id) {
        Object.keys(this.model).forEach(key => {
          this.model[key] = this.detail[key]
        })
      }
    },
    initMenuData () {
      const params = new FormData()
      this.axios.post(api.getMenuList, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.items[2].options = res.result.map(item => {
            return {
              children: item.children.map(_item => {
                return {
                  children: _item.children.map(child => {
                    return {
                      label: child.powerName,
                      value: child.powerCode
                    }
                  }),
                  label: _item.powerName,
                  value: _item.powerCode
                }
              }),
              label: item.powerName,
              value: item.powerCode
            }
          })
        } else {
          this.$message.error(res.msg || '权限列表查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    submit () {
      const params = new FormData()
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })

      let url = api.insertRole
      if (this.id) {
        url = api.updateRole
        params.append('id', this.id)
      }

      this.axios.post(url, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功')
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
      this.$refs['role-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.role-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.role-detail-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
}
.role-detail-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
/* CONTROL */
.role-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.role-detail-item label {
  text-align: center;
  width: 90px !important;
}
</style>
