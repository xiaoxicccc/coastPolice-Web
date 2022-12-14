<template>

  <div class="video-list">

    <el-form
      class="video-list-form"
      :model="model"
      size="small">

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

    <div class="form control video-list-control">

      <!-- <span
        class="button"
        role="info-form"
        @click="close()">取消
      </span> -->

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
  name: 'video-list',
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      list: [],
      model: {
        video: null
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
  methods: {
    change (e) {
      this.$refs['video-tree'].filter(e)
    },
    checkNode (e) {
      const choose = (e) => {
        const index = this.list.findIndex(item => item.id === e.id)
        if (index === -1) {
          if (this.list.length < 1 && !e.children) {
            this.list.push(e)
          } else if (this.list.length >= 1) {
            this.$message.warning('您已选择1个监控!')
          }
        } else {
          this.list.splice(index, 1)
        }
      }
      choose(e)
      this.$refs['video-tree'].setCheckedNodes(this.list)
    },
    filter (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    validate () {
      if (this.list.length) {
        this.$emit('insert', this.list[0])
        this.list = []
        this.model.video = null
        this.$refs['video-tree'].setCheckedNodes([])
      } else {
        this.$message.warning('您还未选择摄像头！')
      }
    }
  }
}
</script>

<style scoped>
.video-list {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  width: 100%;
}
/* FORM */
.video-list-form {
  flex-grow: 1;
  overflow-y: auto;
}
/* CONTROL */
.video-list-control {
  flex-shrink: 0;
  padding-top: 10px;
}
</style>
