<template>

  <div class="app-login">

    <div class="app-modular">

      <div class="app-modular-image">

        <img
          alt="MODULAR_LOGO"
          class="app-modular-logo"
          src="/img/admin/login/icon-modular-logo.png">

        <div class="app-modular-title">烟台海岸警察支队船舶动态管控平台
        </div>

        <div class="app-modular-title-translation">Yantai coast police detachment ship dynamic control platform
        </div>

      </div>

      <div class="app-login-card">

        <div class="app-card-title">欢迎登录
        </div>

        <span class="app-card-line">
        </span>

        <div class="app-form-item">

          <img
            class="image"
            src="/img/admin/login/icon-card-username.png"
            alt="LOGIN_USER">

          <input
            v-model="username"
            autocomplete="on"
            name="username"
            placeholder="请输入登录账号"
            type="text"
            @keyup.enter="login">

        </div>

        <div
          class="app-form-item"
          style="margin-bottom: 38px">

          <img
            class="image"
            src="/img/admin/login/icon-card-password.png"
            alt="LOGIN_USER">

          <input
            v-model="password"
            autocomplete="on"
            name="password"
            placeholder="请输入登录密码"
            :type="type ? 'password' : 'text'"
            @keyup.enter="login">

          <img
            class="app-password-show"
            alt="ICON"
            :src="`/img/admin/login/icon-card-${type ? 'eye' : 'open'}.png`"
            @click="change()">

        </div>

        <div
          class="app-login-control"
          @click="login">登录
        </div>

      </div>

    </div>

  </div>

</template>

<script>
// import api from '@/util/api'
import md5 from 'js-md5'
export default {
  name: 'app-login',
  data () {
    return {
      username: '',
      password: '',
      type: true
    }
  },
  methods: {
    change () {
      this.type = !this.type
    },
    login () {
      if (!this.username) {
        this.$message.error('用户名不能为空！')
        return null
      }
      if (!this.password) {
        this.$message.error('密码不能为空！')
        return null
      }
      const params = new FormData()
      params.append('userName', this.username)
      params.append('passWord', md5(this.password))
      // params.append('passWord', this.password)

      this.$store.dispatch('loadUser', { data: params }).then(response => {
        const res = response.data
        if (res.code === '200') {
          this.$router.addRoutes(this.$store.state.syncRoutes)
          this.$router.push({
            path: 'screen'
          })
        } else {
          this.$message.error(res.msg || '系统问题，请联系管理员！')
        }
      }).catch((err) => {
        // const data = err.data
        this.$message.error(err.data.msg || '系统问题，请联系管理员！')
      })

      // this.axios.post(api.login, params, { loading: true }).then(response => {
      //   const res = response.data
      //   if (res.code === '200') {
      //     localStorage.setItem('token', res.result.token)
      //     localStorage.setItem('dicts', JSON.stringify(res.result.dicts))
      //     localStorage.setItem('user', JSON.stringify(res.result.user))
      //     this.$router.push({
      //       path: 'screen'
      //     })
      //   } else {
      //     this.$message.error(res.msg || '登录失败！')
      //   }
      // }).catch(err => {
      //   this.$message.error('系统问题，请联系管理员！')
      //   console.error(err)
      // })
    }
  }
}
</script>

<style scoped>
.app-login {
  background-image: url('/img/admin/login/icon-login-background.png');
  background-size: 100% 100%;
  height: 100%;
  position: relative;
  width: 100%;
}
.app-modular {
  background-color: white;
  border-radius: 20px;
  bottom: 80px;
  display: flex;
  flex-direction: row;
  left: 116px;
  position: absolute;
  right: 120px;
  top: 80px;
}
.app-modular-image {
  background-image: url('/img/admin/login/icon-modular-background.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100%;
  width: calc(100% - 560px);
}
.app-modular-logo {
  margin-top: 120px;
}
.app-modular-title {
  color: rgba(49, 50, 110, 1);
  font-family: 'PHTB';
  font-size: 43px;
  letter-spacing: 4px;
  margin-top: 30px;
}
.app-modular-title-translation {
  color: rgba(49, 50, 110, 1);
  font-family: 'PHTB';
  font-size: 20px;
  letter-spacing: 2px;
  margin-top: 10px;
}
/* CARD */
.app-login-card {
  height: 100%;
  width: 560px;
}
.app-login-card {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.app-card-title {
  color: rgba(25, 48, 128, 1);
  font-family: 'PHTM';
  font-size: 40px;
}
.app-card-line {
  background-color: rgba(25, 48, 128, 1);
  height: 5px;
  margin-bottom: 60px;
  width: 90px;
}
.app-form-item {
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(234, 234, 234, 1);
  box-sizing: border-box;
  height: 50px;
  letter-spacing: 3px;
  margin-bottom: 21px;
  padding-left: 50px;
  padding-right: 40px;
  position: relative;
  width: calc(100% - 100px);
}
.app-form-item > img {
  color: rgba(173, 182, 197, 1);
  height: 24px;
  position: absolute;
  top: 8px;
  transform: translateY(3px);
  width: 24px;
}
.app-form-item > .image {
  left: 16px;
}
.app-password-show {
  cursor: pointer;
  right: 16px;
}
.app-form-item > input {
  background: transparent;
  border: none;
  color: black;
  font-size: 16px;
  height: 46px;
  line-height: 46px;
  outline: none;
  width: 100%;
}
.app-form-item > input::-webkit-input-placeholder {
  color: rgba(19, 20, 21, 0.3);
}
.app-form-item > input:-webkit-autofill {
  box-shadow: 0 0 0 1000px rgba(255, 255, 255, 1) inset !important;
  -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 1) inset !important;
  -webkit-text-fill-color: black !important;
}
/* CONTROL */
.app-login-control {
  background-color: rgba(31, 60, 159, 1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: 'PHTB';
  font-size: 20px;
  height: 60px;
  line-height: 60px;
  width: calc(100% - 100px);
}
.app-login-control:hover {
  background-color: rgba(39, 50, 103, 1);
}

@media screen and (max-width: 1600px) {
  .app-modular-title {
    font-size: 36px;
  }
}
</style>
