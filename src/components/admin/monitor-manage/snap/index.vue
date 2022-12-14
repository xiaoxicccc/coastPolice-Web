<template>

  <div class="snap-manage">

    <el-form
      class="snap-form"
      :model="model"
      size="small">

      <el-form-item
        class="snap-item"
        label="摄像头名称">

        <el-autocomplete
          v-model="model.name"
          :fetch-suggestions="querySearchAsync"
          value-key="label"
          placeholder="请输入内容">
        </el-autocomplete>

      </el-form-item>

      <el-form-item
        class="snap-item">

        <el-button
          type="primary">查询
        </el-button>

      </el-form-item>

    </el-form>

    <div class="snap-video-wrapper">

      <div class="snap-video">

        <div class="title">实时监控
        </div>

        <div class="span-video-window">

          <img
            alt="ICON_VIDEO"
            class="icon-video"
            src="/img/admin/snap/icon-video.png">

        </div>

      </div>

      <div class="snap-pictures">

        <div class="title">抓拍图片
        </div>

        <div class="snap-pictures-window">

          <el-carousel
            style="height: 100%;">

            <el-carousel-item
              v-for="item in 4"
              :key="item">

              <el-image
                style="width: 100%; height: 100%"
                :src="`/img/admin/snap/icon-picture-${item}.jpeg`"
                :preview-src-list="[`/img/admin/snap/icon-picture-${item}.jpeg`]">
              </el-image>

            </el-carousel-item>

          </el-carousel>

        </div>

      </div>

    </div>

  </div>

</template>

<script>
export default {
  name: 'snap-manage',
  data () {
    return {
      model: {
        name: null
      }
    }
  },
  methods: {
    querySearchAsync () {
    }
  }
}
</script>

<style scoped>
.snap-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  width: 100%;
}
/* FORM */
.snap-form {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
}
.snap-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-right: 10px;
}
/* WRAPPER */
.snap-video-wrapper {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
.snap-video-wrapper > div {
  width: 50%;
}
.snap-video-wrapper > div > .title {
  flex-shrink: 0;
  margin-bottom: 10px;
}
.snap-video {
  display: flex;
  flex-direction: column;
}
.span-video-window {
  background: linear-gradient(#FFD967, #FFD967) left top,
  linear-gradient(#FFD967, #FFD967) left top,
  linear-gradient(#FFD967, #FFD967) right top,
  linear-gradient(#FFD967, #FFD967) right top,
  linear-gradient(#FFD967, #FFD967) left bottom,
  linear-gradient(#FFD967, #FFD967) left bottom,
  linear-gradient(#FFD967, #FFD967) right bottom,
  linear-gradient(#FFD967, #FFD967) right bottom;
  background-repeat: no-repeat;
  background-size: 6px 6px, 6px 6px;
  border: 1px solid rgba(74, 160, 207, 1);
  box-sizing: border-box;
  flex-grow: 1;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
}
.icon-video {
  height: 100%;
  width: 100%;
}
/* PICTURES */
.snap-pictures {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
}
.snap-pictures-window {
  flex-grow: 1;
}
</style>
<style>
.snap-pictures-window .el-carousel__container {
  height: 100%;
}
</style>
