<template>

  <div class="organization-manage">

    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>

    <el-table
      border
      :data="data"
      :empty-text="empty"
      row-key="id"
      size="small"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="height: calc(100% - 110px);">

      <el-table-column
        v-for="(item, i) in columns"
        :key="i"
        :label="item.label"
        :prop="item.prop"
        show-overflow-tooltip
        :width="item.width">
      </el-table-column>

    </el-table>

  </div>

</template>

<script>
import api from '@/util/api'
import {
  organization
} from '../configs'
import appFilter from '@/components/common/filter'
export default {
  name: 'organization-manage',
  components: {
    'app-filter': appFilter
  },
  data () {
    return {
      columns: organization.columns.slice(),
      data: [],
      empty: '暂无数据',
      items: [
        {
          label: '关键词',
          prop: 'keyWord',
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
        keyWord: null
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    handle (type, data) {
      switch (type) {
        case 'query':
          this.model.keyWord = data.keyWord
          this.initData()
          break
        default:
          break
      }
    },
    initData () {
      const params = new FormData()
      params.append('keyWord', this.model.keyWord || '')

      this.data = []
      // 数据加载中
      this.empty = '数据加载中'
      this.axios.post(api.getOrganizationTree, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const data = res.result ? res.result.children[0].children : []
          this.data = data.map(item => {
            return {
              children: item.children.map(_item => {
                return {
                  id: _item.id,
                  label: `${item.orgName}-${_item.label}`,
                  name: _item.orgName,
                  type: _item.type,
                  weight: _item.weight
                }
              }),
              id: item.id,
              label: item.label,
              name: item.orgName,
              type: item.type,
              weight: item.weight
            }
          })
        } else {
          this.$message.error(res.msg || '查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        this.empty = !this.data.length ? '暂无数据' : ''
      })
    }
  }
}
</script>

<style scoped>
.organization-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
</style>
