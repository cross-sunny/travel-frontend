<template>
  <div class="home-container">
    <!-- 1. 巨幕轮播图 -->
    <el-carousel trigger="click" height="500px">
      <el-carousel-item v-for="item in banners" :key="item">
        <img :src="item" style="width: 100%; height: 100%; object-fit: cover;">
      </el-carousel-item>
    </el-carousel>

    <!-- 2. 热门景点展示 -->
    <div class="section">
      <div class="section-header">
        <h2>热门景点推荐</h2>
        <span style="color: #999; cursor: pointer;">查看更多 <el-icon><ArrowRight /></el-icon></span>
      </div>

      <el-row :gutter="30">
        <el-col :span="6" v-for="item in scenicList" :key="item.id" style="margin-bottom: 30px;">
          <!-- 卡片悬浮效果在 css 里 -->
          <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail(item.id)">
            <img :src="item.image" class="image">
            <div style="padding: 14px;">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-info">
                <span class="price">¥{{ item.price }}</span>
                <span class="city"><el-icon><Location /></el-icon> {{ item.city }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 3. 民宿部分 (复用逻辑) -->
    <div class="section" style="background-color: #f9f9f9;">
      <!-- 这里可以放 Hotel 的列表，逻辑同上，为了演示省略 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
// 使用 import 导入图片，自动处理路径和打包
import banner1 from '@/assets/img/banner1.jpg'
import banner2 from '@/assets/img/banner2.jpg'
import banner3 from '@/assets/img/banner3.jpg'

const router = useRouter()
const scenicList = ref([])

// 模拟一些好看的轮播图
const banners = [banner1, banner2, banner3]

onMounted(() => {
  // 获取景点列表
  request.get('/scenic/list').then(res => {
    scenicList.value = res
  })
})

const goDetail = (id) => {
  router.push('/scenic/' + id)
}
</script>

<style scoped>
.section {
  padding: 40px 10%; /* 左右留白 */
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

/* 卡片样式与悬浮特效 */
.product-card {
  transition: all 0.3s; /* 平滑过渡 */
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-8px); /* 向上浮动 */
  box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}
.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  color: #ff6600;
  font-size: 18px;
  font-weight: bold;
}
.city {
  color: #999;
  font-size: 12px;
}
</style>