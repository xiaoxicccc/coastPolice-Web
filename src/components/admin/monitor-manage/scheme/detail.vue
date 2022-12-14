<template>

  <div class="scheme-detail">

    <div class="scheme-detail-data">

      <el-form
        class="scheme-detail-form"
        :model="model"
        ref="scheme-detail-form"
        :rules="rules"
        size="small">

        <el-form-item
          v-for="(item, i) in items"
          class="scheme-detail-item"
          :key="i"
          :label="`${item.label}:`"
          :prop="item.prop">

          <el-input
            v-if="item.type === 'input'"
            v-model="model[item.prop]"
            type="text"
            style="width: 300px;">
          </el-input>

          <el-select
            v-if="item.type === 'select'"
            v-model="model[item.prop]"
            style="width: 300px;">

            <el-option
              v-for="(opt, index) in item.options"
              :key="index"
              :label="opt.label"
              :value="opt.value">
            </el-option>

          </el-select>

        </el-form-item>

        <el-form-item>

          <el-input
            v-model="model.video"
            placeholder="请输入监控名称进行搜索"
            style="width: 385px;">
          </el-input>

        </el-form-item>

        <el-form-item>

          <el-tree
            :data="data"
            :filter-node-method="filter"
            highlight-current
            node-key="id"
            :props="defaultProps"
            ref="video-tree"
            show-checkbox
            @check="checkNode">
          </el-tree>

        </el-form-item>

      </el-form>

    </div>

    <div class="form control scheme-detail-control">

      <span
        class="button"
        role="info-form"
        @click="close()">取消
      </span>

      <span
        class="button"
        role="primary-form"
        @click="validate()">提交
      </span>

    </div>

  </div>

</template>

<script>
export default {
  name: 'scheme-detail',
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      items: [
        {
          label: '方案名称',
          prop: 'name',
          type: 'input'
        },
        {
          label: '方案布局',
          prop: 'layout',
          type: 'select',
          options: [
            {
              label: '1x1',
              value: '1x1'
            },
            {
              label: '1x2',
              value: '1x2'
            },
            {
              label: '2x2',
              value: '2x2'
            },
            {
              label: '3x3',
              value: '3x3'
            }
          ]
        }
      ],
      list: [],
      model: {
        layout: '1x1',
        name: null,
        video: null
      },
      rules: {
        layout: [
          { required: true, message: '方案布局 未选择', trigger: 'change' }
        ],
        name: [
          { required: true, message: '方案名称 为填写', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    data: {
      default () {
        return [
        ]
      },
      required: false,
      type: Array
    }
  },
  watch: {
    'model.video': 'change'
  },
  mounted () {
  },
  methods: {
    change (e) {
      this.$refs['video-tree'].filter(e)
    },
    checkNode (e) {
      this.$refs['scheme-detail-form'].validate(valid => {
        if (valid) {
          let count = 0
          switch (this.model.layout) {
            case '1x1':
              count = 1
              break
            case '1x2':
              count = 2
              break
            case '2x2':
              count = 4
              break
            case '3x3':
              count = 9
              break
            default:
              break
          }
          const choose = (e) => {
            const index = this.list.findIndex(item => item.id === e.id)
            if (index === -1) {
              if (this.list.length < count && !e.children) {
                this.list.push(e)
              } else if (this.list.length >= count) {
                this.$message.warning(`您已选择${count}个监控!`)
              }
            } else {
              this.list.splice(index, 1)
            }
          }
          choose(e)
          this.$refs['video-tree'].setCheckedNodes(this.list)
        } else {
          this.$refs['video-tree'].setCheckedNodes([])
          this.$message.warning('请先填写方案名称！')
        }
      })
    },
    close (visible) {
      this.$emit('close', visible)
    },
    filter (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    validate () {
      this.$refs['scheme-detail-form'].validate(valid => {
        if (valid) {
          let count = 0
          switch (this.model.layout) {
            case '1x1':
              count = 1
              break
            case '1x2':
              count = 2
              break
            case '2x2':
              count = 4
              break
            case '3x3':
              count = 9
              break
            default:
              break
          }
          if (this.list.length && this.list.length === count) {
            this.list = this.list.map(item => {
              item.img = '/img/admin/sheme/icon-port-video-cover.png'
              return item
            })
            this.$emit('insert', this.list, this.model, 'insert')
          } else {
            this.$message.warning('您还未选择完配置方案所需的摄像头！')
          }
        } else {
          this.$message.warning('请先填写方案名称！')
        }
      })
    }
  }
}
</script>

<style scoped>
.scheme-detail {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  width: 100%;
}
.scheme-detail-data {
  flex-grow: 1;
  overflow: hidden;
}
/* FORM */
.scheme-detail-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}
.scheme-detail-item {
  align-items: center;
  display: flex;
  flex-direction: row;
}
/* CONTROL */
.scheme-detail-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
