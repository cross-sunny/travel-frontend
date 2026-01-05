<template>
  <div style="padding: 40px 10%; background-color: #f5f7fa; min-height: 80vh;">
    <el-row :gutter="20">
      <!-- 左侧个人卡片 -->
      <el-col :span="6">
        <el-card style="text-align: center;">
          <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <h3>{{ user.nickname }}</h3>
          <p style="color: #888;">{{ user.username }}</p>
          <div style="margin-top: 20px; text-align: left; padding: 0 20px;">
            <p><el-icon><Phone /></el-icon> {{ user.phone || '未绑定' }}</p>
            <p><el-icon><Message /></el-icon> {{ user.email || '未绑定' }}</p>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧订单列表 -->
      <el-col :span="18">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>我的订单</span>
            </div>
          </template>

          <el-table :data="orders" stripe style="width: 100%">
            <el-table-column prop="id" label="订单号" width="100" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column label="类型" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.productType === 'SCENIC' ? 'success' : 'warning'">
                  {{ scope.row.productType === 'SCENIC' ? '景点' : '酒店' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="金额" width="100" />
            <el-table-column prop="createTime" label="预定时间" width="180">
              <template #default="scope">
                {{ scope.row.createTime ? scope.row.createTime.replace('T', ' ') : '' }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag effect="dark">{{ scope.row.status === 'PAID' ? '已支付' : '待支付' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const orders = ref([])

onMounted(() => {
  if(user.id) {
    request.get('/order/my', { params: { userId: user.id } }).then(res => {
      orders.value = res
    })
  }
})
</script>