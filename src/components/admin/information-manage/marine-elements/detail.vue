<template>

  <div class="seaElement-detail">

    <el-form
      class="seaElement-detail-form"
      :model="model"
      label-position="right"
      ref="seaElement-detail-form"
      :rules="rules">

      <el-form-item
        v-for="(item, i) in items"
        class="seaElement-detail-item"
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
        <el-input-number
          v-if="item.type === 'pickup'"
          v-model="model[item.prop]"
          :placeholder="item.placeholder"
          :disabled="status === 'check'"
          :max="item.max"
          :min="0"
          size="small"
          type="text"
          style="width: 250px;">
        </el-input-number>
        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]"
          :multiple="item.prop === 'boatIds'"
          :filterable="item.prop === 'boatIds' || item.prop === 'policeStation'"
          size="small"
          style="width: 250px;"
          v-loadMore="loadMore"
          :disabled="status === 'check' || (status === 'update' && item.prop === 'elementType')"
          :filter-method="changeSelectValue"
          @change="change">
          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value"
            :disabled="status === 'check'">
          </el-option>
        </el-select>
        <el-upload
          v-if="item.type === 'upload' && status !== 'check'"
          class="avatar-uploader"
          :action="url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="seaElement-img"  v-if="item.type === 'upload' && status === 'check'">
          <el-image  :src="imageUrl" style="width: 100%;height: 100%;" :preview-src-list="srcList" />
        </div>
      </el-form-item>

    </el-form>

    <div class="form control seaElement-detail-control">

      <span
        class="button"
        role="info-form"
        @click="close(false)">??????
      </span>

      <span
        v-if="status !== 'check'"
        class="button"
        role="primary-form"
        @click="validate()">??????
      </span>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  seaElement
} from '../configs'
export default {
  name: 'seaElement-detail',
  data () {
    return {
      allItems: seaElement.operation.slice(),
      allRules: seaElement.allRules,
      arr: seaElement.operation.slice()[0].options,
      arrId: [],
      activeList: [],
      btn: false,
      boatList: [],
      dialogImageUrl: null,
      dialogVisible: false,
      fileList: [],
      isFirstQuery: true,
      items: seaElement.operation.slice(),
      model: Object.assign({}, seaElement.operationModel),
      proofImage: null,
      pager: {
        boatName: '',
        pageSize: 150,
        pageIndex: 1
      },
      rules: null,
      srcList: [],
      selectDisabled: false,
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
    },
    type: {
      default: '',
      required: false,
      type: String
    }
  },
  mounted () {
    this.getList()
    this.initData()
    this.url = api.insertFile
    if (this.type) {
      this.model.elementType = this.type
      this.change(this.type)
    }
  },
  methods: {
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('?????????????????????????????? 2MB!')
      }
      return isLt2M
    },
    // select??????????????????????????????????????????elementType?????????????????????elementType????????????????????????????????????
    change (e) {
      // ???????????????this.arr???label?????????
      const isTrue = this.findIndexByKeyValue(this.arr, 'label', e)
      if (isTrue !== -1) {
        // ?????????rules??????
        this.$nextTick(() => {
          this.$refs['seaElement-detail-form'].clearValidate()
        })
        // ????????????check?????????????????????rules????????????
        if (this.status !== 'check') {
          this.rules = Object.assign(this.allRules, seaElement[this.model.elementType])
        }
        // ??????elementType??????????????????
        this.items = this.allItems.filter((item) => {
          if (item.filter.indexOf('all') !== -1) {
            return item
          } else {
            return item.filter.includes(this.model.elementType)
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs['seaElement-detail-form'].clearValidate()
        })
        if (this.status !== 'check') {
          this.rules = Object.assign({}, seaElement.completeRules)
        }
      }
    },
    close (visible) {
      this.$emit('close', visible)
    },
    // select??????????????????????????????????????????????????????????????????
    changeSelectValue (e) {
      if (e) {
        this.boatList = []
        this.pager.pageIndex = 1
        this.pager.boatName = e
        // ???????????????????????????
        this.activeList.forEach(item => {
          const obj = {}
          obj.value = String(item.value)
          obj.label = item.label
          this.boatList.unshift(obj)
        })
        this.getList()
      }
    },
    // ??????????????????key?????????
    findIndexByKeyValue (arr, key, valuetosearch) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] === valuetosearch) {
          return i
        }
      }
      return -1
    },
    getList (arr) {
      const params = new FormData()
      params.append('pageIndex', this.pager.pageIndex)
      params.append('pageSize', this.pager.pageSize)
      params.append('boatName', this.pager.boatName)
      if (this.id) {
        params.append('id', this.id)
      }
      this.axios.post(api.getSelectedBoatList, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.boatList = this.boatList.concat(res.result)
          this.items[this.items.length - 2].options = this.boatList
          // ?????????????????????????????????????????????????????????????????? ??????????????????
          if (this.isFirstQuery) {
            this.activeList.forEach(item => {
              const obj = {}
              obj.value = String(item.value)
              obj.label = item.label
              this.boatList.unshift(obj)
            })
            this.isFirstQuery = false
          }
        }
      }).catch(err => {
        this.$message.error('????????????????????????????????????')
        console.error(err)
      })
    },
    handleUploadRemove (file, fileList) {
      this.proofImage = ''
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.model.profilePhotos = res.result.id
      this.model.photoPath = res.result.path
      this.$refs['seaElement-detail-form'].validateField('profilePhotos')
    },
    initData () {
      this.srcList = []
      this.model = Object.assign({}, seaElement.model)
      if (this.id) {
        const params = new FormData()
        params.append('id', this.id)
        this.axios.post(api.getDetails, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            Object.keys(this.model).forEach(key => {
              this.model[key] = res.result.result[key]
            })
            this.model.boatIds = []
            // ????????????????????????????????????select????????????????????????????????????activeList???????????????????????????????????? ??????id?????????boatIds????????????select??????
            res.result.result.boats.forEach(item => {
              const obj = {}
              obj.value = String(item.id)
              obj.label = item.name
              this.model.boatIds.push(obj.value)
              this.activeList.unshift(obj)
            })
          }
        }).catch(err => {
          this.$message.error('????????????????????????????????????')
          console.error(err)
        })
        this.imageUrl = api.getImgUrl + this.detail.profilePhotos
        this.srcList.push(this.imageUrl)
      }
    },
    loadMore () {
      this.pager.pageIndex++
      this.getList()
    },
    submit () {
      const params = new FormData()
      Object.keys(this.model).forEach(key => {
        params.append(key, this.model[key] || '')
      })

      let url = api.saveSeaElement
      if (this.id) {
        url = api.updateSeaElement
        params.append('id', this.id)
      }

      this.axios.post(url, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('????????????')
          this.close(true)
        } else {
          this.$message.error(res.msg || '???????????????')
        }
      }).catch(err => {
        this.$message.error('????????????????????????????????????')
        console.error(err)
      })
    },
    validate () {
      if (!this.model.elementType) {
        this.rules = Object.assign({}, seaElement.completeRules)
        this.$message.error('??????????????????????????????')
        return false
      }
      const regex = /^1[3456789]\d{9}$/
      if (!regex.test(this.model.tel)) {
        this.$message.error('??????????????????11????????????')
        return false
      }
      this.$refs['seaElement-detail-form'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.seaElement-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding-top: 10px;
  width: 100%;
}
/* FORM */
.seaElement-detail-form {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-wrap: wrap;
  overflow-y: auto;
}
.seaElement-detail-item {
  /* align-items: center; */
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}
.seaElement-img{
  width: 200px;
  height: 200px;
}
/* CONTROL */
.seaElement-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
<style>
.seaElement-detail-item label {
  /* text-align: center; */
  width: 140px !important;
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
