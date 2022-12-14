<template>

  <div class="screen-title">

    <img
      v-if="title"
      class="background"
      alt=""
      src="/img/screen/icon-title-background.png">

    <img
      v-if="subTitle"
      class="sub-background"
      alt=""
      src="/img/screen/icon-subtitle-background.png">

    <span
      class="text"
      :class="{'active': icon}"
      >{{ title || subTitle }}

      <img
        v-if="edit"
        alt="ICON_EDIT"
        class="icon-edit"
        src="/img/screen/analysis/icon-edit.png"
        @click="handle('edit')">

      <img
        v-if="icon"
        alt="ICON_EXCLAMATION"
        class="icon-exclamation"
        src="/img/screen/index/icon-exclamation.png">

    </span>

    <el-switch
      v-if="showSwitch"
      class="switch-control"
      v-model="model.switch"
      active-text="开"
      inactive-text="关"
      size="small"
      @change="changeSwitch">
    </el-switch>

  </div>

</template>

<script>
export default {
  name: 'screen-title',
  data () {
    return {
      model: {
        switch: false
      }
    }
  },
  props: {
    edit: {
      default: false,
      required: false,
      type: Boolean
    },
    icon: {
      default: false,
      required: false,
      type: Boolean
    },
    'sub-title': {
      default: '',
      required: false,
      type: String
    },
    'show-switch': {
      default: false,
      required: false,
      type: Boolean
    },
    title: {
      default: '',
      required: false,
      type: String
    }
  },
  methods: {
    handle (type) {
      const params = {
        prop: type
      }
      this.$emit('handle', params)
    },
    changeSwitch () {
      this.$emit('change', this.model.switch)
    }
  }
}
</script>

<style scoped>
.screen-title {
  flex-shrink: 0;
  height: 26px;
  position: relative;
  width: 319px;
}
.screen-title .background {
  bottom: 0;
  height: 21px;
  left: 0;
  position: absolute;
  width: 100%;
}
.screen-title .text {
  bottom: 2px;
  color: rgba(255, 255, 255, 1);
  font-family: 'PMZDR';
  font-size: 22px;
  left: 33px;
  position: absolute;
}
.screen-title .text.active {
  color: #F00;
}
.sub-background {
  bottom: 8px;
  height: 14px;
  left: 10px;
  position: absolute;
  width: 14px;
}
.switch-control {
  position: absolute;
  right: 5px;
  top: 0;
}
.switch-control >>> .el-switch__label.is-active,
.switch-control >>> .el-switch__label {
  color: white;
}

/* EDIT */
.icon-edit {
  cursor: pointer;
}
/* EXCLAMATION */
.icon-exclamation {
  cursor: pointer;
  height: 20px;
  width: 20px;
}
</style>
