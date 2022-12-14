<template>

  <div>

    <app-dialog
      :config="config"
      ref="dialog"
      title="轨迹回放"
      @close="close">

      <div class="track-review">

        <el-tabs
          v-model="active"
          @tab-click="handleClick"
          style="flex-shrink: 0;">

          <el-tab-pane
            v-for="(item, i) in tabs"
            :key="i"
            :label="item.label"
            :name="item.prop">
          </el-tab-pane>

        </el-tabs>

        <div class="track-review-info">

          <!-- 选择渔船 -->
          <template v-if="active === 'trawler'">

            <app-filter
              :filter-items="trawler.items"
              :filter-model="trawler.model"
              @handle="handle">
            </app-filter>

            <app-table
              :columns="trawler.columns"
              :controls="trawler.controls"
              :data="trawler.data"
              ref="app-table-choose"
              @handle="handle"
              style="height: 279px;">
            </app-table>

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="trawler.pager.current"
              :page-sizes="trawler.pager.sizes"
              :page-size="trawler.pager.size"
              :layout="trawler.pager.layout"
              :total="trawler.pager.total"
              style="margin-top: 20px;">
            </el-pagination>

          </template>

          <template v-if="active === 'track'">

            <div class="track-control">

              <span class="notice">注: 最多支持10条船舶的轨迹同时回放
              </span>

            </div>

            <app-table
              :columns="track.columns"
              :controls="track.controls"
              :data="track.data"
              @handle="handle"
              style="height: 280px;">
            </app-table>

            <el-form
              class="track-review-form"
              :model="track.model"
              size="small">

              <el-form-item
                v-for="(item, i) in track.items"
                class="track-review-item"
                :key="i"
                :label="item.label">

                <el-select
                  v-if="item.type === 'select'"
                  v-model="track.model[item.prop]"
                  :disabled="item.readonly"
                  style="width: 185px;">

                  <el-option
                    v-for="(opt, index) in item.options"
                    :key="index"
                    :label="opt.label"
                    :value="opt.value">
                  </el-option>

                </el-select>

                <el-date-picker
                  v-if="item.type === 'datetime'"
                  v-model="track.model[item.prop]"
                  :picker-options="picker[item.prop]"
                  :readonly="item.readonly"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 185px;"
                  @change="updateParams">
                </el-date-picker>

                <el-input
                  v-if="item.type === 'input'"
                  v-model="track.model[item.prop]"
                  :readonly="item.readonly"
                  type="text"
                  style="width: 185px;">
                </el-input>

              </el-form-item>

            </el-form>

            <div class="form control track-review-control">

              <template
                v-for="(item, i) in track.control">

              <span
                :class="['button', item.disabled]"
                :key="i"
                :role="item.role"
                @click="handle(item.prop, null, item.disabled)">{{ item.label }}
              </span>

              </template>

            </div>

          </template>

        </div>

      </div>

    </app-dialog>

    <app-review-control
      ref="review-control"
      :time="controlTime"
      :track-list="trackAll"
      :trawler-list="selection"
      @close="closeControl">
    </app-review-control>

  </div>

</template>

<script>
import api from '@/util/api'
import * as $configs from '@/components/map/configs'

import appDialog from '@/components/common/dialog'
import appFilter from '@/components/common/filter'
import appTable from '@/components/common/table'
import appReviewControl from '@/components/common/review-control'
export default {
  name: 'track-review',
  components: {
    'app-dialog': appDialog,
    'app-filter': appFilter,
    'app-table': appTable,
    'app-review-control': appReviewControl
  },
  data () {
    return {
      active: 'trawler',
      config: {
        height: 540,
        width: 1100
      },
      controlTime: {
        max: '',
        min: ''
      },
      count: {
        number: 0,
        selected: 0
      },
      selection: [],
      tabs: [
        {
          label: '选择渔船',
          prop: 'trawler'
        },
        {
          label: '轨迹回放',
          prop: 'track'
        }
      ],
      timeout: null,
      track: {
        columns: [
          {
            label: '船名号',
            prop: 'boatName',
            width: 120
          },
          {
            label: '船主姓名',
            prop: 'boatOwner'
          },
          {
            label: '功率(kw)',
            prop: 'power'
          },
          {
            label: '单位名称',
            prop: 'departName',
            width: 120
          },
          {
            label: '船舶类型',
            prop: 'typeName'
          },
          {
            label: '开始时间',
            prop: 'beginTime',
            width: 150
          },
          {
            label: '最后定位时间',
            prop: 'gpsTime',
            width: 150
          }
        ],
        control: [
          {
            disabled: '',
            label: '查询轨迹',
            prop: 'query-track',
            role: 'primary-form'
          },
          {
            disabled: 'disabled',
            label: '轨迹回放',
            prop: 'track-review',
            role: 'primary-form'
          },
          {
            disabled: '',
            label: '保存轨迹',
            prop: 'download-track',
            role: 'success-form'
          }
        ],
        controls: [
          {
            label: '删除',
            prop: 'delete',
            type: 'danger'
          }
        ],
        data: [],
        items: [
          {
            label: '终端类型',
            prop: 'type',
            readonly: false,
            type: 'select',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '北斗',
                value: 'Beidou'
              },
              {
                label: 'AIS',
                prop: 'AIS'
              }
            ]
          },
          {
            label: '开始时间',
            prop: 'beginTime',
            readonly: false,
            type: 'datetime'
          },
          {
            label: '结束时间',
            prop: 'endTime',
            readonly: false,
            type: 'datetime'
          },
          {
            label: '总时长',
            prop: 'duration',
            readonly: true,
            type: 'input'
          }
        ],
        model: {
          beginTime: '',
          duration: '1天0小时0分钟0秒',
          endTime: '',
          type: ''
        }
      },
      tracks: {},
      trackAll: [],
      trawler: {
        columns: [
          {
            label: '船舶名称',
            prop: 'boatName'
          },
          {
            label: '船主姓名',
            prop: 'boatOwner'
          },
          {
            label: '联系方式',
            prop: 'ownerPhone'
          },
          {
            label: '经度',
            prop: 'longitude'
          },
          {
            label: '纬度',
            prop: 'latitude'
          },
          {
            label: '最新定位时间',
            prop: 'gpsTime',
            width: 160
          }
        ],
        controls: [
          {
            label: '添加',
            prop: 'add',
            type: 'primary'
          }
        ],
        data: [],
        items: [
          {
            label: '船舶名称',
            prop: 'shipName',
            type: 'input'
          },
          {
            label: '',
            name: '查询',
            prop: 'query',
            style: 'primary-form',
            type: 'button'
          }
        ],
        model: {
          shipName: null
        },
        pager: {
          current: 1,
          layout: 'total, sizes, prev, pager, next, jumper',
          size: 15,
          sizes: [10, 15, 20, 50],
          total: 0
        }
      },
      picker: { // 暂时放在这个地方
        beginTime: {
          disabledDate: (time) => {
            const end = this.track.model.endTime || ''
            return time.getTime() > new Date(end)
          }
        },
        endTime: {
          disabledDate: (time) => {
            const start = this.track.model.beginTime || ''
            return time.getTime() < new Date(start)
          }
        }
      }
    }
  },
  mounted () {
    const today = new Date()
    today.setHours(today.getHours() + 8)
    this.track.model.endTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')
    today.setDate(today.getDate() - 1)
    this.track.model.beginTime = today.toJSON().replace(/T/, ' ').replace(/\..*/, '')

    this.initTrawlerData()
  },
  methods: {
    close () {
      this.$router.push({
        path: '/admin'
      })
    },
    closeControl () {
      this.$refs.dialog.zoom('enlarge')
    },
    debounce (callback, delay) { // 函数防抖
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.timeout = setTimeout(() => {
        callback()
      }, delay)
    },
    exportExcel () {
      const trawlers = []
      this.track.data.forEach((item) => {
        trawlers.push(item.boatName)
      })
      const url = [
        api.exportTrawlersTrack,
        '?shipNames=',
        trawlers.join(','),
        '&beginDate=',
        this.track.model.beginTime,
        '&endDate=',
        this.track.model.endTime,
        '&bwlx=',
        this.track.model.type
      ]
      // window.open(url.join(''), '_blank')
      const token = localStorage.getItem('token')
      fetch(url.join(''), {
        headers: new Headers({
          Auth: token
        }),
        responseType: 'blob'
      })
        .then(res => {
          return res.blob()
        })
        .then(res => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const href = URL.createObjectURL(blob)
          const alink = document.createElement('a')
          alink.href = href
          alink.download = '渔船轨迹.xlsx'
          alink.target = '_blank'
          alink.click()
          alink.remove()
        })
    },
    handle (type, data, disable) {
      switch (type) {
        case 'add': {
          const index = this.track.data.findIndex(item => item.uuid === data.uuid)
          if (index === -1) {
            if (this.track.data.length < 10) {
              this.track.control[1].disabled = 'disabled'
              data.beginTime = this.track.model.beginTime
              this.track.data.push(data)
              this.$message.success(`${data.boatName}已成功添加至播放列表！`)
              // 修改最后定位时间
              this.updateEndTime()
            } else {
              this.$message.warning('最多支持10条船舶的轨迹同时回放！')
            }
          } else {
            this.$message.warning(`${data.boatName}已添加至播放列表，请勿重复添加！`)
          }
          break
        }
        case 'delete': {
          const index = this.track.data.findIndex(item => item.uuid === data.uuid)
          this.track.data.splice(index, 1)
          // this.track.control[1].disabled = ''
          // if (this.track.data.length) {
          //   this.selection = this.track.data.slice()
          //   this.debounce(this.loadTrack, 500)
          // } else {
          //   this.track.control[1].disabled = 'disabled'
          // }
          this.track.control[1].disabled = 'disabled'
          this.updateEndTime()
          break
        }
        case 'download-track': {
          this.exportExcel()
          break
        }
        case 'query-track': {
          if (!this.track.data.length) {
            this.$message.warning('请选择需要查询轨迹的渔船！')
            return null
          }
          this.selection = this.track.data.slice()
          this.debounce(this.loadTrack, 500)
          break
        }
        case 'query': {
          this.trawler.model.shipName = data.shipName
          this.initTrawlerData()
          break
        }
        case 'track-review': {
          if (disable) {
            return null
          }
          this.controlTime.max = this.track.model.endTime
          this.controlTime.min = this.track.model.beginTime
          this.$refs.dialog.zoom('narrow')
          this.$refs['review-control'].toggleVisible(true)
          break
        }
        default: {
          break
        }
      }
    },
    handleClick () {
    },
    handleCurrentChange (e) {
      this.trawler.pager.current = e
      this.initTrawlerData()
    },
    handleSizeChange (e) {
      this.trawler.pager.size = e
      this.handleCurrentChange(1)
    },
    initTrawlerData () {
      const params = new FormData()
      params.append('keyWord', this.trawler.model.shipName || '')
      params.append('keyType', 'shipName')
      params.append('pageNo', this.trawler.pager.current)
      params.append('pageSize', this.trawler.pager.size)

      // 数据加载中
      this.$refs['app-table-choose'].empty = '数据加载中...'
      this.axios.post(api.getTrawlerDynamicPage, params).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.trawler.data = res.result.records.map(item => {
            item.gpsTime = item.gpsTime.replace(/T/, ' ').replace(/\..*/, '')
            return item
          })
          this.trawler.pager.total = res.result.total
        } else {
          this.$message.error(res.msg || '渔船列表查询失败！')
          this.trawler.pager.total = 0
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
        this.trawler.pager.total = 0
      }).finally(() => {
        this.$refs['app-table-choose'].empty = !this.trawler.pager.total ? '暂无数据' : ''
      })
    },
    loadTrack () {
      this.track.control[1].disabled = 'disabled'
      const params = new FormData()
      const ids = {}
      const trawlers = []
      this.selection.forEach((item) => {
        ids[item.boatName] = item.id
        trawlers.push(item.boatName)
      })

      if (!trawlers.length) {
        return null
      }
      params.append('beginDate', this.track.model.beginTime)
      params.append('bwlx', this.track.model.type)
      params.append('endDate', this.track.model.endTime)
      params.append('shipNames', trawlers)

      this.count.number++
      this.axios.post(api.getTrawlersTrack, params, { loading: true }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.trackAll = []
          const buffer = this.track.data.slice()
          let _index = 0
          console.log(_index)
          if (res.result) {
            const list = []
            // this.track.data.splice(idx, 1)
            Object.keys(res.result).forEach((key) => {
              list.push({
                shipName: key,
                track: res.result[key]
              })
            })
            const dataDelete = this.track.data.filter(item => !list.map(_item => _item.shipName).includes(item.boatName))
            if (dataDelete.length) {
              this.$message.warning(`${dataDelete.map(_item => _item.boatName).join(',')}暂无轨迹数据`)
            }
            this.track.data = this.track.data.filter(item => list.map(_item => _item.shipName).includes(item.boatName))
            list.forEach((item) => {
              if (item.track && item.track.length) {
                const i = buffer.findIndex(_item => _item.boatName === item.shipName)
                _index += 1
                const trackData = $configs.getTrackFormatted(
                  item.track,
                  this.track.model.beginTime,
                  this.track.model.endTime,
                  buffer[i].mmsi,
                  buffer[i].mmsi,
                  buffer[i].ownerName || '--',
                  buffer[i].cdmaPhone || '--'
                )
                this.trackAll.push(trackData)
              }
            })
            if (this.trackAll.length) {
              this.track.control[1].disabled = ''
            }
          }
        } else {
          this.$message.error(res.msg || '轨迹查询失败！')
        }
      }).catch(err => {
        this.$message.error('系统问题，请联系管理员！')
        console.error(err)
      }).finally(() => {
        setTimeout(() => {
          this.count.number--
          if (this.count.number === 0) {
            // this.disabled = false
          }
        }, 300)
      })
    },
    updateEndTime () {
      if (this.track.data.length === 1) {
        const item = this.track.data[0]
        const stamp = new Date(item.gpsTime.replace(/-/g, '/'))
        stamp.setHours(stamp.getHours() + 8)
        this.track.model.endTime = stamp.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1 $2')
        stamp.setDate(stamp.getDate() - 3)
        this.track.model.beginTime = stamp.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1 $2')
      } else {
        this.timeList = []
        this.track.data.forEach(item => {
          const time = new Date(item.gpsTime).getTime()
          this.timeList.push(time)
        })
        const lastTime = Math.min(...this.timeList)
        const nextTime = Math.max(...this.timeList)
        this.track.data.forEach(item => {
          const time = new Date(item.gpsTime).getTime()
          const stamp = new Date(item.gpsTime.replace(/-/g, '/'))
          stamp.setHours(stamp.getHours() + 8)
          if (time === nextTime) {
            this.track.model.endTime = stamp.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1 $2')
          }
          if (time === lastTime) {
            stamp.setDate(stamp.getDate() - 3)
            this.track.model.beginTime = stamp.toJSON().replace(/(.+)T(.+)\.(.+)Z/, '$1 $2')
          }
        })
      }
      this.updateParams()
    },
    updateParams () { // 点击查询轨迹的按钮
      const gap = (
        new Date(this.track.model.endTime) -
        new Date(this.track.model.beginTime)
      ) / 1000
      const second = gap % 60
      const minute = Math.floor(gap / 60) % 60
      const hour = Math.floor(gap / 60 / 60) % 24
      const day = Math.floor(gap / (60 * 60 * 24))
      this.track.model.duration = `${day}天${hour}小时${minute}分钟${second}秒`
      // this.debounce(this.loadTrack, 500)
    }
  }
}
</script>

<style scoped>
.track-review {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  width: 100%;
}
.track-review-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
/* CONTROL */
.track-control {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.track-control .notice {
  color: red;
}
/* TRACK_FORM */
.track-review-form {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-top: 15px;
}
.track-review-item {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.track-review-item:not(:last-child) {
  margin-right: 10px;
}
</style>
<style>
.track-review-item label {
  flex-shrink: 0 !important;
}
</style>
