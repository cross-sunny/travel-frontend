<template>
  <div class="auth-container">
    <!-- 注册卡片：单栏，宽度较窄 -->
    <div class="auth-card register-card">
      <div class="form-wrapper">
        <div class="form-header">
          <!-- 顶部 LOGO -->
          <h1 class="app-name">Traveler</h1>
          <h2>注 册</h2>
        </div>

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
                placeholder="账号"
                class="glass-input"
                autocomplete="off"
            />
          </el-form-item>

          <!-- 昵称 -->
          <el-form-item prop="nickname">
            <el-input
                v-model="form.nickname"
                placeholder="昵称"
                class="glass-input"
                autocomplete="off"
            />
          </el-form-item>

          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input
                v-model="form.email"
                placeholder="电子邮箱"
                class="glass-input"
                autocomplete="off"
            />
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="code">
            <div class="code-flex">
              <el-input
                  v-model="form.code"
                  placeholder="验证码"
                  class="glass-input code-input"
                  maxlength="6"
                  @input="form.code = form.code.replace(/\D/g, '')"
              />
              <el-button
                  class="code-btn"
                  :disabled="time > 0 || emailLoading"
                  @click="handleSendCode"
              >
                {{ time > 0 ? `${time}s` : '发送验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
                v-model="form.password"
                type="password"
                placeholder="设置登录密码"
                show-password
                readonly
                onfocus="this.removeAttribute('readonly');"
                autocomplete="new-password"
                class="glass-input"
            />
          </el-form-item>

          <el-button type="primary" class="submit-btn" @click="handleRegister" :loading="submitLoading">
            立 即 注 册
          </el-button>

          <div class="footer-text">
            <span class="link-text" @click="$router.push('/login')">已有账号？去登录</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// 确保这些图标引入了，否则 HTML 会报错
import { User, Lock, Message, Key, Avatar } from '@element-plus/icons-vue'

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

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (!value) callback(new Error('请输入验证码'))
        else if (!/^\d{6}$/.test(value)) callback(new Error('验证码必须是6位数字'))
        else callback()
      }, trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleSendCode = () => {
  formRef.value.validateField('email', (valid) => {
    if (!valid) return
    emailLoading.value = true
    // type: 'register' 是关键！
    request.post('/user/send-code', null, { params: { email: form.email, type: 'register' } })
        .then(() => {
          ElMessage.success(`验证码已发送至 ${form.email}`)
          time.value = 60
          timer.value = setInterval(() => {
            time.value--
            if (time.value <= 0) { clearInterval(timer.value); timer.value = null }
          }, 1000)
        })
        .finally(() => { emailLoading.value = false })
  })
}

const handleRegister = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      request.post('/user/register-email', form)
          .then(() => {
            ElMessage.success('欢迎加入旅行者！')
            router.push('/login')
          })
          .finally(() => { submitLoading.value = false })
    }
  })
}

onUnmounted(() => { if (timer.value) clearInterval(timer.value) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Noto+Sans+SC:wght@300;400;500&display=swap');

.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 使用与登录页风格一致的背景 */
  background: url('/src/assets/img/Login.jpg') no-repeat center center;
  background-size: cover;
  font-family: 'Noto Sans SC', sans-serif;
  color: #f0f0f0;
}

/* 注册卡片：单栏，宽度稍窄，高度自适应 */
.auth-card {
  width: 420px; /* 单栏宽度 */
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
}

.form-wrapper { width: 100%; }

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-name {
  font-family: 'Cinzel', serif;
  font-size: 28px;
  letter-spacing: 2px;
  margin: 0 0 10px 0;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.form-header h2 {
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: 400;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  opacity: 0.9;
}

/* 输入框通用样式 */
:deep(.glass-input .el-input__wrapper) {
  background: rgba(0, 0, 0, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.10) !important;
  box-shadow: none !important;
  border-radius: 30px !important;
  padding: 0 20px;
  height: 44px;
  transition: 0.3s;
}

:deep(.glass-input .el-input__wrapper:hover),
:deep(.glass-input .el-input__wrapper.is-focus) {
  background: rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
}

:deep(.glass-input .el-input__inner) {
  color: #fff !important;
  font-size: 15px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
:deep(.glass-input .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
  text-shadow: none;
}

.code-flex {
  display: flex;
  gap: 12px;
  width: 100%;
}
.code-input { flex: 1; }
.code-btn {
  width: 110px;
  height: 44px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.10) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  font-size: 12px; /* 验证码文字稍小 */
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.code-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
}

.submit-btn {
  width: 100%;
  height: 44px;
  border-radius: 30px;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 16px;
  letter-spacing: 4px;
  transition: all 0.3s;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  margin-top: 10px;
}
.submit-btn:hover {
  background: rgba(20, 20, 20, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.footer-text {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.link-text {
  color: #f0f0f0;
  cursor: pointer;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
  transition: 0.3s;
}
.link-text:hover { color: #fff; border-bottom-style: solid; }
</style>