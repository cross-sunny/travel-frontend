<template>
  <div class="auth-wrapper">
    <div class="auth-box">
      <div class="auth-header">
        <div class="logo">🌲</div>
        <h2>登录搬木民宿</h2>
        <p>欢迎回来，继续您的旅程</p>
      </div>

      <el-form
          :model="form"
          ref="formRef"
          size="large"
          autocomplete="off"
      >
        <!-- 隐藏的 input，欺骗浏览器 -->
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
              placeholder="密码"
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
          <span @click="$router.push('/register')">没有账号？<span class="link">免费注册</span></span>
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

const handleLogin = () => {
  if (!form.username || !form.password) {
    return ElMessage.warning('请输入账号和密码')
  }

  loading.value = true
  request.post('/user/login', form)
      .then(res => {
        ElMessage.success('登录成功')
        localStorage.setItem('user', JSON.stringify(res))

        // 判断角色跳转
        if (res.role === 'ADMIN') {
          router.push('/admin/user')
        } else {
          router.push('/')
        }
      })
      .finally(() => {
        loading.value = false
      })
}
</script>

<style scoped>
/* 样式与注册页保持一致 */
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('https://img.zcool.cn/community/01f06e5d0859cca8012051cd108253.jpg@1280w_1l_2o_100sh.jpg') no-repeat center center;
  background-size: cover;
}

.auth-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
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