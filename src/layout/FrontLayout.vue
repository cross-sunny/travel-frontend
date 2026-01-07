<template>
  <div class="layout-container">
    <!-- 1. 顶部导航栏 -->
    <div class="header">
      <div class="header-content">
        <!-- 左侧 Logo -->
        <div class="logo" @click="$router.push('/')">
          <el-icon class="logo-icon"><House /></el-icon>
          <span>旅行者</span>
        </div>

        <!-- 中间 导航菜单 -->
        <div class="nav-menu">
          <span class="nav-item" :class="{ active: $route.path === '/' }" @click="$router.push('/')">首页</span>

          <span class="nav-item" :class="{ active: $route.path.includes('/scenic') }" @click="$router.push('/scenic')">景点信息</span>

          <!-- 新增酒店入口 -->
          <span class="nav-item" :class="{ active: $route.path.includes('/hotel') }" @click="$router.push('/hotel')">民宿预定</span>

          <!-- 新增美食入口 -->
          <span class="nav-item" :class="{ active: $route.path.includes('/food') }" @click="$router.push('/food')">特产美食</span>

          <!-- 登录才显示 -->
          <span v-if="user.id" class="nav-item" :class="{ active: $route.path === '/user-center' }" @click="$router.push('/user-center')">我的订单</span>
        </div>

        <!-- 右侧 用户区域 -->
        <div class="user-area">
          <!-- 未登录状态 -->
          <div v-if="!user.id">
            <el-button type="primary" plain @click="$router.push('/login')">登录</el-button>
            <el-button type="primary" @click="$router.push('/register')">注册</el-button>
          </div>

          <!-- 已登录状态 (下拉菜单) -->
          <div v-else class="logged-in">
            <el-dropdown trigger="click">
              <div class="avatar-wrapper">
                <el-avatar
                    :size="40"
                    :src="user.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                />
                <span class="nickname">{{ user.nickname || user.username }}</span>
                <el-icon><CaretBottom /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/user-center')">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item v-if="user.role === 'ADMIN'" @click="$router.push('/admin/user')">
                    <el-icon><Monitor /></el-icon>后台管理
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 主体内容区域 (路由出口) -->
    <div class="main-content">
      <router-view />
    </div>

    <!-- 3. 底部 Footer -->
    <div class="footer">
      <div class="footer-content">
        <p>© 2026 旅行者 - 让心灵去旅行</p>
        <p style="font-size: 12px; color: #999; margin-top: 5px;">
          实训演示项目 | 技术栈：Vue3 + SpringBoot + ElementPlus
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const user = ref({})

// 初始化加载用户信息
onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      user.value = JSON.parse(userStr)
    } catch (e) {
      console.error('用户信息解析失败', e)
    }
  }
})

// 退出登录
const logout = () => {
  localStorage.removeItem('user')
  user.value = {}
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
/* 整体布局容器 */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶部 Header */
.header {
  height: 70px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  width: 1200px; /* 固定宽度，居中显示 */
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  color: #42b983;
  cursor: pointer;
}
.logo-icon {
  margin-right: 8px;
  font-size: 26px;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 40px;
}
.nav-item {
  font-size: 16px;
  color: #333;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
  padding: 5px 0;
}
.nav-item:hover {
  color: #42b983;
}
/* 选中状态下划线 */
.nav-item.active {
  color: #42b983;
  font-weight: 500;
}
.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #42b983;
}

/* 用户区域 */
.user-area {
  display: flex;
  align-items: center;
}
.logged-in {
  cursor: pointer;
}
.avatar-wrapper {
  display: flex;
  align-items: center;
  outline: none;
}
.nickname {
  margin: 0 8px;
  font-size: 14px;
  color: #666;
}

/* 主体内容 */
.main-content {
  flex: 1; /* 撑满剩余高度 */
  width: 100%;
}

/* 底部 Footer */
.footer {
  background-color: #2b2f3a;
  color: #fff;
  padding: 40px 0;
  margin-top: auto; /* 保证吸底 */
}
.footer-content {
  width: 1200px;
  margin: 0 auto;
  text-align: center;
}
</style>