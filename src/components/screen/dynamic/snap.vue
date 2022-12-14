<template>

  <div class="monitor-snap">

    <div class="monitor-snap-list">

      <div
        v-for="(item, index) in items"
        class="monitor-snap-item"
        :class="{ 'active': active === index }"
        :key="index"
        @click="toggle(item, index)">

        <div>{{ item.label }}
        </div>

      </div>

    </div>

    <div class="monitor-snap-image-list">

      <div
        v-for="(item, index) in 4"
        class="monitor-snap-image-item"
        :key="index">

        <el-image
          :class="[visible, 'image-item']"
          style="height: 100%; width: 100%;"
          :src="srcList[item - 1]"
          :preview-src-list="srcList">
        </el-image>

      </div>

    </div>

  </div>

</template>

<script>
import api from '@/util/api'
import Vue from 'vue'
export default {
  name: 'monitor-snap',
  data () {
    return {
      active: 0,
      data: {
        portrait: [],
        vehicle: []
      },
      items: [
        {
          label: '人像抓拍',
          prop: 'portrait'
        },
        {
          label: '车辆抓拍',
          prop: 'vehicle'
        }
      ],
      srcList: ['/img/icon-trawler.png', '/img/icon-trawler.png', '/img/icon-trawler.png', '/img/icon-trawler.png'],
      timer: null, // 图片计时器
      visible: ''
    }
  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  mounted () {
    // 暂时注释
    // this.initData()
  },
  methods: {
    async getImgURLOfBase64 (url, caseId) {
      // 这里获取图片的地址，如果知道地址，直接绕过这部
      // 通过图片地址获取图片，从新获取图片
      const config = {
        method: 'get',
        responseType: 'arraybuffer',
        url: url,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,Access-Token,session_id,Secret,Authorization',
          session_id: caseId
        }
      }
      // 重新获取请求，获取的是base64位的图片
      return await Vue.axios(config).then(response => {
        return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      })
    },
    initData () {
      // this.visible = 'visible'
      // this.srcList = []
      // for (let i = 1; i < 13; i++) {
      //   this.srcList.push(`/img/screen/people/people-${i}.jpg`)
      // }
      // this.timer = setInterval(() => {
      //   this.visible = ''
      //   const img = this.srcList.shift()
      //   this.srcList.push(img)
      //   setTimeout(() => {
      //     this.visible = 'visible'
      //   }, 500)
      // }, 1000 * 5)

      // 人像抓拍固定图片
      // if (!this.active) {
      //   this.srcList = []
      //   for (let i = 1; i < 8; i++) {
      //     this.srcList.push(`/img/screen/people/icon-people-${i}.jpg`)
      //   }
      //   if (this.timer) {
      //     clearInterval(this.timer)
      //     this.timer = null
      //   }
      //   setTimeout(() => {
      //     this.visible = 'visible'
      //   }, 500)
      //   this.timer = setInterval(() => {
      //     this.visible = ''
      //     const img = this.srcList.shift()
      //     this.srcList.push(img)
      //     setTimeout(() => {
      //       this.visible = 'visible'
      //     }, 500)
      //   }, 1000 * 5)
      // } else {
      //   this.loadData()
      //   if (this.timer) {
      //     clearInterval(this.timer)
      //     this.timer = null
      //   }
      //   this.timer = setInterval(() => {
      //     // 暂时注释
      //     this.loadData()
      //   }, 1000 * 5)
      // }
      this.loadData()
      this.timer = setInterval(() => {
        // 暂时注释
        this.loadData()
      }, 1000 * 5)
    },
    loadData () {
      this.visible = ''
      const params = new FormData()
      params.append('pageNum', 1)
      params.append('pageSize', 4)
      let url = api.getPeopleAlarmPage
      if (!this.active) {
        url = api.getPeopleAlarmPage
      } else {
        url = api.getCarAlarmPage
      }

      this.axios.post(url, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          // if (!this.active) {
          //   this.srcList = []
          //   res.result.records.map(item => {
          //     this.getImgURLOfBase64(item.faceImageUri, item.sessionId).then(responses => {
          //       this.srcList.push(responses)
          //       return responses
          //     })
          //   })
          // } else {
          //
          // }
          this.srcList = res.result.records.map(item => {
            return !this.active ? item.faceImageUri : item.vehiclePicUrl
          })
          setTimeout(() => {
            this.visible = 'visible'
          }, 500)
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    toggle (data, index) {
      this.active = index
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.initData()
    }
  }
}
</script>

<style scoped>
.monitor-snap {
}
/* TITLE_LIST */
.monitor-snap-list {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding-left: 13px;
  width: 100%;
}
.monitor-snap-item {
  background-image: url('/img/screen/index/icon-snap-background.png');
  background-size: 100% 100%;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: 'YSHTR';
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 80px;
}
.monitor-snap-item.active {
  background-image: url('/img/screen/index/icon-snap-background-active.png');
  color: rgba(254, 194, 48, 1);
}
.monitor-snap-item:first-child {
  margin-right: 18px;
}
/* IMAGE */
.monitor-snap-image-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.monitor-snap-image-item {
  background: linear-gradient(#FFD967, #FFD967) left top,
  linear-gradient(#FFD967, #FFD967) left top,
  linear-gradient(#FFD967, #FFD967) right top,
  linear-gradient(#FFD967, #FFD967) right top,
  linear-gradient(#FFD967, #FFD967) left bottom,
  linear-gradient(#FFD967, #FFD967) left bottom,
  linear-gradient(#FFD967, #FFD967) right bottom,
  linear-gradient(#FFD967, #FFD967) right bottom;
  background-repeat: no-repeat;
  background-size: 3px 3px, 3px 3px;
  border: 1px solid rgba(1, 255, 255, .2);
  box-sizing: border-box;
  height: 110px;
  margin-top: 8px;
  padding: 5px;
  width: 156px;
}
.monitor-snap-image-item:nth-child(2n) {
  margin-left: 8px;
}
.monitor-snap-image-item img{
  height: 100%;
  width: 100%;
}
/* IMAGE */
.image-item {
  opacity: 0;
  transition-duration: .2s;
  visibility: hidden;
}
.image-item.visible {
  opacity: 1;
  transition-duration: .2s;
  visibility: visible;
}
</style>
