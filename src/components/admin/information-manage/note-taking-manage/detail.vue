<template>

  <div class="noteTaking-detail">

    <el-form
      class="noteTaking-detail-form"
      :model="model"
      label-position="right"
      ref="noteTaking-detail-form"
      :rules="rules">

      <el-form-item
        v-for="(item, i) in items"
        class="noteTaking-detail-item"
        :key="i"
        :label="`${item.label}:`"
        :prop="item.prop">
        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          :readonly="status === 'check'"
          resize="none"
          :rows="1"
          size="small"
          type="textarea"
          style="width: 500px;">
        </el-input>
        <!-- <div v-if="item.type === 'input'">
          <p>{{model[item.prop]}}</p>
        </div> -->
        <div class="noteTaking-detail-html tags" v-if="item.type === 'tags'">
          <div v-for="item in model[item.prop]" :key="item.id" style="margin-left: 10px;">
            <el-tag type="success">{{item.tagName}}</el-tag>
          </div>
        </div>
        <div class="noteTaking-detail-html" v-if="item.type === 'v-html'">
          <p v-html="model[item.prop]" @click="clickContent(model[item.prop])"></p>
          <div v-for="(item, index) in audioList" :key="index">
            <video controls name="media">
              <source :src="item" type="audio/mp3">
            </video>
          </div>
        </div>
      </el-form-item>

    </el-form>

    <div class="form control noteTaking-detail-control">

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
import {
  noteTaking
} from '../configs'
export default {
  name: 'noteTaking-detail',
  data () {
    return {
      audioList: [],
      dialogImageUrl: null,
      dialogVisible: false,
      fileList: [],
      items: noteTaking.operation.slice(),
      model: Object.assign({}, noteTaking.operationModel),
      proofImage: null,
      rules: null,
      srcList: []
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
  },
  methods: {
    clickContent (item) {

    },
    close (visible) {
      this.$emit('close', visible)
    },
    handleUploadRemove (file, fileList) {
      this.proofImage = ''
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    initData () {
      this.model = Object.assign({}, noteTaking.model)
      if (this.id) {
        Object.keys(this.model).forEach(key => {
          this.model[key] = this.detail[key]
        })
        this.getAudio(this.model.content)
      }
    },
    getAudio (data) {
      this.audioList = []
      if (data) {
        data.replace(/<audio [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
          this.audioList.push(capture)
        })
      }
    }
  }
}
</script>

<style scoped>
.noteTaking-detail {
  /* box-sizing: border-box; */
  /* display: flex; */
  /* flex-direction: column; */
  height: 100%;
  /* overflow: hidden; */
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.noteTaking-detail-form {
  /* display: flex; */
/*  flex-direction: row;
  flex-grow: 2;
  flex-wrap: wrap;
  overflow-y: auto; */
}
.noteTaking-detail-item {
  /* align-items: center; */
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
.noteTaking-detail-html >>> img{
  max-width: 400px;
  height: auto;
}
.noteTaking-detail-html >>> video{
  max-width: 400px;
  height: auto;
}
.noteTaking-detail-html >>> audio{
  max-width: 400px;
  height: auto;
}
.tags{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
/* CONTROL */
.noteTaking-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.noteTaking-detail-item label {
  /* text-align: center; */
  width: 140px !important;
}

</style>
