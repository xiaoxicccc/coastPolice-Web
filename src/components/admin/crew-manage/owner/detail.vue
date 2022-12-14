<template>

  <div class="owner-detail">

    <el-form
      class="owner-detail-form"
      :model="model">

      <el-form-item
        v-for="(item, i) in items"
        class="owner-detail-item"
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

    <div class="form control owner-detail-control">

      <span
        class="button"
        role="info-form"
        @click="close()">取消
      </span>

    </div>

  </div>

</template>

<script>
import {
  owner
} from '../configs'

export default {
  name: 'owner-detail',
  data () {
    return {
      items: owner.items.slice(),
      model: Object.assign({}, owner.model)
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
    }
  }
}
</script>

<style scoped>
.owner-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  justify-content: space-between;
  width: 100%;
}
/* FORM */
.owner-detail-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.owner-detail-item {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding-right: 10px;
}
/* CONTROL */
.owner-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.owner-detail-item label {
  flex-shrink: 0;
  text-align: right;
  width: 100px !important;
}
.owner-detail-item .el-form-item__content {
  flex-grow: 1;
}
</style>
