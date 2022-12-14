<template>

  <div class="screen-locate">

    <div class="title">

      <span>坐标定位
      </span>

      <i
        class="el-icon-close icon-close"
        @click="close">
      </i>

    </div>

    <div class="location">

      <!--<div class="location-title">

        <div
          v-for="(item, i) in title"
          class="title"
          :key="i">{{ item }}
        </div>

      </div>-->

      <div
        v-for="(item, i) in list"
        class="location-item"
        :key="i">

        <div
          v-if="model.active === item.label"
          class="location-sublist">

          <div
            v-for="(_item, index) in item.children"
            class="location-subitem"
            :key="index">

            <span class="sublabel">{{ _item.label }}
            </span>

            <el-input
              v-model="model[_item.prop]"
              size="small"
              type="text">
            </el-input>

            <span class="unit">{{ _item.unit }}
            </span>

            <el-switch
              v-model="_item.direction"
              :active-text="_item.active"
              :inactive-text="_item.inactive"
              style="flex-shrink: 0;">
            </el-switch>

          </div>

        </div>

      </div>

    </div>

    <div class="control">

      <el-button
        size="small"
        type="primary"
        @click="locate">定位
      </el-button>

      <!--<el-button
        size="small">取消
      </el-button>-->

    </div>

  </div>

</template>

<script>
export default {
  name: 'screen-locate',
  data () {
    return {
      title: ['度', '度分', '度分秒'],
      list: [
        {
          label: '度',
          children: [
            {
              active: '东经',
              direction: true,
              inactive: '西经',
              label: '经度',
              max: 180,
              prop: 'longitude',
              unit: '°'
            },
            {
              active: '北纬',
              direction: true,
              inactive: '南纬',
              label: '纬度',
              max: 90,
              prop: 'latitude',
              unit: '°'
            }
          ]
        },
        {
          label: '度分'
        }
      ],
      model: {
        active: '度',
        latitude: null,
        longitude: null
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    locate () {
      switch (this.model.active) {
        case '度': {
          if (this.model.latitude && this.model.longitude) {
            const index = this.list.findIndex(item => item.label === this.model.active)
            const data = this.list[index].children
            const longitude = data[0].direction ? this.model.longitude : -(this.model.longitude - 0)
            const latitude = data[1].direction ? this.model.latitude : -(this.model.latitude - 0)
            this.$emit('locate', latitude, longitude)
          } else {
            this.$message.warning('请输入经纬度数据！')
          }
          break
        }
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
.screen-locate {
  background-color: rgba(25, 48, 128, .8);
  /*background-image: linear-gradient(180deg, rgba(25, 48, 128, 0.16) 1%, rgba(25, 48, 128, 0.8) 48%, rgba(25, 48, 128, 0) 100%);*/
  bottom: 80px;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  font-family: 'SHSCNN';
  height: 180px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  position: fixed;
  right: 440px;
  width: 400px;
  z-index: 10;
}
/* TITLE */
.screen-locate .title {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.screen-locate .icon-close {
  cursor: pointer;
}
/* TITLE */
.location-title {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/* ITEM */
.location {
  display: flex;
  flex-direction: column;
}
.location-item {
  display: flex;
  flex-direction: column;
}
.location-sublist {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.location-subitem {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.location-subitem .sublabel {
  flex-shrink: 0;
  margin-right: 5px;
}
.location-subitem .unit {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
<style>
.location-subitem .el-switch__label {
  color: rgba(255, 255, 255, .4) !important;
}
.location-subitem .el-switch__label.is-active {
  color: rgba(255, 255, 255, 1) !important;
}
</style>
