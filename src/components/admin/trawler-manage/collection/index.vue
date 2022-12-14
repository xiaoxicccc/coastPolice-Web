<template>

  <!-- <app-dialog
    :config="config"
    title="船舶收藏"> -->

  <div class="trawler-collection">

    <el-tabs
      v-model="tab.model"
      @tab-click="handleClick"
      style="flex-shrink: 0;">

      <el-tab-pane
        v-for="(item, i) in tab.data"
        :key="i"
        :label="item.label"
        :name="item.value">
      </el-tab-pane>

    </el-tabs>

    <div class="trawler-collection-list">

      <app-filter
        :filter-model="model"
        :filter-items="items"
        @handle="handle">
      </app-filter>

      <app-table
        :columns="columns"
        :controls="controls[tab.model]"
        :data="data"
        ref="app-table"
        style="height: calc(100% - 120px);"
        @handle="handle">
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

  </div>

  <!-- </app-dialog> -->

</template>

<script>
import api from '@/util/api'
import {
  collection
} from '../configs'
// import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
export default {
  name: 'trawler-collection',
  components: {
    // 'app-dialog': appDialog,
    'app-filter': appFilter,
    'app-table': appTable
  },
  data () {
    return {
      config: {
        height: 540,
        width: 1000
      },
      columns: collection.columns.slice(),
      controls: {
        collection: [
          {
            label: '取消收藏',
            prop: 'cancel',
            type: 'warning'
          }
        ],
        trawler: [
          {
            label: '添加收藏',
            prop: 'collect',
            type: 'primary'
          }
        ]
      },
      data: [],
      items: [
        {
          label: '船舶名称',
          prop: 'shipName',
          type: 'input'
        },
        // {
        //   label: '船主姓名',
        //   prop: 'ownerName',
        //   type: 'input'
        // },
        {
          label: '',
          name: '查询',
          prop: 'query',
          style: 'primary-form',
          type: 'button'
        }
      ],
      meta: null,
      model: {
        ownerName: null,
        shipName: null
      },
      pager: {
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        size: 15,
        sizes: [10, 15, 20, 50],
        total: 0
      },
      tab: {
        data: [
          {
            label: '船舶收藏列表',
            value: 'collection'
          },
          {
            label: '选择渔船',
            value: 'trawler'
          }
        ],
        model: 'collection'
      }
    }
  },
  watch: {
    $route: 'initPage'
  },
  mounted () {
    this.initPage()
  },
  methods: {
    handle (type, data) {
      switch (type) {
        case 'cancel':
        case 'collect':
          this.toggleCollection(type, data)
          break
        case 'query':
          this.model = Object.assign({}, data)
          this.handleCurrentChange(1)
          break
        default:
          break
      }
    },
    handleClick () {
      this.handleCurrentChange(1)
    },
    handleCurrentChange (e) {
      this.pager.current = e
      this.initPage()
    },
    handleSizeChange (e) {
      this.pager.size = e
      this.handleCurrentChange(1)
    },
    initData (params, url) {
      params.append('pageNum', this.pager.current)
      params.append('pageNo', this.pager.current)
      params.append('pageSize', this.pager.size)

      // 数据加载中
      this.$refs['app-table'].empty = '数据加载中...'
      this.data = []
      this.axios.post(url, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (res.result) {
            const data = res.result.records
            this.data = data.map(item => {
              return {
                department: item.departName,
                id: item.id,
                phone: item.ownerPhone,
                port: item.homePortName,
                shipName: item.name,
                shipOwner: item.ownerName
              }
            })
            this.pager.total = res.result.total
          } else {
            this.pager.total = 0
          }
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
    initPage () {
      // 匹配页面
      this.meta = this.$route.meta
      switch (this.meta.name) {
        case 'collection':
          this.meta.type = '收藏渔船'
          this.tab.data = [
            {
              label: '船舶收藏列表',
              value: 'collection'
            },
            {
              label: '选择渔船',
              value: 'trawler'
            }
          ]
          this.controls = {
            collection: [
              {
                label: '取消收藏',
                prop: 'cancel',
                type: 'warning'
              }
            ],
            trawler: [
              {
                label: '添加收藏',
                prop: 'collect',
                type: 'primary'
              }
            ]
          }
          break
        case 'focus':
          this.meta.type = '重点关注'
          this.tab.data = [
            {
              label: '重点关注列表',
              value: 'collection'
            },
            {
              label: '选择渔船',
              value: 'trawler'
            }
          ]
          this.controls = {
            collection: [
              {
                label: '取消关注',
                prop: 'cancel',
                type: 'warning'
              }
            ],
            trawler: [
              {
                label: '添加关注',
                prop: 'collect',
                type: 'primary'
              }
            ]
          }
          break
        default:
          break
      }
      const params = new FormData()
      let url = null
      switch (this.tab.model) {
        case 'collection':
          params.append('type', this.meta.type)
          params.append('shipName', this.model.shipName || '')
          // params.append('ownerName', this.model.ownerName || '')
          url = api.getTrawlerCollectionPage
          break
        case 'trawler':
          params.append('name', this.model.shipName || '')
          // params.append('ownerName', this.model.ownerName || '')
          url = api.getTrawlerArchivesPage
          break
        default:
          break
      }
      this.initData(params, url)
    },
    toggleCollection (type, data) {
      let message = null
      let url = null
      const userId = JSON.parse(localStorage.getItem('user')).userId
      const params = new FormData()
      if (type === 'collect') {
        message = this.meta.name === 'collection' ? '收藏' : '关注'
        url = api.addTrawlerCollection
        params.append('type', this.meta.type)
        params.append('userId', userId)
        params.append('boatId', data.id)
      } else {
        message = this.meta.name === 'collection' ? '取消收藏' : '取消关注'
        url = api.deleteTrawlerCollection
        params.append('id', data.id)
      }
      this.$confirm(`您确定${message}【${data.shipName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(url, params, { loading: true }).then(response => {
          const res = response.data
          if (res.code === '200') {
            this.$message.success('操作成功！')
            this.tab.model = 'collection'
            this.initPage()
          } else {
            this.$message.error(res.msg || '操作失败！')
          }
        }).catch(err => {
          this.$message.error('系统问题，请联系管理员！')
          console.error(err)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
.trawler-collection {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
.trawler-collection-list {
  display: flex;
  flex-direction: column;
  height: calc(100% - 54px);
  overflow: hidden;
}
</style>
