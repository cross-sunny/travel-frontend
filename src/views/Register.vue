<template>
  <div class="auth-wrapper">
    <div class="auth-box">
      <div class="auth-header">
        <div class="logo">🌲</div>
        <h2>欢迎注册搬木民宿</h2>
        <p>开启您的自然之旅</p>
      </div>

      <!-- autocomplete="off" 禁止表单缓存 -->
      <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          size="large"
          autocomplete="off"
      >
        <!-- 隐藏 input 欺骗浏览器自动填充 -->
        <input type="text" style="display:none" />
        <input type="password" style="display:none" />

        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
              v-model="form.username"
              placeholder="设置账号 (登录使用)"
              :prefix-icon="User"
              autocomplete="off"
              name="new-username-field"
          />
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item prop="nickname">
          <el-input
              v-model="form.nickname"
              placeholder="您的昵称 (如: 旅行者)"
              :prefix-icon="Avatar"
              autocomplete="off"
          />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input
              v-model="form.email"
              placeholder="请输入您的邮箱"
              :prefix-icon="Message"
              autocomplete="off"
              name="new-email-field"
          />
        </el-form-item>

        <!-- 验证码（改为6位） -->
        <el-form-item prop="code">
          <div class="code-flex">
            <el-input
                v-model="form.code"
                placeholder="6位验证码"
                :prefix-icon="Key"
                style="flex: 1; margin-right: 10px;"
                maxlength="6"
                @input="form.code = form.code.replace(/\D/g, '')"
            />
            <el-button
                type="success"
                plain
                :disabled="time > 0 || emailLoading"
                @click="handleSendCode"
            >
              {{ time > 0 ? `${time}秒后重发` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="设置登录密码"
              :prefix-icon="Lock"
              show-password
              readonly
              onfocus="this.removeAttribute('readonly');"
              autocomplete="new-password"
          />
        </el-form-item>

        <el-button type="primary" class="full-btn" @click="handleRegister" :loading="submitLoading">
          立 即 注 册
        </el-button>

        <div class="form-footer">
          <span @click="$router.push('/login')">已有账号？<span class="link">去登录</span></span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { User, Lock, Message, Key, Avatar } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const time = ref(0)
const timer = ref(null)
const emailLoading = ref(false)
const submitLoading = ref(false)

const form = reactive({
  username: '',
  nickname: '',
  email: '',
  code: '',
  password: ''
})

// 校验规则（增强验证码校验）
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入验证码'))
        } else if (!/^\d{6}$/.test(value)) {
          callback(new Error('验证码必须是6位数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 发送验证码
const handleSendCode = () => {
  formRef.value.validateField('email', (valid) => {
    if (!valid) return

    emailLoading.value = true
    request
        .post('/user/send-code', null, { params: { email: form.email } })
        .then(() => {
          ElMessage.success(`验证码已发送至 ${form.email}`)
          // 自动聚焦验证码框（可选）
          setTimeout(() => {
            const codeInput = document.querySelector('.code-flex input')
            if (codeInput) codeInput.focus()
          }, 100)

          // 倒计时60秒
          time.value = 60
          timer.value = setInterval(() => {
            time.value--
            if (time.value <= 0) {
              clearInterval(timer.value)
              timer.value = null
            }
          }, 1000)
        })
        .catch((err) => {
          console.error('发送验证码失败:', err)
        })
        .finally(() => {
          emailLoading.value = false
        })
  })
}

// 提交注册
const handleRegister = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      request
          .post('/user/register-email', form)
          .then(() => {
            ElMessage.success('注册成功！')
            router.push('/login')
          })
          .catch((err) => {
            console.error('注册失败:', err)
          })
          .finally(() => {
            submitLoading.value = false
          })
    }
  })
}

// 清理定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
})
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('https://img.zcool.cn/community/01f06e5d0859cca8012051cd108253.jpg@1280w_1l_2o_100sh.jpg') no-repeat center center;
  background-size: cover;
}

.auth-box {
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header .logo {
  font-size: 48px;
  margin-bottom: 10px;
}

.auth-header h2 {
  color: #333;
  margin: 0;
  font-size: 24px;
}

.auth-header p {
  color: #666;
  margin: 5px 0 0;
  font-size: 14px;
}

.code-flex {
  display: flex;
  width: 100%;
}

.full-btn {
  width: 100%;
  margin-top: 10px;
  height: 44px;
  font-size: 16px;
  background-color: #42b983;
  border-color: #42b983;
}
.full-btn:hover {
  background-color: #3aa876;
  border-color: #3aa876;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.link {
  color: #42b983;
  cursor: pointer;
  font-weight: bold;
}
</style>