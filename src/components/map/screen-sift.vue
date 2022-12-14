<template>

  <!-- 渔船筛选 -->
  <div class="screen-sift">

    <div class="title">

      <span>渔船筛选
      </span>

      <i
        class="el-icon-close icon-close"
        @click="close">
      </i>

    </div>

    <el-form
      class="screen-sift-form"
      :model="model"
      size="small">

      <el-form-item
        v-for="(item, i) in items"
        class="screen-sift-item"
        :key="i"
        :label="`${item.label}:`">

        <el-select
          v-model="model[item.propRange]"
          style="margin-right: 10px;">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

        <el-input
          v-model="model[item.prop]"
          type="text">
        </el-input>

      </el-form-item>

    </el-form>

    <div class="screen-sift-control">

      <el-button
        size="small"
        type="primary"
        @click="query">查询
      </el-button>

    </div>

  </div>

</template>

<script>
export default {
  name: 'screen-sift',
  data () {
    return {
      items: [
        {
          label: '马力(kw)',
          prop: 'power',
          propRange: 'powerType',
          options: [
            {
              label: '大于等于',
              value: '1'
            },
            {
              label: '小于',
              value: '0'
            }
          ]
        },
        {
          label: '船长(m)',
          prop: 'length',
          propRange: 'lengthType',
          options: [
            {
              label: '大于等于',
              value: '1'
            },
            {
              label: '小于',
              value: '0'
            }
          ]
        }
      ],
      model: {
        length: null,
        lengthType: null,
        power: null,
        powerType: null
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    query () {
      if ((this.model.length && this.model.lengthType) || (this.model.power && this.model.powerType)) {
        this.$emit('query', this.model)
      } else {
        this.$message.warning('请输入查询条件！')
      }
    }
  }
}
</script>

<style scoped>
.screen-sift {
  background-color: rgba(25, 48, 128, .8);
  box-sizing: border-box;
  color: white;
  font-family: 'SHSCNN';
  height: 200px;
  left: 400px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  position: fixed;
  top: 180px;
  width: 300px;
  z-index: 10;
}

/* TITLE */
.screen-sift .title {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.screen-sift .icon-close {
  cursor: pointer;
}
/* FORM */
.screen-sift-form {
  margin-top: 15px;
}
/* CONTROL */
.screen-sift-control {
  flex-shrink: 0;
  margin-top: 10px;
}
</style>
<style>
.screen-sift-item label {
  color: white;
  width: 75px;
}
.screen-sift-item .el-form-item__content {
  align-items: center;
  display: flex;
  flex-direction: row;
}
</style>
