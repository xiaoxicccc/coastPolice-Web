<template>

  <div class="report-detail">

    <el-form
      class="report-detail-form"
      :model="model">

      <el-form-item
        v-for="(item, i) in items"
        class="report-detail-item"
        :key="i"
        :label="`${item.label}:`"
        :style="`width: ${item.width};`">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          readonly
          size="small"
          type="text"
          style="width: 100%;">
        </el-input>

        <el-input
          v-if="item.type === 'textarea'"
          v-model="model[item.prop]"
          readonly
          resize="none"
          :rows="item.rows"
          type="textarea"
          style="width: 100%;">
        </el-input>

        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="model[item.prop]"
          readonly
          size="small"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%;">
        </el-date-picker>

      </el-form-item>

    </el-form>

    <div class="form control report-detail-control">

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
  report
} from '../configs'

export default {
  name: 'report-detail',
  data () {
    return {
      items: report.items.slice(),
      model: Object.assign({}, report.model)
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
      if (this.id) {
        Object.keys(this.model).forEach(key => {
          this.model[key] = this.data[key]
        })
      }
    }
  }
}
</script>

<style scoped>
.report-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  width: 100%;
}
/* FORM */
.report-detail-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.report-detail-item {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  padding-right: 10px;
}
/* CONTROL */
.report-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.report-detail-item label {
  flex-shrink: 0;
  text-align: right;
  width: 120px !important;
}
.report-detail-item .el-form-item__content {
  flex-grow: 1;
}
</style>
