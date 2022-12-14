<template>

  <!-- 搜索区组件 -->
  <el-form
    class="form filter-form"
    :model="model">

    <el-form-item
      v-for="(item, i) in items"
      class="filter-item"
      :key="i"
      :label="item.label"
      size="small">

      <el-input
        v-if="item.type === 'input'"
        v-model="model[item.prop]"
        size="small"
        style="width: 200px;">
      </el-input>

      <el-select
        v-if="item.type === 'select'"
        v-model="model[item.prop]"
        clearable
        size="small"
        style="width: 200px;"
        @change="handle(item.event)">

        <el-option
          v-for="(opt, index) in item.options"
          :key="index"
          :label="opt.label"
          :value="opt.value">
        </el-option>

      </el-select>

      <el-dropdown
        v-if="item.type === 'dropdown'"
        @command="handleCommand">

        <el-button
          type="primary">
          {{ item.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>

        <el-dropdown-menu slot="dropdown">

          <el-dropdown-item
            v-for="(opt, index) in item.options"
            :command="opt.value"
            :key="index">{{ opt.label }}
          </el-dropdown-item>

        </el-dropdown-menu>

      </el-dropdown>

      <el-autocomplete
        v-if="item.type === 'autocomplete'"
        v-model="model[item.prop]"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @focus="querySearch(item.options, item.prop)"
        @input="querySearch(item.options, item.prop)">
      </el-autocomplete>

      <!-- 时间选择器-由于需求需要限制清空功能，未避免改动太大，对clear字段取反限制是否可清空 -->
      <el-date-picker
        v-if="item.type === 'timerange'"
        v-model="model[item.prop]"
        :clearable="!item.clear"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>

      <el-date-picker
        v-if="item.type === 'daterange'"
        v-model="model[item.prop]"
        :clearable="!item.clear"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>

      <el-date-picker
        v-if="item.type === 'dataTime'"
        v-model="model[item.prop]"
        :clearable="!item.clear"
        type="date"
        placeholder="请选择日期"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>

      <span
        v-if="item.type === 'button'"
        class="button"
        :role="item.style"
        @click="handle(item.prop)">{{ item.name }}
      </span>

    </el-form-item>

  </el-form>

</template>

<script>
export default {
  name: 'app-filter',
  data () {
    return {
      items: [],
      model: {},
      options: []
    }
  },
  props: {
    'filter-items': {
      default () {
        return [
        ]
      },
      required: false,
      type: Array
    },
    'filter-model': {
      default () {
        return {
        }
      },
      required: false,
      type: Object
    }
  },
  watch: {
    filterItems: 'toggleItems'
  },
  mounted () {
    this.items = this.filterItems.slice()
    this.model = Object.assign({}, this.filterModel)
  },
  methods: {
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
      }
    },
    handle (type) {
      this.$emit('handle', type, this.model)
    },
    handleCommand (e) {
      this.$emit('handle', 'command', e)
    },
    querySearch (data, prop) {
      this.options = data.slice()
    },
    querySearchAsync (queryString, cb) {
      const restaurants = this.options
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    toggleItems () {
      this.items = this.filterItems.slice()
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.filter-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.filter-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px !important;
}
.filter-item:not(:last-child) {
  margin-right: 20px!important;
}
</style>
