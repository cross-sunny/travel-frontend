<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏：深色风格 -->
      <el-aside width="200px" style="background-color: #304156; min-height: 100vh;">
        <!-- 改名点 1 -->
        <div style="height: 60px; line-height: 60px; text-align: center; color: white; font-weight: bold; font-size: 20px; border-bottom: 1px solid #455a6e;">
          旅行者后台管理
        </div>
        <el-menu
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
            router
            style="border: none;"
            :default-active="$route.path"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><Odometer /></el-icon>
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

          <!-- 此前缺失的两个菜单，现在加上 -->
          <el-menu-item index="/admin/hotel">
            <el-icon><OfficeBuilding /></el-icon>
            <span>民宿管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/food">
            <el-icon><Dish /></el-icon> <!-- 需要 Element Plus 图标支持 -->
            <span>美食管理</span>
          </el-menu-item>

          <el-menu-item index="/admin/order">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 头部 -->
        <el-header style="border-bottom: 1px solid #ccc; display: flex; align-items: center; justify-content: space-between; background: #fff;">
          <div style="font-size: 14px; color: #666;">欢迎进入旅行者管理系统</div>
          <el-dropdown>
            <span class="el-dropdown-link" style="cursor: pointer; display: flex; align-items: center;">
              管理员 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>

        <!-- 主体内容 -->
        <el-main style="background-color: #f0f2f5;">
          <div style="background: white; padding: 20px; border-radius: 8px; min-height: 85vh;">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {ArrowDown, Dish, List, MapLocation, Odometer, OfficeBuilding, User} from "@element-plus/icons-vue";
const router = useRouter()

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style>
body { margin: 0; }
</style>