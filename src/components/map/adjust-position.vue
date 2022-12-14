<template>

  <div class="adjust-position">

    <div class="title">

      <span>调船位
      </span>

      <i
        class="el-icon-close icon-close"
        @click="close">
      </i>

    </div>

    <el-form
      class="adjust-position-form"
      :model="model"
      ref="adjust-position-form"
      :rules="rules"
      size="small">

      <el-form-item
        v-for="(item, i) in items"
        class="adjust-position-item"
        :key="i"
        :label="`${item.label}:`">

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          type="text">
        </el-input>

        <el-select
          v-if="item.type === 'select'"
          v-model="model[item.prop]">

          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :label="opt.label"
            :value="opt.value">
          </el-option>

        </el-select>

      </el-form-item>

    </el-form>

    <div class="adjust-position-control">

      <el-button
        size="small"
        type="primary"
        @click="query">查询
      </el-button>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'adjust-position',
  data () {
    return {
      items: [
        {
          label: '查询类型',
          prop: 'type',
          type: 'select',
          options: [
            {
              label: '船名号',
              value: 'shipName'
            },
            {
              label: 'MMSI',
              value: 'mmsi'
            }
          ]
        },
        {
          label: '关键词',
          prop: 'name',
          type: 'input'
        }
      ],
      model: {
        name: '',
        type: 'shipName'
      },
      rules: {
        name: [
          { required: true }
        ]
      },
      uuid: null
    }
  },
  methods: {
    close () {
      this.$emit('close', this.uuid)
    },
    query () {
      const params = new FormData()
      const mmsi = this.model.type === 'mmsi' ? this.model.name : ''
      const shipName = this.model.type === 'shipName' ? this.model.name : ''
      params.append('mmsi', mmsi)
      params.append('boatName', shipName)

      this.uuid = null
      this.axios.post(api.adjustTrawlerPosition, params).then(response => {
        const res = response.data
        if (res.code === '200' && res.result) {
          this.$emit('update', res.result)
          this.uuid = res.result.uuid
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
.adjust-position {
  background-color: rgba(25, 48, 128, .8);
  box-sizing: border-box;
  color: white;
  height: 200px;
  left: 400px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  position: fixed;
  top: 180px;
  width: 300px;
  z-index: 10;
}
/* TITLE */
.adjust-position .title {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.adjust-position .icon-close {
  cursor: pointer;
}
/* FORM */
.adjust-position-form {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.adjust-position-item {
  align-items: center;
  display: flex;
  flex-direction: row;
}
</style>
<style>
.adjust-position label {
  color: white !important;
  flex-shrink: 0;
  text-align: right !important;
  width: 80px !important;
}
</style>
