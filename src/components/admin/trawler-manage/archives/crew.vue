<template>

  <div>

    <app-dialog
      :config="config"
      title="船上人员"
      @close="close">

      <div class="trawler-crew">

        <app-table
          :columns="columns"
          :data="data"
          style="height: calc(100% - 60px);">
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

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  crew
} from '../configs'
import appDialog from '@/components/common/dialog'
import appTable from '@/components/common/table'
export default {
  name: 'trawler-crew',
  components: {
    'app-dialog': appDialog,
    'app-table': appTable
  },
  data () {
    return {
      config: {
        height: 540,
        width: 1100
      },
      columns: crew.columns.slice(),
      data: [],
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      }
    }
  },
  props: {
    'trawler-name': {
      default: '',
      required: false,
      type: String
    }
  },
  watch: {
    trawlerName: 'initData'
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    handleCurrentChange (e) {
      this.pager.current = e
      this.initData()
    },
    handleSizeChange (e) {
      this.pager.size = e
      this.initData()
    },
    initData () {
      const params = new FormData()
      params.append('boatName', this.trawlerName)
      params.append('pageNum', this.pager.current)
      params.append('pageSize', this.pager.size)

      this.axios.post(api.getCrewPage, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.data = res.result.records.slice()
          this.pager.total = res.result.total
        } else {
          this.$message.error(res.msg || '查询失败！')
          this.pager.total = 0
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('系统问题，请联系管理员！')
        this.pager.total = 0
      })
    }
  }
}
</script>

<style scoped>
.trawler-crew {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
</style>
