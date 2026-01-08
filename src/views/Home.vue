<template>
  <div class="home-container">

    <!-- 1. 3D轮播图 -->
    <div class="banner-box">
      <el-carousel :interval="4000" type="card" height="450px" indicator-position="outside" arrow="always">
        <el-carousel-item v-for="(item, index) in displayBanners" :key="index" class="custom-carousel-item">
          <div class="carousel-card" @click="handleBannerClick(index)">
            <div class="image-layer"><img :src="item.img" class="banner-img"></div>
            <div class="mask-layer"></div>
            <div class="text-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 2. 热门景点 -->
    <div class="section">
      <div class="section-header">
        <div class="header-left">
          <h2>🔥 热门景点推荐</h2>
          <span class="sub-title">探索未知的自然奇观</span>
        </div>
        <span class="view-more" @click="$router.push('/scenic')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </span>
      </div>
      <el-row :gutter="30">
        <el-col :span="6" v-for="item in scenicList" :key="item.id" style="margin-bottom: 30px;">
          <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail('/scenic', item.id)">
            <div class="image-wrapper"><img :src="item.image" class="image"></div>
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

    <!-- 3. 精选民宿 -->
    <div class="section" style="background-color: #f9f9f9;">
      <div class="section-header">
        <div class="header-left">
          <h2>🏠 精选民宿推荐</h2>
          <span class="sub-title">像当地人一样生活</span>
        </div>
        <span class="view-more" @click="$router.push('/hotel')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </span>
      </div>
      <el-row :gutter="30">
        <el-col :span="6" v-for="item in hotelList" :key="item.id" style="margin-bottom: 30px;">
          <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail('/hotel', item.id)">
            <div class="image-wrapper"><img :src="item.image" class="image"></div>
            <div style="padding: 14px;">
              <div class="card-title">{{ item.name }}</div>
              <div class="card-info">
                <span class="price">¥{{ item.price }} <span style="font-size: 12px; color: #999; font-weight: normal">/晚</span></span>
                <span class="city"><el-icon><Location /></el-icon> {{ formatAddress(item.address) }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 4. 特色美食 -->
    <div class="section">
      <div class="section-header">
        <div class="header-left">
          <h2>🍽️ 特色美食推荐</h2>
          <span class="sub-title">舌尖上的极致享受</span>
        </div>
        <span class="view-more" @click="$router.push('/food')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </span>
      </div>
      <el-row :gutter="30">
        <el-col :span="6" v-for="item in foodList" :key="item.id" style="margin-bottom: 30px;">
          <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail('/food', item.id)">
            <div class="image-wrapper"><img :src="item.image" class="image"></div>
            <div style="padding: 14px;">
              <div class="card-title">{{ item.name }}</div>
              <div class="card-info">
                <span class="price">¥{{ item.price }}</span>
                <span class="city" style="color: #42b983">推荐指数 ⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { ArrowRight, Location } from "@element-plus/icons-vue";

import banner1 from '@/assets/img/banner1.jpg';
import banner2 from '@/assets/img/banner2.jpg';
import banner3 from '@/assets/img/banner3.jpg';
import banner4 from '@/assets/img/banner4.png';
import banner5 from '@/assets/img/banner5.jpg';
import banner6 from '@/assets/img/banner6.jpg';

const router = useRouter()
const scenicList = ref([])
const hotelList = ref([])
const foodList = ref([])

const rawBanners = [
  { img: banner1, title: '山川湖海', desc: '奔赴一场自然的约会' },
  { img: banner2, title: '云漫金顶', desc: '登仙山揽胜，赴道家清欢' },
  { img: banner3, title: '苏堤春晓', desc: '一湖烟雨，半程诗意' },
  { img: banner4, title: '五岳独尊', desc: '会当凌绝顶，一览众山小' },
  { img: banner5, title: '古坛遗韵', desc: '一砖一瓦皆承华夏文脉' },
  { img: banner6, title: '烟雨古镇', desc: '踏青石板，赴一场江南梦' }
]

const displayBanners = computed(() => {
  if (rawBanners.length < 3) return [...rawBanners, ...rawBanners, ...rawBanners].slice(0, 6)
  return rawBanners
})

onMounted(() => {
  // 加载三个模块的数据 (随机排序)
  loadData('/scenic/list', scenicList)
  loadData('/hotel/list', hotelList)
  loadData('/food/list', foodList)
})

const loadData = (url, targetRef) => {
  request.get(url).then(res => {
    if (res && res.length > 0) {
      // 随机排序，让每次刷新都有新鲜感
      const shuffled = res.sort(() => 0.5 - Math.random())
      targetRef.value = shuffled.slice(0, 4) // 只取前4个
    }
  })
}

const goDetail = (path, id) => router.push(path + '/' + id)
const handleBannerClick = (index) => router.push('/scenic')
const formatAddress = (addr) => addr ? (addr.length > 8 ? addr.substring(0, 8) + '...' : addr) : ''
</script>

<style scoped>
/* ============= 1. 高级 3D 轮播图样式 ============= */
.banner-box {
  padding-top: 20px;
  background: linear-gradient(to bottom, #fff 80%, #f9f9f9 100%); /* 底部微渐变衔接 */
  margin-bottom: 20px;
}

.custom-carousel-item {
  border-radius: 12px;
  /* 解决 Safari 圆角溢出问题 */
  overflow: hidden;
}

.carousel-card {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); /* 默认阴影 */
  transition: all 0.4s ease-in-out;
}

.image-layer {
  width: 100%;
  height: 100%;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease; /* 图片缩放动画 */
}

/* 无图时的占位样式 */
.empty-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e0e5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
}

/* 遮罩层：默认覆盖黑色半透明，制造景深 */
.mask-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* 默认变暗 */
  transition: background 0.4s ease;
  z-index: 1;
}

/* 文字层：默认隐藏或透明 */
.text-content {
  position: absolute;
  bottom: 40px;
  left: 30px;
  z-index: 2;
  color: #fff;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.text-content h3 {
  font-size: 28px;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.text-content p {
  font-size: 16px;
  background: rgba(0,0,0,0.3);
  padding: 4px 10px;
  border-radius: 4px;
  display: inline-block;
  backdrop-filter: blur(4px);
}

/* >>>>>>> 核心魔法：Element Plus 的 is-active 类 <<<<<<< */
/* 当卡片处于中间激活状态时 */
.el-carousel__item.is-active .mask-layer {
  background: rgba(0, 0, 0, 0); /* 激活时去掉遮罩，变亮 */
}

.el-carousel__item.is-active .text-content {
  opacity: 1; /* 显示文字 */
  transform: translateY(0);
}

.el-carousel__item.is-active .banner-img {
  transform: scale(1.05); /* 激活时图片微放大 */
}

.el-carousel__item.is-active .carousel-card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); /* 激活时阴影加重，浮起感 */
}

/* ============= 通用板块样式 ============= */
.section {
  padding: 40px 10%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* 底部对齐 */
  margin-bottom: 30px;
}

.header-left h2 {
  font-size: 26px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 700;
}

.sub-title {
  font-size: 14px;
  color: #999;
}

.view-more {
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s;
  font-size: 14px;
}

.view-more:hover {
  color: #42b983;
}

/* ============= 卡片样式 ============= */
.product-card {
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  border: none;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
}

.image-wrapper {
  height: 200px;
  overflow: hidden;
  position: relative;
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
  color: #333;
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
  display: flex;
  align-items: center;
}
</style>