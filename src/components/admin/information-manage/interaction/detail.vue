<template>

  <div class="interaction-detail">

    <el-form
      class="interaction-detail-form"
      :model="model"
      ref="interaction-detail-form"
      :rules="rules">

      <el-form-item
        v-for="(item, i) in items"
        class="interaction-detail-item"
        :key="i"
        :label="`${item.label}:`"
        :prop="item.prop">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          :readonly="status === 'check'"
          size="small"
          type="text"
          style="width: 450px;">
        </el-input>

        <el-input
          v-if="item.type === 'textarea'"
          v-model="model[item.prop]"
          :readonly="status === 'check'"
          resize="none"
          :rows="3"
          size="small"
          type="textarea"
          style="width: 450px;">
        </el-input>
        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          size="small"
          @change="change">
          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value"
            :disabled="status === 'check'">
          </el-option>
        </el-select>
        <div class="interaction-img"  v-if="item.type==='img'">
          <!-- {{model[item.prop]}} -->
          <div id="" v-for="urls in model[item.prop]" :key="urls">
            <el-image  :src="url+urls" fit="cover" :preview-src-list="srcList" style="width: 200px;height: 200px;" />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="form control interaction-detail-control">
      <span
        class="button"
        role="info-form"
        @click="close(false)">取消
      </span>
    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  interaction
} from '../configs'
export default {
  name: 'interaction-detail',
  data () {
    return {
      dialogImageUrl: null,
      dialogVisible: false,
      fileList: [],
      items: interaction.operation.slice(),
      model: Object.assign({}, interaction.model),
      proofImage: null,
      rules: {},
      srcList: [],
      updateData: {},
      url: '',
      imageUrl: ''
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
    this.url = api.getImgUrl
    // this.initMenuData()
  },
  methods: {
    change () {

    },
    close (visible) {
      this.$emit('close', visible)
    },
    initData () {
      this.model = Object.assign({}, interaction.model)
      if (this.id) {
        Object.keys(this.model).forEach(key => {
          this.model[key] = this.detail[key]
        })
        this.model.picture = this.model.picture.split(',')
        this.model.picture.forEach(item => {
          this.srcList.push(api.getImgUrl + item)
        })
      }
    }
  }
}
</script>

<style scoped>
.interaction-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.interaction-detail-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
}
.interaction-detail-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
/* CONTROL */
.interaction-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
.interaction-img{
  display: flex;
  justify-content: flex-start;
}
</style>
<style>
.interaction-detail-item label {
  text-align: center;
  width: 130px !important;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
