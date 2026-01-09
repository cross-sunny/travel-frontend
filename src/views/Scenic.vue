<template>
  <div class="list-container">
    <div class="page-header">
      <h2>🏞️ 探索绝美景点</h2>
      <div class="search-box">
        <el-input v-model="search" placeholder="搜索景点名称..." size="large" class="search-input" @keyup.enter="load">
          <template #append><el-button @click="load"><el-icon><Search /></el-icon></el-button></template>
        </el-input>
      </div>
    </div>

    <el-row :gutter="30" style="min-height: 400px;">
      <!-- 修正：遍历 list -->
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in list" :key="item.id" style="margin-bottom: 20px;">
        <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail(item.id)">
          <div class="image-wrapper">
            <img :src="item.image" class="image" loading="lazy">
          </div>
          <div style="padding: 14px;">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-tags">
              <el-tag size="small" effect="plain">{{ item.city }}</el-tag>
              <el-rate v-model="item.star" disabled text-color="#ff9900" score-template="{value}" />
            </div>
            <div class="card-bottom">
              <span class="price">¥{{ item.price }}</span>
              <span class="view-btn" style="font-size: 12px; color: #999;">查看详情</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="list.length === 0" description="暂无相关景点数据"></el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const list = ref([]) // 变量名正确
const search = ref('')

const load = () => {
  request.get('/scenic/list', { params: { title: search.value } }).then(res => {
    list.value = res || [] // 赋值正确
  })
}

const goDetail = (id) => router.push('/scenic/' + id)
onMounted(load)
</script>


<style scoped>
.list-container {
  width: 1200px;
  margin: 30px auto;
}
.page-header {
  text-align: center;
  margin-bottom: 40px;
}
.search-box {
  width: 500px;
  margin: 20px auto;
}
/* 卡片通用样式 */
.product-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  border-radius: 12px;
  overflow: hidden;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
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
  transform: scale(1.1); /* 图片放大效果 */
}
.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-tags {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  color: #ff6600;
  font-size: 20px;
  font-weight: bold;
}
.view-btn {
  font-size: 13px;
  color: #999;
}
</style>