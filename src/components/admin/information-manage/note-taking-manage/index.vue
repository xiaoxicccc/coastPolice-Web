<template>
  <div class="note-taking-manage">
    <app-filter
      :filter-items="items"
      :filter-model="model"
      @handle="handle">
    </app-filter>
    <div class="note-taking-list-warp">
      <div
        class="note-taking-manage-list"
        v-for="item in dataList"
        :key="item.id"
        @click="handle('check',item)">
        <div class="note-taking-img" @click.stop="clickImg">
          <el-image
            style="width: 100%; height: 100%"
            :src="item.imgSrc"
            fit="cover"
            :preview-src-list="[item.imgSrc]"
            v-if="item.imgSrc">
          </el-image>
          <img
            src="/img/admin/noteTaking/noImg.png"
            alt="暂无图片"
            v-else>
        </div>
        <div class="note-taking-right">
          <div class="title">
            {{item.title}}
          </div>
          <div class="content">
            <p>{{item.text}}</p>
          </div>
          <div class="bottom">
            <img src="/img/admin/noteTaking/icon-note-1.png" style="width: 16px;height: 16px;" v-if="item.isImg" >
            <img src="/img/admin/noteTaking/icon-note-2.png" style="width: 20px;height: 20px;margin-top: -2px;" v-if="item.isAudio">
            <img src="/img/admin/noteTaking/icon-note-3.png" style="width: 16px;height: 16px;" v-if="item.isVideo">
          </div>
        </div>
      </div>
    </div>
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
    <el-drawer
      append-to-body
      :direction="drawer.direction"
      :visible.sync="drawer.visible"
      :with-header="false"
      size="700px">
      <app-detail
        v-if="drawer.visible"
        :detail="drawer.detail"
        :id="drawer.id"
        :type="drawer.type"
        :status ="drawer.status"
        @close="close">
      </app-detail>
    </el-drawer>
  </div>
</template>

<script>
import { noteTaking } from '../configs'
import api from '@/util/api'
import appFilter from '@/components/common/filter'
import appDetail from './detail'

export default {
  components: {
    'app-filter': appFilter,
    'app-detail': appDetail
  },
  data () {
    return {
      dataList: [],
      drawer: {
        detail: {},
        direction: 'rtl',
        id: '',
        status: '',
        type: '',
        visible: false
      },
      items: noteTaking.items.slice(),
      model: Object.assign({}, noteTaking.model),
      pager: {
        current: 1,
        layout: 'total, prev, pager, next, jumper',
        size: 6,
        // sizes: [6],
        total: 0
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    clickImg () {
      return false
    },
    close (visible) {
      this.drawer.visible = false
    },
    getSimpleText (html) {
      const re1 = new RegExp('<.+?>', 'g') // 匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      // 执行替换成空字符
      return html.replace(re1, '')
    },
    getImg (data) {
      const arr = []
      if (data) {
        data.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
          arr.push(capture)
        })
      }
      return arr
    },
    getList () {
      const params = new FormData()
      params.append('pageIndex', this.pager.current)
      params.append('pageSize', this.pager.size)
      params.append('manageStatus', this.model.manageStatus || '')
      params.append('importantGrade', this.model.importantGrade || '')
      params.append('inputDate', this.model.inputDate || '')
      params.append('title', this.model.title || '')
      params.append('content', this.model.content || '')
      this.dataList = []
      // 数据加载中
      this.axios.post(api.getNoteTakingList, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.pager.total = res.result.total
          this.dataList = res.result.records.slice()
          this.dataList.forEach(item => {
            if (item.content) {
              const imgArr = this.getImg(item.content)
              item.isImg = !!item.content.includes('<img')
              item.isVideo = !!item.content.includes('<video')
              item.isAudio = !!item.content.includes('<audio')
              item.text = this.getSimpleText(item.content)
              if (imgArr.length > 0) {
                item.imgSrc = imgArr[0]
              } else {
                item.imgSrc = ''
              }
            } else {
              item.isImg = false
              item.isAudio = false
              item.isVideo = false
            }
          })
        } else {
          this.$message.error(res.msg)
          this.pager.total = 0
        }
      }).catch(err => {
        this.pager.total = 0
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      })
    },
    handle (type, item) {
      switch (type) {
        case 'query':
          this.model = Object.assign({}, item)
          this.handleCurrentChange(1)
          break
        case 'check':
          this.drawer.id = String(item.id)
          this.drawer.detail = Object.assign({}, item)
          this.drawer.status = 'check'
          this.drawer.title = '笔记详情'
          this.drawer.visible = true
          break
      }
    },
    handleSizeChange (e) {
      this.pager.size = e
      this.getList()
    },
    handleCurrentChange (e) {
      this.pager.current = e
      this.getList()
    }
  }
}
</script>

<style scoped>
.imageStyle {

}
.note-taking-manage {
  height: 100%;
  /* display: flex;
  flex-direction: column; */
  /* padding-bottom: 20px; */
  padding-left: 20px;
  /* padding-right: 24px; */
  padding-top: 20px;
  width: 100%;
  overflow:auto;

}
/* FORM */
.note-taking-manage-form {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.note-taking-manage-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  margin-right: 20px;
}
.note-taking-list-warp {
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  height: 70%;
}
.note-taking-manage-list {
  width: 32%;
  height: 240px;
  margin: 20px 20px 0 0;
  background: #FFFFFF;
  border-radius: 2px 2px 2px 2px;
  opacity: 1;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px;
  cursor:pointer;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
}
.note-taking-img {
  width: 42%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: #EDEFF5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.note-taking-right {
  width: 54%;
  height: 100%;
  text-align: left;
}
.title {
  font-size: 18px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 600;
  color: #131415;
  line-height: 28px;
  text-align: left;
}
.content {
  width: 100%;
  height: 120px;
  font-size: 15px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  text-align: left;
  color: rgba(19, 20, 21, 0.8);
  line-height: 28px;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 32px;

}
.bottom{
  /* width: 403px; */
  height: 10%;
  display: flex;
  justify-content: space-between;
  padding: 0 29px;
}
</style>
