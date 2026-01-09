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
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in list" :key="item.id" style="margin-bottom: 20px;">
        <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail(item.id)">

          <!-- 右上角角标：民宿统一风格 -->
          <div class="recommend-tag purple-tag">严选民宿</div>

          <div class="image-wrapper">
            <img :src="item.image" class="image">
          </div>

          <div style="padding: 14px;">
            <div class="card-title">{{ item.name }}</div>
            <!-- 地址部分 -->
            <div class="desc">
              <el-icon style="vertical-align: -1px; margin-right: 4px;"><Location /></el-icon>
              {{ formatAddr(item.address) }}
            </div>

            <div class="card-bottom">
              <span class="price">¥{{ item.price }} <span style="font-size:12px;color:#999;font-weight:normal">/晚</span></span>
              <!-- 右下角圆形按钮：换成了手提箱图标 -->
              <el-button type="primary" size="small" circle icon="Suitcase" class="action-btn" />
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
import { Search, Location, Suitcase } from '@element-plus/icons-vue'

const router = useRouter()
const list = ref([])
const search = ref('')

const load = () => {
  request.get('/hotel/list', { params: { name: search.value } }).then(res => {
    list.value = res || []
  })
}

const goDetail = (id) => router.push('/hotel/' + id)

const formatAddr = (addr) => {
  if(!addr) return ''
  return addr.length > 12 ? addr.substring(0,12)+'...' : addr
}

onMounted(load)
</script>

<style scoped>
/* 完全复用样式 */
.list-container { width: 1200px; margin: 30px auto; max-width: 95%; }
.page-header { text-align: center; margin-bottom: 40px; }
.search-box { width: 500px; margin: 20px auto; max-width: 100%; }

.product-card {
  cursor: pointer;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  border: none;
}
.product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

.image-wrapper { height: 220px; overflow: hidden; }
.image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .image { transform: scale(1.1); }

.card-title { font-size: 18px; font-weight: bold; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.desc { font-size: 13px; color: #888; margin-bottom: 15px; height: 24px; display: flex; align-items: center; }

.card-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { color: #f56c6c; font-size: 22px; font-weight: bold; }

/* 按钮定制：橙色系适合民宿 */
.action-btn { background: #E6A23C; border-color: #E6A23C; color: white; }
.action-btn:hover { background: #ebb563; border-color: #ebb563; }

/* 紫色角标 */
.recommend-tag {
  position: absolute; top: 10px; right: 10px;
  color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; z-index: 10;
}
.purple-tag {
  background: linear-gradient(45deg, #a18cd1, #fbc2eb);
  box-shadow: 0 2px 10px rgba(161, 140, 209, 0.4);
}
</style>