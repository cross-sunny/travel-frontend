<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏：深色风格 -->
      <el-aside width="200px" style="background-color: #304156; min-height: 100vh;">
        <div style="height: 60px; line-height: 60px; text-align: center; color: white; font-weight: bold; font-size: 20px;">
          搬木民宿管理
        </div>
        <el-menu
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
            router
            style="border: none;"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><DataLine /></el-icon>
            <span>系统首页</span>
          </el-menu-item>
          <el-menu-item index="/admin/user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/scenic">
            <el-icon><MapLocation /></el-icon>
            <span>景点管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/order">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 头部 -->
        <el-header style="border-bottom: 1px solid #ccc; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 14px; color: #666;">欢迎进入管理系统</div>
          <el-dropdown>
            <span class="el-dropdown-link" style="cursor: pointer; display: flex; align-items: center;">
              管理员 <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>

        <!-- 主体内容 -->
        <el-main>
          <router-view /> <!-- 这里会变化 -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style>
/* 去除默认边距 */
body { margin: 0; }
</style>