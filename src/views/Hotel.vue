<template>
  <div class="list-container">
    <div class="page-header">
      <h2>🏠 精选民宿·舒适安居</h2>
      <div class="search-box">
        <el-input v-model="search" placeholder="搜索民宿名称..." size="large" @keyup.enter="load">
          <template #append><el-button @click="load"><el-icon><Search /></el-icon></el-button></template>
        </el-input>
      </div>
    </div>

    <el-row :gutter="30">
      <el-col :span="6" v-for="item in list" :key="item.id" style="margin-bottom: 30px;">
        <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail(item.id)">
          <div class="image-wrapper">
            <img :src="item.image" class="image">
          </div>
          <div style="padding: 14px;">
            <div class="card-title">{{ item.name }}</div>
            <div class="card-tags">
              <el-tag type="success" size="small"><el-icon><Location /></el-icon> {{ item.address }}</el-tag>
            </div>
            <div class="card-bottom">
              <span class="price">¥{{ item.price }} <span style="font-size:12px; color:#999; font-weight:normal;">/晚</span></span>
              <el-button type="primary" plain size="small">立即预定</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="list.length === 0" description="暂无民宿数据"></el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()
const list = ref([])
const search = ref('')

const load = () => {
  // 注意 API 是 /hotel/list
  request.get('/hotel/list', { params: { name: search.value } }).then(res => {
    list.value = res
  })
}

const goDetail = (id) => {
  router.push('/hotel/' + id)
}

onMounted(load)
</script>

<style scoped>
/* 样式与 Scenic.vue 完全通用 */
.list-container { width: 1200px; margin: 30px auto; }
.page-header { text-align: center; margin-bottom: 40px; }
.search-box { width: 500px; margin: 20px auto; }
.product-card { cursor: pointer; border-radius: 12px; overflow: hidden; transition: all 0.3s; }
.product-card:hover { transform: translateY(-8px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
.image-wrapper { height: 200px; overflow: hidden; }
.image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .image { transform: scale(1.1); }
.card-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
.card-tags { margin-bottom: 15px; height: 24px; overflow: hidden; }
.card-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { color: #ff6600; font-size: 20px; font-weight: bold; }
</style>