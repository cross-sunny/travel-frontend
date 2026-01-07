<template>
  <div class="auth-wrapper">
    <!-- 增加黑色遮罩，提升文字可读性和氛围感 -->
    <div class="auth-overlay"></div>

    <div class="auth-box">
      <div class="auth-header">
        <!-- 同步注册页的 Logo 样式 -->
        <div class="logo-container">
          <div class="logo">🌲</div>
        </div>
        <h2>Traveler</h2>
        <p>保持热爱 · 奔赴山海</p>
      </div>

      <el-form
          :model="form"
          ref="formRef"
          size="large"
          autocomplete="off"
          class="custom-form"
      >
        <!-- 隐藏的 input，欺骗浏览器自动填充机制 -->
        <input type="text" style="display:none">
        <input type="password" style="display:none">

        <el-form-item>
          <el-input
              v-model="form.username"
              placeholder="账号 / 邮箱"
              :prefix-icon="User"
              autocomplete="off"
              name="unique-login-id"
          />
        </el-form-item>

        <el-form-item>
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              readonly
              onfocus="this.removeAttribute('readonly');"
              autocomplete="new-password"
              @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button type="primary" class="full-btn" @click="handleLogin" :loading="loading">
          登 录
        </el-button>

        <div class="form-footer">
          <span @click="$router.push('/register')">还没有账号？<span class="link">立即注册</span></span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const form = reactive({
  username: '',
  password: ''
})

// 登录逻辑保持不变
const handleLogin = async () => {
  if (!form.username || !form.password) {
    return ElMessage.warning('请输入账号和密码')
  }

  loading.value = true

  try {
    const res = await request.post('/user/login', form)

    ElMessage.success('欢迎归来') // 提示语稍微改得亲切一点
    localStorage.setItem('user', JSON.stringify(res))

    if (res.role === 'ADMIN') {
      router.push('/admin/user')
    } else {
      router.push('/')
    }

  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 容器设置 */
.auth-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 使用您提供的背景图 */
  background: url('https://sns-webpic-qc.xhscdn.com/202601070904/33b2fd34a98225566ef99176cf679cab/1040g2sg319ioq70dna705n8ogjak4okrg1cp428!nc_n_webp_mw_1') no-repeat center center;
  background-size: cover;
  position: relative;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

/* 黑色半透明遮罩，增加深邃感 */
.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25); /* 稍微比注册页深一点点 */
  backdrop-filter: blur(3px);
  z-index: 0;
}

/* 高级感毛玻璃登录框 */
.auth-box {
  position: relative;
  z-index: 1;
  width: 380px; /* 紧凑宽度 */
  padding: 35px 35px 30px; /* 调整内边距 */
  background: rgba(255, 255, 255, 0.6); /* 高通透度 */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), /* 阴影加深 */
  inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}

/* 头部样式 */
.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

/* Logo 容器 - 与注册页一致 */
.logo-container {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #e0f2e9 0%, #ffffff 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.auth-header .logo {
  font-size: 40px; /* 大树比例 */
  line-height: 1;
  margin-top: -2px;
}

.auth-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 1px;
}

.auth-header p {
  color: #4a5a54;
  margin: 8px 0 0;
  font-size: 13px;
  letter-spacing: 2px; /* 增加字间距，显得高级 */
  opacity: 0.9;
}

/* 输入框样式调整 - 半透明 */
:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.45) !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 0 12px;
  height: 42px; /* 舒适的高度 */
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  background-color: rgba(255, 255, 255, 0.85) !important;
  border-color: #2e7d32 !important;
  box-shadow: 0 0 0 1px rgba(46, 125, 50, 0.2) !important;
}

/* 表单间距 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

/* 登录大按钮 */
.full-btn {
  width: 100%;
  margin-top: 10px;
  height: 42px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px; /* 增加字间距 */
  border-radius: 8px;
  border: none;
  /* 森林绿渐变 */
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
  margin-top: 25px;
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
    padding: 30px 20px;
  }
}
</style>