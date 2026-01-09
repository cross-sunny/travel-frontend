<template>
  <div>
    <!-- 欢迎语 -->
    <div style="margin-bottom: 20px;">
      <h2 style="margin-bottom: 5px;">👋 欢迎回来，管理员</h2>
      <p style="color: #999;">这里是旅行者旅游平台的数据概览中心。</p>
    </div>

    <!-- 数据卡片 (真实数据) -->
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="data-card card-1">
          <div class="card-title">总注册用户</div>
          <div class="card-num">{{ stats.userCount }}</div>
          <div class="card-icon"><el-icon><User /></el-icon></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card card-2">
          <div class="card-title">景点/民宿/美食</div>
          <div class="card-num">{{ stats.productCount }}</div>
          <div class="card-icon"><el-icon><Goods /></el-icon></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card card-3">
          <div class="card-title">总订单成交量</div>
          <div class="card-num">{{ stats.orderCount }}</div>
          <div class="card-icon"><el-icon><Tickets /></el-icon></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-card card-4">
          <div class="card-title">平台总交易额</div>
          <div class="card-num">¥ {{ stats.totalSales }}</div>
          <div class="card-icon"><el-icon><Wallet /></el-icon></div>
        </div>
      </el-col>
    </el-row>

    <!-- 创新部分：替换原本的图片，改为实用的最新订单列表 -->
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📝 最新交易动态</span>
              <el-tag type="success" size="small" effect="plain">实时更新</el-tag>
            </div>
          </template>
          <el-table :data="recentOrders" style="width: 100%" size="small">
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="price" label="金额" width="100">
              <template #default="scope">
                <span style="color: #f56c6c; font-weight: bold;">+{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="productType" label="类型" width="80">
              <template #default="scope">
                <el-tag size="small" :type="getTypeTag(scope.row.productType)">{{ getTypeLabel(scope.row.productType) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="160">
              <template #default="scope">
                {{ scope.row.createTime ? scope.row.createTime.replace('T', ' ') : '' }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📢 系统公告</span>
            </div>
          </template>
          <div style="font-size: 14px; color: #666; line-height: 2;">
            <p><el-tag size="small">通知</el-tag> 所有代码备份已完成</p>
            <p><el-tag size="small" type="warning">维护</el-tag> 每周三凌晨服务器维护</p>
            <p><el-tag size="small" type="danger">警告</el-tag> 暂无异常访问</p>
            <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
              <img src="https://images.pexels.com/photos/7054516/pexels-photo-7054516.jpeg" style="width: 100%; border-radius: 8px; opacity: 0.8;">
              <p style="font-size: 12px; color: #999;">系统运行平稳</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const stats = ref({
  userCount: 0,
  productCount: 0,
  orderCount: 0,
  totalSales: 0
})

const recentOrders = ref([])

onMounted(() => {
  // 1. 获取统计数据
  request.get('/dashboard/stats').then(res => {
    stats.value = res
  })

  // 2. 获取最新订单 (复用订单列表接口，前端截取前5条)
  // 如果想要更标准，应该后端写一个 /order/recent 接口，这里偷懒直接用 list
  request.get('/order/list').then(res => {
    if (res && res.length > 0) {
      recentOrders.value = res.slice(0, 5) // 只取前5条
    }
  })
})

const getTypeTag = (type) => {
  if (type === 'SCENIC') return 'success'
  if (type === 'HOTEL') return 'warning'
  return 'danger'
}

const getTypeLabel = (type) => {
  if (type === 'SCENIC') return '景点'
  if (type === 'HOTEL') return '民宿'
  if (type === 'FOOD') return '美食'
  return type
}
</script>

<style scoped>
.data-card {
  position: relative;
  height: 120px;
  border-radius: 8px;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.data-card:hover { transform: translateY(-5px); }
.card-title { font-size: 14px; opacity: 0.9; }
.card-num { font-size: 32px; font-weight: bold; margin-top: 10px; }
.card-icon { position: absolute; right: 20px; top: 20px; font-size: 40px; opacity: 0.2; }

/* 渐变配色 */
.card-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.card-2 { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); color: #fff; } /* 修正文字颜色 */
.card-3 { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
.card-4 { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: #fff; }

.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>