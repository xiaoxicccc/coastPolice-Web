<template>

  <div class="rule-config">

    <div class="title">

      <span>规则配置
      </span>

      <i
        class="el-icon-close icon-close"
        @click="close">
      </i>

    </div>

    <el-form
      class="rule-config-form"
      :model="model"
      ref="rule-config-form"
      :show-message="false"
      size="small">

      <el-form-item
        v-for="(item, index) in items[type]"
        class="rule-config-item"
        :key="index"
        :label="item.label"
        required>

        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.prop]"
          type="text"
          style="flex-grow: 1;">
        </el-input>

        <el-time-picker
          v-if="item.type === 'time'"
          v-model="model[item.prop]"
          :picker-options="{
            selectableRange: item.range
          }"
          value-format="HH:mm:ss"
          style="flex-grow: 1;"
          @change="updateTime">
        </el-time-picker>

        <span
          v-if="item.unit"
          class="unit">{{ item.unit }}
        </span>

      </el-form-item>

    </el-form>

    <div class="rule-config-control">

      <div
        class="rule-config-control-item"
        @click="validate()">确定
      </div>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
export default {
  name: 'rule-config',
  data () {
    return {
      items: {
        crossing: [
          {
            label: '船长阈值',
            name: '围栏越界船长阈值',
            params: true,
            prop: 'length',
            type: 'input',
            unit: '米'
          },
          {
            label: '航速阈值',
            name: '围栏越界航速阈值',
            params: true,
            prop: 'speed',
            type: 'input',
            unit: '节'
          },
          {
            label: '开始时间',
            name: '围栏越界时间范围',
            params: false,
            prop: 'startTime',
            range: '18:30:00 - 20:30:00',
            // range: `'00:00:00' - ${this.model.endTime}`,
            type: 'time',
            unit: ''
          },
          {
            label: '结束时间',
            name: '',
            params: false,
            prop: 'endTime',
            range: '18:30:00 - 20:30:00',
            // range: `${this.model.startTime} - '23:59:59'`,
            type: 'time',
            unit: ''
          }
        ],
        satellite: [
          {
            label: '离线规则',
            name: '北斗离线阈值',
            params: true,
            prop: 'keyword',
            type: 'input',
            unit: '小时'
          }
        ]
      },
      model: {
        endTime: '23:59:59',
        keyword: 0,
        length: 0,
        speed: 0,
        startTime: '00:00:00'
      }
    }
  },
  props: {
    type: {
      default: '',
      required: false,
      type: String
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    initData () {
      const items = this.items[this.type]
      // 更新时间阈值设置
      this.updateTime()
      const params = new FormData()
      params.append('type', items.map(item => {
        return item.name
      }).join(','))

      this.axios.post(api.getAnalysisSwitchStatus, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          const result = res.result
          result.map(item => {
            const prop = items.find(_item => _item.name === item.type).prop
            if (item.params) {
              this.model[prop] = item.value
            }
            if (this.type === 'crossing' && item.type === '围栏越界时间范围') {
              const time = item.value ? item.value.split('-') : ['00:00:00', '23:59:59']
              this.model.startTime = time[0]
              this.model.endTime = time[1]
            }
          })
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    submit () {
      const items = this.items[this.type]
      const params = []
      items.forEach((item) => {
        if (item.params) {
          params.push({
            type: item.name,
            value: this.model[item.prop]
          })
        }
      })
      if (this.type === 'crossing') {
        if (this.model.startTime && this.model.endTime) {
          params.push({
            type: '围栏越界时间范围',
            value: `${this.model.startTime}-${this.model.endTime}`
          })
        } else {
          this.$message.warning('请选择围栏越界时间范围！')
          return null
        }
      }

      this.axios.post(api.changeAnalysisSwitchStatusList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$message.success('操作成功！')
          this.initData()
        }
      }).catch(err => {
        console.error(err)
      })
    },
    updateTime () {
      if (this.type === 'crossing') {
        this.items[this.type][2].range = `'00:00:00' - ${this.model.endTime}`
        this.items[this.type][3].range = `${this.model.startTime} - '23:59:59'`
      }
    },
    validate () {
      this.$refs['rule-config-form'].validate((valid) => {
        if (valid) {
          this.submit()
        }
      })
    }
  }
}
</script>

<style scoped>
.rule-config {
  background-color: rgba(0, 10, 45, 0.8);
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  /*height: 240px;*/
  left: 50%;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 330px;
  z-index: 10;
}
/* TITLE */
.rule-config .title {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: space-between;
  margin-bottom: 15px;
}
.rule-config .icon-close {
  cursor: pointer;
}
/* FORM */
.rule-config-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.rule-config-item {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.rule-config-item >>> .el-form-item__label {
  color: white;
  flex-shrink: 0;
}
.rule-config-item >>> .el-form-item__content {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
.rule-config-item >>> .el-form-item__content .unit {
  flex-shrink: 0;
  margin-left: 10px;
}
/* CONTROL */
.rule-config-control {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: center;
}
.rule-config-control-item {
  background-image: linear-gradient(180deg, #29CCFF 0%, #2989FF 61%);
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: 'DINM';
  font-size: 15px;
  height: 36px;
  line-height: 36px;
  width: 88px;
}
.rule-config-control-item:hover {
  background-image: linear-gradient(180deg, #2989FF 0%, #29CCFF 61%);
}
</style>
