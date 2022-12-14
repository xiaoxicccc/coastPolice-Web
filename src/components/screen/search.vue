<template>

  <div class="trawler-search">

    <div class="trawler-search-frame">

      <i
        class="iconfont icon-sousuo2 search-icon"
        @click="debounce">
      </i>

      <el-input
        v-model="model.keyword"
        class="search-input"
        placeholder="请输入船名号/MMSI"
        size="small"
        @input="debounce">
      </el-input>

    </div>

    <ul :class="['trawler-search-list', autocomplete]">

      <li
        v-for="(item, i) in data"
        class="trawler-search-item"
        :key="i"
        :title="`${item.boatName} - ${item.mmsi}(${item.msgType})`"
        @click="locate(item)">{{ item.boatName }} - {{ item.mmsi }}({{ item.msgType }})
      </li>

    </ul>

  </div>

</template>

<script>
import api from '@/util/api'
import * as $config from '@/components/map/configs'
export default {
  name: 'trawler-search',
  data () {
    return {
      autocomplete: '',
      data: [
      ],
      flag: false,
      model: {
        keyword: null
      }
    }
  },
  watch: {
    // 'model.keyword': 'debounce'
  },
  methods: {
    debounce () { // 函数防抖
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.timeout = setTimeout(() => {
        this.initData()
      }, 500)
    },
    initData () {
      this.data = []
      this.autocomplete = this.data.length ? 'active' : ''
      if (!this.model.keyword) {
        return null
      }
      const params = new FormData()
      params.append('keyWord', this.model.keyword)

      this.flag = true
      this.axios.post(api.fuzzySearchTrawlerByKey, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          if (this.flag) {
            this.data = this.model.keyword ? res.result : []
            this.autocomplete = this.data.length ? 'active' : ''
          }
        } else {
          console.error(res.msg)
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.flag = false
      })
    },
    locate (data) {
      this.data = []
      this.autocomplete = this.data.length ? 'active' : ''
      this.model.keyword = data.boatName
      const info = $config.formartTrawlerInfo(data)
      window.$screen.locate(data.longitude, data.latitude, info)
    }
  }
}
</script>

<style scoped>
.trawler-search {
  left: 400px;
  position: fixed;
  top: 120px;
  z-index: 10;
}
/* FILTER */
.trawler-search-frame {
  align-items: center;
  background-color: rgba(19, 77, 165, 0.6);
  border: 1px solid rgba(2, 179, 255, 0.37);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 32px;
  padding-left: 11px;
  width: 350px;
}
.search-icon {
  color: rgba(24, 255, 247, 1);
  cursor: pointer;
  font-size: 17px;
}
/* LIST */
.trawler-search-list {
  background-color: rgba(19, 77, 165, .6);
  box-sizing: border-box;
  max-height: 0px;
  opacity: 0;
  overflow-y: auto;
  visibility: hidden;
  width: 350px;
}
.trawler-search-list.active {
  margin-top: 10px;
  max-height: 150px;
  opacity: 1;
  padding-bottom: 10px;
  padding-top: 10px;
  visibility: visible;
}
.trawler-search-item {
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  overflow:hidden;
  padding-left: 10px;
  text-align: left;
  text-overflow:ellipsis;
  white-space:nowrap;
  width: 100%;
}
.trawler-search-item:hover {
  background-color: rgba(255, 255, 255, .3);
}
</style>
<style>
.search-input .el-input__inner {
  background-color: transparent !important;
  border: none !important;
}
</style>
