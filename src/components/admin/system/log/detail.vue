<template>

  <div class="log-detail">

    <el-form
      class="log-detail-form"
      :model="model">

      <el-form-item
        v-for="(item, i) in items"
        class="log-detail-item"
        :key="i"
        :label="`${item.label}:`">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          readonly
          size="small"
          type="text"
          style="width: 500px;">
        </el-input>

        <el-input
          v-if="item.type === 'textarea'"
          v-model="model[item.prop]"
          readonly
          resize="none"
          :rows="item.rows"
          size="small"
          type="textarea"
          style="width: 500px;">
        </el-input>

        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="model[item.prop]"
          readonly
          size="small"
          type="datetime"
          style="width: 500px;">
        </el-date-picker>

      </el-form-item>

    </el-form>

    <div class="form control log-detail-control">

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
  log
} from '../configs'
export default {
  name: 'log-detail',
  data () {
    return {
      items: log.items.slice(),
      model: Object.assign({}, log.model)
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
      this.model = Object.assign({}, log.model)
      Object.keys(this.model).forEach(key => {
        this.model[key] = this.data[key] || ''
      })
    }
  }
}
</script>

<style scoped>
.log-detail {
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
.log-detail-form {
  flex-grow: 1;
  overflow-y: auto;
}
.log-detail-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
/* CONTROL */
.log-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.log-detail-item label {
  text-align: right;
  width: 100px !important;
}
</style>
