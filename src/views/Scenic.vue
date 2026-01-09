<template>
  <div class="list-container">
    <div class="page-header">
      <h2>🏞️ 探索绝美景点</h2>
      <div class="search-box">
        <el-input v-model="search" placeholder="搜索景点名称..." size="large" @keyup.enter="load">
          <template #append><el-button @click="load"><el-icon><Search /></el-icon></el-button></template>
        </el-input>
      </div>
    </div>

    <el-row :gutter="30">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in list" :key="item.id" style="margin-bottom: 20px;">
        <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover" @click="goDetail(item.id)">

          <!-- 右上角角标：根据星级动态显示 -->
          <div v-if="item.star >= 5" class="recommend-tag">5A景区</div>
          <div v-else class="recommend-tag blue-tag">热门景点</div>

          <div class="image-wrapper">
            <img :src="item.image" class="image" loading="lazy">
          </div>

          <div style="padding: 14px;">
            <div class="card-title">{{ item.title }}</div>
            <!-- 使用 desc 样式显示城市，保持高度统一 -->
            <div class="desc">
              <el-icon style="vertical-align: -1px"><Location /></el-icon> {{ item.city }}
            </div>

            <div class="card-bottom">
              <span class="price">¥{{ item.price }}</span>
              <!-- 右下角圆形按钮：换成了票据图标 -->
              <el-button type="primary" size="small" circle icon="Ticket" class="action-btn" />
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
import { Search, Location, Ticket } from '@element-plus/icons-vue'

const router = useRouter()
const list = ref([])
const search = ref('')

const load = () => {
  request.get('/scenic/list', { params: { title: search.value } }).then(res => {
    list.value = res || []
  })
}

const goDetail = (id) => router.push('/scenic/' + id)
onMounted(load)
</script>

<style scoped>
.list-container { width: 1200px; margin: 30px auto; max-width: 95%; }
.page-header { text-align: center; margin-bottom: 40px; }
.search-box { width: 500px; margin: 20px auto; max-width: 100%; }

/* 卡片核心样式 (与美食保持一致) */
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

/* 按钮微调 */
.action-btn { background: #409EFF; border-color: #409EFF; }
.action-btn:hover { background: #66b1ff; border-color: #66b1ff; }

/* 角标样式 */
.recommend-tag {
  position: absolute; top: 10px; right: 10px;
  background: linear-gradient(45deg, #ff6b6b, #ff4757);
  color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; z-index: 10;
  box-shadow: 0 2px 10px rgba(255, 71, 87, 0.4);
}
.blue-tag {
  background: linear-gradient(45deg, #409EFF, #36d1dc);
  box-shadow: 0 2px 10px rgba(64, 158, 255, 0.4);
}
</style>