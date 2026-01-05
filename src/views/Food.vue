<template>
  <div class="list-container">
    <div class="page-header">
      <h2>🍲 寻味·特产美食</h2>
      <div class="search-box">
        <el-input v-model="search" placeholder="搜索想吃的美食..." size="large" @keyup.enter="load">
          <template #append><el-button @click="load"><el-icon><Search /></el-icon></el-button></template>
        </el-input>
      </div>
    </div>

    <el-row :gutter="30">
      <el-col :span="6" v-for="item in list" :key="item.id" style="margin-bottom: 30px;">
        <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail(item.id)">
          <!-- 推荐角标 -->
          <div v-if="item.recommend === 1" class="recommend-tag">店长推荐</div>

          <div class="image-wrapper">
            <img :src="item.image" class="image">
          </div>
          <div style="padding: 14px;">
            <div class="card-title">{{ item.name }}</div>
            <div class="desc">{{ item.description || '暂无介绍' }}</div>
            <div class="card-bottom">
              <span class="price">¥{{ item.price }}</span>
              <el-button type="primary" size="small" circle icon="ShoppingCart" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="list.length === 0" description="暂无美食数据"></el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()
const list = ref([])
const search = ref('')

// 注意：后端 Controller 路径是 /food/list
const load = () => {
  request.get('/food/list', { params: { name: search.value } }).then(res => {
    list.value = res
  })
}

const goDetail = (id) => {
  router.push('/food/' + id)
}

onMounted(load)
</script>

<style scoped>
/* 复用 Scenic.vue 的大部分样式，增加一些特有样式 */
.list-container { width: 1200px; margin: 30px auto; }
.page-header { text-align: center; margin-bottom: 40px; }
.search-box { width: 500px; margin: 20px auto; }

.product-card {
  cursor: pointer;
  border-radius: 12px;
  position: relative; /* 为了定位角标 */
  overflow: hidden;
  transition: all 0.3s;
}
.product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

.image-wrapper { height: 220px; overflow: hidden; }
.image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .image { transform: scale(1.1); }

.card-title { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
.desc { font-size: 12px; color: #888; margin-bottom: 15px; height: 34px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;}
.card-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { color: #f56c6c; font-size: 22px; font-weight: bold; }

/* 推荐角标样式 */
.recommend-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #ff6b6b, #ff4757);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(255, 71, 87, 0.4);
}
</style>