<template>

  <div class="video-scheme-info">

    <div
      :class="['video-scheme-table', flag ? 'expend' : '']">

      <app-filter
        :filter-items="items"
        :filter-model="model"
        @handle="handle">
      </app-filter>

      <app-table
        :columns="columns"
        :config="config"
        :controls="controls"
        :data="data"
        ref="app-table"
        @handle="handle"
        style="height: calc(100% - 120px);">
      </app-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.current"
        :page-sizes="pager.sizes"
        :page-size="pager.size"
        :layout="pager.layout"
        :total="pager.total"
        style="margin-top: 20px;">
      </el-pagination>

    </div>

    <div :class="['video-scheme-list', flag ? 'expend' : '']">

      <el-form
        class="form video-scheme-form"
        :model="plain.model"
        size="small">

        <el-form-item
          class="video-scheme-item"
          label="方案名称：">

          <el-input
            v-model="plain.model.name"
            readonly
            type="text">
          </el-input>

        </el-form-item>

        <el-form-item
          class="video-scheme-item"
          label="方案布局">

          <el-input
            v-model="plain.model.layout"
            readonly
            type="text">
          </el-input>

        </el-form-item>

        <el-form-item
          class="video-scheme-item">

          <span
            class="button"
            role="info-form"
            @click="cancle">取消
          </span>

        </el-form-item>

        <el-form-item
          v-if="plain.status !== 'check'"
          class="video-scheme-item">

          <span
            class="button"
            role="primary-form"
            @click="submit">确定
          </span>

        </el-form-item>

      </el-form>

      <div class="video-scheme-plain">

        <div
          v-for="(item, i) in plain.data"
          class="video-scheme-cell"
          :key="i"
          :style="`height: ${item.height}; width: ${item.width};`">

          <template
            v-if="item.img">

            <img
              alt="ICON_IMAGE"
              class="image"
              :src="item.img">

            <i
              v-if="!item.test"
              class="el-icon-remove icon-remove"
              @click="deleteVideo(i)">
            </i>

            <span
              class="label">{{item.label}}
          </span>

          </template>

          <div
            v-else
            class="insert-cover"
            @click="insertVideoSingle(i, item)">

            <i class="el-icon-circle-plus-outline icon-insert">
            </i>

          </div>

        </div>

      </div>

    </div>

    <el-drawer
      append-to-body
      :direction="drawer.direction"
      size="500px"
      :visible="drawer.visible"
      :with-header="false">

      <app-detail
        v-if="drawer.detail"
        :data="video"
        @close="close"
        @insert="insert">
      </app-detail>

      <app-video-list
        v-if="drawer.video"
        :data="video"
        @insert="insertSingle">
      </app-video-list>

    </el-drawer>

  </div>

</template>

<script>
import api from '@/util/api'
import appDetail from './detail'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
import appVideoList from './video-list'
export default {
  name: 'video-scheme',
  components: {
    'app-detail': appDetail,
    'app-filter': appFilter,
    'app-table': appTable,
    'app-video-list': appVideoList
  },
  data () {
    return {
      columns: [
        {
          label: '方案名称',
          prop: 'name'
        },
        {
          label: '创建时间',
          prop: 'createAt'
        }
      ],
      config: {
        type: 'index',
        width: 200
      },
      controls: [
        {
          label: '查看',
          prop: 'check',
          type: 'info'
        },
        {
          label: '修改',
          prop: 'update',
          type: 'success'
        },
        {
          label: '删除',
          prop: 'delete',
          type: 'danger'
        }
      ],
      data: [
      ],
      drawer: {
        detail: false,
        direction: 'rtl',
        video: false,
        visible: false
      },
      flag: false,
      items: [
        {
          label: '方案名称',
          prop: 'name',
          type: 'input'
        },
        {
          label: '',
          name: '查询',
          prop: 'query',
          style: 'primary-form',
          type: 'button'
        },
        {
          label: '',
          name: '新增',
          prop: 'insert',
          style: 'success-form',
          type: 'button'
        }
      ],
      model: {
        name: null
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      },
      plain: {
        data: [],
        deleteId: 0,
        deleteIds: [],
        height: null,
        id: 0,
        model: {},
        status: 'insert',
        width: null
      },
      video: [
      ]
    }
  },
  created () {
    this.initVideoData()
  },
  mounted () {
    this.initData()
  },
  methods: {
    cancle () {
      this.flag = false
    },
    close (visible) {
      this.drawer.visible = false
      this.drawer.detail = false
      if (visible) {
        this.handleCurrentChange(1)
      }
    },
    deleteDetail (data) {
      this.$confirm(`您确定要删除配置方案【${data.name}】吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        params.append('ids', data.id)

        this.axios.post(api.deleteVideoScheme, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('删除成功！')
            this.initData()
          } else {
            this.$message.error(res.msg || '删除失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      })
    },
    deleteVideo (index) {
      this.plain.deleteIds.push(index)
      this.plain.data[index].img = ''
      this.$forceUpdate()
    },
    handle (type, data) {
      switch (type) {
        case 'check': {
          this.flag = true
          this.plain.model.name = data.name
          this.plain.model.layout = data.layout
          this.plain.data = JSON.parse(data.videos).map(item => {
            item.test = true
            return item
          })
          this.plain.status = type
          this.plain.id = 0
          break
        }
        case 'delete': {
          this.deleteDetail(data)
          break
        }
        case 'insert': {
          this.drawer.visible = true
          this.drawer.detail = true
          this.plain.status = type
          this.plain.id = 0
          break
        }
        case 'query': {
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        }
        case 'update': {
          this.flag = true
          this.plain.model.name = data.name
          this.plain.model.layout = data.layout
          this.plain.data = JSON.parse(data.videos).map(item => {
            item.test = false
            return item
          })
          this.plain.status = type
          this.plain.id = data.id
          break
        }
        default: {
          break
        }
      }
    },
    handleCurrentChange (e) {
      this.pager.current = e
      this.initData()
    },
    handleSizeChange (e) {
      this.pager.size = e
      this.handleCurrentChange(1)
    },
    initData () {
      const params = new FormData()
      params.append('pageNo', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('key', this.model.name || '')

      this.data = []
      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.axios.post(api.getVideoSchemePage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.slice()
          this.pager.total = res.result.total
        } else {
          this.pager.total = 0
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.$refs['app-table'].empty = !this.pager.total ? '暂无数据' : ''
      })
    },
    insert (list, model, type) {
      this.drawer.visible = false
      this.drawer.detail = false
      this.flag = true
      let height = ''
      let width = ''
      switch (model.layout) {
        case '1x1':
          height = '100%'
          width = '100%'
          break
        case '1x2':
          height = '100%'
          width = '50%'
          break
        case '2x2':
          height = '50%'
          width = '50%'
          break
        case '3x3':
          height = '33.33%'
          width = '33.33%'
          break
        default:
          break
      }
      this.plain.data = list.map(item => {
        item.height = height
        item.width = width
        item.test = false
        return item
      })
      this.plain.model = Object.assign({}, model)
    },
    insertSingle (data) {
      this.drawer.visible = false
      this.drawer.video = false
      this.plain.data[this.plain.deleteId] = {
        id: data.id,
        height: this.plain.height,
        img: '/img/admin/sheme/icon-port-video-cover.png',
        label: data.label,
        test: false,
        width: this.plain.width
      }
      console.log(data, this.plain.data)
      this.$forceUpdate()
    },
    insertVideoSingle (index, data) {
      console.log(data)
      this.drawer.visible = true
      this.drawer.video = true
      this.plain.deleteId = index
      this.plain.height = data.height
      this.plain.width = data.width
    },
    initVideoData () {
      const params = new FormData()
      params.append('pageNum', 1)
      params.append('pageSize', -1)

      this.axios.post(api.getVideoPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          res.result.records.forEach(item => {
            const index = this.video.findIndex(_item => item.departName === _item.id)
            if (index === -1 && item.departName) {
              this.video.push({
                children: [],
                disabled: true,
                id: item.departName,
                label: item.departName
              })
            }
          })
          res.result.records.forEach(item => {
            this.video.forEach(_item => {
              if (_item.id === item.departName) {
                _item.children.push({
                  code: item.videoCode,
                  id: item.id,
                  label: item.videoName
                })
              }
            })
          })
        } else {
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    submit () {
      const cover = this.plain.data.some(item => !item.img)
      if (cover) {
        this.$message.warning('您还没有选择相应配置数量的摄像头')
        return null
      }

      this.plain.data = this.plain.data.map(item => {
        delete item.test
        return item
      })
      const params = new FormData()
      params.append('layout', this.plain.model.layout)
      params.append('name', this.plain.model.name)
      params.append('videos', JSON.stringify(this.plain.data))
      let url = ''
      if (this.plain.id) {
        url = api.updateVideoScheme
        params.append('id', this.plain.id)
      } else {
        url = api.insertVideoScheme
      }

      this.axios.post(url, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
          this.flag = false
          if (this.id) {
            this.initData()
          } else {
            this.handleCurrentChange(1)
          }
        } else {
          this.$message.error(res.msg || '操作失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
.video-scheme-info {
  height: 100%;
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
.video-scheme-table {
  height: 100%;
  width: 100%;
}
.video-scheme-table.expend {
  width: 40%;
}
/* LIST */
.video-scheme-list.expend {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 20px;
  width: 60%;
}
.video-scheme-list {
  display: none;
  width: 0;
}
.video-scheme-form {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
}
.video-scheme-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-right: 10px;
}
.video-scheme-plain {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: calc(100% - 51px);
}
.video-scheme-cell {
  box-sizing: border-box;
  padding-bottom: 10px;
  padding-right: 10px;
  position: relative;
}
.video-scheme-plain .image {
  height: 100%;
  /*left: 0;*/
  /*position: absolute;*/
  /*top: 0;*/
  width: 100%;
}
.video-scheme-plain .label {
  background-color: rgba(0, 0, 0, .5);
  bottom: 10px;
  box-sizing: border-box;
  color: white;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  left: 0;
  position: absolute;
  padding-left: 15px;
  text-align: left;
  width: calc(100% - 10px);
}
.icon-remove {
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  right: 0;
  top: -10px;
}
.insert-cover {
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #cccccc;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  width: 100%;
}
.icon-insert {
  color: #cccccc;
  cursor: pointer;
  font-size: 50px;
}
</style>
<style>
.video-scheme-item label {
  flex-shrink: 0 !important;
}
</style>
