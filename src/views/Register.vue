<template>
  <div class="auth-wrapper">
    <div class="auth-overlay"></div>
    <div class="auth-box">
      <div class="auth-header">
        <div class="logo-container">
          <div class="logo">🌲</div>
        </div>
        <h2>Traveler</h2>
        <p>开启您的自然探索之旅</p>
      </div>

      <!-- autocomplete="off" 禁止表单缓存 -->
      <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          size="large"
          autocomplete="off"
          class="custom-form"
      >
        <!-- 隐藏 input 欺骗浏览器自动填充 -->
        <input type="text" style="display:none" />
        <input type="password" style="display:none" />

        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
              v-model="form.username"
              placeholder="账号 (登录使用)"
              :prefix-icon="User"
              autocomplete="off"
              name="new-username-field"
          />
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item prop="nickname">
          <el-input
              v-model="form.nickname"
              placeholder="昵称"
              :prefix-icon="Avatar"
              autocomplete="off"
          />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input
              v-model="form.email"
              placeholder="电子邮箱"
              :prefix-icon="Message"
              autocomplete="off"
              name="new-email-field"
          />
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="code">
          <div class="code-flex">
            <!-- flex: 1 会自动填满除去按钮之外的剩余空间 -->
            <el-input
                v-model="form.code"
                placeholder="6位验证码"
                :prefix-icon="Key"
                class="code-input"
                maxlength="6"
                @input="form.code = form.code.replace(/\D/g, '')"
            />
            <!-- 按钮文字变长，宽度自动撑开 -->
            <el-button
                class="code-btn"
                :disabled="time > 0 || emailLoading"
                @click="handleSendCode"
            >
              {{ time > 0 ? `${time}s` : '获取验证码' }}
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
          注册
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

// 校验规则
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
          setTimeout(() => {
            const codeInput = document.querySelector('.code-flex input')
            if (codeInput) codeInput.focus()
          }, 100)

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

// 注册
const handleRegister = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      request
          .post('/user/register-email', form)
          .then(() => {
            ElMessage.success('欢迎加入旅行者！')
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

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
})
</script>

<style scoped>
/* 容器设置 */
.auth-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('https://sns-webpic-qc.xhscdn.com/202601070958/5d3952a78879260f7963eba9d0492281/spectrum/1040g34o317v8kc850o005oeqtctk1ko0iinlbeo!nc_n_webp_mw_1') no-repeat center center;
  background-size: cover;
  position: relative;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  z-index: 0;
}

/* 毛玻璃注册框 - 紧凑透明版 */
.auth-box {
  position: relative;
  z-index: 1;
  width: 380px;
  padding: 30px 35px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1),
  inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}

/* 头部样式 */
.auth-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo-container {
  width: 56px; /* 保持容器较小 */
  height: 56px;
  background: linear-gradient(135deg, #e0f2e9 0%, #ffffff 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.auth-header .logo {
  font-size: 40px;
  line-height: 1;
  margin-top: -2px;
}

.auth-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
}

.auth-header p {
  color: #4a5a54;
  margin: 5px 0 0;
  font-size: 13px;
  letter-spacing: 1px;
}

/* 压缩表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 16px;
}

/* 验证码布局 - Flexbox 自动控制宽度 */
.code-flex {
  display: flex;
  width: 100%;
  gap: 10px;
}

.code-input {
  flex: 1; /* 关键：自动占据剩余空间，所以按钮变宽时它会自动变短 */
}

/* 输入框样式调整 */
:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.45) !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  background-color: rgba(255, 255, 255, 0.85) !important;
  border-color: #2e7d32 !important;
  box-shadow: 0 0 0 1px rgba(46, 125, 50, 0.2) !important;
}

/* 验证码按钮 */
.code-btn {
  height: 40px;
  border-radius: 8px;
  border: 1px solid #4caf50;
  color: #4caf50;
  background: rgba(255, 255, 255, 0.4);
  font-weight: 500;
  padding: 0 15px; /* 保持适当内边距，内容变多时会自动撑开 */
  white-space: nowrap; /* 防止文字换行 */
}
.code-btn:hover {
  background: #4caf50;
  color: #fff;
}
.code-btn:disabled {
  border-color: #ccc;
  color: #999;
  background: rgba(255, 255, 255, 0.4);
}

/* 注册大按钮 */
.full-btn {
  width: 100%;
  margin-top: 5px;
  height: 42px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 2px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
  box-shadow: 0 6px 15px rgba(46, 125, 50, 0.25);
  transition: all 0.3s ease;
}

.full-btn:hover {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.35);
}
.full-btn:active {
  transform: translateY(0);
}

/* 底部链接 */
.form-footer {
  text-align: center;
  margin-top: 15px;
  font-size: 13px;
  color: #4a5a54;
}

.link {
  color: #2e7d32;
  cursor: pointer;
  font-weight: 600;
  margin-left: 5px;
  transition: all 0.2s;
}

.link:hover {
  color: #1b5e20;
  text-decoration: underline;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .auth-box {
    width: 85%;
    padding: 25px 20px;
  }
}
</style>