<template>

  <div class="account-detail">

    <el-form
      class="account-detail-form"
      :model="model"
      ref="account-detail-form"
      :rules="rules">

      <el-form-item
        v-for="(item, i) in items"
        class="account-detail-item"
        :key="i"
        :label="`${item.label}:`"
        :prop="item.prop"
        :style="`width: ${item.width};`">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          :readonly="status !== 'insert' && item.readonly"
          size="small"
          type="text"
          style="width: 100%;">
        </el-input>

        <el-input
          v-if="item.type === 'password'"
          v-model="model[item.prop]"
          :readonly="status !== 'insert' && item.readonly"
          size="small"
          type="password"
          style="width: 100%;">
        </el-input>

        <el-autocomplete
          v-if="item.type === 'autocomplete'"
          v-model="model[item.prop]"
          :debounce="100"
          :fetch-suggestions="querySearchAsync"
          value-key="label"
          placeholder="请输入内容"
          :disabled="status !== 'insert' && item.readonly"
          size="small"
          style="width: 100%;">
        </el-autocomplete>

        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          :multiple="item.multiple"
          size="small"
          @change="changeValue"
          style="width: 100%;">

          <el-option
            v-for="(opt, index) in item.options"
            :disabled="(status !== 'insert' && item.readonly) || status === 'check'"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

      </el-form-item>

      <el-form-item
        v-if="showTree"
        class="account-detail-item"
        label="数据权限:"
        prop="orgIds"
        style="width: 100%;">

        <el-cascader
          v-model="model.orgIds"
          :collapse-tags="true"
          :disabled="status === 'check'"
          :options="tree"
          :props="{
            checkStrictly: true,
            children: 'children',
            emitPath: false,
            label: 'label',
            multiple: true,
            value: 'value'
          }"
          :show-all-levels="false"
          size="small"
          style="width: 100%;">
        </el-cascader>

      </el-form-item>

    </el-form>

    <div class="form control account-detail-control">

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
  account
} from '../configs'
import md5 from 'js-md5'

export default {
  name: 'account-detail',
  data () {
    return {
      items: account.items.slice(),
      model: Object.assign({}, account.model),
      rules: Object.assign({}, account.rules),
      showTree: false,
      tree: []
    }
  },
  props: {
    id: {
      default: '',
      required: false,
      type: String
    },
    roles: {
      default () {
        return {
        }
      },
      required: false,
      type: Array
    },
    status: {
      default: 'insert',
      required: false,
      type: String
    }
  },
  watch: {
    id: 'loadData'
  },
  mounted () {
    this.initTree()
    this.loadData()
  },
  methods: {
    changeValue (e) {
      this.showTree = e - 0 === 2
    },
    close (visible) {
      this.$emit('close', visible)
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
      }
    },
    initData () {
      const params = new FormData()
      params.append('id', this.id)

      this.axios.post(api.getAccountDetail, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          Object.keys(this.model).forEach(key => {
            this.model[key] = res.result[key] || ''
          })
          // this.model.roleIds = roleIds
          this.changeValue(this.model.dataScope)
        } else {
          this.$message.error(res.msg || '详情查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    initTree () {
      const params = new FormData()

      this.axios.post(api.getDepartList, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.tree = res.result.map(item => {
            return {
              label: item.label,
              value: item.value
            }
          })
        } else {
          this.$message.error(res.msg || '组织信息查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员')
        console.error(err)
      })
    },
    loadData () {
      this.model = Object.assign({}, account.model)
      const index = this.items.findIndex(item => item.prop === 'roleIds')
      this.items[index].options = this.roles.slice()
      if (this.id) {
        this.initData()
      }
    },
    querySearchAsync (queryString, cb) {
      const restaurants = this.tree
      const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      cb(results)
    },
    submit () {
      const params = new FormData()
      let url = ''
      if (this.id) {
        url = api.updateAccount
        params.append('id', this.id)
      } else {
        url = api.insetAccount
        // 获取组织id
        const departId = this.tree.find(item => item.label === this.model.departName).value
        params.append('departId', departId)
      }
      Object.keys(this.model).forEach(key => {
        switch (key) {
          case 'password': {
            params.append('password', this.id ? this.model.password : md5(this.model.password))
            break
          }
          case 'roleIds': {
            params.append('roleIds', this.model.roleIds ? this.model.roleIds.join(',') : '')
            break
          }
          default: {
            params.append(key, this.model[key] || '')
            break
          }
        }
      })

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
      this.$refs['account-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.account-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.account-detail-form {
  display: flex;
  flex-direction: row;
  /*flex-grow: 1;*/
  flex-wrap: wrap;
  /*overflow-y: auto;*/
}
.account-detail-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  /*width: 50%;*/
}
/* CONTROL */
.account-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.account-detail-item label {
  flex-shrink: 0;
  text-align: right;
  width: 110px !important;
}
.account-detail-item .el-form-item__content {
  flex-grow: 1;
}
</style>
