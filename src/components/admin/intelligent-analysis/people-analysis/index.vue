<template>

  <div class="people-analysis">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <el-table
      :data="data"
      :empty-text="empty"
      height="calc(100% - 120px)"
      size="mini"
      stripe>

      <el-table-column
        label="#"
        type="index"
        :width="50">
      </el-table-column>

      <el-table-column
        v-for="(item, i) in columns"
        :key="i"
        :label="item.label"
        :prop="item.prop"
        :width="item.width">

        <template slot-scope="props">

          <el-image
            v-if="item.type === 'image' && props.row[item.prop]"
            class="column-image"
            :src="props.row[item.prop]"
            :preview-src-list="[props.row[item.prop]]">
          </el-image>

          <span v-else-if="item.type === 'image' && !props.row[item.prop]">暂无图片
          </span>

          <span v-else>{{ props.row[item.prop] }}
          </span>

        </template>

      </el-table-column>

    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pager.current"
      :page-sizes="pager.sizes"
      :page-size="pager.size"
      :layout="pager.layout"
      :total="pager.total"
      style="margin-top: 10px;">
    </el-pagination>

  </div>

</template>

<script>
import api from '@/util/api'
import appFilter from '@/components/common/filter'
export default {
  name: 'people-analysis',
  components: {
    'app-filter': appFilter
  },
  data () {
    return {
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '识别类型',
          prop: 'recognitionType'
        },
        {
          label: '抓拍照片(点击查看大图)',
          prop: 'faceImageUri',
          type: 'image'
        },
        {
          label: '抓拍时间',
          prop: 'createAt'
        }
      ],
      data: [],
      empty: '数据加载中...',
      items: [
        {
          label: '姓名',
          prop: 'name',
          type: 'input'
        },
        {
          label: '',
          name: '查询',
          prop: 'query',
          style: 'primary-form',
          type: 'button'
        }
      ],
      model: {
        name: null
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 10,
        sizes: [10, 15, 20, 25],
        total: 0
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    handle (type, data) {
      switch (type) {
        case 'query': {
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
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
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('name', this.model.name || '')

      // 数据加载中
      this.empty = '数据加载中...'
      this.axios.post(api.getPeopleAlarmPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.map(item => {
            item.createAt = item.createAt.replace(/T/, ' ')
            return item
          })
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
        this.empty = !this.pager.total ? '暂无数据' : ''
      })
    }
  }
}
</script>

<style scoped>
.people-analysis {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
/* TABLE */
.column-image {
  cursor: pointer;
  height: 70px;
  width: 140px;
}
</style>
