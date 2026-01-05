<template>
  <div>
    <!-- 顶部导航栏 -->
    <div style="height: 60px; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; padding: 0 50px;">
      <div style="font-size: 24px; font-weight: bold; color: #333;">
        <el-icon style="vertical-align: middle; color: #42b983;"><House /></el-icon> 搬木民宿庄园
      </div>
      <div style="display: flex; gap: 30px;">
        <span class="nav-item" @click="$router.push('/')">主页</span>
        <span class="nav-item">景点信息</span>
        <span class="nav-item">民宿信息</span>
        <span class="nav-item">通知公告</span>
        <span class="nav-item" v-if="user.id" @click="$router.push('/my-order')">我的订单</span>
      </div>
      <div>
        <div v-if="!user.id">
          <el-button type="primary" @click="$router.push('/login')">登录 / 注册</el-button>
        </div>
        <div v-else style="display: flex; align-items: center;">
          <img :src="user.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
          <span>{{ user.nickname }}</span>
          <el-button link type="danger" style="margin-left: 10px;" @click="logout">退出</el-button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// 从本地存储获取用户信息，如果没有则为空对象
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

const logout = () => {
  localStorage.removeItem('user')
  user.value = {}
  location.reload()
}
</script>

<style scoped>
.nav-item {
  cursor: pointer;
  font-size: 16px;
  color: #666;
}
.nav-item:hover {
  color: #42b983; /* 绿色高亮 */
}
</style>