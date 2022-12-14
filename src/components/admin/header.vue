<template>

  <div class="header">

    <div class="title">烟台海岸警察支队船舶动态管控平台</div>

    <div class="account">

      <div
        class="screen-entrance"
        @click="toScreen">

        <div class="icon-background">

          <img
            src="/img/admin/icon-screen-entrance.png"
            alt="SCREEN_ENTRANCE">

        </div>

        <span class="label">一张图入口
        </span>

      </div>

      <div class="user-info">

        <span class="name">{{ name }}, 欢迎您!</span>

        <i class="el-icon-arrow-down icon-arrow-down"></i>

        <div class="user-dialog">

          <div
            @click="help()">帮助
          </div>

          <div
            @click="toggleUpdatePassword(true)">修改密码
          </div>

          <div
            @click="logout()">退出
          </div>

        </div>

      </div>

    </div>

    <app-dialog
      v-if="form.visible"
      :config="form.config"
      title="密码修改"
      @close="toggleUpdatePassword(false)">

      <div class="update-password">

        <el-form
          class="update-password-form"
          :model="form.model"
          ref="update-password-form"
          :rules="form.rules"
          size="small">

          <el-form-item
            class="update-password-item"
            label="原密码:"
            prop="oldPassword">

            <el-input
              v-model="form.model.oldPassword"
              type="password"
              style="width: 100%;">
            </el-input>

          </el-form-item>

          <el-form-item
            class="update-password-item"
            label="新密码:"
            prop="password">

            <el-input
              v-model="form.model.password"
              type="password"
              style="width: 100%;">
            </el-input>

          </el-form-item>

          <el-form-item
            class="update-password-item"
            label="确认密码:"
            prop="confirmPassword">

            <el-input
              v-model="form.model.confirmPassword"
              type="password"
              style="width: 100%;">
            </el-input>

          </el-form-item>

        </el-form>

        <div>

          <el-button
            size="small"
            type="primary"
            @click="updatePassword()">提交
          </el-button>

        </div>

      </div>

    </app-dialog>

  </div>

</template>

<script>
import api from '@/util/api'
import appDialog from '@/components/common/dialog'
import md5 from 'js-md5'
export default {
  name: 'app-header',
  components: {
    'app-dialog': appDialog
  },
  data () {
    return {
      form: {
        config: {
          height: 300,
          width: 400
        },
        model: {
          confirmPassword: null,
          password: null,
          oldPassword: null
        },
        rules: {
          confirmPassword: {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('确认密码 未填写'))
              } else {
                if (this.form.model.password && value !== this.form.model.password) {
                  callback(new Error('确认密码 与密码不一致'))
                } else {
                  callback()
                }
              }
            }
          },
          oldPassword: {
            required: true, message: '原密码 未填写', trigger: 'blur'
          },
          password: {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('密码 未填写'))
              } else {
                if (this.form.model.confirmPassword && value !== this.form.model.confirmPassword) {
                  callback(new Error('密码 与确认密码不一致'))
                } else {
                  callback()
                }
              }
            }
          }
        },
        visible: false
      },
      name: '管理员'
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    help () {
      // this.$message.warning('暂无帮助！')
      window.open('http://56.85.129.143/docs/docs/cbdtgkpt.html', '_blank')
    },
    initData () {
      this.name = JSON.parse(localStorage.getItem('user')).userName
    },
    logout () {
      this.$confirm('您确定要退出本系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new FormData()
        this.axios.post(api.logout, params, { loading: true }).then(() => {
        }).catch(err => {
          console.error(err)
        }).finally(() => {
          localStorage.removeItem('user')
          localStorage.removeItem('dicts')
          localStorage.removeItem('token')
          this.$message.success('退出成功！')
          // localStorage.clear()
          this.$router.push({
            path: '/login'
          })
        })
      }).catch(() => {})
    },
    /**
     * 切换修改密码弹窗显隐
     * @param visible
     */
    toggleUpdatePassword (visible) {
      this.form.visible = visible
    },
    toScreen () {
      this.$router.push({
        path: '/screen'
      })
    },
    /**
     * 修改密码
     */
    updatePassword () {
      this.$refs['update-password-form'].validate(valid => {
        if (valid) {
          // 获取用户id
          const user = JSON.parse(localStorage.getItem('user'))
          // todo...
          const params = new FormData()
          params.append('password', md5(this.form.model.password))
          params.append('oldpassword', md5(this.form.model.oldPassword))
          params.append('id', user.userId)

          this.axios.post(api.updatePassword, params, { loading: true }).then(response => {
            const res = response.data
            if (res.code === '200') {
              this.$message.success('操作成功！')
              this.form.visible = false
            } else {
              this.$message.error(res.msg || '操作失败！')
            }
          }).catch(err => {
            console.error(err)
            this.$message.error('系统问题，请联系管理员！')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="sass">
.header
  align-items: center
  box-shadow: 0px 2px 12px 0px rgba(0, 71, 158, 0.06)
  box-sizing: border-box
  display: flex
  flex-direction: row
  height: 56px
  justify-content: space-between
  padding-left: 24px
  padding-right: 24px
  position: relative
  width: 100%

/* TITLE */
.account
  align-items: center
  display: flex
  flex-direction: row
  height: 24px
  justify-content: flex-end
  //width: 150px

.screen-entrance
  align-items: center
  cursor: pointer
  display: flex
  flex-direction: row
  height: 56px
  justify-content: center
  margin-right: 40px
  width: 168px
  &:hover
    background-color: rgba(192, 219, 255, .3)
  .icon-background
    align-items: center
    background-color: rgba(22, 119, 255, .1)
    border-radius: 40px
    display: flex
    flex-direction: row
    justify-content: center
    height: 40px
    margin-right: 10px
    width: 40px
    img
      height: 16px
      width: 16px
  .label
    //font-family: 'SHSCNN'
    font-size: 16px

.title
  font-family: 'SHSCNB'
  font-size: 22px

/* ACCOUNT */
.user-info
  align-items: center
  cursor: pointer
  display: flex
  flex-direction: row
  height: 24px
  justify-content: flex-end
  &:hover
    .user-dialog
      //display: block
      opacity: 1
      pointer-events: all
      visibility: visible
.name
  border-left: 1px solid rgba(233, 233, 233, 1)
  color: rgba(37, 43, 58, 1)
  font-size: 14px
  padding-left: 10px

.name:before
  background-color: rgba(0, 210, 155, 1)
  border-radius: 50%
  content: ''
  display: inline-block
  height: 10px
  margin-right: 5px
  width: 10px

.icon-arrow-down
  margin-left: 10px

// 修改密码
.update-password
  box-sizing: border-box
  display: flex
  flex-direction: column
  height: 100%
  padding-top: 10px
  width: 100%
  .update-password-form
    display: flex
    flex-direction: column
    flex-grow: 1
    .update-password-item
      align-items: center
      display: flex
      flex-direction: row

// 退出
.user-dialog
  background-color: white
  border: 1px solid #E9E9E9
  box-shadow: 0px 2px 12px 0px rgba(0, 71, 158, 0.1)
  box-sizing: border-box
  //height: 72px
  //display: none
  opacity: 0
  position: fixed
  padding-left: 13px
  padding-right: 17px
  pointer-events: none
  right: 20px
  top: 40px
  transition-duration: .2s
  visibility: hidden
  width: 100px
  z-index: 3
  div
    cursor: pointer
    height: 50%
    line-height: 35px
    width: 100%
    &:not(:last-child)
      border-bottom: 1px solid #E9E9E9
</style>
<style>
.update-password-item .el-form-item__label {
  flex-shrink: 0;
  text-align: right;
  width: 90px;
}
.update-password-item .el-form-item__content {
  flex-grow: 1;
}
</style>
