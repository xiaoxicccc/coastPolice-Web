<template>

  <div>

    <el-table
      :data="data"
      :empty-text="empty"
      height="100%"
      ref="app-table"
      size="small"
      stripe>

      <el-table-column
        v-if="config.type === 'index'"
        label="#"
        type="index"
        :width="55">
      </el-table-column>

      <el-table-column
        v-if="config.type === 'selection'"
        type="selection"
        :width="55">
      </el-table-column>

      <el-table-column
        v-for="(item, i) in columns"
        :key="i"
        align="left"
        :label="item.label"
        :prop="item.prop"
        show-overflow-tooltip
        :min-width="item.width">
      </el-table-column>

      <el-table-column
        v-if="controls.length"
        align="left"
        fixed="right"
        label="操作"
        :width="config.width">

        <template slot-scope="props">

          <template
            v-for="(item, i) in controls">

            <span
              v-if="!item.power || (item.power && item.value === props.row[item.keyname])"
              class="button"
              :role="item.type"
              :key="i"
              @click="handle(item.prop, props.row)">{{ item.label }}
            </span>

          </template>

        </template>

      </el-table-column>

    </el-table>

  </div>

</template>

<script>
export default {
  name: 'app-table',
  data () {
    return {
      empty: '暂无数据'
    }
  },
  props: {
    columns: {
      default () {
        return [
        ]
      },
      required: false,
      type: Array
    },
    config: {
      default () {
        return {
          type: 'index',
          width: 90
        }
      },
      required: false,
      type: Object
    },
    controls: {
      default () {
        return [
        ]
      },
      required: false,
      type: Array
    },
    data: {
      default () {
        return [
        ]
      },
      required: false,
      type: Array
    }
  },
  methods: {
    handle (type, data) {
      this.$emit('handle', type, data)
    },
    layout () {
      this.$refs['app-table'].doLayout()
    }
  }
}
</script>

<style scoped>

</style>
