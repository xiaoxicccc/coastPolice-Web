<template>

  <!-- 绑定父组件class：videoWindow -->
  <div
    id="playWnd"
    ref="video-preview">
  </div>

</template>

<script>
/* eslint-disable */
require('./js/jsencrypt.min')
require('./js/jsWebControl-1.0.1.min')
// import { videoPlayConfig } from '@/config'
import { wait } from '@/util/util'

export default {
  name: 'video-preview',
  data() {
    return {
      index: 0,
      width: 0,
      height: 0,
      // secret: videoPlayConfig.secret,
      streamMode: 0, // 主子码流标识 1:子码流 0:主码流
      transMode: 1, // 传输协议 1:TCP 0:UDP
      gpuMode: 0, // 是否启用GPU硬解
      oWebControl: {},
      initCount: 0,
      // appkey: videoPlayConfig.appkey,
      // ip: videoPlayConfig.ip,
      // port: videoPlayConfig.port,
      snapDir: 'D:\\SnapDir',
      videoDir: 'D:\\VideoDir',
      // layout: '',
      // cameraIndexCode: '',
      playMode: 0,
      szShowToolbar: 1, // 显示工具栏,
      szShowSmart: 1, // 显示智能信息=
      btIds: '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769', // 工具条按钮ID集
      pubKey: '',
      enableHttps: 1, // 是否启用https
      showToolbar: 1,
      showSmart: 1,
      specialCodes: [
        'ebf3f1e476d641e69f7528ef5152ef40',
        '5e8d65c89e5645ea89369c2993ec96e1',
        '4b559635b43845d5984930dd65e48fd9',
        'f5b38ddfb3754a558d6d80047f713d8d',
        '906f825b22b2498796d86bb592666f3c',
        'dca7c29cfc9e43f1b5f40c6b92405b27'
      ],
      encryptedFields: 'secret',
      isInit: false
    }
  },
  props: {
    appkey: {
      default: '',
      required: false,
      type: String
    },
    ip: {
      default: '',
      required: false,
      type: String
    },
    layout: {
      type: String,
      default: () => '1x1'
    },
    cameraIndexCode: {},
    port: {
      default: 0,
      required: false,
      type: Number
    },
    secret: {
      default: '',
      required: false,
      type: String
    },
    timeOut: {
      type: Number,
      default: () => 500
    }
  },
  mounted() {
    var that = this
    this.$nextTick(function() {
      that.windowChange()
      setTimeout(() => {
        that.initPlugin()
      }, that.timeOut)
      window.addEventListener('resize', function() {
        if (that.oWebControl) {
          that.windowChange()
          that.oWebControl.JS_Resize(that.width, that.height)
        }
      })
    })
  },
  destroyed() {
    this.uninit()
  },
  methods: {
    setLayout(layout = '1x1') {
      return new Promise((resolve, reject) => {
        if (!this.isInit) {
          reject('未完成视频插件初始化')
        }
        this.oWebControl.JS_RequestInterface({
          funcName: 'setLayout',
          argument: JSON.stringify({
              'layout': layout
          })
        }).then(function(oData) {
          resolve()
        })
      })
    },
    // 初始化plugin
    initPlugin() {
      let that = this
      this.oWebControl = new WebControl({
        szPluginContainer: 'playWnd',
        iServicePortStart: 15900,
        iServicePortEnd: 15909,
        szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11', // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: function() {
          that.oWebControl.JS_StartService('window', {
            dllPath: './VideoPluginConnect.dll'
          }).then(function() {
            that.oWebControl.JS_CreateWnd('playWnd', that.width, that.height).then(function() {
              console.log('视频plugin创建成功,进行interface初始化')
              that.initInterface()
            })
          })
        },
        cbConnectError: function() {
          console.log('cbConnectError')
          this.oWebControl = null
          WebControl.JS_WakeUp('VideoWebPlugin://')
          that.initCount++
          if (that.initCount < 3) {
            setTimeout(that.initPlugin, 2000)
          } else {
              that.isInit = false
            that.$message.error('插件启动失败，请检查VideoWebPlugin.exe插件是否安装！')
          }
        },
        cbConnectClose: function(bNormalClose) {
          console.log('cbConnectClose')
          that.isInit = false
          that.oWebControl = null
        }
      })
    },
    setEncrypt(value) {
      // RSA加密
      var encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.pubKey)
      return encrypt.encrypt(value)
    },
    //初始化interface
    initInterface() {
      let that = this
      let buttonIds = []
      // let power = []
      // if (JSON.parse(localStorage.getItem('wsp_user'))) {
      //   power = JSON.parse(localStorage.getItem('wsp_user')).powers.slice()
      // }
      // let status = power.join(',').includes('摄像头操作')
      // if (status) {
      //   this.btIds = '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769'
      // } else {
      //   this.btIds = '0,16,256,257,258,259,260,514,515,516,517,768,769'
      // }
      this.btIds = '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769'
      // console.log(status, '我是是否有权限')
      this.getPubKey(function() {
        that.oWebControl.JS_RequestInterface({
          funcName: 'init',
          argument: JSON.stringify({
            appkey: that.appkey,
            //secret: that.setEncrypt(that.secret),
            secret: that.secret,
            ip: that.ip,
            playMode: that.playMode, // 预览
            port: that.port,
            snapDir: that.snapDir,
            videoDir: that.videoDir,
            layout: that.layout,
            enableHTTPS: that.enableHttps,
            showToolbar: that.showToolbar,
            showSmart: that.showSmart,
            buttonIDs: that.btIds,
            //encryptedFields: that.encryptedFields
          })
        }).then(function(oData) {
          that.isInit = true
          that.oWebControl.JS_Resize(that.width, that.height) // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
          that.handlePreview(that.cameraIndexCode)
        })
      })
    },
    // 获取公钥
    getPubKey(callback) {
      var that = this
      this.oWebControl.JS_RequestInterface({
        funcName: 'getRSAPubKey',
        argument: JSON.stringify({
          keyLength: 1024
        })
      }).then(function(oData) {
        if (oData.responseMsg.data) {
          that.pubKey = oData.responseMsg.data
          callback()
        }
      })
    },
    multiVideos(videos) {
      let that = this
      let last = videos[videos.length - 1]
      return new Promise((resole, reject) => {
        let intervalVideo = (clips) => {
          if (clips instanceof Array && clips.length > 0) {
            let clipLength = clips.length
            let clip = clips[0]

            // 子码流特殊处理
            let streamMode = that.streamMode
            if(that.specialCodes.indexOf(clip) > -1) streamMode = 1

            that.oWebControl.JS_RequestInterface({
              funcName: 'startPreview',
              argument: JSON.stringify({
                cameraIndexCode: clip,
                streamMode: streamMode,
                transMode: that.transMode,
                gpuMode: that.gpuMode,
                wndId: -1
              })
            }).then(function(oData) {
              clips.shift()
              if (oData.responseMsg.code == 0) {
                setTimeout( intervalVideo(clips), 1000)
              }else{
                console.log(oData)
              }
            })
          } else {
            resole
          }
        }

        intervalVideo(videos)
      })
    },
    handlePreview(codes, startIdx = 1) { //startIdx 如果是多个 从第几个窗口开始加载
      console.log(codes)
      let that = this
      if (!codes || codes=='' || codes.length==0)
        return
      if (Array.isArray(codes) && codes.length > 0) {
        // let confs = codes.map((code, index) => {
        //     return {
        //         cameraIndexCode: code,
        //         streamMode: that.streamMode,
        //         transMode: that.transMode,
        //         gpuMode: that.gpuMode,
        //         wndId: startIdx + index //设置不对会报错
        //     }
        // })
        // that.oWebControl.JS_RequestInterface({
        //     funcName: 'startMultiPreviewByCameraIndexCode',
        //     argument: JSON.stringify({
        //         list: confs
        //     })
        // })
        this.onLoading = true
        this.multiVideos(codes).then(()=>{
          this.onLoading = false
        })
      } else if (typeof codes == 'string') {
        // 子码流特殊处理
        let streamMode = that.streamMode
        if(that.specialCodes.indexOf(codes)>-1) streamMode = 1

        that.oWebControl.JS_RequestInterface({
          funcName: 'startPreview',
          argument: JSON.stringify({
            cameraIndexCode: codes,
            streamMode: streamMode,
            transMode: that.transMode,
            gpuMode: that.gpuMode,
            wndId: -1
          })
        })
      }
    },
    uninit() {
      let oWebControl = this.oWebControl
      if (oWebControl != null) {
        oWebControl.JS_RequestInterface({
          funcName: 'stopAllPreview'
        })
        oWebControl.JS_HideWnd() // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
        oWebControl.JS_Disconnect()
          .then(function() {
            // 断开与插件服务连接成功
          },
          function() { // 断开与插件服务连接失败
            console.log('oWebControl close error')
          })
        oWebControl = null
      }
    },
    windowChange() {
      //列表选项在左侧
      // this.height = document.getElementsByClassName('videoWindow')[0].scrollHeight
      // var btnWidth = 0
      // if (document.getElementsByClassName('playBtn').length > 0) {
      //     btnWidth = document.getElementsByClassName('playBtn')[0].clientWidth
      //     this.width = document.getElementsByClassName('videoWindow')[0].scrollWidth - btnWidth - 5
      // } else {
      //     this.width = document.getElementsByClassName('videoWindow')[0].scrollWidth
      // }
      //列表选项在下方
      this.width = document.getElementsByClassName('video-window')[0].scrollWidth
      var btnHeight = 0
      if (document.getElementsByClassName('playBtn').length > 0) {
        btnHeight = document.getElementsByClassName('playBtn')[0].clientHeight
        this.height = document.getElementsByClassName('video-window')[0].scrollHeight - btnHeight - 10
      } else {
        this.height = document.getElementsByClassName('video-window')[0].scrollHeight
      }

      if (document.getElementById('playWnd')) {
        document.getElementById('playWnd').style.height = this.height + 'px'
        document.getElementById('playWnd').style.width = this.width + 'px'
      }
    },
    hidePlugin() {
      this.oWebControl.JS_HideWnd()
    },
    showPlugin() {
      this.oWebControl.JS_ShowWnd()
    },
    ready() {
      let that = this
      return new Promise((resolve, reject) => {
        wait(function() {
          return that.isInit
        }, 6000 + that.timeOut || 500, 100).then(function() {
          resolve()
        }).catch(function(err) {
          that.$message.error({
            content: '视频控件加载超时，请检查',
            duration: 3
          })
          reject('视频控件加载超时，请检查')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
