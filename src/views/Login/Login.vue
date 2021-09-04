<template>
  <div class="login__container">
    <el-card class="login__box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="账号密码登录" name="login"></el-tab-pane>
      </el-tabs>
      <el-row class="login__form-wrap">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginFormRules"
          @keyup.enter.native="login('loginForm')"
        >
          <!-- 用户 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              clearable
              placeholder="请输入账号/邮箱"
            >
              <i slot="prefix" class="fa fa-user" aria-hidden="true"></i>
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              show-password
              placeholder="请输入密码"
            >
              <i slot="prefix" class="fa fa-lock" aria-hidden="true"></i>
            </el-input>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item prop="identifyCode">
            <div class="login__identify">
              <el-input
                v-model="loginForm.identifyCode"
                style="margin-right: 10px"
                placeholder="请输入验证码"
                clearable
                :spellcheck="false"
              ></el-input>
              <Identify
                :isRefresh.sync="isRefresh"
                :value="loginForm.identifyCode"
                @getCode="getCode"
                @on-result="getResult"
              />
            </div>
          </el-form-item>
          <el-form-item align="right" class="login__btn">
            <el-button type="primary" @click="login('loginForm')"
              >登 录</el-button
            >
            <el-button type="info" @click="resetLoginForm('loginForm')"
              >重 置</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Identify from '@/components/canvas/identify'
// import { Role, User } from '@/assets/js/leancloud'
import { Base64 } from '@/assets/js/encode'
import { LeanCloud } from '@/assets/js/leancloud'
const Role = new LeanCloud('ikiRole')
const User = new LeanCloud('ikiUser')

export default {
  mounted () {
  },
  methods: {
    aaaa () {
      // this.$http.post('api/permission/getMenu', this.form).then(({ data }) => {
      //   if (data.code === 2000) {
      //     // 避免二次登录
      //     store.commit('clearMenu')
      //     store.commit('setMenu', data.data.menu)
      //     store.commit('setToken', data.data.token)
      //     store.commit('addMenu', router)
      //     router.push({ name: 'home' })
      //   } else {
      //     this.$message.warning(data.data.message)
      //   }
      // })
    },
    login (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return false
        if (!this.result) {
          this.refreshCode()
          this.$message.error('验证码错误！')
          return false
        }

        try {
          const { username, password } = this.loginForm
          const isEmail = /^[a-zA-Z0-9]+([._-]*[a-zA-Z0-9]*)*@[a-zA-Z0-9]+.[a-zA-Z0-9{2,5}$]/.test(username)
          // 支持邮箱登录
          const params = isEmail
            ? { email: username, password: Base64.enc(password) }
            : { username, password: Base64.enc(password) }
          const user = await User.getItem(params)
          const {
            nickname,
            role,
            avatar,
            state,
            sessionToken
          } = user.toJSON()
          const { code, level } = (await Role.id(role.objectId)).toJSON()
          if (!state) {
            return this.$message.error('登录失败，该账号已被禁用，请联系管理员启用账号')
          }
          // this.$store.commit('clearMenu')
          // this.$store.commit('setMenu', data.data.menu)
          this.$store.commit('user/setUser', {
            nickname,
            avatar,
            level,
            roles: code,
            state
          })
          this.$store.commit('user/setToken', sessionToken)
          // this.$store.commit('addMenu', router)
          this.$router.push({ name: 'home' })
          this.$message.success('登录成功')
        } catch (err) {
          this.refreshCode()
          this.$message.error('账号或密码错误')
        }
      })
    },
    resetLoginForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 获取验证码
    getCode (value) {
      this.loginForm.identifyCode = value
    },
    // 验证码是否正确
    getResult (result) {
      this.result = result
    },
    // 更新验证码
    refreshCode () {
      this.isRefresh = true
    }
  },
  data () {
    return {
      activeName: 'login',
      result: false,
      isRefresh: false,
      loginForm: {
        username: 'admin',
        password: 'admin',
        identifyCode: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入账号/邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        identifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Identify
  }
}
</script>

<style lang="scss" scoped>
.login__container {
  position: relative;
  height: 100%;
  .login__box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 450px;
    transform: translate(-50%, -50%);
    ::v-deep .el-tabs {
      .el-tabs__active-bar {
        width: 100% !important;
      }
      .el-tabs__item {
        margin: 20px 16px;
        height: auto;
        font-size: 20px;
        line-height: 1;
      }
    }
    .login__form-wrap {
      margin-top: 15px;
      i[class*='fa-'] {
        width: 25px;
        height: 100%;
        text-align: center;
        line-height: 40px;
        transition: all 0.3s;
      }
      .login__identify {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .login__btn {
        margin-bottom: 0;
      }
    }
  }
}

::v-deep .el-input {
  .el-input__inner {
    user-select: none;
  }
}
</style>
