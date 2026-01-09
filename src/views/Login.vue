<template>
  <div class="auth-container">
    <div class="auth-card">

      <!-- 左侧区域 -->
      <div class="card-left">
        <el-avatar
            :size="90"
            :src="localAvatar"
            class="clean-avatar"
        />
        <h1 class="app-name">Traveler</h1>
        <p class="app-slogan">保持热爱 · 奔赴山海</p>
      </div>

      <!-- 右侧区域 -->
      <div class="card-right">
        <transition name="fade-slide" mode="out-in">

          <!-- 1. 登录表单 -->
          <div v-if="!isResetMode" key="login" class="form-wrapper">
            <div class="form-header">
              <h2>登 录</h2>
            </div>

            <el-form :model="form" size="large">
              <el-form-item>
                <el-input
                    v-model="form.username"
                    placeholder="用户名"
                    class="glass-input"
                />
              </el-form-item>

              <el-form-item>
                <el-input
                    v-model="form.password"
                    type="password"
                    placeholder="密码"
                    show-password
                    class="glass-input"
                    @keyup.enter="handleLogin"
                />
              </el-form-item>

              <div class="actions">
                <el-checkbox v-model="remember" label="记住密码" class="custom-checkbox" />
                <span class="link-text" @click="isResetMode = true">忘记密码</span>
              </div>

              <el-button
                  class="submit-btn"
                  :loading="loading"
                  @click="handleLogin"
              >
                立即登录
              </el-button>
            </el-form>

            <div class="footer-text">
              没有账号？<span class="link-text" @click="$router.push('/register')">立即注册</span>
            </div>
          </div>

          <!-- 2. 重置密码表单 -->
          <div v-else key="reset" class="form-wrapper">
            <div class="form-header">
              <h2>重置密码</h2>
            </div>

            <el-form :model="resetForm" :rules="resetRules" ref="resetFormRef" size="large">
              <el-form-item prop="email">
                <el-input
                    v-model="resetForm.email"
                    placeholder="请输入注册邮箱"
                    class="glass-input"
                />
              </el-form-item>

              <el-form-item prop="code">
                <div class="code-flex">
                  <el-input
                      v-model="resetForm.code"
                      placeholder="验证码"
                      class="glass-input code-input"
                  />
                  <el-button class="code-btn" :disabled="time > 0" @click="sendCode">
                    {{ time > 0 ? `${time}s` : '发送验证码' }}
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item prop="newPassword">
                <el-input
                    v-model="resetForm.newPassword"
                    type="password"
                    placeholder="设置新密码"
                    class="glass-input"
                />
              </el-form-item>

              <el-button
                  class="submit-btn"
                  :loading="loading"
                  @click="handleReset"
              >
                确认修改
              </el-button>
            </el-form>

            <div class="footer-text">
              <span class="link-text" @click="isResetMode = false">返回登录</span>
            </div>
          </div>

        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import localAvatar from '@/assets/img/pic.png'

const router = useRouter()
const loading = ref(false)
const isResetMode = ref(false)
const remember = ref(false)

const form = reactive({ username: '', password: '' })

// === 1. 页面加载：自动填充记住的密码 ===
onMounted(() => {
  const savedInfo = localStorage.getItem('login_remember')
  if (savedInfo) {
    try {
      // 简单解密并填充
      const decrypted = JSON.parse(atob(savedInfo))
      form.username = decrypted.u
      form.password = decrypted.p
      remember.value = true
    } catch (e) {
      localStorage.removeItem('login_remember')
    }
  }
})

// === 2. 登录逻辑：处理记住密码 ===
const handleLogin = async () => {
  if (!form.username || !form.password) return ElMessage.warning('请输入账号和密码')
  loading.value = true
  try {
    const res = await request.post('/user/login', form)
    ElMessage.success('登录成功')

    // 如果勾选了记住密码，保存到本地
    if (remember.value) {
      const info = btoa(JSON.stringify({ u: form.username, p: form.password }))
      localStorage.setItem('login_remember', info)
    } else {
      localStorage.removeItem('login_remember')
    }

    localStorage.setItem('user', JSON.stringify(res))
    router.push(res.role === 'ADMIN' ? '/admin/user' : '/')
  } catch (err) { console.error(err) } finally { loading.value = false }
}

const resetFormRef = ref(null)
const time = ref(0)
const timer = ref(null)
const resetForm = reactive({ email: '', code: '', newPassword: '' })

const resetRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '格式错误', trigger: 'blur' }],
  code: [{ required: true, message: '必填', trigger: 'blur' }],
  newPassword: [{ required: true, message: '必填', trigger: 'blur' }]
}

// === 3. 发送验证码：标记为重置模式 ===
const sendCode = () => {
  resetFormRef.value.validateField('email', (valid) => {
    if (valid) {
      // type: 'reset' 是关键！
      request.post('/user/send-code', null, { params: { email: resetForm.email, type: 'reset' } }).then(() => {
        ElMessage.success('验证码已发送')
        time.value = 60
        timer.value = setInterval(() => { time.value--; if(time.value <= 0) clearInterval(timer.value) }, 1000)
      })
    }
  })
}

const handleReset = () => {
  resetFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      request.post('/user/reset-password', resetForm).then(() => {
        ElMessage.success('重置成功，请使用新密码登录')
        isResetMode.value = false
        // 自动填入新密码
        form.password = ''
      }).finally(() => loading.value = false)
    }
  })
}

onUnmounted(() => { if(timer.value) clearInterval(timer.value) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Noto+Sans+SC:wght@300;400;500&display=swap');

.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('/src/assets/img/Login.jpg') no-repeat center center;
  background-size: cover;
  font-family: 'Noto Sans SC', sans-serif;
  color: #f0f0f0;
}

.auth-card {
  width: 700px;
  height: 400px;
  display: flex;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.card-left {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 修改点：加深分割线颜色 0.1 -> 0.3 */
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.01);
  text-shadow: 0 2px 8px rgba(0,0,0,0.6);
}

.clean-avatar {
  background: transparent !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  margin-bottom: 15px;
}

.app-name {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  letter-spacing: 2px;
  margin: 5px 0;
  font-weight: 700;
  color: #fff;
}

.app-slogan {
  font-size: 12px;
  opacity: 0.9;
  letter-spacing: 3px;
  font-weight: 300;
}

.card-right {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 修改点：增加左右 Padding，让输入框看起来更短，整体更聚拢 (70%宽度) */
  padding: 0 85px;
}

.form-wrapper { width: 100%; }

.form-header h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 25px;
  letter-spacing: 6px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  font-weight: 500;
}

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
  font-size: 13px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.code-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  margin-bottom: 20px;
  font-size: 13px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
:deep(.el-checkbox__label) { color: #f0f0f0 !important; }
:deep(.el-checkbox__inner) { background: transparent !important; border-color: rgba(255, 255, 255, 0.6) !important; }
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) { background: #fff !important; border-color: #fff !important; }
:deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) { border-color: #000 !important; }

.link-text {
  color: #f0f0f0;
  cursor: pointer;
  font-size: 13px;
  text-decoration: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
  transition: 0.3s;
}
.link-text:hover { color: #fff; border-bottom-style: solid; }

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

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }
</style>