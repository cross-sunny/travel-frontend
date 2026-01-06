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
        <h2>🔥 热门景点推荐</h2>
        <!-- 修改点1：添加点击跳转 -->
        <span class="view-more" @click="$router.push('/scenic')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </span>
      </div>

      <el-row :gutter="30">
        <el-col :span="6" v-for="item in scenicList" :key="item.id" style="margin-bottom: 30px;">
          <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail(item.id)">
            <div class="image-wrapper">
              <img :src="item.image" class="image">
            </div>
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

    <!-- 3. 精选民宿 (可选) -->
    <div class="section" style="background-color: #f9f9f9;">
      <div class="section-header">
        <h2>🏠 精选民宿</h2>
        <span class="view-more" @click="$router.push('/hotel')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </span>
      </div>
      <!-- 这里可以加民宿的逻辑，为了简洁略 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import {ArrowRight, Location} from "@element-plus/icons-vue";

const router = useRouter()
const scenicList = ref([])

import banner1 from '@/assets/img/banner1.jpg';
import banner2 from '@/assets/img/banner2.jpg';
import banner3 from '@/assets/img/banner3.jpg';

const banners = [banner1, banner2, banner3];

onMounted(() => {
  // 修改点2：获取数据后随机打乱并截取前8个
  request.get('/scenic/list').then(res => {
    if (res && res.length > 0) {
      // 随机排序算法
      const shuffled = res.sort(() => 0.5 - Math.random())
      // 截取前8个
      scenicList.value = shuffled.slice(0, 8)
    }
  })
})

const goDetail = (id) => {
  router.push('/scenic/' + id)
}
</script>

<style scoped>
.section {
  padding: 40px 10%;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.view-more {
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}
.view-more:hover {
  color: #42b983;
}

.product-card {
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
}

.image-wrapper {
  height: 200px;
  overflow: hidden;
}
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.product-card:hover .image {
  transform: scale(1.1);
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